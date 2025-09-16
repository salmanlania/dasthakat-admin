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

const mergePDFs = async (quotationPDFBlob, titleText) => {
  const quotationPDFBytes = await quotationPDFBlob.arrayBuffer();
  const quotationPDF = await PDFDocument.load(quotationPDFBytes);

  const mergedPDF = await PDFDocument.create();
  const quotationPages = await mergedPDF.copyPages(quotationPDF, quotationPDF.getPageIndices());

  quotationPages.forEach((page) => mergedPDF.addPage(page));

  mergedPDF.setTitle(titleText);
  const finalPDFBytes = await mergedPDF.save();
  const finalBlob = new Blob([finalPDFBytes], { type: 'application/pdf' });
  const finalUrl = URL.createObjectURL(finalBlob);
  window.open(finalUrl, '_blank');
};

const fillEmptyRows = (rows, rowsPerPage, notesLength = 1) => {
  const rowsOnLastPage = rows.length % rowsPerPage;
  const emptyRowsNeeded = rowsOnLastPage ? rowsPerPage - rowsOnLastPage : 0;

  const totalRowsToAdd =
    emptyRowsNeeded < notesLength
      ? emptyRowsNeeded + rowsPerPage - notesLength
      : emptyRowsNeeded - notesLength;

  for (let i = 0; i < totalRowsToAdd; i++) {
    rows.push(['', '', '', '', '', '', '', '', '']);
  }

  return rows;
};

