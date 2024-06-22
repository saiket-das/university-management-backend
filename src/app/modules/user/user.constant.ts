export const USER_ROLE = {
  superAdmin: 'superAdmin',
  student: 'student',
  faculty: 'faculty',
  admin: 'admin',
} as const;

export const UserStatus = ['in-progress', 'blocked'];

export type UserRoleProps = keyof typeof USER_ROLE;
export type UserStatusProps = keyof typeof UserStatus;
