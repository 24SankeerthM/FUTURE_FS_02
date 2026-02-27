import { useState, useEffect } from 'react';
import { Card, Input, Button } from '../components/ui';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { FiChevronLeft, FiChevronRight, FiCheckCircle, FiTrash2 } from 'react-icons/fi';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDate, setNewTaskDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const { data } = await api.get('/tasks');
            // Convert strings to Date objects
            const parsedTasks = data.map(t => ({ ...t, date: new Date(t.date) }));
            setTasks(parsedTasks);
        } catch (error) {
            toast.error('Failed to fetch tasks');
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        try {
            await api.post('/tasks', { title: newTaskTitle, date: newTaskDate });
            setNewTaskTitle('');
            fetchTasks();
            toast.success('Task added');
        } catch (error) {
            toast.error('Failed to add task');
        }
    };

    const toggleTask = async (id, currentStatus) => {
        try {
            await api.put(`/tasks/${id}`, { completed: !currentStatus });
            fetchTasks(); // optimal would be optimistic update
        } catch (error) {
            toast.error('Update failed');
        }
    };

    const deleteTask = async (id) => {
        if (!window.confirm('Delete task?')) return;
        try {
            await api.delete(`/tasks/${id}`);
            fetchTasks();
            toast.success('Task deleted');
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDay = monthStart.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Create empty slots for days before the 1st of the month
    const paddingDays = Array(startDay).fill(null);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Calendar & Tasks</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar View */}
                <Card className="lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{format(currentDate, 'MMMM yyyy')}</h2>
                        <div className="flex gap-2">
                            <button onClick={prevMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><FiChevronLeft /></button>
                            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><FiChevronRight /></button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-2 text-center text-sm mb-2 text-gray-500">
                        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {paddingDays.map((_, i) => (
                            <div key={`padding-${i}`} className="min-h-[6rem]"></div>
                        ))}
                        {days.map((day) => {
                            const dayTasks = tasks.filter(t => isSameDay(t.date, day));
                            return (
                                <div key={day.toString()} className={`min-h-[6rem] p-2 border border-gray-100 dark:border-gray-700 rounded-lg ${!isSameMonth(day, currentDate) ? 'opacity-30' : ''} hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}>
                                    <div className="text-right text-sm mb-1 text-gray-700 dark:text-gray-300">{format(day, 'd')}</div>
                                    <div className="space-y-1">
                                        {dayTasks.map(task => (
                                            <div key={task._id} className={`text-xs p-1 rounded truncate ${task.completed ? 'bg-green-100 text-green-700 line-through' : 'bg-indigo-100 text-indigo-700'}`}>
                                                {task.title}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>

                {/* Upcoming Tasks */}
                <Card>
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Tasks List</h3>
                    <form onSubmit={handleAddTask} className="mb-4 space-y-2">
                        <Input placeholder="New Task..." value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} required />
                        <Input type="date" value={newTaskDate} onChange={e => setNewTaskDate(e.target.value)} required />
                        <Button type="submit" className="w-full">Add Task</Button>
                    </form>

                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                        {tasks.map(task => (
                            <div key={task._id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700 flex items-center justify-between group">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <button onClick={() => toggleTask(task._id, task.completed)} className={`flex-shrink-0 ${task.completed ? 'text-green-500' : 'text-gray-300 hover:text-indigo-500'}`}>
                                        <FiCheckCircle size={20} />
                                    </button>
                                    <div className="min-w-0">
                                        <p className={`font-medium truncate ${task.completed ? 'text-gray-400 line-through' : 'text-gray-800 dark:text-gray-200'}`}>{task.title}</p>
                                        <p className="text-xs text-gray-500">{format(task.date, 'MMM d')}</p>
                                    </div>
                                </div>
                                <button onClick={() => deleteTask(task._id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <FiTrash2 />
                                </button>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Calendar;
