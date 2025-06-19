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
import { calculateTimeDifference, millisecondsToReadable } from '../dateTime';

const fillEmptyRows = (rows, rowsPerPage, extraRows = 1) => {
  // Calculate how many rows are required to fill the current page
  const rowsOnLastPage = rows.length % rowsPerPage;
  const emptyRowsNeeded = rowsOnLastPage ? rowsPerPage - rowsOnLastPage : 0;

  // Adjust for notes if they exceed the available space
  const totalRowsToAdd =
    emptyRowsNeeded < extraRows
      ? emptyRowsNeeded + rowsPerPage - extraRows
      : emptyRowsNeeded - extraRows;

  // Add empty rows to the table
  for (let i = 0; i < totalRowsToAdd; i++) {
    rows.push(['', '', '', '', '', '', '', '']);
  }

  return rows;
};

const addHeader = (doc, data, pageWidth, sideMargin) => {
  doc.setFontSize(20);
  doc.setFont('times', 'bold');
  doc.text('Global Marine Safety - America', pageWidth / 2, 12, {
    align: 'center',
  });
  doc.setFont('times', 'normal');
  doc.setFontSize(10);
  doc.text('9145 Wallisville Rd, Houston TX 77029, USA', pageWidth / 2, 18, {
    align: 'center',
  });
  doc.text(
    'Tel: 1 713-518-1715, Fax: 1 713-518-1760, Email: sales@gms-america.com',
    pageWidth / 2,
    22,
    {
      align: 'center',
    },
  );

  // Header LOGO
  doc.addImage(GMSLogo, 'PNG', 8, 1, 35, 26);
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
      align: 'center',
    },
  );

  doc.setFont('times', 'normal');
  const deliveryText =
    'Remit Payment to: Global Marine Safety Service Inc Frost Bank, ABA: 114000093, Account no: 502206269, SWIFT: FRSTUS44';
  doc.text(deliveryText, pageWidth / 2, pageHeight, {
    align: 'center',
  });
};

