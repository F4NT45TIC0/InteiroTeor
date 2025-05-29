# Sistema Cartório 2025 - Inteiro Teor com OCR e Correção IA

## Visão Geral

Este sistema é uma versão aprimorada da ferramenta "Inteiro Teor" para cartórios. Ele permite:

1.  **Gerar texto base:** Selecionar tipo de documento, ano modelo, escrevente e número de averbações para gerar um texto padrão.
2.  **Processar Imagens:** Carregar uma imagem de um documento (ex: certidão antiga, documento manuscrito) e extrair o texto usando o Azure Computer Vision OCR, que oferece alta precisão no reconhecimento de texto em português.
3.  **Copiar Texto:** Copiar facilmente o texto final para a área de transferência.

O sistema utiliza Tesseract.js para OCR no navegador e um pequeno servidor backend em Python (Flask) para interagir de forma segura com a API da OpenAI.

## Ficheiros Incluídos

*   `index.html`: A interface principal do utilizador (frontend).
*   `styles.css`: Folha de estilos para a interface.
*   `script.js`: Lógica do frontend, incluindo a geração de texto base, controlo de upload, chamada OCR (Tesseract.js) e comunicação com o backend.
*   `app.py`: O servidor backend (Flask) que recebe o texto do frontend e chama a API da OpenAI para correção.
*   `requirements.txt`: Lista de dependências Python para o backend (Flask, OpenAI).
*   `README.md`: Este ficheiro de instruções.

## Pré-requisitos

