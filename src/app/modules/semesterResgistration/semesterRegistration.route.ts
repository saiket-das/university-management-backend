import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequestion';
import { SemesterRegistrationValidations } from './semesterRegistration.validation';
import { SemesterRegistrationControllers } from './semesterRegistration.controller';

const router = Router();

// Create a new semester resgistration
router.post(
  '/',
  validateRequest(
    SemesterRegistrationValidations.createSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationControllers.createSemesterRegistration,
);

// Get all semester registrations
router.get('/', SemesterRegistrationControllers.getAllSemesterRegistrations);

// Get a semester registration by Id
router.get(
  '/:id',
  SemesterRegistrationControllers.getSingleSemesterRegistration,
);

// Update a semester registration info by Id
router.patch(
  '/:id',
  validateRequest(
    SemesterRegistrationValidations.updateSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationControllers.updateSemesterRegistration,
);

export const SemesterRegistrationRoutes = router;
