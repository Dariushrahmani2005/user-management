import express from 'express';
import { 
  getMembers, 
  getMemberById, 
  createMember, 
  updateMember, 
  deleteMember, 
  getStats 
} from '../Controllers/memberController.js';
import { protect, adminOnly } from '../Middleware/auth.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/', getMembers);
router.get('/:id', getMemberById);
router.post('/', createMember);
router.put('/:id', updateMember);
router.delete('/:id', deleteMember);

export default router;


/**
 * @swagger
 * tags:
 *   name: Members
 *   description: مدیریت اعضا (Admin Only)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Member:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         role:
 *           type: string
 *           enum: [admin, client]
 *         gender:
 *           type: string
 *           enum: [مرد, زن, دیگر]
 *         termsAccepted:
 *           type: boolean
 *         isActive:
 *           type: boolean
 *         lastLogin:
 *           type: string
 *           format: date-time
 *         profileImage:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *   requestBodies:
 *     CreateMember:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - phoneNumber
 *         - password
 *         - gender
 *       properties:
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         password:
 *           type: string
 *         gender:
 *           type: string
 *           enum: [مرد, زن, دیگر]
 *
 *     UpdateMember:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         password:
 *           type: string
 *         gender:
 *           type: string
 *         isActive:
 *           type: boolean
 */

/**
 * @swagger
 * /api/members/stats:
 *   get:
 *     summary: دریافت آمار کلی کاربران
 *     tags: [Members]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: آمار کاربران
 */

/**
 * @swagger
 * /api/members:
 *   get:
 *     summary: دریافت لیست تمام اعضا
 *     tags: [Members]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: لیست کاربران
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Member'
 *
 *   post:
 *     summary: ایجاد کاربر جدید
 *     tags: [Members]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/requestBodies/CreateMember'
 *     responses:
 *       201:
 *         description: کاربر با موفقیت ایجاد شد
 */

/**
 * @swagger
 * /api/members/{id}:
 *   get:
 *     summary: دریافت اطلاعات یک کاربر با ID
 *     tags: [Members]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: کاربر یافت شد
 *
 *   put:
 *     summary: آپدیت اطلاعات کاربر
 *     tags: [Members]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/requestBodies/UpdateMember'
 *     responses:
 *       200:
 *         description: آپدیت موفق
 *
 *   delete:
 *     summary: حذف کاربر
 *     tags: [Members]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: حذف موفق
 */
