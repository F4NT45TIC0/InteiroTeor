from flask import Flask, request, jsonify
import logging
import os
import requests
import json
from dotenv import load_dotenv

# Carregar variáveis de ambiente do arquivo .env
load_dotenv()

app = Flask(__name__)

# Configurar logging
logging.basicConfig(level=logging.INFO)

# Chave da API OpenAI (ou outro serviço de IA)
AI_API_KEY = os.getenv('AI_API_KEY', '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')
AI_API_URL = os.getenv('AI_API_URL', 'https://api.openai.com/v1/chat/completions')

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
                        "warning": "Serviço de IA não configurado. Configure a chave API_KEY no arquivo .env"})

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

# Rota para verificar o status da API
@app.route("/api/status", methods=["GET"])
def api_status():
    ai_configured = bool(AI_API_KEY)
    return jsonify({
        "status": "online",
        "ai_service_configured": ai_configured
    })

if __name__ == "__main__":
    app.run(debug=True)
