import { Link, useLocation } from 'react-router-dom';
import { 
  X, 
  Home, 
  Briefcase, 
  Users, 
  FileText, 
  BarChart, 
  Settings,
  MessageSquare,
  User
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar = ({ open, onClose }: SidebarProps) => {
  const location = useLocation();
  const { user } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const isCandidate = user?.role === 'candidate';
  const isRecruiter = user?.role === 'recruiter';
  const isAdmin = user?.role === 'admin';

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {open && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:fixed top-0 left-0 z-30 h-full w-64 transform transition-transform duration-200 ease-in-out bg-white shadow-lg lg:translate-x-0 lg:pt-16 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 lg:hidden">
          <span className="text-xl font-bold text-blue-700">TalentQuiz</span>
          <button 
            className="p-2 rounded-md text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-5 px-4 space-y-1">
          <Link
            to="/"
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
              isActive('/') 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => onClose()}
          >
            <Home className="h-5 w-5 mr-3" />
            Dashboard
          </Link>

          <Link
            to="/jobs"
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
              isActive('/jobs') 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => onClose()}
          >
            <Briefcase className="h-5 w-5 mr-3" />
            Job Offers
          </Link>

          {isCandidate && (
            <Link
              to="/profile"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                isActive('/profile') 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => onClose()}
            >
              <User className="h-5 w-5 mr-3" />
              My Profile
            </Link>
          )}

          {(isRecruiter || isAdmin) && (
            <>
              <Link
                to="/recruiter"
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  isActive('/recruiter') && !isActive('/recruiter/candidates') && !isActive('/recruiter/tests') && !isActive('/recruiter/profile')
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => onClose()}
              >
                <BarChart className="h-5 w-5 mr-3" />
                Dashboard
              </Link>

              <Link
                to="/recruiter/profile"
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  isActive('/recruiter/profile')
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => onClose()}
              >
                <User className="h-5 w-5 mr-3" />
                My Profile
              </Link>

              <Link
                to="/recruiter/candidates"
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  isActive('/recruiter/candidates')
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => onClose()}
              >
                <Users className="h-5 w-5 mr-3" />
                Candidates
              </Link>
              
              <Link
                to="/recruiter/tests"
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  isActive('/recruiter/tests') 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => onClose()}
              >
                <FileText className="h-5 w-5 mr-3" />
                Test Management
              </Link>
            </>
          )}

          <div className="pt-4 mt-5 border-t border-gray-200">
            <Link
              to="#"
              className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
              onClick={() => onClose()}
            >
              <MessageSquare className="h-5 w-5 mr-3" />
              Support
            </Link>
            
            <Link
              to="#"
              className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
              onClick={() => onClose()}
            >
              <Settings className="h-5 w-5 mr-3" />
              Settings
            </Link>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;