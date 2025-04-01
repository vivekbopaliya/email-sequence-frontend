import { useNavigate } from "react-router-dom";
import { useLogin, useRegister } from "../../hooks/auth/auth-hook";
import { useState } from "react";
import { Input } from '../../components/ui/input';
import { CardContent } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';

export default function AuthForm () {
    const navigate = useNavigate();
    const {mutateAsync: registerUser, isPending: isUserRegistering} = useRegister();
    const {mutateAsync: loginUser, isPending: isUserLoging} = useLogin();
    
    const [registerData, setRegisterData] = useState({
      name: '',
      email: '',
      password: '',
    });
    
    const [loginData, setLoginData] = useState({
      email: '',
      password: '',
    });
  
    const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await registerUser(registerData);
        navigate('/dashboard');
      } catch (error) {
        console.error('Registration failed:', error);
      }
    };
  
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await loginUser(loginData);
        navigate('/dashboard');
      } catch (error) {
        console.error('Login failed:', error);
      }
    };
  
    return  <CardContent className="pt-4">
    <Tabs defaultValue="register" >
      <TabsList className="grid w-full  grid-cols-2 mb-6 bg-gray-100 p-1 rounded-lg">
       
        <TabsTrigger 
          value="register" 
          className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all cursor-pointer"
        >
          Register
        </TabsTrigger>
        <TabsTrigger 
          value="login" 
          className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md transition-all cursor-pointer"
        >
          Login
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="login">
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="login-email" className="text-gray-700">Email</Label>
            <Input 
              id="login-email" 
              type="email" 
              placeholder="you@example.com" 
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              className="border-gray-200 focus:border-gray-400 transition-colors"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-password" className="text-gray-700">Password</Label>
            <Input 
              id="login-password" 
              type="password" 
              placeholder="••••••••" 
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              className="border-gray-200 focus:border-gray-400 transition-colors"
              required
            />
          </div>
          <Button 
            type="submit" 
            isLoading={isUserLoging}
            className="w-full cursor-pointer bg-gray-800 hover:bg-gray-700 text-white transition-colors duration-200"
          >
            Login
          </Button>
        </form>
      </TabsContent>
      
      <TabsContent value="register">
        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="register-name" className="text-gray-700">Name</Label>
            <Input 
              id="register-name" 
              type="text" 
              placeholder="John Doe" 
              value={registerData.name}
              onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
              className="border-gray-200 focus:border-gray-400 transition-colors"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-email" className="text-gray-700">Email</Label>
            <Input 
              id="register-email" 
              type="email" 
              placeholder="you@example.com" 
              value={registerData.email}
              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              className="border-gray-200 focus:border-gray-400 transition-colors"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="register-password" className="text-gray-700">Password</Label>
            <Input 
              id="register-password" 
              type="password" 
              placeholder="••••••••" 
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              className="border-gray-200 focus:border-gray-400 transition-colors"
              required
            />
          </div>
          <Button 
            type="submit" 
            isLoading={isUserRegistering}
            className="w-full cursor-pointer bg-gray-800 hover:bg-gray-700 text-white transition-colors duration-200"
          >
            Register
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  </CardContent>
}