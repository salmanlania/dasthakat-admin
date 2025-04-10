import jsPDF from 'jspdf';
import 'jspdf-autotable';
import GMSLogo from '../../assets/logo.jpg';
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
  doc.text('GLOBAL MARINE SAFETY', pageWidth / 2, 15, {
    align: 'center'
  });

  doc.setFontSize(10);
  doc.setFont('times');
  doc.text('9145 Wallisville Rd Houston TX 77029', pageWidth / 2, 22, {
    align: 'center'
  });

  doc.setFontSize(10);
  doc.setFont('times');
  doc.text('Tel: 1 713 518 1715 Fax. : 1 713 518 1760', pageWidth / 2, 28, {
    align: 'center'
  });

  doc.setFontSize(10);
  doc.setFont('times');
  doc.text('Email : info@gms-america.com', pageWidth / 2, 34, {
    align: 'center'
  });

  doc.addImage(GMSLogo, 'PNG', 8, 4, 25, 18);
  doc.setFontSize(15);
  doc.setFont('times', 'bold');
  doc.setTextColor(0, 0, 0);
  const text = 'Service Order - Original';
  const x = pageWidth / 2;
  const y = 42;

  doc.text(text, x, y, { align: 'center' });

  const textWidth = doc.getTextWidth(text);

  const underlineY = y + 2;
  doc.setDrawColor(0, 0, 0);  
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
        content: data?.charge_order?.agent?.fax || '-',
        styles: {
          halign: 'left',
        }
      },
      {
        content: '',
        styles: {
          fontStyle: 'bold',
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

  const tableStartY = doc.previousAutoTable.finalY + 10;
  let outerBorderDrawn = false;

  doc.autoTable({
    startY: 46,
    body: topInfoTable,
    theme: 'plain',
    margin: { left: sideMargin + 5, right: sideMargin + 5 },
    styles: {
      font: 'times',
      lineWidth: 0.1,
      lineColor: [196, 189, 151]
    },
    bodyStyles: {
      fontSize: 10,
      textColor: [0, 0, 0]
    },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 60 },
      2: { cellWidth: 40 },
      3: { cellWidth: 60 }
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
          halign: 'center',
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
          content: detail?.product_type.name || '',
          styles: { halign: 'center', fillColor: [255, 255, 255] }
        },
        {
          content: detail?.product_description || '',
          styles: { halign: 'center', fillColor: rowBackgroundColor }
        },
        {
          content: detail?.quantity || '',
          styles: { halign: 'center', fillColor: rowBackgroundColor }
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

  const filledRows = fillEmptyRows(tableHeaders, 15);
  tableHeaders.splice(1, tableHeaders.length - 1, ...filledRows);

  doc.autoTable({
    startY: doc.previousAutoTable.finalY + 5,
    body: filledRows,
    margin: { left: sideMargin + 5, right: sideMargin + 5 },
    styles: {
      font: 'times',
      halign: 'center',
      valign: 'middle',
      lineWidth: 0.1,
      lineColor: [0, 0, 0]
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [0, 0, 0],
      fillColor: [255, 255, 255]
    },
    columnStyles: {
      0: { cellWidth: 16 },
      1: { cellWidth: 25 },
      2: { cellWidth: 95 },
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
    title: `Service Order - ${multiple ? data[0]?.event.event_code : data.document_identity}`
  });
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob, {});
  window.open(pdfUrl, '_blank');
};