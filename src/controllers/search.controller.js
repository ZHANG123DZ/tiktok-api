const searchService = require('@/services/search.service');

const response = require('@/utils/response');
const userService = require('@/services/user.service');

const search = async (req, res) => {
  try {
    const { q } = req.query;
    const userId = req.user?.id;
    if (!q) return res.status(400).json({ message: 'Query is required' });
    const results = await searchService.searchAll(q, userId);
    response.success(res, 200, results);
  } catch (err) {
    console.error(err);
    response.error(res, 500, 'lỗi r');
  }
};

const suggestion = async (req, res) => {
  try {
    const q = req.body.query;
    const userId = req.user?.id;
    if (!q) return res.status(400).json({ message: 'Query is required' });
    // await setup();
    const results = await searchService.suggestion(q, 10);
    response.success(res, 200, results);
  } catch (err) {
    console.error(err);
    response.error(res, 500, 'lỗi r');
  }
};

module.exports = { search, suggestion };
