import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi, useDebounce } from '../../hooks/useApi';
import ConfirmationModal from '../../components/UI/ConfirmationModal';
import toast from 'react-hot-toast';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    gender: '',
    isActive: ''
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    userId: null,
    userName: ''
  });
  
  const { apiRequest } = useApi();
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [debouncedSearch, filters, users]);

  const fetchUsers = async () => {
    try {
      const data = await apiRequest('/members');
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Search filter
    if (debouncedSearch) {
      filtered = filtered.filter(user =>
        user.firstName?.includes(debouncedSearch) ||
        user.lastName?.includes(debouncedSearch) ||
        user.email?.includes(debouncedSearch) ||
        user.phoneNumber?.includes(debouncedSearch)
      );
    }

    // Role filter
    if (filters.role) {
      filtered = filtered.filter(user => user.role === filters.role);
    }

    // Gender filter
    if (filters.gender) {
      filtered = filtered.filter(user => user.gender === filters.gender);
    }

    // Active status filter
    if (filters.isActive !== '') {
      filtered = filtered.filter(user => user.isActive === (filters.isActive === 'true'));
    }

    setFilteredUsers(filtered);
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      await apiRequest(`/members/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ isActive: !currentStatus })
      });
      
      // Update local state
      setUsers(prev => prev.map(user => 
        user._id === userId ? { ...user, isActive: !currentStatus } : user
      ));
      toast.success(`کاربر ${!currentStatus ? 'فعال' : 'غیرفعال'} شد`);
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await apiRequest(`/members/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole })
      });
      
      // Update local state
      setUsers(prev => prev.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
      toast.success('نقش کاربر تغییر کرد');
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const openDeleteModal = (userId, userName) => {
    setDeleteModal({
      isOpen: true,
      userId,
      userName
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      userId: null,
      userName: ''
    });
  };

  const handleDelete = async () => {
    const { userId, userName } = deleteModal;
    
    try {
      await apiRequest(`/members/${userId}`, { method: 'DELETE' });
      setUsers(prev => prev.filter(user => user._id !== userId));
      toast.success(`کاربر "${userName}" با موفقیت حذف شد`);
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting user:', error);
      closeDeleteModal();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-2xl">در حال بارگذاری کاربران...</div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-6 text-white">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
                مدیریت کاربران
              </h1>
              <p className="text-gray-300 text-lg">
                تعداد کل کاربران: <span className="text-cyan-400">{users.length}</span> | 
                نمایش: <span className="text-purple-400">{filteredUsers.length}</span>
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Link
                to="/admin/users/create"
                className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 rounded-2xl font-bold hover:scale-105 transition"
              >
                + کاربر جدید
              </Link>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 mb-8 border border-white/10">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
                <input
                  type="text"
                  placeholder="جستجو در نام، ایمیل، موبایل..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition"
                />
              </div>
              
              <select 
                value={filters.role}
                onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
                className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition"
              >
                <option value="">همه نقش‌ها</option>
                <option value="admin">ادمین</option>
                <option value="client">کاربر</option>
              </select>

              <select 
                value={filters.gender}
                onChange={(e) => setFilters(prev => ({ ...prev, gender: e.target.value }))}
                className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition"
              >
                <option value="">همه جنسیت‌ها</option>
                <option value="مرد">مرد</option>
                <option value="زن">زن</option>
                <option value="دیگر">دیگر</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="p-6 text-right">کاربر</th>
                    <th className="p-6">اطلاعات تماس</th>
                    <th className="p-6">نقش</th>
                    <th className="p-6">وضعیت</th>
                    <th className="p-6">تاریخ ایجاد</th>
                    <th className="p-6">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="border-t border-white/10 hover:bg-white/5 transition">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                            {user.firstName[0]}{user.lastName[0]}
                          </div>
                          <div>
                            <div className="font-bold text-lg">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-gray-300 text-sm">
                              {user.gender}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="space-y-2">
                          <div className="text-cyan-400">{user.email}</div>
                          <div className="text-gray-300">{user.phoneNumber}</div>
                        </div>
                      </td>
                      <td className="p-6">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 transition"
                        >
                          <option value="client">کاربر</option>
                          <option value="admin">ادمین</option>
                        </select>
                      </td>
                      <td className="p-6">
                        <button
                          onClick={() => handleStatusToggle(user._id, user.isActive)}
                          className={`px-4 py-2 rounded-full font-bold transition ${
                            user.isActive !== false 
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30' 
                              : 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                          } hover:scale-105`}
                        >
                          {user.isActive !== false ? 'فعال' : 'غیرفعال'}
                        </button>
                      </td>
                      <td className="p-6 text-gray-300">
                        {new Date(user.createdAt).toLocaleDateString('fa-IR')}
                      </td>
                      <td className="p-6">
                        <div className="flex gap-2">
                          <Link
                            to={`/admin/users/edit/${user._id}`}
                            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-white transition hover:scale-105"
                          >
                            ویرایش
                          </Link>
                          <button 
                            onClick={() => openDeleteModal(user._id, `${user.firstName} ${user.lastName}`)}
                            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-white transition hover:scale-105"
                          >
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-xl">
                {users.length === 0 ? 'هیچ کاربری یافت نشد' : 'نتیجه‌ای برای جستجوی شما یافت نشد'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="حذف کاربر"
        message={`آیا از حذف کاربر "${deleteModal.userName}" اطمینان دارید؟ این عمل غیرقابل بازگشت است.`}
        confirmText="بله، حذف شود"
        cancelText="انصراف"
        type="danger"
      />
    </>
  );
}