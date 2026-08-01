import React, { useState } from 'react';
import * as XLSX from 'xlsx';

export default function FileUploader({ emails, setEmails, setStatus }) {
  const [activeTab, setActiveTab] = useState('excel'); // 'excel' | 'text' | 'manual'
  const [textInput, setTextInput] = useState('');
  const [singleEmail, setSingleEmail] = useState('');

  // 1. Excel Upload Handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const extractedEmails = [];
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

      jsonData.forEach((row) => {
        row.forEach((cell) => {
          if (cell) {
            const matches = cell.toString().match(emailRegex);
            if (matches) extractedEmails.push(...matches);
          }
        });
      });

      const uniqueEmails = [...new Set(extractedEmails)];
      setEmails(uniqueEmails);
      setStatus({
        type: 'info',
        message: `Extracted ${uniqueEmails.length} unique email(s) from Excel!`,
      });
    };

    reader.readAsArrayBuffer(file);
  };

  // 2. Textarea Parser (Commas, Spaces, or Newlines)
  const handleTextChange = (e) => {
    const value = e.target.value;
    setTextInput(value);

    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const matches = value.match(emailRegex) || [];
    const uniqueEmails = [...new Set(matches)];

    setEmails(uniqueEmails);
  };

  // 3. Add Single Email Manually
  const handleAddSingleEmail = (e) => {
    e.preventDefault();
    if (!singleEmail.trim()) return;

    if (!emails.includes(singleEmail.trim())) {
      setEmails([...emails, singleEmail.trim()]);
    }
    setSingleEmail('');
  };

  // Delete an email from current list
  const handleRemoveEmail = (index) => {
    const updated = emails.filter((_, i) => i !== index);
    setEmails(updated);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Mode Selection Tabs */}
      <div className="flex border-b border-slate-700">
        <button
          type="button"
          onClick={() => setActiveTab('excel')}
          className={`py-2 px-4 text-xs font-bold transition-all ${
            activeTab === 'excel'
              ? 'border-b-2 border-blue-500 text-blue-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          📄 Excel File
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('text')}
          className={`py-2 px-4 text-xs font-bold transition-all ${
            activeTab === 'text'
              ? 'border-b-2 border-blue-500 text-blue-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          📝 Paste List
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('manual')}
          className={`py-2 px-4 text-xs font-bold transition-all ${
            activeTab === 'manual'
              ? 'border-b-2 border-blue-500 text-blue-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          ✏️ One by One
        </button>
      </div>

      {/* Tab 1: Excel File */}
      {activeTab === 'excel' && (
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-300">
            Select Excel Sheet (.xlsx / .xls):
          </label>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="p-2 bg-slate-700 border border-slate-600 rounded-lg text-xs text-slate-200 cursor-pointer focus:outline-none"
          />
        </div>
      )}

      {/* Tab 2: Paste List */}
      {activeTab === 'text' && (
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-300">
            Paste emails (separated by commas or lines):
          </label>
          <textarea
            rows="3"
            value={textInput}
            onChange={handleTextChange}
            placeholder="example1@gmail.com, example2@gmail.com"
            className="p-2.5 bg-slate-700 border border-slate-600 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>
      )}

      {/* Tab 3: One by One */}
      {activeTab === 'manual' && (
        <div className="flex gap-2">
          <input
            type="email"
            value={singleEmail}
            onChange={(e) => setSingleEmail(e.target.value)}
            placeholder="enter recipient email..."
            className="flex-1 p-2 bg-slate-700 border border-slate-600 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          />
          <button
            type="button"
            onClick={handleAddSingleEmail}
            className="px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs cursor-pointer"
          >
            Add
          </button>
        </div>
      )}

      {/* Recipients Preview Tag Cloud */}
      {emails.length > 0 && (
        <div className="flex flex-col gap-2 bg-slate-900 p-3 rounded-lg border border-slate-700">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-300">
              Total Recipients: {emails.length}
            </span>
            <button
              type="button"
              onClick={() => setEmails([])}
              className="text-red-400 hover:underline cursor-pointer"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto pt-1">
            {emails.map((email, idx) => (
              <span
                key={idx}
                className="bg-slate-800 text-slate-300 border border-slate-600 px-2 py-1 rounded text-xs flex items-center gap-1"
              >
                {email}
                <button
                  type="button"
                  onClick={() => handleRemoveEmail(idx)}
                  className="text-slate-400 hover:text-red-400 ml-1"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
