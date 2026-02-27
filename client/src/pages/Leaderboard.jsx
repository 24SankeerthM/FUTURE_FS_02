import { useState, useEffect } from 'react';
import { Card } from '../components/ui';
import api from '../api/axios';
import { FiAward, FiTrendingUp, FiActivity, FiStar } from 'react-icons/fi';

const Leaderboard = () => {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, this would be a dedicated endpoint like /users/leaderboard
        // For now, we mimic it or assume an endpoint exists
        // fetchLeaderboard();

        // Mock data for demonstration as backend aggregation might take time to implement fully
        setTimeout(() => {
            setStats([
                { id: 1, name: 'Alice Johnson', deals: 15, revenue: 45000, score: 98 },
                { id: 2, name: 'Bob Smith', deals: 12, revenue: 32000, score: 85 },
                { id: 3, name: 'Charlie Brown', deals: 10, revenue: 28000, score: 79 },
                { id: 4, name: 'Diana Prince', deals: 8, revenue: 21000, score: 72 },
            ]);
            setLoading(false);
        }, 800);
    }, []);

    const Podium = ({ user, rank }) => (
        <div className={`flex flex-col items-center ${rank === 1 ? '-mt-4' : ''}`}>
            <div className="mb-2 relative">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold border-4 ${rank === 1 ? 'border-yellow-400 bg-yellow-100 text-yellow-600' :
                    rank === 2 ? 'border-gray-300 bg-gray-100 text-gray-600' :
                        'border-orange-300 bg-orange-100 text-orange-600'
                    }`}>
                    {user.name.charAt(0)}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
                    {rank}
                </div>
            </div>
            <p className="font-bold text-gray-900 dark:text-white">{user.name}</p>
            <p className="text-sm text-gray-500">{user.deals} Deals</p>
        </div>
    );

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FiAward className="text-yellow-500" /> Sales Leaderboard
            </h1>

            {!loading && stats.length >= 3 && (
                <div className="flex justify-center items-end gap-8 py-8">
                    <Podium user={stats[1]} rank={2} />
                    <Podium user={stats[0]} rank={1} />
                    <Podium user={stats[2]} rank={3} />
                </div>
            )}

            <Card>
                <h3 className="text-lg font-semibold mb-4">Full Rankings</h3>
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 text-sm">
                        <tr>
                            <th className="p-3 rounded-tl-lg">Rank</th>
                            <th className="p-3">Agent</th>
                            <th className="p-3">Deals Closed</th>
                            <th className="p-3">Revenue (Est)</th>
                            <th className="p-3 rounded-tr-lg">Engagement Score</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-gray-700">
                        {stats.map((user, index) => (
                            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <td className="p-3 font-medium text-gray-500">#{index + 1}</td>
                                <td className="p-3 font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs">
                                        {user.name.charAt(0)}
                                    </div>
                                    {user.name}
                                </td>
                                <td className="p-3">{user.deals}</td>
                                <td className="p-3">${user.revenue.toLocaleString()}</td>
                                <td className="p-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 bg-gray-200 rounded-full h-2">
                                            <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${user.score}%` }}></div>
                                        </div>
                                        <span className="text-xs">{user.score}</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export default Leaderboard;
