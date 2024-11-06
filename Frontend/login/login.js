function isValid(email, password){
    var valid = false;
    email = email.trim();
    password = password.trim();

    if (email && password){
        valid = true;
    }else if(email.length == 0 && password.length == 0){
        // dar um erro dizendo para preencher os campos
        showErrorMessage("Preencha os campos.");
    }else if(email.length == 0){
        // dar um erro dizendo para preencher o email
        showErrorMessage("Preencha o email.");
    }else{
        // dar um erro dizendo para preencher a senha
        showErrorMessage("Preencha a senha.");
    }
    console.info(email);
    console.info(password);
    return valid;
}

function showErrorMessage(message){
    // exibir a mensagem de texto recebida
    // mostrar a caixa de texto com a mensagem
    var mb = document.getElementById("messageBox");
    document.getElementById("message").innerHTML = message;
    mb.style.display = "block";
}

function showSucessMessage(message){
    // exibir a mensagem de texto recebida
    // mostrar a caixa de texto com a mensagem
    var mb = document.getElementById("messageBox");
    document.getElementById("message").innerHTML = message;
    mb.style.display = "block";
    mb.style.backgroundColor = "green";
}

function hideErrorMessage(){
    var mb = document.getElementById("messageBox");
    mb.style.display = "none";
}

async function performSignIn() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    if (isValid(email, password)) {
        try {
            const response = await fetch("http://localhost:3000/login", {
                method: 'GET',
                headers: {
                    'email': email,
                    'password': password,
                }
            });

            if (!response.ok) {
                const errorText = await response.text(); // Lê como texto
                showErrorMessage(errorText);
                throw new Error(`Erro HTTP! Status: ${response.status}, Mensagem: ${errorText}`);
            }

            const resultText = await response.text(); // Lê a resposta como texto
            console.info(`Resposta: ${resultText}`); // Aqui você terá a string com o token

            // Extrai o token da resposta
            const tokenMatch = resultText.match(/Token\s*:\s*(\w+)/); // Corrigido para corresponder ao formato da resposta
            if (tokenMatch) {
                const token = tokenMatch[1]; // O token será a primeira captura
                console.log(`Token recebido: ${token}`);

                // Armazena o token no localStorage (ou sessionStorage)
                localStorage.setItem('authToken', token); // ou sessionStorage.setItem('authToken', token);

                showSucessMessage("Login realizado com sucesso!")

                setTimeout(() => {
                    window.location.href = "../home_page/index.html";
                }, 3000);
            } else {
                console.error("Token não encontrado na resposta.");
            }

        } catch (error) {
            console.error('Erro ao realizar login:', error);
        }
    }
}





