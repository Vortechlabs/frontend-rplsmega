import React, { useEffect, useState } from 'react';
import { 
  FaUserPlus, 
  FaUserShield, 
  FaUser, 
  FaFileImport,
  FaSearch
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import apiClient from '../../../../services/GlobalApi';
import Sidebar from '../../../../components/Sidebar';
import UserList from './UserList';
import Loader from '../../../../components/Loader';

function ManageUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPageAdmin, setCurrentPageAdmin] = useState(1);
  const [currentPageUser, setCurrentPageUser] = useState(1);
  const usersPerPage = 10;
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('user');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/admin/user/get-all-users');
        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          setError('Invalid user data format');
        }
        setError(null);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load user data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    const result = await Swal.fire({
      title: 'Apakah kamu yakin?',
      text: 'Pengguna ini akan di hapus permanen!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await apiClient.delete(`/admin/user/delete/${id}`);
        
        toast.success('Pengguna berhasil dihapus!');
        setUsers(users.filter(user => user.id !== id));
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user!');
      }
    }
  };

  const handleEditUser = (id) => {
    navigate(`/admin/manage-users/edit/${id}`);
  };

  const getFilteredUsers = () => {
    let filteredUsers = users;

    if (searchQuery) {
      filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.class && user.class.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filteredUsers;
  };

  const filteredUsers = getFilteredUsers();
  const adminUsers = filteredUsers.filter(user => user.role === 'admin' || user.role === 'moderator');
  const regularUsers = filteredUsers.filter(user => user.role === 'user');

  const indexOfLastAdmin = currentPageAdmin * usersPerPage;
  const indexOfFirstAdmin = indexOfLastAdmin - usersPerPage;
  const currentAdminUsers = adminUsers.slice(indexOfFirstAdmin, indexOfLastAdmin);
  const totalAdminPages = Math.ceil(adminUsers.length / usersPerPage);

  const indexOfLastRegularUser = currentPageUser * usersPerPage;
  const indexOfFirstRegularUser = indexOfLastRegularUser - usersPerPage;
  const currentRegularUsers = regularUsers.slice(indexOfFirstRegularUser, indexOfLastRegularUser);
  const totalRegularPages = Math.ceil(regularUsers.length / usersPerPage);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 mt-16 md:mt-0 md:ml-[290px]">
        <div className="p-4 md:p-8 min-h-screen">
          <ToastContainer 
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-OxfordBlue/10 text-OxfordBlue">
                <FaUserShield className="text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Kelola Pengguna</h1>
                <p className="text-gray-600">Kelola semua sistem pengguna</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <Link 
                to="/admin/manage-users/add" 
                className="flex hover:scale-105  items-center justify-center border border-OxfordBlue text-OxfordBlue px-4 py-3 rounded-full hover:bg-OxfordBlue hover:text-white transition-all"
              >
                <FaUserPlus className="mr-2" />
                Tambah Pengguna
              </Link>
              <Link 
                to="/admin/manage-users/bulk-add" 
                className="flex hover:scale-105 items-center justify-center bg-gradient-to-r from-GoldenYellow/90 to-GoldenYellow-Dark text-white px-4 py-3 rounded-full hover:from-GoldenYellow-Dark hover:to-GoldenYellow/90 transition-all"
              >
                <FaFileImport className="mr-2" />
                Import File
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Jelajahi pengguna..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-OxfordBlue focus:border-OxfordBlue"
                />
              </div>

              <div className="flex border border-gray-200 pr-10 rounded-lg overflow-hidden">
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`px-4 py-2 flex items-center ${activeTab === 'admin' ? 'bg-GoldenYellow-Dark text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                >
                  <FaUserShield className="mr-2" />
                  Admin
                </button>
                <button
                  onClick={() => setActiveTab('user')}
                  className={`px-4 py-2 flex items-center ${activeTab === 'user' ? 'bg-OxfordBlue text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                >
                  <FaUser className="mr-2" />
                  User
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <>
            <Loader />
            </>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-6">
              {activeTab === 'admin' && (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                      <FaUserShield className="mr-2 text-GoldenYellow-Dark" />
                       Moderators
                    </h2>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {adminUsers.length} pengguna
                    </span>
                  </div>
                  
                  <UserList 
                    users={currentAdminUsers}
                    currentPage={currentPageAdmin}
                    totalPages={totalAdminPages}
                    onPageChange={setCurrentPageAdmin}
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUser}
                    type="admin"
                  />
                </>
              )}

              {activeTab === 'user' && (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                      <FaUser className="mr-2 text-OxfordBlue" />
                      Pengguna reguler
                    </h2>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {regularUsers.length} pengguna
                    </span>
                  </div>
                  
                  <UserList 
                    users={currentRegularUsers}
                    currentPage={currentPageUser}
                    totalPages={totalRegularPages}
                    onPageChange={setCurrentPageUser}
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUser}
                    type="user"
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageUser;