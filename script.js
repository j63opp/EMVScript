document.addEventListener("DOMContentLoaded", function () {
    const testCases = [
        {
            category: "Application Launch & Initialization",
            tests: [
                "Verify that the EMV application launches without crashes.",
                "Confirm that the application initializes all required services (card reader, network, security modules).",
                "Check that the application displays the correct version number."
            ]
        },
        {
            category: "Card Detection & Transaction Initiation",
            tests: [
                "Insert a chip card and verify that it is detected correctly.",
                "Verify that the application retrieves card data and displays the correct card type.",
                "Confirm that the application prompts for required user actions (PIN entry, signature, etc.).",
                "Attempt a transaction with an expired card and check if it is declined."
            ]
        },
        {
            category: "Payment Processing & Authorization",
            tests: [
                "Process an online-authorized transaction and verify approval.",
                "Simulate a declined transaction and check if the correct decline reason is displayed.",
                "Perform an offline-approved transaction (if supported) and verify receipt printing.",
                "Check if authorization times are within acceptable limits."
            ]
        }
    ];

    const checklistContainer = document.getElementById("checklist");

    // Create a container for the input and button
    const inputButtonContainer = document.createElement("div");
    inputButtonContainer.style.marginBottom = "20px";

    // Create the QA name input field
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.placeholder = "Enter QA Name";
    nameInput.style.marginBottom = "10px";
    nameInput.style.padding = "10px";
    nameInput.style.fontSize = "16px";
    nameInput.style.width = "200px";
    nameInput.style.border = "1px solid #ccc";
    nameInput.style.borderRadius = "5px";

    // Create the download button
    const downloadButton = document.createElement("button");
    downloadButton.textContent = "Download PDF";
    downloadButton.disabled = true;
    downloadButton.style.padding = "10px";
    downloadButton.style.fontSize = "16px";
    downloadButton.style.backgroundColor = "#007bff";
    downloadButton.style.color = "white";
    downloadButton.style.border = "none";
    downloadButton.style.borderRadius = "5px";
    downloadButton.style.cursor = "pointer";
    downloadButton.addEventListener("click", generatePDF);

    // Add the input and button to the container
    inputButtonContainer.appendChild(nameInput);
    inputButtonContainer.appendChild(downloadButton);

    // Add the container to the body
    document.body.prepend(inputButtonContainer);

    // Enable/disable the download button based on QA name input
    nameInput.addEventListener("input", function () {
        downloadButton.disabled = nameInput.value.trim() === "";
    });

    // Create the info container
    const infoContainer = document.createElement("div");
    infoContainer.id = "info-container";
    infoContainer.style.marginBottom = "20px";
    infoContainer.style.padding = "10px";
    infoContainer.style.backgroundColor = "#f9f9f9";
    infoContainer.style.border = "1px solid #ddd";
    infoContainer.style.borderRadius = "5px";
    document.body.insertBefore(infoContainer, checklistContainer);

    // Update the info container with date, time, and public IP
    async function updateInfo() {
        const currentDate = new Date().toLocaleDateString();
        const currentTime = new Date().toLocaleTimeString();
        let publicIP = "Unknown";

        try {
            const response = await fetch('https://api64.ipify.org?format=json');
            const data = await response.json();
            publicIP = data.ip;
        } catch (error) {
            console.error("Error fetching public IP:", error);
        }

        const qaName = nameInput.value.trim() || "Not provided";
        infoContainer.innerHTML = `
            <p><strong>Date:</strong> ${currentDate} <strong>Time:</strong> ${currentTime}</p>
            <p><strong>Device/Public IP:</strong> ${publicIP}</p>
            <p><strong>QA Name:</strong> ${qaName}</p>
        `;
    }

    // Update the info container whenever the QA name changes
    nameInput.addEventListener("input", updateInfo);
    updateInfo();

    // Create a progress bar
    const progressBarContainer = document.createElement("div");
    progressBarContainer.id = "progress-bar-container";
    progressBarContainer.style.width = "100%";
    progressBarContainer.style.height = "20px";
    progressBarContainer.style.backgroundColor = "#f3f3f3";
    progressBarContainer.style.borderRadius = "10px";
    progressBarContainer.style.marginTop = "10px";

    const progressBar = document.createElement("div");
    progressBar.id = "progress-bar";
    progressBar.style.height = "100%";
    progressBar.style.backgroundColor = "#007bff";
    progressBar.style.borderRadius = "10px";
    progressBar.style.width = "0%";

    progressBarContainer.appendChild(progressBar);
    document.body.insertBefore(progressBarContainer, checklistContainer);

    // Track completion status
    const checkboxes = {};
    const notes = {};

    function updateCompletionStatus() {
        const totalItems = Object.keys(checkboxes).length;
        let completedItems = 0;

        Object.keys(checkboxes).forEach(test => {
            if (checkboxes[test].checked) {
                completedItems++;
            }
        });

        const percentage = ((completedItems / totalItems) * 100).toFixed(2);
        progressBar.style.width = `${percentage}%`;
    }

    // Render the checklist
    testCases.forEach(section => {
        const sectionDiv = document.createElement("div");
        sectionDiv.style.marginBottom = "20px";
        sectionDiv.style.padding = "10px";
        sectionDiv.style.backgroundColor = "#fff";
        sectionDiv.style.border = "1px solid #ddd";
        sectionDiv.style.borderRadius = "5px";

        const sectionHeader = document.createElement("h2");
        sectionHeader.textContent = section.category;
        sectionHeader.style.marginBottom = "10px";
        sectionHeader.style.color = "#333";
        sectionDiv.appendChild(sectionHeader);

        section.tests.forEach(test => {
            const container = document.createElement("div");
            container.style.display = "flex";
            container.style.justifyContent = "space-between";
            container.style.alignItems = "center";
            container.style.marginBottom = "10px";

            const label = document.createElement("label");
            label.style.flex = "1";
            label.style.color = "#555";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkboxes[test] = checkbox;
            checkbox.addEventListener("change", updateCompletionStatus);

            const noteInput = document.createElement("input");
            noteInput.type = "text";
            noteInput.placeholder = "Add notes here";
            noteInput.style.marginLeft = "10px";
            noteInput.style.flex = "1";
            noteInput.style.padding = "5px";
            noteInput.style.border = "1px solid #ccc";
            noteInput.style.borderRadius = "5px";
            notes[test] = noteInput;
            noteInput.addEventListener("input", updateCompletionStatus);

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(" " + test));
            container.appendChild(label);
            container.appendChild(noteInput);
            sectionDiv.appendChild(container);
        });

        checklistContainer.appendChild(sectionDiv);
    });

    // Validate the checklist before generating the PDF
    function validateChecklist() {
        let isValid = true;
        Object.keys(checkboxes).forEach(test => {
            if (!checkboxes[test].checked && notes[test].value.trim() === "") {
                isValid = false;
                notes[test].style.border = "1px solid red"; // Highlight missing notes
            } else {
                notes[test].style.border = ""; // Reset border
            }
        });
        return isValid;
    }

    // Generate the PDF
    function generatePDF() {
        if (!validateChecklist()) {
            alert("Please add notes for failed tests before generating the PDF.");
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        let y = 15;

        const currentDate = new Date().toLocaleDateString();
        const currentTime = new Date().toLocaleTimeString();
        const publicIP = infoContainer.textContent.split("Device/Public IP:")[1]?.split("QA Name:")[0].trim() || "Unable to fetch public IP";
        const qaName = nameInput.value.trim() || "Not provided";
        const completionPercentage = ((Object.values(checkboxes).filter(checkbox => checkbox.checked).length / Object.keys(checkboxes).length) * 100).toFixed(2);

        doc.setFont("helvetica");
        doc.setFontSize(10);
        doc.text(`Date: ${currentDate}    Time: ${currentTime}`, 10, y);
        y += 7;
        doc.text(`Device/Public IP: ${publicIP}`, 10, y);
        y += 7;
        doc.text(`QA Name: ${qaName}`, 10, y);
        y += 10;
        doc.text(`Completion: ${completionPercentage}%`, 10, y);
        y += 10;

        doc.setFontSize(14);
        doc.text("EMV Application Testing Checklist", 10, y);
        y += 10;

        doc.setFontSize(12);
        testCases.forEach(section => {
            doc.text(section.category, 10, y);
            y += 7;
            section.tests.forEach(test => {
                const checkboxMark = checkboxes[test].checked ? "[X]" : "[ ]";
                const noteText = notes[test].value ? ` - Notes: ${notes[test].value}` : "";
                doc.text(`${checkboxMark} ${test}${noteText}`, 15, y);
                y += 6;
            });
            y += 5;
        });

        doc.save("EMV_Testing_Checklist.pdf");
    }
});
