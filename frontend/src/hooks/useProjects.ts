import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { projectsApi } from '@/api/projects';
import { Project, CreateProjectData, UpdateProjectData, ProjectStats, ApiError } from '@/types';

export const useProjects = () => {
  const queryClient = useQueryClient();

  // Get all projects query
  const projectsQuery = useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.getProjects,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Get projects with stats query
  const projectsWithStatsQuery = useQuery({
    queryKey: ['projects', 'with-stats'],
    queryFn: projectsApi.getProjectsWithStats,
    staleTime: 30 * 1000, // 30 seconds
  });

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: projectsApi.createProject,
    onSuccess: (newProject) => {
      queryClient.setQueryData(['projects'], (old: Project[] = []) => [...old, newProject]);
      queryClient.invalidateQueries({ queryKey: ['projects', 'with-stats'] });
      toast.success('Project created successfully!');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to create project');
    },
  });

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectData }) =>
      projectsApi.updateProject(id, data),
    onSuccess: (updatedProject) => {
      queryClient.setQueryData(['projects'], (old: Project[] = []) =>
        old.map((project) => (project._id === updatedProject._id ? updatedProject : project))
      );
      queryClient.setQueryData(['projects', updatedProject._id], updatedProject);
      queryClient.invalidateQueries({ queryKey: ['projects', 'with-stats'] });
      toast.success('Project updated successfully!');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to update project');
    },
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: projectsApi.deleteProject,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(['projects'], (old: Project[] = []) =>
        old.filter((project) => project._id !== deletedId)
      );
      queryClient.removeQueries({ queryKey: ['projects', deletedId] });
      queryClient.removeQueries({ queryKey: ['tasks', 'project', deletedId] });
      queryClient.invalidateQueries({ queryKey: ['projects', 'with-stats'] });
      toast.success('Project deleted successfully!');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to delete project');
    },
  });

  return {
    // Queries
    projects: projectsQuery.data || [],
    projectsWithStats: projectsWithStatsQuery.data || [],
    
    // Loading states
    isLoadingProjects: projectsQuery.isLoading,
    isLoadingProjectsWithStats: projectsWithStatsQuery.isLoading,
    
    // Error states
    projectsError: projectsQuery.error,
    projectsWithStatsError: projectsWithStatsQuery.error,
    
    // Mutations
    createProject: (data: CreateProjectData) => createProjectMutation.mutate(data),
    updateProject: (id: string, data: UpdateProjectData) => updateProjectMutation.mutate({ id, data }),
    deleteProject: (id: string) => deleteProjectMutation.mutate(id),
    
    // Mutation states
    isCreatingProject: createProjectMutation.isPending,
    isUpdatingProject: updateProjectMutation.isPending,
    isDeletingProject: deleteProjectMutation.isPending,
    
    // Mutation errors
    createProjectError: createProjectMutation.error,
    updateProjectError: updateProjectMutation.error,
    deleteProjectError: deleteProjectMutation.error,
    
    // Refetch functions
    refetchProjects: projectsQuery.refetch,
    refetchProjectsWithStats: projectsWithStatsQuery.refetch,
  };
};

export const useProject = (id: string) => {
  const queryClient = useQueryClient();

  // Get single project query
  const projectQuery = useQuery({
    queryKey: ['projects', id],
    queryFn: () => projectsApi.getProject(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Get project stats query
  const projectStatsQuery = useQuery({
    queryKey: ['projects', id, 'stats'],
    queryFn: () => projectsApi.getProjectStats(id),
    enabled: !!id,
    staleTime: 30 * 1000, // 30 seconds
  });

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: (data: UpdateProjectData) => projectsApi.updateProject(id, data),
    onSuccess: (updatedProject) => {
      queryClient.setQueryData(['projects', id], updatedProject);
      queryClient.setQueryData(['projects'], (old: Project[] = []) =>
        old.map((project) => (project._id === updatedProject._id ? updatedProject : project))
      );
      queryClient.invalidateQueries({ queryKey: ['projects', 'with-stats'] });
      toast.success('Project updated successfully!');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Failed to update project');
    },
  });

  return {
    // Data
    project: projectQuery.data,
    projectStats: projectStatsQuery.data,
    
    // Loading states
    isLoadingProject: projectQuery.isLoading,
    isLoadingProjectStats: projectStatsQuery.isLoading,
    
    // Error states
    projectError: projectQuery.error,
    projectStatsError: projectStatsQuery.error,
    
    // Mutations
    updateProject: (data: UpdateProjectData) => updateProjectMutation.mutate(data),
    
    // Mutation states
    isUpdatingProject: updateProjectMutation.isPending,
    updateProjectError: updateProjectMutation.error,
    
    // Refetch functions
    refetchProject: projectQuery.refetch,
    refetchProjectStats: projectStatsQuery.refetch,
  };
}; 