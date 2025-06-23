import dayjs from 'dayjs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import GMSLogo from '../../assets/logo-with-title.png';

import { calculateTimeDifference, minutesToReadable } from '../dateTime';
import { formatThreeDigitCommas, roundUpto } from '../number';

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
  doc.setFontSize(10);
};

const addFooter = (doc, pageWidth, pageHeight) => {
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
};

const generateTableData = (data, doc, sideMargin, pageTitleSlug = '') => {
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
      if (detail.created_at && detail.qs_date) {
        const created = dayjs(detail.created_at);
        const responded = dayjs(detail.qs_date);
        totalResponseRate += responded.diff(created, 'minute');
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
        detail?.created_at ? dayjs(detail?.created_at).format('MM-DD-YYYY HH:mm A') : '',
        detail?.qs_date ? dayjs(detail?.qs_date).format('MM-DD-YYYY HH:mm A') : '',
        // Calculate response rate show in minutes and seconds
        detail?.created_at && detail?.qs_date
          ? calculateTimeDifference(detail.created_at, detail.qs_date)
          : '',
      ];

      table2Rows.push(row);
    });
  }

  const filledRows = fillEmptyRows(table2Rows, 17);

  // Adding Table
  doc.autoTable({
    startY: 34,
    head: [
      [
        {
          content: `BID RESPONSE REPORT ${pageTitleSlug}`,
          colSpan: 8,
          styles: { halign: 'center', fontSize: 10, fontStyle: 'bold' },
        },
      ],
      table2Column,
    ],
    body: filledRows,
    margin: { left: sideMargin, right: sideMargin, bottom: 12, top: 34 },
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

  // Add summary text below the table
  doc.setFontSize(9);
  doc.setFont('times', 'normal');

  const finalY = doc.previousAutoTable.finalY + 5;

  const totalEvents = uniqueEvents.size;
  const totalQuotes = uniqueQuotes.size;
  const totalVessel = uniqueVessel.size;
  const totalCustomer = uniqueCustomer.size;

  const dividedTotalResponseRate = Math.floor(totalResponseRate / totalQuotes);

  // Display summary information as text
  doc.text(`Events: ${totalEvents}`, 4, finalY);
  doc.text(`Quotes: ${totalQuotes}`, 32, finalY);
  doc.text(`Vessels: ${totalVessel}`, 64, finalY);
  doc.text(`Customers: ${totalCustomer}`, 94, finalY);
  doc.text(`$${formatThreeDigitCommas(roundUpto(totalAmount))}`, 132, finalY);
  const responseRateText = `Response Rate: ${minutesToReadable(dividedTotalResponseRate)}`;
  const maxWidth = 40; // Maximum width in points
  doc.text(responseRateText, 162, finalY, { maxWidth });
};

export const createBidResponsePrint = async (data, groupByData, groupBy) => {
  const doc = new jsPDF();
  doc.setTextColor(32, 50, 114);

  const sideMargin = 4;

  if (groupBy) {
    for (const key in groupByData) {
      const getFormattedValue = (data, field) => {
        return data?.[0]?.[field] || '';
      };

      const getTitleByGroupType = {
        date: (data) => {
          const createdAt = getFormattedValue(data, 'created_at');
          return createdAt ? dayjs(createdAt).format('MM-DD-YYYY') : '';
        },
        event: (data) => getFormattedValue(data, 'event_code'),
        customer: (data) => getFormattedValue(data, 'customer_name'),
        vessel: (data) => getFormattedValue(data, 'vessel_name'),
      };

      const pageTitleSlug = getTitleByGroupType[groupBy]
        ? `(${groupBy.charAt(0).toUpperCase() + groupBy.slice(1)} - ${getTitleByGroupType[groupBy](groupByData[key])})`
        : '';

      generateTableData(groupByData[key], doc, sideMargin, pageTitleSlug);
      // break page.
      doc.addPage();
    }
  }

  generateTableData(data, doc, sideMargin, groupBy ? '(All)' : '');

  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageSize = doc.internal.pageSize;
    const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
    const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();

    // Header
    addHeader(doc, data, pageWidth, sideMargin);

    // Footer
    addFooter(doc, pageWidth, pageHeight);
  }

  doc.setProperties({
    title: `Bid Response Report ${groupBy ? `(${groupBy.toUpperCase()})` : ''}`,
  });

  // Generate blob and open in new tab
  const pdfBlob = doc.output('blob');
  const blobUrl = URL.createObjectURL(pdfBlob);
  window.open(blobUrl, '_blank');
};
