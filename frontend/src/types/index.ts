// User types
export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Project types
export interface Project {
  _id: string;
  name: string;
  description?: string;
  user: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectData {
  name: string;
  description?: string;
  dueDate?: string;
}

export interface UpdateProjectData extends Partial<CreateProjectData> {}

// Task types
export type TaskStatus = 'To Do' | 'In Progress' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskType = 'New Feature' | 'Enhancement' | 'Bug';

export interface Subtask {
  _id?: string;
  title: string;
  completed: boolean;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  type: TaskType;
  points: number;
  project: string;
  user: string;
  dueDate?: string;
  notes?: string;
  subtasks: Subtask[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  type?: TaskType;
  points?: number;
  project: string;
  dueDate?: string;
  notes?: string;
  subtasks?: Omit<Subtask, '_id'>[];
}

export interface UpdateTaskData extends Partial<CreateTaskData> {}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string>;
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Form types
export interface FormFieldError {
  message: string;
}

// Theme types
export type Theme = 'light' | 'dark';

// Filter and sort types
export interface TaskFilters {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  type?: TaskType[];
  search?: string;
}

export interface TaskSortOptions {
  field: 'createdAt' | 'dueDate' | 'priority' | 'title';
  direction: 'asc' | 'desc';
}

// Project statistics
export interface ProjectStats {
  totalTasks: number;
  completedTasks: number;
  totalPoints: number;
  completedPoints: number;
  tasksByStatus: Record<TaskStatus, number>;
  tasksByPriority: Record<TaskPriority, number>;
} 