import { Router } from 'express';
import { AcademicSemesterControllers } from './academicSemester.controller';
import validateRequest from '../../middlewares/validateRequestion';
import { AcademicSemesterValidations } from './academicSemester.validation';

const router = Router();

router.post(
  '/create-academic-semester',
  validateRequest(AcademicSemesterValidations.academicSemesterValidationSchema),
  AcademicSemesterControllers.createAcademicSemester,
);

router.get('/', AcademicSemesterControllers.fetchAllAcademicSemester);
router.get(
  '/:semesterId',
  AcademicSemesterControllers.fetchSingleAcademicSemesterById,
);

router.patch(
  '/:semesterId',
  validateRequest(
    AcademicSemesterValidations.updateAcademicSemesterValidationSchema,
  ),
  AcademicSemesterControllers.updateAcademicSemesterById,
);

export const AcademicSemesterRoutes = router;
