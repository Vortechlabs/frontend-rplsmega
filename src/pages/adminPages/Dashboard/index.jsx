import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../../services/GlobalApi';
import { 
  FaUsers, 
  FaProjectDiagram, 
  FaCommentAlt,
  FaChartLine,
  FaDownload,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaUserPlus
} from 'react-icons/fa';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from 'recharts';
import Sidebar from '../../../components/Sidebar';
import { useAuth } from '../../../auth/AuthContext';
import { FiAlertTriangle } from 'react-icons/fi';
import Loader from '../../../components/Loader';

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'just now';
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
  
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
  
  return date.toLocaleDateString();
};

function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    projects: 0,
    alerts: 0,
    recentProjects: [],
    recentUsers: []
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [usersRes, projectsRes, alertsRes, statsRes, projectsData, usersData] = await Promise.all([
          apiClient.get('/users/v2/count'),
          apiClient.get('/projects/v2/count'),
          apiClient.get('/alerts/v2/count'),
          apiClient.get('/data/statistics'),
          apiClient.get('/projects'),
          apiClient.get('/admin/user/get-all-users')
        ]);

        const sortedProjects = [...projectsData.data].sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );
        const sortedUsers = [...usersData.data].sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );

        setStats({
          users: usersRes.data.count,
          projects: projectsRes.data.count,
          alerts: alertsRes.data.count,
          comments: 0,
          recentProjects: sortedProjects,
          recentUsers: sortedUsers
        });

        setChartData(statsRes.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const currentYear = new Date().getFullYear();

  const recentProjectsLimited = stats.recentProjects.slice(0, 4);
  const recentUsersLimited = stats.recentUsers.slice(0, 4);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded-lg border border-gray-100">
          <p className="font-semibold text-gray-800">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex bg-[#F8FAFB] min-h-screen">
      <Sidebar />

      <div className="flex-1 mt-16 md:mt-0 md:ml-[290px]">
        <div className="p-4 md:p-8">
          {loading ? (
            <Loader />
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="font-extrabold text-2xl md:text-[28px] leading-[42px]">Selamat datang kembali, {user[0]?.name}!</h1>
                    <p className="text-[#838C9D]">Kelola statistik seluruh proyek, pengguna, pemberitahuan, dan lainya.</p>
                </div>
              </header>

              {/* Stats Section */}
              <section className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
                  {/* Users Card */}
                  <div className="flex flex-col rounded-2xl p-5 gap-3 bg-white shadow-[0_4px_4px_0_rgba(224,226,239,0.5)] hover:shadow-md transition-shadow">
                      <div className="p-3 rounded-lg bg-[#F1EBFF] text-OxfordBlue w-12 h-12 flex items-center justify-center">
                          <FaUsers className="text-xl" />
                      </div>
                      <div>
                          <p className="font-extrabold text-2xl leading-[36px]">{stats.users}</p>
                          <p className="text-[#838C9D]">Total Pengguna</p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-OxfordBlue">
                          <FaChartLine className="mr-1" />
                          <span>Last 30 days</span>
                      </div>
                  </div>

                  {/* Projects Card */}
                  <div className="flex flex-col rounded-2xl p-5 gap-3 bg-white shadow-[0_4px_4px_0_rgba(224,226,239,0.5)] hover:shadow-md transition-shadow">
                      <div className="p-3 rounded-lg bg-[#F1EBFF] text-OxfordBlue w-12 h-12 flex items-center justify-center">
                          <FaProjectDiagram className="text-xl" />
                      </div>
                      <div>
                          <p className="font-extrabold text-2xl leading-[36px]">{stats.projects}</p>
                          <p className="text-[#838C9D]">Total Proyek</p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-OxfordBlue">
                          <FaChartLine className="mr-1" />
                          <span>Last 30 days</span>
                      </div>
                  </div>

                  {/* Alert Card */}
                  <div className="flex flex-col rounded-2xl p-5 gap-3 bg-white shadow-[0_4px_4px_0_rgba(224,226,239,0.5)] hover:shadow-md transition-shadow">
                      <div className="p-3 rounded-lg bg-[#F1EBFF] text-OxfordBlue w-12 h-12 flex items-center justify-center">
                          <FiAlertTriangle className="text-xl" />
                      </div>
                      <div>
                          <p className="font-extrabold text-2xl leading-[36px]">{stats.alerts}</p>
                          <p className="text-[#838C9D]">Total Pemberitahuan Aktif</p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-OxfordBlue">
                          <FaChartLine className="mr-1" />
                          <span>Last 30 days</span>
                      </div>
                  </div>
              </section>

              {/* Charts Section */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
                  {/* Line Chart - Modern Styling */}
                  <div className="bg-white rounded-2xl p-5 shadow-[0_4px_4px_0_rgba(224,226,239,0.5)]">
                      <div className="flex items-center justify-between mb-4">
                          <h2 className="text-lg font-semibold text-gray-800">Statistik Bulanan</h2>
                          <div className="flex items-center text-sm text-[#838C9D]">
                              <FaCalendarAlt className="mr-1" />
                              <span>{currentYear}</span>
                          </div>
                      </div>
                      <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={chartData}>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                  <XAxis 
                                    dataKey="month" 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280' }}
                                  />
                                  <YAxis 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280' }}
                                  />
                                  <Tooltip content={<CustomTooltip />} />
                                  <Legend />
                                  <Line 
                                    type="monotone" 
                                    dataKey="users" 
                                    stroke="#0A3180" 
                                    strokeWidth={2}
                                    name="Pengguna" 
                                    dot={{ r: 4, fill: '#0A3180', strokeWidth: 2 }}
                                    activeDot={{ r: 6, fill: '#0A3180', stroke: '#fff', strokeWidth: 2 }}
                                  />
                                  <Line 
                                    type="monotone" 
                                    dataKey="projects" 
                                    stroke="#FDC800" 
                                    strokeWidth={2}
                                    name="Proyek" 
                                    dot={{ r: 4, fill: '#FDC800', strokeWidth: 2 }}
                                    activeDot={{ r: 6, fill: '#FDC800', stroke: '#fff', strokeWidth: 2 }}
                                  />
                              </LineChart>
                          </ResponsiveContainer>
                      </div>
                  </div>

                  {/* Bar Chart - Modern Styling */}
                  <div className="bg-white rounded-2xl p-5 shadow-[0_4px_4px_0_rgba(224,226,239,0.5)]">
                      <div className="flex items-center justify-between mb-4">
                          <h2 className="text-lg font-semibold text-gray-800">Distribusi Proyek</h2>
                          <div className="flex items-center text-sm text-[#838C9D]">
                              <FaCalendarAlt className="mr-1" />
                              <span>{currentYear}</span>
                          </div>
                      </div>
                      <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={chartData}>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                  <XAxis 
                                    dataKey="month" 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280' }}
                                  />
                                  <YAxis 
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#0A3180' }}
                                  />
                                  <Tooltip content={<CustomTooltip />} />
                                  <Legend />
                                  <Bar 
                                    dataKey="projects" 
                                    fill="#0A3180" 
                                    name="Proyek"
                                    radius={[4, 4, 0, 0]}
                                  />
                              </BarChart>
                          </ResponsiveContainer>
                      </div>
                  </div>
              </section>

              {/* Bottom Section */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* Recent Projects */}
                  <div className="bg-white rounded-2xl p-5 shadow-[0_4px_4px_0_rgba(224,226,239,0.5)]">
                      <h2 className="text-lg font-semibold text-gray-800 mb-4">Proyek terbaru</h2>
                      <div className="space-y-4">
                          {recentProjectsLimited.map((project) => (
                              <div key={project.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                  <div className="p-3 rounded-lg bg-[#F1EBFF] text-OxfordBlue mr-4">
                                      <FaProjectDiagram className="text-xl" />
                                  </div>
                                  <div className="flex-1">
                                      <h3 className="font-medium text-gray-800">{project.title}</h3>
                                      <p className="text-sm text-[#838C9D]">{project.student_name}</p>
                                  </div>
                                  <div className="text-sm text-[#838C9D] flex items-center">
                                      <FaClock className="mr-1" />
                                      <span>{formatTimeAgo(project.created_at)}</span>
                                  </div>
                              </div>
                          ))}
                          {recentProjectsLimited.length === 0 && (
                              <div className="text-center py-8 text-gray-500">
                                Tidak ada data proyek
                              </div>
                          )}
                      </div>
                      <div className="mt-4 text-right">
                          <Link to="/admin/manage-projects" className="text-OxfordBlue hover:text-[#5a29d6] text-sm font-medium">
                              Lihat semua proyek →
                          </Link>
                      </div>
                  </div>

                  {/* Recent Users */}
                  <div className="bg-white rounded-2xl p-5 shadow-[0_4px_4px_0_rgba(224,226,239,0.5)]">
                      <h2 className="text-lg font-semibold text-gray-800 mb-4">Daftar Pengguna terbaru</h2>
                      <div className="space-y-4">
                          {recentUsersLimited.map((user) => (
                              <div key={user.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                  <div className="p-3 rounded-lg bg-[#F1EBFF] text-OxfordBlue mr-4">
                                      <FaUserPlus className="text-xl" />
                                  </div>
                                  <div className="flex-1">
                                      <h3 className="font-medium text-gray-800">{user.name}</h3>
                                      <p className="text-sm text-[#838C9D]">
                                          {user.email} • {user.role}
                                      </p>
                                  </div>
                                  <div className="text-sm text-[#838C9D] flex items-center">
                                      <FaClock className="mr-1" />
                                      <span>{formatTimeAgo(user.created_at)}</span>
                                  </div>
                              </div>
                          ))}
                          {recentUsersLimited.length === 0 && (
                              <div className="text-center py-8 text-gray-500">
                                Tidak ada data pengguna
                              </div>
                          )}
                      </div>
                      <div className="mt-4 text-right">
                          <Link to="/admin/manage-users" className="text-OxfordBlue hover:text-[#5a29d6] text-sm font-medium">
                              Lihat semua pengguna →
                          </Link>
                      </div>
                  </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;