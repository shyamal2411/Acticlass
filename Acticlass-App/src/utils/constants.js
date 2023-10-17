export const ROLES = {
  STUDENT: 'Student',
  TEACHER: 'Teacher',
};
export const isStudentOrTeacher = role =>
  role === ROLES.STUDENT || role === ROLES.TEACHER;
