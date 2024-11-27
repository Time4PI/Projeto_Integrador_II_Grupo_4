// Funções para o html
document.addEventListener("DOMContentLoaded", function() {
    // Verifica se o token de autenticação está presente no localStorage
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('role');
    const loginLink = document.getElementById('login-link');
    const signUpLink = document.getElementById('signUp-link');
    const signOutLink = document.getElementById('signOut-link');
    const accountLink = document.getElementById('account-link');
    const eventsLink = document.getElementById('events-link');
    const depositLink = document.getElementById('deposit-link');
    const withdrawLink = document.getElementById('withdraw-link');
    const newEventLink = document.getElementById('newEvent-link');
    const historyLink = document.getElementById('history-link');
    const myEventsLink = document.getElementById('myEvents-link');
    const sortDateButton = document.getElementById('sort-by-end-date');
    const sortBetButton = document.getElementById('sort-by-bets');
    const searchBar = document.getElementById('searchBar');
    // Botões de filtragem de eventos
    const fenomenosButton = document.getElementById('fenomenos');
    const eleicoesButton = document.getElementById('eleicoes');
    const financeiroButton = document.getElementById('financeiro');
    const esportesButton = document.getElementById('esportes');
    const outrosButton = document.getElementById('outros');
    const todosButton = document.getElementById('todos');
  
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
        if (historyLink) historyLink.style.display = 'inline-block';
        if (myEventsLink) myEventsLink.style.display = 'inline-block';
        if (sortBetButton) sortBetButton.style.display = 'inline-block';
        if (sortDateButton) sortDateButton.style.display = 'inline-block';
        if (fenomenosButton) fenomenosButton.style.display = 'inline-block';
        if (eleicoesButton) eleicoesButton.style.display = 'inline-block';
        if (financeiroButton) financeiroButton.style.display = 'inline-block';
        if (outrosButton) outrosButton.style.display = 'inline-block';
        if (esportesButton) esportesButton.style.display = 'inline-block';
        if (todosButton) todosButton.style.display = 'inline-block';
        if(searchBar) searchBar.style.display = 'inline-block';
        // Exibir ou ocultar os botões de filtro dependendo do papel (role) do usuário
        if (role == 'admin') {
            if (eventsLink) eventsLink.style.display = 'none';
            if (depositLink) depositLink.style.display = 'none';
            if (withdrawLink) withdrawLink.style.display = 'none';
            if (newEventLink) newEventLink.style.display = 'none';
            if (historyLink) historyLink.style.display = 'none';
            if (myEventsLink) myEventsLink.style.display = 'none';
            if (sortBetButton) sortBetButton.style.display = 'none';
            if (sortDateButton) sortDateButton.style.display = 'none';
            if (fenomenosButton) fenomenosButton.style.display = 'none';
            if (eleicoesButton) eleicoesButton.style.display = 'none';
            if (financeiroButton) financeiroButton.style.display = 'none';
            if (outrosButton) outrosButton.style.display = 'none';
            if (esportesButton) esportesButton.style.display = 'none';
            if (todosButton) todosButton.style.display = 'none';
            if(searchBar) searchBar.style.display = 'none';
        }
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
        if (historyLink) historyLink.style.display = 'none';
        if (myEventsLink) myEventsLink.style.display = 'none';
        if (sortBetButton) sortBetButton.style.display = 'none';
        if (sortDateButton) sortDateButton.style.display = 'none';
        if(searchBar) searchBar.style.display = 'none';
        // Ocultar os botões de filtro quando não há token
        if (fenomenosButton) fenomenosButton.style.display = 'none';
        if (eleicoesButton) eleicoesButton.style.display = 'none';
        if (financeiroButton) financeiroButton.style.display = 'none';
        if (outrosButton) outrosButton.style.display = 'none';
        
        if (esportesButton) esportesButton.style.display = 'none';
        if (todosButton) todosButton.style.display = 'none';
    }
});


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

// Events
let loadedEvents = [];
  
async function loadEvents() {
    const role = localStorage.getItem('role');
    let status = 'Pending';
    let date = 'Any';

    if (role == 'admin'){
        status = 'Pending';
        date = 'Any';
    }
  
    try {
        const response = await fetch(`http://localhost:3000/getEvents?status=${status}&date=${date}`, {
            method: 'GET',
        });
  
        if (!response.ok) throw new Error("Falha ao carregar eventos");
  
        const data = await response.json(); 
        console.log(data);
        if (data.events && data.events.length > 0) {
            loadedEvents = data.events; // Armazena os eventos carregados
            displayEvents(loadedEvents);
        } else {
            console.log('Nenhum evento encontrado.');
        }
    } catch (error) {
        displayEvents(loadedEvents);
        console.error("Erro ao carregar eventos:", error);
    }
}

