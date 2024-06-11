import express from 'express';

import validateRequest from '../../middlewares/validateRequestion';
import { AdminValidations } from './admin.validation';
import { AdminControllers } from './admin.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

// Fetch all admins
router.get('/', auth(), AdminControllers.getAllAdmins);

// Fetch single admin by Id
router.get('/:adminId', AdminControllers.getSingleAdminById);

// Update single admin info by Id
router.patch(
  '/:adminId',
  validateRequest(AdminValidations.updateAdminValidationSchema),
  AdminControllers.updateAdminById,
);

// Delete single admin by Id
router.delete('/:adminId', AdminControllers.deleteAdminById);

export const AdminRoutes = router;
