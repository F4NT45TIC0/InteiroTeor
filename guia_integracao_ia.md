# Guia de Integração com IA - Sistema Cartório 2025

## Índice
1. [Introdução](#introdução)
2. [Requisitos](#requisitos)
3. [Configuração da API de IA](#configuração-da-api-de-ia)
   - [Obtenção da Chave API](#obtenção-da-chave-api)
   - [Configuração do Arquivo .env](#configuração-do-arquivo-env)
4. [Como Funciona a Integração](#como-funciona-a-integração)
5. [Personalização do Comportamento da IA](#personalização-do-comportamento-da-ia)
6. [Solução de Problemas](#solução-de-problemas)
7. [Considerações sobre Custos](#considerações-sobre-custos)

## Introdução

Este guia detalha o processo de integração do Sistema Cartório 2025 com serviços de Inteligência Artificial para correção e formatação de textos. A implementação utiliza a API da OpenAI, especificamente o modelo GPT, para analisar e melhorar os textos dos documentos cartoriais.

## Requisitos

Para utilizar a funcionalidade de IA no sistema, você precisará de:

1. Uma conta na OpenAI (https://openai.com)
2. Uma chave de API válida da OpenAI
3. Acesso ao arquivo de configuração do sistema (.env)
4. Conexão com a internet no servidor onde o sistema está hospedado

## Configuração da API de IA

### Obtenção da Chave API

1. **Criar uma conta na OpenAI**:
   - Acesse https://openai.com
   - Clique em "Sign up" e siga as instruções para criar uma conta
   - Se já possuir uma conta, faça login

2. **Gerar uma chave de API**:
   - Após fazer login, acesse https://platform.openai.com/api-keys
   - Clique em "Create new secret key"
   - Dê um nome à sua chave (ex: "Sistema Cartório")
   - Copie a chave gerada (importante: ela só será mostrada uma vez)

### Configuração do Arquivo .env

1. **Localizar o arquivo .env.example**:
   - No diretório raiz do projeto, você encontrará um arquivo chamado `.env.example`
   - Faça uma cópia deste arquivo e renomeie para `.env`

2. **Editar o arquivo .env**:
   - Abra o arquivo `.env` em um editor de texto
   - Localize a linha `AI_API_KEY=sua_chave_openai_aqui`
   - Substitua `sua_chave_openai_aqui` pela chave que você copiou da OpenAI
   - Salve o arquivo

Exemplo de configuração:
```
# Configurações da API de Visão Computacional Azure
AZURE_VISION_KEY=sua_chave_azure_aqui
AZURE_VISION_ENDPOINT=seu_endpoint_azure_aqui

# Configurações da API de IA para correção de texto
AI_API_KEY=sk-abcdefghijklmnopqrstuvwxyz123456789
AI_API_URL=https://api.openai.com/v1/chat/completions
```

## Como Funciona a Integração

Quando o botão "Corrigir com IA" é clicado na interface do sistema:

1. O texto atual na área de edição é enviado para o servidor
2. O servidor prepara uma requisição para a API da OpenAI com o texto
3. A API processa o texto, corrigindo erros gramaticais, pontuação e formatação
4. O texto corrigido é retornado ao sistema e exibido na área de edição
5. O alinhamento de texto selecionado é preservado após a correção

O processo utiliza o modelo GPT-3.5-Turbo da OpenAI, configurado especificamente para entender e preservar o contexto formal de documentos cartoriais brasileiros.

## Personalização do Comportamento da IA

Você pode personalizar como a IA processa os textos editando o arquivo `api/index.py`:

1. **Modificar o prompt**:
   - Localize a seção que define o prompt enviado à API
   - Edite as instruções para atender às suas necessidades específicas

```python
# Exemplo de personalização do prompt
prompt = f"""
Por favor, corrija o seguinte texto de documento cartorial, 
melhorando a gramática, pontuação e formatação, 
mantendo o estilo formal e todas as informações originais.
Preserve termos técnicos cartoriais e formatação de datas.

{original_text}
"""
```

2. **Ajustar parâmetros da API**:
   - Você pode modificar parâmetros como `temperature` para controlar a criatividade da IA
   - Valores mais baixos (ex: 0.2) resultam em respostas mais conservadoras
   - Valores mais altos (ex: 0.8) permitem mais variação nas correções

```python
# Exemplo de ajuste de parâmetros
payload = {
    "model": "gpt-3.5-turbo",
    "messages": [
        {"role": "system", "content": "Você é um assistente especializado em documentos cartoriais brasileiros..."},
        {"role": "user", "content": prompt}
    ],
    "temperature": 0.3,  # Ajuste este valor conforme necessário
    "max_tokens": 1000
}
```

## Solução de Problemas

### A correção com IA não está funcionando

1. **Verifique a chave API**:
   - Confirme se a chave foi corretamente inserida no arquivo `.env`
   - Verifique se a chave ainda é válida na sua conta da OpenAI

2. **Verifique a conexão com a internet**:
   - O servidor precisa de acesso à internet para se comunicar com a API da OpenAI

3. **Verifique os logs do servidor**:
   - Os erros detalhados são registrados nos logs do servidor
   - Procure por mensagens de erro relacionadas à API da OpenAI

4. **Teste o endpoint manualmente**:
   - Use uma ferramenta como Postman para testar o endpoint `/correct-text`
   - Verifique se a resposta contém informações de erro úteis

### Mensagem "Serviço de IA não configurado"

Esta mensagem aparece quando:
- O arquivo `.env` não existe
- A variável `AI_API_KEY` não está definida no arquivo `.env`
- A chave API está em formato inválido

Solução: Verifique o arquivo `.env` e certifique-se de que a chave API está corretamente configurada.

## Considerações sobre Custos

A API da OpenAI é um serviço pago baseado no uso. Alguns pontos importantes:

1. **Modelo de preços**:
   - A OpenAI cobra por token (aproximadamente 4 caracteres)
   - O modelo GPT-3.5-Turbo tem um custo relativamente baixo
   - Consulte os preços atuais em: https://openai.com/pricing

2. **Controle de custos**:
   - A implementação atual limita o tamanho do texto enviado
   - Você pode definir limites de uso na plataforma da OpenAI
   - Monitore regularmente o uso na dashboard da OpenAI

3. **Alternativas gratuitas**:
   - Se os custos forem uma preocupação, considere implementar soluções locais
   - Bibliotecas como spaCy ou NLTK podem oferecer correções básicas sem custos de API
   - No entanto, a qualidade das correções pode ser inferior à da OpenAI

---

Para qualquer dúvida adicional ou suporte na integração, entre em contato com a equipe de desenvolvimento.
