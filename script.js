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
    const infoContainer = document.createElement("div");
    infoContainer.id = "info-container";
    document.body.prepend(infoContainer);

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.placeholder = "Enter QA Name";
    nameInput.style.display = "block";
    nameInput.style.marginBottom = "10px";
    document.body.prepend(nameInput);

    const downloadButton = document.createElement("button");
    downloadButton.textContent = "Download PDF";
    downloadButton.disabled = true;
    downloadButton.addEventListener("click", generatePDF);
    document.body.appendChild(downloadButton);

    nameInput.addEventListener("input", function () {
        downloadButton.disabled = nameInput.value.trim() === "";
    });

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
        
        const computerName = publicIP;
        infoContainer.innerHTML = `
            <p><strong>Date:</strong> ${currentDate} <strong>Time:</strong> ${currentTime}</p>
            <p><strong>Device/Public IP:</strong> ${computerName}</p>
        `;
    }
    updateInfo();

    const completionStatus = document.createElement("p");
    completionStatus.id = "completion-status";
    document.body.appendChild(completionStatus);

    const checkboxes = {};
    const notes = {};

    function updateCompletionStatus() {
        const totalItems = Object.keys(checkboxes).length;
        let completedItems = 0;
        
        Object.keys(checkboxes).forEach(test => {
            if (checkboxes[test].checked || notes[test].value.trim() !== "") {
                completedItems++;
            }
        });
        
        const percentage = ((completedItems / totalItems) * 100).toFixed(2);
        completionStatus.textContent = `Completion: ${percentage}%`;
    }

    testCases.forEach(section => {
        const sectionDiv = document.createElement("div");
        sectionDiv.innerHTML = `<h2>${section.category}</h2>`;

        section.tests.forEach(test => {
            const container = document.createElement("div");
            container.style.display = "flex";
            container.style.justifyContent = "space-between";
            container.style.alignItems = "center";

            const label = document.createElement("label");
            label.style.flex = "1";
            
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkboxes[test] = checkbox;
            checkbox.addEventListener("change", updateCompletionStatus);
            
            const noteInput = document.createElement("input");
            noteInput.type = "text";
            noteInput.placeholder = "Add notes here";
            noteInput.style.marginLeft = "10px";
            noteInput.style.flex = "1";
            notes[test] = noteInput;
            noteInput.addEventListener("input", updateCompletionStatus);
            
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(" " + test));
            container.appendChild(label);
            container.appendChild(noteInput);
            sectionDiv.appendChild(container);
            sectionDiv.appendChild(document.createElement("br"));
        });

        checklistContainer.appendChild(sectionDiv);
    });

    function generatePDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        let y = 15;

        const currentDate = new Date().toLocaleDateString();
        const currentTime = new Date().toLocaleTimeString();
        const computerName = infoContainer.textContent.split("Device/Public IP:")[1]?.trim() || "Unknown";
        const qaName = nameInput.value.trim();
        const completionPercentage = completionStatus.textContent;
        
        doc.setFont("helvetica");
        doc.setFontSize(10);
        doc.text(`QA Name: ${qaName}`, 10, y);
        y += 7;
        doc.text(`Date: ${currentDate}    Time: ${currentTime}`, 10, y);
        y += 7;
        doc.text(`Device/Public IP: ${computerName}`, 10, y);
        y += 10;
        doc.text(completionPercentage, 10, y);
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
