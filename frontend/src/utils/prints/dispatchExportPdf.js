import jsPDF from "jspdf";
import "jspdf-autotable";

export const dispatchExportPdf = (data, columns) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Global Marine Safety - America", doc.internal.pageSize.getWidth() / 2, 10, {
        align: "center",
    });

    // ✅ Add Subheading
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("SCHEDULING", doc.internal.pageSize.getWidth() / 2, 18, {
        align: "center",
    }); 

    const extractTitleText = (col) => {
        const title = col.header;
        return title;
    };

    const tableColumn = columns.map((col) => extractTitleText(col));

    const tableRows = data.map((row, rowIndex) =>
        columns.map((col) => {
            if (col.accessor) {
                const value = row[col.accessor];
                return value;
            }
            return typeof col.render === "function" ? col.render(null, row) : "";
        })
    );

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
    });

    doc.save("Scheduling.pdf");
};
