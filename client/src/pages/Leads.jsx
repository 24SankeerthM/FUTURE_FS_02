import { useState, useEffect } from 'react';
import api from '../api/axios';
import LeadModal from '../components/LeadModal';
import { Card, Button, Input } from '../components/ui';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ImportModal from '../components/ImportModal';
// import LeadMap from '../components/LeadMap';
import { FiPlus, FiGrid, FiList, FiTrash2, FiEdit2, FiX, FiSearch, FiUpload, FiMail, FiMap } from 'react-icons/fi';

const Leads = () => {
    const [leads, setLeads] = useState([]);
    const [view, setView] = useState('kanban'); // 'kanban' or 'list'
    // Form state
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', source: '', status: 'New' });
    const [editingId, setEditingId] = useState(null);
    const [filters, setFilters] = useState({
        status: '',
        source: '',
        search: ''
    });
    const [loading, setLoading] = useState(false);

    // Modals
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLead, setEditingLead] = useState(null);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const [showImportModal, setShowImportModal] = useState(false);

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/leads');
            setLeads(data);
        } catch (error) {
            toast.error('Failed to fetch leads');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/leads/${id}`);
            setLeads(leads.filter(l => l._id !== id));
            toast.success('Lead deleted');
        } catch (error) {
            toast.error('Failed to delete lead');
        }
    };

    const handleOnDragEnd = async (result) => {
        if (!result.destination) return;
        const { source, destination, draggableId } = result;

        if (source.droppableId !== destination.droppableId) {
            // Optimistic update
            const newLeads = Array.from(leads);
            const leadIndex = newLeads.findIndex(l => l._id === draggableId);
            newLeads[leadIndex].status = destination.droppableId;
            setLeads(newLeads);

            try {
                await api.put(`/leads/${draggableId}`, { status: destination.droppableId });
            } catch (error) {
                toast.error('Failed to update status');
                fetchLeads(); // Revert
            }
        }
    };
    // Kept the old function name for DnD compatibility alias
    const onDragEnd = handleOnDragEnd;

    const handleCreateOrUpdate = async (data) => {
        try {
            if (editingLead) {
                await api.put(`/leads/${editingLead._id}`, data);
                toast.success('Lead updated');
            } else {
                await api.post('/leads', data);
                toast.success('Lead created');
            }
            setIsModalOpen(false);
            setEditingLead(null);
            fetchLeads();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error saving lead');
        }
    };

    // DEPRECATED: Old form submit handler, kept for reference if needed but logic moved to LeadModal
    const handleSubmit = async (e) => {
        e.preventDefault();
    };

    const filteredLeads = leads.filter(lead => {
        const matchesSearch =
            lead.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            lead.email.toLowerCase().includes(filters.search.toLowerCase()) ||
            lead.source.toLowerCase().includes(filters.search.toLowerCase()) ||
            (lead.tags && lead.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase())));

        const matchesStatus = filters.status ? lead.status === filters.status : true;

        return matchesSearch && matchesStatus;
    });

    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedLeads = [...filteredLeads].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const SortIcon = ({ column }) => {
        if (sortConfig.key !== column) return <span className="opacity-20 ml-1">⇅</span>;
        return <span className="ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>;
    };

    const handleImportSuccess = () => {
        toast.success('Leads imported successfully!');
        setShowImportModal(false);
        fetchLeads();
    };

    const renderListView = () => (
        <Card className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" onClick={() => handleSort('name')}>Name <SortIcon column="name" /></th>
                        <th className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" onClick={() => handleSort('email')}>Email <SortIcon column="email" /></th>
                        <th className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" onClick={() => handleSort('source')}>Source <SortIcon column="source" /></th>
                        <th className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" onClick={() => handleSort('score')}>Score <SortIcon column="score" /></th>
                        <th className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" onClick={() => handleSort('status')}>Status <SortIcon column="status" /></th>
                        <th className="px-6 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" onClick={() => handleSort('createdAt')}>Date <SortIcon column="createdAt" /></th>
                        <th className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedLeads.map((lead) => (
                        <tr key={lead._id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{lead.name}</td>
                            <td className="px-6 py-4">{lead.email}</td>
                            <td className="px-6 py-4">{lead.source}</td>
                            <td className="px-6 py-4">
                                <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">{lead.score}</span>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded text-xs text-white ${lead.status === 'New' ? 'bg-blue-500' :
                                    lead.status === 'Contacted' ? 'bg-yellow-500' :
                                        lead.status === 'Converted' ? 'bg-green-500' : 'bg-red-500'
                                    }`}>{lead.status}</span>
                            </td>
                            <td className="px-6 py-4">{new Date(lead.createdAt).toLocaleDateString()}</td>
                            <td className="px-6 py-4 flex gap-2">
                                <button onClick={() => { setEditingLead(lead); setIsModalOpen(true); }} className="text-blue-600 hover:underline"><FiEdit2 /></button>
                                <button onClick={() => handleDelete(lead._id)} className="text-red-600 hover:underline"><FiTrash2 /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    );

    return (
        <div className="space-y-6">
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <Input
                    placeholder="Search leads..."
                    icon={FiSearch}
                    className="max-w-xs"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
                <div className="flex gap-2">
                    <Button onClick={() => setShowImportModal(true)} variant="outline" className="flex items-center gap-2">
                        <FiUpload /> Import CSV
                    </Button>
                    <select
                        className="border rounded-lg px-3 py-2 bg-white dark:bg-gray-800 dark:border-gray-700"
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                        <option value="">All Status</option>
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Converted">Converted</option>
                        <option value="Lost">Lost</option>
                    </select>
                    <Button onClick={() => { setEditingLead(null); setIsModalOpen(true); }} className="flex items-center gap-2">
                        <FiPlus /> Add Lead
                    </Button>
                </div>
            </div>

            <div className="flex justify-end gap-2 border-b dark:border-gray-700 pb-2">
                <button
                    onClick={() => setView('list')}
                    className={`p-2 rounded ${view === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500'}`}
                >
                    <FiList />
                </button>
                <button
                    onClick={() => setView('kanban')}
                    className={`p-2 rounded ${view === 'kanban' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500'}`}
                >
                    <FiGrid />
                </button>
                <button
                    onClick={() => setView('map')}
                    className={`p-2 rounded ${view === 'map' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-500'}`}
                >
                    <FiMap />
                </button>
            </div>

            {/* Content */}
            {
                loading ? (
                    <div className="text-center py-10">Loading leads...</div>
                ) : view === 'list' ? (
                    renderListView()
                ) : view === 'map' ? (
                    <div>Map Component Temporarily Disabled</div>
                    // <LeadMap leads={leads} />
                ) : (
                    <DragDropContext onDragEnd={onDragEnd}>
                        <div className="flex gap-6 overflow-x-auto pb-6">
                            {['New', 'Contacted', 'Converted', 'Lost'].map(status => (
                                <div key={status} className="flex-shrink-0 w-80">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold text-gray-700 dark:text-gray-300">{status}</h3>
                                        <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded text-xs">
                                            {leads.filter(l => l.status === status).length}
                                        </span>
                                    </div>
                                    <Droppable droppableId={status}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.droppableProps}
                                                className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-xl min-h-[500px] space-y-4"
                                            >
                                                {leads
                                                    .filter(l => l.status === status)
                                                    .map((lead, index) => (
                                                        <Draggable key={lead._id} draggableId={lead._id} index={index}>
                                                            {(provided) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                >
                                                                    <Card className="hover:shadow-lg transition-shadow cursor-pointer relative group">
                                                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                                            <button onClick={(e) => { e.stopPropagation(); setShowEmailModal(true); setSelectedLead(lead); }} className="p-1 hover:bg-blue-100 rounded text-blue-600" title="Send Email">
                                                                                <FiMail />
                                                                            </button>
                                                                            <button onClick={() => handleDelete(lead._id)} className="p-1 hover:bg-red-100 rounded text-red-600">
                                                                                <FiTrash2 />
                                                                            </button>
                                                                        </div>
                                                                        <div onClick={() => { setEditingLead(lead); setIsModalOpen(true); }}>
                                                                            <h4 className="font-medium text-gray-900 dark:text-white">{lead.name}</h4>
                                                                            <p className="text-sm text-gray-500 truncate">{lead.email}</p>
                                                                            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                                                                                <span>{lead.source}</span>
                                                                                <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                                                                            </div>
                                                                        </div>
                                                                    </Card>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            ))}
                        </div>
                    </DragDropContext>
                )
            }

            {
                isModalOpen && (
                    <LeadModal
                        isOpen={isModalOpen}
                        onClose={() => { setIsModalOpen(false); setEditingLead(null); }}
                        onSubmit={handleCreateOrUpdate}
                        initialData={editingLead}
                    />
                )
            }

            {
                showEmailModal && selectedLead && (
                    <EmailModal
                        lead={selectedLead}
                        onClose={() => { setShowEmailModal(false); setSelectedLead(null); }}
                    />
                )
            }

            {
                showImportModal && (
                    <ImportModal
                        onClose={() => setShowImportModal(false)}
                        onImportSuccess={handleImportSuccess}
                    />
                )
            }
        </div >
    );
};

export default Leads;
