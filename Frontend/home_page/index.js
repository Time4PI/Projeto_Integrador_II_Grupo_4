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
            if(sortBetButton) sortBetButton.style.display = 'none';
            if(sortDateButton) sortDateButton.style.display = 'none';
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


// Função para atualizar os estilos dos botões
function updateButtonStyles(categoryId) {
    // Primeiramente, remove a classe "btn-success" de todos os botões de categoria e adiciona "btn-secondary"
    Object.values(buttons).forEach(button => {
        button.classList.remove("btn-success");
        button.classList.add("btn-secondary");
    });

    // Também desmarca o botão "Todos"
    todosButton.classList.remove("btn-success");
    todosButton.classList.add("btn-secondary");

    // Adiciona a classe "btn-success" ao botão correspondente à categoria
    if (buttons[categoryId]) {
        buttons[categoryId].classList.add("btn-success");
        buttons[categoryId].classList.remove("btn-secondary");
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

function showErrorMessage2(message) {
    var mb = document.getElementById("messageBox2");
    document.getElementById("message2").innerHTML = message;
    mb.style.display = "block";
    mb.style.backgroundColor = "red";
}

// Exibe uma mensagem de sucesso
function showSucessMessage2(message) {
    var mb = document.getElementById("messageBox2");
    document.getElementById("message2").innerHTML = message;
    mb.style.display = "block";
    mb.style.backgroundColor = "green";
}

// Oculta a mensagem de erro
function hideErrorMessage2() {
    var mb = document.getElementById("messageBox2");
    mb.style.display = "none";
}

// Events
let loadedEvents = [];
let filteredEvents = [];  // Variável para armazenar os eventos filtrados pela pesquisa
let isSortedByBets = false;
let currentSearchText = ""; // Variável para armazenar a pesquisa atual
  
async function loadEvents() {
    const role = localStorage.getItem('role');
    let status = 'Approved';
    let date = 'Future';

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
  
        if (data.events && data.events.length > 0) {
            loadedEvents = data.events; // Armazena os eventos carregados
            filteredEvents = loadedEvents; // Inicializa a lista filtrada com todos os eventos
            displayEvents(filteredEvents); // Exibe os eventos normalmente
        } else {
            console.log('Nenhum evento encontrado.');
        }
    } catch (error) {
        displayEvents(loadedEvents);
        console.error("Erro ao carregar eventos:", error);
    }
}

// Função para ordenar eventos por TOTAL_BETS
function sortEventsByBets(events) {
    return events.sort((a, b) => b.TOTAL_BETS - a.TOTAL_BETS);
}

// Função para ordenar eventos pela proximidade da data de fim das apostas
function sortEventsByEndDate(events) {
    return events.sort((a, b) => new Date(a.END_DATE) - new Date(b.END_DATE));
}

// Função para alternar entre eventos ordenados e não ordenados
function toggleEventOrder() {
    const button = document.getElementById("sort-by-bets");
    const buttonDate = document.getElementById("sort-by-end-date");

    let eventsToDisplay = loadedEvents;

    if (chosenCategory) {
        eventsToDisplay = filteredEvents.filter(event => event.CATEGORY === chosenCategory);
    }

    if (currentSearchText.trim() !== "") {
        eventsToDisplay = eventsToDisplay.filter(event => 
            event.TITLE.toLowerCase().includes(currentSearchText.toLowerCase()) || 
            event.DESCRIPTION.toLowerCase().includes(currentSearchText.toLowerCase())
        );
    }

    if (isSortedByBets) {
        // Se já estiver ordenado, volta à ordem original
        displayEvents(eventsToDisplay);
        button.classList.remove("btn-primary");
        button.classList.add("btn-secondary");
    } else {
        // Se não estiver ordenado, ordena os eventos
        const sortedEvents = sortEventsByBets([...eventsToDisplay]);
        displayEvents(sortedEvents);
        button.classList.remove("btn-secondary");
        button.classList.add("btn-primary");
    }

    buttonDate.classList.remove("btn-primary");
    buttonDate.classList.add("btn-secondary");
    // Alterna o estado da ordenação
    isSortedByBets = !isSortedByBets;
    if(isSortedByEndDate) isSortedByEndDate = !isSortedByEndDate;
}

let isSortedByEndDate = false; // Variável para controlar o estado do toggle para ordenação por data de fim das apostas

// Função para alternar a ordenação pela proximidade da data de fim das apostas
function toggleSortByEndDate() {
    const button = document.getElementById("sort-by-end-date");
    const buttonBet = document.getElementById("sort-by-bets");

    // Verifica se a pesquisa está ativa
    let eventsToDisplay = currentSearchText.trim() === "" ? loadedEvents : filteredEvents;

    if (chosenCategory) {
        eventsToDisplay = filteredEvents.filter(event => event.CATEGORY === chosenCategory);
    }

    if (currentSearchText.trim() !== "") {
        eventsToDisplay = eventsToDisplay.filter(event => 
            event.TITLE.toLowerCase().includes(currentSearchText.toLowerCase()) || 
            event.DESCRIPTION.toLowerCase().includes(currentSearchText.toLowerCase())
        );
    }

    if (isSortedByEndDate) {
        // Se já estiver ordenado, volta à ordem original
        displayEvents(eventsToDisplay);  // Exibe os eventos sem ordenação
        button.classList.remove("btn-primary");
        button.classList.add("btn-secondary");
    } else {
        // Se não estiver ordenado, ordena os eventos pela proximidade da data de fim das apostas
        const sortedByEndDate = sortEventsByEndDate([...eventsToDisplay]); // Ordena os eventos pela data de fim das apostas
        displayEvents(sortedByEndDate);  // Exibe os eventos ordenados
        button.classList.remove("btn-secondary");
        button.classList.add("btn-primary");
    }

    buttonBet.classList.remove("btn-primary");
    buttonBet.classList.add("btn-secondary");
    // Alterna o estado da ordenação
    isSortedByEndDate = !isSortedByEndDate;
    if(isSortedByBets) isSortedByBets = !isSortedByBets; 
}

// Função para ordenar eventos pela proximidade da data de fim das apostas
function sortEventsByEndDate(events) {
    const currentDate = new Date(); // Obtém a data atual

    return events.sort((a, b) => {
        const aEndDate = new Date(a.END_DATE); // Data de fim das apostas do evento 'a'
        const bEndDate = new Date(b.END_DATE); // Data de fim das apostas do evento 'b'
        
        // Calcula a diferença de tempo entre a data atual e a data de fim das apostas
        const aTimeRemaining = aEndDate - currentDate;
        const bTimeRemaining = bEndDate - currentDate;

        // Ordena pelo tempo restante, do mais próximo para o mais distante
        return aTimeRemaining - bTimeRemaining;
    });
}

// Adiciona evento ao botão para alternar a ordenação
document.getElementById("sort-by-end-date").addEventListener("click", toggleSortByEndDate);

// Adiciona evento ao botão para alternar a ordenação
document.getElementById("sort-by-bets").addEventListener("click", toggleEventOrder);

// Função para carregar eventos com base na pesquisa
async function loadEventsSearch(word) {
    const keyword = word.trim();
    const token = localStorage.getItem('authToken');
    let filteredEvents = [];
    
    if (token) {
        try {
            const response = await fetch(`http://localhost:3000/searchEvent`, {
                method: 'GET',
                headers: {
                    'keyword': keyword,
                }
            });

            if (!response.ok) throw new Error("Falha ao carregar eventos");

            const data = await response.json();  // Exibe os dados para depuração

            if (data.events && data.events.length > 0) {
                filteredEvents = data.events; // Armazena os eventos filtrados pela pesquisa

                // Se uma categoria foi escolhida, filtra os eventos pela categoria também
                if (chosenCategory) {
                    filteredEvents = filteredEvents.filter(event => event.CATEGORY === chosenCategory);
                }

                // Se o filtro de ordenação estiver ativado, ordena os eventos
                if (isSortedByBets) {
                    filteredEvents = sortEventsByBets(filteredEvents); // Ordena os eventos por TOTAL_BETS
                }

                if (isSortedByEndDate) {
                    filteredEvents = sortEventsByEndDate(filteredEvents); // Ordena os eventos pela proximidade da data de fim
                }

                displayEvents(filteredEvents);  // Exibe os eventos na interface
            } else {
                console.log('Nenhum evento encontrado.');
                displayEvents([]);  // Exibe uma mensagem ou mantém o container vazio
            }
        } catch (error) {
            console.error("Erro ao carregar eventos:", error);
        }
    }
}

// Captura o campo de entrada
const searchBar = document.getElementById("searchBar");

let chosenCategory;
const fenomenosButton = document.getElementById('fenomenos');
const eleicoesButton = document.getElementById('eleicoes');
const financeiroButton = document.getElementById('financeiro');
const esportesButton = document.getElementById('esportes');
const outrosButton = document.getElementById('outros');
const todosButton = document.getElementById('todos');

// Mapear os botões para suas categorias
const buttons = {
    1: fenomenosButton,
    2: eleicoesButton,
    3: financeiroButton,
    4: esportesButton,
    5: outrosButton
};

// Adicionar o botão "todos" fora do objeto de categorias

function filterEvents(categoryId) {
    let filteredEvents = loadedEvents;

    // Filtra os eventos pela categoria
    if (categoryId) {
        filteredEvents = filteredEvents.filter(event => event.CATEGORY === categoryId);
    }

    // Aplica o filtro de pesquisa
    if (currentSearchText.trim() !== "") {
        filteredEvents = filteredEvents.filter(event => 
            event.TITLE.toLowerCase().includes(currentSearchText.toLowerCase()) || 
            event.DESCRIPTION.toLowerCase().includes(currentSearchText.toLowerCase())
        );
    }

    // Atualiza os estilos dos botões
    updateButtonStyles(categoryId);

    // Aplica a ordenação por apostas, se selecionado
    if (isSortedByBets) {
        filteredEvents = sortEventsByBets(filteredEvents);
    }

    // Aplica a ordenação por data, se selecionado
    if (isSortedByEndDate) {
        filteredEvents = sortEventsByEndDate(filteredEvents);
    }

    // Exibe os eventos após o filtro e ordenação
    displayEvents(filteredEvents);
    chosenCategory = categoryId;
    return filteredEvents;
}

// Função para mostrar todos os eventos
function showAllEvents() {
    if(currentSearchText.trim()){
        loadEventsSearch(currentSearchText);
    }else{
        displayEvents(loadedEvents);
    }
    // Desmarcar todos os botões de categoria
    Object.values(buttons).forEach(button => {
        button.classList.remove("btn-success");
        button.classList.add("btn-secondary");
    });

    // Marca o botão "Todos"
    todosButton.classList.remove("btn-secondary");
    todosButton.classList.add("btn-success");

    chosenCategory = null;
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
            // Verifica se a data atual está dentro do período de apostas
            const role = localStorage.getItem('role');
            if(role == 'admin'){
                const buttonContainer = document.createElement("div");
                buttonContainer.classList.add("bet-container", "mt-3");
                buttonContainer.innerHTML = `
                    <p>Avalie o evento:</p>
                    <button class="btn btn-warning w-100" 
                            onclick="openEvaluateModal(this.id, document.getElementById('betName' + this.id).innerText)" 
                            id="${event.EVENT_ID}">
                        Avaliar
                    </button>
                `;
                eventContainer.querySelector('.card-body').appendChild(buttonContainer);
            }else{
                if (currentDate >= new Date(event.START_DATE)) {
                    // Cria o botão "Apostar"
                    const buttonContainer = document.createElement("div");
                    buttonContainer.classList.add("bet-container", "mt-3");
                    buttonContainer.innerHTML = `
                        <p>
                            ${
                                event.TOTAL_BETS === 0 
                                ? 'Seja o primeiro a apostar!' 
                                : `${event.TOTAL_BETS} ${event.TOTAL_BETS > 1 ? 'apostas realizadas!' : 'aposta realizada!'}` 
                            }
                        </p>
                        <button class="btn btn-primary w-100" 
                                onclick="openBetModal(this.id, document.getElementById('betName' + this.id).innerText)" 
                                id="${event.EVENT_ID}">
                            Apostar
                        </button>
                    `;
                    eventContainer.querySelector('.card-body').appendChild(buttonContainer);
                } else {
                    // Adiciona a mensagem "As apostas ainda não foram abertas"
                    const messageContainer = document.createElement("p");
                    messageContainer.classList.add("text-warning", "mt-3");
                    messageContainer.textContent = "Aguarde o início das apostas.";
                    eventContainer.querySelector('.card-body').appendChild(messageContainer);
                }
            }
            // Adiciona o container do evento ao mainContainer
            mainContainer.appendChild(eventContainer);
        });
    }
}

