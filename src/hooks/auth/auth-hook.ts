import axios, { AxiosError } from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';

type RegisterInput = {
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

// Register a new user
export const useRegister = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: RegisterInput) => 
      api.post('/auth/register', userData).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] }); 
      toast.success("Registration successful");
    }, onError: (error: AxiosError) => {
      if(error.response?.status === 400) {
        return toast.error("Invalid credentials")
      }
      if(error.response?.status === 401) {
        return toast.error("Email already exists")
      }
      return toast.error("An error occurred during registration")
    }
  });
};

// Log in an existing user
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (credentials: LoginInput) => 
      api.post('/auth/login', credentials).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
     toast.success("Login successful");
    }, onError: (error: AxiosError) => {
      console.log(error.response?.status)
      if(error.response?.status === 400) {
        return toast.error("Invalid credentials")
      }
      if(error.response?.status === 401) {
      return toast.error("Please verify your email and password")
      }
      return toast.error("An error occurred during login")
    }
  });
};

// Log out the current user
export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => api.post('/auth/logout').then(res => res.data),
    onSuccess: () => {
    toast.success("Logout successful"),
      queryClient.clear(); 
    },
    onError: (error: AxiosError) => {
      if(error.response?.status === 401) {
        return toast.error("You are already logged out")
      }
      return toast.error("An error occurred during logout")}
  });
};

// Get current login user
export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => api.get(`/auth/me`, { withCredentials: true }).then((res) => res.data),
  });
};