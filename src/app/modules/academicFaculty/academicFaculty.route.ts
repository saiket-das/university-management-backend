import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequestion';
import { AcademicFacultyValidations } from './academicFaculty.validation';
import { AcademicFacultyControllers } from './academicFaculty.controller';

const router = Router();

// Create a academic faculty
router.post(
  '/create-academic-faculty',
  validateRequest(
    AcademicFacultyValidations.createAcademicFacultyValidationSchema,
  ),
  AcademicFacultyControllers.createAcademicFaculty,
);

// Fetch all academic faculties
router.get('/', AcademicFacultyControllers.getAllAcademicFaculties);

// Fetch single academic faculty by Id
router.get(
  '/:facultyId',
  AcademicFacultyControllers.getSingleAcademicFacultyById,
);

// Update single academic faculty's info by Id
router.patch(
  '/:facultyId',
  validateRequest(
    AcademicFacultyValidations.updateAcademicFacultyValidationSchema,
  ),
  AcademicFacultyControllers.updateAcademicFacultyById,
);

export const AcademicFacultyRoutes = router;
