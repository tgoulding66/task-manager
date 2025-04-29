import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import ProjectDetails from './pages/ProjectDetails';  
import TaskDetails from './pages/TaskDetails';

function App() {
  const { isAuthenticated, logout } = useAuth();
  return (
    <Router>
      <Nav className="me-auto">
        {!isAuthenticated ? (
          <>
            <Nav.Link as={Link} to="/login">Login</Nav.Link>
            <Nav.Link as={Link} to="/register">Register</Nav.Link>
          </>
        ) : (
          <>
            <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
            <Nav.Link onClick={logout}>Logout</Nav.Link>
          </>
        )}
      </Nav>

      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/projects/:id" element={<PrivateRoute><ProjectDetails /></PrivateRoute>} />  
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tasks/:taskId" element={<PrivateRoute><TaskDetails /></PrivateRoute>} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
