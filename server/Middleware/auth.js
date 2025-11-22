import jwt from 'jsonwebtoken';
import Member from '../Models/member.js';

export const protect = async (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ message: 'دسترسی ممنوع - توکن ارائه نشده' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Member.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'کاربر یافت نشد' });
    }
    
    if (user.isActive === false) {
      return res.status(401).json({ message: 'حساب شما غیرفعال شده است' });
    }
    
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ message: 'توکن نامعتبر' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'فقط ادمین مجاز است' });
  }
  next();
};