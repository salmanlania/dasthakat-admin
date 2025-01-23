import jsPDF from 'jspdf';
import 'jspdf-autotable';

import dayjs from 'dayjs';
import GMSLogo from '../../assets/logo-with-title.png';
import Logo1 from '../../assets/purchaseOrderPrintLogo/logo1.png';
import Logo2 from '../../assets/purchaseOrderPrintLogo/logo2.png';
import Logo3 from '../../assets/purchaseOrderPrintLogo/logo3.png';
import { formatThreeDigitCommas } from '../number';

const addHeader = (doc, data, sideMargin) => {
  // *** Header ***
  // Logo's
  doc.addImage(GMSLogo, 'PNG', 8, 3, 32, 26); // x, y, width, height
  doc.addImage(Logo1, 'PNG', 104, 5, 26, 18); // x, y, width, height
  doc.addImage(Logo2, 'PNG', 136, 5, 42, 24); // x, y, width, height
  doc.addImage(Logo3, 'PNG', 178, 5, 26, 22); // x, y, width, height

  // Main Heading
  doc.setFontSize(18);
  doc.setFont('times', 'bold');
  doc.text('Global Marine Safety - America', sideMargin, 36);

  // Company Info
  doc.setFontSize(10);
  doc.setFont('times', 'normal');
  doc.text('9145 Wallisville Rd, Houston TX 77029, USA', sideMargin, 44);
  doc.text('Tel: 1 713-518-1715', sideMargin, 48);
  doc.text('Fax: 1 713-518-1760', sideMargin, 52);
  doc.text('Email: sales@gms-america.com', sideMargin, 56);

  // Purchase Order Box
  // Draw the rectangle (outer border)
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1); // Set border thickness
  doc.rect(sideMargin, 65, 80, 10); // x, y, width, height
  doc.setLineWidth(0.3);

  // Add the text inside the box
  doc.setFontSize(15); // Set font size
  doc.setFont('times', 'bolditalic'); // Set font style (italic and bold)
  doc.text('Purchase Order', 26, 71.5); // Centered text

  // *** Right side boxes ***
  let startX = 126;
  let startY = 35;
  let boxWidth = 40;
  let boxHeight = 7;

  const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
  const totalPages = doc.internal.getNumberOfPages();

  const rows = [
    { label: 'PO No.', value: data.document_identity },
    {
      label: 'P.O.Date.',
      value: data.document_date ? dayjs(data.document_date).format('MM-DD-YYYY') : ''
    },
    {
      label: 'Required Date.',
      value: data.required_date ? dayjs(data.required_date).format('MM-DD-YYYY') : ''
    },
    { label: 'Terms', value: data.payment ? data.payment.name : '' },
    { label: 'Charge No.', value: data.charge_order || '' },
    { label: 'Quotation No.', value: data.quotation || '' },
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

  // Send To box
  // Draw the main box
  let startSendToX = sideMargin;
  let startSendToY = 87;
  let sentToWidth = 99;
  let sentToHeight = 42;
  doc.rect(startSendToX, startSendToY, sentToWidth, sentToHeight); // x, y, width, height

  // Add "Send To :" text
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Send To :', startSendToX + 4, startSendToY + 6); // x, y
  doc.rect(startSendToX, startSendToY + 10, sentToWidth, 0);

  // Add the content
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setFont('helvetica', 'bold');
  doc.text('GLOBAL MARINE SAFETY SERVICES', startSendToX + 4, startSendToY + 16);
  doc.setFont('helvetica', 'normal');
  const billToAddress = doc.splitTextToSize('9145 WALLISVILLE RD-9145 WALLISVILLE RD', 88);
  doc.text(billToAddress, startSendToX + 4, startSendToY + 20);
  doc.text('Tel : 713-518-1715', startSendToX + 4, startSendToY + 30);
  doc.text('Fax :', startSendToX + 4, startSendToY + 34);
  doc.text('Email : SALES@GMS-AMERICA.COM', startSendToX + 4, startSendToY + 38);

  // Ship To box
  // Draw the main box
  let startShipToX = 107;
  let startShipToY = 87;
  let shipToWidth = 99;
  let shipToHeight = 42;
  doc.rect(startShipToX, startShipToY, shipToWidth, shipToHeight); // x, y, width, height

  // Add "Ship To :" text
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Ship To :', startShipToX + 4, startShipToY + 6); // x, y
  doc.rect(startShipToX, startShipToY + 10, shipToWidth, 0);

  // Add the content
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setFont('helvetica', 'bold');
  doc.text('GLOBAL MARINE SAFETY SERVICES', startShipToX + 4, startShipToY + 16);
  doc.setFont('helvetica', 'normal');
  const shipToAddress = doc.splitTextToSize('9145 WALLISVILLE RD-9145 WALLISVILLE RD', 88);
  doc.text(shipToAddress, startShipToX + 4, startShipToY + 20);
  doc.text('Tel : 713-518-1715', startShipToX + 4, startShipToY + 30);
  doc.text('Fax :', startShipToX + 4, startShipToY + 34);
  doc.text('Email : SALES@GMS-AMERICA.COM', startShipToX + 4, startShipToY + 38);

  // Buyer's Info Table
  const table1Column = ["Buyer's Name", "Buyer's Email", 'Required Date', 'Ship via', 'Department'];
  const table1Rows = [
    [
      data.user ? data.user.user_name : '',
      data.user ? data.user.email : '',
      data.required_date ? dayjs(data.required_date).format('MM-DD-YYYY') : '',
      data.ship_via || '',
      data.department || ''
    ]
  ];
  doc.autoTable({
    startY: 138,
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
      1: { cellWidth: 61 },
      0: { cellWidth: 61 },
      2: { cellWidth: 26 },
      3: { cellWidth: 26 },
      4: { cellWidth: 28 }
    }
  });
};

