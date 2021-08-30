function ConstructOrderResponse(req, res, next) {

  const { userName, userEmail, userPhone, userSchool, userCity, studentsList} = req.body;
  const { id, amount, currency, status, receipt } = res.locals.orderResponse;
  const registrationIds = res.locals.regIds;

  if(studentsList.length !== registrationIds.length || !res.locals.paymentId) {
    res.status(500).json({
      status: 'failed',
      message: 'Something went wrong'
    });
  }

  const studentsData = studentsList.map((studentData, index) => {
    return {
      studentId: registrationIds[index],
      ...studentData
    }
  });

  res.locals.orderResponse = {
    key: process.env.RAZORPAY_KEY_ID,
    id,
    amount,
    currency,
    status,
    receipt,
    paymentDbId: res.locals.paymentId,
    formData: {
      userName: userName,
      userEmail: userEmail,
      userPhone: userPhone,
      userSchool: userSchool,
      userCity: userCity,
      studentsList: studentsData
    }
  }
  next();
}

module.exports = ConstructOrderResponse