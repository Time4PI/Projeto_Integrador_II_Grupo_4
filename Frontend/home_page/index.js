function signOut() {
  localStorage.removeItem('authToken');
  location.reload();
}

document.addEventListener("DOMContentLoaded", function() {
  // Verifica se o token de autenticação está presente no localStorage
  const token = localStorage.getItem('authToken');
  const loginLink = document.getElementById('login-link');
  const signUpLink = document.getElementById('signUp-link');
  const signOutLink = document.getElementById('signOut-link');
  const accountLink = document.getElementById('account-link');
  const eventsLink = document.getElementById('events-link');
  const depositLink = document.getElementById('deposit-link');
  const withdrawLink = document.getElementById('withdraw-link');
  const newEventLink = document.getElementById('newEvent-link');

  // Se o token existir, remova ou oculte o botão de login
  if (token) {
    // Mostrar todos os botões
    if (loginLink) loginLink.style.display = 'none';
    if (signUpLink) signUpLink.style.display = 'none';
    if (signOutLink) signOutLink.style.display = 'inline-block';
    if (accountLink) accountLink.style.display = 'inline-block';
    if (eventsLink) eventsLink.style.display = 'inline-block';
    if (depositLink) depositLink.style.display = 'inline-block';
    if (withdrawLink) withdrawLink.style.display = 'inline-block';
    if (newEventLink) newEventLink.style.display = 'inline-block';
} else {
    // Se não houver token (usuário não logado)
    // Exibir apenas os links de Login e Sign Up
    if (loginLink) loginLink.style.display = 'inline-block';
    if (signUpLink) signUpLink.style.display = 'inline-block';
    if (signOutLink) signOutLink.style.display = 'none';
    if (accountLink) accountLink.style.display = 'none';
    if (eventsLink) eventsLink.style.display = 'none';
    if (depositLink) depositLink.style.display = 'none';
    if (withdrawLink) withdrawLink.style.display = 'none';
    if (newEventLink) newEventLink.style.display = 'none';
}
});

async function loadEvents() {
  const status = 'Any';
  const date = 'Any';

  try {
      const response = await fetch(`http://localhost:3000/getEvents?status=${status}&date=${date}`, {
          method: 'GET',
      });

      if (!response.ok) throw new Error("Falha ao carregar eventos");

      const data = await response.json();
      console.log(data);  // Exibe os dados para depuração

      if (data.events && data.events.length > 0) {
          displayEvents(data.events);  // Exibe os eventos na interface
      } else {
          console.log('Nenhum evento encontrado.');
      }
  } catch (error) {
      console.error("Erro ao carregar eventos:", error);
  }
}

const betModal = document.getElementById("betModal");
const closeButton = document.querySelector(".close-button");
const confirmBetButton = document.getElementById("confirmBetButton");
const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
const betAmountInput = document.getElementById("betAmount");

let selectedOption = null; // Variável para armazenar a escolha ("Sim" ou "Não")
let betButtonId = null;

// Função para abrir a modal
function openBetModal(buttonId) {
    betModal.style.display = "flex";
    betButtonId = buttonId;
}

// Função para fechar a modal
function closeBetModal() {
    noButton.classList.remove("btn-primary");
    noButton.classList.add("btn-secondary");
    yesButton.classList.remove("btn-primary");
    yesButton.classList.add("btn-secondary");
    yesButton.classList.remove("selected");
    noButton.classList.remove("selected");
    betModal.style.display = "none";
    selectedOption = null; // Reseta a escolha ao fechar
    betButtonId = null;
    betAmountInput.value = ''; // Limpa o campo de valor
}

// Evento para fechar a modal ao clicar no botão de fechar
closeButton.addEventListener("click", closeBetModal);

// Evento para fechar a modal ao clicar fora do conteúdo da modal
window.addEventListener("click", (event) => {
    if (event.target === betModal) {
        closeBetModal();
    }
});

// Eventos para os botões "Sim" e "Não"
yesButton.addEventListener("click", () => {
    selectedOption = "sim";

    yesButton.classList.remove("btn-secondary");
    yesButton.classList.add("btn-primary");
    noButton.classList.remove("btn-primary");
    noButton.classList.add("btn-secondary");

    yesButton.classList.add("selected");
    noButton.classList.remove("selected");
});

noButton.addEventListener("click", () => {
    selectedOption = "não";

    noButton.classList.remove("btn-secondary");
    noButton.classList.add("btn-primary");
    yesButton.classList.remove("btn-primary");
    yesButton.classList.add("btn-secondary");

    noButton.classList.add("selected");
    yesButton.classList.remove("selected");
});

