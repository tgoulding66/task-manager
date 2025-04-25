import { useEffect, useState } from 'react';
import api from '../services/api';
import { Form, Button, ListGroup, Spinner, Row, Col } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons'; // Add this if you're using react-bootstrap-icons




function TaskList({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [highlightTaskId, setHighlightTaskId] = useState(null);


  useEffect(() => {
    if (!projectId) return;

    const fetchTasks = async () => {
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
    };

    fetchTasks();
  }, [projectId]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const { data } = await api.post('/tasks', {
        title: newTaskTitle,
        projectId,
      });
      setTasks([...tasks, data]);
      setNewTaskTitle('');
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Failed to create task.');
    }
  };

  const handleToggleComplete = async (taskId, currentStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, {
        completed: !currentStatus,
      });
      setTasks((prev) =>
        prev.map((task) =>
          task._id === taskId ? { ...task, completed: !currentStatus } : task
        )
      );
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task.');
    }
  };

  if (!projectId) return null;
    const handleDeleteTask = async (taskId) => {
        try {
        await api.delete(`/tasks/${taskId}`);
        setTasks((prev) => prev.filter((task) => task._id !== taskId));
        } catch (err) {
        console.error('Error deleting task:', err);
        setError('Failed to delete task.');
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
            setHighlightTaskId(taskId);      // ✅ ADD THIS
            setTimeout(() => setHighlightTaskId(null), 1000); // ✅ Clear after 1 second
            handleCancelEdit();
        } catch (err) {
            console.error('Error updating task title:', err);
            setError('Failed to update task.');
        }
    };
      

  return (
    <div className="mt-3">
      <h5>Tasks</h5>

      {error && <p className="text-danger">{error}</p>}
      {loading && <Spinner animation="border" />}

      {tasks.length === 0 && !loading && (
        <p className="text-muted">No tasks yet. Add one!</p>
      )}

    <ListGroup className="mb-3">
    {tasks.map((task) => (
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
                    <span
                    style={{
                        textDecoration: task.completed ? 'line-through' : 'none',
                        color: task.completed ? 'gray' : 'inherit',
                    }}
                    >
                    {task.title}
                    </span>
                }
                checked={task.completed}
                onChange={() => handleToggleComplete(task._id, task.completed)}
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

      <Form onSubmit={handleAddTask}>
        <Form.Group className="mb-2">
          <Form.Control
            type="text"
            placeholder="New task title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
        </Form.Group>
        <Button type="submit" size="sm" variant="primary">
          Add Task
        </Button>
      </Form>
    </div> 
  );
}

export default TaskList;
