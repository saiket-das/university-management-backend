import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequestion';
import { AcademicFacultyValidations } from './academicFaculty.validation';
import { AcademicFacultyControllers } from './academicFaculty.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

// Create a academic faculty
router.post(
  '/create-academic-faculty',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
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
