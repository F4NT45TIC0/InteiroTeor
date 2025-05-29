from flask import Flask, request, jsonify
import logging
import os
from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from azure.cognitiveservices.vision.computervision.models import OperationStatusCodes
from msrest.authentication import CognitiveServicesCredentials
from PIL import Image
import io
import time
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)

# Set up Azure Computer Vision client
VISION_KEY = os.getenv('AZURE_VISION_KEY')
VISION_ENDPOINT = os.getenv('AZURE_VISION_ENDPOINT')

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
    logging.info(f"Recebido texto: {original_text[:100]}...") # Log first 100 chars

    try:
        # Como removemos a integração com IA, simplesmente retornamos o texto original
        logging.info(f"Retornando texto sem processamento de IA")
        return jsonify({"corrected_text": original_text})

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

# Endpoint to serve the main HTML file (optional, but good practice)
@app.route("/")
def index():
    # This assumes your Flask app is running from the InteiroTeor-main directory
    return app.send_static_file("index.html")

if __name__ == "__main__":
    app.run()
