import Joi from 'joi';

// create a schema validation using joi
const usernameValidationSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .required()
    .pattern(/^[A-Za-z]+$/)
    .messages({
      'string.base': 'First name must be a string',
      'string.empty': 'First name is required',
      'string.pattern.base':
        'First name can only contain alphabetic characters',
    }),
  lastName: Joi.string()
    .required()
    .pattern(/^[A-Za-z]+$/)
    .messages({
      'string.base': 'Last name must be a string',
      'string.empty': 'Last name is required',
      'string.pattern.base': 'Last name can only contain alphabetic characters',
    }),
});

const studentValidationSchemaJoi = Joi.object({
  name: usernameValidationSchema.required().messages({
    'any.required': 'Name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.email': 'Email must be a valid email',
    'any.required': 'Email is required',
  }),
  gender: Joi.string()
    .valid('male', 'female', 'others')
    .required()
    .max(20)
    .messages({
      'any.only': '{#value} is not valid',
      'string.max': "Gender can't be more than 20 characters",
      'any.required': 'Gender is required',
    }),
  dateOfBirth: Joi.date().iso().messages({
    'date.base': 'Date of Birth must be a valid ISO date',
  }),
  contactNumber: Joi.string()
    .pattern(/^[+0-9]+$/)
    .messages({
      'string.pattern.base':
        'Contact number can only contain numeric characters',
    }),
  bloodGroup: Joi.string()
    .valid('A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-')
    .required()
    .messages({
      'any.only': '{#value} is not valid blood group',
      'any.required': 'Blood group is required',
    }),
  address: Joi.string().messages({
    'string.base': 'Address must be a string',
  }),
  isActive: Joi.string()
    .valid('active', 'inactive')
    .default('active')
    .messages({
      'any.only': '{#value} is not valid status',
    }),
  avatar: Joi.string()
    .uri()
    .messages({
      'string.uri': 'Avatar must be a valid URI',
    })
    .optional(),
});

export default studentValidationSchemaJoi;
