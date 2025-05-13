import jsPDF from 'jspdf';
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

const pdfContent = (doc, data, sideMargin, pageWidth, eventDate) => {
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

  // doc.setFillColor(235, 241, 222);
  // doc.setDrawColor(196, 189, 151);
  // doc.setLineWidth(0.1);
  // doc.rect(153, 32, 56, 9, 'FD');

  // Add text inside the box
  // doc.setTextColor(200, 0, 0); // Red color
  // doc.setFont('times', 'bold');
  // doc.setFontSize(14);
  // doc.text('V.1', 181, 39, { align: 'center' })

  // Table 1
  const table1Row = [
    [
      {
        content: 'Event Number',
        styles: {
          fillColor: 'ebf1de' // gray color
        }
      },
      {
        content: data?.event?.event_code || '',
        styles: {
          textColor: '#d51902', // Red Color
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
      if (cellIndex === 0) data.cell.styles.cellWidth = 24; // First column width
      if (cellIndex === 1) data.cell.styles.cellWidth = 30; // Second column width
      if (cellIndex === 2) data.cell.styles.cellWidth = 30; // Third column width
      if (cellIndex === 3) data.cell.styles.cellWidth = 124; // Fourth column width
    }
  });

  // Table 2
  const table2Row = [
    [
      {
        content: 'Vessel Details',
        colSpan: 2,
        styles: {
          textColor: '#ffffff', // white color
          fontSize: 8,
          fillColor: '#244062' // Blue Color
        }
      },
      {
        content: 'Agent Details',
        colSpan: 2,
        styles: {
          textColor: '#ffffff', // white color
          fontSize: 8,
          fillColor: '#244062' // Blue Color
        }
      }
    ],
    [
      {
        content: 'Vessel Name',
        styles: {
          fillColor: 'ebf1de' // gray color
        }
      },
      {
        content: data?.vessel?.name || '',
        styles: {
          textColor: '#d51902', // Red Color
          fontSize: 9
        }
      },
      {
        content: 'Company Name',
        styles: {
          fillColor: 'ebf1de' // gray color
        }
      },
      {
        content: data?.agent?.name || '',
        styles: {
          textColor: '#d51902', // Red Color
          fontSize: 9
        }
      }
    ],
    [
      {
        content: 'IMO Number',
        styles: {
          fillColor: 'ebf1de' // gray color
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
          fillColor: 'ebf1de' // gray color
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
          fillColor: 'ebf1de' // gray color
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
          fillColor: 'ebf1de' // gray color
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
          fillColor: 'ebf1de' // gray color
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
          fillColor: 'ebf1de' // gray color
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
          fillColor: 'ebf1de' // gray color
        }
      },
      {
        content: 'HOUSTON',
        styles: {
          fontSize: 9
        }
      },
      {
        content: 'ETA',
        styles: {
          fillColor: 'ebf1de' // gray color
        }
      },
      {
        content: eventDate ? eventDate : '',
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
        colSpan: 7,
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
          fillColor: 'ebf1de' // gray color
        }
      },
      {
        content: 'Customer PO #',
        styles: {
          fillColor: 'ebf1de' // gray color
        }
      },
      {
        content: 'DN Number',
        styles: {
          fillColor: 'ebf1de' // gray color
        }
      },
      {
        content: 'Memo',
        styles: {
          fillColor: 'ebf1de' // gray color
        }
      },
      {
        content: 'Internal Notes',
        styles: {
          fillColor: 'ebf1de' // gray color
        }
      },
      {
        content: 'Customer Notes',
        styles: {
          fillColor: 'ebf1de' // gray color
        }
      },
      {
        content: 'Qty',
        styles: {
          fillColor: 'ebf1de' // gray color
        }
      }
    ]
  ];

  if (data?.job_order_detail && data.job_order_detail.length > 0) {
    let lastDocumentId = '';
    let lastDocumentIdService = '';
    let lastSO_DO = '';
    let lastPO = '';

    // Sort function to sort by showDocumentId, showSO_DO, and showPO in order
    // const sortedDetails = [...data.job_order_detail].sort((a, b) => {
    //   const docIdA = a?.charge_order?.document_identity || '';
    //   const docIdB = b?.charge_order?.document_identity || '';

    //   const soDoA = a?.shipment?.document_identity || '';
    //   const soDoB = b?.shipment?.document_identity || '';

    //   const poA = a?.charge_order?.customer_po_no || '';
    //   const poB = b?.charge_order?.customer_po_no || '';

    //   // Sorting logic (you can adjust the order of sorting or make it ascending/descending)
    //   if (docIdA !== docIdB) return docIdA.localeCompare(docIdB);
    //   if (soDoA !== soDoB) return soDoA.localeCompare(soDoB);
    //   return poA.localeCompare(poB);
    // });

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
            content: detail.quantity ? parseFloat(detail.quantity) : '',
            styles: { textColor: '#d51902' }
          }
        ]);
      }
    });
  }

  const filledRows = fillEmptyRows(table3Row, 15);
  doc.autoTable({
    startY: doc.previousAutoTable.finalY,
    // body: filledRows
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
      if (cellIndex === 0) data.cell.styles.cellWidth = 22; // First column width
      if (cellIndex === 1) data.cell.styles.cellWidth = 20; // Second column width
      if (cellIndex === 2) data.cell.styles.cellWidth = 26; // Second column width
      if (cellIndex === 3) data.cell.styles.cellWidth = 62; // Third column width
      if (cellIndex === 4) data.cell.styles.cellWidth = 31; // Third column width
      if (cellIndex === 5) data.cell.styles.cellWidth = 31; // Third column width
      if (cellIndex === 6) data.cell.styles.cellWidth = 16; // Fourth column width
    }
  });

  // Table 4
  const table4Row = [
    [
      {
        content: 'Certificate Number',
        styles: {
          fillColor: '#244062', // Blue Color
          textColor: '#ffffff' // White Color
        }
      },
      {
        content: 'Type',
        styles: {
          fillColor: '#244062', // Blue Color
          textColor: '#ffffff' // White Color
        }
      },
      {
        content: 'For office Use Only',
        colSpan: 2,
        styles: {
          fillColor: '#244062', // Blue Color
          textColor: '#ffffff' // White Color
        }
      }
    ]
  ];

  // const techNotes = data?.job_order_detail?.flatMap(item => {
  //   const chargeOrder = item?.charge_order;
  //   if (Array.isArray(chargeOrder)) {
  //     return chargeOrder.map(c => c?.technician_notes);
  //   } else if (chargeOrder) {
  //     return chargeOrder.technician_notes;
  //   }
  //   return [];
  // }).filter(Boolean);
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
            textColor: '#d51902' // Red Color
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
        // rowSpan : certiLen,
        styles: {
          fillColor: 'ebf1de',
          textColor: '#244062'
        }
      },
      {
        content: techNotes,
        // rowSpan : certiLen,
        styles: {
          halign: 'left'
        }
      }
    ]);
  }
  // table4Row.push([
  //   {
  //     content: 'Technician Notes',
  //     styles: {
  //       fillColor: 'ebf1de',
  //       textColor: '#244062',
  //     }
  //   },
  //   {
  //     content: techNotes ? techNotes : "",
  //     styles: {
  //       halign: 'left',
  //       colSpan : 3
  //     }
  //   }
  // ])
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
      if (cellIndex === 0) data.cell.styles.cellWidth = 54; // First column width
      if (cellIndex === 1) data.cell.styles.cellWidth = 30; // Second column width
      if (cellIndex === 2) data.cell.styles.cellWidth = 35; // Third column width
      if (cellIndex === 3) data.cell.styles.cellWidth = 89; // Fourth column width
    }
  });
};

export const createIJOPrint = (data, multiple = false) => {
  const eventDate = data?.event_date;
  const doc = new jsPDF();

  const sideMargin = 1;
  const pageSize = doc.internal.pageSize;
  const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();

  if (!multiple) {
    pdfContent(doc, data, sideMargin, pageWidth, eventDate);
  } else {
    data.data.forEach((item, index) => {
      pdfContent(doc, item, sideMargin, pageWidth, eventDate);

      if (index < data.length - 1) {
        doc.addPage();
      }
    });
  }

  doc.setProperties({
    title: `IJO - ${multiple ? data[0]?.event.event_code : data.document_identity}`
  });
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob, {});
  window.open(pdfUrl, '_blank');
};
