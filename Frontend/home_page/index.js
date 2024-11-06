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

document.addEventListener("DOMContentLoaded", loadEvents);

async function loadEvents() {
    // Pega os valores do formulário de filtros
    const status = document.getElementById("statusSelect").value;
    const date = document.getElementById("dateInput").value;

    try {
        const headers = new Headers();
        headers.append("status", status);
        headers.append("date", date);

        const response = await fetch("http://localhost:3000/getEvents", {
            method: "GET",
            headers: headers,
        });

        if (!response.ok) throw new Error("Falha ao carregar eventos");

        const events = await response.json();
        displayEvents(events);
    } catch (error) {
        console.error("Erro ao carregar eventos:", error);
    }
}

async function searchEvents() {
    const searchInput = document.getElementById("searchInput").value.trim();
    if (!searchInput) return;

    try {
        const headers = new Headers();
        headers.append("query", searchInput);

        const response = await fetch("http://localhost:3000/searchEvent", {
            method: "GET",
            headers: headers,
        });

        if (!response.ok) throw new Error("Falha ao buscar eventos");

        const events = await response.json();
        displayEvents(events);
    } catch (error) {
        console.error("Erro ao buscar eventos:", error);
    }
}

function displayEvents(eventsData) {
  const eventsContainer = document.getElementById("eventsContainer");
  eventsContainer.innerHTML = ""; // Limpa o contêiner antes de adicionar novos eventos

  const { events } = eventsData;

  if (events.length === 0) {
      eventsContainer.innerHTML = "<p>Nenhum evento encontrado.</p>";
      return;
  }

  events.forEach(event => {
      const eventItem = document.createElement("div");
      eventItem.classList.add("event-item", `status-${event.STATUS.toLowerCase()}`); // Adiciona uma classe CSS com base no status

      // Formata as datas para exibição (opcional)
      const eventDate = new Date(event.EVENT_DATE).toLocaleDateString("pt-BR");
      const startDate = new Date(event.START_DATE).toLocaleDateString("pt-BR");
      const endDate = new Date(event.END_DATE).toLocaleDateString("pt-BR");

      eventItem.innerHTML = `
          <h3 class="event-title">${event.TITLE}</h3>
          <p class="event-description">${event.DESCRIPTION}</p>
          <p class="event-category">Categoria: ${event.CATEGORY}</p>
          <p class="event-status">Status: ${formatStatus(event.STATUS)}</p>
          <p class="event-date">Data do Evento: ${eventDate}</p>
          <p class="event-start-date">Data de Início: ${startDate}</p>
          <p class="event-end-date">Data de Término: ${endDate}</p>
      `;

      eventsContainer.appendChild(eventItem);
  });
}

// Função auxiliar para formatar o status com base no texto desejado
function formatStatus(status) {
  switch (status) {
      case "Pending": return "Pendente";
      case "Deleted": return "Deletado";
      case "Closed": return "Encerrado";
      case "Reproved": return "Reprovado";
      case "Approved": return "Aprovado";
      default: return status;
  }
}



