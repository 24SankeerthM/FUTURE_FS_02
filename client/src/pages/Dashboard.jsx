import { useState, useEffect } from 'react';
import { Card } from '../components/ui';
import api from '../api/axios';
import { FiUsers, FiUserCheck, FiTarget, FiAlertCircle } from 'react-icons/fi';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import AnnouncementBoard from '../components/AnnouncementBoard';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/leads/stats');
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch stats', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="p-10 text-center">Loading Analytics...</div>;
    if (!stats) return <div className="p-4">Error loading stats. Please refresh.</div>;

    const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

    const sourceData = stats.leadsBySource?.map(item => ({ name: item._id, value: item.count })) || [];
    const growthData = stats.monthlyGrowth?.map(item => ({ name: item._id, leads: item.count })) || [];
    // Fallback if empty
    if (growthData.length === 0) growthData.push({ name: 'Current', leads: stats.totalLeads });

    const statusData = [
        { name: 'New', value: stats.newLeads },
        { name: 'Contacted', value: stats.contacted },
        { name: 'Converted', value: stats.converted },
        { name: 'Lost', value: stats.lost },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
            <AnnouncementBoard />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="flex items-center gap-4 border-l-4 border-l-blue-500">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><FiUsers size={24} /></div>
                    <div>
                        <p className="text-sm text-gray-500">Total Leads</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalLeads}</h3>
                    </div>
                </Card>
                <Card className="flex items-center gap-4 border-l-4 border-l-green-500">
                    <div className="p-3 bg-green-100 text-green-600 rounded-full"><FiUserCheck size={24} /></div>
                    <div>
                        <p className="text-sm text-gray-500">Converted</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.converted}</h3>
                    </div>
                </Card>
                <Card className="flex items-center gap-4 border-l-4 border-l-yellow-500">
                    <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full"><FiTarget size={24} /></div>
                    <div>
                        <p className="text-sm text-gray-500">Active</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.newLeads + stats.contacted}</h3>
                    </div>
                </Card>
                <Card className="flex items-center gap-4 border-l-4 border-l-red-500">
                    <div className="p-3 bg-red-100 text-red-600 rounded-full"><FiAlertCircle size={24} /></div>
                    <div>
                        <p className="text-sm text-gray-500">Lost</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.lost}</h3>
                    </div>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Traffic Sources">
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={sourceData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {sourceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="Lead Distribution">
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={statusData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <Card title="Monthly Growth (Leads Created)">
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={growthData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="leads" fill="#10B981" name="New Leads" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
};
export default Dashboard;
