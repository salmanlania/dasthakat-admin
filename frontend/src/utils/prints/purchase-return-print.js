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

const addHeader = (doc, data, sideMargin) => {

  // doc.addImage(GMSLogo, 'PNG', 88, 5, 32, 26); // Centered logo
  doc.addImage(GMSLogo, 'PNG', 20, 1, 35, 26);
  doc.setFontSize(18);
  doc.setFont('times', 'bold');
  doc.text('Global Marine Safety - America', 110, 10, { align: 'center' });

  // Company Info
  doc.setFontSize(10);
  doc.setFont('times', 'normal');
  doc.text('9145 Wallisville Rd, Houston TX 77029, USA', 105, 18, { align: 'center' });
  doc.text('Tel: 1 713-518-1715, Fax: 1 713-518-1760, Email: tech1@gms-america.com', 110, 22, { align: 'center' });

  // Logo

  // Purchase Return Box
  // Draw the rectangle (outer border)
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1); // Set border thickness
  doc.rect(sideMargin, 32, 80, 10); // x, y, width, height
  doc.setLineWidth(0.3);

  // Add the text inside the box
  doc.setFontSize(15); // Set font size
  doc.setFont('times', 'bolditalic'); // Set font style (italic and bold)
  doc.text('Purchase Return', 26, 39); // Centered text

  // *** Right side boxes ***
  let startX = 126;
  let startY = 30;
  let boxWidth = 40;
  let boxHeight = 7;

  const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
  const totalPages = doc.internal.getNumberOfPages();

  const rows = [
    { label: 'PR No.', value: data.document_identity },
    {
      label: 'P.O.Date.',
      value: data.document_date ? dayjs(data.document_date).format('MM-DD-YYYY') : ''
    },
    {
      label: 'Required Date.',
      value: data.required_date ? dayjs(data.required_date).format('MM-DD-YYYY') : data?.purchase_order?.required_date ? dayjs(data?.purchase_order?.required_date).format('MM-DD-YYYY') : null,
    },
    { label: 'Terms', value: data?.charge_order?.quotation?.payment?.name ? data?.charge_order?.quotation?.payment?.name : '' },
    { label: 'Charge No.', value: data?.charge_order?.document_identity || '' },
    { label: 'Quotation No.', value: data?.charge_order?.quotation?.document_identity || '' },
    { label: 'Page', value: `Page ${currentPage} of ${totalPages}` }
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

  // Ship To box
  // Draw the main box
  let startShipToX = 107;
  let startShipToY = 87;
  let shipToWidth = 99;
  let shipToHeight = 52;
  doc.rect(startShipToX, startShipToY, shipToWidth, shipToHeight); // x, y, width, height

  // Add "Ship To :" text
  doc.setFontSize(10);
  doc.setFont('times', 'bold');
  doc.text('Ship From :', startShipToX + 4, startShipToY + 6); // x, y
  doc.rect(startShipToX, startShipToY + 10, shipToWidth, 0);

  // Add the content
  doc.setFontSize(8);
  doc.setFont('times', 'bold');

  const shipCustomerName = data?.charge_order?.customer?.name || "";
  const shipVesselName = data?.charge_order?.vessel?.name || "";
  const shipVesselAddress = data?.charge_order?.vessel?.billing_address || "";
  const customerFromTel = data?.charge_order?.customer?.phone_no || "";
  const customerFromEmail = data?.charge_order?.customer?.email_sales || "";

  doc.text(doc.splitTextToSize(shipCustomerName || '', 88), startShipToX + 4, startShipToY + 16);
  doc.text(doc.splitTextToSize(shipVesselName || '', 88), startShipToX + 4, startShipToY + 24);
  doc.text(doc.splitTextToSize(shipVesselAddress || '', 88), startShipToX + 4, startShipToY + 29);
  doc.text(doc.splitTextToSize(`Tel : ${customerFromTel || ''}`, 88), startShipToX + 4, startShipToY + 38);
  doc.text(doc.splitTextToSize(`Email : ${customerFromEmail || ''}`, 88), startShipToX + 4, startShipToY + 42);

  // Send To box
  // Draw the main box
  let startSendToX = sideMargin;
  let startSendToY = 87;
  let sentToWidth = 99;
  let sentToHeight = 52;
  doc.rect(startSendToX, startSendToY, sentToWidth, sentToHeight); // x, y, width, height

  // Add "Send To :" text
  doc.setFontSize(10);
  doc.setFont('times', 'bold');
  doc.text('Send To :', startSendToX + 4, startSendToY + 6); // x, y
  doc.rect(startSendToX, startSendToY + 10, sentToWidth, 0);

  // Add the content
  doc.setFontSize(8);
  doc.setFont('times', 'bold');
  const billToAddress = doc.splitTextToSize(data?.purchase_order?.supplier?.address, 88);
  doc.text(billToAddress, startSendToX + 4, startSendToY + 16);
  doc.text(doc.splitTextToSize(`Name: ${data?.purchase_order?.supplier?.name || ''}`, 88), startSendToX + 4, startSendToY + 21);
  doc.text(doc.splitTextToSize(`Tel : ${data?.purchase_order?.supplier?.contact1 || ''}`, 88), startSendToX + 4, startSendToY + 26);
  doc.text(doc.splitTextToSize(`Fax : ${data?.purchase_order?.supplier?.contact2 || ''}`, 88), startSendToX + 4, startSendToY + 31);
  doc.text(doc.splitTextToSize(`Email : ${data?.purchase_order?.supplier?.email || ''}`, 88), startSendToX + 4, startSendToY + 36);

  doc.setDrawColor(32, 50, 114);
  doc.setLineWidth(0.6);
  // Buyer's Info Table
  const table1Column = ["Buyer's Name", "Buyer's Email", 'Required Date', 'Ship via'];
  const table1Rows = [
    [
      data.user ? data.user.user_name : data?.purchase_order?.user ? data?.purchase_order?.user?.user_name : '',
      // data.user ? data.user.email : '',
      'tech1@gms-america.com',
      data.required_date ? dayjs(data.required_date).format('MM-DD-YYYY') : data?.purchase_order?.required_date ? dayjs(data?.purchase_order?.required_date).format('MM-DD-YYYY') : null,
      data.ship_via ? data.ship_via : data?.purchase_order?.ship_via ? data?.purchase_order?.ship_via : null
    ]
  ];
  doc.autoTable({
    startY: 145,
    head: [table1Column],
    body: table1Rows,
    margin: { left: sideMargin },
    headStyles: {
      halign: 'center',
      valign: 'middle',
      fontSize: 9,
      fontStyle: 'bold',
      textColor: [0, 0, 0],
      fillColor: [255, 255, 255]
    },
    styles: {
      halign: 'center',
      valign: 'middle',
      lineWidth: 0.1,
      font: 'times',
      lineColor: [0, 0, 0],
      cellPadding: 2
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [0, 0, 0],
      fillColor: [255, 255, 255]
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255]
    },
    columnStyles: {
      0: { cellWidth: 69 },
      1: { cellWidth: 81 },
      2: { cellWidth: 26 },
      3: { cellWidth: 26 },
      4: { cellWidth: 28 }
    }
  });
};

