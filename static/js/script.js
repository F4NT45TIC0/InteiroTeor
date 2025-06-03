document.addEventListener('DOMContentLoaded', function() {
    const tipoSelect = document.getElementById('tipo');
    const anoModeloSelect = document.getElementById('anoModelo');
    const escreventeSelect = document.getElementById('escrevente');
    const averbacoesSelect = document.getElementById('averbacoes');
    const documentText = document.getElementById('documentText');
    const copyButton = document.getElementById('copyButton');
    const imageUpload = document.getElementById('imageUpload');
    const processImageButton = document.getElementById('processImageButton');
    const ocrStatus = document.getElementById('ocrStatus');
    
    // Botões de formatação de texto
    const alignLeftBtn = document.getElementById('align-left');
    const alignCenterBtn = document.getElementById('align-center');
    const alignRightBtn = document.getElementById('align-right');
    const alignJustifyBtn = document.getElementById('align-justify');
    const aiCorrectButton = document.getElementById('aiCorrectButton');

    // Textos base para cada tipo e ano
    const textos = {
        nascimento: {
            '1946': 'Aos dias (Espaço para preenchimento) do mês de Mil novecentos e quarenta (Espaço para preenchimento) em cartório compareceu (Espaço para preenchimento) e, declarou que, no dia, nasceu uma criança do sexo , de cor , a qual foi dado o nome de , filho , de , Avós Paternos: e Maternos: . Nada mais declarou, do que para constar, faço este termo que lido e achado conforme vai assinado',
            '1947-1976': 'Em (Espaço para preenchimento) de (Espaço para preenchimento) de mil novecentos e (Espaço para preenchimento) nesta cidade de Presidente Prudente, em cartório compareceu (Espaço para preenchimento), e, perante as testemunhas adiante nomeadas e no fim assinadas, declarou que, no dia (Espaço para preenchimento), nasceu, (Espaço para preenchimento), do sexo (Espaço para preenchimento), cor (Espaço para preenchimento), filho legitimo (Espaço para preenchimento). São avós paternos: (Espaço para preenchimento) e maternos: (Espaço para preenchimento). Nada mais declarou. Lido e achado conforme assina (Espaço para preenchimento)',
            '1977-1984': 'Em (Espaço para preenchimento), de (Espaço para preenchimento) de mil novecentos e (Espaço para preenchimento), nesta cidade de Presidente Prudente, em cartório compareceu (Espaço para preenchimento), e, perante as testemunhas adiante nomeadas e no fim assinadas, declarou que (Espaço para preenchimento), nasceu (Espaço para preenchimento), do sexo (Espaço para preenchimento), filho de (Espaço para preenchimento). Estava a genitora, na ocasião deste parto com (Espaço para preenchimento), anos de idade, Completos. São avós paterno (Espaço para preenchimento) e maternos: (Espaço para preenchimento). Nada mais declarou. Lido e achado conforme assina (Espaço para preenchimento)'
        }
        // Add other types (casamento, obito) if needed
    };

    // Habilitar/desabilitar ano modelo baseado na seleção do tipo
    tipoSelect.addEventListener('change', function() {
        anoModeloSelect.disabled = !this.value;
        if (!ocrStatus.textContent.includes('Processando') && !ocrStatus.textContent.includes('Corrigindo')) {
             atualizarTexto();
        }
    });

    // Atualizar texto quando qualquer seleção mudar
    [anoModeloSelect, escreventeSelect, averbacoesSelect].forEach(select => {
        select.addEventListener('change', () => {
             if (!ocrStatus.textContent.includes('Processando') && !ocrStatus.textContent.includes('Corrigindo')) {
                 atualizarTexto();
             }
        });
    });

    function atualizarTexto() {
        const tipo = tipoSelect.value;
        const ano = anoModeloSelect.value;
        const escrevente = escreventeSelect.value;
        const averbacoes = parseInt(averbacoesSelect.value);

        ocrStatus.textContent = '';

        if (tipo && ano && escrevente && textos[tipo] && textos[tipo][ano]) {
            let texto = textos[tipo][ano];
            texto += ` ${escreventeSelect.options[escreventeSelect.selectedIndex].text}. (Assinaturas)`;

            if (averbacoes > 0) {
                const numerais = ['I', 'II', 'III'];
                texto += ` À margem do texto consta: ${numerais.slice(0, averbacoes).join(', ')}.`;
            }
            documentText.value = texto;
            
            // Manter o alinhamento atual ao atualizar o texto
            aplicarAlinhamentoAtual();
        } else {
             documentText.value = '';
        }
    }

    // Função para aplicar o alinhamento atual ao texto
    function aplicarAlinhamentoAtual() {
        // Encontrar o botão de alinhamento ativo
        const botaoAtivo = document.querySelector('.formatting-group .format-btn.active');
        if (botaoAtivo) {
            // Aplicar o alinhamento correspondente
            aplicarAlinhamento(botaoAtivo.id);
        }
    }

    // Função para aplicar alinhamento ao texto
    function aplicarAlinhamento(alinhamentoId) {
        // Remover todas as classes de alinhamento existentes
        documentText.classList.remove('text-left', 'text-center', 'text-right', 'text-justify');
        
        // Adicionar a classe de alinhamento correspondente
        switch (alinhamentoId) {
            case 'align-left':
                documentText.classList.add('text-left');
                break;
            case 'align-center':
                documentText.classList.add('text-center');
                break;
            case 'align-right':
                documentText.classList.add('text-right');
                break;
            case 'align-justify':
                documentText.classList.add('text-justify');
                break;
        }
    }

    // Configurar os botões de alinhamento
    function configurarBotoesAlinhamento() {
        const botoesAlinhamento = [alignLeftBtn, alignCenterBtn, alignRightBtn, alignJustifyBtn];
        
        botoesAlinhamento.forEach(botao => {
            botao.addEventListener('click', function() {
                // Remover a classe 'active' de todos os botões
                botoesAlinhamento.forEach(b => b.classList.remove('active'));
                
                // Adicionar a classe 'active' ao botão clicado
                this.classList.add('active');
                
                // Aplicar o alinhamento correspondente
                aplicarAlinhamento(this.id);
            });
        });
    }

    // Inicializar os botões de alinhamento
    configurarBotoesAlinhamento();

    // Botão de correção com IA
    aiCorrectButton.addEventListener('click', async function() {
        if (!documentText.value.trim()) {
            alert('Por favor, insira algum texto para corrigir.');
            return;
        }

        ocrStatus.textContent = 'Corrigindo texto com IA...';
        aiCorrectButton.disabled = true;

        try {
            const response = await fetch('/correct-text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: documentText.value })
            });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || 'Erro ao processar o texto');
            }

            documentText.value = result.corrected_text;
            ocrStatus.textContent = 'Texto corrigido com sucesso!';
            
            // Manter o alinhamento atual após a correção
            aplicarAlinhamentoAtual();
            
            // Após 3 segundos, limpar a mensagem de status
            setTimeout(() => {
                ocrStatus.textContent = '';
            }, 3000);
        } catch (error) {
            console.error('Erro:', error);
            ocrStatus.textContent = `Erro: ${error.message}`;
        } finally {
            aiCorrectButton.disabled = false;
        }
    });

    copyButton.addEventListener('click', function() {
        documentText.select();
        try {
            document.execCommand('copy');
            alert('Texto copiado para a área de transferência!');
        } catch (err) {
            alert('Erro ao copiar texto. Por favor, copie manualmente.');
            console.error('Erro ao copiar:', err);
        }
    });

    documentText.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const cursorPos = this.selectionStart;
            const texto = this.value;
            const proximoEspaco = texto.indexOf('(Espaço para preenchimento)', cursorPos);
            
            if (proximoEspaco !== -1) {
                this.setSelectionRange(proximoEspaco, proximoEspaco + '(Espaço para preenchimento)'.length);
            } else {
                this.setSelectionRange(texto.length, texto.length);
            }
        }
    });

    processImageButton.addEventListener('click', async function() {
        const file = imageUpload.files[0];
        if (!file) {
            alert('Por favor, selecione uma imagem primeiro.');
            return;
        }

        ocrStatus.textContent = 'Processando imagem...';
        documentText.value = '';
        processImageButton.disabled = true;

        try {
            const formData = new FormData();
            formData.append('image', file);

            // Call our backend API for OCR processing
            const response = await fetch('/process-image', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || 'Erro ao processar a imagem');
            }

            documentText.value = result.text;
            ocrStatus.textContent = 'Processamento concluído com sucesso!';
            
            // Aplicar alinhamento padrão (esquerda) ao texto processado
            alignLeftBtn.click();
            
            // After 3 seconds, clear the status message
            setTimeout(() => {
                ocrStatus.textContent = '';
            }, 3000);
        } catch (error) {
            console.error('Erro:', error);
            ocrStatus.textContent = `Erro: ${error.message}`;
            documentText.value = '';
        } finally {
            processImageButton.disabled = false;
        }
    });

    imageUpload.addEventListener('change', function() {
        ocrStatus.textContent = '';
        if (this.files.length > 0) {
             ocrStatus.textContent = 'Imagem selecionada. Clique em "Processar Imagem".';
        }
    });

    // Aplicar alinhamento padrão (esquerda) ao carregar a página
    alignLeftBtn.click();
});