// Adiciona um listener ao campo de entrada para capturar o texto digitado em tempo real
searchBar.addEventListener("input", () => {
    currentSearchText = searchBar.value;
    if (currentSearchText.trim() === "") {
        // Se a pesquisa estiver vazia, exibe todos os eventos
        filteredEvents = loadedEvents;
        if (chosenCategory) {
            filteredEvents = filteredEvents.filter(event => event.CATEGORY === chosenCategory);
        }
        if (isSortedByBets) {
            filteredEvents = sortEventsByBets(filteredEvents); // Ordena os eventos por TOTAL_BETS
        }
        if (isSortedByEndDate) {
            filteredEvents = sortEventsByEndDate(filteredEvents); // Ordena os eventos pela proximidade da data de fim
        }
        displayEvents(filteredEvents);
    } else {
        loadEventsSearch(currentSearchText);  // Realiza a pesquisa e exibe os eventos encontrados
    }
});
  
// Função para o modal

const modal = document.getElementById("betModal");
const closeButton = document.querySelector(".close-button");
const confirmBetButton = document.getElementById("confirmBetButton");
const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
const betAmountInput = document.getElementById("betAmount");
  
let selectedOption = null; // Variável para armazenar a escolha ("Sim" ou "Não")
let betButtonId = null;
  
