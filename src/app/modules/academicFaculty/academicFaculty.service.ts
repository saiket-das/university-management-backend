import { AcademicFacultyProps } from './academicFaculty.interface';
import { AcademicFacultyModel } from './academicFaculty.model';

// Create a academic faculty
const createAcademicFacultyService = async (payload: AcademicFacultyProps) => {
  const result = await AcademicFacultyModel.create(payload);
  return result;
};

// Fetch all academic faculties
const getAllAcademicFacultiesService = async () => {
  const result = await AcademicFacultyModel.find();
  return result;
};

// Fetch single academic faculty by Id
const getSingleAcademicFacultyByIdService = async (facultyId: string) => {
  const result = await AcademicFacultyModel.findById(facultyId);
  return result;
};

// Update single academic faculty's info by Id
const updateAcademicFacultyByIdService = async (
  facultyId: string,
  payload: Partial<AcademicFacultyProps>,
) => {
  const result = await AcademicFacultyModel.findOneAndUpdate(
    { _id: facultyId },
    payload,
    {
      new: true,
    },
  );
  return result;
};

export const AcademicFacultyServices = {
  createAcademicFacultyService,
  getAllAcademicFacultiesService,
  getSingleAcademicFacultyByIdService,
  updateAcademicFacultyByIdService,
};
