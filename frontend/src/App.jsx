import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Signup from './pages/signup';
import ProtectedRoute from './routes/ProtectedRoute';


function App() {
  
  return (
    <Routes>
      <Route path = "/login" element= {<Login />} />
      <Route path = "/signup" element= {<Signup />} />

      <Route path = "/dashboard" element = {
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;