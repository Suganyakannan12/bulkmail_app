import React from 'react';

export default function EmailForm({
  subject,
  setSubject,
  message,
  setMessage,
  loading,
  onSubmit,
  disabled,
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 mt-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-slate-300">Subject:</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter subject..."
          required
          className="p-2.5 bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold text-slate-300">Message Body:</label>
        <textarea
          rows="4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message here..."
          required
          className="p-2.5 bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={disabled || loading}
        className={`py-3 rounded-lg font-bold transition-all ${
          disabled || loading
            ? 'bg-slate-600 cursor-not-allowed text-slate-400'
            : 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer'
        }`}
      >
        {loading ? 'Sending Emails...' : 'Send Bulk Mail'}
      </button>
    </form>
  );
}