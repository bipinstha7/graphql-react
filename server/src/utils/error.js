module.exports = function customError(err, code) {
  const error = new Error(err);
  error.code = code || 500;

  return error;
};
