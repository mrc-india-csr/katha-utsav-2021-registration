const {pool} = require("../initializers/pgdb");

const queryString = 'select\n' +
  '\tstudent.student_id as "studentId", student.student_name as "studentName", class.class_name as "class", story.story_category_name as "storyCategory", student.email_id as "studentEmail", student.phone_number as "studentPhone", student.registration_date as "registrationDate", payment.order_id_pgw as "transactionId", payment.payment_id_pgw as "paymentId", payment.payment_status as "paymentStatus", school.school_name as "school", city.city_name as "city", teacher.school_coordinator_name as "coordinatorName", teacher.coordinator_email_id as "coordinatorEmail", teacher.coordinator_phone_number as "coordinatorPhone"\n' +
  'from\n' +
  '\tkatha_utsav_dev.students student\n' +
  '\n' +
  'inner join\n' +
  '\tkatha_utsav_dev.classes class\n' +
  'on\n' +
  '\tstudent.class_id=class.class_id\n' +
  '\n' +
  'inner join\n' +
  '\tkatha_utsav_dev.cities city\n' +
  'on\n' +
  '\tstudent.city_id=city.city_id\n' +
  '\n' +
  'inner join\n' +
  '\tkatha_utsav_dev.schools school\n' +
  'on\n' +
  '\tstudent.school_id=school.school_id\n' +
  '\t\n' +
  'inner join\n' +
  '\tkatha_utsav_dev.story_categories story\n' +
  'on\n' +
  '\tstudent.story_category_id=story.story_category_id\n' +
  '\t\n' +
  'left join\n' +
  '\tkatha_utsav_dev.school_coordinators teacher\n' +
  'on\n' +
  '\tstudent.school_coordinator_id=teacher.school_coordinator_id\n' +
  '\n' +
  'left join\n' +
  '\tkatha_utsav_dev.payments payment\n' +
  'on\n' +
  '\tstudent.student_id=payment.student_id';

const FetchAnalysisData = async (req, res, next) => {
  try {
    const sqlResponse = await pool.query(queryString);
    res.locals.analysisData = sqlResponse.rows;
    next();
  } catch (e) {
    console.log(e);
    res.status(500).send('Something went wrong, Try Again!');
  }
};

module.exports = FetchAnalysisData;