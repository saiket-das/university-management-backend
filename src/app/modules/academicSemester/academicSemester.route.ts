import { Router } from 'express';
import { AcademicSemesterControllers } from './academicSemester.controller';
import validateRequest from '../../middlewares/validateRequestion';
import { AcademicSemesterValidations } from './academicSemester.validation';
import { USER_ROLE } from '../user/user.constant';
import auth from '../../middlewares/auth';

const router = Router();

// Create a academic semester
router.post(
  '/create-academic-semester',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(
    AcademicSemesterValidations.creatAcademicSemesterValidationSchema,
  ),
  AcademicSemesterControllers.createAcademicSemester,
);

// Fetch all academic semesters
router.get('/', AcademicSemesterControllers.fetchAllAcademicSemester);

// Fetch single academic semester by Id
router.get(
  '/:semesterId',
  AcademicSemesterControllers.fetchSingleAcademicSemesterById,
);

// Update single academic semester's info by Id
router.patch(
  '/:semesterId',
  validateRequest(
    AcademicSemesterValidations.updateAcademicSemesterValidationSchema,
  ),
  AcademicSemesterControllers.updateAcademicSemesterById,
);

export const AcademicSemesterRoutes = router;
