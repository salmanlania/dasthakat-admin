import dayjs from 'dayjs';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import GMSLogo from '../../assets/logo-with-title.png';
import toast from 'react-hot-toast';

const getImageBuffer = async (image) => {
  const img = await fetch(image);
  const imageBlob = await img.blob();
  const buffer = await imageBlob.arrayBuffer();

  return buffer;
};

const generateQuotationReportExcel = async (datas) => {
  console.log('datas top', datas)

  try {
    const data = datas?.data
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Quotation Report');

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

    worksheet.getCell('C6').value = 'Quotation Report';
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

    worksheet.getCell(`B${currentRow}`).value = 'Quotation Date';
    worksheet.getCell(`B${currentRow}`).alignment = { horizontal: 'center', wrapText: true };

    worksheet.getCell(`C${currentRow}`).value = 'Quotation No';
    worksheet.getCell(`C${currentRow}`).alignment = { horizontal: 'center', wrapText: true };

    worksheet.getCell(`D${currentRow}`).value = 'Event Number';
    worksheet.getCell(`D${currentRow}`).alignment = { horizontal: 'center', wrapText: true };

    worksheet.getCell(`E${currentRow}`).value = 'Vessel';
    worksheet.getCell(`E${currentRow}`).alignment = { horizontal: 'center', wrapText: true };

    worksheet.getCell(`F${currentRow}`).value = 'Customer';
    worksheet.getCell(`F${currentRow}`).alignment = { horizontal: 'center', wrapText: true };

    worksheet.getCell(`G${currentRow}`).value = 'Total Quantity'
    worksheet.getCell(`G${currentRow}`).alignment = { horizontal: 'center', wrapText: true };

    worksheet.getCell(`H${currentRow}`).value = 'Total Amount';
    worksheet.getCell(`H${currentRow}`).alignment = { horizontal: 'center', wrapText: true };

    worksheet.getCell(`I${currentRow}`).value = 'Port';
    worksheet.getCell(`I${currentRow}`).alignment = { horizontal: 'center', wrapText: true };

    worksheet.getCell(`J${currentRow}`).value = 'Status';
    worksheet.getCell(`J${currentRow}`).alignment = { horizontal: 'center', wrapText: true };

    worksheet.getCell(`K${currentRow}`).value = 'Created At';
    worksheet.getCell(`K${currentRow}`).alignment = { horizontal: 'center', wrapText: true };

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

    let totalQuantity = 0;
    let totalAmount = 0;

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

          const formattedDate = detail?.document_date && dayjs(detail.document_date).isValid() && dayjs(detail.document_date).format('MM-DD-YYYY') !== '11-30-1899'
            ? dayjs(detail.event_date).format('MM-DD-YYYY')
            : '';

          worksheet.getCell(`B${currentRow}`).value = formattedDate;

          const cells = worksheet.getCell(`C${currentRow}`);
          cells.value = detail?.document_identity || '   ';
          cells.alignment = { horizontal: 'center', vertical: 'middle' };

          worksheet.getCell(`D${currentRow}`).value = detail?.event_code || null;

          worksheet.getCell(`E${currentRow}`).value = detail?.vessel_name || '   '

          const cell = worksheet.getCell(`F${currentRow}`);
          cell.value = detail?.customer_name || '   ';
          cell.alignment = { horizontal: 'center' };

          worksheet.getCell(`G${currentRow}`).value = detail?.total_quantity || null;

          worksheet.getCell(`H${currentRow}`).value = detail?.total_amount || '   '

          worksheet.getCell(`I${currentRow}`).value = detail?.port_name || '   '

          worksheet.getCell(`J${currentRow}`).value = detail?.status || '   '

          worksheet.getCell(`K${currentRow}`).value = detail?.created_at ? dayjs(detail.created_at).format('MM-DD-YYYY hh:mm A') : '   '

          // Add to totals
          totalQuantity += parseFloat(detail?.total_quantity) || 0;
          totalAmount += parseFloat(detail?.total_amount) || 0;

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
        })
      })
    }

    currentRow = worksheet.lastRow._number + 1;

    // Merge cells B to F for "Total" label
    worksheet.mergeCells(`B${currentRow}:F${currentRow}`);
    worksheet.getCell(`B${currentRow}`).value = 'Total';
    worksheet.getCell(`B${currentRow}`).font = {
      bold: true,
      size: 14,
      color: { argb: 'FF000000' }
    };
    worksheet.getCell(`B${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell(`B${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD700' } // Gold background for total row
    };

    // Add total quantity in column G
    worksheet.getCell(`G${currentRow}`).value = totalQuantity;
    worksheet.getCell(`G${currentRow}`).font = {
      bold: true,
      size: 12,
      color: { argb: 'FF000000' }
    };
    worksheet.getCell(`G${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell(`G${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD700' }
    };

    // Add total amount in column H
    worksheet.getCell(`H${currentRow}`).value = totalAmount;
    worksheet.getCell(`H${currentRow}`).font = {
      bold: true,
      size: 12,
      color: { argb: 'FF000000' }
    };
    worksheet.getCell(`H${currentRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell(`H${currentRow}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD700' }
    };

    // Add borders to the total row
    ['B', 'C', 'D', 'E', 'F', 'G', 'H'].forEach(col => {
      worksheet.getCell(`${col}${currentRow}`).border = {
        top: { style: 'thick' },
        left: { style: 'thin' },
        bottom: { style: 'thick' },
        right: { style: 'thin' }
      };
    });

    worksheet.eachRow((row) => {
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.font = { name: 'Times', family: 4, color: { argb: '203272' }, ...cell.font };
      });
    });

    const currentDateTime = dayjs().format('YYYYMMDD-HHmmss');
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Quotation Report-${datas?.data[0]?.company_id ? datas?.data[0]?.company_id : datas?.data[0]?.created_at}.xlsx`);

  } catch (error) {
    toast.error(error)
  }

};

export default generateQuotationReportExcel;