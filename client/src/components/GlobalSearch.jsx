import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiCommand } from 'react-icons/fi';
import { Card } from './ui';
import api from '../api/axios';

const GlobalSearch = ({ onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    useEffect(() => {
        const search = async () => {
            if (query.trim().length < 2) {
                setResults([]);
                return;
            }
            try {
                // We'll reuse the leads endpoint with a search param for now, 
                // in a real app we'd have a dedicated /search endpoint aggregating Leads, Users, Tasks etc.
                const { data } = await api.get(`/leads?search=${query}`);
                setResults(data);
            } catch (error) {
                console.error(error);
            }
        };

        const timeout = setTimeout(search, 300);
        return () => clearTimeout(timeout);
    }, [query]);

    const handleSelect = (leadId) => {
        navigate('/leads'); // Ideally Navigate to Detail View, but we'll go to Leads for now
        // In a real app: navigate(`/leads/${leadId}`);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="w-full max-w-2xl px-4" onClick={e => e.stopPropagation()}>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiSearch className="text-gray-400" size={20} />
                    </div>
                    <input
                        autoFocus
                        type="text"
                        className="w-full pl-12 pr-4 py-4 rounded-xl border-0 shadow-2xl bg-white dark:bg-gray-800 text-lg focus:ring-2 focus:ring-indigo-500 dark:text-white"
                        placeholder="Search leads..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <kbd className="hidden sm:inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 text-xs rounded border border-gray-200 dark:border-gray-600">ESC</kbd>
                    </div>
                </div>

                {results.length > 0 && (
                    <Card className="mt-4 max-h-96 overflow-y-auto p-0">
                        <ul className="divide-y dark:divide-gray-700">
                            {results.map(lead => (
                                <li
                                    key={lead._id}
                                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                                    onClick={() => handleSelect(lead._id)}
                                >
                                    <h4 className="font-medium text-gray-900 dark:text-white">{lead.name}</h4>
                                    <p className="text-sm text-gray-500">{lead.email} • {lead.status}</p>
                                </li>
                            ))}
                        </ul>
                    </Card>
                )}

                {query.length >= 2 && results.length === 0 && (
                    <div className="mt-4 text-center text-gray-200">No results found</div>
                )}
            </div>
        </div>
    );
};

export default GlobalSearch;
