import dayjs from 'dayjs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import GMSLogo from '../../assets/logo-with-title.png';

const addHeader = (doc, data, pageWidth, sideMargin) => {
  const detail = data?.data || []

  doc.addImage(GMSLogo, 'PNG', 8, 3, 32, 26);

  doc.setFontSize(18);
  doc.setFont('times', 'bold');
  doc.text('Global Marine Safety - America', 61, 16);

  doc.setFontSize(16);
  doc.setFont('times', 'bold');
  doc.text('Scheduling', pageWidth / 2, 34, {
    align: 'center'
  });

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.setFontSize(15);
  let startY = 42;
  let boxWidth = 46;
  let boxHeight = 7;
};

const pdfContent = (doc, data, pageWidth) => {
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

  const detail = data?.data;
  const groupedRows = {};

  detail?.forEach(item => {
    const eventDate = item?.event_date || 'Unknown Date';
    if (!groupedRows[eventDate]) {
      groupedRows[eventDate] = [];
    }
    groupedRows[eventDate].push(item);
  });

  const table2Rows = [];

  Object.keys(groupedRows).forEach(eventDate => {
    // const formattedDate = eventDate ? `Date: ${eventDate}` : 'Date: Empty';
    // const formattedDate = (eventDate === '00-00-0000' || eventDate === '11-30-1899' || !dayjs(eventDate).isValid())
    // ? 'Date: Empty'
    // : `Date: ${dayjs(eventDate).format('MM-DD-YYYY')}`;
    let formattedDate = eventDate
    if (eventDate === "0000-00-00" || eventDate === "11-30-1899") {
      formattedDate = "Date : Empty"
    } else {
      let dayjsDate = dayjs(eventDate);
      if (dayjsDate.isValid()) {
        formattedDate = `Date : ${dayjsDate.format('MM-DD-YYYY')}`;
      } else {
        formattedDate = "Date : Empty";
      }
    }

    table2Rows.push([
      { content: formattedDate, colSpan: 9, styles: { halign: 'center', fontStyle: 'bold', fontSize: 10, halign: 'left', fillColor: [255, 255, 255], lineWidth: 0.1, lineColor: [0, 0, 0], }, minCellHeight: 2, cellPadding: 1 }
    ]);

    groupedRows[eventDate].forEach(item => {
      table2Rows.push([
        item?.event_date ? dayjs(item.event_date).format('MM-DD-YYYY') : '   ',
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
      ]);
    });
  });

  doc.autoTable({
    startY: 50,
    head: [table2Column],
    body: table2Rows,
    margin: { right: 5, left: 5, top: 5, bottom: 5 },
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
      0: { cellWidth: 20 },
      1: { cellWidth: 20 },
      2: { cellWidth: 20 },
      3: { cellWidth: 20 },
      4: { cellWidth: 26 },
      5: { cellWidth: 27 },
      6: { cellWidth: 20 },
      7: { cellWidth: 27 },
      8: { cellWidth: 20 }
    },
    didParseCell: function (data) {
      data.cell.styles.minCellHeight = 11;
    }
  });

  doc.setFontSize(10);
  doc.setFont('times', 'bold');
  // const date = `Print Date:  ${dayjs().format('MM-DD-YYYY')}`;
  const date = dayjs().isValid() ? `Print Date: ${dayjs().format('MM-DD-YYYY')}` : 'Date: Empty';
  doc.text(date, pageWidth - 41, doc.previousAutoTable.finalY + 12);
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
  window.open(pdfUrl, '_blank');
  URL.revokeObjectURL(pdfUrl);
};

export default createDispatchListPrint;