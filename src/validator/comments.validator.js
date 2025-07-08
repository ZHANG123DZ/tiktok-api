const { checkSchema } = require('express-validator');
const handlerValidationErrors = require('./handleValidationErrors');

exports.createCommentValidator = [
  checkSchema({
    user_id: {
      optional: true, //Đang để có user hay ko cũng dc vì chưa làm liên quan đến tài khoản
      notEmpty: true,
      errorMessage: 'Trường này không được để trống',
    },
    content: {
        isString: true,
        notEmpty: true,
        errorMessage: 'Trường này không được để trống',
    },
    post_id: {
        notEmpty: true,
        errorMessage: 'Trường này không được để trống',
    },
    replyUserId: {
        optional: true, 
        notEmpty: true,
        errorMessage: 'Trường này không được để trống',
    },
  }),
  handlerValidationErrors,
];

exports.updateCommentValidator = [
  checkSchema({
    content: {
        optional: true,
        isString: true,
        notEmpty: true,
        errorMessage: 'Trường này không được để trống',
    },
  }),
  handlerValidationErrors,
];