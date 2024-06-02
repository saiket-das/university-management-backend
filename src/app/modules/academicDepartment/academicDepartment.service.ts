import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { AcademicFacultyModel } from '../academicFaculty/academicFaculty.model';
import { AcademicDepartmentProps } from './academicDepartment.interface';
import { AcademicDepartmentModel } from './academicDepartment.model';

// create a academic department
const createAcademicDepartmentService = async (
  payload: AcademicDepartmentProps,
) => {
  const result = await AcademicDepartmentModel.create(payload);
  return result;
};

// fetch all academic departments
const getAllAcademicDepartmentsService = async () => {
  const result =
    await AcademicDepartmentModel.find().populate('academicFaculty');
  return result;
};

// fetch single academic department by Id
const getSingleAcademicDepartmentByIdService = async (departmentId: string) => {
  const result = await AcademicDepartmentModel.findById(departmentId);
  return result;
};

// update single academic department's info by Id
const updateAcademicDepartmentByIdService = async (
  departmentId: string,
  payload: Partial<AcademicDepartmentProps>,
) => {
  const result = await AcademicDepartmentModel.findOneAndUpdate(
    { _id: departmentId },
    payload,
    {
      new: true,
    },
  );
  return result;
};

export const AcademicDepartmentServices = {
  createAcademicDepartmentService,
  getAllAcademicDepartmentsService,
  getSingleAcademicDepartmentByIdService,
  updateAcademicDepartmentByIdService,
};
