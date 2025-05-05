import { useEffect, useState } from 'react';
import api from '../services/api';
//import TaskList from '../components/TaskList';  
import { Trash } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';  
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';


function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState(''); 
  const [newProjectDueDate, setNewProjectDueDate] = useState('');
  const [projectPoints, setProjectPoints] = useState({});

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

  useEffect(() => {
    const fetchPointsForProjects = async () => {
      const updatedPoints = {};
  
      for (const project of projects) {
        try {
          const { data } = await api.get(`/projects/${project._id}/points`);
          updatedPoints[project._id] = {
            totalPoints: data.totalPoints,
            completedPoints: data.completedPoints,
          };
        } catch (err) {
          console.error(`Error fetching points for project ${project._id}:`, err);
          updatedPoints[project._id] = { totalPoints: 0, completedPoints: 0 }; // fallback
        }
      }
  
      setProjectPoints(updatedPoints);
    };
  
    if (projects.length > 0) {
      fetchPointsForProjects();
    }
  }, [projects]);
  

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
      <h1 className="text-center mb-4">Your Projects</h1>
      <hr className="mb-4" />
      {error && <p className="text-danger">{error}</p>}
      
      <Row className="justify-content-center mb-4">
       <Col xs={12} md={8} lg={6}>
        <Card className="mb-4 shadow-sm bg-secondary text-light">
          <Card.Body>
            <Form
              onSubmit={async (e) => {
                  e.preventDefault();
                  if (!newProjectName) return;

                  try {
                  const { data } = await api.post('/projects', {
                      name: newProjectName,
                      description: newProjectDesc,
                      dueDate: newProjectDueDate || null,
                  });
                  setProjects([...projects, data]);
                  setNewProjectName('');
                  setNewProjectDesc('');
                  setNewProjectDueDate('');
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
                  required
                  placeholder="Enter project name"
                  className="bg-secondary text-light"
                  />
              </Form.Group>

              <Form.Group className="mb-2">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newProjectDesc}
                    onChange={(e) => setNewProjectDesc(e.target.value)}
                    placeholder="Optional project description"
                    style={{ resize: 'vertical' }} 
                    className="bg-secondary text-light"
                  />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Due Date</Form.Label>
                <Form.Control
                  type="date"
                  value={newProjectDueDate}
                  onChange={(e) => {
                    setNewProjectDueDate(e.target.value);
                  }}
                  className="bg-secondary text-light"
                />
              </Form.Group>


              <Button type="submit" variant="success">Add Project</Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
      </Row>

      <Row xs={1} md={2} lg={3} className="g-4">
        {projects.map((project) => (
          <Col key={project._id}>
            <Card className="shadow-sm h-100 rounded-3 border-1 bg-secondary text-light">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <Card.Title  className="mb-2">
                    <Link to={`/projects/${project._id}`} className="text-decoration-none text-dark">
                      {project.name}
                    </Link>
                  </Card.Title>

                  <Button
                    variant="outline-light"
                    size="sm"
                    onClick={() => handleDeleteProject(project._id)}
                  >
                    <Trash size={14} />
                  </Button>
                </div>

                <Card.Text className="mb-0 text-truncate">
                  <span
                    style={{
                      display: 'inline-block',
                      maxWidth: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {project.description || 'No description provided.'}
                  </span>

                  {project.dueDate && (
                    <span className="text-muted small d-block mt-1" >
                      Due: {new Date(project.dueDate).toLocaleDateString('en-US', {
                          timeZone: 'UTC',         //Force UTC to avoid shifting the day
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                    </span>
                  )}
                   <span className="text-muted small d-block mt-1" >
                   Points: {projectPoints[project._id]?.completedPoints ?? 0} / {projectPoints[project._id]?.totalPoints ?? 0}
                   </span>
                </Card.Text>
             </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Dashboard;