const addFooter = (doc, sideMargin, pageHeight) => {
  doc.text('GLOBAL SHIP SERVICES All Rights Reserved', sideMargin, pageHeight + 8);
  doc.text('www.globalshipservices.us', sideMargin, pageHeight + 12);

  const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
  doc.text(`Page ${currentPage}`, 190, pageHeight + 10);
};

export const createPurchaseOrderPrint = (data) => {
  console.log(data);
  const doc = new jsPDF();
  const sideMargin = 4;

  // Purchase Order Items Table
  const table2Column = [
    'S#',
    'IMPA',
    'Qty',
    'Unit',
    'V.Part#',
    'Description',
    'Cust Notes',
    'Unit Price',
    'Ext. Cos',
    'Vend Notes'
  ];
  const table2Rows = data.purchase_order_detail
    ? data.purchase_order_detail.map((detail, index) => [
        index + 1,
        detail?.product?.impa_code || '',
        detail.quantity ? parseFloat(detail.quantity) : '',
        detail.unit ? detail.unit.name : '',
        detail.vpart || '',
        detail.product ? detail.product.product_name : '',
        detail.description || '',
        detail.rate ? formatThreeDigitCommas(detail.rate) : '',
        detail.amount ? formatThreeDigitCommas(detail.amount) : '',
        detail.vendor_notes || ''
      ])
    : [];
  doc.autoTable({
    startY: 156,
    head: [table2Column],
    body: table2Rows,
    margin: { left: 4, top: 156, bottom: 22 },
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
    columnStyles: {
      0: { cellWidth: 9 },
      1: { cellWidth: 15 },
      2: { cellWidth: 12 },
      3: { cellWidth: 10 },
      4: { cellWidth: 12 },
      5: { cellWidth: 64 },
      6: { cellWidth: 24 },
      7: { cellWidth: 16 },
      8: { cellWidth: 16 },
      9: { cellWidth: 24 }
    }
  });

  doc.setFontSize(12);
  doc.setFont('times', 'bold');
  doc.text(
    `Total Value = ${formatThreeDigitCommas(data.total_amount) || ''}`,
    142,
    doc.previousAutoTable.finalY + 5
  );

  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageSize = doc.internal.pageSize;
    const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();

    // Header
    addHeader(doc, data, sideMargin);

    // Footer
    addFooter(doc, sideMargin, pageHeight - 25);
  }

  doc.setProperties({
    title: `PO - ${data.document_identity}`
  });
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob, {});
  window.open(pdfUrl, '_blank');
};