const addFooter = (doc, data, sideMargin, pageHeight) => {
  const vesselName = data?.charge_order?.vessel?.name || '';
  doc.setFont('times', 'bold');
  doc.text(vesselName, sideMargin, pageHeight + 1);
  doc.setFont('times', 'normal');

  doc.text('Global Marine Safety - America All Rights Reserved', sideMargin, pageHeight + 8);
  doc.text('gms-america.com', sideMargin, pageHeight + 12);

  const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
  doc.text(`Page ${currentPage}`, 190, pageHeight + 10);
};

export const createPurchaseReturnPrint = (data) => {
  const doc = new jsPDF();
  const sideMargin = 4;

  // Purchase Return Items Table
  const table2Column = [
    'S#',
    'IMPA',
    'Qty',
    'Unit',
    'Description',
    'Unit Price',
    'Ext. Cos',
  ];

  const table2Rows = data.purchase_return_detail
    ? data.purchase_return_detail.map((detail, index) => [
      index + 1,
      detail?.product?.impa_code || '',
      detail.quantity ? parseFloat(detail.quantity) : 0,
      detail.unit ? detail.unit.name : '',
      {
        content: detail?.product_description || '',
        styles: { halign: 'left' }
      },
      {
        content: detail.rate ? formatThreeDigitCommas(detail.rate) : 0,
        styles: { halign: 'right' }
      },
      {
        content: detail.amount ? formatThreeDigitCommas(detail.amount) : 0,
        styles: { halign: 'right' }
      }
    ])
    : [];

  const filledRows = fillEmptyRows(table2Rows, 9);
  doc.autoTable({
    startY: 165,
    head: [table2Column],
    body: filledRows,
    margin: { left: 4, top: 150, bottom: 22 },
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
      1: { cellWidth: 20 },
      2: { cellWidth: 18 },
      3: { cellWidth: 18 },
      4: { cellWidth: 97 },
      5: { cellWidth: 20 },
      6: { cellWidth: 20 },
    },
    didParseCell: function (data) {
      data.cell.styles.minCellHeight = 11;
    }
  });

  doc.setFontSize(12);
  doc.setFont('times', 'bold');
  if (data?.purchase_return_detail.length > 0) {
    doc.text(
      `Total Value = ${formatThreeDigitCommas(data.total_amount) || ''}`,
      142,
      doc.previousAutoTable.finalY + 5
    );
  }

  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageSize = doc.internal.pageSize;
    const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();

    // Header
    addHeader(doc, data, sideMargin);

    // Footer
    addFooter(doc, data, sideMargin, pageHeight - 25);
  }

  doc.setProperties({
    title: `PR - ${data.document_identity} - ${data?.charge_order?.vessel?.name}`
  });
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob, {});
  window.open(pdfUrl, '_blank');
};