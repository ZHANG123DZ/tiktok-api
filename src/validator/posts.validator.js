const { checkSchema } = require('express-validator');
const handlerValidationErrors = require('./handleValidationErrors');

exports.createPostValidator = [
  checkSchema({
    author: {
      isString: true,
      notEmpty: true,
      errorMessage: 'Trường này không được để trống',
    },
    title: {
        isString: true,
        notEmpty: true,
        errorMessage: 'Trường này không được để trống',
    },
    content: {
        isString: true,
        notEmpty: true,
        errorMessage: 'Trường này không được để trống',
    },
    image: {
        optional: true,
        errorMessage: 'Trường này không được để trống',
    },
    video: {
        optional: true,
        errorMessage: 'Trường này không được để trống',
    },
  }),
  handlerValidationErrors,
];

exports.updatePostValidator = [
  checkSchema({
    title: {
        optional: true,
        isString: true,
        notEmpty: true,
        errorMessage: 'Trường này không được để trống',
    },
    content: {
        optional: true,
        isString: true,
        notEmpty: true,
        errorMessage: 'Trường này không được để trống',
    },
    image: {
        optional: true,
        errorMessage: 'Trường này không được để trống',
    },
    video: {
        optional: true,
        errorMessage: 'Trường này không được để trống',
    },
  }),
  handlerValidationErrors,
];