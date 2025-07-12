function success(res, status, data, message) {
  res.status(status).json({
    success: true,
    data,
    message,
  });
}

function error(res, status, message, errors) {
  res.status(Number.isInteger(status) ? status : 500).json({
    success: false,
    message,
    errors,
  });
}

function paginate(res, items, total, page, limit) {
  const totalPages = Math.ceil(total / limit);

  res.json({
    data: items,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  });
}

module.exports = { success, error, paginate };
