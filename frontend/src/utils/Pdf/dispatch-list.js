import dayjs from 'dayjs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import GMSLogo from '../../assets/logo-with-title.png';

// const fillEmptyRows = (rows, rowsPerPage) => {
//   // Calculate how many rows are required to fill the current page
//   const rowsOnLastPage = rows.length % rowsPerPage;
//   const emptyRowsNeeded = rowsOnLastPage ? rowsPerPage - rowsOnLastPage : 0;

//   // Add empty rows to the table
//   for (let i = 0; i < emptyRowsNeeded; i++) {
//     rows.push(['', '', '', '', '', '', '', '', '', '']);
//   }

//   return rows;
// };

const addHeader = (doc, data, pageWidth, sideMargin) => {
  const detail = data?.data || []
  // Logo
  doc.addImage(GMSLogo, 'PNG', 8, 3, 32, 26); // x, y, width, height

  // Main Heading
  doc.setFontSize(18);
  doc.setFont('times', 'bold');
  doc.text('Global Marine Safety - America', 61, 16);

  // Pick List Heading
  doc.setFontSize(16);
  doc.setFont('times', 'bold');
  doc.text('Scheduling', pageWidth / 2, 34, {
    align: 'center'
  });

  // Pick List Info
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.setFontSize(15);
  // let startX = sideMargin;
  let startY = 42;
  let boxWidth = 46;
  let boxHeight = 7;

  // const rows = [
  //   { label: 'Date.', value: detail?.event_date|| '  ' },
  //   { label: 'Time.', value: detail?.event_time|| '  ' },
  //   { label: 'Event Number.', value: detail?.event_code|| '  ' },
  //   {
  //     label: 'Vessel Name.',
  //     value: detail?.vessel_name || ''
  //   },
  //   {
  //     label: 'Technician.',
  //     value: Array.isArray(detail?.technician) 
  //       ? detail.technician.map(t => t.username).join(' & ') 
  //       : detail?.technician?.username || '  '
  //   },    
  //   { label: 'Charge NO', value: data?.charge_order?.document_identity || '' },
  //   { label: 'Customer PO Number.', value: data?.charge_order?.customer_po_no || '' },
  //   {
  //     label: 'Date.',
  //     value: data?.charge_order?.document_date
  //       ? dayjs(data?.charge_order?.document_date).format('MM-DD-YYYY')
  //       : ''
  //   }
  // ];

  // // Draw boxes with content
  // doc.setFontSize(8);
  // doc.setFont('times', 'normal');
  // rows.forEach((row, index) => {
  //   // Draw label box
  //   doc.rect(startX, startY + index * boxHeight, boxWidth, boxHeight);
  //   doc.text(row.label, startX + 2, startY + index * boxHeight + 4.5);

  //   // Draw value box
  //   doc.rect(startX + boxWidth, startY + index * boxHeight, boxWidth, boxHeight);
  //   doc.text(row.value, startX + boxWidth + 2, startY + index * boxHeight + 4.5);
  // });
};

const pdfContent = (doc, data, pageWidth) => {
  // Purchase Order Items Table
  const table2Column = [
    'Date',
    'Time',
    'Event Number',
    'Vessel Name',
    'Technician',
    'Technician Notes',
    'Agent',
    'Agent Notes',
    'Status'
  ];

  const detail = data?.data

  const table2Rows =
    detail && detail.length
      ? detail.map((item, index) => {
        return [
          item?.event_date || '   ',
          item?.event_time || '   ',
          item?.event_code || '   ',
          item?.vessel_name || '   ',
          Array.isArray(item?.technicians)
            ? item.technicians.map(t => t.user_name).join(', ')
            : '   ',
          item?.technician_notes || '   ',
          item?.agent_name || '   ',
          item?.agent_notes || '   ',
          item?.status || '   '
        ];
      })
      : [];

  doc.autoTable({
    startY: 50,
    head: [table2Column],
    body: table2Rows,
    // margin: { left: 4, top: 86, bottom: 22 },
    margin: { top: 5, bottom: 5 },
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
      font: 'times',
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
    rowPageBreak: 'avoid',
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 15 },
      2: { cellWidth: 15 },
      3: { cellWidth: 15 },
      4: { cellWidth: 15 },
      5: { cellWidth: 15 },
      6: { cellWidth: 15 }
    },
    didParseCell: function (data) {
      data.cell.styles.minCellHeight = 11;
    }
  });

  // Date
  doc.setFontSize(10);
  doc.setFont('times', 'bold');

  const date = `Date:  ${dayjs().format('MM-DD-YYYY')}`;
  doc.text(date, pageWidth - 33, doc.previousAutoTable.finalY + 12);
};

const createDispatchListPrint = (data, multiple = false) => {
  const doc = new jsPDF();
  const sideMargin = 4;
  const pageSize = doc.internal.pageSize;
  const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();

  if (!multiple) {
    pdfContent(doc, data, pageWidth);
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      const pageSize = doc.internal.pageSize;
      const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
      addHeader(doc, data, pageWidth, sideMargin);
    }
  } else {
    data.forEach((item, index) => {
      pdfContent(doc, item, pageWidth);

      const pageCount = doc.internal.getNumberOfPages();
      for (let i = index + 1; i <= pageCount; i++) {
        doc.setPage(i);
        const pageSize = doc.internal.pageSize;
        const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
        addHeader(doc, item, pageWidth, sideMargin);
      }

      if (index < data.length - 1) {
        doc.addPage();
      }
    });
  }

  doc.setProperties({
    title: `Scheduling - ${multiple ? data[0]?.data[0]?.company_id : data[0]?.data[0]?.created_at}`
  });
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob, {});
  const link = document.createElement('a');
  link.href = pdfUrl;
  link.download = `Scheduling - ${multiple ? data[0]?.data[0]?.company_id : data[0]?.data[0]?.created_at}.pdf`;
  link.click();
  URL.revokeObjectURL(pdfUrl);
};

export default createDispatchListPrint;