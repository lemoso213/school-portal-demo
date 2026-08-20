// data/index.js
// In-memory demo data + helpers

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Sample users with runtime-generated password hashes (passwords documented below)
const users = [
  { id: 'u-admin', name: 'Ava Admin', email: 'admin@school.test', passwordHash: bcrypt.hashSync('adminpass', 10), role: 'admin' },
  { id: 'u-teacher-1', name: 'Tina Teacher', email: 'tina@school.test', passwordHash: bcrypt.hashSync('teachpass', 10), role: 'teacher' },
  { id: 'u-teacher-2', name: 'Tom Teacher', email: 'tom@school.test', passwordHash: bcrypt.hashSync('teach2', 10), role: 'teacher' },
  { id: 'u-student-1', name: 'Sally Student', email: 'sally@school.test', passwordHash: bcrypt.hashSync('student', 10), role: 'student' },
  { id: 'u-student-2', name: 'Sam Student', email: 'sam@school.test', passwordHash: bcrypt.hashSync('student', 10), role: 'student' },
];

const classes = [
  { id: 'c-1', name: 'Algebra I', teacherId: 'u-teacher-1', studentIds: ['u-student-1', 'u-student-2'] },
  { id: 'c-2', name: 'History', teacherId: 'u-teacher-2', studentIds: ['u-student-2'] },
];

const grades = [
  { id: 'g-1', studentId: 'u-student-1', classId: 'c-1', assignment: 'Homework 1', score: 88, updatedBy: 'u-teacher-1', updatedAt: new Date().toISOString() },
  { id: 'g-2', studentId: 'u-student-2', classId: 'c-1', assignment: 'Homework 1', score: 92, updatedBy: 'u-teacher-1', updatedAt: new Date().toISOString() },
  { id: 'g-3', studentId: 'u-student-2', classId: 'c-2', assignment: 'Essay 1', score: 75, updatedBy: 'u-teacher-2', updatedAt: new Date().toISOString() },
];

const auditEntries = [];

function getUserById(id) {
  return users.find((u) => String(u.id) === String(id)) || null;
}

function getUserByEmail(email) {
  return users.find((u) => u.email === email) || null;
}

function getClassById(id) {
  return classes.find((c) => String(c.id) === String(id)) || null;
}

function getGradeById(id) {
  return grades.find((g) => String(g.id) === String(id)) || null;
}

function saveGrade(grade) {
  const idx = grades.findIndex((g) => String(g.id) === String(grade.id));
  if (idx === -1) {
    grades.push(grade);
  } else {
    grades[idx] = grade;
  }
}

function appendAudit(entry) {
  auditEntries.unshift({ id: uuidv4(), ...entry }); // newest-first
}

function listGrades() {
  return grades.slice();
}

function listAuditEntries() {
  return auditEntries.slice();
}

module.exports = {
  users,
  classes,
  grades,
  auditEntries,
  getUserById,
  getUserByEmail,
  getClassById,
  getGradeById,
  saveGrade,
  appendAudit,
  listGrades,
  listAuditEntries,
};
