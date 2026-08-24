'use client';

import { useState } from 'react';
import { QrCode, Copy, Check, Heart } from 'lucide-react';

const UPI_ID = 'sandeep.dixit23@kotak';
const MERCHANT_NAME = 'ToolPilot';
const UPI_URL = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(MERCHANT_NAME)}&cu=INR`;

export function UpiPayment() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6 dark:border-gray-700 dark:from-green-950/20 dark:to-emerald-950/20">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="h-5 w-5 text-green-600 dark:text-green-400" />
        <h3 className="font-semibold text-gray-900 dark:text-white">Support ToolPilot</h3>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        If these tools helped you, consider buying us a coffee! Scan the QR code or use the UPI ID below.
      </p>

      <div className="flex flex-col items-center gap-4">
        <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 dark:bg-gray-900">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(UPI_URL)}&bgcolor=ffffff&color=000000`}
            alt="UPI QR Code"
            width={180}
            height={180}
            className="rounded-lg"
          />
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">UPI ID</p>
          <div className="flex items-center gap-2">
            <code className="px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg text-sm font-mono font-medium text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700">
              {UPI_ID}
            </code>
            <button onClick={handleCopy} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="Copy UPI ID">
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-gray-400" />}
            </button>
          </div>
        </div>

        <a
          href={UPI_URL}
          className="w-full sm:w-auto px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors text-center flex items-center justify-center gap-2"
        >
          <QrCode className="h-4 w-4" />
          Pay via UPI
        </a>
      </div>
    </div>
  );
}
