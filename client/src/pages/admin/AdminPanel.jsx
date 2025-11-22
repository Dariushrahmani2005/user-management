import { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';

export default function AdminPanel() {
  const { apiRequest } = useApi();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const statsData = await apiRequest('/members/stats');
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  const systemStats = [
    {
      icon: '📊',
      label: 'کل رکوردها',
      value: (stats?.totalUsers || 0).toLocaleString(),
      color: 'from-blue-500 to-cyan-500',
      change: '+5.2%'
    },
    {
      icon: '⚡',
      label: 'کاربران فعال',
      value: (stats?.activeUsers || 0).toLocaleString(),
      color: 'from-green-500 to-emerald-500',
      change: '+12.1%'
    },
    {
      icon: '🖥️',
      label: 'کاربران ادمین',
      value: (stats?.adminUsers || 0).toLocaleString(),
      color: 'from-purple-500 to-pink-500',
      change: '+2.3%'
    },
    {
      icon: '⏱️',
      label: 'امروز',
      value: (stats?.newUsersToday || 0).toLocaleString(),
      color: 'from-orange-500 to-red-500',
      change: '+8.7%'
    }
  ];

  const recentActivities = [
    { action: 'کاربر جدید ثبت‌نام کرد', user: 'علی محمدی', time: '۲ دقیقه پیش', type: 'success' },
    { action: 'پروفایل کاربر به‌روزرسانی شد', user: 'مریم احمدی', time: '۱۵ دقیقه پیش', type: 'info' },
    { action: 'کاربر حذف شد', user: 'رضا کریمی', time: '۱ ساعت پیش', type: 'error' },
    { action: 'نقش کاربر تغییر کرد', user: 'سارا نظری', time: '۲ ساعت پیش', type: 'warning' },
    { action: 'ورود موفق به سیستم', user: 'محمد رضایی', time: '۳ ساعت پیش', type: 'success' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-2xl">در حال بارگذاری پنل مدیریت...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center">
              <span className="text-white text-2xl">📈</span>
            </div>
            <h1 className="text-4xl font-bold text-white">پنل مدیریت سیستم</h1>
          </div>
          <p className="text-gray-300 text-xl">مدیریت و مانیتورینگ کامل سیستم</p>
        </div>

        {/* User Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass-card p-6 lg:col-span-2">
            <h3 className="text-2xl font-bold text-cyan-400 mb-6">آمار کاربران</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">{stats?.totalUsers || 0}</div>
                <div className="text-gray-400">کل کاربران</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">{stats?.activeUsers || 0}</div>
                <div className="text-gray-400">کاربران فعال</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">{stats?.adminUsers || 0}</div>
                <div className="text-gray-400">کاربران ادمین</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">{stats?.newUsersToday || 0}</div>
                <div className="text-gray-400">امروز</div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 lg:col-span-2">
            <h3 className="text-2xl font-bold text-purple-400 mb-6">توزیع جنسیت</h3>
            <div className="space-y-4">
              {stats?.genderStats?.map((gender, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-300">{gender._id}</span>
                  <div className="flex items-center gap-4">
                    <div className="w-32 bg-white/10 rounded-full h-3">
                      <div 
                        className="h-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"
                        style={{ 
                          width: stats?.totalUsers 
                            ? `${(gender.count / stats.totalUsers) * 100}%` 
                            : '0%' 
                        }}
                      ></div>
                    </div>
                    <span className="text-white font-bold w-12 text-left">
                      {stats?.totalUsers 
                        ? `${((gender.count / stats.totalUsers) * 100).toFixed(1)}%`
                        : '0%'
                      }
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {systemStats.map((stat, index) => (
            <div key={index} className="glass-card p-6 text-center group hover:scale-105 transition-transform">
              <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl`}>
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-gray-400 mb-2">{stat.label}</div>
              <div className="text-green-400 text-sm font-bold">{stat.change}</div>
            </div>
          ))}
        </div>

        {/* Recent Users */}
        {stats?.recentUsers && stats.recentUsers.length > 0 && (
          <div className="glass-card p-6 mb-8">
            <h3 className="text-2xl font-bold text-white mb-6">کاربران اخیر</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {stats.recentUsers.map((user, index) => (
                <div key={index} className="bg-white/5 rounded-2xl p-4 border border-white/10 hover:border-white/20 transition group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                      {user.firstName[0]}{user.lastName[0]}
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {new Date(user.createdAt).toLocaleDateString('fa-IR')}
                      </div>
                    </div>
                  </div>
                  <div className="text-cyan-400 text-sm truncate" title={user.email}>
                    {user.email}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="glass-card p-6">
          <h3 className="text-2xl font-bold text-white mb-6">فعالیت‌های اخیر</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition">
                <div className={`w-3 h-3 rounded-full ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'error' ? 'bg-red-500' :
                  activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <div className="text-white font-medium">{activity.action}</div>
                  <div className="text-gray-400 text-sm">{activity.user}</div>
                </div>
                <div className="text-gray-400 text-sm">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card p-6 mt-8">
          <h3 className="text-2xl font-bold text-white mb-6">عملیات سریع</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a href="/admin/users" className="bg-cyan-500 hover:bg-cyan-600 text-white py-4 px-6 rounded-2xl text-center transition">
              مدیریت کاربران
            </a>
            <a href="/admin/users/create" className="bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-2xl text-center transition">
              ایجاد کاربر جدید
            </a>
            <a href="/admin/panel" className="bg-purple-500 hover:bg-purple-600 text-white py-4 px-6 rounded-2xl text-center transition">
              مشاهده آمار
            </a>
            <a href="/profile" className="bg-orange-500 hover:bg-orange-600 text-white py-4 px-6 rounded-2xl text-center transition">
              پروفایل من
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}