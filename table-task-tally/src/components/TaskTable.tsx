import { useState, useEffect } from 'react';
import { Task } from '@/types/task';
import {
  CheckCircle2,
  Circle,
  Edit,
  Trash2,
  PlusCircle,
  AlertTriangle,
  AlertCircle,
  Info,
  Search,
  ChartArea,
  ArrowUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTask, fetchTodoList, toggleCompletion } from '@/api/todoAPI';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { setTasks, addTask, updateTask, deleteTask as deleteTaskAction, fetchTasks, updateToggleComplete } from '@/store/taskSlice';
import SearchCom from './Search';
import { Link } from 'react-router-dom';
import { useScrollToTop } from '@/hooks/useScrollToTop';

// const useDebounce = (text, delay) => {
//   const [debounce, setDebounce] = useState(text)
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebounce(text)
//     }, delay)
//     return () => {
//       clearTimeout(timer)
//     }
//   }, [text, delay])
//   return debounce
// }

const useDebounce = (text, delay) => {
  const [debounce, setDebounce] = useState(text)
  useEffect(()=>{
    const timer = setTimeout(()=>{
      setDebounce(text)
    }, delay)
    return ()=>{
      clearTimeout(timer)
    }
  },[text, delay])
  return debounce
}
const TaskTable = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const searchTermDebounce = useDebounce(searchTerm, 300)
  const [newTask, setNewTask] = useState<Omit<Task, '_id' | 'createdAt'>>({
    title: '',
    description: '',
    completed: false,
    priority: 'low',
  });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const { isVisible, scrollToTop } = useScrollToTop();

  // Fetch tasks from API
  const { data = [], isLoading, error } = useQuery({
    queryKey: ['todos'],
    queryFn: async (result) => {
      const data = await fetchTodoList()

      // Convert API data to our Task interface (especially dates)
      const mappedTasks = data.map(task => ({
        ...task,
        id: task._id,
        createdAt: new Date(task.createdAt)
      }));
      
      dispatch(fetchTasks(data));
      return mappedTasks
    },
    staleTime: 5 * 60 * 1000,
  });

  // Add task mutation
  const addTaskMutation = useMutation({
    mutationFn: async (task: Omit<Task, '_id' | 'createdAt'>) => {

      const response = await fetch('http://localhost:3000/todos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...task,
          priority: task.priority,
          createdAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add task');
      }

      return response.json();
    },
    onSuccess: (data) => {
      dispatch(addTask(data));
      toast({
        title: "Task added",
        description: "Your new task has been added to the list",
      });
      setIsAddDialogOpen(false);
    },
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Task> }) => {
      const response = await fetch(`http://localhost:3000/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      return response.json();
    },
    onSuccess: (data) => {
      dispatch(updateTask(data));

      toast({
        title: "Task updated",
        description: "Your task has been updated",
      });
      setIsEditDialogOpen(false);
      setEditingTask(null);
    },
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: (data) => {
      dispatch(deleteTaskAction(data))
      toast({
        title: "Task deleted",
        description: "The task has been removed from your list",
      });
    },
  });

  // Toggle task completion mutation
  const toggleCompletionMutation = useMutation({
    mutationFn: ({ _id, completed }: { _id: string; completed: boolean }) =>
      toggleCompletion(_id, completed),
    onSuccess: (toggle) => {
      dispatch(updateToggleComplete(toggle));
      toast({
        title: "Task status updated",
        description: "The task status has been updated",
      });
    },
  });

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      toast({
        title: "Task title required",
        description: "Please enter a title for your task",
        variant: "destructive",
      });
      return;
    }
    // debugger
    addTaskMutation.mutate(newTask);
    console.log(newTask.priority);

    setNewTask({
      title: '',
      description: '',
      completed: false,
      priority: 'low'
    });
  };

  const handleEditTask = () => {
    if (editingTask) {
      updateTaskMutation.mutate({
        id: editingTask._id,
        updates: {
          title: editingTask.title,
          description: editingTask.description,
          priority: editingTask.priority,
          completed: editingTask.completed
        }

      });
      console.log(editingTask._id);

    }
  };

  const handleDeleteTask = (_id: string) => {
    deleteTaskMutation.mutate(_id);
  };

  const toggleTaskCompletion = (_id: string, completed: boolean) => {
    toggleCompletionMutation.mutate({
      _id,
      completed: !completed
    });

  };

  const startEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditDialogOpen(true);
  };

  const getPriorityIcon = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'medium':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'low':
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Filter tasks based on search term
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTermDebounce.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTermDebounce.toLowerCase())
  );

 

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <Link className="flex items-center gap-1" to='cart'>Cart</Link>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <PlusCircle className="h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Task description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value: 'low' | 'medium' | 'high') =>
                    setNewTask({ ...newTask, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTask} disabled={addTaskMutation.isPending}>
                {addTaskMutation.isPending ? 'Adding...' : 'Add Task'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <SearchCom searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Loading tasks...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="text-center py-10 text-destructive">
          <p>Error loading tasks: {error instanceof Error ? error.message : 'Unknown error'}</p>
          <Button
            variant="outline"
            className="mt-2"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['todos'] })}
          >
            Try Again
          </Button>
        </div>
      )}

      {!isLoading && !error && (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Status</TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    {tasks.length === 0 ?
                      "No tasks yet. Click 'Add Task' to create your first task." :
                      "No tasks found matching your search."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredTasks.map((task) => (
                  <TableRow
                    key={task._id}
                    className={cn(
                      "transition-colors",
                      task.completed && "bg-muted/50"
                    )}
                  >
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleTaskCompletion(task._id, task.completed)}
                        className="h-8 w-8"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-400" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className={cn(
                          "font-medium",
                          task.completed && "line-through text-muted-foreground"
                        )}>
                          {task.title}
                        </span>
                        {task.description && (
                          <span className="text-sm text-muted-foreground truncate max-w-[300px]">
                            {task.description}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "flex items-center gap-1 w-fit",
                          task.priority === 'high' && "border-amber-200 bg-amber-100 text-amber-700",
                          task.priority === 'medium' && "border-blue-200 bg-blue-100 text-blue-700",
                          task.priority === 'low' && "border-gray-200 bg-gray-100 text-gray-700",
                        )}
                      >
                        {getPriorityIcon(task.priority)}
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(task.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => startEditTask(task)}
                          className="h-8 w-8"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTask(task._id)}
                          className="h-8 w-8 text-destructive"
                          disabled={deleteTaskMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-priority">Priority</Label>
                <Select
                  value={editingTask.priority}
                  onValueChange={(value: 'low' | 'medium' | 'high') =>
                    setEditingTask({ ...editingTask, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditTask}
              disabled={updateTaskMutation.isPending}
            >
              {updateTaskMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Scroll to Top Button */}
      {isVisible && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 rounded-full p-2 shadow-lg"
          size="icon"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default TaskTable;


