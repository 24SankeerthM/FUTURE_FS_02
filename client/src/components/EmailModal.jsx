import { useState } from 'react';
import { Card, Button, Input } from '../components/ui';
import { FiX, FiSend, FiZap } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import api from '../api/axios';

const EmailModal = ({ lead, onClose }) => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [template, setTemplate] = useState('');

    const templates = {
        welcome: { subject: "Welcome to our Service", body: `Hi ${lead.name},\n\nThanks for signing up! We'd love to chat.` },
        followup: { subject: "Checking in", body: `Hi ${lead.name},\n\nJust wanted to follow up on our last conversation.` },
        closing: { subject: "Proposal", body: `Hi ${lead.name},\n\nPlease find the attached proposal.` }
    };

    const handleTemplateChange = (e) => {
        const t = e.target.value;
        setTemplate(t);
        if (t && templates[t]) {
            setSubject(templates[t].subject);
            setMessage(templates[t].body);
        }
    };

    const handleAIAssist = async () => {
        toast.loading('AI is generating usage...', { id: 'ai' });
        await new Promise(resolve => setTimeout(resolve, 1500));

        const aiSubject = `Strategy for ${lead.company || lead.name}`;
        const aiBody = `Hi ${lead.name},\n\nI analyzed your current market position content and I believe we can increase your efficiency by 20%.\n\nOur AI-driven solution aligns perfectly with your goals.\n\nBest,\n[Your Name]`;

        setSubject(aiSubject);
        setMessage(aiBody);
        toast.dismiss('ai');
        toast.success('AI Content Generated!');
    };

    const handleSend = async (e) => {
        e.preventDefault();
        try {
            // Simulate sending
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Log to timeline
            await api.put(`/leads/${lead._id}`, {
                status: lead.status // Just to trigger update middleware 
            });
            // Ideally we'd have a separate endpoint for "log activity", but we use the update hook for now 
            // or we can add a specific note
            await api.post(`/leads/${lead._id}/note`, { text: `EMAIL SENT: ${subject}` });

            toast.success('Email sent successfully');
            onClose();
        } catch (error) {
            toast.error('Failed to send email');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <Card className="w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold dark:text-white">Email {lead.name}</h2>
                    <button onClick={onClose}><FiX size={24} /></button>
                </div>
                <form onSubmit={handleSend} className="space-y-4">
                    <div>
                        <div className="flex justify-between mb-1">
                            <label className="text-sm font-medium dark:text-gray-300">Template</label>
                            <button type="button" onClick={handleAIAssist} className="text-xs flex items-center gap-1 text-indigo-600 font-bold hover:underline">
                                <FiZap /> Ask AI to Write
                            </button>
                        </div>
                        <select
                            className="w-full border rounded p-2 dark:bg-gray-800 dark:border-gray-700"
                            value={template}
                            onChange={handleTemplateChange}
                        >
                            <option value="">Select a template...</option>
                            <option value="welcome">Welcome</option>
                            <option value="followup">Follow-up</option>
                            <option value="closing">Closing</option>
                        </select>
                    </div>
                    <Input label="Subject" value={subject} onChange={e => setSubject(e.target.value)} required />
                    <div>
                        <label className="text-sm font-medium mb-1 block dark:text-gray-300">Message</label>
                        <textarea
                            className="w-full h-32 border rounded p-2 dark:bg-gray-800 dark:border-gray-700 font-mono text-sm"
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 hover:bg-gray-300">Cancel</Button>
                        <Button type="submit"><FiSend className="mr-1" /> Send Email</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default EmailModal;
