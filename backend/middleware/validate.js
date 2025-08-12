const Joi = require("joi");
const { AppError } = require("./errorHandler");

// Enhanced validation middleware
const validate = (schema, property = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[property], {
    abortEarly: false,
    stripUnknown: true
  });
  
  if (error) {
    const errorMessage = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return next(new AppError(`Validation Error: ${JSON.stringify(errorMessage)}`, 400));
  }
  
  // Replace request data with validated data
  req[property] = value;
  next();
};

// Common validation schemas
const schemas = {
  regionId: Joi.object({
    id: Joi.number().integer().positive().required()
  }),
  
  language: Joi.object({
    lang: Joi.string().valid('ge', 'en').default('ge')
  }),
  
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10)
  })
};

// Validate specific parameters
const validateRegionId = validate(schemas.regionId, 'params');
const validateLanguage = validate(schemas.language, 'query');
const validatePagination = validate(schemas.pagination, 'query');

module.exports = {
  validate,
  schemas,
  validateRegionId,
  validateLanguage,
  validatePagination
};
