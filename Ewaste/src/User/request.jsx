import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './usernavbar';
import './request.css';
// import { Recycle, Facebook, Twitter, Instagram, Mail, ChevronRight, ChevronLeft } from 'lucide-react';
// import Footer from './Footer';

export default function Request() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [formData, setFormData] = useState({
    ewasteType: '',
    quantity: 1,
    pickupDate: '',
    timeSlot: '',
    notes: '',
    image: null
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const data = new FormData();
        data.append('ewasteType', formData.ewasteType);
        data.append('quantity', formData.quantity);
        data.append('pickupDate', formData.pickupDate);
        data.append('timeSlot', formData.timeSlot);
        data.append('notes', formData.notes);
        if (formData.image) data.append('image', formData.image);
        data.append('latitude', latitude);
        data.append('longitude', longitude);

        try {
          await axios.post(`${API_BASE_URL}/api/req/request`, data, {
            headers: {
              Authorization: localStorage.getItem('token')
            }
          });

          toast.success('E-waste request submitted successfully!');
          setFormData({
            ewasteType: '',
            quantity: 1,
            pickupDate: '',
            timeSlot: '',
            notes: '',
            image: null
          });

          setTimeout(() => navigate('/homepage'), 2000); // slight delay for user to see toast
        } catch (err) {
          const errorMsg = err.response?.data?.message || err.message || 'Submission failed';
          toast.error(errorMsg);
        }
      },
      (err) => {
        toast.error("Failed to get location: " + err.message);
      }
    );
  };

  return (
    <>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container py-5" style={{marginTop:"50px"}}>
        <div className="card mx-auto" style={{ maxWidth: '600px' }}>
          <div className="card-header bg-success text-white">
            <h4 className="mb-0">E-Waste Pickup Request</h4>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="mb-3">
                <label className="form-label">Type of E-Waste</label>
                <select
                  name="ewasteType"
                  className="form-select"
                  value={formData.ewasteType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select type…</option>
                  <option value="Mobile Phones">Mobile Phones</option>
                  <option value="Laptops/Computers">Laptops / Computers</option>
                  <option value="Televisions">Televisions</option>
                  <option value="Refrigerators">Refrigerators</option>
                  <option value="Washing Machines">Washing Machines</option>
                  <option value="Batteries">Batteries</option>
                  <option value="Printers/Scanners">Printers / Scanners</option>
                  <option value="Cables/Chargers">Cables / Chargers</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div className="row">
                <div className="mb-3 col-md-6">
                  <label className="form-label">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    className="form-control"
                    min="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3 col-md-6">
                  <label className="form-label">Pickup Date</label>
                  <input
                    type="date"
                    name="pickupDate"
                    className="form-control"
                    value={formData.pickupDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Time Slot</label>
                <select
                  name="timeSlot"
                  className="form-select"
                  value={formData.timeSlot}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose slot…</option>
                  <option>Morning (9 AM–12 PM)</option>
                  <option>Afternoon (12 PM–4 PM)</option>
                  <option>Evening (4 PM–7 PM)</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Additional Notes</label>
                <textarea
                  name="notes"
                  className="form-control"
                  rows="3"
                  value={formData.notes}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label">Upload Image (optional)</label>
                <input
                  type="file"
                  name="image"
                  className="form-control"
                  accept="image/*"
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="btn btn-success w-100">
                Submit Request
              </button>
            </form>
          </div>
        </div>
        {/* <Footer/> */}
      </div>
    </>
  );
}
