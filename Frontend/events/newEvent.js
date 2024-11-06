function showErrorMessage(message) {
    const mb = document.getElementById("messageBox");
    document.getElementById("message").innerHTML = message;
    mb.style.display = "block";
}

function submitEvent() {
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const category = document.getElementById("category").value.trim();
    const eventDate = document.getElementById("eventDate").value;
    const startDate = document.getElementById("startDate").value;
    const startHour = document.getElementById("startHour").value;
    const endDate = document.getElementById("endDate").value;
    const endHour = document.getElementById("endHour").value;

    // Validação básica
    if (!title || !description || !category || !eventDate || !startDate || !startHour || !endDate || !endHour) {
        showErrorMessage("Please fill in all fields.");
        return;
    }

    // Limpa a mensagem de erro ao enviar com sucesso
    document.getElementById("messageBox").style.display = "none";
    alert("Event created successfully!");

    // Coloque aqui a lógica para salvar o evento
}
