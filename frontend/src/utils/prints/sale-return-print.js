import dayjs from 'dayjs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { PDFDocument } from 'pdf-lib';

import GMSLogo from '../../assets/logo-with-title.png';
import Logo1 from '../../assets/quotation/logo1.png';
import Logo2 from '../../assets/quotation/logo2.png';
import Logo3 from '../../assets/quotation/logo3.png';
import Logo4 from '../../assets/quotation/logo4.png';
import Logo5 from '../../assets/quotation/logo5.png';
import Logo6 from '../../assets/quotation/logo6.png';
import Logo7 from '../../assets/quotation/logo7.png';

import { formatThreeDigitCommas, roundUpto } from '../number';
import { AiOutlineConsoleSql } from 'react-icons/ai';

const mergePDFs = async (quotationPDFBlob) => {
  const quotationPDFBytes = await quotationPDFBlob.arrayBuffer();
  const quotationPDF = await PDFDocument.load(quotationPDFBytes);

  // const termsPDFBytes = await fetch(QuotationTerms).then((res) => res.arrayBuffer());
  // const termsPDF = await PDFDocument.load(termsPDFBytes);

  const mergedPDF = await PDFDocument.create();
  const quotationPages = await mergedPDF.copyPages(quotationPDF, quotationPDF.getPageIndices());
  // const termsPages = await mergedPDF.copyPages(termsPDF, termsPDF.getPageIndices());

  // Add quotation pages first
  quotationPages.forEach((page) => mergedPDF.addPage(page));

  // Add terms pages at the end
  // termsPages.forEach((page) => mergedPDF.addPage(page));

  const finalPDFBytes = await mergedPDF.save();
  const finalBlob = new Blob([finalPDFBytes], { type: 'application/pdf' });
  const finalUrl = URL.createObjectURL(finalBlob);
  window.open(finalUrl, '_blank');
};

const fillEmptyRows = (rows, rowsPerPage, notesLength = 1) => {
  // Calculate how many rows are required to fill the current page
  const rowsOnLastPage = rows.length % rowsPerPage;
  const emptyRowsNeeded = rowsOnLastPage ? rowsPerPage - rowsOnLastPage : 0;

  // Adjust for notes if they exceed the available space
  const totalRowsToAdd =
    emptyRowsNeeded < notesLength
      ? emptyRowsNeeded + rowsPerPage - notesLength
      : emptyRowsNeeded - notesLength;

  // Add empty rows to the table
  for (let i = 0; i < totalRowsToAdd; i++) {
    rows.push(['', '', '', '', '', '']);
  }

  return rows;
};

