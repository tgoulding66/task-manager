import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';
import { Container, Card, Form, Spinner, Alert, Button, Row, Col, Badge } from 'react-bootstrap';
import { useToast } from '../context/ToastContext';

function TaskDetails() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editedTitle, setEditedTitle] = useState('');
  const [editedPriority, setEditedPriority] = useState('Medium');
  const [editedDueDate, setEditedDueDate] = useState('');
  const [editedNotes, setEditedNotes] = useState('');
  const [projectId, setProjectId] = useState('');
  const [newSubtask, setNewSubtask] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const { data } = await api.get(`/tasks/${taskId}`);
        setTask(data);
        setEditedTitle(data.title);
        setEditedPriority(data.priority || 'Medium');
        setEditedDueDate(data.dueDate?.split('T')[0] || '');
        setEditedNotes(data.notes || '');
        setProjectId(data.project);
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
        notes: editedNotes,
      });
      showToast('Task updated successfully!', 'success');
      //navigate('/'); // or navigate back to project details
    } catch (err) {
      console.error('Error updating task:', err);
      showToast('Failed to update task.', 'danger');
    }
  };

  const handleToggleSubtask = (index) => {
    const updated = [...task.subtasks];
    updated[index].completed = !updated[index].completed;
    setTask({ ...task, subtasks: updated });
  
    api.put(`/tasks/${taskId}`, { subtasks: updated })
      .then(() => showToast('Subtask updated!', 'success'))
      .catch(() => showToast('Failed to update subtask', 'danger'));
  };
  

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!task) return null;

  return (
    <Container className="mt-4">
      {projectId && (
        <Button
          variant="secondary"
          className="mb-3"
          onClick={() => navigate(`/projects/${projectId}`)}
        >
          ← Back to Project
        </Button>
      )}

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

                  <Form.Group className="mb-3">
                    <Form.Label>Notes</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      value={editedNotes}
                      onChange={(e) => setEditedNotes(e.target.value)}
                      placeholder="Add detailed notes about this task..."
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

                {/* ✅ Subtask List Display */}
                <hr />
                <h5 className="mt-4">Subtasks</h5>

                <ul className="list-unstyled">
                  {task.subtasks && task.subtasks.map((sub, index) => (
                    <li key={index}>
                      <Form.Check
                        type="checkbox"
                        label={sub.title}
                        checked={sub.completed}
                        onChange={() => handleToggleSubtask(index)}
                      />
                    </li>
                  ))}
                </ul>

                {/* ✅ Subtask Add Form */}
                <Form
                  className="mt-3 d-flex"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newSubtask.trim()) return;

                    const updated = [
                      ...task.subtasks,
                      { title: newSubtask, completed: false },
                    ];
                    setTask({ ...task, subtasks: updated });
                    setNewSubtask('');

                    api.put(`/tasks/${taskId}`, { subtasks: updated })
                      .then(() => showToast('Subtask added!', 'success'))
                      .catch(() => showToast('Failed to add subtask', 'danger'));
                  }}
                >
                  <Form.Control
                    type="text"
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    placeholder="Add a subtask"
                    className="me-2"
                  />
                  <Button type="submit" variant="primary" size="sm">Add</Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

    </Container>
  );
}

export default TaskDetails;
