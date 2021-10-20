const {pool} = require("../initializers/pgdb");
const config = require('../config');

const FetchResultData = async (req, res, next) => {
  const {pgDatabaseSchema} = config;

  const queryString =
    ` select student.student_id as "studentId", student.student_name as "studentName", class.class_name as "class", school.school_name as "school", story.story_category_name as "storyCategory" from` +
    ` ${pgDatabaseSchema}.students student inner join ${pgDatabaseSchema}.classes class on student.class_id=class.class_id` +
    ` inner join ${pgDatabaseSchema}.schools school on student.school_id=school.school_id` +
    ` inner join ${pgDatabaseSchema}.story_categories story on student.story_category_id=story.story_category_id` +
    ` right join ${pgDatabaseSchema}.evaluations evaluation on student.evaluation_id=evaluation.evaluation_id where evaluation.evaluation_status = 'APPROVED'`;

  try {
    const sqlResponse = await pool.query(queryString);
    res.locals.resultData = sqlResponse.rows;
    next();
  } catch (e) {
    console.log(e);
    res.status(500).send('Something went wrong, Try Again!\n' + e);
  }
};

module.exports = FetchResultData;