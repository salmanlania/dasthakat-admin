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
import useError from '../../hooks/useError';

const getImageBuffer = async (image) => {
  const img = await fetch(image);
  const imageBlob = await img.blob();
  const buffer = await imageBlob.arrayBuffer();

  return buffer;
};

const generateSchedulingExcel = async (datas) => {

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
    worksheet.mergeCells('C6:I6');

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

    worksheet.getCell('C6').value = 'Scheduling';
    worksheet.getCell('C6').font = {
      bold: true,
      size: 22
    };
    worksheet.getCell('C6').alignment = { horizontal: 'center' };

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

    worksheet.getCell(`B${currentRow}`).value = 'Date';

    worksheet.getCell(`C${currentRow}`).value = 'Time';

    worksheet.getCell(`D${currentRow}`).value = 'Event Number';

    worksheet.getCell(`E${currentRow}`).value = 'Vessel Name';

    worksheet.getCell(`F${currentRow}`).value = 'Technician'

    worksheet.getCell(`G${currentRow}`).value = 'Ports';

    worksheet.getCell(`H${currentRow}`).value = 'Status';

    worksheet.getRow(currentRow).eachCell((cell) => {
      if (cell.value) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'ded9c4' }
        };

        cell.font = {
          size: 12,
          color: { argb: 'FF000000' }
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
        currentRow = worksheet.lastRow._number + 1;
        worksheet.mergeCells(`B${currentRow}:H${currentRow}`);
        const subheadingCell = worksheet.getCell(`B${currentRow}`);
        const formattedDate = groupTitle && dayjs(groupTitle).isValid() && dayjs(groupTitle).format('MM-DD-YYYY') !== '11-30-1899'
          ? dayjs(groupTitle).format('MM-DD-YYYY')
          : 'Empty';
        subheadingCell.value = `Date: ${formattedDate}`;
        subheadingCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF' },
        };
        subheadingCell.font = { bold: true, size: 12, color: { argb: 'FF0000' } };
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
          worksheet.getRow(currentRow).height = undefined;
          worksheet.getRow(currentRow).alignment = { vertical: 'middle' };

          const formattedDate = detail?.event_date && dayjs(detail.event_date).isValid() && dayjs(detail.event_date).format('MM-DD-YYYY') !== '11-30-1899'
            ? dayjs(detail.event_date).format('MM-DD-YYYY')
            : '';

          worksheet.getCell(`B${currentRow}`).value = formattedDate;

          const cells = worksheet.getCell(`C${currentRow}`);
          cells.value = detail?.event_time || '   ';
          cells.alignment = { horizontal: 'center', vertical: 'middle' };

          worksheet.getCell(`D${currentRow}`).value = detail?.event_code || null;

          worksheet.getCell(`E${currentRow}`).value = detail?.vessel_name || '   '

          worksheet.getCell(`F${currentRow}`).value = Array.isArray(detail?.technicians)
            ? detail.technicians.map(t => t.user_name).join(', ')
            : '   ';

          const cell = worksheet.getCell(`G${currentRow}`);
          cell.value = (detail?.ports || []).join(', ') || '   ';
          cell.alignment = { horizontal: 'center' };

          worksheet.getCell(`H${currentRow}`).value = detail?.status || '   '

          worksheet.getRow(currentRow).eachCell({ includeEmpty: true }, (cell, index) => {
            if (index >= 2) {
              cell.alignment = {
                horizontal: 'center',
                vertical: 'top',
                wrapText: true
              };
              cell.font = {
                bold: true,
                color: { argb: 'FF02AD2F' },
                size: 8
              }
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

          // 1. Scope
          currentRow = worksheet.lastRow._number + 1;

          worksheet.getCell(`B${currentRow}`).value = 'Jobe Scope:';
          worksheet.getCell(`B${currentRow}`).font = { bold: true, color: { argb: 'FF000000' } };
          worksheet.getCell(`B${currentRow}`).alignment = { vertical: 'top', horizontal: 'left' };
          worksheet.getCell(`B${currentRow}`).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };

          worksheet.mergeCells(`C${currentRow}:H${currentRow}`);

          const allShortCodes = Array.isArray(detail?.short_codes)
            ? detail.short_codes.map(item => item.label).join(', ')
            : '';

          worksheet.getCell(`C${currentRow}`).value = allShortCodes || '';
          worksheet.getCell(`C${currentRow}`).font = { color: { argb: 'FF000000' } };
          worksheet.getCell(`C${currentRow}`).alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
          worksheet.getCell(`C${currentRow}`).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };

          // 2. Agent Info
          if (
            detail?.agent_name ||
            detail?.agent_email ||
            detail?.agent_phone ||
            detail?.agent_fax
          ) {
            currentRow += 1;

            worksheet.getCell(`B${currentRow}`).value = 'Agent Info:';
            worksheet.getCell(`B${currentRow}`).font = { bold: true, color: { argb: 'FF000000' } };
            worksheet.getCell(`B${currentRow}`).alignment = { vertical: 'top', horizontal: 'left' };
            worksheet.getCell(`B${currentRow}`).border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            };

            worksheet.mergeCells(`C${currentRow}:H${currentRow}`);

            const agentInfo =
              (detail?.agent_name ? `Name: ${detail.agent_name}` : '') +
              (detail?.agent_email ? ` | Email: ${detail.agent_email}` : '') +
              (detail?.agent_phone ? ` | Phone: ${detail.agent_phone}` : '') +
              (detail?.agent_fax ? ` | Fax: ${detail.agent_fax}` : '');

            worksheet.getCell(`C${currentRow}`).value = agentInfo;
            worksheet.getCell(`C${currentRow}`).font = { color: { argb: 'FF000000' } };
            worksheet.getCell(`C${currentRow}`).alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
            worksheet.getCell(`C${currentRow}`).border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            };
          }

          // 3. Tech Notes
          currentRow = worksheet.lastRow._number + 1;

          worksheet.getCell(`B${currentRow}`).value = 'Technician Notes:';
          worksheet.getCell(`B${currentRow}`).font = { bold: true, color: { argb: 'FF000000' } };
          worksheet.getCell(`B${currentRow}`).alignment = { vertical: 'top', horizontal: 'left' };
          worksheet.getCell(`B${currentRow}`).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };

          worksheet.mergeCells(`C${currentRow}:H${currentRow}`);

          const allTechNotes = detail?.technician_notes || '';

          worksheet.getCell(`C${currentRow}`).value = allTechNotes || '';
          worksheet.getCell(`C${currentRow}`).font = { color: { argb: 'FF000000' } };
          worksheet.getCell(`C${currentRow}`).alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
          worksheet.getCell(`C${currentRow}`).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };

          // 4. Agent Notes
          currentRow = worksheet.lastRow._number + 1;

          worksheet.getCell(`B${currentRow}`).value = 'Agent Notes:';
          worksheet.getCell(`B${currentRow}`).font = { bold: true, color: { argb: 'FF000000' } };
          worksheet.getCell(`B${currentRow}`).alignment = { vertical: 'top', horizontal: 'left' };
          worksheet.getCell(`B${currentRow}`).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };

          worksheet.mergeCells(`C${currentRow}:H${currentRow}`);

          const allAgentNotes = detail?.agent_notes || '';

          worksheet.getCell(`C${currentRow}`).value = allAgentNotes || '';
          worksheet.getCell(`C${currentRow}`).font = { color: { argb: 'FF000000' } };
          worksheet.getCell(`C${currentRow}`).alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
          worksheet.getCell(`C${currentRow}`).border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        })

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

export default generateSchedulingExcel;