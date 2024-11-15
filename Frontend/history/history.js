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
    const historyLink = document.getElementById('history-link');
  
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
  }
  });
  
  document.addEventListener("DOMContentLoaded", () => {
    // Verifica se o token de autenticação existe no localStorage
    const authToken = localStorage.getItem('authToken');
  
    if (authToken) {
        // Se o usuário está logado (authToken existe), chama a função loadEvents
        loadTransactions()
        loadUserInfo();
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

  async function loadTransactions() {
    const userToken = localStorage.getItem('authToken');
  
    try {
        const response = await fetch("http://localhost:3000/getUserStatement", {
            method: 'GET',
            headers: {
                'userToken': userToken,
            }
        });
  
        if (!response.ok) throw new Error("Falha ao carregar o histórico!");
  
        const data = await response.json();
        console.log(data); // Depuração
  
        if (data && data.length > 0) {
            displayTransactions(data); // Exibe as transações
        } else {
            console.log('Nenhuma transação no histórico.');
        }
    } catch (error) {
        console.error("Erro ao carregar histórico:", error);
    }
}

function displayTransactions(transactions) {
    // Seleciona o elemento pai onde a tabela será adicionada
    const mainContainer = document.getElementById("main-events-container");

    // Limpa o container antes de adicionar a tabela
    mainContainer.innerHTML = "";

    // Verifica se há transações para exibir
    if (!transactions || transactions.length === 0) {
        mainContainer.innerHTML = "<p>Nenhuma transação encontrada.</p>";
        return;
    }

    // Cria a estrutura inicial da tabela
    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.marginTop = "20px";
    table.style.backgroundColor = "#2a2a2a";

    // Cria o cabeçalho da tabela
    const thead = document.createElement("thead");
    thead.innerHTML = `
        <tr style="background-color: #333; color: #fff;">
            <th style="text-align: center; padding: 12px;">Method</th>
            <th style="text-align: center; padding: 12px;">Amount</th>
            <th style="text-align: center; center: 12px;">Date/Time</th>
        </tr>
    `;
    table.appendChild(thead);

    // Cria o corpo da tabela
    const tbody = document.createElement("tbody");

    // Itera sobre as transações para criar linhas
    transactions.forEach(transaction => {
        const row = document.createElement("tr");
        row.style.borderBottom = "1px solid #444";

        // Determina o ícone com base no tipo de transação
        let icon = "";
        switch (transaction.TRANSACTION_TYPE) {
            case "Aposta":
                icon = "🎰";
                break;
            case "Saque":
                icon = "💵";
                break;
            case "Deposito":
                icon = "💸";
                break;
            default:
                icon = "🚀"; // Ícone padrão caso o tipo seja desconhecido
        }

        // Coluna Method
        const methodCell = document.createElement("td");
        methodCell.style.padding = "12px";
        methodCell.style.textAlign = "center";
        methodCell.innerHTML = `<span style="margin-right: 8px;">${icon}</span>${transaction.TRANSACTION_TYPE}`;
        row.appendChild(methodCell);

        // Coluna Amount
        const amountCell = document.createElement("td");
        amountCell.style.padding = "12px";
        amountCell.style.display = "block";
        amountCell.style.marginLeft = "40%";
        amountCell.style.textAlign = "left";
        if (transaction.TRANSACTION_TYPE === "Saque" || transaction.TRANSACTION_TYPE === "Aposta") {
            amountCell.style.color = "#f44336"; // Vermelho para Saque ou Aposta
        }
        else{
            amountCell.style.color = "#4caf50"; 
        }
        amountCell.textContent = `R$ ${transaction.AMOUNT.toFixed(2)}`;
        row.appendChild(amountCell);

        // Coluna Date/Time
        const dateCell = document.createElement("td");
        dateCell.style.padding = "12px";
        dateCell.style.textAlign = "center";
        dateCell.textContent = new Date(transaction.TRANSACTION_DATE).toLocaleString("pt-BR", {
            weekday: "short",
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
        });
        row.appendChild(dateCell);

        // Adiciona a linha ao corpo da tabela
        tbody.appendChild(row);
    });

    // Adiciona o corpo à tabela
    table.appendChild(tbody);

    // Adiciona a tabela ao container principal
    mainContainer.appendChild(table);
}




