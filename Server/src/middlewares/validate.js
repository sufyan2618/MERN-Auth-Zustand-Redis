
export const validate = (schema) => {
  return (req, res, next) => {
    // Validate request body
    const { error } = schema.validate(req.body, {
      abortEarly: false, // Return all errors
      stripUnknown: true, // Remove unknown fields
      allowUnknown: true // Allow unknown fields in the request
    });

    if (error) {
      // Format validation errors
      const errors = error.details.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));

      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors
      });
    }

    // If validation passes, proceed to next middleware
    next();
  };
}; 