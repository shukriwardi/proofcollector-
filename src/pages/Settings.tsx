
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } = useToast";

const Settings = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 mt-2">Manage your account settings</p>
        </div>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Account Information</CardTitle>
            <CardDescription className="text-gray-400">
              Your account details from Google authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300">Email</label>
              <p className="text-white">{user?.email}</p>
            </div>
            <Button
              onClick={handleSignOut}
              variant="destructive"
              className="mt-4"
            >
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
