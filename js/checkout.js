export function setupCheckoutEvents() {
    const cepInput = document.getElementById("cep");
    const cepError = document.getElementById("cep-error");
    const cepSuccess = document.getElementById("cep-success");
    const logradouroInput = document.getElementById("logradouro");
    const bairroInput = document.getElementById("bairro");
    const cidadeInput = document.getElementById("cidade");
    const ufInput = document.getElementById("uf");
    const numeroInput = document.getElementById("numero");
    
    const requiredInputs = [logradouroInput, numeroInput, bairroInput, cidadeInput, ufInput];
    requiredInputs.forEach(input => {
        input.addEventListener('input', () => {
            input.style.border = "1px solid #ccc";
        });
    });

    const resetAddressFields = () => {
        logradouroInput.readOnly = false;
        bairroInput.readOnly = false;
        cidadeInput.readOnly = false;
        ufInput.readOnly = false;
        logradouroInput.value = '';
        bairroInput.value = '';
        cidadeInput.value = '';
        ufInput.value = '';
        cepError.textContent = '';
        cepSuccess.textContent = '';
    };

    const addressInputs = [logradouroInput, bairroInput, cidadeInput, ufInput];
    addressInputs.forEach(input => {
        input.addEventListener('input', () => {
            input.readOnly = false;
        });
    });

    cepInput.addEventListener('input', async (e) => {
        const cep = e.target.value.replace(/\D/g, '');
        cepInput.value = cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');

        if (cep.length < 8) {
            resetAddressFields();
            return;
        }

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
                } else {
                    cidadeInput.value = data.localidade;
                    ufInput.value = data.uf;
                    cepSuccess.textContent = 'Cidade e estado encontrados!';

                    logradouroInput.value = '';
                    bairroInput.value = '';
                    
                    logradouroInput.readOnly = false;
                    bairroInput.readOnly = false;
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
        }
    });
}

export function validateCheckoutForm() {
    const form = document.getElementById("checkout-form");
    const inputs = form.querySelectorAll("input[required]");
    let allFieldsValid = true;

    inputs.forEach(input => {
        if (input.id === "cep") {
            if (input.value.replace(/\D/g, '').length < 8) {
                allFieldsValid = false;
                input.style.border = "2px solid red";
            } else {
                input.style.border = "1px solid #ccc";
            }
        } else {
            if (!input.value.trim()) {
                allFieldsValid = false;
                input.style.border = "2px solid red";
            } else {
                input.style.border = "1px solid #ccc";
            }
        }
    });

    if (!allFieldsValid) {
        alert("Por favor, preencha todos os campos obrigatórios para finalizar a compra.");
    }

    return allFieldsValid;
}