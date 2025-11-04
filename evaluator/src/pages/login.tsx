import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const Login = () => {
  const [userCredentials, setUserCredentials] = useState({ id_number: '', password: '' });
  // const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoggingIn(true);
    axios.get(`${apiUrl}/user/login`, { params: userCredentials })
      .then(response => {
        const { token } = response.data;
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
        
        window.dispatchEvent(new CustomEvent('userDataChanged'));
        
        navigate('/rate', { replace: true });
      })
      .catch(() => {
        // setError('Invalid ID number or password.');
        console.error('Login failed');
      }).finally(() => {
        setIsLoggingIn(false);
      });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your ID number below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="idNumber">ID Number</FieldLabel>
                  <Input
                    id="idNumber"
                    type="text"
                    placeholder="Enter your ID number"
                    onChange={e => setUserCredentials(prev => ({ ...prev, id_number: e.target.value }))}
                    required
                  />
                </Field>
                <Field>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    onChange={e => setUserCredentials(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </Field>
                <Field>
                  <Button type="submit" disabled={isLoggingIn}>
                    {isLoggingIn ? 'Logging in...' : 'Login'}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default Login;