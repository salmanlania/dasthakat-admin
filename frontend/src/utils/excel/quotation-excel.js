import dayjs from 'dayjs';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import GMSLogo from '../../assets/logo-with-title.png';
import { formatThreeDigitCommas, roundUpto } from '../number';

const getImageBuffer = async (image) => {
  const img = await fetch(image);
  const imageBlob = await img.blob();
  const buffer = await imageBlob.arrayBuffer();

  return buffer;
};

const generateQuotationExcel = async (data) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Quotation');

  console.log(data);

  // GMS Logo
  const imageId = workbook.addImage({
    buffer: getImageBuffer(GMSLogo),
    extension: 'png'
  });
  worksheet.addImage(imageId, ' B2:C4');

  // Merge cells for the title section
  worksheet.mergeCells('G2:M2'); // Company Name
  worksheet.mergeCells('G3:M3'); // Address
  worksheet.mergeCells('E4:O4'); // Contact Details

  worksheet.getCell('G2').value = 'Global Marine Safety - America';
  worksheet.getCell('G2').font = {
    bold: true,
    size: 22
  };
  worksheet.getCell('G2').alignment = { horizontal: 'center' };

  worksheet.getCell('G3').value = '9145 Wallisville Rd, Houston TX 77029, USA';
  worksheet.getCell('G3').alignment = { horizontal: 'center' };

  worksheet.getCell('E4').value =
    'Tel: 1 713-518-1715, Fax: 1 713-518-1760, Email: sales@gms-america.com';
  worksheet.getCell('E4').alignment = { horizontal: 'center' };

  // Bill To
  worksheet.getCell('B7').value = 'Bill To';
  worksheet.getCell('B7').font = {
    bold: true,
    size: 12
  };
  worksheet.getCell('B8').value = data?.customer?.name || '';
  worksheet.getCell('B9').value = data.vessel.billing_address || '';

  // Ship To
  worksheet.getCell('P7').value = 'Ship To';
  worksheet.getCell('P7').font = {
    bold: true,
    size: 12
  };
  worksheet.getCell('P8').value = data?.vessel?.name || '';

  // Add "Estimate" title
  worksheet.mergeCells('J11:K11');
  worksheet.getCell('J11').value = 'ESTIMATE';
  worksheet.getCell('J11').font = {
    bold: true,
    size: 16,
    underline: true
  };
  worksheet.getCell('G11').alignment = { horizontal: 'center' };

  // Quotation Information
  let currentRow = worksheet.lastRow._number + 2;

  // Quotation Date
  worksheet.mergeCells(`B${currentRow}:C${currentRow}`);
  worksheet.getCell(`B${currentRow}`).value = 'Quotation Date';
  worksheet.mergeCells(`B${currentRow + 1}:C${currentRow + 1}`);
  worksheet.getCell(`B${currentRow + 1}`).value = data.document_date
    ? dayjs(data.document_date).format('MM-DD-YYYY')
    : '';

  // Quotation Number
  worksheet.mergeCells(`D${currentRow}:E${currentRow}`);
  worksheet.getCell(`D${currentRow}`).value = 'Quotation Number';
  worksheet.mergeCells(`D${currentRow + 1}:E${currentRow + 1}`);
  worksheet.getCell(`D${currentRow + 1}`).value = data?.document_identity || '';

  // Event No
  worksheet.getCell(`F${currentRow}`).value = 'Event No';
  worksheet.getCell(`F${currentRow + 1}`).value = data?.event?.event_code || '';

  // Customer's Reference
  worksheet.mergeCells(`G${currentRow}:I${currentRow}`);
  worksheet.getCell(`G${currentRow}`).value = "Customer's Reference";
  worksheet.mergeCells(`G${currentRow + 1}:I${currentRow + 1}`);
  worksheet.getCell(`G${currentRow + 1}`).value = data?.customer_ref || '';

  // Delivery Location
  worksheet.mergeCells(`J${currentRow}:L${currentRow}`);
  worksheet.getCell(`J${currentRow}`).value = 'Delivery Location';
  worksheet.mergeCells(`J${currentRow + 1}:L${currentRow + 1}`);
  worksheet.getCell(`J${currentRow + 1}`).value = data?.port?.name || '';

  // Payment Terms
  worksheet.mergeCells(`M${currentRow}:N${currentRow}`);
  worksheet.getCell(`M${currentRow}`).value = 'Payment Terms';
  worksheet.mergeCells(`M${currentRow + 1}:N${currentRow + 1}`);
  worksheet.getCell(`M${currentRow + 1}`).value = data?.payment?.name || '';

  // Flag
  worksheet.getCell(`O${currentRow}`).value = 'Flag';
  worksheet.getCell(`O${currentRow + 1}`).value = data?.flag?.name || '';

  // Class
  worksheet.getCell(`P${currentRow}`).value = 'Class';
  worksheet.getCell(`P${currentRow + 1}`).value =
    `${data.class1 ? `${data.class1.name},` : ''} ${data.class2 ? data.class2.name : ''}`;

  // Date of Service
  worksheet.mergeCells(`Q${currentRow}:R${currentRow}`);
  worksheet.getCell(`Q${currentRow}`).value = 'Date of Service';
  worksheet.mergeCells(`Q${currentRow + 1}:R${currentRow + 1}`);
  worksheet.getCell(`Q${currentRow + 1}`).value = data.service_date
    ? dayjs(data.service_date).format('MM-DD-YYYY')
    : '';

  for (let i = 0; i < 2; i++) {
    worksheet.getRow(currentRow + i).eachCell((cell) => {
      if (cell.value) {
        if (i === 0) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'ded9c4' }
          };

          cell.font = {
            size: 12
          };
        }

        cell.alignment = { horizontal: 'center' };

        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      }
    });
  }

  // Quotation Details

  // Header
  currentRow = worksheet.lastRow._number + 1;

  // S. No
  worksheet.getCell(`B${currentRow}`).value = 'S. No';

  // Description
  worksheet.mergeCells(`C${currentRow}:G${currentRow}`);
  worksheet.getCell(`C${currentRow}`).value = 'Description';

  // UOM
  worksheet.getCell(`H${currentRow}`).value = 'UOM';

  // QTY
  worksheet.getCell(`I${currentRow}`).value = 'QTY';

  // Price Per Unit
  worksheet.mergeCells(`J${currentRow}:K${currentRow}`);
  worksheet.getCell(`J${currentRow}`).value = 'Price per Unit';

  // Gross Amount
  worksheet.mergeCells(`L${currentRow}:M${currentRow}`);
  worksheet.getCell(`L${currentRow}`).value = 'Gross Amount';

  // Discount %
  worksheet.getCell(`N${currentRow}`).value = 'Discount %';

  // Discount Amount
  worksheet.mergeCells(`O${currentRow}:P${currentRow}`);
  worksheet.getCell(`O${currentRow}`).value = 'Discount Amount';

  // Net Amount
  worksheet.mergeCells(`Q${currentRow}:R${currentRow}`);
  worksheet.getCell(`Q${currentRow}`).value = 'Net Amount';

  worksheet.getRow(currentRow).eachCell((cell) => {
    if (cell.value) {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ded9c4' }
      };

      cell.font = {
        size: 12
      };

      cell.alignment = { horizontal: 'center' };

      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    }
  });

  // Details Items
  if (data?.quotation_detail && data?.quotation_detail.length) {
    data.quotation_detail.forEach((detail) => {
      currentRow = worksheet.lastRow._number + 1;
      worksheet.getRow(currentRow).height = 44;
      worksheet.getRow(currentRow).alignment = { vertical: 'top' };

      // S. No
      worksheet.getCell(`B${currentRow}`).value = detail.sort_order + 1;

      // Description
      worksheet.mergeCells(`C${currentRow}:G${currentRow}`);
      const description = `${detail?.product_description || ''}${detail?.description ? `\n \n${detail.description}` : ''}`;
      worksheet.getCell(`C${currentRow}`).value = description;

      // UOM
      worksheet.getCell(`H${currentRow}`).value = detail?.unit?.name || '';

      // QTY
      worksheet.getCell(`I${currentRow}`).value = detail.quantity
        ? formatThreeDigitCommas(parseFloat(detail.quantity))
        : '';

      // Price Per Unit
      worksheet.mergeCells(`J${currentRow}:K${currentRow}`);
      worksheet.getCell(`J${currentRow}`).value = detail.rate
        ? `$${formatThreeDigitCommas(detail.rate)}`
        : '';

      // Gross Amount
      worksheet.mergeCells(`L${currentRow}:M${currentRow}`);
      worksheet.getCell(`L${currentRow}`).value = detail.amount
        ? `$${formatThreeDigitCommas(detail.amount)}`
        : '';

      // Discount %
      worksheet.getCell(`N${currentRow}`).value = detail.discount_percent
        ? `${roundUpto(+detail.discount_percent)}%`
        : '';

      // Discount Amount
      worksheet.mergeCells(`O${currentRow}:P${currentRow}`);
      worksheet.getCell(`O${currentRow}`).value = detail.discount_amount
        ? `$${formatThreeDigitCommas(detail.discount_amount)}`
        : '';

      // Net Amount
      worksheet.mergeCells(`Q${currentRow}:R${currentRow}`);
      worksheet.getCell(`Q${currentRow}`).value = detail.gross_amount
        ? `$${formatThreeDigitCommas(detail.gross_amount)}`
        : '';

      worksheet.getRow(currentRow).eachCell((cell, index) => {
        if (cell.value) {
          cell.alignment = {
            horizontal: 'center',
            vertical: 'middle',
            wrapText: true
          };

          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        }
      });

      worksheet.getRow(currentRow).getCell('C').alignment = {
        wrapText: true,
        horizontal: 'left',
        vertical: 'top'
      };

      worksheet.getRow(currentRow).getCell('J').alignment = {
        wrapText: true,
        horizontal: 'right',
        vertical: 'middle'
      };
      worksheet.getRow(currentRow).getCell('L').alignment = {
        wrapText: true,
        horizontal: 'right',
        vertical: 'middle'
      };
      worksheet.getRow(currentRow).getCell('O').alignment = {
        wrapText: true,
        horizontal: 'right',
        vertical: 'middle'
      };
      worksheet.getRow(currentRow).getCell('Q').alignment = {
        wrapText: true,
        horizontal: 'right',
        vertical: 'middle'
      };
    });
  }

  // Styling
  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.font = { name: 'Times', family: 4, color: { argb: '203272' }, ...cell.font };
    });
  });

  // Generate Excel file
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `Quotation-${data?.document_identity}.xlsx`);
};

export default generateQuotationExcel;
