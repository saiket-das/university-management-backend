import { AcademicSemesterProps } from '../academicSemester/academicSemester.interface';
import { UserModel } from './user.model';

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

// generate a user id (semester year + academic code + 4 digit number) expmple -> (2025010000)
export const generateUserId = async (payload: AcademicSemesterProps) => {
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
