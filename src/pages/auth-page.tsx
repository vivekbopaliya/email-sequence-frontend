import { Card, CardHeader, CardTitle } from '../components/ui/card';
import AuthForm from '../components/auth/auth-form';

export function AuthPage() {

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Card className="w-full max-w-md border-none shadow-lg bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Workflow Automation
          </CardTitle>
          <p className="text-center text-gray-600 mt-1">
            Streamline your email workflows with ease
          </p>
        </CardHeader>
       <AuthForm />
      </Card>
    </div>
  );
}