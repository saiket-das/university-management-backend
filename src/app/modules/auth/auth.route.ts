import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequestion';
import { AuthValidations } from './auth.validation';
import { AuthControllers } from './auth.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

// User login
router.post(
  '/login',
  validateRequest(AuthValidations.loginUserValidationSchema),
  AuthControllers.loginUser,
);

// Change password
router.patch(
  '/change-password',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.student,
    USER_ROLE.faculty,
    USER_ROLE.admin,
  ),
  validateRequest(AuthValidations.changePasswordValidationSchema),
  AuthControllers.changePassword,
);

// Refresh token
router.post(
  '/refresh-token',
  // validateRequest(AuthValidations.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
);

// Forget password
router.post(
  '/forget-password',
  validateRequest(AuthValidations.forgetPasswordValidationSchema),
  AuthControllers.forgetPassword,
);

// Reset password
router.post(
  '/reset-password',
  validateRequest(AuthValidations.resetPasswordValidationSchema),
  AuthControllers.resetPassword,
);

export const AuthRoutes = router;
