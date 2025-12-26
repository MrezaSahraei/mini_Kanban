import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { User, X, Loader2 } from 'lucide-react';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string; assigned_to: string[] }) => Promise<void>;
  users: { id: number; username: string }[];
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  users,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsLoading(true);
    try {
      await onSubmit({ title, description, assigned_to: selectedUsers });
      setTitle('');
      setDescription('');
      setSelectedUsers([]);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUser = (username: string) => {
    setSelectedUsers((prev) =>
      prev.includes(username)
        ? prev.filter((u) => u !== username)
        : [...prev, username]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-border/50 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold gradient-text">
            ایجاد تسک جدید
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              عنوان تسک
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="عنوان تسک را وارد کنید..."
              className="bg-secondary/50 border-border/50 focus:border-primary"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              توضیحات
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="توضیحات تسک را وارد کنید..."
              className="bg-secondary/50 border-border/50 focus:border-primary min-h-[100px] resize-none"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">اختصاص به کاربران</Label>
            <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-secondary/30 border border-border/50">
              {users.length === 0 ? (
                <span className="text-sm text-muted-foreground">کاربری یافت نشد</span>
              ) : (
                users.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => toggleUser(user.username)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${
                      selectedUsers.includes(user.username)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary hover:bg-secondary/80 text-foreground'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    {user.username}
                    {selectedUsers.includes(user.username) && (
                      <X className="w-3 h-3" />
                    )}
                  </button>
                ))
              )}
            </div>
            {selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {selectedUsers.map((user) => (
                  <Badge key={user} variant="secondary" className="gap-1">
                    {user}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-destructive"
                      onClick={() => toggleUser(user)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              انصراف
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin ml-2" />
                  در حال ایجاد...
                </>
              ) : (
                'ایجاد تسک'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskModal;
