import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';
import TaskList from '../components/TaskList';
//import { Container, Button } from 'react-bootstrap';
import { useToast } from '../context/ToastContext';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
//import { format } from 'date-fns';

function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const { showToast } = useToast();  
  const [editedDueDate, setEditedDueDate] = useState('');
  const [totalPoints, setTotalPoints] = useState(0);
  const [completedPoints, setCompletedPoints] = useState(0);

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
    setEditedDueDate(project.dueDate ? project.dueDate.split('T')[0] : '');

  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  
  const handleSaveEdit = async () => {
    try {
      const { data } = await api.put(`/projects/${project._id}`, {
        name: editedName,
        description: editedDescription,
        dueDate: editedDueDate ? new Date(editedDueDate) : null,
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
    <Container className="min-vh-100 d-flex flex-column justify-content-start">
      <div className="d-flex justify-content-left mb-3">
        <Button
          as={Link}
          to="/"
          variant="secondary"
          size='sm'
        >
          ← Back to Dashboard
        </Button>
      </div>

      {isEditing ? (
      
        <Row className="justify-content-center mb-4">
          <Col xs={12} md={8} lg={6}>
            <Card className="shadow-sm h-100 rounded-3 border-1 bg-secondary text-light">
              <Card.Body>
                <Form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }}>
                  <Form.Group className="mb-3">
                    <Form.Label>Project Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      placeholder="Enter project name"
                      className="bg-secondary text-light"
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
                      className="bg-secondary text-light"
                    />
                  </Form.Group>

                  <Form.Group className="mb-2">
                    <Form.Label>Due Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={editedDueDate}
                      onChange={(e) => setEditedDueDate(e.target.value)}
                      className="bg-secondary text-light"
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
          <p className="text-center fw-bold text-light mb-3">
          Total Points: {totalPoints} ({completedPoints} pts completed)
          </p>

          <div className="text-center mb-3">
            <Button variant="warning" size="sm" onClick={handleStartEdit}>
              Edit Project
            </Button>
          </div>
        </>
      )}

      <TaskList projectId={project._id} onTotalPointsChange={setTotalPoints} onCompletedPointsChange={setCompletedPoints} />
    </Container>
  );
}

export default ProjectDetails;
