import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';
import { Container, Card, Form, Spinner, Alert, Button, Row, Col, Badge } from 'react-bootstrap';
import { useToast } from '../context/ToastContext';

function TaskDetails() {
  const { taskId } = useParams();
  //const navigate = useNavigate();
  const { showToast } = useToast();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editedTitle, setEditedTitle] = useState('');
  const [editedPriority, setEditedPriority] = useState('Medium');
  const [editedDueDate, setEditedDueDate] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const { data } = await api.get(`/tasks/${taskId}`);
        setTask(data);
        setEditedTitle(data.title);
        setEditedPriority(data.priority || 'Medium');
        setEditedDueDate(data.dueDate ? data.dueDate.substring(0, 10) : '');
      } catch (err) {
        console.error('Error fetching task:', err);
        setError('Failed to load task.');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/tasks/${taskId}`, {
        title: editedTitle,
        priority: editedPriority,
        dueDate: editedDueDate || null,
      });
      showToast('Task updated successfully!', 'success');
      //navigate('/'); // or navigate back to project details
    } catch (err) {
      console.error('Error updating task:', err);
      showToast('Failed to update task.', 'danger');
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!task) return null;

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h3 className="mb-4 text-center">Edit Task</h3>
              <Form onSubmit={handleSave}>
                <Form.Group className="mb-3">
                  <Form.Label>Task Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Priority</Form.Label>
                  <Form.Select
                    value={editedPriority}
                    onChange={(e) => setEditedPriority(e.target.value)}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={editedDueDate}
                    onChange={(e) => setEditedDueDate(e.target.value)}
                  />
                </Form.Group>

                <div className="d-flex justify-content-between">
                  <Button type="submit" variant="success">
                    Save Changes
                  </Button>
                  <Button variant="secondary" as={Link} to="/">
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default TaskDetails;
