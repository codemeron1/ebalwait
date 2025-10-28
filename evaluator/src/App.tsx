import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './contexts/AuthContext';
// import { DataProvider } from './contexts/DataContext';
import Layout from './components/Layout';
import LoginView from './components/LoginView';
import RatingView from './components/RatingView';
import ResultsView from './components/ResultsView';
import RegisterView from './components/RegisterView';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LoginView />} />
            <Route path="rate" element={<RatingView />} />
            <Route path="results" element={<ResultsView />} />
            <Route path='register' element={<RegisterView/>} />
          </Route>
        </Routes>
      </div>
    </Router>
  )
}

export default App
