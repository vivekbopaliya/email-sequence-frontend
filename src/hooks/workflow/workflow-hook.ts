import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';


type Flow = {
  id?: string;
  name: string;
  nodes: any[];
  edges: any[];
};

// Save Workflow (without scheduling)
export const useSaveFlow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (flowData: Flow) => api.post('/workflow/save', flowData).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flows'] });
      toast.success('Workflow saved successfully');
    },
    onError: (error) => {
      toast.error('Error saving workflow');
      console.error(error);
    },
  });
};

// Save & Start Workflow
export const useSaveAndStartFlow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (flowData: Flow) => api.post('/workflow/save-and-start', flowData).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flows'] });
      toast.success('Workflow saved and scheduler started successfully');
    },
    onError: (error) => {
      toast.error('Error saving and starting workflow');
      console.error(error);
    },
  });
};

// Get All Flows
export const useGetFlows = () => {
  return useQuery({
    queryKey: ['flows'],
    queryFn: () => api.get('/workflow/getAll', { withCredentials: true }).then((res) => res.data),
  });
};

// Get One Flow
export const useGetFlow = (id: string) => {
  return useQuery({
    queryKey: ['flow', id],
    queryFn: () => api.get(`/workflow/get/${id}`, { withCredentials: true }).then((res) => res.data),
    enabled: !!id,
  });
};

// Update Workflow (without rescheduling)
export const useUpdateFlow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Flow }) =>
      api.patch(`/workflow/update/${id}`, data, { withCredentials: true }).then((res) => res.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['flows'] });
      queryClient.invalidateQueries({ queryKey: ['flow', variables.id] });
      toast.success('Workflow updated successfully');
    },
    onError: (error) => {
      toast.error('Error updating workflow');
      console.error(error);
    },
  });
};

// Update & Start Workflow
export const useUpdateAndStartFlow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Flow }) =>
      api.patch(`/workflow/update-and-start/${id}`, data, { withCredentials: true }).then((res) => res.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['flows'] });
      queryClient.invalidateQueries({ queryKey: ['flow', variables.id] });
      toast.success('Workflow updated and scheduler started successfully');
    },
    onError: (error) => {
      toast.error('Error updating and starting workflow');
      console.error(error);
    },
  });
};

// Start/Restart Scheduler
export const useStartScheduler = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      api.post(`/workflow/start-scheduler/${id}`, {}, { withCredentials: true }).then((res) => res.data),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['flows'] });
      queryClient.invalidateQueries({ queryKey: ['flow', id] });
      toast.success('Scheduler started successfully');
    },
    onError: (error) => {
      toast.error('Error starting scheduler');
      console.error(error);
    },
  });
};

// Stop Scheduler
export const useStopScheduler = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      api.post(`/workflow/stop-scheduler/${id}`, {}, { withCredentials: true }).then((res) => res.data),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['flows'] });
      queryClient.invalidateQueries({ queryKey: ['flow', id] });
      toast.success('Scheduler stopped successfully');
    },
    onError: (error) => {
      toast.error('Error stoping scheduler');
      console.error(error);
    },
  });
};

// Delete Flow
export const useDeleteFlow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/workflow/delete/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flows'] });
      toast.success('Workflow deleted successfully');
    },
    onError: (error) => {
      toast.error('Error deleting workflow');
      console.error(error);
    },
  });
};