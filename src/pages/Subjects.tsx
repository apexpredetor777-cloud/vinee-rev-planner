import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Subject } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Plus,
  BookOpen,
  Calendar,
  Layers,
  Edit,
  Trash2,
  AlertTriangle,
  X,
} from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const difficultyColors = {
  easy: 'bg-low/10 text-low',
  medium: 'bg-medium/10 text-medium',
  hard: 'bg-urgent/10 text-urgent',
};

const Subjects = () => {
  const { subjects, addSubject, updateSubject, deleteSubject } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    examDate: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    syllabusSize: '10',
    weakAreas: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setFormData({
      name: '',
      examDate: '',
      difficulty: 'medium',
      syllabusSize: '10',
      weakAreas: '',
    });
    setErrors({});
    setEditingSubject(null);
  };

  const openEditDialog = (subject: Subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      examDate: subject.examDate,
      difficulty: subject.difficulty,
      syllabusSize: subject.syllabusSize.toString(),
      weakAreas: subject.weakAreas.join(', '),
    });
    setIsDialogOpen(true);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Subject name is required';
    }
    
    if (!formData.examDate) {
      newErrors.examDate = 'Exam date is required';
    } else if (new Date(formData.examDate) < new Date()) {
      newErrors.examDate = 'Exam date must be in the future';
    }
    
    if (!formData.syllabusSize || parseInt(formData.syllabusSize) < 1) {
      newErrors.syllabusSize = 'Syllabus size must be at least 1';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const subjectData = {
      name: formData.name.trim(),
      examDate: formData.examDate,
      difficulty: formData.difficulty,
      syllabusSize: parseInt(formData.syllabusSize),
      weakAreas: formData.weakAreas
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0),
    };

    try {
      if (editingSubject) {
        await updateSubject(editingSubject.id, subjectData);
        toast.success('Subject updated successfully');
      } else {
        await addSubject(subjectData);
        toast.success('Subject added successfully');
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save subject');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSubject(id);
      toast.success('Subject deleted successfully');
    } catch (error) {
      toast.error('Failed to delete subject');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Subjects
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your subjects and exam schedule
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2 gradient-primary text-primary-foreground">
              <Plus className="h-4 w-4" />
              Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">
                {editingSubject ? 'Edit Subject' : 'Add New Subject'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  Subject Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Mathematics"
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="examDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Exam Date
                </Label>
                <Input
                  id="examDate"
                  type="date"
                  value={formData.examDate}
                  onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                  className={errors.examDate ? 'border-destructive' : ''}
                />
                {errors.examDate && <p className="text-sm text-destructive">{errors.examDate}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-muted-foreground" />
                    Difficulty
                  </Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(v) => setFormData({ ...formData, difficulty: v as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="syllabusSize">Chapters/Topics</Label>
                  <Input
                    id="syllabusSize"
                    type="number"
                    min="1"
                    value={formData.syllabusSize}
                    onChange={(e) => setFormData({ ...formData, syllabusSize: e.target.value })}
                    className={errors.syllabusSize ? 'border-destructive' : ''}
                  />
                  {errors.syllabusSize && <p className="text-sm text-destructive">{errors.syllabusSize}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weakAreas" className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  Weak Areas (optional)
                </Label>
                <Input
                  id="weakAreas"
                  value={formData.weakAreas}
                  onChange={(e) => setFormData({ ...formData, weakAreas: e.target.value })}
                  placeholder="e.g., Calculus, Algebra (comma separated)"
                />
                <p className="text-xs text-muted-foreground">
                  Separate multiple areas with commas
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="gradient-primary text-primary-foreground">
                  {editingSubject ? 'Update' : 'Add'} Subject
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Subjects Table/Cards */}
      {subjects.length > 0 ? (
        <>
          {/* Desktop Table */}
          <Card className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Exam Date</TableHead>
                  <TableHead>Days Left</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Chapters</TableHead>
                  <TableHead>Weak Areas</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjects.map((subject) => {
                  const daysLeft = differenceInDays(parseISO(subject.examDate), new Date());
                  return (
                    <TableRow key={subject.id}>
                      <TableCell className="font-medium">{subject.name}</TableCell>
                      <TableCell>{format(parseISO(subject.examDate), 'MMM d, yyyy')}</TableCell>
                      <TableCell>
                        <span className={cn(
                          "font-medium",
                          daysLeft <= 7 ? "text-urgent" : daysLeft <= 14 ? "text-medium" : "text-foreground"
                        )}>
                          {daysLeft} days
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium capitalize",
                          difficultyColors[subject.difficulty]
                        )}>
                          {subject.difficulty}
                        </span>
                      </TableCell>
                      <TableCell>{subject.syllabusSize}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {subject.weakAreas.length > 0 ? (
                            subject.weakAreas.slice(0, 2).map((area, i) => (
                              <span key={i} className="px-2 py-0.5 bg-secondary rounded text-xs">
                                {area}
                              </span>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                          {subject.weakAreas.length > 2 && (
                            <span className="text-xs text-muted-foreground">
                              +{subject.weakAreas.length - 2}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(subject)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Subject?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete "{subject.name}" and all associated study tasks.
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(subject.id)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {subjects.map((subject) => {
              const daysLeft = differenceInDays(parseISO(subject.examDate), new Date());
              return (
                <Card key={subject.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-heading font-semibold text-lg">{subject.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {format(parseISO(subject.examDate), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium capitalize",
                        difficultyColors[subject.difficulty]
                      )}>
                        {subject.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm mb-4">
                      <span className={cn(
                        "font-medium",
                        daysLeft <= 7 ? "text-urgent" : daysLeft <= 14 ? "text-medium" : "text-muted-foreground"
                      )}>
                        {daysLeft} days left
                      </span>
                      <span className="text-muted-foreground">
                        {subject.syllabusSize} chapters
                      </span>
                    </div>
                    {subject.weakAreas.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {subject.weakAreas.map((area, i) => (
                          <span key={i} className="px-2 py-0.5 bg-secondary rounded text-xs">
                            {area}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(subject)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-destructive border-destructive/50">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Subject?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete "{subject.name}" and all associated study tasks.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(subject.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h3 className="font-heading text-xl font-semibold mb-2">No subjects yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Add your first subject to start creating your personalized study plan.
            </p>
            <Button
              className="gradient-primary text-primary-foreground"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Subject
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Subjects;
