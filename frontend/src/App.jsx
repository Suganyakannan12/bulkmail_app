import React, { useState } from 'react';
import axios from 'axios';
import FileUploader from './components/FileUploader';
import EmailForm from './components/EmailForm';
import StatusAlert from './components/StatusAlert';

// Reads from .env or defaults to local backend server
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export default function App() {
  const [emails, setEmails] = useState([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emails.length === 0) return;

    setLoading(true);
    setStatus(null);

    try {
      const res = await axios.post(`${BACKEND_URL}/send-bulk-email`, {
        emailList: emails,
        subject,
        text: message,
      });

      setStatus({
        type: 'success',
        message: `Successfully sent ${res.data.totalSent} email(s)!`,
      });
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.response?.data?.message || 'Failed to communicate with backend.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-xl">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-400">
          📊 Bulk Email Dispatcher
        </h1>

        <FileUploader
          emails={emails}
          setEmails={setEmails}
          setStatus={setStatus}
        />

        <EmailForm
          subject={subject}
          setSubject={setSubject}
          message={message}
          setMessage={setMessage}
          loading={loading}
          onSubmit={handleSubmit}
          disabled={emails.length === 0}
        />

        <StatusAlert status={status} />
      </div>
    </div>
  );
}