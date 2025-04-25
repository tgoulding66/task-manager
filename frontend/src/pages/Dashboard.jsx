import { useEffect, useState } from 'react';
import api from '../services/api';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { Form, Button } from 'react-bootstrap';
import TaskList from '../components/TaskList';  
import { Trash } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';  

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState(''); 

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.get('/projects');
        setProjects(data);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects.');
      }
    };

    fetchProjects();
  }, []);

    const handleDeleteProject = async (projectId) => {
      if (!window.confirm('Are you sure you want to delete this project?')) return;
    
      try {
        await api.delete(`/projects/${projectId}`);
        setProjects((prev) => prev.filter((project) => project._id !== projectId));
      } catch (err) {
        console.error('Error deleting project:', err);
        alert('Failed to delete project.');
      }
    };
    
  return (
    <Container className="mt-4">
      <h2 className="mb-4">Your Projects</h2>
      {error && <p className="text-danger">{error}</p>}
      
      <Form
        onSubmit={async (e) => {
            e.preventDefault();
            if (!newProjectName) return;

            try {
            const { data } = await api.post('/projects', {
                name: newProjectName,
                description: newProjectDesc,
            });
            setProjects([...projects, data]);
            setNewProjectName('');
            setNewProjectDesc('');
            } catch (err) {
            console.error('Create project error:', err);
            setError('Failed to create project.');
            }
        }}
        className="mb-4"
        >
        <Form.Group className="mb-2">
            <Form.Label>Project Name</Form.Label>
            <Form.Control
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="Enter project name"
            required
            />
        </Form.Group>

        <Form.Group className="mb-2">
            <Form.Label>Description</Form.Label>
            <Form.Control
            type="text"
            value={newProjectDesc}
            onChange={(e) => setNewProjectDesc(e.target.value)}
            placeholder="Optional description"
            />
        </Form.Group>

  <Button type="submit" variant="success">Add Project</Button>
</Form>


      <Row>
        {projects.map((project) => (
          <Col md={4} key={project._id} className="mb-4">
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <Card.Title>
                    <Link to={`/projects/${project._id}`} className="text-decoration-none">
                      {project.name}
                    </Link>
                  </Card.Title>

                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteProject(project._id)}
                  >
                    <Trash size={16} />
                  </Button>
                </div>

                <Card.Text>
                  {project.description || 'No description provided.'}
                </Card.Text>

                {/* <TaskList projectId={project._id} /> */}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Dashboard;