function displayEvents(events) {
  // Seleciona o elemento pai onde os containers de eventos serão adicionados
  const mainContainer = document.getElementById("main-events-container");

  // Limpa o container antes de adicionar novos eventos
  mainContainer.innerHTML = "";

  // Verifica se há eventos para exibir
  if (!events || events.length === 0) {
      mainContainer.innerHTML = "<p>Nenhum evento encontrado.</p>";
      return;
  }

  // Cria um novo container para cada evento e insere no mainContainer
  events.forEach(event => {
      // Cria um novo elemento que representa o container de um evento
      const eventContainer = document.createElement("div");
      eventContainer.classList.add("events-container");

      // Preenche o container com o conteúdo do evento
      if(event.STATUS != "Approved"){
        eventContainer.innerHTML = `
                <div class="card-body text-center activity-card card w-100 mb-3">
                <h3>${event.TITLE}</h3>
                <p>${event.DESCRIPTION}</p>
                <p>Status: ${event.STATUS}</p>
                <p>Data do Evento: ${new Date(event.EVENT_DATE).toLocaleDateString()}</p>
                <p>Data de Início: ${new Date(event.START_DATE).toLocaleDateString()}</p>
                <p>Data de Fim: ${new Date(event.END_DATE).toLocaleDateString()}</p>
                </div>
        `;
      } else {
        eventContainer.innerHTML = `
                <div class="card-body text-center activity-card card w-100 mb-3">
                <h3>${event.TITLE}</h3>
                <p>${event.DESCRIPTION}</p>
                <p>Status: ${event.STATUS}</p>
                <p>Data do Evento: ${new Date(event.EVENT_DATE).toLocaleDateString()}</p>
                <p>Data de Início: ${new Date(event.START_DATE).toLocaleDateString()}</p>
                <p>Data de Fim: ${new Date(event.END_DATE).toLocaleDateString()}</p>
                
                <div class="bet-container mt-3">
                    <button class="btn btn-primary w-100"  onclick="openBetModal(this.id)" id="${event.EVENT_ID}">Apostar</button>
                </div>
                </div>
        `;
      }
    
    
      // Adiciona o container do evento ao mainContainer
      mainContainer.appendChild(eventContainer);
  });
}


document.addEventListener("DOMContentLoaded", () => {
  // Verifica se o token de autenticação existe no localStorage
  const authToken = localStorage.getItem('authToken');

  if (authToken) {
      // Se o usuário está logado (authToken existe), chama a função loadEvents
      loadEvents();
      loadUserInfo()
  } 
});


async function loadUserInfo() {
  // Obtém o token de autenticação do localStorage
  const token = localStorage.getItem('authToken');
  console.log(localStorage.getItem('authToken'));

  if (!token) {
      console.error('Token de autenticação não encontrado.');
      return;
  }

  try {
      // Faz a chamada à API para obter as informações do usuário
      const response = await fetch("http://localhost:3000/getUserInfo", {
          method: 'GET',
          headers: {
              'token': token, // Token sem prefixo "Bearer"
          },
      });

      if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Falha ao carregar informações do usuário: ${errorText}`);
      }

      // Obtém os dados da resposta e os insere nos elementos HTML
      const data = await response.json();
      console.log(data);
      document.getElementById("userName").textContent = data.name || "N/A";
      document.getElementById("userEmail").textContent = data.email || "N/A";
      document.getElementById("userBalance").textContent = `R$ ${data.balance.toFixed(2)}` || "N/A";
  } catch (error) {
      console.error("Erro ao carregar informações do usuário:", error);
  }
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

function isValidBet(selectedOption, betAmount) {
    let valid = false;

    // Remove espaços extras
    selectedOption = selectedOption;
    betAmount = betAmount;

    // Validação
    if (selectedOption && betAmount) {
        valid = true;
    } else if (!selectedOption && !betAmount) {
        // Caso nenhum campo tenha sido preenchido
        showErrorMessage("Por favor, selecione 'Sim' ou 'Não' e insira um valor para a aposta.");
    } else {
        // Verifica qual campo está vazio
        if (!selectedOption) {
            showErrorMessage("Por favor, selecione 'Sim' ou 'Não' para a aposta.");
        } else if (!betAmount) {
            showErrorMessage("Por favor, insira um valor válido para a aposta.");
        }
    }

    console.info("Opção Selecionada:", selectedOption);
    console.info("Valor da Aposta:", betAmount);

    return valid;
}


async function performBet() {
    const token = localStorage.getItem('authToken');
    var eventID = betButtonId;
    var value = document.getElementById('betAmount').value;
    var betOption = selectedOption;

    console.log(token);
    console.log(eventID);
    console.log(value);
    console.log(betOption);

    if (isValidBet(betOption, value)) {
        try {
            const response = await fetch("http://localhost:3000/betOnEvent", {
                method: 'PUT',
                headers: {
                    'accountToken': token,
                    'eventID': eventID,
                    'value': value,
                    'betOption': betOption,
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
            showSucessMessage("Aposta realizada com sucesso!");

            setTimeout(() => {
                window.location.href = "../home_page/index.html";
            }, 2000);
        } catch (error) {
            console.error('Erro ao realizar login:', error);
        }
    }
}



