// File: hooks/workflow/email-template-hook.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import { AxiosError } from 'axios';

type EmailTemplate = {
  id?: string;
  name: string;
  subject: string;
  body: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
};

// Fetch all email templates
export const useGetEmailTemplates = () => {
  return useQuery({
    queryKey: ['emailTemplates'],
    queryFn: () => api.get('/email-template/getAll').then((res) => res.data),
  });
};

// Create a new email template
export const useCreateEmailTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (templateData: Omit<EmailTemplate, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) =>
      api.post('/email-template/create', templateData).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emailTemplates'] });
      toast.success('Email template created successfully');
    },
    onError: (error:AxiosError) => {
        if(error.response?.status=== 400 ){
            return toast.error("Name of template, Subject and Body are required.")
        }
      toast.error('Error creating email template!');
      console.error(error);
    },
  });
};

// Update an email template
export const useUpdateEmailTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...templateData }: Omit<EmailTemplate, 'userId' | 'createdAt' | 'updatedAt'> & { id: string }) =>
      api.put(`/email-template/update/${id}`, templateData).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emailTemplates'] });
      toast.success('Email template updated successfully');
    },
    onError: (error: AxiosError) => {
        if(error.response?.status=== 400 ){
            return toast.error("Name of template, Subject and Body are required.")
        }
      toast.error('Error updating email template');
      console.error(error);
    },
  });
};

// Delete an email template
export const useDeleteEmailTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/email-template/delete/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emailTemplates'] });
      toast.success('Email template deleted successfully');
    },
    onError: (error: AxiosError) => {
        if(error.response?.status=== 404 ){
            return toast.error("The email template doesn't exist (anymore).")
        }
      toast.error('Error deleting email template');
      console.error(error);
    },
  });
};