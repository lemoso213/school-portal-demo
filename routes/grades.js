// routes/grades.js
const express = require('express');
const router = express.Router();
const { getGradeById, getClassById, saveGrade, listGrades } = require('../data');
const permissions = require('../utils/permissions');

// GET /api/grades - list grades filtered server-side
router.get('/', async (req, res) => {
  const user = req.user;
  const grades = listGrades();
  // Filter server-side
  const filtered = grades.filter((g) => {
    const classRecord = getClassById(g.classId);
    return permissions.canViewGrade(user, g, classRecord);
  });
  res.json(filtered);
});

// PATCH /api/grades/:id - update a grade with audit logging
router.patch('/:id', async (req, res) => {
  const user = req.user;
  const id = req.params.id;
  const { score } = req.body;

  if (typeof score !== 'number' || Number.isNaN(score)) {
    return res.status(400).json({ error: 'score must be a number' });
  }
  if (score < 0 || score > 100) {
    return res.status(400).json({ error: 'score must be between 0 and 100' });
  }

  const grade = getGradeById(id);
  if (!grade) return res.status(404).json({ error: 'Grade not found' });
  const classRecord = getClassById(grade.classId);

  if (!permissions.canEditGrade(user, grade, classRecord)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const before = { ...grade };
  const after = { ...grade, score, updatedBy: user.id, updatedAt: new Date().toISOString() };

  saveGrade(after);

  // Append audit entry (data.appendAudit is called inside saveGrade or here)
  const { appendAudit } = require('../data');
  appendAudit({
    timestamp: new Date().toISOString(),
    actorId: user.id,
    actorName: user.name,
    actorRole: user.role,
    action: 'update:grade',
    targetType: 'grade',
    targetId: grade.id,
    before,
    after,
  });

  res.json(after);
});

module.exports = router;
