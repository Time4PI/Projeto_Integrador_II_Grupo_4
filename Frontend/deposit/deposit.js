function showErrorMessage(message) {
    var mb = document.getElementById("messageBox");
    document.getElementById("message").innerHTML = message;
    mb.style.display = "block";
    mb.style.backgroundColor = "red";
}

function showSucessMessage(message) {
    var mb = document.getElementById("messageBox");
    document.getElementById("message").innerHTML = message;
    mb.style.display = "block";
    mb.style.backgroundColor = "green";
}

function hideErrorMessage() {
    var mb = document.getElementById("messageBox");
    mb.style.display = "none";
}

function isValidDeposit(value, cardNumber, cardName, cvc, expirationDate) {
    var valid = true;

    if (!value || value <= 0) {
        showErrorMessage("Digite um valor válido.");
        valid = false;
    }
    if (!cardNumber || cardNumber.length < 16) {
        showErrorMessage("Digite um número de cartão válido.");
        valid = false;
    }
    if (!cardName) {
        showErrorMessage("Digite o nome no cartão.");
        valid = false;
    }
    if (!cvc || cvc.length < 3) {
        showErrorMessage("Digite um código de segurança (CVC) válido.");
        valid = false;
    }
    if (!expirationDate || !/^(0[1-9]|1[0-2])\/\d{4}$/.test(expirationDate)) {
        showErrorMessage("Digite uma data de expiração válida (MM/AAAA).");
        valid = false;
    }

    return valid;
}

async function performDeposit() {
    const token = localStorage.getItem('authToken');
    var value = document.getElementById("value").value;
    var cardNumber = document.getElementById("cardNumber").value;
    var cardName = document.getElementById("cardName").value;
    var cvc = document.getElementById("cvc").value;
    var expirationDate = document.getElementById("expirationDate").value;

    if (isValidDeposit(value, cardNumber, cardName, cvc, expirationDate)) {
        if (expirationDate && /^(0[1-9]|1[0-2])\/\d{4}$/.test(expirationDate)) {
            const [month, year] = expirationDate.split('/');
            expirationDate = `${year}-${month}`;
        }
        try {
            const response = await fetch("http://localhost:3000/addFunds", {
                method: 'PUT',
                headers: {
                    'accountToken': token,
                    'value': value,
                    'cardNumber': cardNumber,
                    'cardName': cardName,
                    'CVC': cvc,
                    'expirationDate': expirationDate,
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                showErrorMessage(errorText);
                throw new Error(`Erro HTTP! Status: ${response.status}, Mensagem: ${errorText}`);
            }

            const resultText = await response.text();
            console.info(`Resposta: ${resultText}`);

            showSucessMessage("Depósito realizado com sucesso!");

            setTimeout(() => {
                window.location.href = "../home_page/";
            }, 2000);

        } catch (error) {
            console.error('Erro ao realizar depósito:', error);
        }
    }
}
