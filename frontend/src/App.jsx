import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import ProjectDetails from './pages/ProjectDetails';  
import TaskDetails from './pages/TaskDetails';

function App() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="bg-dark text-light min-vh-100">
      <Router>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand as={Link} to="/">My Project & Task Manager</Navbar.Brand>
            <Nav className="ms-auto">
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
          </Container>
        </Navbar>

        <Container className="mt-4">
          <Routes>
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/projects/:id" element={<PrivateRoute><ProjectDetails /></PrivateRoute>} />
            <Route path="/tasks/:taskId" element={<PrivateRoute><TaskDetails /></PrivateRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Container>
      </Router>
    </div>
  );
}


export default App;