const fillEmptyRowsForNotes = (rows, rowsPerPage, notesRowsNeeded = 2) => {
  const rowsOnCurrentPage = rows.length % rowsPerPage;

  if (rowsOnCurrentPage > 0) {
    const emptyRowsToAdd = rowsPerPage - rowsOnCurrentPage - notesRowsNeeded;

    if (emptyRowsToAdd > 0) {
      for (let i = 0; i < emptyRowsToAdd; i++) {
        rows.push(['', '', '', '', '', '', '', '', '']);
      }
    }
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
  const boxX2 = sideMargin + boxWidth + 10;

  // Header labels
  // doc.rect(boxX1 - 2, 35, boxWidth + 4, headerHeight);
  doc.text('Bill To', boxX1, 40);
  // doc.rect(boxX2 - 2, 35, boxWidth + 4, headerHeight);
  doc.text('Ship To', boxX2, 40);

  doc.setFont('times', 'normal');

  // Bill To content
  const customerInfo = [
    data?.customer?.name,
    data?.vessel?.billing_address ? data?.vessel?.billing_address : null,
    data?.customer ? data?.customer?.address : null,
    data?.customer ? data?.customer?.billing_address : null
  ].filter(Boolean);

  const billTo = doc.splitTextToSize(customerInfo.join('\n'), boxWidth);
  const billToHeight = billTo.length * 4;

  // Ship To content
  const vesselInfo = [
    `${data?.vessel ? data?.vessel?.name : ''} ${data?.vessel?.name && data?.vessel?.billing_address ? '-' : ''} ${data?.vessel?.billing_address ? data?.vessel?.billing_address : ''}`,
  ].filter(Boolean).join('\n');

  const shipTo = doc.splitTextToSize(vesselInfo, boxWidth);
  const shipToHeight = shipTo.length * 4;

  // Determine max height to equalize box height
  const contentY = 42;
  const maxBoxHeight = Math.max(billToHeight, shipToHeight);

  // Draw content boxes
  // doc.rect(boxX1 - 2, contentY, boxWidth + 4, maxBoxHeight + 4);
  doc.text(billTo, boxX1, contentY + 4);

  // doc.rect(boxX2 - 2, contentY, boxWidth + 4, maxBoxHeight + 4);
  doc.text(shipTo, boxX2, contentY + 4);

  const invoiceY = contentY + 40

  // ESTIMATE
  doc.setFontSize(26);
  doc.setFont('times', 'bold');
  doc.text('PROFORMA', pageWidth / 2, invoiceY, {
    align: 'center'
  });
  doc.setDrawColor(32, 50, 114);
  doc.setLineWidth(0.6);
  // doc.line(pageWidth / 2 + 16, 64, 89, 64);
  doc.line(pageWidth / 2 - doc.getTextWidth('PROFORMA') / 2, invoiceY + 2, pageWidth / 2 + doc.getTextWidth('PROFORMA') / 2, invoiceY + 2);

  doc.setFont('times', 'normal');
  doc.setFontSize(10);

  // Table 1
  const table1Column = [
    'Date',
    'Charge #',
    'Event No.',
    "Customer's Reference",
    'Delivery Location',
    'S.O No.',
    'Payment Terms',
    'Ship Date'
  ];
  const table1Rows = [
    [
      data.document_date ? dayjs(data.document_date).format('MM-DD-YYYY') : '',
      data?.document_identity ? data?.document_identity : '',
      data?.event ? data?.event?.event_code : '',
      data?.customer_po_no ? data?.customer_po_no : '',
      data?.port ? data?.port?.name : '',
      data?.service_order ? data?.service_order?.document_identity : '',
      data?.quotation?.payment ? data?.quotation?.payment.name : '',
      data?.shipment
        ?
        (data?.shipment?.document_date === "1989-11-30"
          ? dayjs(data?.shipment?.document_date).format('MM-DD-YYYY')
          : data?.shipment?.document_date === "0000-00-00"
            ? 'TBA'
            : dayjs(data?.shipment?.document_date).format("MM-DD-YYYY"))
        : '',
    ]
  ];

  doc.autoTable({
    startY: invoiceY + 8,
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
      3: { cellWidth: 45 },
      4: { cellWidth: 35 },
      5: { cellWidth: 19 },
      6: { cellWidth: 19 },
      // 7: { cellWidth: 15 },
      8: { cellWidth: 22 },
      9: { cellWidth: 15 },
    },
    didParseCell: function (data) {
      data.cell.styles.minCellHeight = 7;
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

  // doc.setFont('times', 'normal');
  // const deliveryText =
  //   'Remit Payment to: Global Marine Safety Service Inc Frost Bank, ABA: 114000093, Account no: 502206269, SWIFT: FRSTUS44';
  // doc.text(deliveryText, pageWidth / 2, pageHeight, {
  //   align: 'center'
  // });
};

export const createProformaInvoicePrint = async (data) => {
  const doc = new jsPDF();
  doc.setTextColor(32, 50, 114);

  const sideMargin = 4;

  const descriptions = data.term_desc ? data.term_desc.split('\n') : [];
  const rowSpan = descriptions.length + 1;

  // Table 2
  const table2Column = [
    'S. No',
    'Description',
    'UOM',
    'QTY',
    'Price per Unit',
    'Gross Amount',
    'Discount %',
    'Discount Amount',
    'Net Amount'
  ];

  const table2Rows = [];
  if (data.charge_order_detail) {
    data.charge_order_detail.forEach((detail) => {
      const sr = detail.sort_order + 1;
      const description = `${detail?.product?.impa_code || ''}${detail?.product_description || ''}${detail?.description ? `\n \n${detail.description}` : ''}`;
      const quantity = detail.quantity ? formatThreeDigitCommas(parseFloat(detail.quantity)) : '0';
      const uom = detail.unit ? detail.unit.name : '';
      const pricePerUnit = detail.rate ? `$${formatThreeDigitCommas(detail.rate)}` : '0';
      // const grossAmount = detail?.gross_amount ? `$${formatThreeDigitCommas(detail?.gross_amount)}` : '0';
      const grossAmount = detail?.gross_amount ? `$${formatThreeDigitCommas(detail?.amount)}` : (!detail?.gross_amount || detail?.gross_amount === 0) ? `$${formatThreeDigitCommas(detail?.amount)}` : '0';
      const discountPercent = detail.discount_percent ? `${roundUpto(+detail.discount_percent)}%` : '0%';
      const discountAmount = detail.discount_amount ? `$${formatThreeDigitCommas(detail.discount_amount)}` : '0';
      // const netAmount = detail.amount
      //   ? `$${formatThreeDigitCommas(detail.amount)}`
      //   : '0';
      const netAmount = detail?.gross_amount ? `$${formatThreeDigitCommas(detail?.gross_amount)}` : !detail?.gross_amount ? `$${formatThreeDigitCommas(detail?.amount)}` : '0'
        ? `$${formatThreeDigitCommas(detail.amount)}`
        : 0;

      const row = [
        sr,
        {
          content: description,
          styles: { halign: 'left', valign: detail?.description?.trim() ? 'top' : 'middle' }
        },
        quantity,
        uom,
        { content: pricePerUnit, styles: { halign: 'right' } },
        { content: grossAmount, styles: { halign: 'right' } },
        { content: discountPercent, styles: { halign: 'right' } },
        { content: discountAmount, styles: { halign: 'right' } },
        { content: netAmount, styles: { halign: 'right' } }
      ];

      table2Rows.push(row);
    });
  }

  const totalAmountFromDetails = data?.charge_order_detail
    ? data?.charge_order_detail.reduce((sum, detail) => sum + (parseFloat(detail?.amount) || 0), 0)
    : 0;

  const totalDiscount = data?.charge_order_detail
    ? data?.charge_order_detail.reduce((sum, detail) => sum + (parseFloat(detail?.discount_amount) || 0), 0)
    : 0;

  const baseTotal = data.total_amount || totalAmountFromDetails;

  const finalTotal = baseTotal - totalDiscount;

  const netFinalAmount = data?.net_amount ? data?.net_amount : finalTotal;

  const totalGrossAmount = `$${formatThreeDigitCommas(netFinalAmount)}`;

  const estimatedNoteHeight = (descriptions.length + 2) * 10;

  const currentY = doc.previousAutoTable.finalY || 0;
  const pageHeight = doc.internal.pageSize.height;
  const bottomMargin = 30; // match your footer margin

  const spaceLeft = pageHeight - currentY - bottomMargin;

  if (spaceLeft < estimatedNoteHeight) {
    doc.addPage();
  }

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
  
  const filledRows = fillEmptyRows(table2Rows, 9, notes.length + 1);
  // const filledRows = fillEmptyRowsForNotes(table2Rows, 9, 2);
  filledRows.push(...notes);

  // Adding Table
  doc.autoTable({
    startY: 110,
    head: [table2Column],
    body: filledRows,
    margin: { left: sideMargin, right: sideMargin, bottom: 50, top: 110 },
    // pageBreak: 'auto', // Add this
    showHead: 'everyPage', // Add this to show header on every page
    tableLineWidth: 0.1,
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
      0: { cellWidth: 10 },
      1: { cellWidth: 80 },
      2: { cellWidth: 11 },
      3: { cellWidth: 10 },
      4: { cellWidth: 17 },
      5: { cellWidth: 19 },
      6: { cellWidth: 14 },
      7: { cellWidth: 14 },
      8: { cellWidth: 27 }
    },
    didParseCell: function (data) {
      data.cell.styles.minCellHeight = 13;
    }
  });

  // const totalAmountFromDetails = data?.charge_order_detail
  //   ? data?.charge_order_detail.reduce((sum, detail) => sum + (parseFloat(detail?.amount) || 0), 0)
  //   : 0;

  // const totalDiscount = data?.charge_order_detail
  //   ? data?.charge_order_detail.reduce((sum, detail) => sum + (parseFloat(detail?.discount_amount) || 0), 0)
  //   : 0;

  // const baseTotal = data.total_amount || totalAmountFromDetails;

  // const finalTotal = baseTotal - totalDiscount;

  // const netFinalAmount = data?.net_amount ? data?.net_amount : finalTotal;

  // const totalGrossAmount = `$${formatThreeDigitCommas(netFinalAmount)}`;

  // const estimatedNoteHeight = (descriptions.length + 2) * 10;

  // const currentY = doc.previousAutoTable.finalY || 0;
  // const pageHeight = doc.internal.pageSize.height;
  // const bottomMargin = 30; // match your footer margin

  // const spaceLeft = pageHeight - currentY - bottomMargin;

  // if (spaceLeft < estimatedNoteHeight) {
  //   doc.addPage();
  // }

  // let notes = [
  //   [
  //     {
  //       content: 'Remit Payment to: Global Marine Safety Service Inc\nFrost Bank, ABA: 114000093, Account no: 502206269, SWIFT: FRSTUS44',
  //       colSpan: 6,
  //       styles: {
  //         fontStyle: 'bold',
  //         fontSize: 9,
  //         halign: 'left',
  //       }
  //     },
  //     {
  //       content: 'USD Total:',
  //       colSpan: 2,
  //       styles: {
  //         fontStyle: 'bold',
  //         halign: 'right',
  //         fontSize: 13
  //       }
  //     },
  //     {
  //       content: totalGrossAmount,
  //       styles: {
  //         fontStyle: 'bold',
  //         halign: 'right',
  //         fontSize: 9
  //       }
  //     }
  //   ],
  //   [
  //     {
  //       content: 'Note: Any invoice discrepancies must be reported prior to invoice due date. Also please arrange payment in full by due date in order to avoid any late fee or additional charges. Appropriate wire fee must be included in order to avoid short payment resulting in additional charges.',
  //       colSpan: 9,
  //       styles: {
  //         fontStyle: 'italic',
  //         fontSize: 8,
  //         halign: 'center'
  //       }
  //     }
  //   ]
  // ];

  // doc.autoTable({
  //   startY: doc.previousAutoTable.finalY + 5,
  //   head: [],
  //   body: notes,
  //   margin: { left: sideMargin, right: sideMargin, bottom: 40, top: 110 },
  //   pageBreak: 'avoid',
  //   pageBreak: 'auto',
  //   rowPageBreak: 'avoid',
  //   styles: {
  //     lineWidth: 0.1,
  //     lineColor: [116, 116, 116],
  //     valign: 'middle',
  //     halign: 'center',
  //     font: 'times'
  //   },
  //   bodyStyles: {
  //     fontSize: 8,
  //     textColor: [32, 50, 114],
  //     fillColor: [255, 255, 255],
  //     valign: 'middle',
  //     halign: 'center'
  //   },
  //   alternateRowStyles: {
  //     fillColor: [255, 255, 255]
  //   },
  //   columnStyles: {
  //     0: { cellWidth: 25 },
  //     1: { cellWidth: 66 },
  //     2: { cellWidth: 10 },
  //     3: { cellWidth: 10 },
  //     4: { cellWidth: 17 },
  //     5: { cellWidth: 19 },
  //     6: { cellWidth: 14 },
  //     7: { cellWidth: 14 },
  //     8: { cellWidth: 27 }
  //   },
  //   didParseCell: (data) => {
  //     data.cell.styles.minCellHeight = 5;
  //   }
  // });

  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageSize = doc.internal.pageSize;
    const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
    const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();

    // Header
    addHeader(doc, data, pageWidth, sideMargin);

    // Footer
    addFooter(doc, pageWidth, pageHeight - 25);
  }

  const titleData = `Proforma- ${data?.document_identity ? data?.document_identity : ''} - ${data?.vessel?.name ? data?.vessel?.name : ''}`

  doc.setProperties({
    title: titleData
  });
  const pdfBlob = doc.output('blob');
  await mergePDFs(pdfBlob, `Proforma- ${titleData}`);
};
