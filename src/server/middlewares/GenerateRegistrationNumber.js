var {pool} = require('../initializers/pgdb');

function GenerateRegistrationNumber( request, response, next) {
  const { studentsList, userEmail, userName, userSchool, userPhone, userCity } = request.body.formData;

  async function registerCity() {
    const values = [userCity];
    var cityId = await pool.query(`SELECT city_id from cities WHERE EXISTS (SELECT city_id from schools WHERE city_name = $1 )`,values);

    if(cityId.rows.length < 1) {
      const text = `INSERT INTO cities (city_name) values ($1) RETURNING city_id`;
      cityId = await pool.query(text,values);
    }
    return cityId.rows[0]["city_id"];
  }

  async function registerSchool(cityResult) { 
    let values = [userSchool];
    let schoolId = await pool.query(`SELECT school_id from schools WHERE (EXISTS (SELECT school_id from schools WHERE school_name = $1 ) and school_name = $1)`,values);
    let schoolCoordinatorId = {};
    if(schoolId.rows.length < 1) {
      const text = `
        INSERT INTO schools (school_name, city_id)
        VALUES ($1, $2)
        RETURNING school_id
        `;
      const values = [userSchool, cityResult];
      schoolId = await pool.query(text, values);

      if(studentsList.length > 1) {
        const text = `
          INSERT INTO school_coordinators (school_id, school_coordinator_name, coordinator_phone_number, coordinator_email_id)
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
      const text = `SELECT school_coordinator_id from school_coordinators
        WHERE school_id = $1`;
      const values = [schoolId.rows[0]["school_id"]];
      schoolCoordinatorId = await pool.query(text,values);
    }
   return ({
     schoolId: schoolId.rows[0]["school_id"],
     schoolCoordinatorId: schoolCoordinatorId.length > 0 ? schoolCoordinatorId.rows[0]["school_coordinator_id"] : undefined
   });
  }

  async function registerClasses() {
    var classIdList = [];
    classIdList = await Promise.all(studentsList.map(async (studentObject) => {
      const text = `
        SELECT class_id FROM classes 
        WHERE class_name = $1
        `;
      const values = [studentObject.studentClass];
      let classId = await pool.query(text, values);
      return classId.rows[0]["class_id"];
    }));

    return classIdList;
  }

  async function registerStoryCategory() {
    let storyCategoryIdList = [];

    storyCategoryIdList = await Promise.all(studentsList.map(async (studentObject) => {
      const text = `
      SELECT story_category_id FROM story_categories 
      WHERE story_category_name = $1
      `;
      const values = [studentObject.storyCategory];
      const storyCategoryId = await pool.query(text, values);
      return storyCategoryId.rows[0]["story_category_id"];
    }));
    
    return storyCategoryIdList;
  }

  async function registerStudent(schoolResult, classId, cityId, storyCategoryId) {
    let studentIdList = [];

    studentIdList = await Promise.all(studentsList.map(async (studentObject, index) => {
      const {studentName, studentEmail, studentPhone} = studentObject;
      const text = `
      INSERT INTO students (student_name, email_id, phone_number, school_id, city, class_id, story_category_id, school_coordinator_id, upload_file_id, registration_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING student_id, student_name;
      `;
      const values = [studentName, studentEmail, studentPhone, schoolResult.schoolId, cityId, classId[index], storyCategoryId[index] , schoolResult.schoolCoordinatorId , 1, new Date(Date.now())];
      const studentId = await pool.query(text, values);
      return studentId;
    }));

    return studentIdList;
  }
 
  (async () => {
    const cityResult = await registerCity();
    const schoolResult = await registerSchool(cityResult);
    const classResult = await registerClasses();
    const storyCategoryResult = await registerStoryCategory();
    const studentResult = await registerStudent(schoolResult, classResult, cityResult, storyCategoryResult);
    console.log(studentResult[0].rows);
    next();
  })();

}

module.exports = GenerateRegistrationNumber;

/*res.locals.regIds = [1243823, 1423442, 8768768, 8768789];
  res.locals.paymentId = 2398474;
  next();*/