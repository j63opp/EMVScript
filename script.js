function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 10;

    doc.setFont("helvetica"); // Set a standard font to avoid encoding issues
    doc.text("EMV Application Testing Checklist", 10, y);
    y += 10;

    testCases.forEach(section => {
        doc.text(section.category, 10, y);
        y += 10;
        section.tests.forEach(test => {
            const checkboxMark = checkboxes[test].checked ? "[X]" : "[ ]"; // ASCII checkboxes
            doc.text(`${checkboxMark} ${test}`, 15, y);
            y += 7;
        });
        y += 5;
    });

    doc.save("EMV_Testing_Checklist.pdf");
}
