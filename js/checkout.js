export function setupCheckoutEvents() {
    const cepInput = document.getElementById("cep");
    const cepError = document.getElementById("cep-error");
    const cepSuccess = document.getElementById("cep-success");
    const logradouroInput = document.getElementById("logradouro");
    const bairroInput = document.getElementById("bairro");
    const cidadeInput = document.getElementById("cidade");
    const ufInput = document.getElementById("uf");
    const numeroInput = document.getElementById("numero");
    
    cepInput.addEventListener('input', async (e) => {
        const cep = e.target.value.replace(/\D/g, '');
        cepInput.value = cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');

        if (cep.length === 8) {
            cepError.textContent = '';
            cepSuccess.textContent = 'Buscando endereço...';
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();

                if (data.erro) {
                    cepError.textContent = 'CEP não encontrado. Preencha manualmente.';
                    cepSuccess.textContent = '';
                    logradouroInput.readOnly = false;
                    bairroInput.readOnly = false;
                    cidadeInput.readOnly = false;
                    ufInput.readOnly = false;
                    logradouroInput.value = '';
                    bairroInput.value = '';
                    cidadeInput.value = '';
                    ufInput.value = '';
                } else {
                    logradouroInput.value = data.logradouro;
                    bairroInput.value = data.bairro;
                    cidadeInput.value = data.localidade;
                    ufInput.value = data.uf;
                    cepSuccess.textContent = 'Endereço encontrado!';
                    logradouroInput.readOnly = true;
                    bairroInput.readOnly = true;
                    cidadeInput.readOnly = true;
                    ufInput.readOnly = true;
                    numeroInput.focus();
                }
            } catch (error) {
                cepError.textContent = 'Falha ao buscar CEP. Verifique sua conexão e preencha manualmente.';
                cepSuccess.textContent = '';
                logradouroInput.readOnly = false;
                bairroInput.readOnly = false;
                cidadeInput.readOnly = false;
                ufInput.readOnly = false;
            }
        } else {
            cepError.textContent = '';
            cepSuccess.textContent = '';
            logradouroInput.readOnly = false;
            bairroInput.readOnly = false;
            cidadeInput.readOnly = false;
            ufInput.readOnly = false;
        }
    });
}