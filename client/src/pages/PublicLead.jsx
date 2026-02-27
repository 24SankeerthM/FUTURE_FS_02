import { useState } from 'react';
import api from '../api/axios';
import { Card, Input, Button } from '../components/ui';
import { toast } from 'react-hot-toast';
import { FiSend, FiCheckCircle } from 'react-icons/fi';

const PublicLead = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/leads/public', formData);
            setSubmitted(true);
            toast.success('Thank you! We will contact you soon.');
        } catch (error) {
            toast.error('Submission failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Card className="max-w-md w-full text-center space-y-4 py-12">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiCheckCircle size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Message Sent!</h2>
                    <p className="text-gray-600">Thanks for reaching out. Our team has received your details and will get back to you shortly.</p>
                    <Button onClick={() => setSubmitted(false)} className="mt-4">
                        Send Another Message
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-indigo-600">Contact Us</h1>
                    <p className="mt-2 text-gray-600">Fill out the form below to get in touch with our team.</p>
                </div>

                <Card className="shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Your Name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                        <Input
                            label="Phone Number"
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-1">Message</label>
                            <textarea
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none h-32 resize-none"
                                placeholder="How can we help you?"
                                value={formData.message}
                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                            />
                        </div>

                        <Button type="submit" className="w-full flex justify-center items-center gap-2" disabled={loading}>
                            {loading ? 'Sending...' : <><FiSend /> Send Message</>}
                        </Button>
                    </form>
                </Card>

                <p className="text-center text-xs text-gray-400">
                    &copy; 2024 CRM Pro. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default PublicLead;