export const createBidResponsePrint = async (data) => {
  const doc = new jsPDF();
  doc.setTextColor(32, 50, 114);

  const sideMargin = 4;

  const descriptions = data.term_desc ? data.term_desc.split('\n') : [];
  const rowSpan = descriptions.length + 1;

  // Table 2
  const table2Column = [
    'Event No',
    'Quote No',
    'Vessel',
    'Customer',
    'Total Amount',
    'Created',
    'Sent to Customer',
    'Response Rate',
  ];

  const table2Rows = [];

  const uniqueEvents = new Set();
  const uniqueQuotes = new Set();
  const uniqueVessel = new Set();
  const uniqueCustomer = new Set();
  let totalAmount = 0;

  let totalResponseRate = 0;

  if (data) {
    data.forEach((detail) => {
      if (detail.event_code) uniqueEvents.add(detail.event_code);
      if (detail.document_identity) uniqueQuotes.add(detail.document_identity);
      if (detail.vessel_id) uniqueVessel.add(detail.vessel_id);
      if (detail.customer_id) uniqueCustomer.add(detail.customer_id);
      if (detail.total_amount) totalAmount += +detail.total_amount;
      if (detail.document_date && detail.qs_date) {
        const created = dayjs(detail.document_date);
        const responded = dayjs(detail.qs_date);
        totalResponseRate += responded.diff(created, 'ms');
      }

      const row = [
        detail?.event_code || '',
        detail?.document_identity || '',
        detail?.vessel_name || '',
        detail?.customer_name || '',
        {
          content: detail?.total_amount ? `$${formatThreeDigitCommas(detail?.total_amount)}` : '',
          styles: { halign: 'right' },
        },
        detail?.document_date ? dayjs(detail?.document_date).format('MM-DD-YYYY') : '',
        detail?.qs_date ? dayjs(detail?.qs_date).format('MM-DD-YYYY') : '',
        // Calculate response rate show in minutes and seconds
        detail?.document_date && detail?.qs_date
          ? calculateTimeDifference(detail.document_date, detail.qs_date)
          : '',
      ];

      table2Rows.push(row);
    });
  }

  const filledRows = fillEmptyRows(table2Rows, 16);
  const totalEvents = `${uniqueEvents.size} ${uniqueEvents.size > 1 ? 'events' : 'event'}`;
  const totalQuotes = `${uniqueQuotes.size} ${uniqueQuotes.size > 1 ? 'quotes' : 'quote'}`;
  const totalVessel = `${uniqueVessel.size} ${uniqueVessel.size > 1 ? 'vessels' : 'vessel'}`;
  const totalCustomer = `${uniqueCustomer.size} ${uniqueCustomer.size > 1 ? 'customers' : 'customer'}`;

  table2Rows.push([
    totalEvents,
    totalQuotes,
    totalVessel,
    totalCustomer,
    `$${formatThreeDigitCommas(totalAmount)}`,
    '-',
    '-',
    millisecondsToReadable(totalResponseRate),
  ]);

  // Adding Table
  doc.autoTable({
    startY: 34,
    head: [table2Column],
    body: filledRows,
    margin: { left: sideMargin, right: sideMargin, bottom: 32, top: 84 },
    headStyles: {
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle',
      textColor: [32, 50, 114],
      fillColor: [221, 217, 196],
    },
    styles: {
      halign: 'center',
      valign: 'middle',
      font: 'times',
      fontSize: 8,
      lineWidth: 0.1,
      lineColor: [116, 116, 116],
    },
    bodyStyles: {
      textColor: [32, 50, 114],
      fillColor: [255, 255, 255],
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255],
    },
    rowPageBreak: 'avoid',
    columnStyles: {
      0: { cellWidth: 16 }, // Event No
      1: { cellWidth: 16 }, // Quote No
      2: { cellWidth: 46 }, // Vessel
      3: { cellWidth: 46 }, // Customer
      4: { cellWidth: 20 }, // Total Amount
      5: { cellWidth: 20 }, // Created
      6: { cellWidth: 20 }, // Sent To Customer
      7: { cellWidth: 18 }, // Response Rate
    },
    didParseCell: function (data) {
      data.cell.styles.minCellHeight = 13;
    },
  });

  // Adding Table
  doc.autoTable({
    startY: 34,
    head: [table2Column],
    body: filledRows,
    margin: { left: sideMargin, right: sideMargin, bottom: 32, top: 84 },
    headStyles: {
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle',
      textColor: [32, 50, 114],
      fillColor: [221, 217, 196],
    },
    styles: {
      halign: 'center',
      valign: 'middle',
      font: 'times',
      fontSize: 8,
      lineWidth: 0.1,
      lineColor: [116, 116, 116],
    },
    bodyStyles: {
      textColor: [32, 50, 114],
      fillColor: [255, 255, 255],
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255],
    },
    rowPageBreak: 'avoid',
    columnStyles: {
      0: { cellWidth: 16 }, // Event No
      1: { cellWidth: 16 }, // Quote No
      2: { cellWidth: 46 }, // Vessel
      3: { cellWidth: 46 }, // Customer
      4: { cellWidth: 20 }, // Total Amount
      5: { cellWidth: 20 }, // Created
      6: { cellWidth: 20 }, // Sent To Customer
      7: { cellWidth: 18 }, // Response Rate
    },
    didParseCell: function (data) {
      data.cell.styles.minCellHeight = 13;
    },
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
    addFooter(doc, pageWidth, pageHeight - 25);
  }

  doc.setProperties({
    title: `Bid Response`,
  });

  // Generate blob and open in new tab
  const pdfBlob = doc.output('blob');
  const blobUrl = URL.createObjectURL(pdfBlob);
  window.open(blobUrl, '_blank');
};
