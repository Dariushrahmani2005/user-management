import Member from '../Models/member.js';
import bcrypt from 'bcryptjs';

export const getProfile = async (req, res) => {
  try {
    const user = await Member.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'کاربر یافت نشد' });
    }
    res.json(user);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'خطا در دریافت پروفایل' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, currentPassword, newPassword } = req.body;
    
    const user = await Member.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'کاربر یافت نشد' });
    }
    
    // اگر ایمیل یا موبایل تغییر کرده، چک کردن تکراری نبودن
    if (email && email !== user.email) {
      const emailExists = await Member.findOne({ email, _id: { $ne: user._id } });
      if (emailExists) {
        return res.status(400).json({ message: 'ایمیل تکراری است' });
      }
    }
    
    if (phoneNumber && phoneNumber !== user.phoneNumber) {
      const phoneExists = await Member.findOne({ phoneNumber, _id: { $ne: user._id } });
      if (phoneExists) {
        return res.status(400).json({ message: 'شماره موبایل تکراری است' });
      }
    }
    
    // اگر پسورد جدید می‌خواهد تغییر کند
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'پسورد فعلی الزامی است' });
      }
      
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ message: 'پسورد فعلی اشتباه است' });
      }
      
      user.password = await bcrypt.hash(newPassword, 12);
    }
    
    // آپدیت فیلدها
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email.toLowerCase();
    if (phoneNumber) user.phoneNumber = phoneNumber;
    
    await user.save();
    
    const updatedUser = await Member.findById(req.user.id).select('-password');
    res.json({ 
      message: 'پروفایل با موفقیت آپدیت شد', 
      user: updatedUser 
    });
    
  } catch (err) {
    console.error('Update profile error:', err);
    
    if (err.code === 11000) {
      return res.status(400).json({ message: 'ایمیل یا موبایل تکراری است' });
    }
    
    res.status(500).json({ message: 'خطا در آپدیت پروفایل' });
  }
};