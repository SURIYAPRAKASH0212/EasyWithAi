const express = require('express');
const router = express.Router();
const db = require('../database');
const auth = require('../middleware/auth');

// GET /api/history - Paginated history entries
router.get('/', auth, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;
  const filterModule = req.query.module || null;

  try {
    let countSql = 'SELECT COUNT(*) as total FROM history WHERE user_id = ?';
    let querySql = 'SELECT id, module, input, output, created_at FROM history WHERE user_id = ?';
    let countParams = [req.user.id];
    let queryParams = [req.user.id];

    if (filterModule) {
      countSql += ' AND module = ?';
      querySql += ' AND module = ?';
      countParams.push(filterModule);
      queryParams.push(filterModule);
    }

    querySql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);

    // Get total count
    const totalRow = await db.get(countSql, countParams);
    const total = totalRow ? totalRow.total : 0;

    // Get paginated history
    const history = await db.query(querySql, queryParams);

    res.json({
      history,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching history logs.' });
  }
});

// GET /api/history/stats - Dashboard statistics and recent activity
router.get('/stats', auth, async (req, res) => {
  try {
    // Get counts per module
    const translatorCount = await db.get("SELECT COUNT(*) as count FROM history WHERE user_id = ? AND module = 'Translator'", [req.user.id]);
    const emailCount = await db.get("SELECT COUNT(*) as count FROM history WHERE user_id = ? AND module = 'Email Generator'", [req.user.id]);
    const entityCount = await db.get("SELECT COUNT(*) as count FROM history WHERE user_id = ? AND module = 'Entity Recognition'", [req.user.id]);
    const totalCount = await db.get("SELECT COUNT(*) as count FROM history WHERE user_id = ?", [req.user.id]);

    // Get recent activity (last 5)
    const recent = await db.query(
      'SELECT id, module, input, output, created_at FROM history WHERE user_id = ? ORDER BY created_at DESC LIMIT 5',
      [req.user.id]
    );

    res.json({
      stats: {
        translations: translatorCount ? translatorCount.count : 0,
        emails: emailCount ? emailCount.count : 0,
        entities: entityCount ? entityCount.count : 0,
        total: totalCount ? totalCount.count : 0
      },
      recent
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching dashboard stats.' });
  }
});

// DELETE /api/history - Batch delete history entries
router.delete('/', auth, async (req, res) => {
  const { ids, all } = req.body;

  try {
    if (all) {
      await db.run('DELETE FROM history WHERE user_id = ?', [req.user.id]);
      return res.json({ message: 'All history records deleted successfully.' });
    }

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No entry IDs provided for deletion.' });
    }

    const placeholders = ids.map(() => '?').join(',');
    const sql = `DELETE FROM history WHERE user_id = ? AND id IN (${placeholders})`;
    await db.run(sql, [req.user.id, ...ids]);

    res.json({ message: 'Selected history records deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting history entries.' });
  }
});

module.exports = router;
