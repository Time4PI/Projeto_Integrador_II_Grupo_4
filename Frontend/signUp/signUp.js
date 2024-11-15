function isValidSignUp(completeName, email, password) {
    var valid = false;
    completeName = completeName.trim();
    email = email.trim();
    password = password.trim();

    if (completeName && email && password) {
        valid = true;
    } else if (completeName.length == 0 && email.length == 0 && password.length == 0) {
        // dar um erro dizendo para preencher todos os campos
        showErrorMessage("Preencha todos os campos.");
    } else {
        // dar um erro para o campo específico que não foi preenchido
        if (completeName.length == 0) {
            showErrorMessage("Preencha o nome completo.");
        } else if (email.length == 0) {
            showErrorMessage("Preencha o email.");
        } else {
            showErrorMessage("Preencha a senha.");
        }
    }
    console.info(completeName);
    console.info(email);
    console.info(password);
    return valid;
}

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

async function performSignUp() {
    var completeName = document.getElementById("completeName").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    if (isValidSignUp(completeName, email, password)) {
        try {
            const response = await fetch("http://localhost:3000/signUp", {
                method: 'PUT', // Usando POST para criar o cadastro
                headers: {
                    'name': completeName,
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
            console.info(`Resposta: ${resultText}`); // Aqui você pode obter a resposta do backend

            // Exibe a mensagem de sucesso após o cadastro
            showSucessMessage("Cadastro realizado com sucesso!");

            // Após um tempo, você pode redirecionar o usuário para a página de login ou outra
            setTimeout(() => {
                window.location.href = "../signIn/"; // Redireciona para a página de login, por exemplo
            }, 3000); // Aguarda 3 segundos para mostrar a mensagem de sucesso

        } catch (error) {
            console.error('Erro ao realizar cadastro:', error);
        }
    }
}
