import { useState, useEffect } from 'react';
import { FiX, FiCheckCircle, FiClock, FiTarget } from 'react-icons/fi';
import api from '../api/axios';

const FocusMode = ({ onClose }) => {
    const [tasks, setTasks] = useState([]);
    const [time, setTime] = useState(new Date());
    const [duration, setDuration] = useState(0); // Seconds focused

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
            setDuration(d => d + 1);
        }, 1000);

        fetchTodayTasks();
        return () => clearInterval(timer);
    }, []);

    const fetchTodayTasks = async () => {
        try {
            const { data } = await api.get('/tasks');
            const today = new Date().toISOString().split('T')[0];
            const dueToday = data.filter(t => t.date && t.date.startsWith(today) && !t.completed);
            setTasks(dueToday);
        } catch (error) {
            console.error(error);
        }
    };

    const formatDuration = (secs) => {
        const mins = Math.floor(secs / 60);
        const s = secs % 60;
        return `${mins}:${s.toString().padStart(2, '0')}`;
    };

    const completeTask = async (id) => {
        try {
            await api.put(`/tasks/${id}`, { completed: true });
            setTasks(tasks.filter(t => t._id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col items-center justify-center text-white">
            <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-gray-800 rounded-full hover:bg-gray-700">
                <FiX size={24} />
            </button>

            <div className="text-center mb-12">
                <div className="text-6xl font-black mb-4 tracking-tight">
                    {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="flex items-center justify-center gap-2 text-indigo-400">
                    <FiClock />
                    <span className="text-xl font-mono">{formatDuration(duration)} in Focus</span>
                </div>
            </div>

            <div className="w-full max-w-2xl px-4">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <FiTarget className="text-green-400" />
                    Today's Objectives ({tasks.length})
                </h2>

                {tasks.length === 0 ? (
                    <div className="text-center p-8 bg-gray-800 rounded-2xl border border-gray-700">
                        <p className="text-gray-400 text-lg">No pending tasks for today. You are all caught up!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {tasks.map(task => (
                            <div key={task._id} className="bg-gray-800 p-6 rounded-2xl flex items-center justify-between border border-gray-700 hover:border-indigo-500 transition-colors">
                                <span className="text-xl">{task.title}</span>
                                <button
                                    onClick={() => completeTask(task._id)}
                                    className="p-3 bg-indigo-600 hover:bg-indigo-500 rounded-full transition-colors"
                                >
                                    <FiCheckCircle size={24} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FocusMode;
