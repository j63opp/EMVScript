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

    testCases.forEach(section => {
        const sectionDiv = document.createElement("div");
        sectionDiv.innerHTML = `<h2>${section.category}</h2>`;

        section.tests.forEach(test => {
            const label = document.createElement("label");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(" " + test));
            sectionDiv.appendChild(label);
            sectionDiv.appendChild(document.createElement("br"));
        });

        checklistContainer.appendChild(sectionDiv);
    });
});
