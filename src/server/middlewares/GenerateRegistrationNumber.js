var {pool} = require('../initializers/pgdb');
const config = require('../config');

function GenerateRegistrationNumber( request, response, next) {
  const { studentsList, userEmail, userName, userSchool, userPhone, userCity} = request.body;
  const { paymentId, id } = response.locals.orderResponse;

  async function registerCity() {
    try {
      const values = [userCity];
      var cityId = await pool.query(`SELECT city_id from ${config.pgDatabaseSchema}.cities WHERE (EXISTS (SELECT city_id from ${config.pgDatabaseSchema}.cities WHERE city_name = $1 ) and city_name = $1)`,values);

      if(cityId.rows.length < 1) {
        const text = `INSERT INTO ${config.pgDatabaseSchema}.cities (city_name) values ($1) RETURNING city_id`;
        cityId = await pool.query(text,values);
      }
      return cityId.rows[0]["city_id"];
    }
    catch(err) {
      console.log(err);
      response.status(500).json({
        status: 'City db storage failed',
        message: err.message
      });
    }
  }

  async function registerSchool(cityResult) {
    try { 
      let values = [userSchool];
      let schoolId = await pool.query(`SELECT school_id from ${config.pgDatabaseSchema}.schools WHERE (EXISTS (SELECT school_id from ${config.pgDatabaseSchema}.schools WHERE school_name = $1 ) and school_name = $1)`,values);
      let schoolCoordinatorId = {};
      if(schoolId.rows.length < 1) {
        const text = `
          INSERT INTO ${config.pgDatabaseSchema}.schools (school_name, city_id)
          VALUES ($1, $2)
          RETURNING school_id
          `;
        const values = [userSchool, cityResult];
        schoolId = await pool.query(text, values);

        if(studentsList.length > 1) {
          const text = `
            INSERT INTO ${config.pgDatabaseSchema}.school_coordinators (school_id, school_coordinator_name, coordinator_phone_number, coordinator_email_id)
            VALUES ($1, $2, $3, $4)
            RETURNING school_coordinator_id
            `;
          const values = [schoolId.rows[0]["school_id"], userName, userPhone, userEmail];
          schoolCoordinatorId = await pool.query(text, values);
          return ({
            schoolId: schoolId.rows[0]["school_id"],
            schoolCoordinatorId: schoolCoordinatorId.rows[0]["school_coordinator_id"]
          });
        } 
      } else {
        const text = `SELECT school_coordinator_id from ${config.pgDatabaseSchema}.school_coordinators
          WHERE school_id = $1`;
        const values = [schoolId.rows[0]["school_id"]];
        schoolCoordinatorId = await pool.query(text,values);
      }
      return ({
        schoolId: schoolId.rows[0]["school_id"],
        schoolCoordinatorId: ((Object.keys(schoolCoordinatorId).length > 0) && (schoolCoordinatorId.rows.length > 0)) ? schoolCoordinatorId.rows[0]["school_coordinator_id"] : undefined
      });
    }
    catch (err) {
      console.log(err);
      response.status(500).json({
        status: 'School or school coordinator db storage failed',
        message: err.message
      });
    }
  }

  async function registerClasses() {
    try {
      var classIdList = [];
      classIdList = await Promise.all(studentsList.map(async (studentObject) => {
        const text = `
          SELECT class_id FROM ${config.pgDatabaseSchema}.classes
          WHERE class_name = $1
          `;
        const values = [studentObject.studentClass];
        let classId = await pool.query(text, values);
        return classId.rows[0]["class_id"];
      }));

      return classIdList;
    }
    catch (err) {
      console.log(err);
      response.status(500).json({
        status: 'Class db storage failed',
        message: err.message
      });
    }
  }

  async function registerStoryCategory() {
    try {
      let storyCategoryIdList = [];

      storyCategoryIdList = await Promise.all(studentsList.map(async (studentObject) => {
        const text = `
        SELECT story_category_id FROM ${config.pgDatabaseSchema}.story_categories 
        WHERE story_category_name = $1
        `;
        const values = [studentObject.storyCategory];
        const storyCategoryId = await pool.query(text, values);
        return storyCategoryId.rows[0]["story_category_id"];
      }));
      
      return storyCategoryIdList;
    }
    catch(err) {
      console.log(err);
      response.status(500).json({
        status: 'Story category db storage failed',
        message: err.message
      });
    }
  }

  async function registerStudent(schoolResult, classId, cityId, storyCategoryId) {
    try { 
      let studentIdList = [];

      studentIdList = await Promise.all(studentsList.map(async (studentObject, index) => {
        const {studentName, studentEmail, studentPhone, storyPath} = studentObject;
        const text = `
        INSERT INTO ${config.pgDatabaseSchema}.students (student_name, email_id, phone_number, school_id, city_id, class_id, story_category_id, school_coordinator_id, file_location_url, registration_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING student_id, student_name;
        `;
        const values = [studentName, studentEmail, studentPhone, schoolResult.schoolId, cityId, classId[index], storyCategoryId[index] , schoolResult.schoolCoordinatorId , storyPath, new Date(Date.now())];
        const studentId = await pool.query(text, values);
        return studentId.rows[0]["student_id"];
      }));

      return studentIdList;
    }
    catch(err) {
      console.log(err);
        response.status(500).json({
          status: 'Student db storage failed',
          message: err.message
        });
    }
  }

  async function registerPayment(studentResult) {
    try {
      let paymentIdList = [];

      paymentIdList = await Promise.all(studentResult.map(async studentData => {
        const text = `
          INSERT INTO ${config.pgDatabaseSchema}.payments (payment_id_pgw, order_id_pgw, student_id, payment_status)
          VALUES ($1, $2, $3, $4)
          RETURNING payment_id;
          `;
        const values = [paymentId, id, studentData, 'PENDING'];
        const paymentIdResult = await pool.query(text,values);
        return paymentIdResult.rows[0]["payment_id"];
      }));

      return paymentIdList;
    }
    catch(err) {
      console.log(err);
      response.status(500).json({
        status: 'Payment db storage failed',
        message: err.message
      });
    }
  }
 
  (async () => {
    const cityResult = await registerCity();
    const schoolResult = await registerSchool(cityResult);
    const classResult = await registerClasses();
    const storyCategoryResult = await registerStoryCategory();
    const studentResult = await registerStudent(schoolResult, classResult, cityResult, storyCategoryResult);
    const paymentResult = await registerPayment(studentResult);

    response.locals.regIds = studentResult;
    response.locals.paymentId = paymentResult;

    next();
  })();

}

module.exports = GenerateRegistrationNumber;