// Função para abrir a modal
function openBetModal(buttonId, title) {
      document.getElementById("eventName").innerHTML = `O evento ${title} irá ocorrer?`;
      modal.style.display = "flex";
      betButtonId = buttonId;
}
  
// Função para fechar a modal
function closeBetModal() {
      noButton.classList.remove("btn-danger");
      noButton.classList.add("btn-secondary");
      yesButton.classList.remove("btn-primary");
      yesButton.classList.add("btn-secondary");
      yesButton.classList.remove("selected");
      noButton.classList.remove("selected");
      modal.style.display = "none";
      selectedOption = null; // Reseta a escolha ao fechar
      betButtonId = null;
      betAmountInput.value = ''; // Limpa o campo de valor
}
  
// Evento para fechar a modal ao clicar no botão de fechar
closeButton.addEventListener("click", closeBetModal);
  
// Evento para fechar a modal ao clicar fora do conteúdo da modal
window.addEventListener("click", (event) => {
      if (event.target === modal) {
          closeBetModal();
      }
});
  
// Eventos para os botões "Sim" e "Não"
yesButton.addEventListener("click", () => {
      selectedOption = "sim";
  
      yesButton.classList.remove("btn-secondary");
      yesButton.classList.add("btn-primary");
      noButton.classList.remove("btn-danger");
      noButton.classList.add("btn-secondary");
  
      yesButton.classList.add("selected");
      noButton.classList.remove("selected");
});
  
