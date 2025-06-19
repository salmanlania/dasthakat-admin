import dayjs from 'dayjs';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import GMSLogo from '../../assets/logo-with-title.png';

const addHeader = (doc, data, pageWidth, sideMargin) => {

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
  const text = 'Quotation Report';
  const x = pageWidth / 2;
  const y = 32;

  doc.text(text, x, y, { align: 'center' });

  const textWidth = doc.getTextWidth(text);

  const underlineY = y + 2;
  doc.setDrawColor(32, 50, 114);
  doc.setLineWidth(0.5);
  doc.line(x - textWidth / 2, underlineY, x + textWidth / 2, underlineY);

  const date = dayjs().isValid() ? `Print Date: ${dayjs().format('MM-DD-YYYY HH:mm:ss')}` : 'Date: Empty';
  doc.setFontSize(10);
  doc.setFont('times', 'bold');
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
    'Quotation Date',
    'Quotation No',
    'Event Number',
    'Vessel',
    'Customer',
    'Total Quantity',
    'Total Amount',
    'Port',
    'Status',
    'Created AT',
  ];

  const detail = data?.data;
  // const groupedRows = {};
  const table2Rows = [];

  let totalQuantity = 0;
  let totalAmount = 0;

  detail?.forEach(item => {

    totalQuantity += Number(item?.total_quantity) || 0;
    totalAmount += Number(item?.total_amount) || 0;

    table2Rows.push([
      {
        content: item?.document_date || '   ',
        styles: { textColor: [32, 50, 114] }
      },
      {
        content: item?.document_identity || '   ',
        styles: { textColor: [32, 50, 114] }
      },
      {
        content: item?.event_code || '   ',
        styles: { textColor: [32, 50, 114] }
      },
      {
        content: item?.vessel_name || '   ',
        styles: { textColor: [32, 50, 114] }
      },
      {
        content: item?.customer_name || '   ',
        styles: { textColor: [32, 50, 114] }
      },
      {
        content: item?.total_quantity || '   ',
        styles: { textColor: [32, 50, 114] }
      },
      {
        content: item?.total_amount || '   ',
        styles: { textColor: [32, 50, 114] }
      },
      {
        content: item?.port_name || '   ',
        styles: { textColor: [32, 50, 114] }
      },
      {
        content: item?.status || '   ',
        styles: { textColor: [32, 50, 114] }
      },
      {
        content: item?.created_at ? dayjs(item.created_at).format('MM-DD-YYYY hh:mm A') : '   ',
        styles: { textColor: [32, 50, 114] }
      },
    ]);
    //   console.log('item', item)
    //   table2Rows.push([
    //     {
    //       content: item?.event_date ? dayjs(item.event_date).format('MM-DD-YYYY') : '   ',
    //       styles: { textColor: [2, 158, 43], fontStyle: 'bold', }
    //     },
    //     {
    //       content: item?.event_time || '   ',
    //       styles: { textColor: [2, 158, 43], fontStyle: 'bold', }
    //     },
    //     {
    //       content: item?.event_code || '   ',
    //       styles: { textColor: [2, 158, 43], fontStyle: 'bold', }
    //     },
    //     {
    //       content: item?.vessel_name || '   ',
    //       styles: { textColor: [2, 158, 43], fontStyle: 'bold', }
    //     },
    //     {
    //       content: item?.ports.map(i => i?.name) || '   ',
    //       styles: { textColor: [2, 158, 43], fontStyle: 'bold', }
    //     },
    //     {
    //       content: Array.isArray(item?.technicians)
    //         ? item.technicians.map(t => t.user_name).join(', ')
    //         : '   ',
    //       styles: { textColor: [2, 158, 43], fontStyle: 'bold', }
    //     },
    //     {
    //       content: item?.status || '   ',
    //       styles: { textColor: [2, 158, 43], fontStyle: 'bold', }
    //     },
    //   ]);

    //   if (item?.short_codes?.length) {
    //     table2Rows.push([
    //       {
    //         content: 'Job Scope:',
    //         colSpan: 1,
    //         styles: { fontStyle: 'bold', halign: 'left' }
    //       },
    //       {
    //         content: item.short_codes.map(sc => sc.label).join(', '),
    //         colSpan: 6,
    //         styles: { fontStyle: 'normal', halign: 'left' }
    //       }
    //     ]);
    //   }
    //   if (item?.agent_name || item?.agent_email || item?.agent_phone || item?.agent_fax) {
    //     const agentInfo = `Name: ${item.agent_name || '   '} | Email: ${item.agent_email || '   '} | Phone: ${item.agent_phone || '   '} | Fax: ${item.agent_fax || '   '}`;
    //     table2Rows.push([
    //       {
    //         content: 'Agent Info:',
    //         colSpan: 1,
    //         styles: { fontStyle: 'bold', halign: 'left' }
    //       },
    //       {
    //         content: agentInfo,
    //         colSpan: 6,
    //         styles: { fontStyle: 'normal', halign: 'left' }
    //       }
    //     ]);
    //   }
    //   if (item?.technician_notes) {
    //     table2Rows.push([
    //       {
    //         content: 'Technician Notes:',
    //         colSpan: 1,
    //         styles: { fontStyle: 'bold', halign: 'left' }
    //       },
    //       {
    //         content: item.technician_notes,
    //         colSpan: 6,
    //         styles: { fontStyle: 'normal', halign: 'left' }
    //       }
    //     ]);
    //   }
    //   if (item?.agent_notes) {
    //     table2Rows.push([
    //       {
    //         content: 'Agent Notes:',
    //         colSpan: 1,
    //         styles: { fontStyle: 'bold', halign: 'left' }
    //       },
    //       {
    //         content: item.agent_notes,
    //         colSpan: 6,
    //         styles: { fontStyle: 'normal', halign: 'left' }
    //       }
    //     ]);
    //   }
    // });
  });

  table2Rows.push([
    { content: 'Total', colSpan: 5, styles: { fontStyle: 'bold', halign: 'left' } },
    { content: totalQuantity.toFixed(2), styles: { fontStyle: 'bold', textColor: [0, 128, 0] } },
    { content: totalAmount.toFixed(2), styles: { fontStyle: 'bold', textColor: [0, 128, 0] } },
    { content: '', styles: {} },
    { content: '', styles: {} }
  ]);

  doc.autoTable({
    startY: 35,
    head: [table2Column],
    body: table2Rows,
    margin: { right: 5, left: 5, top: 35, bottom: 5 },
    headStyles: {
      halign: 'center',
      valign: 'middle',
      fontSize: 10,
      fontStyle: 'bold',
      textColor: [32, 50, 114],
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
      fontSize: 8,
      textColor: [0, 0, 0],
      fillColor: [255, 255, 255]
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255]
    },
    rowPageBreak: 'avoid',
    columnStyles: {
      0: { cellWidth: 22 },
      1: { cellWidth: 19 },
      2: { cellWidth: 19 },
      3: { cellWidth: 23 },
      4: { cellWidth: 23 },
      5: { cellWidth: 19 },
      6: { cellWidth: 19 },
      7: { cellWidth: 19 },
      8: { cellWidth: 23 },
    },
    didParseCell: function (data) {
      const content = data.cell.text;
      const minHeight = 8;
      const additionalHeight = content.length > 50 ? 4 : 0;
      data.cell.styles.minCellHeight = minHeight + additionalHeight;
    }
  });
};

const createQuotationReportPrint = (data, multiple = false) => {
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
    title: `Quotation Report - ${multiple ? data[0]?.data[0]?.company_id : data[0]?.data[0]?.created_at}`
  });
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob, {});
  window.open(pdfUrl, '_blank');
  URL.revokeObjectURL(pdfUrl);
};

export default createQuotationReportPrint;