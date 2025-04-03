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
  // return
  try {
    const data = datas?.data
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Scheduling');

    // GMS Logo
    const imageBuffer = await getImageBuffer(GMSLogo);
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

    // Add "Estimate" title
    // worksheet.mergeCells('J11:K11');
    // worksheet.getCell('J11').value = 'ESTIMATE';
    // worksheet.getCell('J11').font = {
    //   bold: true,
    //   size: 16,
    //   underline: true
    // };
    // worksheet.getCell('G11').alignment = { horizontal: 'center' };

    // Quotation Information
    let currentRow = worksheet.lastRow._number + 2;
    for (let i = 0; i < 2; i++) {
      worksheet.getRow(currentRow + i).eachCell({ includeEmpty: true }, (cell) => {
        // if (cell.value) {
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

        // cell.border = {
        //   top: { style: 'thin' },
        //   left: { style: 'thin' },
        //   bottom: { style: 'thin' },
        //   right: { style: 'thin' }
        // };
        cell.border = value
          ? { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } }
          : { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };

        // }
      });
    }

    // Quotation Details

    // Header
    currentRow = worksheet.lastRow._number + 1;

    // S. No
    worksheet.getCell(`E${currentRow}`).value = 'Date';

    // Description
    worksheet.getCell(`F${currentRow}`).value = 'Time';

    // UOM
    worksheet.getCell(`G${currentRow}`).value = 'Event Number';

    // QTY
    worksheet.getCell(`H${currentRow}`).value = 'Vessel Name';

    // Price Per Unit
    worksheet.mergeCells(`I${currentRow}:J${currentRow}`);
    worksheet.getCell(`I${currentRow}`).value = 'Technician';

    // Gross Amount
    worksheet.mergeCells(`K${currentRow}:L${currentRow}`);
    worksheet.getCell(`K${currentRow}`).value = 'Technician Notes';

    // Discount %
    worksheet.getCell(`M${currentRow}`).value = 'Agent';
    worksheet.getColumn('M').width = 10;

    // Discount Amount
    worksheet.mergeCells(`N${currentRow}:O${currentRow}`);
    worksheet.getCell(`N${currentRow}`).value = 'Agent Notes';

    // Net Amount
    worksheet.getCell(`P${currentRow}`).value = 'Status';

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
      data.forEach((detail) => {
        currentRow = worksheet.lastRow._number + 1;
        worksheet.getRow(currentRow).height = 44;
        worksheet.getRow(currentRow).alignment = { vertical: 'middle' };

        // S. No
        worksheet.getCell(`E${currentRow}`).value = detail?.event_date || '   ';

        // worksheet.getCell(`C${currentRow}`).value = detail?.event_time || '   ';
        // worksheet.getColumn('C').width = 2;
        const cells = worksheet.getCell(`F${currentRow}`);
        cells.value = detail?.event_time || '   ';
        cells.alignment = { horizontal: 'center', vertical: 'middle' };

        worksheet.getCell(`G${currentRow}`).value = detail?.event_code || '   ';

        worksheet.getCell(`H${currentRow}`).value = detail?.vessel_name || '   '

        worksheet.mergeCells(`I${currentRow}:J${currentRow}`);
        // worksheet.getCell(`F${currentRow}`).value = detail?.technician_name || '   '
        worksheet.getCell(`I${currentRow}`).value = Array.isArray(detail?.technicians)
          ? detail.technicians.map(t => t.user_name).join(', ')
          : '   ';

        worksheet.mergeCells(`K${currentRow}:L${currentRow}`);
        worksheet.getCell(`K${currentRow}`).value = detail?.technician_notes || '   '

        // Discount %
        const cell = worksheet.getCell(`M${currentRow}`);
        cell.value = detail?.agent_name || '   '
        cell.alignment = { horizontal: 'center' };
        // Discount Amount
        worksheet.mergeCells(`N${currentRow}:O${currentRow}`);
        worksheet.getCell(`N${currentRow}`).value = detail?.agent_notes || '   '

        // Net Amount
        worksheet.getCell(`P${currentRow}`).value = detail?.status || '   '

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
            // cell.border = value
            //   ? { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } }
            //   : { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
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

    // Total
    // currentRow = worksheet.lastRow._number + 1;
    // worksheet.getRow(currentRow).height = 44;
    // worksheet.getRow(currentRow).alignment = { vertical: 'middle', horizontal: 'center' };
    // worksheet.mergeCells(`B${currentRow}:C${currentRow}`);
    // worksheet.getRow(currentRow).getCell('B').value = 'Total:';
    // worksheet.getRow(currentRow).font = {
    //   bold: true
    // };
    // worksheet.getRow(currentRow).getCell('B').border = {
    //   top: { style: 'thin' },
    //   left: { style: 'thin' },
    //   bottom: { style: 'thin' },
    //   right: { style: 'thin' }
    // };

    // worksheet.mergeCells(`D${currentRow}:K${currentRow}`);
    // worksheet.getRow(currentRow).getCell('D').border = {
    //   top: { style: 'thin' },
    //   left: { style: 'thin' },
    //   bottom: { style: 'thin' },
    //   right: { style: 'thin' }
    // };

    // const totalGrossAmount = data.total_amount ? `$${formatThreeDigitCommas(data.total_amount)}` : '';
    // worksheet.mergeCells(`L${currentRow}:M${currentRow}`);
    // worksheet.getRow(currentRow).getCell('L').value = totalGrossAmount;
    // worksheet.getRow(currentRow).getCell('L').alignment = {
    //   horizontal: 'right',
    //   vertical: 'middle'
    // };
    // worksheet.getRow(currentRow).getCell('L').border = {
    //   top: { style: 'thin' },
    //   left: { style: 'thin' },
    //   bottom: { style: 'thin' },
    //   right: { style: 'thin' }
    // };

    // const totalDiscountAmount = data.total_discount
    //   ? `$${formatThreeDigitCommas(data.total_discount)}`
    //   : '';
    // worksheet.mergeCells(`N${currentRow}:P${currentRow}`);
    // worksheet.getRow(currentRow).getCell('N').value = totalDiscountAmount;
    // worksheet.getRow(currentRow).getCell('N').alignment = {
    //   horizontal: 'right',
    //   vertical: 'middle'
    // };
    // worksheet.getRow(currentRow).getCell('N').border = {
    //   top: { style: 'thin' },
    //   left: { style: 'thin' },
    //   bottom: { style: 'thin' },
    //   right: { style: 'thin' }
    // };

    // const netAmount = data.net_amount ? `$${formatThreeDigitCommas(data.net_amount)}` : '';
    // worksheet.mergeCells(`Q${currentRow}:R${currentRow}`);
    // worksheet.getRow(currentRow).getCell('Q').value = netAmount;
    // worksheet.getRow(currentRow).getCell('Q').alignment = {
    //   horizontal: 'right',
    //   vertical: 'middle'
    // };
    // worksheet.getRow(currentRow).getCell('Q').border = {
    //   top: { style: 'thin' },
    //   left: { style: 'thin' },
    //   bottom: { style: 'thin' },
    //   right: { style: 'thin' }
    // };

    // if (data.term_desc?.trim()) {
    //   currentRow = worksheet.lastRow._number + 1;
    //   const descriptions = data.term_desc.split('\n');
    //   worksheet.mergeCells(`B${currentRow}:C${currentRow + descriptions.length - 1}`);
    //   worksheet.getRow(currentRow).getCell('B').value = 'Notes:';
    //   worksheet.getRow(currentRow).getCell('B').alignment = {
    //     horizontal: 'center',
    //     vertical: 'middle'
    //   };
    //   worksheet.getRow(currentRow).getCell('B').font = {
    //     bold: true
    //   };
    //   worksheet.getRow(currentRow).getCell('B').border = {
    //     top: { style: 'thin' },
    //     left: { style: 'thin' },
    //     bottom: { style: 'thin' },
    //     right: { style: 'thin' }
    //   };

    //   descriptions.forEach((description, index) => {
    //     worksheet.getRow(currentRow + index).height = 44;
    //     worksheet.mergeCells(`D${currentRow + index}:R${currentRow + index}`);
    //     worksheet.getRow(currentRow + index).getCell('D').value = description;
    //     worksheet.getRow(currentRow + index).getCell('D').alignment = {
    //       wrapText: true,
    //       horizontal: 'left',
    //       vertical: 'middle'
    //     };
    //     worksheet.getRow(currentRow + index).getCell('D').border = {
    //       top: { style: 'thin' },
    //       left: { style: 'thin' },
    //       bottom: { style: 'thin' },
    //       right: { style: 'thin' }
    //     };
    //   });
    // }

    // // Footer
    // currentRow = worksheet.lastRow._number + 2;
    // worksheet.mergeCells(`B${currentRow}:R${currentRow}`);
    // worksheet.getRow(currentRow).getCell('B').value =
    //   'Remit Payment to: Global Marine Safety Service Inc Frost Bank, ABA: 114000093, Account no: 502206269, SWIFT: FRSTUS44';
    // worksheet.getRow(currentRow).getCell('B').alignment = {
    //   wrapText: true,
    //   horizontal: 'center',
    //   vertical: 'middle'
    // };

    // // Company Logos
    // currentRow = worksheet.lastRow._number + 2;
    // const logo1Buffer = await getImageBuffer(Logo1);
    // const logo1Id = workbook.addImage({
    //   buffer: logo1Buffer,
    //   extension: 'png'
    // });
    // worksheet.addImage(logo1Id, `B${currentRow}:C${currentRow + 2}`);

    // const logo2Buffer = await getImageBuffer(Logo2);
    // const logo2Id = workbook.addImage({
    //   buffer: logo2Buffer,
    //   extension: 'png'
    // });
    // worksheet.addImage(logo2Id, `D${currentRow}:E${currentRow + 2}`);

    // const logo3Buffer = await getImageBuffer(Logo3);
    // const logo3Id = workbook.addImage({
    //   buffer: logo3Buffer,
    //   extension: 'png'
    // });
    // worksheet.addImage(logo3Id, `G${currentRow}:H${currentRow + 2}`);

    // const logo4Buffer = await getImageBuffer(Logo4);
    // const logo4Id = workbook.addImage({
    //   buffer: logo4Buffer,
    //   extension: 'png'
    // });
    // worksheet.addImage(logo4Id, `J${currentRow}:K${currentRow + 2}`);

    // // const logo5Id = workbook.addImage({
    // //   buffer: getImageBuffer(Logo5),
    // //   extension: 'png'
    // // });
    // // worksheet.addImage(logo5Id, `L${currentRow}:M${currentRow + 2}`);

    // // const logo6Id = workbook.addImage({
    // //   buffer: getImageBuffer(Logo6),
    // //   extension: 'png'
    // // });
    // // worksheet.addImage(logo6Id, `O${currentRow}:P${currentRow + 2}`);

    // // const logo7Id = workbook.addImage({
    // //   buffer: getImageBuffer(Logo7),
    // //   extension: 'png'
    // // });
    // // worksheet.addImage(logo7Id, `Q${currentRow}:R${currentRow + 2}`);

    // // Quotation Terms
    // currentRow = worksheet.lastRow._number + 2;
    // const quotationTermsId = workbook.addImage({
    //   buffer: getImageBuffer(QuotationTerms),
    //   extension: 'jpg'
    // });
    // worksheet.addImage(quotationTermsId, `B${currentRow}:R${currentRow + 80}`);

    // Styling
    worksheet.eachRow((row) => {
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.font = { name: 'Times', family: 4, color: { argb: '203272' }, ...cell.font };
      });
    });

    const currentDateTime = dayjs().format('YYYYMMDD-HHmmss');
    // Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `Scheduling-${datas?.data[0]?.company_id ? datas?.data[0]?.company_id : datas?.data[0]?.created_at}.xlsx`);
  } catch (error) {
    console.log('error', error)
  }

};

export default generateDispatchExcel;
