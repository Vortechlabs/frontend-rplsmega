import React, { useEffect, useState } from 'react';
import { 
  FaProjectDiagram, 
  FaPlus, 
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import apiClient from '../../../../services/GlobalApi';
import Sidebar from '../../../../components/Sidebar';
import ProjectList from './ProjectList';
import Loader from '../../../../components/Loader';

function ManageProject() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 10;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/projects');
        setProjects(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setLoading(false);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load projects',
          icon: 'error',
          confirmButtonColor: '#3b82f6'
        });
      }
    };

    fetchProjects();
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedProjects = React.useMemo(() => {
    let sortableItems = [...projects];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const aValue = sortConfig.key.includes('.') 
          ? sortConfig.key.split('.').reduce((o, i) => o[i], a)
          : a[sortConfig.key];
        const bValue = sortConfig.key.includes('.') 
          ? sortConfig.key.split('.').reduce((o, i) => o[i], b)
          : b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [projects, sortConfig]);

  const filteredProjects = sortedProjects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (project.category && project.category.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  const deleteProject = async (projectId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3b82f6',
        cancelButtonColor: '#ef4444',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        await apiClient.delete(`/admin/projects/${projectId}`);
        setProjects(projects.filter((project) => project.id !== projectId));
        toast.success('Project deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="ml-1 opacity-30" />;
    return sortConfig.direction === 'asc' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
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
        theme="light"
      />

      <Sidebar />
      
      <div className="flex-1 mt-16 md:mt-0 md:ml-[290px]">
        <div className="p-6 md:p-8 min-h-screen">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-OxfordBlue/10 text-OxfordBlue">
                <FaProjectDiagram className="text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Kelola Proyek</h1>
                <p className="text-gray-600">Lihat dan kelola semua proyek pengguna</p>
              </div>
            </div>
            
            <Link 
              to='/admin/upload-projects'
              className="flex  hover:scale-105 items-center justify-center bg-gradient-to-r from-GoldenYellow-Dark to-GoldenYellow/90 text-white px-4 py-3 rounded-lg hover:from-GoldenYellow/90 hover:to-GoldenYellow-Dark transition-all shadow-md"
            >
              <FaPlus className="mr-2" />
              Tambah Proyek
            </Link>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Jelajahi proyek..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-OxfordBlue focus:border-OxfordBlue"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button 
                  onClick={() => handleSort('title')}
                  className="flex items-center text-sm text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg"
                >
                  Urutkan Judul
                  {renderSortIcon('title')}
                </button>
                <button 
                  onClick={() => handleSort('category.name')}
                  className="flex items-center text-sm text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg"
                >
                  Urutkan ketegori
                  {renderSortIcon('category.name')}
                </button>
              </div>
            </div>
          </div>

          {/* Projects List */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            {loading ? (
              <>
              <Loader />
              </>
            ) : (
              <ProjectList 
                projects={currentProjects}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                onDelete={deleteProject}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageProject;