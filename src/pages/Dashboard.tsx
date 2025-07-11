
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Link2, MessageCircle, Eye, Copy, ExternalLink } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";

const Dashboard = () => {
  const [testimonialLinks, setTestimonialLinks] = useState([
    {
      id: 1,
      name: "General Feedback",
      url: "https://testimonials.app/submit/abc123",
      created: "2024-01-15",
      submissions: 5,
      active: true
    },
    {
      id: 2,
      name: "Product Review",
      url: "https://testimonials.app/submit/def456",
      created: "2024-01-10",
      submissions: 12,
      active: true
    }
  ]);

  const [newLinkName, setNewLinkName] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreateLink = () => {
    if (newLinkName.trim()) {
      const newLink = {
        id: Date.now(),
        name: newLinkName,
        url: `https://testimonials.app/submit/${Math.random().toString(36).substr(2, 9)}`,
        created: new Date().toISOString().split('T')[0],
        submissions: 0,
        active: true
      };
      setTestimonialLinks([...testimonialLinks, newLink]);
      setNewLinkName("");
      setIsCreateDialogOpen(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    console.log("Copied to clipboard:", text);
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-black">Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your testimonial collection links</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-6">
                <Plus className="h-4 w-4 mr-2" />
                Create Link
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create Testimonial Link</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="linkName">Link Name</Label>
                  <Input
                    id="linkName"
                    value={newLinkName}
                    onChange={(e) => setNewLinkName(e.target.value)}
                    placeholder="e.g., General Feedback, Product Review"
                    className="mt-2"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateLink} className="bg-black text-white hover:bg-gray-800">
                    Create Link
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-white border-0 shadow-sm rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Links</p>
                <p className="text-2xl font-bold text-black">{testimonialLinks.length}</p>
              </div>
              <Link2 className="h-8 w-8 text-gray-400" />
            </div>
          </Card>

          <Card className="p-6 bg-white border-0 shadow-sm rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Testimonials</p>
                <p className="text-2xl font-bold text-black">
                  {testimonialLinks.reduce((sum, link) => sum + link.submissions, 0)}
                </p>
              </div>
              <MessageCircle className="h-8 w-8 text-gray-400" />
            </div>
          </Card>

          <Card className="p-6 bg-white border-0 shadow-sm rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Links</p>
                <p className="text-2xl font-bold text-black">
                  {testimonialLinks.filter(link => link.active).length}
                </p>
              </div>
              <Eye className="h-8 w-8 text-gray-400" />
            </div>
          </Card>
        </div>

        {/* Testimonial Links */}
        <div>
          <h2 className="text-xl font-semibold text-black mb-6">Your Testimonial Links</h2>
          
          {testimonialLinks.length === 0 ? (
            <Card className="p-12 bg-white border-0 shadow-sm rounded-xl text-center">
              <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-black mb-2">No testimonial links yet</h3>
              <p className="text-gray-600 mb-6">Create your first testimonial collection link to get started.</p>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-6">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Link
                  </Button>
                </DialogTrigger>
              </Dialog>
            </Card>
          ) : (
            <div className="grid gap-4">
              {testimonialLinks.map((link) => (
                <Card key={link.id} className="p-6 bg-white border-0 shadow-sm rounded-xl hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-black mb-2">{link.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Created: {link.created}</span>
                        <span>•</span>
                        <span>{link.submissions} testimonials</span>
                        <span>•</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          link.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {link.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center space-x-2">
                        <Input
                          value={link.url}
                          readOnly
                          className="text-sm bg-gray-50 border-gray-200"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(link.url)}
                          className="rounded-lg"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(link.url, '_blank')}
                          className="rounded-lg"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
