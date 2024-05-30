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
  console.log(lastStudent);

  // 202403   0001
  return lastStudent?.id ? lastStudent.id.substring(6) : undefined;
};
// generate a user id (semester year + academic code + 4 digit number) expmple -> (2025010000)
export const generateStudentId = async (payload: AcademicSemesterProps) => {
  console.log('Last digit:', await findLastStudentById());
  const currentId = (await findLastStudentById()) || (0).toString();
  const incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  const newUserId = `${payload.year}${payload.code}${incrementId}`;
  console.log('New student id:', newUserId);
  return newUserId;
};
