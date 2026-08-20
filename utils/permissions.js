// utils/permissions.js
// Centralized permission helpers for the School Portal demo

function isAdmin(user) {
  return user && user.role === 'admin';
}

function teacherOwnsClass(user, classRecord) {
  return user && user.role === 'teacher' && classRecord && String(classRecord.teacherId) === String(user.id);
}

function canViewGrade(user, grade, classRecord) {
  if (!user) return false;
  if (isAdmin(user)) return true;
  if (user.role === 'student') {
    return String(grade.studentId) === String(user.id);
  }
  if (user.role === 'teacher') {
    return teacherOwnsClass(user, classRecord);
  }
  return false;
}

function canEditGrade(user, grade, classRecord) {
  if (!user) return false;
  if (isAdmin(user)) return true;
  if (user.role === 'teacher') return teacherOwnsClass(user, classRecord);
  return false;
}

module.exports = { isAdmin, canViewGrade, canEditGrade };
