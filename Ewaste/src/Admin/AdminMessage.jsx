import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';
import AdminNavbar from './adminNavbar';

export default function AdminMessages() {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/getmsg`);
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/delmsg`, {
        headers: { userid: id },
      });
      fetchMessages(); // Refresh after deletion
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  const getBadgeClasses = (sentiment) => {
    switch (sentiment) {
      case 'Positive':
        return 'bg-green-100 text-green-800 border border-green-300';
      case 'Negative':
        return 'bg-red-100 text-red-800 border border-red-300';
      case 'Neutral':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  return (
    <>
    <AdminNavbar/>
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📨 User Messages</h1>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className="bg-white rounded-2xl shadow-md p-5 transition hover:shadow-lg border border-gray-200"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-800">{msg.name}</h2>
              <span className={`text-sm px-3 py-1 rounded-full ${getBadgeClasses(msg.sentiment)}`}>
                {msg.sentiment}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1"><strong>Email:</strong> {msg.email}</p>
            <p className="text-gray-700 mb-3 whitespace-pre-line break-words">{msg.message}</p>
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500">
                Score: <span className="font-medium">{msg.score}</span>
              </span>
              <button
                onClick={() => handleDelete(msg._id)}
                className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="col-span-full text-center text-gray-500 mt-10">
            No messages found.
          </div>
        )}
      </div>
    </div>
    </>
  );
}
