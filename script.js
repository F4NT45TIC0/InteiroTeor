document.addEventListener('DOMContentLoaded', function() {
    const tipoSelect = document.getElementById('tipo');
    const anoModeloSelect = document.getElementById('anoModelo');
    const escreventeSelect = document.getElementById('escrevente');
    const averbacoesSelect = document.getElementById('averbacoes');
    const documentText = document.getElementById('documentText');
    const copyButton = document.getElementById('copyButton');

    // Textos base para cada tipo e ano
    const textos = {
        nascimento: {
            '1946': 'Aos dias (Espaço para preenchimento) do mês de Mil novecentos e quarenta (Espaço para preenchimento) em cartório compareceu (Espaço para preenchimento) e, declarou que, no dia, nasceu uma criança do sexo , de cor , a qual foi dado o nome de , filho , de , Avós Paternos: e Maternos: . Nada mais declarou, do que para constar, faço este termo que lido e achado conforme vai assinado',
            '1947-1976': 'Em (Espaço para preenchimento) de (Espaço para preenchimento) de mil novecentos e (Espaço para preenchimento) nesta cidade de Presidente Prudente, em cartório compareceu (Espaço para preenchimento), e, perante as testemunhas adiante nomeadas e no fim assinadas, declarou que, no dia (Espaço para preenchimento), nasceu, (Espaço para preenchimento), do sexo (Espaço para preenchimento), cor (Espaço para preenchimento), filho legitimo (Espaço para preenchimento). São avós paternos: (Espaço para preenchimento) e maternos: (Espaço para preenchimento). Nada mais declarou. Lido e achado conforme assina (Espaço para preenchimento)',
            '1977-1984': 'Em (Espaço para preenchimento), de (Espaço para preenchimento) de mil novecentos e (Espaço para preenchimento), nesta cidade de Presidente Prudente, em cartório compareceu (Espaço para preenchimento), e, perante as testemunhas adiante nomeadas e no fim assinadas, declarou que (Espaço para preenchimento), nasceu (Espaço para preenchimento), do sexo (Espaço para preenchimento), filho de (Espaço para preenchimento). Estava a genitora, na ocasião deste parto com (Espaço para preenchimento), anos de idade, Completos. São avós paterno (Espaço para preenchimento) e maternos: (Espaço para preenchimento). Nada mais declarou. Lido e achado conforme assina (Espaço para preenchimento)'
        }
    };

    // Habilitar/desabilitar ano modelo baseado na seleção do tipo
    tipoSelect.addEventListener('change', function() {
        anoModeloSelect.disabled = !this.value;
        atualizarTexto();
    });

    // Atualizar texto quando qualquer seleção mudar
    [anoModeloSelect, escreventeSelect, averbacoesSelect].forEach(select => {
        select.addEventListener('change', atualizarTexto);
    });

    function atualizarTexto() {
        const tipo = tipoSelect.value;
        const ano = anoModeloSelect.value;
        const escrevente = escreventeSelect.value;
        const averbacoes = parseInt(averbacoesSelect.value);

        if (tipo && ano && escrevente) {
            let texto = textos[tipo][ano];
            texto += ` ${escreventeSelect.options[escreventeSelect.selectedIndex].text}. (Assinaturas)`;

            if (averbacoes > 0) {
                const numerais = ['I', 'II', 'III'];
                texto += ` À margem do texto consta: ${numerais.slice(0, averbacoes).join(', ')}.`;
            }

            documentText.value = texto;
        }
    }

    // Funcionalidade de copiar para clipboard
    copyButton.addEventListener('click', function() {
        documentText.select();
        document.execCommand('copy');
        alert('Texto copiado para a área de transferência!');
    });

    // Funcionalidade de navegação com Enter
    documentText.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const cursorPos = this.selectionStart;
            const texto = this.value;
            const proximoEspaco = texto.indexOf('(Espaço para preenchimento)', cursorPos);
            
            if (proximoEspaco !== -1) {
                this.setSelectionRange(proximoEspaco, proximoEspaco + '(Espaço para preenchimento)'.length);
            }
        }
    });
});
