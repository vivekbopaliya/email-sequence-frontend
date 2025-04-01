import axios, { AxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: 'http://localhost:3000', 
  withCredentials: true 
});

type RegisterInput = {
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

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

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => api.post('/auth/logout').then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
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

