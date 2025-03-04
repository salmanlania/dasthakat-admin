import jsPDF from 'jspdf';
import 'jspdf-autotable';

import dayjs from 'dayjs';
import GMSLogo from '../../assets/logo-with-title.png';
import { formatThreeDigitCommas } from '../number';

const fillEmptyRows = (rows, rowsPerPage) => {
  // Calculate how many rows are required to fill the current page
  const rowsOnLastPage = rows.length % rowsPerPage;
  const emptyRowsNeeded = rowsOnLastPage ? rowsPerPage - rowsOnLastPage : 0;

  // Add empty rows to the table
  for (let i = 0; i < emptyRowsNeeded; i++) {
    rows.push(['', '', '', '', '', '', '', '', '', '']);
  }

  return rows;
};

const addHeader = (doc, data, pageWidth, sideMargin) => {
  // Logo
  doc.addImage(GMSLogo, 'PNG', 8, 3, 32, 26); // x, y, width, height

  // Main Heading
  doc.setFontSize(18);
  doc.setFont('times', 'bold');
  doc.text('Global Marine Safety - America', 61, 16);

  // Pick List Heading
  doc.setFontSize(16);
  doc.setFont('times', 'bold');
  doc.text('Pick List', pageWidth / 2, 34, {
    align: 'center'
  });

  // Pick List Info
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.setFontSize(15);
  let startX = sideMargin;
  let startY = 42;
  let boxWidth = 46;
  let boxHeight = 7;

  const rows = [
    { label: 'Pick List Number.', value: '0001' },
    {
      label: 'Vessel Name.',
      value: 'Vessel 1'
    },
    {
      label: 'Event No.',
      value: '123'
    },
    { label: 'Charge NO', value: '456' },
    { label: 'Customer PO Number.', value: '873' }
  ];

  // Draw boxes with content
  doc.setFontSize(8);
  doc.setFont('times', 'normal');
  rows.forEach((row, index) => {
    // Draw label box
    doc.rect(startX, startY + index * boxHeight, boxWidth, boxHeight);
    doc.text(row.label, startX + 2, startY + index * boxHeight + 4.5);

    // Draw value box
    doc.rect(startX + boxWidth, startY + index * boxHeight, boxWidth, boxHeight);
    doc.text(row.value, startX + boxWidth + 2, startY + index * boxHeight + 4.5);
  });
};

const addFooter = (doc, pageWidth, pageHeight) => {
  const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
  const totalPages = doc.internal.getNumberOfPages();

  doc.setFontSize(10);
  doc.setFont('times', 'bolditalic');
  doc.text(
    currentPage === totalPages ? `Last page` : `Continue to page ${currentPage + 1}`,
    pageWidth / 2,
    pageHeight + 4,
    {
      align: 'center'
    }
  );
};

export const createPickListPrint = (data) => {
  const doc = new jsPDF();
  const sideMargin = 4;
  const pageSize = doc.internal.pageSize;
  const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();

  // Purchase Order Items Table
  const table2Column = [
    'SN',
    'Item Code',
    'Description',
    'Location',
    'Qty Required',
    'Qty Picked',
    'Remark'
  ];
  const table2Rows = [
    [
      '1',
      '0001',
      {
        content: 'Description....',
        styles: {
          halign: 'left'
        }
      },
      'Location......',
      80,
      40,
      'Remark........'
    ],
    [
      '2',
      '0002',
      {
        content: 'Description....',
        styles: {
          halign: 'left'
        }
      },
      'Location......',
      80,
      40,
      'Remark........'
    ],
    [
      '3',
      '0003',
      {
        content: 'Description....',
        styles: {
          halign: 'left'
        }
      },
      'Location......',
      80,
      40,
      'Remark........'
    ],
    [
      '4',
      '0004',
      {
        content: 'Description....',
        styles: {
          halign: 'left'
        }
      },
      'Location......',
      80,
      40,
      'Remark........'
    ]
  ];

  const filledRows = fillEmptyRows(table2Rows, 16);
  doc.autoTable({
    startY: 84,
    head: [table2Column],
    body: filledRows,
    margin: { left: 4, top: 84, bottom: 22 },
    headStyles: {
      halign: 'center',
      valign: 'middle',
      fontSize: 8,
      fontStyle: 'bold',
      textColor: [0, 0, 0],
      fillColor: [255, 255, 255]
    },
    styles: {
      halign: 'center',
      valign: 'middle',
      font: 'times',
      lineWidth: 0.1,
      lineColor: [0, 0, 0],
      cellPadding: 1
    },
    bodyStyles: {
      fontSize: 7,
      textColor: [0, 0, 0],
      fillColor: [255, 255, 255]
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255]
    },
    rowPageBreak: 'avoid',
    columnStyles: {
      0: { cellWidth: 9 },
      1: { cellWidth: 15 },
      2: { cellWidth: 88 },
      3: { cellWidth: 35 },
      4: { cellWidth: 15 },
      5: { cellWidth: 15 },
      6: { cellWidth: 25 }
    },
    didParseCell: function (data) {
      data.cell.styles.minCellHeight = 11;
    }
  });

  // Pulled By & Date
  doc.setFontSize(10);
  doc.setFont('times', 'bold');

  const pulledBy = `Pulled By: Muhammad Usman Khalid`;
  doc.text(pulledBy, pageWidth - sideMargin, doc.previousAutoTable.finalY + 8, {
    align: 'right'
  });

  const pullByWidth = doc.getTextWidth(pulledBy);

  const date = `Date:          2-3-2025`;
  doc.text(date, pageWidth - pullByWidth - 4, doc.previousAutoTable.finalY + 12);

  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageSize = doc.internal.pageSize;
    const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
    const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();

    addHeader(doc, data, pageWidth, sideMargin);
    addFooter(doc, pageWidth, pageHeight - 25);
  }

  doc.setProperties({
    title: `Pick List - ${data.document_identity}`
  });
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob, {});
  window.open(pdfUrl, '_blank');
};
