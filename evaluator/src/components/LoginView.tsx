import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import { useData } from '../contexts/DataContext';

const LoginView = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  // const { login, isAuthenticated } = useAuth();
  // const { getUserById, users } = useData();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate('/rate');
  //   }
  // }, [isAuthenticated, navigate]);

  // const handleLogin = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError('');

  //   // Find user by email (in real app, this would be proper authentication)
  //   const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
  //   if (user) {
  //     login(user);
  //     navigate('/rate');
  //   } else {
  //     setError('User not found. Please check your email address.');
  //   }
  // };

  // const handleDemoLogin = (userId: string) => {
  //   const user = getUserById(userId);
  //   if (user) {
  //     login(user);
  //     navigate('/rate');
  //   }
  // };

  const handleLogin = () => {
    navigate('/rate');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.196-2.196M17 20H7m10 0v-2c0-5.523-4.477-10-10-10s-10 4.477-10 10v2m10 0H7m0 0v2a3 3 0 11-6 0v-2m6 0V18a3 3 0 001-2.236M7 20H2v-2a3 3 0 015.196-2.196" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Team Evaluation System
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to evaluate your team members
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Sign in
            </button>
            {/* <a
              href='/register'
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Register
            </a> */}
          </div>
        </form>

        {/* Demo Login Section */}
        {/* <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600 mb-4">
            Demo Accounts (Click to login)
          </p>
          <div className="space-y-2">
            {users.slice(0, 3).map(user => (
              <button
                key={user.id}
                onClick={() => handleDemoLogin(user.id)}
                className="w-full text-left px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <div className="font-medium text-gray-900">{user.name}</div>
                <div className="text-gray-500">{user.email}</div>
              </button>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default LoginView;