import jsPDF from 'jspdf';
import 'jspdf-autotable';
import GMSLogo from '../../assets/logo.jpg';

const fillEmptyRows = (rows, rowsPerPage) => {
  // Calculate how many rows are required to fill the current page
  const rowsOnLastPage = rows.length % rowsPerPage;
  const emptyRowsNeeded = rowsOnLastPage ? rowsPerPage - rowsOnLastPage : 0;

  // Add empty rows to the table
  for (let i = 0; i < emptyRowsNeeded; i++) {
    rows.push(['', '', '', '', '',]);
  }

  return rows;
};

export const createIJOPrint = (data) => {
  const doc = new jsPDF();
  doc.setTextColor(32, 50, 114); // set default Blue color for all text
  const sideMargin = 1;
  const pageSize = doc.internal.pageSize;
  const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();

  // Header
  doc.setFontSize(20);
  doc.setFont('times', 'bold');
  doc.text('Global Marine Safety Inc. (Houston)', pageWidth / 2, 15, {
    align: 'center'
  }); // text, x, y, options

  // LOGO
  doc.addImage(GMSLogo, 'PNG', 8, 4, 25, 18); // x, y, width, height

  // IJO Heading
  doc.setFontSize(10);
  doc.setFont('times', 'bold');
  doc.setTextColor(79, 101, 51); // set Green color for IJO heading
  doc.text('INTERNAL JOB ORDER', pageWidth / 2, 23, {
    align: 'center'
  }); // text, x, y, options

  // V1 Box
  // Draw the box (rectangle)
  doc.setFillColor(235, 241, 222); // gray fill color
  doc.setDrawColor(196, 189, 151); // light gray border
  doc.setLineWidth(0.1); // border thickness
  doc.rect(153, 18, 56, 9, 'FD'); // (x, y, width, height, fill)

  // Add text inside the box
  doc.setTextColor(200, 0, 0); // Red color
  doc.setFont('times', 'bold');
  doc.setFontSize(14);
  doc.text('V.1', 181, 24, { align: 'center' }); // text, x, y, options

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
        content: '593530',
        styles: {
          textColor: '#d51902', // Red Color
          fontSize: 11,
          fillColor: 'ebf1de'
        }
      },
      {
        content: 'Sales Person',
        styles: {
          fillColor: 'ebf1de' // gray color
        }
      },
      {
        content: 'Hussain Mansoor',
        styles: {
          fontSize: 11,
          fillColor: 'ebf1de' // gray color
        }
      }
    ]
  ];

  doc.autoTable({
    startY: 27,
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
        content: 'SFL THELON',
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
        content: 'PROMAR AGENCY LTD',
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
        content: '9593000',
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
        content: '281-337-3339',
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
        content: 'MARSHAL ISLANDS',
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
        content: '281-433-2164',
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
        content: 'ABS',
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
        content: 'HOUSTONOPS@PROMARAGENCY.COM',
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
      if (cellIndex === 0) data.cell.styles.cellWidth = 24; // First column width
      if (cellIndex === 1) data.cell.styles.cellWidth = 60; // Second column width
      if (cellIndex === 2) data.cell.styles.cellWidth = 52; // Third column width
      if (cellIndex === 3) data.cell.styles.cellWidth = 72; // Fourth column width
    }
  });

  // Table 3
  const table3Row = [
    [
      {
        content: 'Job Scope',
        colSpan: 5,
        styles: {
          textColor: '#ffffff', // white color
          fontSize: 8,
          fillColor: '#244062' // Blue Color
        }
      }
    ],
    [
      {
        content: 'SO Number',
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
        content: 'Singapore SO #',
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
        content: 'Qty',
        styles: {
          fillColor: 'ebf1de' // gray color
        }
      }
    ],
    [
      {
        content: '532881',
        styles: {
          textColor: '#d51902' // Red Color
        }
      },
      {
        content: '12042023',
        styles: {
          textColor: '#d51902' // Red Color
        }
      },
      {
        content: ''
      },
      {
        content: 'Annual Inspection of Portable Fire Extinguisher'
      },
      {
        content: '10',
        styles: {
          textColor: '#d51902' // Red Color
        }
      }
    ],
    [
      {
        content: '532882',
        styles: {
          textColor: '#d51902' // Red Color
        }
      },
      {
        content: '12042023',
        styles: {
          textColor: '#d51902' // Red Color
        }
      },
      {
        content: ''
      },
      {
        content: 'Annual Inspection of Portable Fire Extinguisher'
      },
      {
        content: '10',
        styles: {
          textColor: '#d51902' // Red Color
        }
      }
    ],
    [
      {
        content: '532883',
        styles: {
          textColor: '#d51902' // Red Color
        }
      },
      {
        content: '12042023',
        styles: {
          textColor: '#d51902' // Red Color
        }
      },
      {
        content: ''
      },
      {
        content: 'Annual Inspection of Portable Fire Extinguisher'
      },
      {
        content: '10',
        styles: {
          textColor: '#d51902' // Red Color
        }
      }
    ]
  ];
  const filledRows = fillEmptyRows(table3Row, 15)
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
      if (cellIndex === 0) data.cell.styles.cellWidth = 24; // First column width
      if (cellIndex === 1 || cellIndex === 2) data.cell.styles.cellWidth = 30; // Second and Third column width
      if (cellIndex === 3) data.cell.styles.cellWidth = 108; // Fourth column width
      if (cellIndex === 4) data.cell.styles.cellWidth = 16; // Fifth column width
    }
  });

  // Table 4
  const table4Row = [
    [
      {
        content: 'Certificate Number',
        styles: {
          fillColor: '#244062', // Blue Color
          textColor: "#ffffff", // White Color
        }
      },
      {
        content: 'Type',
        styles: {
          fillColor: '#244062', // Blue Color
          textColor: "#ffffff", // White Color
        }
      },
      {
        content: 'For office Use Only',
        colSpan: 2,
        styles: {
          fillColor: '#244062', // Blue Color
          textColor: "#ffffff", // White Color
        }
      }
    ],
    [
      {
        content: 'GMSH/948/12/2023',
        styles: {
          textColor: '#d51902' // Red Color
        }
      },
      {
        content: 'FRS'
      },
      {
        content: 'Work Order Complied By',
        styles: {
          fillColor: 'ebf1de' // gray color
        }
      },
      {
        content: 'Muhammad Ali',
        styles: {
          textColor: '#d51902' // Red Color
        }
      }
    ],
    [
      {
        content: 'GMSHC/674/12/2023 ',
        styles: {
          textColor: '#d51902' // Red Color
        }
      },
      {
        content: 'Calibration'
      },
      {
        content: 'Original Service Order & Certifcate received by',
        styles: {
          fillColor: 'ebf1de' // gray color
        }
      },
      {
        content: '',
        styles: {
          textColor: '#d51902' // Red Color
        }
      }
    ],
    [
      {
        content: "General Notes",
        styles: {
          fillColor: 'ebf1de', // gray color
          textColor: '#244062' // Blue Color
        }
      },
      {
        content: "",
        colSpan:  3
      }
    ]
  ];
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
      if (cellIndex === 0) data.cell.styles.cellWidth = 54;  // First column width
      if (cellIndex === 1 ) data.cell.styles.cellWidth = 30; // Second column width
      if (cellIndex === 2 ) data.cell.styles.cellWidth = 62; // Third column width
      if (cellIndex === 3) data.cell.styles.cellWidth = 62; // Fourth column width
    }
  });

  doc.setProperties({
    title: `IJO - ${data.document_identity}`
  });
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob, {});
  window.open(pdfUrl, '_blank');
};