noButton.addEventListener("click", () => {
      selectedOption = "não";
  
      noButton.classList.remove("btn-secondary");
      noButton.classList.add("btn-danger");
      yesButton.classList.remove("btn-primary");
      yesButton.classList.add("btn-secondary");
  
      noButton.classList.add("selected");
      yesButton.classList.remove("selected");
});  

const evaluateModal = document.getElementById("evaluateModal");
const closeEvaluateButton = evaluateModal.querySelector(".close-button");
const confirmEvaluateButton = document.getElementById("confirmEvaluateButton");
const yesEvaluateButton = document.getElementById("yesEvaluateButton");
const noEvaluateButton = document.getElementById("noEvaluateButton");
const reasonConfuso = document.getElementById("reasonConfuso");
const reasonInapropriado = document.getElementById("reasonInapropriado");
const reasonPolitica = document.getElementById("reasonPolitica");
const reasonValido = document.getElementById("reasonValido");

let evaluateSelectedOption = null; // Variável para armazenar a escolha ("Sim" ou "Não")
let evaluateButtonId = null;

// Função para abrir o modal de avaliação
function openEvaluateModal(buttonId, title) {
    document.getElementById("evaluateEventName").innerHTML = `Avalie o evento: ${title}`;
    evaluateModal.style.display = "flex";
    evaluateButtonId = buttonId;
}

