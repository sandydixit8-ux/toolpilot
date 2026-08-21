'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface BOQItem {
  id: number;
  name: string;
  quantity: string;
  unit: string;
  rate: string;
}

let nextId = 1;

const unitOptions = ['pcs', 'kg', 'm', 'm2', 'm3', 'ltr', 'nos', 'set', 'lot'];

export function BoqCalculatorTool() {
  const [projectName, setProjectName] = useState('');
  const [items, setItems] = useState<BOQItem[]>([
    { id: nextId++, name: '', quantity: '1', unit: 'pcs', rate: '0' },
  ]);

  const addItem = () => {
    setItems([...items, { id: nextId++, name: '', quantity: '1', unit: 'pcs', rate: '0' }]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: number, field: keyof BOQItem, value: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const calculations = items.map((item) => {
    const qty = parseFloat(item.quantity) || 0;
    const rate = parseFloat(item.rate) || 0;
    return { ...item, amount: qty * rate };
  });

  const total = calculations.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="card">
      <div className="space-y-6">
        <div>
          <label className="label">Project / BOQ Name</label>
          <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="e.g. Office Renovation" className="input mt-1" />
        </div>

        <div>
          <label className="label">Bill of Quantities</label>
          <div className="mt-3 space-y-3">
            <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 px-1">
              <div className="col-span-4">Item Name</div>
              <div className="col-span-2">Quantity</div>
              <div className="col-span-2">Unit</div>
              <div className="col-span-2">Rate</div>
              <div className="col-span-2">Amount</div>
            </div>
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4">
                  <input type="text" value={item.name} onChange={(e) => updateItem(item.id, 'name', e.target.value)} placeholder="Item description" className="input" />
                </div>
                <div className="col-span-2">
                  <input type="number" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', e.target.value)} placeholder="Qty" className="input" min="0" />
                </div>
                <div className="col-span-2">
                  <select value={item.unit} onChange={(e) => updateItem(item.id, 'unit', e.target.value)} className="input">
                    {unitOptions.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <input type="number" value={item.rate} onChange={(e) => updateItem(item.id, 'rate', e.target.value)} placeholder="Rate" className="input" min="0" />
                </div>
                <div className="col-span-2 flex items-center gap-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    ₹{calculations.find(c => c.id === item.id)?.amount.toFixed(2) || '0.00'}
                  </span>
                  <button onClick={() => removeItem(item.id)} disabled={items.length <= 1} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={addItem} className="mt-3 flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium">
            <Plus size={16} /> Add Item
          </button>
        </div>

        <div className="rounded-xl bg-gray-50 p-5 dark:bg-gray-800/50">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Total Items</span>
              <span className="text-gray-900 dark:text-white">{items.length}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2">
              <span className="font-semibold text-gray-900 dark:text-white">Total Cost</span>
              <span className="text-xl font-bold text-brand-600 dark:text-brand-400">₹{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
