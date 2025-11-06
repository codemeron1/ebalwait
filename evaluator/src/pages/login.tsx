import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const Login = () => {
  const [userCredentials, setUserCredentials] = useState({
    id_number: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoggingIn(true);
    axios
      .get(`${apiUrl}/user/login`, { params: userCredentials })
      .then((response) => {
        const { token } = response.data;
        localStorage.setItem("authToken", token);
        localStorage.setItem("userData", JSON.stringify(response.data.user));

        window.dispatchEvent(new CustomEvent("userDataChanged"));

        navigate("/rate", { replace: true });
      })
      .catch(() => {
        setError("Invalid ID number or password.");
        console.error("Login failed");
        const timeout = setTimeout(() => {
          setError("");
          clearTimeout(timeout);
        }, 3000);
      })
      .finally(() => {
        setIsLoggingIn(false);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-4">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <img className="h-24 w-auto" src="/logo-2.png" alt="E-Balwait Logo" />
        </div>

        <Card className="shadow-md  border rounded-xl">
          <CardHeader>
            <CardTitle className="text-lg">Login to your account</CardTitle>
            <CardDescription>
              Enter your credentials to access your dashboard.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1">
                <FieldLabel htmlFor="idNumber">ID Number</FieldLabel>
                <Input
                  id="idNumber"
                  type="text"
                  placeholder="Enter your ID number"
                  className="h-11"
                  onChange={(e) =>
                    setUserCredentials((prev) => ({
                      ...prev,
                      id_number: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="space-y-1">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  className="h-11"
                  placeholder="••••••••"
                  onChange={(e) =>
                    setUserCredentials((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 text-center">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full h-11 text-base"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
