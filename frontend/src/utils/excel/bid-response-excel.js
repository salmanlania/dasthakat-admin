import dayjs from 'dayjs';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import GMSLogo from '../../assets/logo-with-title.png';
import { formatThreeDigitCommas, roundUpto } from '../number';
import { calculateTimeDifference, minutesToReadable } from '../dateTime';

const getImageBuffer = async (image) => {
  const img = await fetch(image);
  const imageBlob = await img.blob();
  const buffer = await imageBlob.arrayBuffer();

  return buffer;
};

const addCell = (worksheet, currentRow, colConfig) => {
  const {
    startCol,
    value,
    colSpan = 1,
    alignment = { horizontal: 'center' },
    backgroundColor,
    border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    },
  } = colConfig;

  if (colSpan > 1) {
    const endCol = String.fromCharCode(startCol.charCodeAt(0) + colSpan - 1);
    worksheet.mergeCells(`${startCol}${currentRow}:${endCol}${currentRow}`);
  }

  const cell = worksheet.getCell(`${startCol}${currentRow}`);
  cell.value = value;
  cell.alignment = alignment;

  if (backgroundColor) {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: backgroundColor },
    };
  }

  if (border) {
    cell.border = border;
  }
};

const addDataTable = (worksheet, data, headingSlug = '') => {
  // Heading
  let currentRow = worksheet.lastRow._number + 2;

  worksheet.mergeCells(`B${currentRow}:S${currentRow}`);
  worksheet.getCell(`B${currentRow}`).value = `BID RESPONSE REPORT ${headingSlug}`;
  worksheet.getCell(`B${currentRow}`).alignment = { horizontal: 'center' };
  worksheet.getCell(`B${currentRow}`).font = {
    bold: true,
    size: 14,
  };
  worksheet.getCell(`B${currentRow}`).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'ded9c4' },
  };
  worksheet.getCell(`B${currentRow}`).border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };

  currentRow = worksheet.lastRow._number + 1;

  // Add header cells
  const headerConfig = [
    { startCol: 'B', value: 'Event No', colSpan: 2 },
    { startCol: 'D', value: 'Quote No', colSpan: 2 },
    { startCol: 'F', value: 'Vessel', colSpan: 3 },
    { startCol: 'I', value: 'Customer', colSpan: 3 },
    { startCol: 'L', value: 'Total Amount', colSpan: 2 },
    { startCol: 'N', value: 'Created', colSpan: 2 },
    { startCol: 'P', value: 'Sent to Customer', colSpan: 2 },
    { startCol: 'R', value: 'Response Rate', colSpan: 2 },
  ];
  headerConfig.forEach((config) => {
    addCell(worksheet, currentRow, { ...config, backgroundColor: 'ded9c4' });
  });

  const uniqueEvents = new Set();
  const uniqueQuotes = new Set();
  const uniqueVessel = new Set();
  const uniqueCustomer = new Set();
  let totalAmount = 0;
  let totalResponseRate = 0;

  // Details Items
  data.forEach((item) => {
    currentRow = worksheet.lastRow._number + 1;

    if (item.event_code) uniqueEvents.add(item.event_code);
    if (item.document_identity) uniqueQuotes.add(item.document_identity);
    if (item.vessel_id) uniqueVessel.add(item.vessel_id);
    if (item.customer_id) uniqueCustomer.add(item.customer_id);
    if (item.total_amount) totalAmount += +item.total_amount;
    if (item.created_at && item.qs_date) {
      const created = dayjs(item.created_at);
      const responded = dayjs(item.qs_date);
      totalResponseRate += responded.diff(created, 'minute');
    }

    const itemConfig = [
      { startCol: 'B', value: item?.event_code, colSpan: 2 },
      { startCol: 'D', value: item?.document_identity, colSpan: 2 },
      { startCol: 'F', value: item?.vessel_name, colSpan: 3, alignment: { horizontal: 'left' } },
      {
        startCol: 'I',
        value: item?.customer_name,
        colSpan: 3,
        alignment: { horizontal: 'left' },
      },
      {
        startCol: 'L',
        value: item?.total_amount ? `$${formatThreeDigitCommas(item?.total_amount)}` : '',
        colSpan: 2,
        alignment: { horizontal: 'right' },
      },
      {
        startCol: 'N',
        value: item?.created_at ? dayjs(item?.created_at).format('MM-DD-YYYY HH:mm A') : '',
        colSpan: 2,
        alignment: { horizontal: 'left' },
      },
      {
        startCol: 'P',
        value: item?.qs_date ? dayjs(item?.qs_date).format('MM-DD-YYYY HH:mm A') : '',
        colSpan: 2,
        alignment: { horizontal: 'left' },
      },
      {
        startCol: 'R',
        value:
          item?.created_at && item?.qs_date
            ? calculateTimeDifference(item.created_at, item.qs_date)
            : '',
        colSpan: 2,
        alignment: { horizontal: 'left' },
      },
    ];

    itemConfig.forEach((config) => {
      addCell(worksheet, currentRow, config);
    });
  });

  const totalEvents = uniqueEvents.size;
  const totalQuotes = uniqueQuotes.size;
  const totalVessel = uniqueVessel.size;
  const totalCustomer = uniqueCustomer.size;

  const dividedTotalResponseRate = Math.floor(totalResponseRate / totalQuotes);

  // summary config
  const summaryConfig = [
    { startCol: 'B', value: `Events: ${totalEvents}`, colSpan: 2 },
    { startCol: 'D', value: `Quotes: ${totalQuotes}`, colSpan: 2 },
    { startCol: 'F', value: `Vessels: ${totalVessel}`, colSpan: 3 },
    { startCol: 'I', value: `Customers: ${totalCustomer}`, colSpan: 3 },
    {
      startCol: 'L',
      value: `$${formatThreeDigitCommas(roundUpto(totalAmount))}`,
      colSpan: 2,
      alignment: { horizontal: 'right' },
    },
    { startCol: 'N', value: '', colSpan: 2 },
    {
      startCol: 'P',
      value: `Response Rate: ${minutesToReadable(dividedTotalResponseRate)}`,
      colSpan: 4,
    },
  ];

  currentRow = worksheet.lastRow._number + 2;
  summaryConfig.forEach((config) => {
    addCell(worksheet, currentRow, config);
  });
};

