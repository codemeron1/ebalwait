import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { ModeToggle } from './mode-toggle';

const Layout = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
//   const { currentUser, logout, isAuthenticated } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

const handleLogout = () => {}

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="w-full flex items-center justify-between space-x-8">
              <h1 className="text-xl font-bold text-gray-900">Team Evaluator</h1>
              <div className='flex-1'></div>
              <div className='flex flex-row space-x-4'>
                <Link to="/rate" className="text-gray-700 hover:text-blue-700">Evaluate</Link>
                <Link to="/results" className="text-gray-700 hover:text-blue-700">My Evaluation Result</Link>
                <Link to="/" className="text-gray-700 hover:text-blue-700">Logout</Link>

                <ModeToggle />
              </div>
            </div>
            
            {isAuthenticated && (
              <div className="flex items-center space-x-6">
                <div className="flex space-x-4">
                  <Link 
                    to="/rate" 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === '/rate' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-700 hover:text-blue-700 hover:bg-gray-100'
                    }`}
                  >
                    Rate Team Members
                  </Link>
                  <Link 
                    to="/results" 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === '/results' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-700 hover:text-blue-700 hover:bg-gray-100'
                    }`}
                  >
                    My Results
                  </Link>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-700">
                    Welcome, {'Juan'}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;