import React from 'react';

export default function StatusAlert({ status }) {
  if (!status) return null;

  const styles = {
    success: 'bg-green-900/50 border-green-500 text-green-300',
    info: 'bg-blue-900/50 border-blue-500 text-blue-300',
    error: 'bg-red-900/50 border-red-500 text-red-300',
  };

  return (
    <div className={`mt-4 p-4 rounded-lg border text-sm font-semibold ${styles[status.type]}`}>
      {status.message}
    </div>
  );
}