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
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";

const SignUpPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.from("admin").insert([
        {
          fullname: formData.fullName,
          email: formData.email,
          password: formData.password,
        },
      ]);

      if (error) {
        throw error;
      }

      toast({
        title: "Success!",
        description: "Your account has been created successfully",
      });

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // Redirect to login page after successful signup
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to create account. Please try again.",
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
          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl p-6">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-gray-900">
                Sign Up
              </CardTitle>
              <CardDescription className="text-md text-gray-600 mt-2">
                Create your administrator account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-lg">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    className="h-12 text-base"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
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
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-lg">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    className="h-12 text-base"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Sign Up"}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-md text-gray-600">
                  Already have an account?
                </p>
                <Button
                  variant="link"
                  onClick={() => navigate("/login")}
                  className="text-lg text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Sign in instead
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUpPage;
