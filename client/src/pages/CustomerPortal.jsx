import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../components/ui';
import { FiCheckCircle, FiClock, FiCheck } from 'react-icons/fi';

// Mock data simulation since we don't have a public API endpoint for this without auth
const mockPortalData = {
    steps: [
        { name: 'Application Received', status: 'completed', date: '2023-10-01' },
        { name: 'Initial Review', status: 'completed', date: '2023-10-02' },
        { name: 'Document Verification', status: 'current', date: 'In Progress' },
        { name: 'Final Approval', status: 'pending', date: '-' },
    ],
    clientName: 'Valued Customer',
    project: 'Premium Service Implementation'
};

const CustomerPortal = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);

    useEffect(() => {
        // Simulate fetch
        setTimeout(() => {
            setData(mockPortalData);
        }, 800);
    }, [id]);

    if (!data) return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading Portal...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-10 flex justify-center">
            <Card className="w-full max-w-3xl h-fit">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-indigo-700 mb-2">Project Status Portal</h1>
                    <p className="text-gray-500">Tracking ID: {id}</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-8">
                    <h2 className="text-xl font-semibold mb-1">Hello, {data.clientName}</h2>
                    <p className="text-gray-600">Your project <strong>{data.project}</strong> is moving forward.</p>
                </div>

                <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                    <div className="space-y-8">
                        {data.steps.map((step, index) => {
                            const isCompleted = step.status === 'completed';
                            const isCurrent = step.status === 'current';

                            return (
                                <div key={index} className="relative flex items-start gap-6">
                                    <div className={`z-10 w-16 h-16 rounded-full flex items-center justify-center border-4 ${isCompleted ? 'bg-green-100 border-green-500 text-green-600' :
                                            isCurrent ? 'bg-indigo-100 border-indigo-500 text-indigo-600 animate-pulse' :
                                                'bg-gray-100 border-gray-200 text-gray-300'
                                        }`}>
                                        {isCompleted ? <FiCheck size={28} /> :
                                            isCurrent ? <FiClock size={28} /> :
                                                <div className="w-3 h-3 rounded-full bg-gray-300"></div>}
                                    </div>
                                    <div className={`pt-2 ${isCurrent ? 'text-indigo-700' : 'text-gray-600'}`}>
                                        <h3 className={`text-lg font-bold ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'}`}>
                                            {step.name}
                                        </h3>
                                        <p className="text-sm text-gray-500">{step.date}</p>
                                        {isCurrent && (
                                            <p className="text-sm text-indigo-600 mt-1 font-medium">
                                                Our team is currently working on this stage.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t text-center text-sm text-gray-400">
                    &copy; 2026 CRM Pro Inc. All updates are real-time.
                </div>
            </Card>
        </div>
    );
};

export default CustomerPortal;
