import { useState, useRef } from 'react';
import { Card, Button } from '../components/ui';
import { FiX, FiUpload, FiDownload } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import Papa from 'papaparse';

const ImportModal = ({ onClose, onImportSuccess }) => {
    const fileInputRef = useRef();
    const [uploading, setUploading] = useState(false);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            complete: async (results) => {
                const leads = results.data
                    .filter(row => row.name && row.email) // Basic validation
                    .map(row => ({
                        name: row.name,
                        email: row.email,
                        phone: row.phone || '',
                        source: row.source || 'Import',
                        status: 'New'
                    }));

                if (leads.length === 0) {
                    toast.error('No valid leads found in CSV');
                    return;
                }

                setUploading(true);
                try {
                    await api.post('/leads/bulk', leads);
                    toast.success(`Successfully imported ${leads.length} leads`);
                    onImportSuccess();
                    onClose();
                } catch (error) {
                    toast.error('Import failed');
                    console.error(error);
                } finally {
                    setUploading(false);
                }
            },
            error: (error) => {
                toast.error('Error parsing CSV');
                console.error(error);
            }
        });
    };

    const downloadTemplate = () => {
        const csv = 'name,email,phone,source\nJohn Doe,john@example.com,555-0123,LinkedIn\nJane Smith,jane@test.com,555-9876,Web';
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'leads_template.csv';
        a.click();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <Card className="w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold dark:text-white">Import Leads</h2>
                    <button onClick={onClose}><FiX size={24} /></button>
                </div>

                <div className="space-y-6">
                    <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <FiUpload className="mx-auto h-10 w-10 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{uploading ? 'Uploading...' : 'Click to select .csv file'}</p>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".csv"
                            onChange={handleFileUpload}
                            disabled={uploading}
                        />
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">CSV Format Instructions</h4>
                        <ul className="list-disc pl-4 text-sm text-blue-700 dark:text-blue-400 space-y-1">
                            <li>Headers are required: name, email</li>
                            <li>Optional: phone, source</li>
                            <li>Download the template to get started</li>
                        </ul>
                        <button onClick={downloadTemplate} className="mt-3 text-sm flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline">
                            <FiDownload /> Download Template
                        </button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ImportModal;
