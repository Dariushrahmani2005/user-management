import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  LogOut, 
  Menu, 
  X, 
  Settings,
  User,
  BarChart3
} from 'lucide-react';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // تشخیص اسکرول برای افکت شفافیت
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { icon: LayoutDashboard, label: 'داشبورد', path: '/', roles: ['admin', 'client'] },
    { icon: BarChart3, label: 'آمار و گزارش', path: '/admin/panel', roles: ['admin'] },
    { icon: Users, label: 'مدیریت کاربران', path: '/admin/users', roles: ['admin'] },
    { icon: UserPlus, label: 'ایجاد کاربر', path: '/admin/users/create', roles: ['admin'] },
    { icon: User, label: 'پروفایل من', path: '/profile', roles: ['admin', 'client'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(user?.role));

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-6 right-6 z-50 lg:hidden p-3 rounded-2xl transition-all duration-300 ${
          isOpen ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
        }`}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 right-0 z-40 w-80 bg-gradient-to-b from-gray-900/95 to-gray-800/95 backdrop-blur-xl text-white transform transition-transform duration-300 ease-in-out border-l border-white/10 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-2xl">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">{user?.name}</h2>
                <p className="text-cyan-400 text-sm">
                  {user?.role === 'admin' ? 'مدیر سیستم' : 'کاربر عادی'}
                </p>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              پنل مدیریت
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-3 overflow-y-auto">
            {filteredItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                    active 
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-400 shadow-lg' 
                      : 'hover:bg-white/10 hover:border-white/20 text-gray-300'
                  } border border-transparent`}
                >
                  <Icon 
                    size={24} 
                    className={`transition-transform duration-300 group-hover:scale-110 ${
                      active ? 'text-cyan-400' : 'text-gray-400'
                    }`} 
                  />
                  <span className="text-lg font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-white/10">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 text-red-400 hover:text-red-300 py-4 rounded-2xl transition-all duration-300 border border-red-500/30 hover:border-red-400/50 font-bold"
            >
              <LogOut size={20} />
              خروج از سیستم
            </button>
          </div>
        </div>
      </div>
    </>
  );
}