*   **Python 3:** Necessário para executar o servidor backend. Pode descarregar em [python.org](https://www.python.org/). Verifique se o `pip` (gestor de pacotes Python) está incluído na instalação.
*   **Navegador Web Moderno:** (Chrome, Firefox, Edge, Safari) para aceder à interface.
*   **Chave da API OpenAI:** É **essencial** ter uma chave da API da OpenAI (associada à sua conta paga do ChatGPT) para usar a funcionalidade de correção por IA.
*   **Conta no Azure:** Necessária para usar o recurso de OCR do Azure Computer Vision.

## Configuração do Azure Computer Vision

Para usar o recurso de OCR, você precisa configurar o Azure Computer Vision:

1. Crie uma conta no [Azure Portal](https://portal.azure.com)
2. Crie um recurso do Computer Vision
3. Copie a chave e o endpoint do seu recurso
4. Copie o arquivo `.env.example` para `.env`
5. Preencha as variáveis no arquivo `.env`:
   ```
   AZURE_VISION_KEY=sua_chave_aqui
   AZURE_VISION_ENDPOINT=seu_endpoint_aqui
   ```

## Instalação

1.  **Descompacte os ficheiros:** Coloque todos os ficheiros do projeto numa pasta no seu computador.
2.  **Instale as dependências Python:**
    *   Abra um terminal ou linha de comandos.
    *   Navegue até à pasta onde descompactou os ficheiros.
    *   Execute o comando: `pip install -r requirements.txt`

## Configuração Essencial: Chave da API OpenAI

**IMPORTANTE:** Por razões de segurança, a sua chave da API OpenAI **NÃO** deve ser colocada diretamente no código (`app.py`). Em vez disso, deve ser configurada como uma variável de ambiente no sistema onde o servidor backend (`app.py`) será executado.

**Como definir a variável de ambiente `OPENAI_API_KEY`:**

*   **Linux / macOS:**
    ```bash
    export OPENAI_API_KEY=\'sua-chave-api-aqui\'
    ```
    (Execute este comando no mesmo terminal *antes* de iniciar o servidor. Para tornar permanente, adicione-o ao seu ficheiro de perfil, como `.bashrc` ou `.zshrc`).

*   **Windows (Command Prompt):**
    ```cmd
    set OPENAI_API_KEY=sua-chave-api-aqui
    ```
    (Execute este comando na mesma janela do Command Prompt *antes* de iniciar o servidor. A variável só existirá nessa sessão).

*   **Windows (PowerShell):**
    ```powershell
    $env:OPENAI_API_KEY=\'sua-chave-api-aqui\'
    ```
    (Execute este comando na mesma janela do PowerShell *antes* de iniciar o servidor. A variável só existirá nessa sessão).

**Substitua `sua-chave-api-aqui` pela sua chave real da API OpenAI.** Se a chave não for definida corretamente, a funcionalidade de correção por IA não funcionará e verá um aviso nos logs do servidor.

## Execução

1.  **Inicie o Servidor Backend:**
    *   Abra um terminal ou linha de comandos (certifique-se que a variável `OPENAI_API_KEY` está definida nessa sessão, conforme o passo anterior).
    *   Navegue até à pasta do projeto.
    *   Execute o comando: `python app.py`
    *   O servidor começará a correr. Deverá ver algo como `* Running on http://127.0.0.1:5000` ou `* Running on http://0.0.0.0:5000`.

2.  **Aceda à Aplicação:**
    *   Abra o seu navegador web.
    *   Aceda ao endereço `http://127.0.0.1:5000` (ou `http://localhost:5000`).
    *   A interface do sistema deverá carregar.

**Nota:** Mantenha a janela do terminal onde executou `python app.py` aberta enquanto utiliza a aplicação, pois é ela que mantém o servidor backend a funcionar.

## Utilização

1.  **Gerar Texto Base:** Use os menus dropdown (`Tipo`, `Ano modelo`, `Escrevente`, `Averbações`) para gerar o texto padrão na área de texto principal.
2.  **Processar Imagem:**
    *   Clique no botão "Escolher ficheiro" (ou similar) ao lado de "Carregar Imagem do Documento".
    *   Selecione um ficheiro de imagem (JPG, PNG, etc.) do seu computador.
    *   Clique no botão "Processar Imagem".
    *   Aguarde enquanto o OCR é executado (verá o estado em "Estado OCR:").
    *   Após o OCR, o texto extraído será enviado para o backend para correção pela IA (verá o estado "A enviar para correção IA...").
    *   O texto final corrigido pela IA será exibido na área de texto principal.
3.  **Copiar Texto:** Clique no botão "Copiar Texto" para copiar o conteúdo da área de texto para a sua área de transferência.

## Sobre a Correção por IA (ChatGPT)

O sistema utiliza o modelo `gpt-4o` (pode ser alterado em `app.py` se necessário) com um *prompt* específico desenhado para:

*   Focar na correção de erros de OCR (letras trocadas, palavras juntas/separadas).
*   Preservar ao máximo a estrutura, palavras e significado originais do documento.
*   Evitar adicionar ou remover informação.
*   Ser conservador em caso de dúvida, mantendo o texto do OCR se a correção não for clara.

Isto visa garantir a fidelidade ao documento original, mesmo que o texto extraído pelo OCR contenha erros significativos.

## Resolução de Problemas

*   **Correção IA Falha / Erro 500:**
    *   Verifique se o servidor backend (`app.py`) está a correr.
    *   Confirme que a variável de ambiente `OPENAI_API_KEY` foi definida **corretamente** com uma chave válida *antes* de iniciar o servidor.
    *   Verifique os logs no terminal onde o servidor está a correr para mensagens de erro detalhadas.
    *   Verifique a sua ligação à internet e o estado da API da OpenAI.
*   **OCR Falha / Texto Incorreto:**
    *   A qualidade do OCR depende muito da qualidade da imagem original (resolução, contraste, clareza da escrita).
    *   Tente usar imagens com melhor qualidade, se possível.
    *   O Tesseract.js pode ter dificuldades com caligrafia muito complexa ou layouts não standard.
    *   O texto exibido após a falha da IA é o resultado direto do OCR.
*   **Aplicação não carrega:**
    *   Verifique se o servidor backend (`app.py`) está a correr.
    *   Certifique-se que está a aceder ao endereço correto no navegador (`http://127.0.0.1:5000`).

Esperamos que este sistema seja útil!