const addHeader = (doc, data, pageWidth, sideMargin) => {
  doc.setFontSize(23);
  doc.setFont('times', 'bold');
  doc.text('Global Marine Safety - America', pageWidth / 2, 12, {
    align: 'center'
  });
  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  doc.text('9145 Wallisville Rd, Houston TX 77029, USA', pageWidth / 2, 18, {
    align: 'center'
  });
  doc.text(
    'Tel: 1 713-518-1715, Fax: 1 713-518-1760, Email: sales@gms-america.com',
    pageWidth / 2,
    22,
    {
      align: 'center'
    }
  );

  // Header LOGO
  doc.addImage(GMSLogo, 'PNG', 8, 1, 35, 26);

  doc.setFontSize(10);
  doc.setFont('times', 'bold');

  // Define common box width
  const boxWidth = 94;
  const headerHeight = 7;
  const boxX1 = sideMargin;
  const boxX2 = sideMargin + boxWidth + 10; // Add spacing between the boxes if needed

  // Header labels
  doc.rect(boxX1 - 2, 35, boxWidth + 4, headerHeight);
  doc.text('Bill To', boxX1, 40);
  doc.rect(boxX2 - 2, 35, boxWidth + 4, headerHeight);
  doc.text('Ship To', boxX2, 40);

  doc.setFont('times', 'normal');

  // Bill To content
  const customerInfo = [
    data?.charge_order?.customer?.name,
    data?.charge_order?.customer?.address,
    data?.charge_order?.vessel?.billing_address
  ].filter(Boolean);

  const billTo = doc.splitTextToSize(customerInfo.join('\n'), boxWidth);
  const billToHeight = billTo.length * 5;

  // Ship To content
  const vesselInfo = [
    data?.charge_order?.vessel?.name,
    data?.charge_order?.vessel?.billing_address
  ].filter(Boolean).join('\n');

  const shipTo = doc.splitTextToSize(vesselInfo, boxWidth);
  const shipToHeight = shipTo.length * 5;

  // Determine max height to equalize box height
  const contentY = 42;
  const maxBoxHeight = Math.max(billToHeight, shipToHeight);

  // Draw content boxes
  doc.rect(boxX1 - 2, contentY, boxWidth + 4, maxBoxHeight + 4);
  doc.text(billTo, boxX1, contentY + 4);

  doc.rect(boxX2 - 2, contentY, boxWidth + 4, maxBoxHeight + 4);
  doc.text(shipTo, boxX2, contentY + 4);

  // ESTIMATE
  doc.setFontSize(26);
  doc.setFont('times', 'bold');
  doc.text('CREDIT NOTE', pageWidth / 2, 76, {
    align: 'center'
  });
  doc.setDrawColor(32, 50, 114);
  doc.setLineWidth(0.6);
  // doc.line(pageWidth / 2 + 16, 64, 89, 64);
  doc.line(pageWidth / 2 - doc.getTextWidth('CREDIT NOTE') / 2, 78, pageWidth / 2 + doc.getTextWidth('CREDIT NOTE') / 2, 78);

  doc.setFont('times', 'normal');
  doc.setFontSize(10);

  // Table 1
  const table1Column = [
    'Date',
    'Invoice #',
    "Customer's Reference",
    'Payment Terms',
    'Delivery Location',
    'S.O No.',
    'Event No.',
    'Sales Rep',
    'Ship Date'
  ];
  const table1Rows = [
    [
      data.document_date ? dayjs(data.document_date).format('MM-DD-YYYY') : '',
      data.document_identity,
      data?.charge_order?.event.event_code,
      data?.charge_order?.quotation?.payment.name ? data?.charge_order?.quotation?.payment.name : '',
      data?.charge_order?.port?.name ? data?.charge_order?.port?.name : '',
      data?.charge_order ? data.charge_order?.document_identity : '',
      data?.charge_order ? data.charge_order?.event?.event_code : '',
      data?.charge_order ? data.charge_order?.salesman?.name : '',
      data?.shipment
        ? (data?.shipment?.document_date === "1989-11-30"
          ? dayjs(data?.shipment?.document_date).format('MM-DD-YYYY')
          : data?.shipment?.document_date === "0000-00-00"
            ? 'TBA'
            : dayjs(data?.shipment?.document_date).format("MM-DD-YYYY"))
        : '',
    ]
  ];

  doc.autoTable({
    startY: 82,
    head: [table1Column],
    body: table1Rows,
    margin: { left: sideMargin, right: sideMargin, bottom: 27 },
    headStyles: {
      halign: 'center',
      valign: 'middle',
      fontSize: 8,
      fontStyle: 'bold',
      textColor: [32, 50, 114],
      fillColor: [221, 217, 196]
    },
    styles: {
      font: 'times',
      halign: 'center',
      valign: 'middle',
      lineWidth: 0.1,
      lineColor: [116, 116, 116]
    },
    bodyStyles: {
      fontSize: 7,
      textColor: [32, 50, 114],
      fillColor: [255, 255, 255]
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255]
    },
    columnStyles: {
      0: { cellWidth: 19 },
      1: { cellWidth: 24 },
      2: { cellWidth: 22 },
      3: { cellWidth: 37 },
      4: { cellWidth: 25 },
      5: { cellWidth: 19 },
      6: { cellWidth: 19 },
      7: { cellWidth: 15 },
      8: { cellWidth: 22 },
      9: { cellWidth: 21 },
    },
    didParseCell: function (data) {
      data.cell.styles.minCellHeight = 9;
    }
  });
};

const addFooter = (doc, pageWidth, pageHeight) => {
  doc.addImage(Logo1, 'PNG', 8, pageHeight, 26, 22);
  doc.addImage(Logo2, 'PNG', 38, pageHeight + 6, 26, 10);
  doc.addImage(Logo3, 'PNG', 70, pageHeight + 2, 26, 16);
  doc.addImage(Logo4, 'PNG', 102, pageHeight + 4, 26, 16);
  doc.addImage(Logo5, 'PNG', 130, pageHeight, 32, 16);
  doc.addImage(Logo6, 'PNG', 164, pageHeight + 2, 14, 16);
  doc.addImage(Logo7, 'PNG', 182, pageHeight + 2, 14, 16);

  const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
  const totalPages = doc.internal.getNumberOfPages();

  doc.setFont('times', 'bolditalic');
  doc.text(
    currentPage === totalPages ? `Last page` : `Continue to page ${currentPage + 1}`,
    pageWidth / 2,
    pageHeight - 9.2,
    {
      align: 'center'
    }
  );

  doc.setFont('times', 'normal');
};

