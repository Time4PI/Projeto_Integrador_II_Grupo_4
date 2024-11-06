function toggleFields() {
    const withdrawMethod = document.getElementById("withdrawMethod").value;
    const pixFields = document.getElementById("pixFields");
    const bankFields = document.getElementById("bankFields");

    if (withdrawMethod === "pix") {
        pixFields.classList.remove("hidden");
        bankFields.classList.add("hidden");
    } else if (withdrawMethod === "bankAccount") {
        pixFields.classList.add("hidden");
        bankFields.classList.remove("hidden");
    } else {
        pixFields.classList.add("hidden");
        bankFields.classList.add("hidden");
    }
}

function showErrorMessage(message) {
    const mb = document.getElementById("messageBox");
    document.getElementById("message").innerHTML = message;
    mb.style.display = "block";
}

function submitWithdraw() {
    const withdrawMethod = document.getElementById("withdrawMethod").value;
    const value = document.getElementById("value").value.trim();

    if (!value) {
        showErrorMessage("Please enter a value.");
        return;
    }

    if (withdrawMethod === "pix") {
        const pixKey = document.getElementById("pixKey").value.trim();
        if (!pixKey) {
            showErrorMessage("Please enter a PIX key.");
            return;
        }
    } else if (withdrawMethod === "bankAccount") {
        const accountNumber = document.getElementById("accountNumber").value.trim();
        const bankNumber = document.getElementById("bankNumber").value.trim();
        const agencyNumber = document.getElementById("agencyNumber").value.trim();

        if (!accountNumber || !bankNumber || !agencyNumber) {
            showErrorMessage("Please fill in all bank account details.");
            return;
        }
    } else {
        showErrorMessage("Please select a withdrawal method.");
        return;
    }

    document.getElementById("messageBox").style.display = "none"; // Hide message on successful submission
    alert("Withdrawal submitted successfully!");
    // Add any further submission logic here
}
