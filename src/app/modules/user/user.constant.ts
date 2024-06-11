export const USER_ROLE = {
  student: 'studnet',
  faculty: 'faculty',
  admin: 'admin',
} as const;

export type UserRoleProps = keyof typeof USER_ROLE;
