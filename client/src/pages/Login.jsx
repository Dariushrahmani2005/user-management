import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    phoneNumber: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'ایمیل الزامی است';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'فرمت ایمیل نامعتبر است';
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'شماره موبایل الزامی است';
    } else if (!/^09[0-9]{9}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'فرمت موبایل نامعتبر است';
    }

    if (!formData.password) {
      newErrors.password = 'رمز عبور الزامی است';
    } else if (formData.password.length < 6) {
      newErrors.password = 'رمز عبور باید حداقل ۶ کاراکتر باشد';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await login(formData);
      toast.success('ورود موفقیت‌آمیز بود');
      navigate('/');
    } catch (error) {
      // خطا توسط useApi مدیریت شده است
      console.log('Login error in component:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // برای تست سریع
  const fillTestData = () => {
    setFormData({
      email: 'admin@example.com',
      phoneNumber: '09123456789',
      password: '123456'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-white text-center mb-8">ورود به سیستم</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              placeholder="ایمیل"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:border-cyan-300 transition"
            />
            {errors.email && <p className="text-red-400 text-sm mt-2 pr-2">{errors.email}</p>}
          </div>
          
          <div>
            <input
              type="tel"
              name="phoneNumber"
              placeholder="شماره موبایل"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:border-cyan-300 transition"
            />
            {errors.phoneNumber && <p className="text-red-400 text-sm mt-2 pr-2">{errors.phoneNumber}</p>}
          </div>
          
          <div>
            <input
              type="password"
              name="password"
              placeholder="رمز عبور"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:border-cyan-300 transition"
            />
            {errors.password && <p className="text-red-400 text-sm mt-2 pr-2">{errors.password}</p>}
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-2xl font-bold transition disabled:opacity-50"
          >
            {isSubmitting ? 'در حال ورود...' : 'ورود به سیستم'}
          </button>
        </form>

        {/* دکمه تست سریع */}
        <button
          type="button"
          onClick={fillTestData}
          className="w-full mt-4 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-2xl font-bold transition"
        >
          پر کردن داده تست
        </button>
        
        <p className="text-center mt-6 text-white/80">
          حساب ندارید؟{' '}
          <Link to="/register" className="text-cyan-300 font-bold hover:underline">
            ثبت‌نام کنید
          </Link>
        </p>

        <div className="mt-6 p-4 bg-white/10 rounded-2xl text-sm">
          <p className="text-white/80 mb-2">برای تست:</p>
          <p className="text-white">ایمیل: admin@example.com</p>
          <p className="text-white">موبایل: 09123456789</p>
          <p className="text-white">رمز: 123456</p>
        </div>
      </div>
    </div>
  );
}