import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FileText, Plus, Search, Edit, Trash2, MoreHorizontal, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function Notes() {
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteForm, setNoteForm] = useState({ title: '', content: '' });

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveNote = () => {
    if (!noteForm.title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your note",
        variant: "destructive",
      });
      return;
    }

    const now = new Date().toISOString();

    if (editingNote) {
      // Update existing note
      setNotes(prev => prev.map(note => 
        note.id === editingNote.id 
          ? { ...note, title: noteForm.title, content: noteForm.content, updatedAt: now }
          : note
      ));
      toast({
        title: "Note updated! 📝",
        description: `"${noteForm.title}" has been updated`,
      });
    } else {
      // Create new note
      const newNote: Note = {
        id: Date.now().toString(),
        title: noteForm.title,
        content: noteForm.content,
        createdAt: now,
        updatedAt: now,
      };
      setNotes(prev => [newNote, ...prev]);
      toast({
        title: "Note created! ✨",
        description: `"${noteForm.title}" has been saved`,
      });
    }

    setNoteForm({ title: '', content: '' });
    setEditingNote(null);
    setNoteDialogOpen(false);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNoteForm({ title: note.title, content: note.content });
    setNoteDialogOpen(true);
  };

  const handleDeleteNote = (id: string, title: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    toast({
      title: "Note deleted",
      description: `"${title}" has been removed`,
    });
  };

  const openNewNote = () => {
    setEditingNote(null);
    setNoteForm({ title: '', content: '' });
    setNoteDialogOpen(true);
  };

  const getPreview = (content: string) => {
    const lines = content.split('\n').filter(line => line.trim());
    return lines.slice(0, 3).join(' ').substring(0, 150) + (content.length > 150 ? '...' : '');
  };

  const NoteCard = ({ note }: { note: Note }) => (
    <Card className="bg-gradient-card shadow-habit-md border-0 hover:shadow-habit-lg transition-all duration-300 cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 
            className="font-semibold text-foreground line-clamp-1 flex-1 cursor-pointer"
            onClick={() => handleEditNote(note)}
          >
            {note.title}
          </h3>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEditNote(note)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleDeleteNote(note.id, note.title)}
                className="text-habit-error focus:text-habit-error"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div 
          className="text-sm text-muted-foreground mb-3 cursor-pointer line-clamp-3"
          onClick={() => handleEditNote(note)}
        >
          {note.content ? getPreview(note.content) : "No content yet..."}
        </div>

        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar className="h-3 w-3 mr-1" />
          <span>
            {note.createdAt === note.updatedAt 
              ? `Created ${new Date(note.createdAt).toLocaleDateString()}`
              : `Updated ${new Date(note.updatedAt).toLocaleDateString()}`
            }
          </span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notes 📝</h1>
          <p className="text-muted-foreground">Capture your thoughts and ideas</p>
        </div>
        
        <Button onClick={openNewNote} className="bg-gradient-primary hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" />
          New Note
        </Button>
      </div>

      {/* Search */}
      <Card className="bg-gradient-card shadow-habit-md border-0">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-card shadow-habit-md border-0">
          <CardContent className="pt-6 text-center">
            <FileText className="h-8 w-8 text-habit-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{notes.length}</div>
            <div className="text-sm text-muted-foreground">Total Notes</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-habit-md border-0">
          <CardContent className="pt-6 text-center">
            <Edit className="h-8 w-8 text-habit-success mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {notes.filter(note => {
                const today = new Date().toDateString();
                return new Date(note.updatedAt).toDateString() === today;
              }).length}
            </div>
            <div className="text-sm text-muted-foreground">Edited Today</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-card shadow-habit-md border-0">
          <CardContent className="pt-6 text-center">
            <Calendar className="h-8 w-8 text-habit-warning mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">
              {notes.reduce((total, note) => total + note.content.split(' ').length, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Words</div>
          </CardContent>
        </Card>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map(note => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      ) : searchQuery ? (
        /* No search results */
        <Card className="bg-gradient-hero border-0 shadow-habit-md">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No notes found
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              No notes match your search for "{searchQuery}". Try a different keyword.
            </p>
            <Button variant="outline" onClick={() => setSearchQuery('')}>
              Clear Search
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Empty State */
        <Card className="bg-gradient-hero border-0 shadow-habit-md">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Notes Yet
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start capturing your thoughts and ideas. Create your first note to get started.
            </p>
            <Button onClick={openNewNote} className="bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Note
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Note Dialog */}
      <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingNote ? 'Edit Note' : 'Create New Note'}</DialogTitle>
            <DialogDescription>
              {editingNote ? 'Update your note' : 'Capture your thoughts and ideas'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="note-title">Title</Label>
              <Input
                id="note-title"
                value={noteForm.title}
                onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                placeholder="Enter note title..."
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="note-content">Content</Label>
              <Textarea
                id="note-content"
                value={noteForm.content}
                onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                placeholder="Write your note here..."
                rows={10}
                className="mt-1 resize-none"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setNoteDialogOpen(false);
                  setEditingNote(null);
                  setNoteForm({ title: '', content: '' });
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveNote}>
                {editingNote ? 'Update Note' : 'Save Note'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}