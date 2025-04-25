import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';
import TaskList from '../components/TaskList';
import { Container, Button } from 'react-bootstrap';

function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');


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
    } catch (err) {
      console.error('Error updating project:', err);
      setError('Failed to update project.');
    }
  };
  

  return (
    <Container className="mt-4">
      <Button as={Link} to="/" variant="secondary" className="mb-4">
        ← Back to Dashboard
      </Button>

      {isEditing ? (
        <>
          <input
            type="text"
            className="form-control mb-2"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
          />
          <textarea
            className="form-control mb-2"
            rows="3"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
          />
          <div className="mb-3">
            <Button variant="success" size="sm" className="me-2" onClick={handleSaveEdit}>
              Save
            </Button>
            <Button variant="secondary" size="sm" onClick={handleCancelEdit}>
              Cancel
            </Button>
          </div>
        </>
      ) : (
        <>
          <h2>{project.name}</h2>
          <p>{project.description || 'No description provided.'}</p>
          <Button variant="warning" size="sm" className="mb-3" onClick={handleStartEdit}>
            Edit Project
          </Button>
        </>
      )}


      <TaskList projectId={project._id} />
    </Container>
  );
}

export default ProjectDetails;
