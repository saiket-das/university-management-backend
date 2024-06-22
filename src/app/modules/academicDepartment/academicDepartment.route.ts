import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequestion';
import { AcademicDepartmentValidations } from './academicDepartment.validation';
import { AcademicDepartmentControllers } from './academicDepartment.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

// Create a academic department
router.post(
  '/create-academic-department',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(
    AcademicDepartmentValidations.createAcademicDepartmentValidationSchema,
  ),
  AcademicDepartmentControllers.createAcademicDepartment,
);

// Fetch all academic department
router.get('/', AcademicDepartmentControllers.getAllAcademicDepartments);

// Fetch single academic department by Id
router.get(
  '/:departmentId',
  AcademicDepartmentControllers.getSingleAcademicDepartmentById,
);

// Update single academic department's info by Id
router.patch(
  '/:departmentId',
  validateRequest(
    AcademicDepartmentValidations.updateAcademicDepartmentValidationSchema,
  ),
  AcademicDepartmentControllers.updateAcademicDepartmentById,
);

export const AcademicDepartmentRoutes = router;
