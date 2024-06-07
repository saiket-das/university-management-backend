import { AcademicSemesterProps } from '../academicSemester/academicSemester.interface';
import { UserModel } from './user.model';

// generate a user id (semester year + academic code + 4 digit number) expmple -> (2025010000)
const findLastStudentById = async () => {
  const lastStudent = await UserModel.findOne(
    {
      role: 'student',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  // 202403   0001
  return lastStudent?.id ? lastStudent.id : undefined;
};

export const generateStudentId = async (payload: AcademicSemesterProps) => {
  const lastStudentId = await findLastStudentById();

  let currentId = (0).toString();
  if (lastStudentId) {
    const lastStudentSemesterYear = lastStudentId.substring(0, 4); // 2024
    const lastStudentSemesterCode = lastStudentId.substring(4, 6); // 02
    if (
      lastStudentId &&
      payload.year === lastStudentSemesterYear &&
      payload.code === lastStudentSemesterCode
    ) {
      currentId = lastStudentId.substring(6);
    }
  }

  const incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  const newUserId = `${payload.year}${payload.code}${incrementId}`;
  return newUserId;
};

// generate a user id (F- + 4 digit number) expmple -> (F-0001)
const findLastFacultyId = async () => {
  const lastStudent = await UserModel.findOne(
    {
      role: 'faculty',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  // F-0001
  return lastStudent?.id ? lastStudent.id : undefined;
};

export const generateFacultyId = async () => {
  let currentId = (0).toString();

  const lastFacultyId = await findLastFacultyId();
  if (lastFacultyId) {
    currentId = lastFacultyId.substring(2, 6); // 2024
  }

  const incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  const newUserId = `F-${incrementId}`;
  return newUserId;
};

// generate a user id (A- + 4 digit number) expmple -> (A-0001)
const findLastAdminId = async () => {
  const lastStudent = await UserModel.findOne(
    {
      role: 'admin',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  // F-0001
  return lastStudent?.id ? lastStudent.id : undefined;
};
export const generateAdminId = async () => {
  let currentId = (0).toString();

  // F-0001 || undefine
  const lastAdminId = await findLastAdminId();
  if (lastAdminId) {
    currentId = lastAdminId.substring(2, 6); // 2024
  }

  const incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  const newUserId = `A-${incrementId}`;
  return newUserId;
};
