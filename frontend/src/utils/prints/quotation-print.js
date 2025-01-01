import dayjs from "dayjs";
import jsPDF from "jspdf";
import "jspdf-autotable";

import GMSLogo from "../../assets/logo-with-title.png";
import Logo1 from "../../assets/quotationPrintLogo/logo1.png";
import Logo2 from "../../assets/quotationPrintLogo/logo2.png";
import Logo3 from "../../assets/quotationPrintLogo/logo3.png";
import Logo4 from "../../assets/quotationPrintLogo/logo4.png";
import Logo5 from "../../assets/quotationPrintLogo/logo5.png";
import Logo6 from "../../assets/quotationPrintLogo/logo6.png";

import { formatThreeDigitCommas, roundUpto } from "../number";

export const createQuotationPrint = (data) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setTextColor(32, 50, 114);

  const sideMargin = 4;

  // Header
  doc.setFontSize(20);
  doc.setFont("times", "bold");
  doc.text("Global Marine Safety - America", pageWidth / 2, 12, {
    align: "center",
  });
  doc.setFont("times", "normal");
  doc.setFontSize(10);
  doc.text("9145 Wallisville Rd, Houston TX 77029, USA", pageWidth / 2, 18, {
    align: "center",
  });
  doc.text(
    "Tel: 1 713-518-1715, Fax: 1 713-518-1760, Email: sales@gms-america.com",
    pageWidth / 2,
    22,
    {
      align: "center",
    }
  );

  // Header LOGO
  doc.addImage(GMSLogo, "PNG", 8, 1, 35, 26);

  // Bill To and Ship To
  doc.setFontSize(10);
  doc.setFont("times", "bold");
  doc.text("Bill To", sideMargin, 40);
  doc.text("Ship To", 140, 40);
  doc.setFont("times", "normal");

  const billTo = doc.splitTextToSize(
    `${data.customer ? `${data.customer.name},` : ""}\n${
      data.vessel ? data.vessel.billing_address || "" : ""
    }`,
    120
  );
  doc.text(billTo, sideMargin, 45);

  const shipTo = doc.splitTextToSize(
    data.customer ? data.customer.name : "",
    68
  );
  doc.text(shipTo, 140, 45);

  doc.setFontSize(16);
  doc.setFont("times", "bold");
  doc.text("ESTIMATE", pageWidth / 2, 62, {
    align: "center",
  });
  doc.setFont("times", "normal");
  doc.setFontSize(10);

  // Table 1
  const table1Column = [
    "Quote Date",
    "Quote Number",
    "Customer's Reference",
    "Delivery Location",
    "Payment Terms",
    "Flag",
    "Class",
    "ETA",
  ];
  const table1Rows = [
    [
      data.document_date ? dayjs(data.document_date).format("DD-MM-YYYY") : "",
      data.document_identity,
      data.customer_ref,
      data.delivery,
      data.payment ? data.payment.name : "",
      data.flag ? data.flag.name : "",
      `${data.class1 ? `${data.class1.name},` : ""} ${
        data.class2 ? data.class2.name : ""
      }`,
      "TBA",
    ],
  ];

  doc.autoTable({
    startY: 66,
    head: [table1Column],
    body: table1Rows,
    margin: { left: sideMargin, right: sideMargin },
    headStyles: {
      fontSize: 8,
      fontStyle: "bold",
      textColor: [32, 50, 114],
      fillColor: [221, 217, 196],
    },
    styles: {
      lineWidth: 0.1,
      lineColor: [116, 116, 116],
    },
    bodyStyles: {
      textColor: [32, 50, 114],
      fillColor: [255, 255, 255],
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255],
      fontSize: 7,
    },
    columnStyles: {
      0: { cellWidth: 21 },
      1: { cellWidth: 24 },
      2: { cellWidth: 35 },
      3: { cellWidth: 28 },
      4: { cellWidth: 25 },
      5: { cellWidth: 23 },
      6: { cellWidth: 19 },
      7: { cellWidth: 27 },
    },
  });

  // Table 2
  const table2Column = [
    "S. No",
    "Description",
    "UOM",
    "QTY",
    "Price per Unit",
    "Gross Amount",
    "Discount %",
    "Net Amount",
  ];

  const table2Rows = data.quotation_detail
    ? data.quotation_detail.map((detail) => {
        const sr = detail.sort_order + 1;
        const description = detail.product ? detail.product.name : "";
        const uom = detail.unit ? detail.unit.name : "";
        const quantity = detail.quantity
          ? formatThreeDigitCommas(detail.quantity)
          : "";
        const pricePerUnit = detail.rate
          ? formatThreeDigitCommas(detail.rate)
          : "";
        const grossAmount = detail.amount
          ? formatThreeDigitCommas(detail.amount)
          : "";
        const discountPercent = detail.discount_percent
          ? `${roundUpto(+detail.discount_percent)}%`
          : "";
        const netAmount = detail.gross_amount
          ? formatThreeDigitCommas(detail.gross_amount)
          : "";

        return [
          sr,
          description,
          uom,
          quantity,
          pricePerUnit,
          grossAmount,
          discountPercent,
          netAmount,
        ];
      })
    : [];

  // Adding Table
  doc.autoTable({
    startY: doc.previousAutoTable.finalY,
    head: [table2Column],
    body: table2Rows,
    margin: { left: sideMargin, right: sideMargin },
    headStyles: {
      fontSize: 8,
      fontStyle: "bold",
      textColor: [32, 50, 114],
      fillColor: [221, 217, 196],
    },
    styles: {
      lineWidth: 0.1,
      lineColor: [116, 116, 116],
    },
    bodyStyles: {
      textColor: [32, 50, 114],
      fillColor: [255, 255, 255],
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255],
      fontSize: 9,
    },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 65 },
      2: { cellWidth: 14 },
      3: { cellWidth: 14 },
      4: { cellWidth: 25 },
      5: { cellWidth: 23 },
      6: { cellWidth: 19 },
      7: { cellWidth: 27 },
    },
  });

  const descriptions = data.term_desc ? data.term_desc.split("\n") : [];
  const rowSpan = descriptions.length + 1;
  const netAmount = data.net_amount
    ? formatThreeDigitCommas(data.net_amount)
    : "";
  const notes = data.term_desc
    ? descriptions.map((note, index) => {
        if (index === 0) {
          return [
            {
              content: "Notes:",
              rowSpan: rowSpan,
            },
            {
              content: note || "",
              styles: {
                halign: "left",
              },
            },
            {
              content: "Grand Total",
              rowSpan: rowSpan,
            },
            {
              content: netAmount,
              rowSpan: rowSpan,
            },
          ];
        }

        return [
          {
            content: note || "",
            styles: {
              halign: "left",
            },
          },
        ];
      })
    : [
        [
          {
            content: "Notes:",
          },
          {
            content: "",
            styles: {
              halign: "left",
            },
          },
          {
            content: "Grand Total",
          },
          {
            content: netAmount,
          },
        ],
      ];

  doc.autoTable({
    startY: doc.previousAutoTable.finalY,
    head: [],
    body: notes,
    margin: { left: sideMargin, right: sideMargin },
    styles: {
      lineWidth: 0.1,
      lineColor: [116, 116, 116],
      valign: "middle",
      halign: "center",
    },
    bodyStyles: {
      textColor: [32, 50, 114],
      fillColor: [255, 255, 255],
      valign: "middle",
      halign: "center",
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255],
      fontSize: 9,
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 108 },
      2: { cellWidth: 42 },
      3: { cellWidth: 27 },
    },
    didParseCell: (data) => {
      const rowIndex = data.row.index;
      const columnIndex = data.column.index;
      if (
        rowIndex === 0 &&
        (columnIndex === 0 || columnIndex === 3 || columnIndex === 2)
      ) {
        data.cell.styles.fontSize = 12;
        data.cell.styles.fontStyle = "bold";
      }
    },
  });

  // Footer logo
  doc.addImage(Logo1, "PNG", 8, doc.previousAutoTable.finalY, 26, 22);
  doc.addImage(Logo2, "PNG", 38, doc.previousAutoTable.finalY + 6, 26, 10);
  doc.addImage(Logo3, "PNG", 70, doc.previousAutoTable.finalY + 2, 26, 16);
  doc.addImage(Logo4, "PNG", 102, doc.previousAutoTable.finalY + 4, 26, 16);
  doc.addImage(Logo5, "PNG", 130, doc.previousAutoTable.finalY, 32, 16);
  doc.addImage(Logo6, "PNG", 164, doc.previousAutoTable.finalY + 2, 14, 16);

  const deliveryText =
    "Remit Payment to: Global Marine Safety Service Inc Frost Bank, ABA: 114000093, Account no: 502206269, SWIFT: FRSTUS44";
  const maxWidth = pageWidth - sideMargin * 2;
  const lines = doc.splitTextToSize(deliveryText, maxWidth);
  doc.text(lines, pageWidth / 2, doc.previousAutoTable.finalY + 30, {
    align: "center",
  });

  doc.setProperties({
    title: "Quotation - 0014",
  });
  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob, {});
  window.open(pdfUrl, "_blank");
};
