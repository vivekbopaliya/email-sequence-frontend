// File: hooks/workflow/lead-source-hook.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import { AxiosError } from 'axios';

type Contact = {
  name: string;
  email: string;
};

type LeadSource = {
  id?: string;
  name: string;
  contacts: Contact[];
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
};

// Fetch all lead sources
export const useGetLeadSources = () => {
  return useQuery({
    queryKey: ['leadSources'],
    queryFn: () => api.get('/lead-source/getAll').then((res) => res.data),
  });
};

// Create a new lead source
export const useCreateLeadSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (leadSourceData: Omit<LeadSource, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) =>
      api.post('/lead-source/create', leadSourceData).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leadSources'] });
      toast.success('Lead source created successfully');
    },
    onError: (error: AxiosError) => {
      if(error.response?.status=== 400 ){
        return toast.error("Atleast one contact and name of lead source are required.")
    }
      toast.error('Error creating lead source');
      console.error(error);
    },
  });
};

// Update a lead source
export const useUpdateLeadSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...leadSourceData }: Omit<LeadSource, 'userId' | 'createdAt' | 'updatedAt'> & { id: string }) =>
      api.put(`/lead-source/update/${id}`, leadSourceData).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leadSources'] });
      
      toast.success('Lead source updated successfully');
    },
    onError: (error: AxiosError) => {
      if(error.response?.status=== 400 ){
        return toast.error("Atleast one contact and name of lead source are required.")
    }
      toast.error('Error updating lead source');
      console.error(error);
    },
  });
};

// Delete a lead source
export const useDeleteLeadSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/lead-source/delete/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leadSources'] });
      toast.success('Lead source deleted successfully');
    },
    onError: (error: AxiosError) => {
      if(error.response?.status=== 404 ){
        return toast.error("The lead source doesn't exist (anymore).")
    }
      toast.error('Error deleting lead source');
      console.error(error);
    },
  });
};