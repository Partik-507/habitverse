import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAppStore } from '@/stores/appStore';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Link as LinkIcon, 
  Video, 
  FileText, 
  File,
  Search,
  Filter,
  ExternalLink,
  Trash2,
  Star,
  Globe,
  PlayCircle
} from 'lucide-react';

export default function SavedContent() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'link' | 'video' | 'text' | 'pdf'>('all');
  const [filterTag, setFilterTag] = useState('');
  
  const { secondBrainItems, addSecondBrainItem, deleteSecondBrainItem } = useAppStore();
  const { toast } = useToast();

  const [newItem, setNewItem] = useState({
    title: '',
    content: '',
    type: 'link' as 'link' | 'video' | 'text' | 'pdf',
    url: '',
    tags: [] as string[],
  });

  const [newTag, setNewTag] = useState('');

  const handleAddItem = () => {
    if (!newItem.title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your content",
        variant: "destructive"
      });
      return;
    }

    addSecondBrainItem(newItem);
    
    toast({
      title: "Content saved! 📚",
      description: `"${newItem.title}" has been added to your second brain`,
    });

    setNewItem({
      title: '',
      content: '',
      type: 'link',
      url: '',
      tags: [],
    });
    setIsAddDialogOpen(false);
  };

  const addTag = () => {
    if (newTag.trim() && !newItem.tags.includes(newTag.trim())) {
      setNewItem(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewItem(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const filteredItems = secondBrainItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesTag = !filterTag || item.tags.some(tag => 
      tag.toLowerCase().includes(filterTag.toLowerCase())
    );
    
    return matchesSearch && matchesType && matchesTag;
  });

  const allTags = [...new Set(secondBrainItems.flatMap(item => item.tags))];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'link': return LinkIcon;
      case 'video': return Video;
      case 'text': return FileText;
      case 'pdf': return File;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'link': return 'bg-blue-500';
      case 'video': return 'bg-red-500';
      case 'text': return 'bg-green-500';
      case 'pdf': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Saved Content Hub
          </h1>
          <p className="text-muted-foreground">
            Your personal knowledge vault - save and organize everything
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Save Content
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Save New Content</DialogTitle>
              <DialogDescription>
                Add links, videos, text notes, or documents to your knowledge vault
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-2">
                {(['link', 'video', 'text', 'pdf'] as const).map(type => {
                  const Icon = getTypeIcon(type);
                  return (
                    <Button
                      key={type}
                      variant={newItem.type === type ? 'default' : 'outline'}
                      onClick={() => setNewItem(prev => ({ ...prev, type }))}
                      className="flex-col h-16"
                    >
                      <Icon className="h-5 w-5 mb-1" />
                      <span className="capitalize">{type}</span>
                    </Button>
                  );
                })}
              </div>

              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newItem.title}
                  onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter a descriptive title..."
                />
              </div>

              {(newItem.type === 'link' || newItem.type === 'video') && (
                <div>
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    value={newItem.url}
                    onChange={(e) => setNewItem(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
              )}

              <div>
                <Label htmlFor="content">Content/Notes</Label>
                <Textarea
                  id="content"
                  value={newItem.content}
                  onChange={(e) => setNewItem(prev => ({ ...prev, content: e.target.value }))}
                  placeholder={
                    newItem.type === 'text' 
                      ? "Write your note content here..."
                      : "Add notes, summary, or key points..."
                  }
                  rows={4}
                />
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex space-x-2 mb-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag..."
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button onClick={addTag} variant="outline">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newItem.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddItem}>Save Content</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="link">Links</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="text">Text Notes</SelectItem>
                <SelectItem value="pdf">Documents</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterTag} onValueChange={setFilterTag}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Tags</SelectItem>
                {allTags.map(tag => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Content Grid */}
      {filteredItems.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No content saved yet</h3>
            <p className="text-muted-foreground mb-4">
              Start building your knowledge vault by saving links, videos, and notes
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Save Your First Item
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const Icon = getTypeIcon(item.type);
            return (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1.5 rounded ${getTypeColor(item.type)}`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {item.type.toUpperCase()}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteSecondBrainItem(item.id)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {item.content && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {item.content}
                    </p>
                  )}
                  
                  {item.url && (
                    <div className="flex items-center space-x-2">
                      {item.type === 'video' ? (
                        <Button size="sm" variant="outline" asChild>
                          <a href={item.url} target="_blank" rel="noopener noreferrer">
                            <PlayCircle className="h-4 w-4 mr-2" />
                            Watch
                          </a>
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" asChild>
                          <a href={item.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open
                          </a>
                        </Button>
                      )}
                    </div>
                  )}
                  
                  {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{item.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <p className="text-xs text-muted-foreground">
                    Saved {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <LinkIcon className="h-6 w-6 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">
              {secondBrainItems.filter(item => item.type === 'link').length}
            </p>
            <p className="text-sm text-muted-foreground">Links</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Video className="h-6 w-6 mx-auto mb-2 text-red-500" />
            <p className="text-2xl font-bold">
              {secondBrainItems.filter(item => item.type === 'video').length}
            </p>
            <p className="text-sm text-muted-foreground">Videos</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="h-6 w-6 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">
              {secondBrainItems.filter(item => item.type === 'text').length}
            </p>
            <p className="text-sm text-muted-foreground">Notes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <File className="h-6 w-6 mx-auto mb-2 text-purple-500" />
            <p className="text-2xl font-bold">
              {secondBrainItems.filter(item => item.type === 'pdf').length}
            </p>
            <p className="text-sm text-muted-foreground">Documents</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}