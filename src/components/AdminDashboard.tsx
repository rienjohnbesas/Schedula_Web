import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Users,
  Building,
  Settings,
  Clock,
  MapPin,
  CalendarCheck,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [totalRooms, setTotalRooms] = useState(0);
  const [isManageRoomsOpen, setIsManageRoomsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({ fullname: "", email: "" });
  const [roomForm, setRoomForm] = useState({
    room_name: "",
    location: "",
    capacity: "",
    facilities: "",
    room_availability: "Available",
  });

  useEffect(() => {
    fetchRoomsCount();
    fetchUserInfo();
  }, []);

  const fetchRoomsCount = async () => {
    try {
      const { count, error } = await supabase
        .from("rooms")
        .select("*", { count: "exact", head: true });

      if (error) throw error;
      setTotalRooms(count || 0);
    } catch (error) {
      console.error("Error fetching rooms count:", error);
    }
  };

  const fetchUserInfo = async () => {
    try {
      // Get the current logged-in user's email from localStorage or session
      const currentUserEmail = localStorage.getItem("currentUserEmail");

      if (currentUserEmail) {
        const { data, error } = await supabase
          .from("admin")
          .select("fullname, email")
          .eq("email", currentUserEmail)
          .single();

        if (error) {
          console.error("Error fetching user info:", error);
          return;
        }
        if (data) {
          setUserInfo({ fullname: data.fullname, email: data.email });
        }
      } else {
        console.error("No user email found in localStorage");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("currentUserEmail");
    localStorage.removeItem("userRole");

    // Show success message
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });

    // Redirect to login page
    navigate("/login");
  };

  const handleSaveRoom = async () => {
    try {
      if (!roomForm.room_name || !roomForm.location || !roomForm.capacity) {
        toast({
          title: "Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("rooms").insert({
        room_name: roomForm.room_name,
        location: roomForm.location,
        capacity: parseInt(roomForm.capacity),
        facilities: roomForm.facilities,
        room_availability: roomForm.room_availability,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Room added successfully!",
      });

      // Reset form
      setRoomForm({
        room_name: "",
        location: "",
        capacity: "",
        facilities: "",
        room_availability: "Available",
      });

      // Close dialog and refresh count
      setIsManageRoomsOpen(false);
      fetchRoomsCount();
    } catch (error) {
      console.error("Error saving room:", error);
      toast({
        title: "Error",
        description: "Failed to save room. Please try again.",
        variant: "destructive",
      });
    }
  };

  const stats = [
    {
      title: "Total Rooms",
      value: totalRooms.toString(),
      icon: Building,
      color: "bg-blue-500",
    },
    {
      title: "Active Bookings",
      value: "18",
      icon: Calendar,
      color: "bg-green-500",
    },
    {
      title: "Faculty Members",
      value: "45",
      icon: Users,
      color: "bg-purple-500",
    },
  ];

  const recentBookings = [
    {
      room: "Room 101",
      faculty: "Dr. Smith",
      time: "9:00 AM - 11:00 AM",
      date: "Today",
    },
    {
      room: "Lab 205",
      faculty: "Prof. Johnson",
      time: "2:00 PM - 4:00 PM",
      date: "Today",
    },
    {
      room: "Conference Room",
      faculty: "Dr. Brown",
      time: "10:00 AM - 12:00 PM",
      date: "Tomorrow",
    },
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(to bottom right, #001F54, #003566)",
      }}
    >
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-white">SCHEDULA</h1>
              <p className="text-blue-200">Administrator Dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Account Settings</DialogTitle>
                    <DialogDescription>
                      Current logged-in account information
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right font-semibold">
                        Full Name:
                      </Label>
                      <div className="col-span-3 p-2 bg-gray-50 rounded-md">
                        {userInfo.fullname || "Loading..."}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right font-semibold">Email:</Label>
                      <div className="col-span-3 p-2 bg-gray-50 rounded-md">
                        {userInfo.email || "Loading..."}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <Button
                      variant="destructive"
                      onClick={handleLogout}
                      className="flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-bold text-gray-900">
                          {stat.value}
                        </p>
                      </div>
                      <div className={`p-3 rounded-full ${stat.color}`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Recent Bookings
                </CardTitle>
                <CardDescription>
                  Latest room reservations and schedules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.map((booking, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <MapPin className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {booking.room}
                          </p>
                          <p className="text-sm text-gray-600">
                            {booking.faculty}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {booking.time}
                        </p>
                        <p className="text-sm text-gray-600">{booking.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Dialog
                    open={isManageRoomsOpen}
                    onOpenChange={setIsManageRoomsOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="h-20 flex flex-col items-center justify-center space-y-2">
                        <Building className="h-6 w-6" />
                        <span>Manage Rooms</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Add New Room</DialogTitle>
                        <DialogDescription>
                          Enter the details for the new room.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="room_name" className="text-right">
                            Room Name
                          </Label>
                          <Input
                            id="room_name"
                            value={roomForm.room_name}
                            onChange={(e) =>
                              setRoomForm({
                                ...roomForm,
                                room_name: e.target.value,
                              })
                            }
                            className="col-span-3"
                            placeholder="Enter room name"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="location" className="text-right">
                            Location
                          </Label>
                          <Input
                            id="location"
                            value={roomForm.location}
                            onChange={(e) =>
                              setRoomForm({
                                ...roomForm,
                                location: e.target.value,
                              })
                            }
                            className="col-span-3"
                            placeholder="Enter location"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="capacity" className="text-right">
                            Capacity
                          </Label>
                          <Input
                            id="capacity"
                            type="number"
                            value={roomForm.capacity}
                            onChange={(e) =>
                              setRoomForm({
                                ...roomForm,
                                capacity: e.target.value,
                              })
                            }
                            className="col-span-3"
                            placeholder="Enter capacity"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="facilities" className="text-right">
                            Facilities
                          </Label>
                          <Input
                            id="facilities"
                            value={roomForm.facilities}
                            onChange={(e) =>
                              setRoomForm({
                                ...roomForm,
                                facilities: e.target.value,
                              })
                            }
                            className="col-span-3"
                            placeholder="Enter facilities"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="availability" className="text-right">
                            Availability
                          </Label>
                          <Select
                            value={roomForm.room_availability}
                            onValueChange={(value) =>
                              setRoomForm({
                                ...roomForm,
                                room_availability: value,
                              })
                            }
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select availability" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Available">
                                Available
                              </SelectItem>
                              <SelectItem value="Occupied">Occupied</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsManageRoomsOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleSaveRoom}>Save Room</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <CalendarCheck className="h-6 w-6" />
                    <span>Manage Room Bookings</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <Users className="h-6 w-6" />
                    <span>Faculty List</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
