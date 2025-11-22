import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import toast from 'react-hot-toast';

export default function UserProfile() {
  const { user, updateUser } = useAuth();
  const { apiRequest } = useApi();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    gender: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profileData, setProfileData] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiRequest('/profile');
        setProfileData(data);
        setFormData(prev => ({
          ...prev,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          gender: data.gender
        }));
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('خطا در بارگذاری پروفایل');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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

    if (activeTab === 'profile') {
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
    } else if (activeTab === 'security') {
      if (formData.newPassword) {
        if (!formData.currentPassword) {
          newErrors.currentPassword = 'رمز عبور فعلی الزامی است';
        }

        if (formData.newPassword.length < 6) {
          newErrors.newPassword = 'رمز عبور جدید باید حداقل ۶ کاراکتر باشد';
        }

        if (formData.newPassword !== formData.confirmPassword) {
          newErrors.confirmPassword = 'تکرار رمز عبور مطابقت ندارد';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      let updateData = {};
      
      if (activeTab === 'profile') {
        updateData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          gender: formData.gender
        };
      } else if (activeTab === 'security' && formData.newPassword) {
        updateData = {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        };
      }

      const response = await apiRequest('/profile', {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });

      // آپدیت اطلاعات کاربر در context
      if (activeTab === 'profile') {
        updateUser({
          name: `${response.user.firstName} ${response.user.lastName}`,
          email: response.user.email
        });
        setProfileData(response.user);
      }

      // پاک کردن فیلدهای رمز عبور
      if (activeTab === 'security') {
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      }

      toast.success(activeTab === 'profile' ? 'پروفایل با موفقیت به‌روزرسانی شد' : 'رمز عبور با موفقیت تغییر کرد');
    } catch (error) {
      // Error handled by useApi hook
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-2xl">در حال بارگذاری پروفایل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
          {/* Header */}
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {profileData?.firstName?.charAt(0)}{profileData?.lastName?.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">پروفایل کاربری</h2>
              <p className="text-gray-300 mt-2">مدیریت اطلاعات حساب کاربری</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-white/10">
            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-4 px-4 font-bold transition-all border-b-2 ${
                activeTab === 'profile'
                  ? 'text-cyan-400 border-cyan-400'
                  : 'text-gray-400 border-transparent hover:text-cyan-300'
              }`}
            >
              اطلاعات شخصی
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`pb-4 px-4 font-bold transition-all border-b-2 ${
                activeTab === 'security'
                  ? 'text-cyan-400 border-cyan-400'
                  : 'text-gray-400 border-transparent hover:text-cyan-300'
              }`}
            >
              امنیت و رمز عبور
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm font-medium">نام</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white focus:outline-none focus:border-cyan-400 transition"
                    />
                    {errors.firstName && <p className="text-red-400 text-sm mt-2 pr-2">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2 text-sm font-medium">نام خانوادگی</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white focus:outline-none focus:border-cyan-400 transition"
                    />
                    {errors.lastName && <p className="text-red-400 text-sm mt-2 pr-2">{errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm font-medium">ایمیل</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white focus:outline-none focus:border-cyan-400 transition"
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-2 pr-2">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm font-medium">شماره موبایل</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white focus:outline-none focus:border-cyan-400 transition"
                  />
                  {errors.phoneNumber && <p className="text-red-400 text-sm mt-2 pr-2">{errors.phoneNumber}</p>}
                </div>

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

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white py-3 px-8 rounded-2xl font-bold transition disabled:opacity-50"
                >
                  {isSubmitting ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                </button>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-300 mb-2 text-sm font-medium">رمز عبور فعلی</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white focus:outline-none focus:border-cyan-400 transition"
                  />
                  {errors.currentPassword && <p className="text-red-400 text-sm mt-2 pr-2">{errors.currentPassword}</p>}
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm font-medium">رمز عبور جدید</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white focus:outline-none focus:border-cyan-400 transition"
                  />
                  {errors.newPassword && <p className="text-red-400 text-sm mt-2 pr-2">{errors.newPassword}</p>}
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 text-sm font-medium">تکرار رمز عبور جدید</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white focus:outline-none focus:border-cyan-400 transition"
                  />
                  {errors.confirmPassword && <p className="text-red-400 text-sm mt-2 pr-2">{errors.confirmPassword}</p>}
                </div>

                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-4">
                  <p className="text-cyan-400 text-sm">
                    <strong>توجه:</strong> برای تغییر رمز عبور، حتما باید رمز عبور فعلی را وارد کنید.
                    در صورت عدم تمایل به تغییر رمز عبور، فیلدهای مربوطه را خالی بگذارید.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white py-3 px-8 rounded-2xl font-bold transition disabled:opacity-50"
                >
                  {isSubmitting ? 'در حال تغییر...' : 'تغییر رمز عبور'}
                </button>
              </div>
            )}
          </form>

          {/* User Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-green-400 font-bold">✓</span>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">وضعیت حساب</div>
                  <div className="text-white font-bold">
                    {profileData?.isActive !== false ? 'فعال' : 'غیرفعال'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-blue-400 font-bold">👤</span>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">نقش</div>
                  <div className="text-white font-bold">
                    {profileData?.role === 'admin' ? 'مدیر' : 'کاربر'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-purple-400 font-bold">📅</span>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">عضویت از</div>
                  <div className="text-white font-bold">
                    {profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString('fa-IR') : '---'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}