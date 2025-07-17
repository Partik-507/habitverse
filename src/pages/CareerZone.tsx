import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppStore } from '@/stores/appStore';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Briefcase, 
  Target, 
  TrendingUp,
  Award,
  Building,
  FileText,
  User,
  Calendar,
  Star,
  BarChart3
} from 'lucide-react';

export default function CareerZone() {
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false);
  const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false);
  
  const { 
    jobApplications, 
    skills, 
    addJobApplication, 
    updateJobApplicationStatus,
    addSkill,
    updateSkillLevel
  } = useAppStore();
  const { toast } = useToast();

  const [newJob, setNewJob] = useState({
    company: '',
    position: '',
    status: 'applied' as 'applied' | 'interviewed' | 'offer' | 'rejected',
    appliedDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [newSkill, setNewSkill] = useState({
    name: '',
    level: 1,
    goalLevel: 50,
    category: '',
    resources: [] as string[]
  });

  const [newResource, setNewResource] = useState('');

  const handleAddJob = () => {
    if (!newJob.company.trim() || !newJob.position.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in company and position",
        variant: "destructive"
      });
      return;
    }

    addJobApplication(newJob);
    toast({
      title: "Application tracked! 📋",
      description: `Added ${newJob.position} at ${newJob.company}`,
    });

    setNewJob({
      company: '',
      position: '',
      status: 'applied',
      appliedDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setIsJobDialogOpen(false);
  };

  const handleAddSkill = () => {
    if (!newSkill.name.trim() || !newSkill.category.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in skill name and category",
        variant: "destructive"
      });
      return;
    }

    addSkill(newSkill);
    toast({
      title: "Skill added! 🎯",
      description: `Started tracking ${newSkill.name}`,
    });

    setNewSkill({
      name: '',
      level: 1,
      goalLevel: 50,
      category: '',
      resources: []
    });
    setIsSkillDialogOpen(false);
  };

  const addResource = () => {
    if (newResource.trim() && !newSkill.resources.includes(newResource.trim())) {
      setNewSkill(prev => ({
        ...prev,
        resources: [...prev.resources, newResource.trim()]
      }));
      setNewResource('');
    }
  };

  const removeResource = (resource: string) => {
    setNewSkill(prev => ({
      ...prev,
      resources: prev.resources.filter(r => r !== resource)
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-500';
      case 'interviewed': return 'bg-yellow-500';
      case 'offer': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'applied': return '📨';
      case 'interviewed': return '🤝';
      case 'offer': return '🎉';
      case 'rejected': return '❌';
      default: return '📋';
    }
  };

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Career Zone
        </h1>
        <p className="text-muted-foreground">
          Track applications, develop skills, and advance your professional journey
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Applications</p>
                <p className="text-2xl font-bold">{jobApplications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Interviews</p>
                <p className="text-2xl font-bold">
                  {jobApplications.filter(job => job.status === 'interviewed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Offers</p>
                <p className="text-2xl font-bold">
                  {jobApplications.filter(job => job.status === 'offer').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Skills</p>
                <p className="text-2xl font-bold">{skills.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="applications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="applications">Job Applications</TabsTrigger>
          <TabsTrigger value="skills">Skills Development</TabsTrigger>
          <TabsTrigger value="resume">Resume Builder</TabsTrigger>
        </TabsList>

        {/* Job Applications Tab */}
        <TabsContent value="applications" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Job Application Tracker</h2>
            <Dialog open={isJobDialogOpen} onOpenChange={setIsJobDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Application
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Track New Job Application</DialogTitle>
                  <DialogDescription>
                    Keep track of your job applications and their status
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={newJob.company}
                        onChange={(e) => setNewJob(prev => ({ ...prev, company: e.target.value }))}
                        placeholder="Google, Microsoft, etc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        value={newJob.position}
                        onChange={(e) => setNewJob(prev => ({ ...prev, position: e.target.value }))}
                        placeholder="Software Engineer, etc."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select value={newJob.status} onValueChange={(value: any) => setNewJob(prev => ({ ...prev, status: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="applied">Applied</SelectItem>
                          <SelectItem value="interviewed">Interviewed</SelectItem>
                          <SelectItem value="offer">Offer Received</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="applied-date">Applied Date</Label>
                      <Input
                        id="applied-date"
                        type="date"
                        value={newJob.appliedDate}
                        onChange={(e) => setNewJob(prev => ({ ...prev, appliedDate: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={newJob.notes}
                      onChange={(e) => setNewJob(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Interview details, requirements, etc."
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsJobDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddJob}>Add Application</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {jobApplications.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No applications tracked yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start tracking your job applications to monitor your progress
                </p>
                <Button onClick={() => setIsJobDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Application
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobApplications.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{job.position}</CardTitle>
                        <p className="text-muted-foreground flex items-center">
                          <Building className="h-4 w-4 mr-1" />
                          {job.company}
                        </p>
                      </div>
                      <Badge className={`${getStatusColor(job.status)} text-white`}>
                        {getStatusEmoji(job.status)} {job.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      Applied: {new Date(job.appliedDate).toLocaleDateString()}
                    </div>
                    
                    {job.notes && (
                      <p className="text-sm text-muted-foreground">
                        {job.notes}
                      </p>
                    )}
                    
                    <div className="flex space-x-2">
                      <Select value={job.status} onValueChange={(value: any) => updateJobApplicationStatus(job.id, value)}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="applied">Applied</SelectItem>
                          <SelectItem value="interviewed">Interviewed</SelectItem>
                          <SelectItem value="offer">Offer Received</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Skills Development Tab */}
        <TabsContent value="skills" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Skills Development</h2>
            <Dialog open={isSkillDialogOpen} onOpenChange={setIsSkillDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Skill
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Skill</DialogTitle>
                  <DialogDescription>
                    Track your skill development and set improvement goals
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="skill-name">Skill Name</Label>
                      <Input
                        id="skill-name"
                        value={newSkill.name}
                        onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="React, Python, etc."
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={newSkill.category}
                        onChange={(e) => setNewSkill(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="Programming, Design, etc."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="current-level">Current Level (1-100)</Label>
                      <Input
                        id="current-level"
                        type="number"
                        min="1"
                        max="100"
                        value={newSkill.level}
                        onChange={(e) => setNewSkill(prev => ({ ...prev, level: parseInt(e.target.value) || 1 }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="goal-level">Goal Level (1-100)</Label>
                      <Input
                        id="goal-level"
                        type="number"
                        min="1"
                        max="100"
                        value={newSkill.goalLevel}
                        onChange={(e) => setNewSkill(prev => ({ ...prev, goalLevel: parseInt(e.target.value) || 50 }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Learning Resources</Label>
                    <div className="flex space-x-2 mb-2">
                      <Input
                        value={newResource}
                        onChange={(e) => setNewResource(e.target.value)}
                        placeholder="Course, book, tutorial..."
                        onKeyPress={(e) => e.key === 'Enter' && addResource()}
                      />
                      <Button onClick={addResource} variant="outline">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {newSkill.resources.map(resource => (
                        <Badge key={resource} variant="secondary" className="cursor-pointer" onClick={() => removeResource(resource)}>
                          {resource} ×
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsSkillDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddSkill}>Add Skill</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {skills.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No skills tracked yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start tracking skills you want to develop or improve
                </p>
                <Button onClick={() => setIsSkillDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Skill
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5" />
                      <span>{category}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {categorySkills.map((skill) => (
                      <div key={skill.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">{skill.name}</h4>
                          <Badge variant="outline">
                            {skill.level}/{skill.goalLevel}
                          </Badge>
                        </div>
                        <Progress value={(skill.level / skill.goalLevel) * 100} className="h-2" />
                        {skill.resources.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {skill.resources.map(resource => (
                              <Badge key={resource} variant="secondary" className="text-xs">
                                {resource}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateSkillLevel(skill.id, Math.min(skill.level + 5, 100))}
                          >
                            +5 Level
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateSkillLevel(skill.id, Math.min(skill.level + 10, 100))}
                          >
                            +10 Level
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Resume Builder Tab */}
        <TabsContent value="resume" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>AI Resume Builder</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">AI Resume Builder</h3>
                <p className="text-muted-foreground mb-6">
                  Create a professional, ATS-friendly resume using AI technology
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card className="p-4 text-center">
                    <h4 className="font-semibold mb-2">Professional</h4>
                    <p className="text-sm text-muted-foreground">Clean, traditional layout for corporate roles</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <h4 className="font-semibold mb-2">Minimalist</h4>
                    <p className="text-sm text-muted-foreground">Simple, elegant design that highlights content</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <h4 className="font-semibold mb-2">Creative</h4>
                    <p className="text-sm text-muted-foreground">Modern design for creative and tech roles</p>
                  </Card>
                </div>
                
                <Button size="lg" className="bg-gradient-primary hover:opacity-90">
                  Start Building Resume
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}