'use strict';

const successResponse = (res, code = 200, data = null, message = 'success') => {
  const response = { success: true };
  
  if (message) response.message = message;
  if (data !== null) response.data = data;
  
  return res.status(code).json(response);
};

const errorResponse = (res, code = 500, message = 'Internal Server Error') => {
  return res.status(code).json({
    success: false,
    message
  });
};

module.exports = {
  successResponse,
  errorResponse
};