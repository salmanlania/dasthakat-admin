// import ExcelJS from 'exceljs';
// import { saveAs } from 'file-saver';

// export const dispatchExportExcel = async (data, columns) => {
//     console.log('data' , data)
//   console.log('data[0]' , data[0])
//   console.log('columns' , columns)
//   const workbook = new ExcelJS.Workbook();
//   const worksheet = workbook.addWorksheet('Dispatch Data');

//   // Add Header
//   const headerRow = columns.map(col => col.header);
//   worksheet.addRow(headerRow);

//   // Apply header styles
//   worksheet.getRow(1).font = { bold: true };
//   worksheet.columns = columns.map(col => ({ width: col.width || 20 }));

//   // Add Data Rows
//   // data.forEach(row => {
//   //   worksheet.addRow(columns.map(col => row[col.key] || ''));
//   // });

//   data.forEach(row => {
//     const rowData = columns.map(col => {
//       const value = row[col.key];
//       if (Array.isArray(value)) return value.join(', ');
//       if (value === null || value === undefined) return '';
//       return value;
//     });
  
//     console.log('Excel Row:', rowData); // Log each row being added
  
//     worksheet.addRow(rowData);
//   });  

//   // Create file
//   const buffer = await workbook.xlsx.writeBuffer();
//   const blob = new Blob([buffer], {
//     type:
//       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//   });

//   saveAs(blob, 'dispatch_data.xlsx');
// };


// import * as XLSX from 'xlsx';

// export const dispatchExportExcel = (data) => {
//   console.log('data' , data[0])
//   if (!data || !data.length) return;

//   const exportData = data.map((item) => ({
//     'Date': item?.event_date ? item?.event_date : "",
//     'Time': item?.event_time ? item?.event_time : "",
//     'Event Number': item?.event_code ? item?.event_code : "",
//     'Vessel Name': item?.vessel_name ? item?.vessel_name : "",
//     'Client Name': item?.client_name ? item?.client_name : "",
//     'Location': item?.location_name ? item?.location_name : "",
//     'Technician Notes': item?.technician_notes ? item?.technician_notes : "",
//     'Agent Name': item?.agent_name ? item?.agent_name : "",
//     'Agent Notes': item?.agent_notes ? item?.agent_notes : "",
//     'Status': item?.status ? item?.status : "",
//   }));

//   const worksheet = XLSX.utils.json_to_sheet(exportData);
//   console.log('worksheet' , worksheet)
//   // return
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, 'Scheduling List');

//   XLSX.writeFile(workbook, 'Scheduling.xlsx');
// };

import * as XLSX from 'xlsx';

export const dispatchExportExcel = (data) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Dispatch Data");

  XLSX.writeFile(workbook, "dispatch_data.xlsx");
};