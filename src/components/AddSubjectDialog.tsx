import { useState } from "react";
import { Subject, Difficulty } from "@/types/study";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, BookOpen, Calendar, Layers, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddSubjectDialogProps {
  onAddSubject: (subject: Omit<Subject, 'id' | 'completedTopics'>) => void;
}

const colors = [
  '#818cf8', // Indigo
  '#f472b6', // Pink
  '#34d399', // Emerald
  '#fbbf24', // Amber
  '#60a5fa', // Blue
  '#a78bfa', // Purple
  '#fb923c', // Orange
  '#2dd4bf', // Teal
];

const AddSubjectDialog = ({ onAddSubject }: AddSubjectDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [examDate, setExamDate] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [totalTopics, setTotalTopics] = useState('10');
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !examDate) return;

    onAddSubject({
      name,
      examDate: new Date(examDate),
      difficulty,
      totalTopics: parseInt(totalTopics) || 10,
      color: selectedColor,
    });

    // Reset form
    setName('');
    setExamDate('');
    setDifficulty('medium');
    setTotalTopics('10');
    setSelectedColor(colors[0]);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 gradient-primary text-primary-foreground hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4" />
          Add Subject
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Add New Subject</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2 text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              Subject Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Mathematics"
              className="bg-secondary border-border focus:border-primary"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="examDate" className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Exam Date
            </Label>
            <Input
              id="examDate"
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="bg-secondary border-border focus:border-primary"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-muted-foreground">
                <Layers className="h-4 w-4" />
                Difficulty
              </Label>
              <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}>
                <SelectTrigger className="bg-secondary border-border">
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
              <Label htmlFor="topics" className="text-muted-foreground">
                Total Topics
              </Label>
              <Input
                id="topics"
                type="number"
                min="1"
                value={totalTopics}
                onChange={(e) => setTotalTopics(e.target.value)}
                className="bg-secondary border-border focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-muted-foreground">
              <Palette className="h-4 w-4" />
              Color
            </Label>
            <div className="flex gap-2 flex-wrap">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    "h-8 w-8 rounded-full transition-all",
                    selectedColor === color 
                      ? "ring-2 ring-offset-2 ring-offset-card ring-primary scale-110" 
                      : "hover:scale-105"
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-border"
            >
              Cancel
            </Button>
            <Button type="submit" className="gradient-primary text-primary-foreground">
              Add Subject
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubjectDialog;
