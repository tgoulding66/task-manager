import { useEffect, useCallback, useState } from 'react';
import api from '../services/api';
import { Form, Button, ListGroup, Spinner, Row, Col, Card } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons'; // Add this if you're using react-bootstrap-icons
import { useToast } from '../context/ToastContext';
import { Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
//import { format } from 'date-fns';


function TaskList({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    dueDate: '',
    priority: 'Medium',
    notes: '',
    });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [highlightTaskId, setHighlightTaskId] = useState(null);
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

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
  
    // Extract values and reset form immediately
    const taskToSubmit = {
      title: newTask.title,
      dueDate: newTask.dueDate || null,
      priority: newTask.priority,
      notes: newTask.notes,
      projectId,
    };
  
    // ✅ Reset BEFORE fetchTasks() to avoid UI staleness
    setNewTask({ title: '', dueDate: '', priority: 'Medium', notes: '' });
  
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
      const newStatus = currentStatus === 'Done' ? 'To Do' : 'Done'; // ✅ Use Done, not Completed
  
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

    const handleStartEdit = (task) => {
        setEditTaskId(task._id);
        setEditTaskTitle(task.title);
        };
        
        const handleCancelEdit = () => {
        setEditTaskId(null);
        setEditTaskTitle('');
        };
        
        const handleSaveEdit = async (taskId) => {
        try {
            await api.put(`/tasks/${taskId}`, { title: editTaskTitle });
            setTasks((prev) =>
              prev.map((task) =>
                task._id === taskId ? { ...task, title: editTaskTitle } : task
              )
            );
            showToast('Task updated successfully!', 'success');
            setHighlightTaskId(taskId);      // ✅ ADD THIS
            setTimeout(() => setHighlightTaskId(null), 1000); // ✅ Clear after 1 second
            handleCancelEdit();
        } catch (err) {
            console.error('Error updating task title:', err);
            setError('Failed to update task.');
            showToast('Failed to update task.', 'danger');
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
        className="mb-3"
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        style={{ maxWidth: '200px' }}
      >
        <option value="dueDate">Sort by Due Date</option>
        <option value="priority">Sort by Priority</option>
      </Form.Select>

    <h4 className="text-center mb-4">Tasks</h4>
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

        <ListGroup.Item key={task._id} variant={highlightTaskId === task._id ? 'success' : undefined}>
        <Row className="align-items-center">
            <Col xs={8}>
            {editTaskId === task._id ? (
                <Form.Control
                type="text"
                size="sm"
                value={editTaskTitle}
                onChange={(e) => setEditTaskTitle(e.target.value)}
                />
            ) : (
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
                      <Link to={`/tasks/${task._id}`} className="text-decoration-none">
                        {task.title}
                      </Link>

                      {task.priority && (
                        <Badge
                          bg={
                            task.priority === 'High' ? 'danger' :
                            task.priority === 'Medium' ? 'primary' :
                            'success'
                          }
                        >
                          {task.priority}
                        </Badge>
                      )}
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
            
            )}
            </Col>

            <Col xs={4} className="text-end">
            {editTaskId === task._id ? (
                <>
                <Button
                    size="sm"
                    variant="success"
                    className="me-1"
                    onClick={() => handleSaveEdit(task._id)}
                >
                    Save
                </Button>
                <Button
                    size="sm"
                    variant="secondary"
                    className="me-1"
                    onClick={handleCancelEdit}
                >
                    Cancel
                </Button>
                </>
            ) : (
                <>
                <Button
                    variant="warning"
                    size="sm"
                    className="me-1"
                    onClick={() => handleStartEdit(task)}
                >
                    Edit
                </Button>
                <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteTask(task._id)}
                >
                    <Trash />
                </Button>
                </>
            )}
            </Col>
        </Row>
        </ListGroup.Item>
    ))}
    </ListGroup>

    <Row className="justify-content-center mb-4">
      <Col xs={12} md={8} lg={6}>
        <Card className="shadow-sm">
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
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Due Date</Form.Label>
                <Form.Control
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Priority</Form.Label>
                <Form.Select
                  value={newTask.priority}
                  onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
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
                />
              </Form.Group>

              <Button type="submit" variant="success" className="w-100">
                Add Task
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </div> 
  );
}

export default TaskList;
