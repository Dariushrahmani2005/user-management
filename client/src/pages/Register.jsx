import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    gender: '',
    termsAccepted: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'نام الزامی است';
    }

    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'نام خانوادگی الزامی است';
    }

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

    if (!formData.gender) {
      newErrors.gender = 'انتخاب جنسیت الزامی است';
    }

    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'پذیرش قوانین الزامی است';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await register(formData);
      toast.success('ثبت‌نام موفقیت‌آمیز بود');
      navigate('/');
    } catch (error) {
      // Error handled by useApi hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-white text-center mb-8">ثبت‌نام در سیستم</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="firstName"
                placeholder="نام"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:border-cyan-300 transition"
              />
              {errors.firstName && <p className="text-red-400 text-sm mt-2 pr-2">{errors.firstName}</p>}
            </div>
            <div>
              <input
                type="text"
                name="lastName"
                placeholder="نام خانوادگی"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:border-cyan-300 transition"
              />
              {errors.lastName && <p className="text-red-400 text-sm mt-2 pr-2">{errors.lastName}</p>}
            </div>
          </div>

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

          <div>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-2xl text-white focus:outline-none focus:border-cyan-300 transition"
            >
              <option value="">انتخاب جنسیت</option>
              <option value="مرد">مرد</option>
              <option value="زن">زن</option>
              <option value="دیگر">دیگر</option>
            </select>
            {errors.gender && <p className="text-red-400 text-sm mt-2 pr-2">{errors.gender}</p>}
          </div>

          <div>
            <label className="flex items-center gap-2 text-white">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span>قوانین و مقررات را می‌پذیرم</span>
            </label>
            {errors.termsAccepted && <p className="text-red-400 text-sm mt-2 pr-2">{errors.termsAccepted}</p>}
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-2xl font-bold transition disabled:opacity-50"
          >
            {isSubmitting ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
          </button>
        </form>
        
        <p className="text-center mt-6 text-white/80">
          حساب دارید؟{' '}
          <Link to="/login" className="text-cyan-300 font-bold hover:underline">
            وارد شوید
          </Link>
        </p>
      </div>
    </div>
  );
}