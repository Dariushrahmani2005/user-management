import express from 'express';
import { getProfile, updateProfile } from '../Controllers/profileController.js';
import { protect } from '../Middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getProfile);
router.put('/', updateProfile);

export default router;


/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: مدیریت پروفایل کاربر
 */

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: دریافت اطلاعات پروفایل کاربر
 *     tags: [Profile]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: اطلاعات پروفایل موفقیت‌آمیز
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phoneNumber:
 *                   type: string
 *                 role:
 *                   type: string
 *                 gender:
 *                   type: string
 *                 isActive:
 *                   type: boolean
 *                 lastLogin:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: دسترسی ممنوع / توکن نامعتبر
 *       404:
 *         description: کاربر یافت نشد
 */

/**
 * @swagger
 * /api/profile:
 *   put:
 *     summary: بروزرسانی پروفایل کاربر
 *     tags: [Profile]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: پروفایل با موفقیت آپدیت شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *       400:
 *         description: خطای اعتبارسنجی (مثلاً ایمیل یا شماره موبایل تکراری، پسورد فعلی اشتباه)
 *       401:
 *         description: دسترسی ممنوع / توکن نامعتبر
 *       404:
 *         description: کاربر یافت نشد
 */