// Função para fechar o modal de avaliação
function closeEvaluateModal() {
    yesEvaluateButton.classList.remove("btn-primary");
    yesEvaluateButton.classList.add("btn-secondary");
    noEvaluateButton.classList.remove("btn-danger");
    noEvaluateButton.classList.add("btn-secondary");
    yesEvaluateButton.classList.remove("selected");
    noEvaluateButton.classList.remove("selected");

    // Limpar checkboxes
    document.getElementById("reasonValidoCheckbox").checked = false;
    document.getElementById("reasonConfusoCheckbox").checked = false;
    document.getElementById("reasonInapropriadoCheckbox").checked = false;
    document.getElementById("reasonPoliticaCheckbox").checked = false;

    evaluateModal.style.display = "none";
    evaluateSelectedOption = null; // Reseta a escolha ao fechar
    evaluateButtonId = null;
}

// Evento para fechar o modal ao clicar no botão de fechar
closeEvaluateButton.addEventListener("click", closeEvaluateModal);

// Evento para fechar o modal ao clicar fora do conteúdo do modal
window.addEventListener("click", (event) => {
    if (event.target === evaluateModal) {
        closeEvaluateModal();
    }
});

// Eventos para os botões "Sim" e "Não"
yesEvaluateButton.addEventListener("click", () => {
    evaluateSelectedOption = "sim";

    yesEvaluateButton.classList.remove("btn-secondary");
    yesEvaluateButton.classList.add("btn-primary");
    noEvaluateButton.classList.remove("btn-danger");
    noEvaluateButton.classList.add("btn-secondary");

    yesEvaluateButton.classList.add("selected");
    noEvaluateButton.classList.remove("selected");

    // Esconde os motivos e remove o texto
    reasonValido.style.display = "block";
    reasonConfuso.style.display = "none";
    reasonInapropriado.style.display = "none";
    reasonPolitica.style.display = "none";

    // Remover o texto se necessário
    document.getElementById("reasonValidoText").textContent = "Válido";
    document.getElementById("reasonConfusoText").textContent = "";
    document.getElementById("reasonInapropriadoText").textContent = "";
    document.getElementById("reasonPoliticaText").textContent = "";

    document.getElementById("reasonValidoCheckbox").checked = false;
    document.getElementById("reasonConfusoCheckbox").checked = false;
    document.getElementById("reasonInapropriadoCheckbox").checked = false;
    document.getElementById("reasonPoliticaCheckbox").checked = false;
});

