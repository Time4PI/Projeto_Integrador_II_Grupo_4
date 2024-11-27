// Verifica de o email e senha são validos
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
    return valid;
}

// Exibe uma mensagem de erro
function showErrorMessage(message){
    var mb = document.getElementById("messageBox");
    document.getElementById("message").innerHTML = message;
    mb.style.display = "block";
}

// Exibe uma mensagem de sucesso
function showSucessMessage(message){
    var mb = document.getElementById("messageBox");
    document.getElementById("message").innerHTML = message;
    mb.style.display = "block";
    mb.style.backgroundColor = "green";
}

// Oculta a mensagem de erro
function hideErrorMessage(){
    var mb = document.getElementById("messageBox");
    mb.style.display = "none";
}

// Submete os dados do SignIn para a API
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

            // Extrai o token da resposta
            const tokenMatch = resultText.match(/Token\s*:\s*(\w+)/); // Corrigido para corresponder ao formato da resposta
            if (tokenMatch) {
                const token = tokenMatch[1]; // O token será a primeira captura

                // Armazena o token no localStorage (ou sessionStorage)
                localStorage.setItem('authToken', token); // ou sessionStorage.setItem('authToken', token);

                showSucessMessage("Login realizado com sucesso!")

                setTimeout(() => {
                    window.location.href = "../home_page/";
                }, 2000);
            } else {
                console.error("Token não encontrado na resposta.");
            }

        } catch (error) {
            console.error('Erro ao realizar login:', error);
        }
    }
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const showPasswordCheckbox = document.getElementById('show-password');

    // Alterna entre os tipos "password" e "text"
    if (showPasswordCheckbox.checked) {
        passwordInput.type = 'text';
    } else {
        passwordInput.type = 'password';
    }
}



