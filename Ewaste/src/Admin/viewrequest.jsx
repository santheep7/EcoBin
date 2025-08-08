import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from './adminNavbar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ViewRequests() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/req/getrequest`);
        setRequests(data);
      } catch (err) {
        console.error(err);
        setError('Could not load pickup requests.');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/req/updatestatus/${id}`, { status: newStatus });
      setRequests(prev =>
        prev.map(r => (r._id === id ? { ...r, status: newStatus } : r))
      );
      toast.success('Status updated successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status');
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-red-600 p-4">{error}</div>;

  return (
    <>
      <AdminNavbar />
      <div className="p-4">
        <ToastContainer position="top-right" />
        <h2 className="text-xl font-semibold mb-4">E-Waste Pickup Requests</h2>
        {requests.length === 0 ? (
          <p>No pickup requests found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {requests.map(req => {
              const {
                _id,
                ewasteType,
                quantity,
                pickupDate,
                timeSlot,
                notes,
                status = 'Pending',
                image,
                user: { name, email, phone, place, address },
              } = req;
              const isCancelled = status.toLowerCase() === 'cancelled';
              return (
                <div key={_id} className={`rounded shadow-md p-3 ${isCancelled ? 'border-2 border-red-500' : 'border'} bg-white text-sm`}>
                  {image ? (
                    <img
                      src={`${API_BASE_URL}/uploads/${image}`}
                      alt="E-waste"
                      className="w-full h-32 object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gray-200 flex items-center justify-center rounded">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}

                  <div className="mt-2">
                    <p><strong>{name}</strong></p>
                    <p><strong>Contact:</strong> {phone}</p>
                    <p><strong>Email:</strong> {email}</p>
                    <p><strong>Place:</strong> {place}</p>
                    <p><strong>Address:</strong> {address}</p>
                    <p><strong>Type:</strong> {ewasteType}</p>
                    <p><strong>Qty:</strong> {quantity}</p>
                    <p><strong>Date:</strong> {new Date(pickupDate).toLocaleDateString()}</p>
                    <p><strong>Slot:</strong> {timeSlot}</p>
                    <p><strong>Notes:</strong> {notes || '—'}</p>
                  </div>

                  <div className="mt-2">
                    <label htmlFor={`status-${_id}`} className="block text-sm font-medium mb-1">Status</label>
                    <select
                      id={`status-${_id}`}
                      className={`w-full border rounded px-2 py-1 text-sm ${isCancelled ? 'bg-red-500 text-white' : ''}`}
                      value={status}
                      onChange={e => handleStatusChange(_id, e.target.value)}
                      disabled={isCancelled}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
