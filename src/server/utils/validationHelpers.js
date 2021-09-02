const {Joi} = require('express-validation')

const studentValidationSchema = Joi.object().keys({
  studentName: Joi.string().required(),
  studentEmail: Joi.string().email().required(),
  studentPhone: Joi.number().required(),
  studentClass: Joi.string().required(),
  storyCategory: Joi.string().required(),
  storyPath: Joi.string().required(),
})

const registerValidation = {
  body: Joi.object().keys({
    userName: Joi.string().required(),
    userEmail: Joi.string().email().required(),
    userPhone: Joi.number().required(),
    userSchool: Joi.string().required(),
    userCity: Joi.string().required(),
    studentsList: Joi.array().min(1).max(5).items(studentValidationSchema).required()
  }),
}

const studentSuccessValidationSchema = Joi.object({
  studentId: Joi.number().required(),
  studentName: Joi.string().required(),
  studentEmail: Joi.string().email().required(),
  studentPhone: Joi.number().required(),
  studentClass: Joi.string().required(),
  storyCategory: Joi.string().required(),
  storyPath: Joi.string().required(),
})

const registerSuccessValidation = Joi.object().keys({
    userName: Joi.string().required(),
    userEmail: Joi.string().email().required(),
    userPhone: Joi.number().required(),
    userSchool: Joi.string().required(),
    userCity: Joi.string().required(),
    studentsList: Joi.array().min(1).max(5).items(studentSuccessValidationSchema).required()
});

const successValidation = {
  body: Joi.object().keys({
    key: Joi.string().required(),
    id: Joi.string().required(),
    paymentDbId: Joi.number().required(),
    amount: Joi.number().required(),
    currency: Joi.string().required(),
    status: Joi.string().required(),
    receipt: Joi.string().required(),
    paymentId: Joi.string().required(),
    signature: Joi.string().required(),
    formData: registerSuccessValidation
  }),
}

const failureValidation = {
  body: Joi.object().keys({
    key: Joi.string().required(),
    id: Joi.string().required(),
    paymentDbId: Joi.number().required(),
    amount: Joi.number().required(),
    currency: Joi.string().required(),
    status: Joi.string().required(),
    receipt: Joi.string().required(),
    formData: registerSuccessValidation
  }),
}

const contactValidation = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    phone: Joi.string().required().length(10),
    email: Joi.string().email().required(),
    message: Joi.string().required(),
  }),
}

exports.contactValidation = contactValidation;
exports.successValidation = successValidation;
exports.failureValidation = failureValidation;
exports.registerValidation = registerValidation;