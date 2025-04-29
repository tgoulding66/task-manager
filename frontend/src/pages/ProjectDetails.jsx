import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';
import TaskList from '../components/TaskList';
//import { Container, Button } from 'react-bootstrap';
import { useToast } from '../context/ToastContext';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';


function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const { showToast } = useToast();  

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await api.get(`/projects/${id}`);
        setProject(data);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project.');
      }
    };

    fetchProject();
  }, [id]);

  if (error) return <p className="text-danger">{error}</p>;
  if (!project) return <p>Loading...</p>;

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditedName(project.name);
    setEditedDescription(project.description || '');
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  
  const handleSaveEdit = async () => {
    try {
      const { data } = await api.put(`/projects/${project._id}`, {
        name: editedName,
        description: editedDescription,
      });
  
      setProject(data);
      setIsEditing(false);
      showToast('Project updated successfully!', 'success');
    } catch (err) {
      console.error('Error updating project:', err);
      setError('Failed to update project.');
      showToast('Failed to update project.', 'danger');
    }
  };
  

  return (
    <Container className="mt-4">
      <Button as={Link} to="/" variant="secondary" className="mb-4">
        ← Back to Dashboard
      </Button>

      {isEditing ? (
      
        <Row className="justify-content-center mb-4">
          <Col xs={12} md={8} lg={6}>
            <Card className="shadow-sm">
              <Card.Body>
                <Form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }}>
                  <Form.Group className="mb-3">
                    <Form.Label>Project Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      placeholder="Enter project name"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      placeholder="Optional description"
                      style={{ resize: 'vertical' }}
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-between">
                    <Button variant="success" type="submit">
                      Save
                    </Button>
                    <Button variant="secondary" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
       
      ) : (
        <>
          <h2 className="text-center">{project.name}</h2>
          <p className="text-center text-muted">{project.description || 'No description provided.'}</p>
          <div className="text-center mb-3">
            <Button variant="warning" size="sm" onClick={handleStartEdit}>
              Edit Project
            </Button>
          </div>
        </>
      )}



      <TaskList projectId={project._id} />
    </Container>
  );
}

export default ProjectDetails;
