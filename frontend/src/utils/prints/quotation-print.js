import dayjs from 'dayjs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import GMSLogo from '../../assets/logo-with-title.png';
import Logo1 from '../../assets/quotationPrintLogo/logo1.png';
import Logo2 from '../../assets/quotationPrintLogo/logo2.png';
import Logo3 from '../../assets/quotationPrintLogo/logo3.png';
import Logo4 from '../../assets/quotationPrintLogo/logo4.png';
import Logo5 from '../../assets/quotationPrintLogo/logo5.png';
import Logo6 from '../../assets/quotationPrintLogo/logo6.png';
import Logo7 from '../../assets/quotationPrintLogo/logo7.png';

import { formatThreeDigitCommas, roundUpto } from '../number';

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
    rows.push(['', '', '', '', '', '', '', '']);
  }

  return rows;
};

const addHeader = (doc, data, pageWidth, sideMargin) => {
  doc.setFontSize(20);
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

  // Bill To and Ship To
  doc.setFontSize(10);
  doc.setFont('times', 'bold');
  doc.text('Bill To', sideMargin, 40);
  doc.text('Ship To', 140, 40);
  doc.setFont('times', 'normal');

  const billTo = doc.splitTextToSize(
    `${data.customer ? `${data.customer.name},` : ''}\n${
      data.vessel ? data.vessel.billing_address || '' : ''
    }`,
    120
  );
  doc.text(billTo, sideMargin, 45);

  const shipTo = doc.splitTextToSize(data.vessel ? data.vessel.name : '', 68);
  doc.text(shipTo, 140, 45);

  doc.setFontSize(16);
  doc.setFont('times', 'bold');
  doc.text('ESTIMATE', pageWidth / 2, 62, {
    align: 'center'
  });
  doc.setFont('times', 'normal');
  doc.setFontSize(10);

  // Table 1
  const table1Column = [
    'Quote Date',
    'Quote Number',
    'Event No',
    "Customer's Reference",
    'Delivery Location',
    'Payment Terms',
    'Flag',
    'Class',
    'Date of Service'
  ];
  const table1Rows = [
    [
      data.document_date ? dayjs(data.document_date).format('MM-DD-YYYY') : '',
      data.document_identity,
      data.event.event_code,
      data.customer_ref,
      data.port ? data.port.name : '',
      data.payment ? data.payment.name : '',
      data.flag ? data.flag.name : '',
      `${data.class1 ? `${data.class1.name},` : ''} ${data.class2 ? data.class2.name : ''}`,
      data.service_date ? dayjs(data.service_date).format('MM-DD-YYYY') : ''
    ]
  ];

  doc.autoTable({
    startY: 66,
    head: [table1Column],
    body: table1Rows,
    margin: { left: sideMargin, right: sideMargin, bottom: 27 },
    headStyles: {
      halign: 'center',
      valign: 'middle',
      fontSize: 7,
      fontStyle: 'bold',
      textColor: [32, 50, 114],
      fillColor: [221, 217, 196]
    },
    styles: {
      halign: 'center',
      valign: 'middle',
      lineWidth: 0.1,
      lineColor: [116, 116, 116]
    },
    bodyStyles: {
      fontSize: 6,
      textColor: [32, 50, 114],
      fillColor: [255, 255, 255]
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255]
    },
    columnStyles: {
      0: { cellWidth: 19 },
      1: { cellWidth: 22 },
      2: { cellWidth: 18 },
      3: { cellWidth: 44 },
      4: { cellWidth: 28 },
      5: { cellWidth: 18 },
      6: { cellWidth: 17 },
      7: { cellWidth: 17 },
      8: { cellWidth: 19 }
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

  doc.setFont('helvetica', 'bolditalic');
  doc.text(
    currentPage === totalPages ? `Last page` : `Continue to page ${currentPage + 1}`,
    pageWidth / 2,
    pageHeight - 9.2,
    {
      align: 'center'
    }
  );

  doc.setFont('helvetica', 'normal');
  const deliveryText =
    'Remit Payment to: Global Marine Safety Service Inc Frost Bank, ABA: 114000093, Account no: 502206269, SWIFT: FRSTUS44';
  doc.text(deliveryText, pageWidth / 2, pageHeight, {
    align: 'center'
  });
};

export const createQuotationPrint = (data) => {
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
  if (data.quotation_detail) {
    data.quotation_detail.forEach((detail, index) => {
      const sr = detail.sort_order + 1;
      const description = `${detail?.product_type?.name === 'Others' ? detail?.product_name || '' : detail?.product?.product_name || ''}\n \n${detail?.description || ''}`;
      const uom = detail.unit ? detail.unit.name : '';
      const quantity = detail.quantity ? formatThreeDigitCommas(parseFloat(detail.quantity)) : '';
      const pricePerUnit = detail.rate ? `$${formatThreeDigitCommas(detail.rate)}` : '';
      const grossAmount = detail.amount ? `$${formatThreeDigitCommas(detail.amount)}` : '';
      const discountPercent = detail.discount_percent
        ? `${roundUpto(+detail.discount_percent)}%`
        : '';
      const discountAmount = detail.discount_amount
        ? `$${formatThreeDigitCommas(detail.discount_amount)}`
        : '';
      const netAmount = detail.gross_amount
        ? `$${formatThreeDigitCommas(detail.gross_amount)}`
        : '';

      const row = [
        sr,
        {
          content: description,
          styles: { halign: 'left' }
        },
        uom,
        quantity,
        { content: pricePerUnit, styles: { halign: 'right' } },
        { content: grossAmount, styles: { halign: 'right' } },
        discountPercent,
        { content: discountAmount, styles: { halign: 'right' } },
        { content: netAmount, styles: { halign: 'right' } }
      ];

      table2Rows.push(row);
    });
  }

  const filledRows = fillEmptyRows(table2Rows, 13, descriptions.length + 1);

  // Adding Table
  doc.autoTable({
    startY: 84,
    head: [table2Column],
    body: filledRows,
    margin: { left: sideMargin, right: sideMargin, bottom: 32, top: 84 },
    headStyles: {
      fontSize: 7,
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle',
      textColor: [32, 50, 114],
      fillColor: [221, 217, 196]
    },
    styles: {
      halign: 'center',
      valign: 'middle',
      fontSize: 7,
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
      1: { cellWidth: 84 },
      2: { cellWidth: 10 },
      3: { cellWidth: 10 },
      4: { cellWidth: 14 },
      5: { cellWidth: 19 },
      6: { cellWidth: 14 },
      7: { cellWidth: 14 },
      8: { cellWidth: 27 }
    },
    didParseCell: function (data) {
      data.cell.styles.minCellHeight = 12;
    }
  });

  // Total Amounts
  const totalGrossAmount = data.total_amount ? `$${formatThreeDigitCommas(data.total_amount)}` : '';
  const totalDiscountAmount = data.total_discount
    ? `$${formatThreeDigitCommas(data.total_discount)}`
    : '';
  const netAmount = data.net_amount ? `$${formatThreeDigitCommas(data.net_amount)}` : '';

  let notes = [
    [
      {
        content: 'Total:',
        styles: {
          fontStyle: 'bold',
          fontSize: 9
        }
      },
      {
        content: '',
        colSpan: 3
      },
      {
        content: totalGrossAmount,
        colSpan: 2,
        styles: {
          fontStyle: 'bold',
          halign: 'right',
          fontSize: 9
        }
      },
      {
        content: totalDiscountAmount,
        colSpan: 2,
        styles: {
          fontStyle: 'bold',
          halign: 'right',
          fontSize: 9
        }
      },
      {
        content: netAmount,
        styles: {
          fontStyle: 'bold',
          halign: 'right',
          fontSize: 9
        }
      }
    ]
  ];

  if (data.term_desc) {
    notes = notes.concat(
      descriptions.map((note, index) => {
        if (index === 0) {
          return [
            {
              content: 'Notes:',
              rowSpan: rowSpan,
              styles: {
                fontSize: 9,
                fontStyle: 'bold'
              }
            },
            {
              content: note || '',
              colSpan: 8,
              styles: {
                halign: 'left'
              }
            }
          ];
        }

        return [
          {
            content: note || '',
            colSpan: 8,
            styles: {
              halign: 'left'
            }
          }
        ];
      })
    );
  }

  doc.autoTable({
    startY: doc.previousAutoTable.finalY,
    head: [],
    body: notes,
    margin: { left: sideMargin, right: sideMargin, bottom: 27, top: 84 },
    styles: {
      lineWidth: 0.1,
      lineColor: [116, 116, 116],
      valign: 'middle',
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 7,
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
      1: { cellWidth: 69 },
      2: { cellWidth: 10 },
      3: { cellWidth: 10 },
      4: { cellWidth: 14 },
      5: { cellWidth: 19 },
      6: { cellWidth: 14 },
      7: { cellWidth: 14 },
      8: { cellWidth: 27 }
    },
    didParseCell: (data) => {
      data.cell.styles.minCellHeight = 12;
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
    addFooter(doc, pageWidth, pageHeight - 25);
  }

  doc.setProperties({
    title: `Quotation - ${data.document_identity}`
  });
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob, {});
  window.open(pdfUrl, '_blank');
};
