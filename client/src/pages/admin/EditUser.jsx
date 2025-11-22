import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import toast from 'react-hot-toast';

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { apiRequest } = useApi();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    gender: '',
    role: 'client',
    isActive: true
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await apiRequest(`/members/${id}`);
        setFormData({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          gender: userData.gender,
          role: userData.role,
          isActive: userData.isActive !== false
        });
      } catch (error) {
        console.error('Error fetching user:', error);
        toast.error('خطا در بارگذاری اطلاعات کاربر');
        navigate('/admin/users');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]);

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

    if (!formData.gender) {
      newErrors.gender = 'انتخاب جنسیت الزامی است';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await apiRequest(`/members/${id}`, {
        method: 'PUT',
        body: JSON.stringify(formData)
      });
      
      toast.success('اطلاعات کاربر با موفقیت به‌روزرسانی شد');
      navigate('/admin/users');
    } catch (error) {
      // Error handled by useApi hook
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-2xl">در حال بارگذاری اطلاعات کاربر...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">✎</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">ویرایش کاربر</h2>
              <p className="text-gray-300 mt-2">اطلاعات کاربر را ویرایش کنید</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2 text-sm font-medium">نام</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="نام کاربر"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition"
                />
                {errors.firstName && <p className="text-red-400 text-sm mt-2 pr-2">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-gray-300 mb-2 text-sm font-medium">نام خانوادگی</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="نام خانوادگی کاربر"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition"
                />
                {errors.lastName && <p className="text-red-400 text-sm mt-2 pr-2">{errors.lastName}</p>}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">ایمیل</label>
              <input
                type="email"
                name="email"
                placeholder="آدرس ایمیل"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition"
              />
              {errors.email && <p className="text-red-400 text-sm mt-2 pr-2">{errors.email}</p>}
            </div>

            {/* Phone Number Field */}
            <div>
              <label className="block text-gray-300 mb-2 text-sm font-medium">شماره موبایل</label>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition"
              />
              {errors.phoneNumber && <p className="text-red-400 text-sm mt-2 pr-2">{errors.phoneNumber}</p>}
            </div>

            {/* Gender and Role Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2 text-sm font-medium">جنسیت</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white focus:outline-none focus:border-cyan-400 transition"
                >
                  <option value="">انتخاب جنسیت</option>
                  <option value="مرد">مرد</option>
                  <option value="زن">زن</option>
                  <option value="دیگر">دیگر</option>
                </select>
                {errors.gender && <p className="text-red-400 text-sm mt-2 pr-2">{errors.gender}</p>}
              </div>

              <div>
                <label className="block text-gray-300 mb-2 text-sm font-medium">نقش</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white focus:outline-none focus:border-cyan-400 transition"
                >
                  <option value="client">کاربر عادی</option>
                  <option value="admin">ادمین</option>
                </select>
              </div>
            </div>

            {/* Status Field */}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-gray-300">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span>کاربر فعال</span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold py-4 px-8 rounded-2xl transition disabled:opacity-50"
              >
                {isSubmitting ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
              </button>
              
              <Link
                to="/admin/users"
                className="flex-1 bg-gradient-to-r from-gray-600 to-slate-700 hover:from-gray-700 hover:to-slate-800 text-white font-bold py-4 px-8 rounded-2xl transition text-center"
              >
                انصراف
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}