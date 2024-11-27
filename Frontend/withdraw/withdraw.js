// Alterna a visibilidade dos campos com base no método de saque selecionado
function toggleFields() {
    const withdrawMethod = document.getElementById("withdrawMethod").value;
    const pixFields = document.getElementById("pixFields");
    const bankFields = document.getElementById("bankFields");

    if (withdrawMethod === "pix") {
        pixFields.classList.remove("hidden");
        bankFields.classList.add("hidden");
    } else if (withdrawMethod === "bankAccount") {
        pixFields.classList.add("hidden");
        bankFields.classList.remove("hidden");
    } else {
        pixFields.classList.add("hidden");
        bankFields.classList.add("hidden");
    }
}

// Exibe uma mensagem de erro
function showErrorMessage(message) {
    var mb = document.getElementById("messageBox");
    document.getElementById("message").innerHTML = message;
    mb.style.display = "block";
    mb.style.backgroundColor = "red";
}

// Exibe uma mensagem de sucesso
function showSucessMessage(message) {
    var mb = document.getElementById("messageBox");
    document.getElementById("message").innerHTML = message;
    mb.style.display = "block";
    mb.style.backgroundColor = "green";
}

// Oculta a mensagem de erro
function hideErrorMessage() {
    var mb = document.getElementById("messageBox");
    mb.style.display = "none";
}


async function performWithdraw() {
    const token = localStorage.getItem('authToken');
    const withdrawMethod = document.getElementById("withdrawMethod").value;
    const value = document.getElementById("value").value.trim();

    if (!value) {
        showErrorMessage("Digite um valor válido.");
        return;
    }

    let headers = {
        'accountToken': token,
        'value': value
    };

    if (withdrawMethod === "pix") {
        const pixKey = document.getElementById("pixKey").value.trim();
        if (!pixKey) {
            showErrorMessage("Digite uma chave PIX válida.");
            return;
        }
        headers['pixKey'] = pixKey;
    } else if (withdrawMethod === "bankAccount") {
        const accountNumber = document.getElementById("accountNumber").value.trim();
        const bankNumber = document.getElementById("bankNumber").value.trim();
        const agencyNumber = document.getElementById("agencyNumber").value.trim();

        if (!accountNumber || !bankNumber || !agencyNumber) {
            showErrorMessage("Digite os dados bancários.");
            return;
        }

        headers['bankAccountNumber'] = accountNumber;
        headers['BankNumber'] = bankNumber;
        headers['agencyNumber'] = agencyNumber;
    } else {
        showErrorMessage("Escola um método de saque.");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/withdrawFunds", {
            method: 'PUT',
            headers: headers
        });

        if (!response.ok) {
            const errorText = await response.text();
            showErrorMessage(errorText);
            throw new Error(`Erro HTTP! Status: ${response.status}, Mensagem: ${errorText}`);
        }

        showSucessMessage("Saque realizado com sucesso!")

        setTimeout(() => {
            window.location.href = "../home_page/";
        }, 2000);
        
        // Redirect or other success actions here
    } catch (error) {
        console.error('Erro ao realizar saque:', error);
    }
}


// Função para calcular e exibir a taxa com base no valor inserido
function updateMessage() {
    const value = parseFloat(document.getElementById('value').value);
    let message = '';
    let fee = 0;

    if (isNaN(value) || value === '') {
        document.getElementById('messageTaxa').textContent = ''; 
        return; // Sai da função, não faz o cálculo
    }
    
    // Verifica as faixas de valor e aplica a taxa
    if (value <= 100) {
        fee = value * 0.04;
    } else if (value <= 1000) {
        fee = value * 0.03;
    } else if (value <= 5000) {
        fee = value * 0.02;
    } else if (value <= 100000) {
        fee = value * 0.01;
    }

    // Se o valor for acima de 100.000, a taxa é 0
    if (value > 100000) {
        fee = 0;
    }

    // Mensagem a ser exibida
    if (fee > 0) {
        message = `Você irá receber: R$ ${(value - fee).toFixed(2)} (Taxa de R$ ${fee.toFixed(2)})`;
    } else {
        message = `Você irá receber: R$ ${value.toFixed(2)} (Sem taxa)`;
    }

     // Exibe a mensagem
    document.getElementById('messageTaxa').textContent = message;
}

document.getElementById('openModalButton').addEventListener('click', function () {
    const modal = new bootstrap.Modal(document.getElementById('taxaModal'));
    modal.show();
});
