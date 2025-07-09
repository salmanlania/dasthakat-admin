import jsPDF from 'jspdf';
import 'jspdf-autotable';
import GMSLogo from '../../assets/logo.jpg';

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

const pdfContent = (doc, data, sideMargin, pageWidth) => {
  doc.setTextColor(32, 50, 114); // set default Blue color for all text

  // Header
  doc.setFontSize(20);
  doc.setFont('times', 'bold');
  doc.text('Global Marine Safety', pageWidth / 2, 15, {
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

  // LOGO
  doc.addImage(GMSLogo, 'PNG', 8, 4, 25, 18); // x, y, width, height


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
      },
      {
        content: 'Sales Person',
        styles: {
          fillColor: 'ebf1de' 
        }
      },
      {
        content: data?.salesman?.name || '',
        styles: {
          fontSize: 11,
          fillColor: 'ebf1de' 
        }
      }
    ]
  ];

  doc.autoTable({
    startY: 42,
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
        content: 'HOUSTON',
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
        content: '07/DECMBER/2023',
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
        colSpan: 5,
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
        content: 'SO/DO Number',
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
        content: 'Qty',
        styles: {
          fillColor: 'ebf1de' 
        }
      }
    ]
  ];

  if (data?.job_order_detail && data.job_order_detail.length) {
    let lastDocumentId = '';
    let lastSO_DO = '';
    let lastPO = '';
  
    // Sort function to sort by showDocumentId, showSO_DO, and showPO in order
    const sortedDetails = [...data.job_order_detail].sort((a, b) => {
      const docIdA = a?.charge_order?.document_identity || '';
      const docIdB = b?.charge_order?.document_identity || '';
      
      const soDoA = a?.shipment?.document_identity || '';
      const soDoB = b?.shipment?.document_identity || '';
      
      const poA = a?.charge_order?.customer_po_no || '';
      const poB = b?.charge_order?.customer_po_no || '';
      
      // Sorting logic (you can adjust the order of sorting or make it ascending/descending)
      if (docIdA !== docIdB) return docIdA.localeCompare(docIdB);
      if (soDoA !== soDoB) return soDoA.localeCompare(soDoB);
      return poA.localeCompare(poB);
    });
  
    // Process the sorted details
    sortedDetails.forEach((detail) => {
      const currentDocId = detail?.charge_order?.document_identity || '';
      const showDocumentId = currentDocId !== lastDocumentId ? currentDocId : '';
      lastDocumentId = currentDocId;
  
      const currentSO_DO = detail?.shipment?.document_identity || '';
      const showSO_DO = currentSO_DO !== lastSO_DO ? currentSO_DO : '';
      lastSO_DO = currentSO_DO;
  
      const currentPO = detail?.charge_order?.customer_po_no || '';
      const showPO = currentPO !== lastPO ? currentPO : '';
      lastPO = currentPO;
  
      // Only add rows if there is non-empty content
      if (showDocumentId || showPO || showSO_DO || detail?.product_description || detail?.quantity) {
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
            content: showSO_DO || '',
            styles: { textColor: '#d51902' }
          },
          {
            content: detail?.product_description || '',
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
      if (cellIndex === 0) data.cell.styles.cellWidth = 24; 
      if (cellIndex === 1) data.cell.styles.cellWidth = 30; 
      if (cellIndex === 2) data.cell.styles.cellWidth = 28; 
      if (cellIndex === 3) data.cell.styles.cellWidth = 110;
      if (cellIndex === 4) data.cell.styles.cellWidth = 16; 
    }
  });

  // Table 4
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

  if (data?.certificates && data.certificates.length) {
    data.certificates.forEach((certificate) => {
      table4Row.push([
        {
          content: certificate?.certificate_number || '',
          styles: {
            textColor: '#d51902' 
          }
        },
        {
          content: certificate?.certificate_number || ''
        },
        {
          content: 'Work Order Complied By',
          styles: {
            fillColor: 'ebf1de' 
          }
        },
        {
          content: 'Muhammad Ali',
          styles: {
            textColor: '#d51902' 
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
        content: ''
      },
      {
        content: ''
      }
    ]);
  }

  table4Row.push([
    {
      content: 'General Notes',
      styles: {
        fillColor: 'ebf1de', 
        textColor: '#244062'
      }
    },
    {
      content: '',
      colSpan: 3
    }
  ]);

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
      if (cellIndex === 2) data.cell.styles.cellWidth = 62; 
      if (cellIndex === 3) data.cell.styles.cellWidth = 62; 
    }
  });
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