const generateBidResponseExcel = async (data = [], groupByData = [], groupBy = null) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Quotation');

  // GMS Logo
  const imageId = workbook.addImage({
    buffer: getImageBuffer(GMSLogo),
    extension: 'png',
  });
  worksheet.addImage(imageId, ' B2:C4');

  // Merge cells for the title section
  worksheet.mergeCells('H2:N2');
  worksheet.mergeCells('H3:N3');
  worksheet.mergeCells('F4:Q4');

  worksheet.getCell('H2').value = 'Global Marine Safety - America';
  worksheet.getCell('H2').font = {
    bold: true,
    size: 22,
  };
  worksheet.getCell('H2').alignment = { horizontal: 'center' };

  worksheet.getCell('H3').value = '9145 Wallisville Rd, Houston TX 77029, USA';
  worksheet.getCell('H3').alignment = { horizontal: 'center' };

  worksheet.getCell('F4').value =
    'Tel: 1 713-518-1715, Fax: 1 713-518-1760, Email: sales@gms-america.com';
  worksheet.getCell('F4').alignment = { horizontal: 'center' };

  if (groupBy) {
    for (const key in groupByData) {
      const getFormattedValue = (data, field) => {
        return data?.[0]?.[field] || '';
      };

      const getTitleByGroupType = {
        date: (data) => {
          const createdAt = getFormattedValue(data, 'created_at');
          return createdAt ? dayjs(createdAt).format('MM-DD-YYYY') : '';
        },
        event: (data) => getFormattedValue(data, 'event_code'),
        customer: (data) => getFormattedValue(data, 'customer_name'),
        vessel: (data) => getFormattedValue(data, 'vessel_name'),
      };

      const pageTitleSlug = getTitleByGroupType[groupBy]
        ? `(${groupBy.charAt(0).toUpperCase() + groupBy.slice(1)} - ${getTitleByGroupType[groupBy](groupByData[key])})`
        : '';

      addDataTable(worksheet, groupByData[key], pageTitleSlug);
    }

    const uniqueEvents = new Set();
    const uniqueQuotes = new Set();
    const uniqueVessel = new Set();
    const uniqueCustomer = new Set();
    let totalAmount = 0;
    let totalResponseRate = 0;

    data.forEach((item) => {
      if (item.event_code) uniqueEvents.add(item.event_code);
      if (item.document_identity) uniqueQuotes.add(item.document_identity);
      if (item.vessel_id) uniqueVessel.add(item.vessel_id);
      if (item.customer_id) uniqueCustomer.add(item.customer_id);
      if (item.total_amount) totalAmount += +item.total_amount;
      if (item.created_at && item.qs_date) {
        const created = dayjs(item.created_at);
        const responded = dayjs(item.qs_date);
        totalResponseRate += responded.diff(created, 'minute');
      }
    });

    const totalEvents = uniqueEvents.size;
    const totalQuotes = uniqueQuotes.size;
    const totalVessel = uniqueVessel.size;
    const totalCustomer = uniqueCustomer.size;
    const dividedTotalResponseRate = Math.floor(totalResponseRate / totalQuotes);

    // summary config
    const summaryConfig = [
      { startCol: 'B', value: `Events: ${totalEvents}`, colSpan: 2 },
      { startCol: 'D', value: `Quotes: ${totalQuotes}`, colSpan: 2 },
      { startCol: 'F', value: `Vessels: ${totalVessel}`, colSpan: 3 },
      { startCol: 'I', value: `Customers: ${totalCustomer}`, colSpan: 3 },
      {
        startCol: 'L',
        value: `$${formatThreeDigitCommas(roundUpto(totalAmount))}`,
        colSpan: 2,
        alignment: { horizontal: 'right' },
      },
      { startCol: 'N', value: '', colSpan: 2 },
      {
        startCol: 'P',
        value: `Response Rate: ${minutesToReadable(dividedTotalResponseRate)}`,
        colSpan: 4,
      },
    ];
    // Add separator line
    let currentRow = worksheet.lastRow._number + 2;
    worksheet.mergeCells(`B${currentRow}:S${currentRow}`);
    worksheet.getCell(`B${currentRow}`).border = {
      top: { style: 'medium' },
    };

    currentRow = worksheet.lastRow._number + 1;

    worksheet.mergeCells(`B${currentRow}:S${currentRow}`);
    worksheet.getCell(`B${currentRow}`).value = 'Grand Total';
    worksheet.getCell(`B${currentRow}`).font = { bold: true, size: 16 };
    worksheet.getCell(`B${currentRow}`).alignment = { horizontal: 'center' };
    worksheet.getCell(`B${currentRow}`).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    currentRow = worksheet.lastRow._number + 1;
    summaryConfig.forEach((config) => {
      addCell(worksheet, currentRow, config);
    });
  } else {
    addDataTable(worksheet, data);
  }

  // Styling
  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.font = { name: 'Times', family: 4, color: { argb: '203272' }, ...cell.font };
    });
  });

  // Generate Excel file
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `Bid Response Report${groupBy ? ` (${groupBy.toUpperCase()})` : ''}`);
};

export default generateBidResponseExcel;
