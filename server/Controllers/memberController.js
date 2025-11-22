import Member from '../Models/member.js';
import bcrypt from 'bcryptjs';

export const getMembers = async (req, res) => {
  try {
    const members = await Member.find().select('-password').sort({ createdAt: -1 });
    res.json(members);
  } catch (err) {
    console.error('Get members error:', err);
    res.status(500).json({ message: 'خطا در دریافت کاربران' });
  }
};

export const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id).select('-password');
    if (!member) {
      return res.status(404).json({ message: 'کاربر یافت نشد' });
    }
    res.json(member);
  } catch (err) {
    console.error('Get member by ID error:', err);
    res.status(500).json({ message: 'خطا در دریافت کاربر' });
  }
};

export const createMember = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, password, gender } = req.body;

  try {
    const exists = await Member.findOne({ $or: [{ email }, { phoneNumber }] });
    if (exists) {
      return res.status(400).json({ message: 'ایمیل یا موبایل تکراری است' });
    }

    const hashed = await bcrypt.hash(password, 12);
    const member = await Member.create({
      firstName, 
      lastName, 
      email: email.toLowerCase(), 
      phoneNumber,
      password: hashed, 
      gender, 
      termsAccepted: true,
      isActive: true
    });
    
    res.status(201).json({ 
      message: 'کاربر ایجاد شد', 
      member: {
        id: member._id,
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        role: member.role
      }
    });
  } catch (err) {
    console.error('Create member error:', err);
    res.status(500).json({ message: 'خطا در ایجاد کاربر' });
  }
};

export const updateMember = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // اگر پسورد در بدنه باشد، آن را هش کنید
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 12);
    }
    
    // حذف فیلدهای غیرقابل آپدیت
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    
    const member = await Member.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { 
        new: true, 
        runValidators: true 
      }
    ).select('-password');
    
    if (!member) {
      return res.status(404).json({ message: 'کاربر یافت نشد' });
    }
    
    res.json({ 
      message: 'به‌روزرسانی موفق', 
      member 
    });
  } catch (err) {
    console.error('Update member error:', err);
    
    if (err.code === 11000) {
      return res.status(400).json({ message: 'ایمیل یا موبایل تکراری است' });
    }
    
    res.status(500).json({ message: 'خطا در به‌روزرسانی' });
  }
};

export const deleteMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'کاربر یافت نشد' });
    }
    res.json({ message: 'حذف موفق' });
  } catch (err) {
    console.error('Delete member error:', err);
    res.status(500).json({ message: 'خطا در حذف کاربر' });
  }
};

// تابع جدید برای دریافت آمار
export const getStats = async (req, res) => {
  try {
    const totalUsers = await Member.countDocuments();
    const adminUsers = await Member.countDocuments({ role: 'admin' });
    const activeUsers = await Member.countDocuments({ isActive: true });
    
    // آمار جنسیت
    const genderStats = await Member.aggregate([
      {
        $group: {
          _id: '$gender',
          count: { $sum: 1 }
        }
      }
    ]);

    // کاربران جدید امروز
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const newUsersToday = await Member.countDocuments({
      createdAt: { $gte: today }
    });

    // آخرین کاربران ثبت‌نام شده
    const recentUsers = await Member.find()
      .select('firstName lastName email createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalUsers,
      adminUsers,
      activeUsers,
      newUsersToday,
      genderStats,
      recentUsers
    });
  } catch (err) {
    console.error('Get stats error:', err);
    res.status(500).json({ message: 'خطا در دریافت آمار' });
  }
};