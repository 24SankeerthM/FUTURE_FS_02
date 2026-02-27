import { useState } from 'react';
import { Card, Button, Input } from './ui';
import { FiPrinter, FiPlus, FiTrash } from 'react-icons/fi';

const QuoteGenerator = () => {
    const [items, setItems] = useState([{ description: 'Service A', quantity: 1, price: 100 }]);
    const [clientName, setClientName] = useState('');

    const addItem = () => setItems([...items, { description: '', quantity: 1, price: 0 }]);
    const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

    const updateItem = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const total = items.reduce((acc, item) => acc + (item.quantity * item.price), 0);

    return (
        <Card className="max-w-4xl mx-auto my-8">
            <div className="flex justify-between items-start mb-8 border-b pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">INVOICE / QUOTE</h1>
                    <p className="text-gray-500">#Q-{Math.floor(Math.random() * 10000)}</p>
                </div>
                <div className="text-right">
                    <h2 className="font-bold text-xl text-indigo-600">CRM Pro Inc.</h2>
                    <p className="text-sm text-gray-500">123 Business Rd</p>
                    <p className="text-sm text-gray-500">Tech City, TC 90210</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Bill To:</label>
                    <Input placeholder="Client Name or Company" value={clientName} onChange={e => setClientName(e.target.value)} />
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold text-gray-700">Date:</p>
                    <p>{new Date().toLocaleDateString()}</p>
                </div>
            </div>

            <table className="w-full mb-8">
                <thead>
                    <tr className="bg-gray-50 text-left text-sm text-gray-600 uppercase">
                        <th className="p-3">Description</th>
                        <th className="p-3 w-24">Qty</th>
                        <th className="p-3 w-32">Price</th>
                        <th className="p-3 w-32">Total</th>
                        <th className="p-3 w-10"></th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {items.map((item, index) => (
                        <tr key={index}>
                            <td className="p-2">
                                <Input
                                    value={item.description}
                                    onChange={e => updateItem(index, 'description', e.target.value)}
                                    className="border-none bg-transparent focus:ring-0"
                                    placeholder="Item description"
                                />
                            </td>
                            <td className="p-2">
                                <Input
                                    type="number"
                                    value={item.quantity}
                                    onChange={e => updateItem(index, 'quantity', Number(e.target.value))}
                                    className="border-none bg-transparent focus:ring-0"
                                />
                            </td>
                            <td className="p-2">
                                <Input
                                    type="number"
                                    value={item.price}
                                    onChange={e => updateItem(index, 'price', Number(e.target.value))}
                                    className="border-none bg-transparent focus:ring-0"
                                />
                            </td>
                            <td className="p-3 font-medium">
                                ${(item.quantity * item.price).toFixed(2)}
                            </td>
                            <td className="p-2 text-center">
                                <button onClick={() => removeItem(index)} className="text-red-400 hover:text-red-600">
                                    <FiTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-between items-center mb-8">
                <Button onClick={addItem} variant="outline" className="flex items-center gap-2 text-sm">
                    <FiPlus /> Add Line Item
                </Button>
                <div className="text-right">
                    <p className="text-gray-500">Total Amount</p>
                    <p className="text-3xl font-bold text-indigo-600">${total.toFixed(2)}</p>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t print:hidden">
                <Button onClick={() => window.print()} className="flex items-center gap-2">
                    <FiPrinter /> Print / Save PDF
                </Button>
            </div>
        </Card>
    );
};

export default QuoteGenerator;
