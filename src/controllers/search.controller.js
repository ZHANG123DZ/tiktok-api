const searchService = require('@/services/search.service');

const response = require('@/utils/response');

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

const getHistory = async (req, res) => {
  try {
    const userId = req.user?.id;
    const searches = await searchService.getHistory(userId);
    response.success(res, 200, searches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// const getOne = async (req, res) => {
//   try {
//     const userId = req.user?.id;
//     const search = await searchService.getOne(req.params.id, userId);
//     if (!search) return res.status(404).json({ message: 'Not found' });
//     res.json(search);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

const create = async (req, res) => {
  try {
    const userId = req.user?.id;
    const newSearch = await searchService.create(userId, req.body);
    res.status(201).json(newSearch);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// const update = async (req, res) => {
//   try {
//     const userId = req.user?.id;
//     const updated = await searchService.update(userId, req.body);
//     if (!updated) return res.status(404).json({ message: 'Not found' });
//     res.json(updated);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

const softDelete = async (req, res) => {
  try {
    const userId = req.user?.id;
    const deleted = await searchService.softDelete(req.params.id, userId);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const clearAll = async (req, res) => {
  const userId = req.user?.id;

  try {
    const affectedRows = await searchService.clearAll(userId);

    return res.status(200).json({
      message: `Đã xóa thành công.`,
      affectedRows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports = {
  search,
  suggestion,
  getHistory,
  create,
  softDelete,
  clearAll,
};
