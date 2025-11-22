import express from 'express';
import { register, login, logout, getMe } from '../Controllers/authController.js';
import { protect } from '../Middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);

export default router;



/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: مدیریت ثبت‌نام و ورود کاربران
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: ثبت‌نام کاربر جدید
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - phoneNumber
 *               - password
 *               - gender
 *               - termsAccepted
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               password:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [مرد, زن, دیگر]
 *               termsAccepted:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: ثبت‌نام موفق
 *       400:
 *         description: خطا در ورودی‌ها
 *       500:
 *         description: خطای سرور
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: ورود کاربر
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - phoneNumber
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: ورود موفق
 *       400:
 *         description: فیلدها ناقص هستند
 *       401:
 *         description: اطلاعات ورود اشتباه است
 *       500:
 *         description: خطای سرور
 */

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: خروج کاربر
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: خروج موفق
 */

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: دریافت اطلاعات کاربر لاگین شده
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: اطلاعات کاربر
 *       401:
 *         description: توکن نامعتبر یا وجود ندارد
 */
