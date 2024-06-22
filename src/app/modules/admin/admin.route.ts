import express from 'express';

import validateRequest from '../../middlewares/validateRequestion';
import { AdminValidations } from './admin.validation';
import { AdminControllers } from './admin.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

// Fetch all admins
router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  AdminControllers.getAllAdmins,
);

// Fetch single admin by Id
router.get(
  '/:adminId',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  AdminControllers.getSingleAdminById,
);

// Update single admin info by Id
router.patch(
  '/:adminId',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(AdminValidations.updateAdminValidationSchema),
  AdminControllers.updateAdminById,
);

// Delete single admin by Id
router.delete(
  '/:adminId',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  AdminControllers.deleteAdminById,
);

export const AdminRoutes = router;
