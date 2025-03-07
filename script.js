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
    const downloadButton = document.createElement("button");
    downloadButton.textContent = "Download PDF";
    downloadButton.addEventListener("click", generatePDF);
    document.body.appendChild(downloadButton);

    const checkboxes = {};

    testCases.forEach(section => {
        const sectionDiv = document.createElement("div");
        sectionDiv.innerHTML = `<h2>${section.category}</h2>`;

        section.tests.forEach(test => {
            const label = document.createElement("label");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkboxes[test] = checkbox;

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(" " + test));
            sectionDiv.appendChild(label);
            sectionDiv.appendChild(document.createElement("br"));
        });

        checklistContainer.appendChild(sectionDiv);
    });

    function generatePDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        let y = 10;

        // Add date, time, and computer name at the top
        const currentDate = new Date().toLocaleDateString();
        const currentTime = new Date().toLocaleTimeString();
        const computerName = window.navigator.userAgent; // Limited browser info as hostname isn't accessible via JS
        
        doc.text(`Date: ${currentDate} Time: ${currentTime}`, 10, y);
        y += 7;
        doc.text(`Device: ${computerName}`, 10, y);
        y += 10;

        doc.setFont("helvetica");
        doc.text("EMV Application Testing Checklist", 10, y);
        y += 10;

        testCases.forEach(section => {
            doc.text(section.category, 10, y);
            y += 10;
            section.tests.forEach(test => {
                const checkboxMark = checkboxes[test].checked ? "[X]" : "[ ]";
                doc.text(`${checkboxMark} ${test}`, 15, y);
                y += 7;
            });
            y += 5;
        });

        doc.save("EMV_Testing_Checklist.pdf");
    }
});
