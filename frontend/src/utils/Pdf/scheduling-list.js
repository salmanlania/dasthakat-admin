import dayjs from 'dayjs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import GMSLogo from '../../assets/logo-with-title.png';

const addHeader = (doc, data, pageWidth, sideMargin) => {
  // const detail = data?.data || []

  // doc.addImage(GMSLogo, 'PNG', 8, 3, 32, 26);

  // doc.setFontSize(18);
  // doc.setFont('times', 'bold');
  // doc.text('Global Marine Safety - America', 61, 16);

  // doc.setFontSize(16);
  // doc.setFont('times', 'bold');
  // doc.text('Scheduling', pageWidth / 2, 34, {
  //   align: 'center'
  // });

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
  const text = 'Scheduling';
  const x = pageWidth / 2;
  const y = 30;

  doc.text(text, x, y, { align: 'center' });

  const textWidth = doc.getTextWidth(text);

  const underlineY = y + 2;
  doc.setDrawColor(32, 50, 114);
  doc.setLineWidth(0.5);
  doc.line(x - textWidth / 2, underlineY, x + textWidth / 2, underlineY);

  const date = dayjs().isValid() ? `Print Date: ${dayjs().format('MM-DD-YYYY HH:mm:ss')}` : 'Date: Empty';
  doc.setFontSize(10);
  doc.setFont('times', 'bold');
  // doc.setTextColor(40, 81, 152);
  doc.setTextColor('#285198');
  doc.text(date, pageWidth - 54, 34);
  doc.setTextColor(0, 0, 0);
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
    'Agent',
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
        item?.agent_name || '   ',
        item?.status || '   '
      ]);

      if (item?.technician_notes) {
        table2Rows.push([
          {
            content: 'Technician Notes:',
            colSpan: 1,
            styles: { fontStyle: 'bold', halign: 'left' }
          },
          {
            content: item.technician_notes,
            colSpan: 6,
            styles: { fontStyle: 'normal', halign: 'left' }
          }
        ]);
      }

      if (item?.agent_notes) {
        table2Rows.push([
          {
            content: 'Agent Notes:',
            colSpan: 1,
            styles: { fontStyle: 'bold', halign: 'left' }
          },
          {
            content: item.agent_notes,
            colSpan: 6,
            styles: { fontStyle: 'normal', halign: 'left' }
          }
        ]);
      }
      if (item?.agent_name || item?.agent_email || item?.agent_phone || item?.agent_fax) {
        const agentInfo = `Name: ${item.agent_name || '   '} | Email: ${item.agent_email || '   '} | Phone: ${item.agent_phone || '   '} | Fax: ${item.agent_fax || '   '}`;
        table2Rows.push([
          {
            content: 'Agent Info:',
            colSpan: 1,
            styles: { fontStyle: 'bold', halign: 'left' }
          },
          {
            content: agentInfo,
            colSpan: 6,
            styles: { fontStyle: 'normal', halign: 'left' }
          }
        ]);
      }
      if (item?.short_codes?.length) {
        table2Rows.push([
          {
            content: 'Job Scope:',
            colSpan: 1,
            styles: { fontStyle: 'bold', halign: 'left' }
          },
          {
            content: item.short_codes.map(sc => sc.label).join(', '),
            colSpan: 6,
            styles: { fontStyle: 'normal', halign: 'left' }
          }
        ]);
      }
    });
  });

  doc.autoTable({
    startY: 35,
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
      cellPadding: 1,
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
      0: { cellWidth: 27 },
      1: { cellWidth: 27 },
      2: { cellWidth: 27 },
      3: { cellWidth: 27 },
      4: { cellWidth: 35 },
      6: { cellWidth: 27 },
      7: { cellWidth: 27 }
    },
    didParseCell: function (data) {
      const content = data.cell.text;
      const minHeight = 8;
      const additionalHeight = content.length > 50 ? 4 : 0;
      data.cell.styles.minCellHeight = minHeight + additionalHeight;
      // data.cell.styles.minCellHeight = 8;
    }
  });
};

const createSchedulingListPrint = (data, multiple = false) => {
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

export default createSchedulingListPrint;