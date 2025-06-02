import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("admin")
        .select("*")
        .eq("email", formData.email)
        .eq("password", formData.password)
        .single();

      if (error || !data) {
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Store user email in localStorage for settings display
      localStorage.setItem("currentUserEmail", data.email);

      toast({
        title: "Login Successful!",
        description: `Welcome back, ${data.fullname}!`,
      });

      // Redirect to Admin Dashboard
      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 1000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
      style={{
        background: "linear-gradient(to bottom right, #001F54, #003566)",
      }}
    >
      <div className="w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-8 text-white text-lg hover:text-blue-300 hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Button>

          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl p-6">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-900">
                Administrator Login
              </CardTitle>
              <CardDescription className="text-md text-gray-600 mt-2">
                Access the SCHEDULA admin panel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-lg">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="h-12 text-base"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-lg">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="h-12 text-base"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-md text-gray-600">Don't have an account?</p>
                <Button
                  variant="link"
                  onClick={() => navigate("/signup")}
                  className="text-lg text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Sign Up
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
