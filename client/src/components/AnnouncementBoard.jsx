import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Card } from './ui';
import { FiBell, FiInfo, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

const AnnouncementBoard = () => {
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const { data } = await api.get('/announcements');
                setAnnouncements(data);
            } catch (error) {
                console.error("Failed to fetch announcements:", error);
            }
        };
        fetchAnnouncements();
    }, []);

    if (announcements.length === 0) return null;

    const getIcon = (type) => {
        switch (type) {
            case 'warning': return <FiAlertTriangle className="text-yellow-500" />;
            case 'success': return <FiCheckCircle className="text-green-500" />;
            default: return <FiInfo className="text-blue-500" />;
        }
    };

    const getBgColor = (type) => {
        switch (type) {
            case 'warning': return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
            case 'success': return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
            default: return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
        }
    };

    return (
        <Card className="mb-6">
            <div className="flex items-center gap-2 mb-4">
                <FiBell className="text-indigo-600" />
                <h3 className="font-bold text-gray-900 dark:text-white">Announcements</h3>
            </div>
            <div className="space-y-3">
                {announcements.map((item) => (
                    <div key={item._id} className={`p-4 rounded-lg border flex gap-3 ${getBgColor(item.type)}`}>
                        <div className="mt-1">{getIcon(item.type)}</div>
                        <div>
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200">{item.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{item.message}</p>
                            <span className="text-xs text-gray-400 mt-2 block">
                                {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default AnnouncementBoard;
