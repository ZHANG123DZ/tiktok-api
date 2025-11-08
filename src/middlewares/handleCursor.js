const response = require('@/utils/response');
const paginationConfig = require('@/configs/pagination');

function handleCursor(req, res, next) {
  const { default_cursor, default_limit, max_limit } = paginationConfig;

  const page = +req.query.page || default_page;
  let limit = +req.query.limit || default_limit;
  let maxLimit = max_limit;

  if (limit > maxLimit) limit = maxLimit;

  req.page = page;
  req.limit = limit;

  res.paginate = ({ items, total }) => {
    response.paginate(res, items, total, page, limit);
  };

  next();
}

module.exports = handleCursor;
