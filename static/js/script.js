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
        } else {
             documentText.value = '';
        }
    }

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

});
