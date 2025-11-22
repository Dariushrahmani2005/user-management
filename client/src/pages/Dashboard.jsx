import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { apiRequest } = useApi();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (user?.role === 'admin') {
        try {
          const data = await apiRequest('/members/stats');
          setStats(data);
        } catch (error) {
          console.error('Error fetching stats:', error);
        }
      }
      setLoading(false);
    };

    fetchStats();
  }, [user]);

  const statCards = [
    {
      title: 'کل کاربران',
      value: stats?.totalUsers || 0,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'کاربران فعال',
      value: stats?.activeUsers || 0,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'کاربران ادمین',
      value: stats?.adminUsers || 0,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'امروز',
      value: stats?.newUsersToday || 0,
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            {user ? `خوش آمدید، ${user.name}!` : 'به سیستم خوش آمدید'}
          </h1>
          <p className="text-xl text-gray-300">
            {user ? `نقش شما: ${user.role === 'admin' ? 'مدیر سیستم' : 'کاربر عادی'}` : 'لطفا وارد شوید'}
          </p>
        </div>

        {user && (
          <>
            {/* Stats Cards - Only for Admin */}
            {user.role === 'admin' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {statCards.map((card, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/10 hover:border-white/20 transition">
                    <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-2xl flex items-center justify-center mb-4`}>
                      <span className="text-white font-bold text-lg">{card.value}</span>
                    </div>
                    <h3 className="text-gray-300 text-lg">{card.title}</h3>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* اطلاعات کاربر */}
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
                <h3 className="text-2xl font-bold text-cyan-400 mb-4">اطلاعات حساب</h3>
                <div className="space-y-3">
                  <p><span className="text-gray-400">نام:</span> {user.name}</p>
                  <p><span className="text-gray-400">ایمیل:</span> {user.email}</p>
                  <p><span className="text-gray-400">نقش:</span> 
                    <span className={`px-3 py-1 rounded-full text-sm mr-2 ${
                      user.role === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {user.role === 'admin' ? 'مدیر' : 'کاربر'}
                    </span>
                  </p>
                </div>
              </div>

              {/* دسترسی سریع */}
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
                <h3 className="text-2xl font-bold text-purple-400 mb-4">دسترسی سریع</h3>
                <div className="space-y-3">
                  <a href="/profile" className="block bg-cyan-500 hover:bg-cyan-600 text-white py-3 px-4 rounded-2xl text-center transition">
                    پروفایل من
                  </a>
                  {user.role === 'admin' && (
                    <>
                      <a href="/admin/users" className="block bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-2xl text-center transition">
                        مدیریت کاربران
                      </a>
                      <a href="/admin/panel" className="block bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-2xl text-center transition">
                        پنل مدیریت
                      </a>
                    </>
                  )}
                  <button 
                    onClick={logout}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-2xl transition"
                  >
                    خروج از سیستم
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {!user && (
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 max-w-md mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">لطفا وارد شوید</h3>
              <p className="text-gray-300 mb-6">برای دسترسی به پنل مدیریت، باید وارد حساب کاربری خود شوید.</p>
              <a href="/login" className="bg-cyan-500 hover:bg-cyan-600 text-white py-3 px-8 rounded-2xl transition">
                ورود به سیستم
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}