import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Member from '../Models/member.js';

const generateToken = (id, role) => jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const register = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, password, gender, termsAccepted } = req.body;

  if (!termsAccepted || !gender) {
    return res.status(400).json({ message: 'قوانین و جنسیت الزامی است' });
  }

  try {
    const exists = await Member.findOne({ $or: [{ email }, { phoneNumber }] });
    if (exists) {
      return res.status(400).json({ message: 'ایمیل یا موبایل تکراری است' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const member = await Member.create({
      firstName, 
      lastName, 
      email: email.toLowerCase(), 
      phoneNumber,
      password: hashedPassword, 
      gender, 
      termsAccepted,
      role: email === 'admin@example.com' ? 'admin' : 'client',
      isActive: true
    });

    const token = generateToken(member._id, member.role);
    res.cookie('token', token, { 
      httpOnly: true, 
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    });
    
    res.status(201).json({
      message: 'ثبت‌نام موفق',
      token,
      user: { 
        id: member._id, 
        name: `${member.firstName} ${member.lastName}`, 
        role: member.role,
        email: member.email
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'خطا در ثبت‌نام' });
  }
};

export const login = async (req, res) => {
  const { email, phoneNumber, password } = req.body;

  if (!email || !phoneNumber || !password) {
    return res.status(400).json({ message: 'همه فیلدها الزامی است' });
  }

  try {
    const member = await Member.findOne({ 
      email: email.toLowerCase(), 
      phoneNumber 
    }).select('+password');
    
    if (!member) {
      return res.status(401).json({ message: 'اطلاعات ورود اشتباه است' });
    }

    // بررسی وضعیت فعال بودن کاربر
    if (member.isActive === false) {
      return res.status(401).json({ message: 'حساب شما غیرفعال شده است' });
    }

    const isPasswordValid = await bcrypt.compare(password, member.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'اطلاعات ورود اشتباه است' });
    }

    // آپدیت lastLogin
    member.lastLogin = new Date();
    await member.save();

    const token = generateToken(member._id, member.role);
    res.cookie('token', token, { 
      httpOnly: true, 
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    });
    
    res.json({
      message: 'ورود موفق',
      token,
      user: { 
        id: member._id, 
        name: `${member.firstName} ${member.lastName}`, 
        role: member.role,
        email: member.email
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'خطای سرور' });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'خروج موفق' });
};

// تابع جدید برای بررسی وضعیت کاربر
export const getMe = async (req, res) => {
  try {
    const user = await Member.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'کاربر یافت نشد' });
    }
    res.json({
      id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      role: user.role,
      email: user.email
    });
  } catch (err) {
    res.status(500).json({ message: 'خطای سرور' });
  }
};