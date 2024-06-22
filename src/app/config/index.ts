import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  default_password: process.env.DEFAULT_PASSWORD,
  jwt_access_token: process.env.JWT_ACCESS_SECRET,
  jwt_access_token_expires_in: process.env.JWT_ACCESS_TOKEN_EXPRIRES_IN,
  jwt_refresh_token: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_token_expires_in: process.env.JWT_REFREESH_TOKEN_EXPRIRES_IN,
  reset_password_ui_link: process.env.RESET_PASSWORD_UI_LINK,
  nodemailer_email: process.env.NODEMAILER_EMAIL,
  nodemailer_pass: process.env.NODEMAILER_PASS,
  cloudinary_name: process.env.CLOUDINARY_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_SECRET,
  super_admin_password: process.env.SUPER_ADMIN_PASSWORD,
};
