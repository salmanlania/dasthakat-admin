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
    'Net Amount'
  ];

  const table2Rows = data.quotation_detail
    ? data.quotation_detail.map((detail) => {
        const sr = detail.sort_order + 1;
        const description = detail.product ? detail.product.product_name : '';
        const uom = detail.unit ? detail.unit.name : '';
        const quantity = detail.quantity ? formatThreeDigitCommas(detail.quantity) : '';
        const pricePerUnit = detail.rate ? `$${formatThreeDigitCommas(detail.rate)}` : '';
        const grossAmount = detail.amount ? `$${formatThreeDigitCommas(detail.amount)}` : '';
        const discountPercent = detail.discount_percent
          ? `${roundUpto(+detail.discount_percent)}%`
          : '';
        const netAmount = detail.gross_amount
          ? `$${formatThreeDigitCommas(detail.gross_amount)}`
          : '';

        return [
          sr,
          description,
          uom,
          quantity,
          { content: pricePerUnit, styles: { halign: 'right' } },
          { content: grossAmount, styles: { halign: 'right' } },
          discountPercent,
          { content: netAmount, styles: { halign: 'right' } }
        ];
      })
    : [];

  const rowsPerPage = 19 - (descriptions.length || 1); // Number of rows per page
  const totalRows = table2Rows.length;
  const requiredRows = rowsPerPage - (totalRows % rowsPerPage); // Calculate empty rows to fill

  // for (let i = 1; i < totalRows; i++) {
  //   if (   ) {

  //   }
  //   if (i % 18 === 0) {
  //     table2Rows.splice(i, 0, ['', '', '', '', '', '', '', '']);
  //   }
  // }

  // // Add empty rows if needed
  // if (requiredRows !== rowsPerPage) {
  //   for (let i = 0; i < requiredRows; i++) {
  //     table2Rows.push(['', '', '', '', '', '', '', '']); // Add empty rows (adjust columns if needed)
  //   }
  // }

  // Adding Table
  doc.autoTable({
    startY: 84,
    head: [table2Column],
    body: table2Rows,
    margin: { left: sideMargin, right: sideMargin, bottom: 27, top: 84 },
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
      0: { cellWidth: 16 },
      1: { cellWidth: 79 },
      2: { cellWidth: 14 },
      3: { cellWidth: 14 },
      4: { cellWidth: 18 },
      5: { cellWidth: 19 },
      6: { cellWidth: 15 },
      7: { cellWidth: 27 }
    },
    didParseCell: function (data) {
      data.cell.styles.minCellHeight = 9;
    }
  });

  const netAmount = data.net_amount ? `$${formatThreeDigitCommas(data.net_amount)}` : '';
  const notes = data.term_desc
    ? descriptions.map((note, index) => {
        if (index === 0) {
          return [
            {
              content: 'Notes:',
              rowSpan: rowSpan
            },
            {
              content: note || '',
              styles: {
                halign: 'left'
              }
            },
            {
              content: 'Grand Total',
              rowSpan: rowSpan
            },
            {
              content: netAmount,
              rowSpan: rowSpan
            }
          ];
        }

        return [
          {
            content: note || '',
            styles: {
              halign: 'left'
            }
          }
        ];
      })
    : [
        [
          {
            content: 'Notes:'
          },
          {
            content: '',
            styles: {
              halign: 'left'
            }
          },
          {
            content: 'Grand Total'
          },
          {
            content: netAmount
          }
        ]
      ];

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
      1: { cellWidth: 116 },
      2: { cellWidth: 34 },
      3: { cellWidth: 27 }
    },
    didParseCell: (data) => {
      const rowIndex = data.row.index;
      const columnIndex = data.column.index;
      data.cell.styles.minCellHeight = 9;
      if (rowIndex === 0 && (columnIndex === 0 || columnIndex === 3 || columnIndex === 2)) {
        data.cell.styles.fontSize = 10;
        data.cell.styles.fontStyle = 'bold';
      }

      if (rowIndex === 0 && columnIndex === 3) {
        data.cell.styles.halign = 'right';
      }
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
