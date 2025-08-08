// src/Agent/AgentMapView.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import AgentNavbar from './agentnav';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function AgentMapView() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [requests, setRequests] = useState([]);

 useEffect(() => {
  const agentId = localStorage.getItem('agentId'); // or sessionStorage, depending on how you store it

  if (!agentId) {
    console.error('Agent ID not found in local storage');
    return;
  }

  axios.get(`${API_BASE_URL}/api/req/approvedrequests`, {
    headers: {
      'x-agent-id': agentId
    }
  })
    .then(res => {
      console.log('All Approved Requests:', res.data);
      const withLocations = res.data.map(r => ({
        id: r._id,
        lat: r.latitude,
        lng: r.longitude
      }));
      console.log('Location Check:', withLocations);
      setRequests(res.data);
    })
    .catch(err => {
      console.error('Error fetching approved requests:', err.message);
    });
}, []);


  const validRequests = requests.filter(req => req.latitude && req.longitude);

  return (
    <>
    <AgentNavbar/>
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer center={[10.008, 76.362]} zoom={10} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='© OpenStreetMap contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />

        {validRequests.map((req, idx) => {
          const latOffset = parseFloat(req.latitude) + idx * 0.0001;
          const lngOffset = parseFloat(req.longitude) + idx * 0.0001;

          return (
            <Marker key={idx} position={[latOffset, lngOffset]}>
              <Popup>
                <strong>{req.user?.name || 'User'}</strong><br />
                Type: {req.ewasteType}<br />
                Qty: {req.quantity}<br />
                Date: {new Date(req.pickupDate).toLocaleDateString()}<br />
                Time: {req.timeSlot}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
    </>
  );
}