noEvaluateButton.addEventListener("click", () => {
    evaluateSelectedOption = "não";

    noEvaluateButton.classList.remove("btn-secondary");
    noEvaluateButton.classList.add("btn-danger");
    yesEvaluateButton.classList.remove("btn-primary");
    yesEvaluateButton.classList.add("btn-secondary");
    
    noEvaluateButton.classList.add("selected");
    yesEvaluateButton.classList.remove("selected");

    // Mostra os motivos
    reasonValido.style.display = "none";
    reasonConfuso.style.display = "block";
    reasonInapropriado.style.display = "block";
    reasonPolitica.style.display = "block";

    // Adiciona o texto novamente
    document.getElementById("reasonValidoText").textContent = "";
    document.getElementById("reasonConfusoText").textContent = "Texto Confuso";
    document.getElementById("reasonInapropriadoText").textContent = "Texto Inapropriado";
    document.getElementById("reasonPoliticaText").textContent = "Não Respeita a Política";

    document.getElementById("reasonValidoCheckbox").checked = false;
    document.getElementById("reasonConfusoCheckbox").checked = false;
    document.getElementById("reasonInapropriadoCheckbox").checked = false;
    document.getElementById("reasonPoliticaCheckbox").checked = false;
});

// Função para Avaliar o Evento
async function performEvaluation() {
    const reasons = [];
    const token = localStorage.getItem('authToken');
    const reasonConfuso = document.getElementById("reasonConfusoCheckbox");
    const reasonInapropriado = document.getElementById("reasonInapropriadoCheckbox");
    const reasonPolitica = document.getElementById("reasonPoliticaCheckbox");
    const reasonValido = document.getElementById("reasonValidoCheckbox");

    // Coleta os motivos selecionados
    if (reasonConfuso && reasonConfuso.checked) reasons.push("Texto Confuso");
    if (reasonInapropriado && reasonInapropriado.checked) reasons.push("Texto Inapropriado");
    if (reasonPolitica && reasonPolitica.checked) reasons.push("Não Respeita a Política");
    if (reasonValido && reasonValido.checked) reasons.push("Válido");

    if (!evaluateSelectedOption || reasons.length === 0) {
        showErrorMessage2("Por favor, selecione uma opção e pelo menos um motivo.");
        return;
    }

    let headers = {
        'adminToken': token,
        'eventID': evaluateButtonId,
        'evaluation': evaluateSelectedOption === "sim" ? "Approved" : "Reproved",
        'reason': reasons.join(", ")
    };

    try {
        const response = await fetch("http://localhost:3000/evaluateNewEvent", {
            method: 'PUT',
            headers: headers
        });

        if (!response.ok) {
            const errorText = await response.text();
            showErrorMessage2(errorText);
            throw new Error(`Erro HTTP! Status: ${response.status}, Mensagem: ${errorText}`);
        }

        showSucessMessage2("Evento avaliado com sucesso!");
        setTimeout(() => {
            closeEvaluateModal(); 
            location.reload();     
        }, 3000); 
        
    } catch (error) {
        console.error('Erro ao avaliar evento:', error);
        showErrorMessage2("Erro ao avaliar evento. Tente novamente.");
    }
}

// Fechar o modal quando o clique fora da caixa do modal
window.addEventListener("click", (event) => {
    if (event.target === evaluateModal) {
        evaluateModal.style.display = "none";
    }
});


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
        
        if (localStorage.getItem('role') === 'admin' && !localStorage.getItem('hasReloaded')) {
            // Define a flag para indicar que o reload foi feito
            localStorage.setItem('hasReloaded', 'true');
            
            // Recarrega a página
            location.reload();
        }
    } catch (error) {
        console.error("Erro ao carregar informações do usuário:", error);
    }
}

function signOut() {
    localStorage.removeItem('authToken'); // Remove o token de autenticação do armazenamento local
    localStorage.removeItem('role');
    localStorage.removeItem('hasReloaded');
    location.reload();
}

// Função para aposta
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
  
      return valid;
}
  
// Função para registrar a aposta
async function performBet() {
      const token = localStorage.getItem('authToken');
      var eventID = betButtonId;
      var value = document.getElementById('betAmount').value;
      var betOption = selectedOption;
  
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
  
              // Exibe a mensagem de sucesso após o cadastro
              showSucessMessage("Aposta realizada com sucesso!");
  
              setTimeout(() => {
                  window.location.href = "../home_page/";
              }, 2000);
          } catch (error) {
              console.error('Erro ao realizar login:', error);
          }
      }
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