export const createSaleReturnPrint = async (data) => {
  const doc = new jsPDF();
  doc.setTextColor(32, 50, 114);

  const sideMargin = 4;

  const descriptions = data.term_desc ? data.term_desc.split('\n') : [];
  const rowSpan = descriptions.length + 1;

  // Table 2
  const table2Column = [
    'S. No',
    'Description',
    'Quantity',
    'UOM',
    'Unit Price',
    'Amount'
  ];

  const table2Rows = [];
  if (data.sale_return_detail) {
    data.sale_return_detail.forEach((detail) => {
      const sr = detail.sort_order + 1;
      const description = `${detail?.product_description || ''}${detail?.description ? `\n \n${detail.description}` : ''}`;
      const quantity = detail.quantity ? formatThreeDigitCommas(parseFloat(detail.quantity)) : '';
      const uom = detail.unit ? detail.unit.name : '';
      const pricePerUnit = detail.rate ? `$${formatThreeDigitCommas(detail.rate)}` : '';
      const netAmount = detail.amount
        ? `$${formatThreeDigitCommas(detail.amount)}`
        : '';

      const row = [
        sr,
        {
          content: description,
          styles: { halign: 'left', valign: detail?.description?.trim() ? 'top' : 'middle' }
        },
        quantity,
        uom,
        { content: pricePerUnit, styles: { halign: 'right' } },
        { content: netAmount, styles: { halign: 'right' } }
      ];

      table2Rows.push(row);
    });
  }

  const filledRows = fillEmptyRows(table2Rows, 11, descriptions.length + 1);

  // Adding Table
  doc.autoTable({
    startY: 101,
    head: [table2Column],
    body: filledRows,
    margin: { left: sideMargin, right: sideMargin, bottom: 32, top: 84 },
    headStyles: {
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle',
      textColor: [32, 50, 114],
      fillColor: [221, 217, 196]
    },
    styles: {
      halign: 'center',
      valign: 'middle',
      font: 'times',
      fontSize: 8,
      lineWidth: 0.1,
      lineColor: [116, 116, 116]
    },
    bodyStyles: {
      textColor: [32, 50, 114],
      fillColor: [255, 255, 255]
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255]
    },
    rowPageBreak: 'avoid',

    columnStyles: {
      0: { cellWidth: 12 },
      1: { cellWidth: 110 },
      2: { cellWidth: 20 },
      3: { cellWidth: 20 },
      4: { cellWidth: 20 },
      5: { cellWidth: 20 },
      6: { cellWidth: 20 }
    },
    didParseCell: function (data) {
      data.cell.styles.minCellHeight = 13;
    }
  });

  // Total Amounts
  const totalGrossAmount = data.total_amount ? `$${formatThreeDigitCommas(data.total_amount)}` : '';

  let notes = [
    [
      {
        content: 'Remit Payment to: Global Marine Safety Service Inc\nFrost Bank, ABA: 114000093, Account no: 502206269, SWIFT: FRSTUS44',
        colSpan: 6,
        styles: {
          fontStyle: 'bold',
          fontSize: 9,
          halign: 'left',
        }
      },
      {
        content: 'USD Total:',
        colSpan: 2,
        styles: {
          fontStyle: 'bold',
          halign: 'right',
          fontSize: 13
        }
      },
      {
        content: totalGrossAmount,
        styles: {
          fontStyle: 'bold',
          halign: 'right',
          fontSize: 9
        }
      }
    ],
    [
    {
      content: 'Note: Any invoice discrepancies must be reported prior to invoice due date. Also please arrange payment in full by due date in order to avoid any late fee or additional charges. Appropriate wire fee must be included in order to avoid short payment resulting in additional charges.',
      colSpan: 9,
      styles: {
        fontStyle: 'italic',
        fontSize: 8,
        halign: 'center'
      }
    }
  ]
  ];

  // notes.push([
  //   {
  //     content: 'Notes:',
  //     rowSpan: rowSpan,
  //     styles: {
  //       fontSize: 9,
  //       fontStyle: 'bold'
  //     }
  //   },
  //   {
  //     content: 'Note: Any invoice discrepancies must be reported prior to invoice due date. Also please arrange payment in full by due date in order to avoid any late fee or additional charges. Appropriate wire fee must be included in order to avoid short payment resulting in additional charges.',
  //     colSpan: 8,
  //     styles: {
  //       halign: 'left',
  //       fontStyle: 'italic',
  //       fontSize: 8
  //     }
  //   }
  // ]);

  doc.autoTable({
    startY: doc.previousAutoTable.finalY,
    head: [],
    body: notes,
    margin: { left: sideMargin, right: sideMargin, bottom: 27, top: 84 },
    styles: {
      lineWidth: 0.1,
      lineColor: [116, 116, 116],
      valign: 'middle',
      halign: 'center',
      font: 'times'
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [32, 50, 114],
      fillColor: [255, 255, 255],
      valign: 'middle',
      halign: 'center'
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255]
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 66 },
      2: { cellWidth: 10 },
      3: { cellWidth: 10 },
      4: { cellWidth: 17 },
      5: { cellWidth: 19 },
      6: { cellWidth: 14 },
      7: { cellWidth: 14 },
      8: { cellWidth: 27 }
    },
    didParseCell: (data) => {
      data.cell.styles.minCellHeight = 9;
    }
  });

  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageSize = doc.internal.pageSize;
    const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
    const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();

    // Header
    addHeader(doc, data, pageWidth, sideMargin);

    // Footer
    // addFooter(doc, pageWidth, pageHeight - 25);
  }

  doc.setProperties({
    title: `Quotation - ${data.document_identity}`
  });
  const pdfBlob = doc.output('blob');
  await mergePDFs(pdfBlob);
};
