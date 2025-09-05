import jsPDF from 'jspdf';
import dayjs from 'dayjs';
import 'jspdf-autotable';
import GMSLogo from '../../assets/logo-with-title.png';

const fillEmptyRows = (rows, rowsPerPage) => {
  // Calculate how many rows are required to fill the current page
  const rowsOnLastPage = rows.length % rowsPerPage;
  const emptyRowsNeeded = rowsOnLastPage ? rowsPerPage - rowsOnLastPage : 0;

  // Add empty rows to the table
  for (let i = 0; i < emptyRowsNeeded; i++) {
    rows.push(['', '', '', '', '']);
  }

  return rows;
};

const pdfContent = (doc, data, sideMargin, pageWidth , schedulingDate) => {
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
  const text = 'INTERNAL JOB ORDER';
  const x = pageWidth / 2;
  const y = 30;

  doc.text(text, x, y, { align: 'center' });

  const textWidth = doc.getTextWidth(text);

  const underlineY = y + 2;
  doc.setDrawColor(32, 50, 114);
  doc.setLineWidth(0.5);
  doc.line(x - textWidth / 2, underlineY, x + textWidth / 2, underlineY);

  // Table 1
  const table1Row = [
    [
      {
        content: 'Event Number',
        styles: {
          fillColor: 'ebf1de'
        }
      },
      {
        content: data?.event?.event_code || '',
        styles: {
          textColor: '#d51902',
          fontSize: 11,
          fillColor: 'ebf1de'
        }
      }
    ]
  ];

  doc.autoTable({
    startY: 38,
    body: table1Row,
    margin: { left: sideMargin, right: sideMargin },
    styles: {
      font: 'times',
      halign: 'center',
      valign: 'middle',
      lineWidth: 0.1,
      lineColor: [196, 189, 151]
    },
    bodyStyles: {
      fontSize: 9,
      fontStyle: 'bold',
      textColor: [32, 50, 114],
      fillColor: [255, 255, 255]
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255]
    },
    didParseCell: function (data) {
      const cellIndex = data.column.index;
      if (cellIndex === 0) data.cell.styles.cellWidth = 24; 
      if (cellIndex === 1) data.cell.styles.cellWidth = 30; 
      if (cellIndex === 2) data.cell.styles.cellWidth = 30; 
      if (cellIndex === 3) data.cell.styles.cellWidth = 124;
    }
  });

  // Table 2
  const table2Row = [
    [
      {
        content: 'Vessel Details',
        colSpan: 2,
        styles: {
          textColor: '#ffffff',
          fontSize: 8,
          fillColor: '#244062'
        }
      },
      {
        content: 'Agent Details',
        colSpan: 2,
        styles: {
          textColor: '#ffffff', 
          fontSize: 8,
          fillColor: '#244062'
        }
      }
    ],
    [
      {
        content: 'Vessel Name',
        styles: {
          fillColor: 'ebf1de'
        }
      },
      {
        content: data?.vessel?.name || '',
        styles: {
          textColor: '#d51902',
          fontSize: 9
        }
      },
      {
        content: 'Company Name',
        styles: {
          fillColor: 'ebf1de' 
        }
      },
      {
        content: data?.agent?.name || '',
        styles: {
          textColor: '#d51902',
          fontSize: 9
        }
      }
    ],
    [
      {
        content: 'IMO Number',
        styles: {
          fillColor: 'ebf1de'
        }
      },
      {
        content: data?.vessel?.imo || '',
        styles: {
          fontSize: 9
        }
      },
      {
        content: 'Office Number',
        styles: {
          fillColor: 'ebf1de'
        }
      },
      {
        content: data?.agent?.office_no || '',
        styles: {
          fontSize: 9
        }
      }
    ],
    [
      {
        content: 'Flag',
        styles: {
          fillColor: 'ebf1de'
        }
      },
      {
        content: data?.flag?.name || '',
        styles: {
          fontSize: 9
        }
      },
      {
        content: 'Mobile Number',
        styles: {
          fillColor: 'ebf1de'
        }
      },
      {
        content: data?.agent?.phone || '',
        styles: {
          fontSize: 9
        }
      }
    ],
    [
      {
        content: 'Class',
        styles: {
          fillColor: 'ebf1de'
        }
      },
      {
        content: `${data?.class1?.name || ''}, ${data?.class2?.name || ''}`,
        styles: {
          fontSize: 9
        }
      },
      {
        content: 'Email',
        styles: {
          fillColor: 'ebf1de'
        }
      },
      {
        content: data?.agent?.email || '',
        styles: {
          fontSize: 9
        }
      }
    ],
    [
      {
        content: 'Location',
        styles: {
          fillColor: 'ebf1de'
        }
      },
      {
        content: data?.scheduling?.port?.name || '',
        styles: {
          fontSize: 9
        }
      },
      {
        content: 'ETA',
        styles: {
          fillColor: 'ebf1de'
        }
      },
      {
        content: dayjs(schedulingDate).format('MM-DD-YYYY'),
        styles: {
          fontSize: 9
        }
      }
    ]
  ];

  doc.autoTable({
    startY: doc.previousAutoTable.finalY,
    body: table2Row,
    margin: { left: sideMargin, right: sideMargin },
    styles: {
      font: 'times',
      halign: 'center',
      valign: 'middle',
      lineWidth: 0.1,
      lineColor: [196, 189, 151]
    },
    bodyStyles: {
      fontSize: 8,
      fontStyle: 'bold',
      textColor: [32, 50, 114],
      fillColor: [255, 255, 255]
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255]
    },
    didParseCell: function (data) {
      const cellIndex = data.column.index;
      if (cellIndex === 0) data.cell.styles.cellWidth = 24;
      if (cellIndex === 1) data.cell.styles.cellWidth = 60;
      if (cellIndex === 2) data.cell.styles.cellWidth = 52;
      if (cellIndex === 3) data.cell.styles.cellWidth = 72;
      if (cellIndex === 4) data.cell.styles.cellWidth = 72;
    }
  });

  const table3Row = [
    [
      {
        content: 'Job Scope',
        colSpan: 8,
        styles: {
          textColor: '#ffffff',
          fontSize: 8,
          fillColor: '#244062'
        }
      }
    ],
    [
      {
        content: 'Charge Number',
        styles: {
          fillColor: 'ebf1de'
        }
      },
      {
        content: 'Customer PO #',
        styles: {
          fillColor: 'ebf1de'
        }
      },
      {
        content: 'DN Number',
        styles: {
          fillColor: 'ebf1de'
        }
      },
      {
        content: 'Memo',
        styles: {
          fillColor: 'ebf1de'
        }
      },
      {
        content: 'Internal Notes',
        styles: {
          fillColor: 'ebf1de'
        }
      },
      {
        content: 'Customer Notes',
        styles: {
          fillColor: 'ebf1de'
        }
      },
      {
        content: 'Qty',
        styles: {
          fillColor: 'ebf1de'
        }
      },
      {
        content: 'Status',
        styles: {
          fillColor: 'ebf1de'
        }
      }
    ]
  ];

  if (data?.job_order_detail && data.job_order_detail.length > 0) {
    let lastDocumentId = '';
    let lastDocumentIdService = '';
    let lastSO_DO = '';
    let lastPO = '';

    const sortedDetails = [...data.job_order_detail];

    // Process the sorted details
    sortedDetails.forEach((detail) => {
      const currentDocId = detail?.charge_order?.document_identity || '';
      const showDocumentId = currentDocId !== lastDocumentId ? currentDocId : '';
      lastDocumentId = currentDocId;

      const currentDocIdService = detail?.service_order?.document_identity || '';
      const showDocumentIdService =
        currentDocIdService !== lastDocumentIdService ? currentDocIdService : '';
      lastDocumentIdService = currentDocIdService;

      const currentSO_DO = detail?.shipment?.document_identity || '';
      const showSO_DO = currentSO_DO !== lastSO_DO ? currentSO_DO : '';
      lastSO_DO = currentSO_DO;

      const currentPO = detail?.charge_order?.customer_po_no || '';
      const showPO = currentPO !== lastPO ? currentPO : '';
      lastPO = currentPO;

      // Only add rows if there is non-empty content
      if (
        showDocumentId ||
        showPO ||
        showSO_DO ||
        showDocumentIdService ||
        detail?.product_description ||
        detail?.quantity
      ) {
        table3Row.push([
          {
            content: showDocumentId || '',
            styles: { textColor: '#d51902' }
          },
          {
            content: showPO || '',
            styles: { textColor: '#d51902' }
          },
          {
            content: showDocumentIdService || '',
            styles: { textColor: '#d51902' }
          },
          {
            content: detail?.product_description || '',
            styles: {
              halign: 'left',
              ...(detail?.product_type_id !== 1 && { textColor: '#9D00FF' })
            }
          },
          {
            content: detail?.internal_notes || '',
            styles: { halign: 'left' }
          },
          {
            content: detail?.description || '',
            styles: { halign: 'left' }
          },
          {
            content: detail?.quantity ? parseFloat(detail?.quantity) : 0,
            styles: { textColor: '#d51902' }
          },
          {
            content: detail?.status ? detail?.status : '',
            styles: { textColor: '#d51902' }
          }
        ]);
      }
    });
  }

  const filledRows = fillEmptyRows(table3Row, 20);
  doc.autoTable({
    startY: doc.previousAutoTable.finalY,
    body: filledRows,
    margin: { left: sideMargin, right: sideMargin },
    styles: {
      font: 'times',
      halign: 'center',
      valign: 'middle',
      lineWidth: 0.1,
      lineColor: [196, 189, 151]
    },
    bodyStyles: {
      fontSize: 8,
      fontStyle: 'bold',
      textColor: [32, 50, 114],
      fillColor: [255, 255, 255]
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255]
    },
    didParseCell: function (data) {
      const cellIndex = data.column.index;
      if (cellIndex === 0) data.cell.styles.cellWidth = 18;
      if (cellIndex === 1) data.cell.styles.cellWidth = 18;
      if (cellIndex === 2) data.cell.styles.cellWidth = 26;
      if (cellIndex === 3) data.cell.styles.cellWidth = 55;
      if (cellIndex === 4) data.cell.styles.cellWidth = 28;
      if (cellIndex === 5) data.cell.styles.cellWidth = 28;
      if (cellIndex === 6) data.cell.styles.cellWidth = 16;
      if (cellIndex === 7) data.cell.styles.cellWidth = 17;
    }
  });

  const table4Row = [
    [
      {
        content: 'Certificate Number',
        styles: {
          fillColor: '#244062', 
          textColor: '#ffffff' 
        }
      },
      {
        content: 'Type',
        styles: {
          fillColor: '#244062', 
          textColor: '#ffffff' 
        }
      },
      {
        content: 'For office Use Only',
        colSpan: 2,
        styles: {
          fillColor: '#244062', 
          textColor: '#ffffff' 
        }
      }
    ]
  ];

  const techNotes = data?.job_order_detail
    ? data?.job_order_detail[0]?.charge_order?.technician_notes
    : '';

  if (data?.certificates && data.certificates.length) {
    const certiLen = data?.certificates.length;
    data.certificates.forEach((certificate, index) => {
      table4Row.push([
        {
          content: certificate?.certificate_number || '',
          styles: {
            textColor: '#d51902' 
          }
        },
        {
          content: certificate?.type || ''
        },
        {
          content: index === 0 ? 'Technician Notes' : '',
          rowSpan: certiLen,
          styles: {
            fillColor: 'ebf1de',
            textColor: '#244062'
          }
        },
        {
          content: index === 0 ? techNotes : '',
          rowSpan: certiLen,
          styles: {
            halign: 'left'
          }
        }
      ]);
    });
  } else {
    table4Row.push([
      {
        content: ''
      },
      {
        content: ''
      },
      {
        content: 'Technician Notes',
        styles: {
          fillColor: 'ebf1de',
          textColor: '#244062'
        }
      },
      {
        content: techNotes,
        styles: {
          halign: 'left'
        }
      }
    ]);
  }
 
  doc.autoTable({
    startY: doc.previousAutoTable.finalY,
    body: table4Row,
    margin: { left: sideMargin, right: sideMargin },
    styles: {
      font: 'times',
      halign: 'center',
      valign: 'middle',
      lineWidth: 0.1,
      lineColor: [196, 189, 151]
    },
    bodyStyles: {
      fontSize: 8,
      fontStyle: 'bold',
      textColor: [32, 50, 114],
      fillColor: [255, 255, 255]
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255]
    },
    didParseCell: function (data) {
      const cellIndex = data.column.index;
      if (cellIndex === 0) data.cell.styles.cellWidth = 54;
      if (cellIndex === 1) data.cell.styles.cellWidth = 30;
      if (cellIndex === 2) data.cell.styles.cellWidth = 35;
      if (cellIndex === 3) data.cell.styles.cellWidth = 89;
    }
  });
};

export const createIJOPrint = (data, multiple = false) => {
  const schedulingDate = data?.scheduling?.event_date ? data?.scheduling?.event_date : data[0]?.scheduling?.event_date ? data[0]?.scheduling?.event_date : null
  const doc = new jsPDF();

  const sideMargin = 1;
  const pageSize = doc.internal.pageSize;
  const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();

  if (!multiple) {
    pdfContent(doc, data, sideMargin, pageWidth , schedulingDate);
  } else {
    data.forEach((item, index) => {
      pdfContent(doc, item, sideMargin, pageWidth , schedulingDate);

      if (index < data.length - 1) {
        doc.addPage();
      }
    });
  }

  doc.setProperties({
    title: `IJO - ${multiple ? data[0]?.event.event_code : data?.event.event_code ? data?.event.event_code : data?.document_identity} - ${data?.vessel?.name ? data?.vessel?.name : data[0]?.vessel?.name ? data[0]?.vessel?.name : ''}`
  });
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob, {});
  window.open(pdfUrl, '_blank');
};
