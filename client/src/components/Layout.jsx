import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
    FiHome,
    FiUsers,
    FiLogOut,
    FiMenu,
    FiX,
    FiMoon,
    FiSun,
    FiCalendar,
    FiUser,
    FiSearch,
    FiMessageSquare,
    FiAward,
    FiFileText
} from 'react-icons/fi';
import clsx from 'clsx';
import GlobalSearch from './GlobalSearch';
import FocusMode from './FocusMode';
import { FiTarget } from 'react-icons/fi';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [showFocusMode, setShowFocusMode] = useState(false);
    const [taskCount, setTaskCount] = useState(0);
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setShowSearch(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const checkTasks = async () => {
        try {
            const { data } = await api.get('/tasks');
            const today = new Date().toISOString().split('T')[0];
            const dueToday = data.filter(t => t.date && t.date.startsWith(today) && !t.completed).length;
            setTaskCount(dueToday);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (user) checkTasks();
    }, [user]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { icon: FiHome, label: 'Dashboard', path: '/' },
        { icon: FiUsers, label: 'Leads', path: '/leads' },
        { icon: FiCalendar, label: 'Calendar', path: '/calendar', badge: taskCount },
        { icon: FiMessageSquare, label: 'Team Chat', path: '/chat' },
        { icon: FiAward, label: 'Leaderboard', path: '/leaderboard' },
        { icon: FiFileText, label: 'Quote Generator', path: '/quotes' },
        { icon: FiUser, label: 'Profile', path: '/profile' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-200">
            {/* Sidebar Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={clsx(
                "fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 lg:transform-none flex flex-col",
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        CRM Pro
                    </span>
                    <button
                        className="ml-auto lg:hidden text-gray-500"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <FiX size={24} />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                            )}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <item.icon size={20} />
                            {item.label}
                            {item.badge > 0 && (
                                <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                    {item.badge}
                                </span>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                            {user?.name?.[0] || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {user?.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {user?.role}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                        <FiLogOut size={20} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 lg:px-8">
                    <button
                        className="lg:hidden text-gray-500"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <FiMenu size={24} />
                    </button>

                    <div className="hidden md:flex items-center text-gray-400 text-sm bg-gray-100 dark:bg-gray-700/50 px-3 py-1.5 rounded-md cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => setShowSearch(true)}>
                        <FiSearch className="mr-2" />
                        <span>Search...</span>
                        <kbd className="ml-4 font-sans text-xs border border-gray-300 dark:border-gray-600 rounded px-1">⌘K</kbd>
                    </div>

                    <div className="flex items-center gap-4 ml-auto">
                        <button
                            onClick={() => setShowFocusMode(true)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-md text-sm font-medium hover:bg-indigo-200 transition-colors"
                        >
                            <FiTarget /> Focus
                        </button>
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-4 lg:p-8">
                    <Outlet />
                </div>
            </main>

            {showSearch && <GlobalSearch onClose={() => setShowSearch(false)} />}
            {showFocusMode && <FocusMode onClose={() => setShowFocusMode(false)} />}
        </div>
    );
};

export default Layout;
