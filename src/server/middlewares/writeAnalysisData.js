const Excel = require('exceljs')

const WriteAnalysisData = (req, res, next) => {
  try {
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('Registration Details');
    worksheet.columns = [
      {header: 'Student ID', key: 'studentId'},
      {header: 'Student Name', key: 'studentName'},
      {header: 'Class', key: 'class'},
      {header: 'Story Category', key: 'storyCategory'},
      {header: 'Student Email', key: 'studentEmail'},
      {header: 'Student Phone', key: 'studentPhone'},
      {header: 'Registration Date', key: 'registrationDate'},
      {header: 'Transaction ID', key: 'transactionId'},
      {header: 'Payment ID', key: 'paymentId'},
      {header: 'Payment Status', key: 'paymentStatus'},
      {header: 'School', key: 'school'},
      {header: 'City', key: 'city'},
      {header: 'Coordinator Name', key: 'coordinatorName'},
      {header: 'Coordinator Email', key: 'coordinatorEmail'},
      {header: 'Coordinator Phone', key: 'coordinatorPhone'}
    ];
    worksheet.columns.forEach(column => {
      column.width = 18
    });
    worksheet.getRow(1).font = {bold: true};

    res.locals.analysisData.forEach((e, index) => {
      worksheet.addRow({...e})
    })
    workbook.xlsx.writeFile('uploads/Student Data.xlsx').then(r => next()).catch(e => {
      console.log(e);
      res.status(500).send('Excel write failed, Try Again!');
    });
  } catch (e) {
    console.log(e);
    res.status(500).send('Something went wrong, Try Again!');
  }
}

module.exports = WriteAnalysisData;