from flask import Flask, request, jsonify, send_from_directory
import logging
import os
import requests
import json
from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from azure.cognitiveservices.vision.computervision.models import OperationStatusCodes
from msrest.authentication import CognitiveServicesCredentials
from PIL import Image
import io
import time
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configuração explícita do diretório static para garantir que os arquivos CSS e JS sejam servidos corretamente
app = Flask(__name__, 
            static_folder='static',  # Define explicitamente a pasta static
            static_url_path='/static')  # Define explicitamente o URL path para arquivos estáticos

# Configure logging
logging.basicConfig(level=logging.INFO)

# Set up Azure Computer Vision client
VISION_KEY = os.getenv('AZURE_VISION_KEY')
VISION_ENDPOINT = os.getenv('AZURE_VISION_ENDPOINT')

# Chave da API OpenAI (ou outro serviço de IA)
AI_API_KEY = os.getenv('AI_API_KEY')
AI_API_URL = os.getenv('AI_API_URL', 'https://api.openai.com/v1/chat/completions')

if not VISION_KEY or not VISION_ENDPOINT:
    logging.error("Azure Computer Vision credentials not found. Make sure AZURE_VISION_KEY and AZURE_VISION_ENDPOINT are set in .env file")
    vision_client = None
else:
    vision_client = ComputerVisionClient(
        VISION_ENDPOINT,
        CognitiveServicesCredentials(VISION_KEY)
    )

@app.route("/correct-text", methods=["POST"])
def correct_text():
    data = request.get_json()
    if not data or "text" not in data:
        return jsonify({"error": "Nenhum texto fornecido no pedido."}), 400

    original_text = data["text"]
    logging.info(f"Recebido texto para correção: {original_text[:100]}...") # Log primeiros 100 caracteres

    # Verificar se a chave da API está configurada
    if not AI_API_KEY:
        logging.warning("Chave da API de IA não configurada. Retornando texto original.")
        return jsonify({"corrected_text": original_text, 
                        "warning": "Serviço de IA não configurado. Configure a chave AI_API_KEY no arquivo .env"})

    try:
        # Preparar o prompt para a API de IA
        prompt = f"""
        Por favor, corrija o seguinte texto de documento cartorial, melhorando a gramática, 
        pontuação e formatação, mantendo o estilo formal e todas as informações originais:

        {original_text}
        """

        # Configurar a requisição para a API de IA (exemplo com OpenAI)
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {AI_API_KEY}"
        }
        
        payload = {
            "model": "gpt-3.5-turbo",
            "messages": [
                {"role": "system", "content": "Você é um assistente especializado em documentos cartoriais brasileiros, com conhecimento em gramática, pontuação e formatação de textos formais."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.3,
            "max_tokens": 1000
        }

        # Fazer a requisição para a API de IA
        response = requests.post(AI_API_URL, headers=headers, json=payload)
        response_data = response.json()

        # Verificar se a resposta foi bem-sucedida
        if response.status_code == 200 and "choices" in response_data:
            corrected_text = response_data["choices"][0]["message"]["content"].strip()
            logging.info(f"Texto corrigido com sucesso. Primeiros 100 caracteres: {corrected_text[:100]}...")
            return jsonify({"corrected_text": corrected_text})
        else:
            logging.error(f"Erro na resposta da API de IA: {response_data}")
            return jsonify({"error": "Erro ao processar o texto com IA", "details": response_data}), 500

    except Exception as e:
        logging.error(f"Erro ao processar o texto: {e}")
        return jsonify({"error": f"Erro interno do servidor ao processar o texto: {e}"}), 500

@app.route("/process-image", methods=["POST"])
def process_image():
    if not vision_client:
        return jsonify({"error": "Azure Computer Vision não está configurado no servidor."}), 500

    if 'image' not in request.files:
        return jsonify({"error": "Nenhuma imagem fornecida."}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "Nenhum arquivo selecionado."}), 400

    try:
        # Read the image file
        image_content = file.read()
        
        # Call Azure's OCR
        async_vision_response = vision_client.read_in_stream(
            io.BytesIO(image_content),
            raw=True
        )

        # Get the async operation ID
        operation_location = async_vision_response.headers["Operation-Location"]
        operation_id = operation_location.split("/")[-1]

        # Wait for the OCR to complete
        while True:
            get_text_status = vision_client.get_read_result(operation_id)
            if get_text_status.status not in ['notStarted', 'running']:
                break
            time.sleep(1)

        # Extract the text results
        if get_text_status.status == OperationStatusCodes.succeeded:
            text_results = []
            for text_result in get_text_status.analyze_result.read_results:
                for line in text_result.lines:
                    text_results.append(line.text)
            
            extracted_text = "\n".join(text_results)
            logging.info(f"OCR completado com sucesso. Primeiros 100 caracteres: {extracted_text[:100]}...")
            
            return jsonify({"text": extracted_text})
        else:
            error_msg = f"OCR falhou com status: {get_text_status.status}"
            logging.error(error_msg)
            return jsonify({"error": error_msg}), 500

    except Exception as e:
        error_msg = f"Erro ao processar a imagem: {str(e)}"
        logging.error(error_msg)
        return jsonify({"error": error_msg}), 500

# Rota para verificar o status da API
@app.route("/api/status", methods=["GET"])
def api_status():
    ai_configured = bool(AI_API_KEY)
    vision_configured = bool(vision_client)
    return jsonify({
        "status": "online",
        "ai_service_configured": ai_configured,
        "vision_service_configured": vision_configured
    })

# Endpoint to serve the main HTML file
@app.route("/")
def index():
    return app.send_static_file("index.html")

# Rota adicional para garantir que arquivos estáticos sejam servidos corretamente
@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

if __name__ == "__main__":
    app.run(debug=True)
