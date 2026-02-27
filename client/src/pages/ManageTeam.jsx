import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Card, Button } from '../components/ui';
import { FiTrash2, FiShield } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const ManageTeam = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/users');
            setUsers(data);
        } catch (error) {
            toast.error('Failed to fetch users. Are you admin?');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Remove this user?')) return;
        try {
            await api.delete(`/users/${id}`);
            setUsers(users.filter(u => u._id !== id));
            toast.success('User removed');
        } catch (error) {
            toast.error('Failed to remove user');
        }
    };

    const makeAdmin = async (id) => {
        try {
            await api.put(`/users/${id}/role`, { role: 'admin' });
            setUsers(users.map(u => u._id === id ? { ...u, role: 'admin' } : u));
            toast.success('User promoted to Admin');
        } catch (error) {
            toast.error('Failed to update role');
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Team Management</h1>
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                        <thead className="bg-gray-50 dark:bg-gray-700 text-xs uppercase text-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className="border-b dark:border-gray-700 bg-white dark:bg-gray-800">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{user.name}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex gap-2">
                                        {user.role !== 'admin' && (
                                            <Button onClick={() => makeAdmin(user._id)} className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                                                <FiShield size={14} className="mr-1" /> Make Admin
                                            </Button>
                                        )}
                                        <button onClick={() => handleDelete(user._id)} className="text-red-600 hover:text-red-800">
                                            <FiTrash2 />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default ManageTeam;
