import jsPDF from 'jspdf';
import 'jspdf-autotable';

import GMSLogo from '../../assets/logo-with-title.png';
import Logo1 from '../../assets/purchaseOrderPrintLogo/logo1.png';
import Logo2 from '../../assets/purchaseOrderPrintLogo/logo2.png';
import Logo3 from '../../assets/purchaseOrderPrintLogo/logo3.png';

export const createPurchaseOrderPrint = (data) => {
  const doc = new jsPDF();

  // *** Header ***
  // Logo's
  doc.addImage(GMSLogo, 'PNG', 8, 3, 32, 26);
  doc.addImage(Logo1, 'PNG', 98, 5, 26, 18);
  doc.addImage(Logo2, 'PNG', 130, 5, 42, 24);
  doc.addImage(Logo3, 'PNG', 170, 5, 26, 22);

  // Main Heading
  doc.setFontSize(18);
  doc.setFont('times', 'bold');
  doc.text('Global Marine Safety - America', 12, 36);

  // Company Info
  doc.setFontSize(10);
  doc.setFont('times', 'normal');
  doc.text('9145 Wallisville Rd, Houston TX 77029, USA', 12, 44);
  doc.text('Tel: 1 713-518-1715', 12, 48);
  doc.text('Fax: 1 713-518-1760', 12, 52);
  doc.text('Email: sales@gms-america.com', 12, 56);

  // Purchase Order Box
  // Draw the rectangle (outer border)
  doc.setLineWidth(1); // Set border thickness
  doc.rect(12, 65, 80, 10); // x, y, width, height
  doc.setLineWidth(0.3);

  // Add the text inside the box
  doc.setFontSize(15); // Set font size
  doc.setFont('times', 'bolditalic'); // Set font style (italic and bold)
  doc.text('Purchase Order', 34, 71.5); // Centered text

  // *** Right side boxes ***
  let startX = 120;
  let startY = 35;
  let boxWidth = 35;
  let boxHeight = 7;

  const rows = [
    { label: 'PO No.', value: 'H74016' },
    { label: 'P.O.Date.', value: '04-Dec-2024' },
    { label: 'Required Date.', value: '07-Dec-2024' },
    { label: 'Terms', value: 'N 30 Days' },
    { label: 'Charge No.', value: '50099' },
    { label: 'Quotation No.', value: '6632159' },
    { label: 'Page', value: 'Page 1 of 1' }
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
  let startSendToX = 10;
  let startSendToY = 94;
  let sentToWidth = 94;
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
  doc.text('9145 WALLISVILLE RD-9145 WALLISVILLE RD', startSendToX + 4, startSendToY + 20);
  doc.text('Tel : 713-518-1715', startSendToX + 4, startSendToY + 30);
  doc.text('Fax :', startSendToX + 4, startSendToY + 34);
  doc.text('Email : SALES@GMS-AMERICA.COM', startSendToX + 4, startSendToY + 38);

  // Ship To box
  // Draw the main box
  let startShipToX = 108;
  let startShipToY = 94;
  let shipToWidth = 94;
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
  doc.text('9145 WALLISVILLE RD-9145 WALLISVILLE RD', startShipToX + 4, startShipToY + 20);
  doc.text('Tel : 713-518-1715', startShipToX + 4, startShipToY + 30);
  doc.text('Fax :', startShipToX + 4, startShipToY + 34);
  doc.text('Email : SALES@GMS-AMERICA.COM', startShipToX + 4, startShipToY + 38);

  doc.setProperties({
    title: 'Hello'
  });
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob, {});
  window.open(pdfUrl, '_blank');
};
