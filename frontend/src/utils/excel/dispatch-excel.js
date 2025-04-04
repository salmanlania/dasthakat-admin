import dayjs from 'dayjs';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import GMSLogo from '../../assets/logo-with-title.png';
import Logo1 from '../../assets/quotation/logo1.png';
import Logo2 from '../../assets/quotation/logo2.png';
import Logo3 from '../../assets/quotation/logo3.png';
import Logo4 from '../../assets/quotation/logo4.png';
import Logo5 from '../../assets/quotation/logo5.png';
import Logo6 from '../../assets/quotation/logo6.png';
import Logo7 from '../../assets/quotation/logo7.png';
import QuotationTerms from '../../assets/quotation/quotationTerms.jpg';
import { formatThreeDigitCommas, roundUpto } from '../number';

const getImageBuffer = async (image) => {
  const img = await fetch(image);
  const imageBlob = await img.blob();
  const buffer = await imageBlob.arrayBuffer();

  return buffer;
};

const generateDispatchExcel = async (datas) => {

  try {
    const data = datas?.data
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Scheduling');

    const imageBuffer = await getImageBuffer(GMSLogo);
    const imageId = workbook.addImage({
      buffer: getImageBuffer(GMSLogo),
      extension: 'png'
    });
    worksheet.addImage(imageId, ' A2:B4');

    worksheet.mergeCells('C2:I2');
    worksheet.mergeCells('C3:I3');
    worksheet.mergeCells('C4:I4');

    worksheet.getCell('C2').value = 'Global Marine Safety - America';
    worksheet.getCell('C2').font = {
      bold: true,
      size: 22
    };
    worksheet.getCell('C2').alignment = { horizontal: 'center' };

    worksheet.getCell('C3').value = '9145 Wallisville Rd, Houston TX 77029, USA';
    worksheet.getCell('C3').alignment = { horizontal: 'center' };

    worksheet.getCell('C4').value =
      'Tel: 1 713-518-1715, Fax: 1 713-518-1760, Email: sales@gms-america.com';
    worksheet.getCell('C4').alignment = { horizontal: 'center' };

    let currentRow = worksheet.lastRow._number + 2;
    for (let i = 0; i < 2; i++) {
      worksheet.getRow(currentRow + i).eachCell({ includeEmpty: true }, (cell) => {

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

        cell.border = value
          ? { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } }
          : { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };

      });
    }

    currentRow = worksheet.lastRow._number + 1;

    worksheet.getCell(`A${currentRow}`).value = 'Date';

    worksheet.getCell(`B${currentRow}`).value = 'Time';

    worksheet.getCell(`C${currentRow}`).value = 'Event Number';

    worksheet.getCell(`D${currentRow}`).value = 'Vessel Name';

    // worksheet.mergeCells(`I${currentRow}:J${currentRow}`);
    worksheet.getCell(`E${currentRow}`).value = 'Technician';

    // worksheet.mergeCells(`K${currentRow}:L${currentRow}`);
    worksheet.getCell(`F${currentRow}`).value = 'Technician Notes';

    worksheet.getCell(`G${currentRow}`).value = 'Agent';
    // worksheet.getColumn('G').width = 10;

    // worksheet.mergeCells(`N${currentRow}:O${currentRow}`);
    worksheet.getCell(`H${currentRow}`).value = 'Agent Notes';

    worksheet.getCell(`I${currentRow}`).value = 'Status';

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

    if (Array.isArray(data) && data.length) {
      const groupByField = 'event_date';

      const grouped = data.reduce((acc, item) => {
        const key = item[groupByField] || 'Unknown';
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      }, {});

      Object.entries(grouped).forEach(([groupTitle, groupItems]) => {
        // 🔹 Subheading Row
        currentRow = worksheet.lastRow._number + 1;
        worksheet.mergeCells(`A${currentRow}:I${currentRow}`);
        const subheadingCell = worksheet.getCell(`A${currentRow}`);
        const formattedDate = groupTitle && dayjs(groupTitle).isValid() && dayjs(groupTitle).format('MM-DD-YYYY') !== '11-30-1899'
          ? dayjs(groupTitle).format('MM-DD-YYYY')
          : 'Empty';
        subheadingCell.value = `Date: ${formattedDate}`;
        // subheadingCell.value = `${groupByField.replace('_', ' ').toUpperCase()}: ${groupTitle}`;
        subheadingCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF' },
        };
        subheadingCell.font = { bold: true, size: 12 };
        subheadingCell.alignment = { horizontal: 'left' };

        worksheet.getCell(`E${currentRow}`).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };

        let firstRow = currentRow + 1;
        let lastRow = firstRow + groupItems.length - 1;

        groupItems.forEach((detail) => {
          currentRow = worksheet.lastRow._number + 1;
          worksheet.getRow(currentRow).height = 44;
          worksheet.getRow(currentRow).alignment = { vertical: 'middle' };
          // const cellA = worksheet.getCell(`A${currentRow}`);
          // cellA.value = detail?.event_date ? dayjs(detail.event_date).format('MM-DD-YYYY') : "null";
          // cellA.numFmt = '@'; 
          const formattedDate = detail?.event_date && dayjs(detail.event_date).isValid() && dayjs(detail.event_date).format('MM-DD-YYYY') !== '11-30-1899'
            ? dayjs(detail.event_date).format('MM-DD-YYYY')
            : '';  // Return an empty string if the date is invalid or '11-30-1899'

          worksheet.getCell(`A${currentRow}`).value = formattedDate;
          // worksheet.getCell(`A${currentRow}`).value = detail?.event_date ? dayjs(detail.event_date).format('MM-DD-YYYY') : '';
          const cells = worksheet.getCell(`B${currentRow}`);
          cells.value = detail?.event_time || '   ';
          cells.alignment = { horizontal: 'center', vertical: 'middle' };

          worksheet.getCell(`C${currentRow}`).value = detail?.event_code || null;

          worksheet.getCell(`D${currentRow}`).value = detail?.vessel_name || '   '

          // worksheet.mergeCells(`I${currentRow}:J${currentRow}`);
          worksheet.getCell(`E${currentRow}`).value = Array.isArray(detail?.technicians)
            ? detail.technicians.map(t => t.user_name).join(', ')
            : '   ';

          // worksheet.mergeCells(`K${currentRow}:L${currentRow}`);
          worksheet.getCell(`F${currentRow}`).value = detail?.technician_notes || '   '

          const cell = worksheet.getCell(`G${currentRow}`);
          cell.value = detail?.agent_name || '   '
          cell.alignment = { horizontal: 'center' };

          worksheet.getCell(`H${currentRow}`).value = detail?.agent_notes || '   '

          worksheet.getCell(`I${currentRow}`).value = detail?.status || '   '

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
      })
    }

    worksheet.eachRow((row) => {
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.font = { name: 'Times', family: 4, color: { argb: '203272' }, ...cell.font };
      });
    });

    const currentDateTime = dayjs().format('YYYYMMDD-HHmmss');
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Scheduling-${datas?.data[0]?.company_id ? datas?.data[0]?.company_id : datas?.data[0]?.created_at}.xlsx`);
  } catch (error) {
    console.log('error', error)
  }

};

export default generateDispatchExcel;