function displayEvents(events) {
    // Seleciona o elemento pai onde os containers de eventos serão adicionados
    const token = localStorage.getItem('authToken');
    const mainContainer = document.getElementById("main-events-container");

    // Limpa o container antes de adicionar novos eventos
    mainContainer.innerHTML = "";
    if(token){
        const currentDate = new Date();
        // Verifica se há eventos para exibir
        if (!events || events.length === 0) {
            mainContainer.innerHTML = `<p class="text-center">Nenhum evento encontrado.</p>`;
            return;
        }

        // Cria um novo container para cada evento e insere no mainContainer
        events.forEach(event => {
            if(event.CREATOR_ID == localStorage.getItem("id")){
            // Cria um novo elemento que representa o container de um evento
            const eventContainer = document.createElement("div");
            eventContainer.classList.add("events-container");

            const categoryMap = {
                1: "Fenômenos Naturais",
                2: "Política",
                3: "Mercado Financeiro",
                4: "Esportes",
                5: "Outros"
            };

            // Preenche o container com o conteúdo do evento
            eventContainer.innerHTML = `
            <div class="card-body text-center activity-card card w-100 mb-3">
                <h3 id="betName${event.EVENT_ID}">${event.TITLE}</h3>
                <p>${event.DESCRIPTION}</p>
                <p>Categoria: ${categoryMap[event.CATEGORY]}</p>
                <p>Data de Acontecimento do Evento: ${new Date(event.EVENT_DATE).toLocaleDateString()}</p>
                <p>Data de Início das Apostas: ${new Date(event.START_DATE).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</p>
                <p>Data de Fim das Apostas: ${new Date(event.END_DATE).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</p>
            </div>
        `;
                    const buttonContainer = document.createElement("div");
                    buttonContainer.classList.add("bet-container", "mt-3");
                    buttonContainer.innerHTML = `
                        <button class="btn btn-danger w-100" 
                                onclick="deleteEvent(this.id)" 
                                onmouseover="hideErrorMessage()"
                                id="${event.EVENT_ID}">
                            Deletar
                        </button>
                    `;
                    eventContainer.querySelector('.card-body').appendChild(buttonContainer);
            // Adiciona o container do evento ao mainContainer
            mainContainer.appendChild(eventContainer);
            }
        });
    }
    
}

async function deleteEvent(eventId) {
    const token = localStorage.getItem('authToken');
    console.log(eventId);
    let headers = {
        'creatorToken': token,
        'eventID': eventId
    };

    try {
        const response = await fetch("http://localhost:3000/deleteEvent", {
            method: 'DELETE',
            headers: headers
        });

        if (!response.ok) {
            const errorText = await response.text();
            showErrorMessage(errorText);
            throw new Error(`Erro HTTP! Status: ${response.status}, Mensagem: ${errorText}`);
        }

        showSucessMessage("Evento deletado com sucesso!");
        setTimeout(() => {
            location.reload();     
        }, 3000); 
        
    } catch (error) {
        console.error('Erro ao deletar evento:', error);
        showErrorMessage("Erro ao deletar evento. Tente novamente.");
    }
}

// Funções de usuário
async function loadUserInfo() {
    // Obtém o token de autenticação do localStorage
    const token = localStorage.getItem('authToken');
  
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
        document.getElementById("userName").textContent = data.name || "N/A";
        document.getElementById("userEmail").textContent = data.email || "N/A";
        if(localStorage.getItem('role') == 'admin'){
            document.getElementById("userBalance").textContent = "N/A";
        }else{
            document.getElementById("userBalance").textContent = `R$ ${data.balance.toFixed(2)}` || "N/A";
        }
        localStorage.setItem('role', data.role);
        localStorage.setItem('id', data.id);
        
    } catch (error) {
        console.error("Erro ao carregar informações do usuário:", error);
    }
}

function signOut() {
    localStorage.removeItem('authToken'); // Remove o token de autenticação do armazenamento local
    localStorage.removeItem('id');
    localStorage.removeItem('role');
    localStorage.removeItem('hasReloaded');
    location.reload();
}

document.addEventListener("DOMContentLoaded", () => {
    // Verifica se o token de autenticação existe no localStorage
    const authToken = localStorage.getItem('authToken');
  
    if (authToken) {
        // Se o usuário está logado (authToken existe), chama a função loadEvents
        loadEvents();
        loadUserInfo();
    } 
});