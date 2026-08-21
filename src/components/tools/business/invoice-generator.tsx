'use client';

import { useState } from 'react';
import { Plus, Trash2, Download } from 'lucide-react';

interface LineItem {
  id: number;
  description: string;
  quantity: string;
  rate: string;
}

let nextId = 1;

export function InvoiceGeneratorTool() {
  const [invoiceNumber, setInvoiceNumber] = useState('INV-001');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [fromName, setFromName] = useState('');
  const [fromAddress, setFromAddress] = useState('');
  const [toName, setToName] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [items, setItems] = useState<LineItem[]>([
    { id: nextId++, description: '', quantity: '1', rate: '0' },
  ]);
  const [taxPercent, setTaxPercent] = useState('0');
  const [discountPercent, setDiscountPercent] = useState('0');
  const [showPreview, setShowPreview] = useState(false);

  const addItem = () => {
    setItems([...items, { id: nextId++, description: '', quantity: '1', rate: '0' }]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: number, field: keyof LineItem, value: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const subtotal = items.reduce((sum, item) => {
    return sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0);
  }, 0);

  const discountAmount = (subtotal * (parseFloat(discountPercent) || 0)) / 100;
  const afterDiscount = subtotal - discountAmount;
  const taxAmount = (afterDiscount * (parseFloat(taxPercent) || 0)) / 100;
  const total = afterDiscount + taxAmount;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {showPreview ? (
        <div id="invoice-preview" className="bg-white text-gray-900 p-8 rounded-xl border border-gray-200 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">INVOICE</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1"># {invoiceNumber}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Date: {invoiceDate}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">From</h3>
              <p className="font-medium text-gray-900 dark:text-white">{fromName || 'Your Name'}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">{fromAddress || 'Your Address'}</p>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">To</h3>
              <p className="font-medium text-gray-900 dark:text-white">{toName || 'Client Name'}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">{toAddress || 'Client Address'}</p>
            </div>
          </div>
          <table className="w-full text-sm mb-6">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 text-gray-600 dark:text-gray-400 font-medium">Description</th>
                <th className="text-right py-3 text-gray-600 dark:text-gray-400 font-medium w-20">Qty</th>
                <th className="text-right py-3 text-gray-600 dark:text-gray-400 font-medium w-28">Rate</th>
                <th className="text-right py-3 text-gray-600 dark:text-gray-400 font-medium w-28">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const qty = parseFloat(item.quantity) || 0;
                const rate = parseFloat(item.rate) || 0;
                return (
                  <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-3 text-gray-900 dark:text-white">{item.description || '-'}</td>
                    <td className="py-3 text-right text-gray-700 dark:text-gray-300">{qty}</td>
                    <td className="py-3 text-right text-gray-700 dark:text-gray-300">₹{rate.toFixed(2)}</td>
                    <td className="py-3 text-right text-gray-900 dark:text-white font-medium">₹{(qty * rate).toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="text-gray-900 dark:text-white">₹{subtotal.toFixed(2)}</span>
              </div>
              {parseFloat(discountPercent) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Discount ({discountPercent}%)</span>
                  <span className="text-green-600 dark:text-green-400">-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              {parseFloat(taxPercent) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Tax ({taxPercent}%)</span>
                  <span className="text-gray-700 dark:text-gray-300">₹{taxAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2">
                <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                <span className="text-lg font-bold text-brand-600 dark:text-brand-400">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Invoice Number</label>
                <input type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} className="input mt-1" />
              </div>
              <div>
                <label className="label">Date</label>
                <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} className="input mt-1" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">From (Your Details)</label>
                <input type="text" value={fromName} onChange={(e) => setFromName(e.target.value)} placeholder="Your name / company" className="input mt-1" />
                <textarea value={fromAddress} onChange={(e) => setFromAddress(e.target.value)} placeholder="Your address" className="input mt-2 min-h-[80px]" />
              </div>
              <div>
                <label className="label">To (Client Details)</label>
                <input type="text" value={toName} onChange={(e) => setToName(e.target.value)} placeholder="Client name / company" className="input mt-1" />
                <textarea value={toAddress} onChange={(e) => setToAddress(e.target.value)} placeholder="Client address" className="input mt-2 min-h-[80px]" />
              </div>
            </div>

            <div>
              <label className="label">Line Items</label>
              <div className="space-y-3 mt-2">
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-5">
                      <input type="text" value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} placeholder="Description" className="input" />
                    </div>
                    <div className="col-span-2">
                      <input type="number" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', e.target.value)} placeholder="Qty" className="input" min="0" />
                    </div>
                    <div className="col-span-3">
                      <input type="number" value={item.rate} onChange={(e) => updateItem(item.id, 'rate', e.target.value)} placeholder="Rate" className="input" min="0" />
                    </div>
                    <div className="col-span-2 flex gap-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400 leading-10 mr-1">
                        ₹{((parseFloat(item.quantity) || 0) * (parseFloat(item.rate) || 0)).toFixed(2)}
                      </span>
                      <button onClick={() => removeItem(item.id)} disabled={items.length <= 1} className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={addItem} className="mt-3 flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium">
                <Plus size={16} /> Add Item
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Tax (%)</label>
                <input type="number" value={taxPercent} onChange={(e) => setTaxPercent(e.target.value)} className="input mt-1" min="0" max="100" />
              </div>
              <div>
                <label className="label">Discount (%)</label>
                <input type="number" value={discountPercent} onChange={(e) => setDiscountPercent(e.target.value)} className="input mt-1" min="0" max="100" />
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-800/50">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="text-gray-900 dark:text-white">₹{subtotal.toFixed(2)}</span>
                </div>
                {parseFloat(discountPercent) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Discount</span>
                    <span className="text-green-600 dark:text-green-400">-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                {parseFloat(taxPercent) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Tax</span>
                    <span className="text-gray-700 dark:text-gray-300">₹{taxAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2">
                  <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                  <span className="text-xl font-bold text-brand-600 dark:text-brand-400">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowPreview(true)} className="btn-primary flex items-center gap-2">
                <Download size={16} /> Preview & Print
              </button>
            </div>
          </div>
        </div>
      )}

      {showPreview && (
        <div className="flex gap-3">
          <button onClick={() => setShowPreview(false)} className="btn-secondary">Back to Edit</button>
          <button onClick={handlePrint} className="btn-primary flex items-center gap-2">
            <Download size={16} /> Print / Download
          </button>
        </div>
      )}
    </div>
  );
}
