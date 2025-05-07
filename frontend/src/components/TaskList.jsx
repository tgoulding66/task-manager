import { useEffect, useCallback, useState } from 'react';
import api from '../services/api';
import { Form, Button, ListGroup, Spinner, Row, Col, Card } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons'; // Add this if you're using react-bootstrap-icons
import { useToast } from '../context/ToastContext';
import { Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';


function TaskList({ projectId, onTotalPointsChange, onCompletedPointsChange }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    dueDate: '',
    priority: 'Medium',
    notes: '',
    type: 'New Feature',
    points: 1,
    });
  
  const totalPoints = tasks.reduce((sum, task) => sum + (task.points || 0), 0);
  const completedPoints = tasks.reduce(
  (sum, task) => sum + (task.status === 'Done' ? (task.points || 0) : 0),
  0
);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { showToast } = useToast();
  const [sortOption, setSortOption] = useState('dueDate'); // default sort

  const fetchTasks = useCallback(async () => {
  try {
    setLoading(true);
    const { data } = await api.get(`/tasks?projectId=${projectId}`);
    setTasks(data);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    setError('Failed to load tasks.');
  } finally {
    setLoading(false);
  }
}, [projectId]);

  useEffect(() => {
    if (!projectId) return;
      fetchTasks();
  }, [fetchTasks, projectId]);

  useEffect(() => {
    if (onTotalPointsChange) {
      onTotalPointsChange(totalPoints);
    }
  }, [totalPoints, onTotalPointsChange]);
  
  useEffect(() => {
    if (onCompletedPointsChange) {
      onCompletedPointsChange(completedPoints);
    }
  }, [completedPoints, onCompletedPointsChange]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
  
    // Extract values and reset form immediately
    const taskToSubmit = {
      title: newTask.title,
      dueDate: newTask.dueDate || null,
      priority: newTask.priority,
      notes: newTask.notes,
      type: newTask.type,
      points: newTask.points,
      projectId,
    };
    console.log('taskToSubmit payload:', taskToSubmit);

    // Reset BEFORE fetchTasks() to avoid UI staleness
    setNewTask({ title: '', dueDate: '', priority: 'Medium', notes: '', type: 'New Feature', points: 1 });
  
    try {
      await api.post('/tasks', taskToSubmit);
      await fetchTasks();
      showToast('Task created successfully!', 'success');
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Failed to create task.');
      showToast('Failed to create task.', 'danger');
    }
  };
  

  const handleToggleComplete = async (taskId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Done' ? 'To Do' : 'Done'; 
  
      await api.put(`/tasks/${taskId}`, { status: newStatus });
  
      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
  
      showToast('Task updated successfully!', 'success');
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task.');
      showToast('Failed to update task.', 'danger');
    }
  };
  
  

  if (!projectId) return null;
    const handleDeleteTask = async (taskId) => {
        try {
          await api.delete(`/tasks/${taskId}`);
          setTasks((prev) => prev.filter((task) => task._id !== taskId));
          showToast('Task deleted successfully'); 
        } catch (err) {
          console.error('Error deleting task:', err);
          setError('Failed to delete task.');
          showToast('Failed to delete task.', 'danger');
        }
    };

  return (
    <div className="mt-5">
      <h5>Tasks</h5>

      {error && <p className="text-danger">{error}</p>}
      {loading && <Spinner animation="border" />}

      {tasks.length === 0 && !loading && (
        <p className="text-muted">No tasks yet. Add one!</p>
      )}

      <Form.Select
        size="sm"
       value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        style={{ maxWidth: '200px' }}
        className="bg-secondary text-light mb-3"
      >
        <option value="dueDate">Sort by Due Date</option>
        <option value="priority">Sort by Priority</option>
      </Form.Select>

    <h4 className="text-center mb-4">Tasks</h4>
    <div className="mx-auto" style={{ maxWidth: '700px' }}>
      <ListGroup className="mb-3">
        {[...tasks]
          .sort((a, b) => {
            if (sortOption === 'dueDate') {
              return new Date(a.dueDate || Infinity) - new Date(b.dueDate || Infinity);
            }
            if (sortOption === 'priority') {
              const priorityOrder = { High: 1, Medium: 2, Low: 3 };
              return (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4);
            }
            return 0;
          })
          .map((task) => (
          <ListGroup.Item key={task._id} className="border rounded-2 bg-secondary" style={{ minHeight: '110px' }}>
            <div className="d-flex justify-content-between align-items-start">
              <div style={{ flex: 1, minWidth: 0 }}>
                <Form.Check
                  type="checkbox"
                  label={
                    <>
                      <div
                        style={{
                          textDecoration: task.status === 'Done' ? 'line-through' : 'none',
                          color: task.status === 'Done' ? 'gray' : 'inherit',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.5rem',
                        }}
                      >
                        <Link to={`/tasks/${task._id}`} className="text-decoration-none text-dark">
                          {task.title}
                        </Link>
                      </div>
                      <div  className="mt-1" >
                        <Badge  className="me-1"
                          bg={
                            task.type === 'Bug'
                              ? 'danger'
                              : task.type === 'Enhancement'
                              ? 'info'
                              : 'primary'
                          }
                        >
                          {task.type}
                        </Badge>
                        {task.priority && (
                          <Badge  className="me-1"
                            bg={
                              task.priority === 'High' ? 'danger' :
                              task.priority === 'Medium' ? 'primary' :
                              'success'
                            }
                          >
                            {task.priority}
                          </Badge>
                        )}
                         <Badge bg="secondary">{task.points} pts</Badge>
                      </div>

                      {task.dueDate && (
                        <div style={{ marginTop: '4px', fontSize: '0.85rem', color: '#6c757d' }}>
                          Due: {new Date(task.dueDate).toLocaleDateString('en-US', {
                            timeZone: 'UTC',         //Force UTC to avoid shifting the day
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      )}
                    </>
                  }
                  checked={task.status === 'Done'}
                  onChange={() => handleToggleComplete(task._id, task.status)}
                />
              </div>
              <div>
                <Button
                    variant="outline-light"
                    size="sm"
                    onClick={() => handleDeleteTask(task._id)}
                >
                    <Trash size={14} />
                </Button>
              </div>
          </div>
          </ListGroup.Item>
      ))}
      </ListGroup>
    </div>
    <Row className="justify-content-center mb-4">
      <Col xs={12} md={8} lg={6}>
      <Card className="bg-secondary text-light shadow-sm border-0">
          <Card.Body>
            <Form onSubmit={handleAddTask}>
              <Form.Group className="mb-3">
                <Form.Label>Task Title</Form.Label>
                <Form.Control
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter task title"
                  required
                  className="bg-secondary text-light" 
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Priority</Form.Label>
                <Form.Select
                  value={newTask.priority}
                  onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                  className="bg-secondary text-light"
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
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="bg-secondary text-light"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Task Type</Form.Label>
                <Form.Select
                  value={newTask.type}
                  onChange={(e) => setNewTask((prev) => ({ ...prev, type: e.target.value }))}
                  className="bg-secondary text-light"
                >
                  <option value="New Feature">New Feature</option>
                  <option value="Enhancement">Enhancement</option>
                  <option value="Bug">Bug</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Estimated Points</Form.Label>
                <Form.Select
                  value={newTask.points}
                  onChange={(e) =>
                    setNewTask((prev) => ({ ...prev, points: parseInt(e.target.value) }))
                  }
                  className="bg-secondary text-light"
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="5">5</option>
                  <option value="8">8</option>
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="taskNotes" className="mb-3">
                <Form.Label>Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newTask.notes}
                  onChange={(e) =>
                    setNewTask((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  placeholder="Add task notes (optional)"
                  className="bg-secondary text-light"
                />
              </Form.Group>
              
              <Card.Footer className="bg-secondary border-0">
                <div className="d-flex justify-content-center">
                  <Button type="submit" variant="success" className="w-50">
                    Add Task
                  </Button>
                </div>
              </Card.Footer>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </div> 
  );
}

export default TaskList;
