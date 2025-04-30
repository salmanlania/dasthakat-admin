import jsPDF from 'jspdf';
import 'jspdf-autotable';
import GMSLogo from '../../assets/logo-with-title.png';
import dayjs from 'dayjs';

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

  // Service List Heading
  doc.setFontSize(16);
  doc.setFont('times', 'bold');
  doc.text('Service List', pageWidth / 2, 34, {
    align: 'center'
  });

  // Service List Info
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.setFontSize(15);
  let startX = sideMargin;
  let startY = 42;
  let boxWidth = 46;
  let boxHeight = 7;

  const rows = [
    { label: 'Service List Number.', value: data?.document_identity || '' },
    {
      label: 'Vessel Name.',
      value: data?.charge_order?.vessel?.name || ''
    },
    {
      label: 'Event No.',
      value: data?.charge_order?.event?.event_code || ''
    },
    { label: 'Charge NO', value: data?.charge_order?.document_identity || '' },
    { label: 'Customer PO Number.', value: data?.charge_order?.customer_po_no || '' },
    {
      label: 'Date.',
      value: data?.charge_order?.document_date
        ? dayjs(data?.charge_order?.document_date).format('MM-DD-YYYY')
        : ''
    }
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
    pageHeight + 6,
    {
      align: 'center'
    }
  );
};

export const createServiceListPrint = (data) => {
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

  const table2Rows =
    data.items && data.items.length
      ? data.items.map((item, index) => {
          return [
            index + 1,
            item?.product?.product_code || '',
            {
              content: item?.product?.name || '',
              styles: {
                halign: 'left'
              }
            },
            item?.warehouse?.name || '',
            parseFloat(item?.original_quantity || 0),
            parseFloat(item?.total_received_quantity || 0),
            item.remarks || ''
          ];
        })
      : [];

  const filledRows = fillEmptyRows(table2Rows, 16);
  doc.autoTable({
    startY: 86,
    head: [table2Column],
    body: filledRows,
    margin: { left: 4, top: 86, bottom: 22 },
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

  // Date
  doc.setFontSize(10);
  doc.setFont('times', 'bold');

  const date = `Date:  ${dayjs().format('MM-DD-YYYY')}`;
  doc.text(date, pageWidth - 33, doc.previousAutoTable.finalY + 12);

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
    title: `Service List - ${data.document_identity}`
  });
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob, {});
  window.open(pdfUrl, '_blank');
};
