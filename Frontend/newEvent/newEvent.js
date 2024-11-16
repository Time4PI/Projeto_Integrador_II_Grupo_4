function showErrorMessage(message) {
    const mb = document.getElementById("messageBox");
    document.getElementById("message").innerHTML = message;
    mb.style.display = "block";
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


async function submitEvent() {
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const category = document.getElementById("category").value.trim();
    const eventDate = document.getElementById("eventDate").value;
    const startDate = document.getElementById("startDate").value;
    const startHour = document.getElementById("startHour").value;
    const endDate = document.getElementById("endDate").value;
    const endHour = document.getElementById("endHour").value;
    const creatorToken = localStorage.getItem('authToken');

    // Validação básica
    if (!title || !description || !category || !eventDate || !startDate || !startHour || !endDate || !endHour) {
        showErrorMessage("Preencha todos os campos.");
        return;
    }

    // Transformação de hora de HH:MM para HH:MM:SS
    function formatTime(timeStr) {
        return `${timeStr}:00`;
    }

    const formattedEndHour = formatTime(endHour);

    // Headers a serem enviados
    let headers = {
        'title': title,
        'description': description,
        'category': category,
        'eventDate': eventDate,
        'startDate': startDate,
        'startHour': startHour,
        'endDate': endDate,
        'endHour': endHour,
        'creatorToken': creatorToken
    };

    try {
        const response = await fetch("http://localhost:3000/addNewEvent", {
            method: 'PUT',
            headers: headers
        });

        if (!response.ok) {
            const errorText = await response.text();
            showErrorMessage(errorText);
            throw new Error(`Erro HTTP! Status: ${response.status}, Mensagem: ${errorText}`);
        }

        const resultText = await response.text();
        console.info(`Resposta: ${resultText}`);
        showSucessMessage("Evento cadastrado com sucesso!");

        // Redirecionamento ou outras ações após o sucesso
        setTimeout(() => {
            window.location.href = "../home_page/";
        }, 2000);

    } catch (error) {
        console.error('Erro ao cadastrar evento:', error);
        showErrorMessage("Erro ao cadastrar evento. Tente novamente.");
    }
}



