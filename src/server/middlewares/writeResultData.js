const Excel = require('exceljs')

const WriteResultData = (req, res, next) => {
  try {
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('Registration Details');
    worksheet.columns = [
      {header: 'Student ID', key: 'studentId'},
      {header: 'Student Name', key: 'studentName'},
      {header: 'Class', key: 'class'},
      {header: 'School', key: 'school'},
      {header: 'Story Category', key: 'storyCategory'},
    ];
    worksheet.columns.forEach(column => {
      column.width = 18
    });
    worksheet.getRow(1).font = {bold: true};

    res.locals.resultData.forEach((e, index) => {
      worksheet.addRow({...e})
    })
    workbook.xlsx.writeFile('uploads/results.xlsx').then(r => next()).catch(e => {
      console.log(e);
      res.status(500).send('Excel write failed, Try Again!');
    });
  } catch (e) {
    console.log(e);
    res.status(500).send('Something went wrong, Try Again!\n' + e);
  }
};

module.exports = WriteResultData;