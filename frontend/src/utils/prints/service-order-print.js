import jsPDF from 'jspdf';
import 'jspdf-autotable';
import GMSLogo from '../../assets/logo-with-title.png';
import dayjs from 'dayjs';

const fillEmptyRows = (rows, rowsPerPage) => {
  const rowsOnLastPage = rows.length % rowsPerPage;
  const emptyRowsNeeded = rowsOnLastPage ? rowsPerPage - rowsOnLastPage : 0;

  for (let i = 0; i < emptyRowsNeeded; i++) {
    rows.push([
      { content: '', styles: { fillColor: [255, 255, 255] } },
      { content: '', styles: { fillColor: [255, 255, 255] } },
      { content: '', styles: { fillColor: [255, 255, 255] } },
      { content: '', styles: { fillColor: [255, 255, 255] } },
      { content: '', styles: { fillColor: [255, 255, 255] } },
      { content: '', styles: { fillColor: [255, 255, 255] } }
    ]);
  }

  return rows;
};

const pdfContent = (doc, data, sideMargin, pageWidth) => {
  doc.setTextColor(32, 50, 114);
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
  doc.setFontSize(15);
  doc.setFont('times', 'bold');
  doc.setTextColor(32, 50, 114);
  const text = 'Service Order - Original';
  const x = pageWidth / 2;
  const y = 42;

  doc.text(text, x, y, { align: 'center' });

  const textWidth = doc.getTextWidth(text);

  const underlineY = y + 2;
  doc.setDrawColor(32, 50, 114);
  doc.setLineWidth(0.5);
  doc.line(x - textWidth / 2, underlineY, x + textWidth / 2, underlineY);

  const topInfoTable = [
    [
      {
        content: 'Ship Name/Place:',
        styles: {
          fontStyle: 'bold',
          halign: 'left',
        }
      },
      {
        content: data?.event?.vessel?.name || '-',
        styles: {
          halign: 'left',
        }
      },
      {
        content: 'Date:',
        styles: {
          fontStyle: 'bold',
          halign: 'left',
        }
      },
      {
        content: dayjs(data?.created_at).format('MM-DD-YYYY') || '-',
        styles: {
          halign: 'left',
          width: '40%'
        }
      },
    ],
    [
      {
        content: 'Delivery Port/Place:',
        styles: {
          fontStyle: 'bold',
          halign: 'left',
        }
      },
      {
        content: data?.charge_order?.quotation?.port?.name || '-',
        styles: {
          halign: 'left',
        }
      },
      {
        content: 'Event:',
        styles: {
          fontStyle: 'bold',
          halign: 'left',
        }
      },
      {
        content: data?.event?.event_code || '-',
        styles: {
          halign: 'left',
        }
      },
    ],
    [
      {
        content: 'Client Ref.no:',
        styles: {
          fontStyle: 'bold',
          halign: 'left',
        }
      },
      {
        content: data?.charge_order?.customer_po_no || '-',
        styles: {
          halign: 'left',
        }
      },
      {
        content: 'Charge:',
        styles: {
          fontStyle: 'bold',
          halign: 'left',
        }
      },
      {
        content: data?.charge_order?.document_identity || '-',
        styles: {
          halign: 'left',
        }
      },
    ],
    [
      {
        content: 'Agent:',
        styles: {
          fontStyle: 'bold',
          halign: 'left',
        }
      },
      {
        content: data?.charge_order?.agent?.name || '-',
        styles: {
          halign: 'left',
        }
      },
      {
        content: 'Document No',
        styles: {
          fontStyle: 'bold',
          halign: 'left',
          fillColor: [255, 255, 255]
        }
      },
      {
        content: data?.document_identity || '-',
        styles: {
          halign: 'left',
          fillColor: [255, 255, 255]
        }
      },
    ],
    [
      {
        content: 'Agent tel/fax:',
        styles: {
          fontStyle: 'bold',
          halign: 'left',
        }
      },
      {
        content: data?.charge_order?.agent?.fax || '' + ' ' + '' + '',
        colSpan: 3,
        styles: {
          halign: 'left',
        }
      },
      {
        content: '',
        styles: {
          halign: 'left',
        }
      },
    ]
  ];

  doc.autoTable({
    startY: 46,
    body: topInfoTable,
    theme: 'plain',
    margin: { left: sideMargin + 5, right: sideMargin + 5 },
    styles: {
      font: 'times',
      lineWidth: 0.1,
      lineColor: [116, 116, 116],
    },
    bodyStyles: {
      fontSize: 10,
      textColor: [32, 50, 114],
    },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 104 },
      2: { cellWidth: 24 },
      3: { cellWidth: 30 }
    },
  });

  const tableHeaders = [
    [
      {
        content: 'No',
        styles: {
          fontStyle: 'bold',
          halign: 'center',
          valign: 'middle',
          fillColor: [255, 255, 255]
        }
      },
      {
        content: 'Type',
        styles: {
          fontStyle: 'bold',
          halign: 'center',
          valign: 'middle',
          fillColor: [255, 255, 255]
        }
      },
      {
        content: 'Description',
        styles: {
          fontStyle: 'bold',
          halign: 'left',
          valign: 'middle',
          fillColor: [255, 255, 255]
        }
      },
      {
        content: 'Order Qty',
        styles: {
          fontStyle: 'bold',
          halign: 'center',
          valign: 'middle',
          fillColor: [255, 255, 255]
        }
      },
      {
        content: 'UOM',
        styles: {
          fontStyle: 'bold',
          halign: 'center',
          valign: 'middle',
          fillColor: [255, 255, 255]
        }
      },
      {
        content: 'Actual Qty',
        styles: {
          fontStyle: 'bold',
          halign: 'center',
          valign: 'middle',
          fillColor: [255, 255, 255]
        }
      },
    ]
  ];

  if (data?.service_order_detail && data.service_order_detail.length) {

    data.service_order_detail.forEach((detail, index) => {
      const rowBackgroundColor = index % 2 === 0 ? [255, 255, 255] : [255, 255, 255];
      tableHeaders.push([
        {
          content: index + 1 || '',
          styles: { halign: 'center', fillColor: rowBackgroundColor }
        },
        {
          content: detail?.product_type.name
            ? detail.product_type.name.charAt(0).toUpperCase() + detail.product_type.name.charAt(1).toUpperCase()
            : '',
          styles: { halign: 'left', fillColor: [255, 255, 255] }
        },
        {
          content: detail?.product_description || '',
          styles: { halign: 'left', fillColor: rowBackgroundColor }
        },
        // {
        //   content: detail?.quantity || '',
        //   styles: { halign: 'right', fillColor: rowBackgroundColor }
        // },
        {
          content: (() => {
            const quantity = parseFloat(detail?.quantity);
            if (!isNaN(quantity)) {
              const finalValue = quantity % 1 === 0 
                ? Math.floor(quantity)
                : quantity;
        
              return String(finalValue); // 👈 Force to string here
            }
            return '';
          })(),
          styles: {
            halign: 'center',
            fillColor: rowBackgroundColor
          }
        },       
        {
          content: detail?.unit?.name || '',
          styles: { halign: 'center', fillColor: rowBackgroundColor }
        },
        {
          content: '',
          styles: { halign: 'center', fillColor: rowBackgroundColor }
        },

      ]);
    });
  }

  const filledRows = fillEmptyRows(tableHeaders, 24);
  // tableHeaders.splice(1, tableHeaders.length - 1, ...filledRows);

  doc.autoTable({
    startY: doc.previousAutoTable.finalY + 5,
    body: filledRows,
    margin: { left: sideMargin + 5, right: sideMargin + 5 },
    styles: {
      font: 'times',
      halign: 'center',
      valign: 'middle',
      lineWidth: 0.1,
      lineColor: [116, 116, 116]
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [32, 50, 114],
      fillColor: [255, 255, 255]
    },
    columnStyles: {
      0: { cellWidth: 13 },
      1: { cellWidth: 13 },
      2: { cellWidth: 118 },
      3: { cellWidth: 18 },
      4: { cellWidth: 18 },
      5: { cellWidth: 18 },
    },

  });

  const footerY = doc.previousAutoTable.finalY + 10;

  doc.setFont('times', 'bold');
  doc.setFontSize(10);
  doc.text('DELIVERY DATE', 30, footerY);
  doc.text('SHIP STAFF', 100, footerY);
  doc.text('GLOBAL MARINE SAFETY', 150, footerY);

  doc.setFont('times', 'normal');
  doc.setFontSize(9);
  doc.text('SIGNATURES AND STAMP FOR TRUE RECEIPT', 100, footerY + 10);

};

export const createServiceOrderPrint = (data, multiple = false) => {
  const doc = new jsPDF();

  const sideMargin = 1;
  const pageSize = doc.internal.pageSize;
  const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();

  if (!multiple) {
    pdfContent(doc, data, sideMargin, pageWidth);
  } else {
    data.forEach((item, index) => {
      pdfContent(doc, item, sideMargin, pageWidth);

      if (index < data.length - 1) {
        doc.addPage();
      }
    });
  }

  doc.setProperties({
    // title: `Service Order - ${multiple ? data[0]?.event.event_code : data.document_identity}`
  });
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob, {});
  window.open(pdfUrl, '_blank');
};