'use client';

import { useState } from 'react';
import { Plus, Trash2, Download } from 'lucide-react';

interface GSTItem {
  id: number;
  description: string;
  hsnCode: string;
  quantity: string;
  rate: string;
  gstRate: string;
}

let nextId = 1;

export function GstInvoiceGeneratorTool() {
  const [invoiceNumber, setInvoiceNumber] = useState('GST-INV-001');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [placeOfSupply, setPlaceOfSupply] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [supplierGSTIN, setSupplierGSTIN] = useState('');
  const [supplierAddress, setSupplierAddress] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientGSTIN, setRecipientGSTIN] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [isInterState, setIsInterState] = useState(false);
  const [items, setItems] = useState<GSTItem[]>([
    { id: nextId++, description: '', hsnCode: '', quantity: '1', rate: '0', gstRate: '18' },
  ]);
  const [showPreview, setShowPreview] = useState(false);

  const addItem = () => {
    setItems([...items, { id: nextId++, description: '', hsnCode: '', quantity: '1', rate: '0', gstRate: '18' }]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: number, field: keyof GSTItem, value: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const calculations = items.map((item) => {
    const qty = parseFloat(item.quantity) || 0;
    const rate = parseFloat(item.rate) || 0;
    const gst = parseFloat(item.gstRate) || 0;
    const amount = qty * rate;
    const gstAmount = (amount * gst) / 100;
    return { ...item, amount, gstAmount, cgst: gstAmount / 2, sgst: gstAmount / 2 };
  });

  const totalAmount = calculations.reduce((sum, item) => sum + item.amount, 0);
  const totalGST = calculations.reduce((sum, item) => sum + item.gstAmount, 0);
  const grandTotal = totalAmount + totalGST;

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6">
      {showPreview ? (
        <div className="bg-white text-gray-900 p-8 rounded-xl border border-gray-200 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">TAX INVOICE</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400"># {invoiceNumber} | Date: {invoiceDate}</p>
            {placeOfSupply && <p className="text-sm text-gray-600 dark:text-gray-400">Place of Supply: {placeOfSupply}</p>}
          </div>

          <div className="grid grid-cols-2 gap-8 mb-6 text-sm">
            <div>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Supplier</h3>
              <p className="font-medium text-gray-900 dark:text-white">{supplierName || 'Supplier Name'}</p>
              <p className="text-gray-600 dark:text-gray-400">GSTIN: {supplierGSTIN || 'N/A'}</p>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">{supplierAddress || 'Address'}</p>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Recipient</h3>
              <p className="font-medium text-gray-900 dark:text-white">{recipientName || 'Recipient Name'}</p>
              <p className="text-gray-600 dark:text-gray-400">GSTIN: {recipientGSTIN || 'N/A'}</p>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">{recipientAddress || 'Address'}</p>
            </div>
          </div>

          <table className="w-full text-sm mb-6">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 text-gray-600 dark:text-gray-400 font-medium">Description</th>
                <th className="text-left py-3 text-gray-600 dark:text-gray-400 font-medium w-20">HSN</th>
                <th className="text-right py-3 text-gray-600 dark:text-gray-400 font-medium w-16">Qty</th>
                <th className="text-right py-3 text-gray-600 dark:text-gray-400 font-medium w-24">Rate</th>
                <th className="text-right py-3 text-gray-600 dark:text-gray-400 font-medium w-24">Amount</th>
                <th className="text-right py-3 text-gray-600 dark:text-gray-400 font-medium w-16">GST%</th>
                <th className="text-right py-3 text-gray-600 dark:text-gray-400 font-medium w-24">GST Amt</th>
              </tr>
            </thead>
            <tbody>
              {calculations.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 text-gray-900 dark:text-white">{item.description || '-'}</td>
                  <td className="py-3 text-gray-700 dark:text-gray-300">{item.hsnCode || '-'}</td>
                  <td className="py-3 text-right text-gray-700 dark:text-gray-300">{parseFloat(item.quantity) || 0}</td>
                  <td className="py-3 text-right text-gray-700 dark:text-gray-300">₹{(parseFloat(item.rate) || 0).toFixed(2)}</td>
                  <td className="py-3 text-right font-medium text-gray-900 dark:text-white">₹{item.amount.toFixed(2)}</td>
                  <td className="py-3 text-right text-gray-700 dark:text-gray-300">{item.gstRate}%</td>
                  <td className="py-3 text-right text-gray-700 dark:text-gray-300">₹{item.gstAmount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className="w-80 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal (before GST)</span>
                <span className="text-gray-900 dark:text-white">₹{totalAmount.toFixed(2)}</span>
              </div>
              {isInterState ? (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">IGST</span>
                  <span className="text-gray-700 dark:text-gray-300">₹{totalGST.toFixed(2)}</span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">CGST</span>
                    <span className="text-gray-700 dark:text-gray-300">₹{(totalGST / 2).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">SGST</span>
                    <span className="text-gray-700 dark:text-gray-300">₹{(totalGST / 2).toFixed(2)}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2">
                <span className="font-semibold text-gray-900 dark:text-white">Grand Total</span>
                <span className="text-lg font-bold text-brand-600 dark:text-brand-400">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="label">Invoice Number</label>
                <input type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} className="input mt-1" />
              </div>
              <div>
                <label className="label">Date</label>
                <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} className="input mt-1" />
              </div>
              <div>
                <label className="label">Place of Supply</label>
                <input type="text" value={placeOfSupply} onChange={(e) => setPlaceOfSupply(e.target.value)} placeholder="e.g. Maharashtra" className="input mt-1" />
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <label className="label mb-0">Transaction Type:</label>
              <button onClick={() => setIsInterState(false)} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${!isInterState ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                Intra-State (CGST + SGST)
              </button>
              <button onClick={() => setIsInterState(true)} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${isInterState ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                Inter-State (IGST)
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Supplier Details</label>
                <input type="text" value={supplierName} onChange={(e) => setSupplierName(e.target.value)} placeholder="Company / Name" className="input mt-1" />
                <input type="text" value={supplierGSTIN} onChange={(e) => setSupplierGSTIN(e.target.value)} placeholder="GSTIN" className="input mt-2" />
                <textarea value={supplierAddress} onChange={(e) => setSupplierAddress(e.target.value)} placeholder="Address" className="input mt-2 min-h-[60px]" />
              </div>
              <div>
                <label className="label">Recipient Details</label>
                <input type="text" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Company / Name" className="input mt-1" />
                <input type="text" value={recipientGSTIN} onChange={(e) => setRecipientGSTIN(e.target.value)} placeholder="GSTIN" className="input mt-2" />
                <textarea value={recipientAddress} onChange={(e) => setRecipientAddress(e.target.value)} placeholder="Address" className="input mt-2 min-h-[60px]" />
              </div>
            </div>

            <div>
              <label className="label">Items</label>
              <div className="space-y-3 mt-2">
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-4">
                      <input type="text" value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} placeholder="Description" className="input" />
                    </div>
                    <div className="col-span-2">
                      <input type="text" value={item.hsnCode} onChange={(e) => updateItem(item.id, 'hsnCode', e.target.value)} placeholder="HSN" className="input" />
                    </div>
                    <div className="col-span-1">
                      <input type="number" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', e.target.value)} placeholder="Qty" className="input" min="0" />
                    </div>
                    <div className="col-span-2">
                      <input type="number" value={item.rate} onChange={(e) => updateItem(item.id, 'rate', e.target.value)} placeholder="Rate" className="input" min="0" />
                    </div>
                    <div className="col-span-2">
                      <select value={item.gstRate} onChange={(e) => updateItem(item.id, 'gstRate', e.target.value)} className="input">
                        <option value="0">0%</option>
                        <option value="5">5%</option>
                        <option value="12">12%</option>
                        <option value="18">18%</option>
                        <option value="28">28%</option>
                      </select>
                    </div>
                    <div className="col-span-1 flex gap-1">
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

            <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-800/50 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="text-gray-900 dark:text-white">₹{totalAmount.toFixed(2)}</span>
              </div>
              {isInterState ? (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">IGST</span>
                  <span className="text-gray-700 dark:text-gray-300">₹{totalGST.toFixed(2)}</span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">CGST</span>
                    <span className="text-gray-700 dark:text-gray-300">₹{(totalGST / 2).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">SGST</span>
                    <span className="text-gray-700 dark:text-gray-300">₹{(totalGST / 2).toFixed(2)}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2">
                <span className="font-semibold text-gray-900 dark:text-white">Grand Total</span>
                <span className="text-xl font-bold text-brand-600 dark:text-brand-400">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button onClick={() => setShowPreview(true)} className="btn-primary flex items-center gap-2">
              <Download size={16} /> Preview &amp; Print
            </button>
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
