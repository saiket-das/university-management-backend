import express from 'express';
import { FacultyControllers } from './faculty.controller';
import validateRequest from '../../middlewares/validateRequestion';
import { FacultyValidations } from './faculty.validation';

const router = express.Router();

// Fetch all faculties
router.get('/', FacultyControllers.getAllFaculties);

// Fetch single faculty by Id
router.get('/:facultyId', FacultyControllers.getSingleFacultyById);

// Update single faculty info by Id
router.patch(
  '/:facultyId',
  validateRequest(FacultyValidations.updateFacultyValidationSchema),
  FacultyControllers.updateFacultyById,
);

// Delete single faculty by Id
router.delete('/:facultyId', FacultyControllers.deleteFacultyById);

export const FacultyRoutes = router;
