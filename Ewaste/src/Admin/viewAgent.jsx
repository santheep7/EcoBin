import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Table, Spinner, Alert, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { gsap } from 'gsap';
import confetti from 'canvas-confetti';
import './viewagent.css';
import AdminNavbar from './adminNavbar';

export default function ViewAgentsAdmin() {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const tableRef = useRef(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/admin/getagent`);
        setAgents(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching agents:', err);
        setError('Failed to load agents.');
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  useEffect(() => {
    if (!loading && agents.length > 0 && tableRef.current) {
      const rows = tableRef.current.querySelectorAll('tbody tr');
      gsap.fromTo(
        rows,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
        }
      );
    }
  }, [loading, agents]);

  const handleDelete = async (agentId) => {
    const confirmDelete = window.confirm('Are you sure you want to reject this agent?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/admin/delagent`, {
        headers: { userid: agentId }
      });
      setAgents(prev => prev.filter(agent => agent._id !== agentId));

      // Rejection-style confetti ❌
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ff0000', '#880000'],
      });
    } catch (err) {
      console.error('Failed to delete agent:', err);
      setError('Failed to delete agent.');
    }
  };

  const handleApprove = async (agentId) => {
    try {
      await axios.put(`${API_BASE_URL}/api/admin/approveagent/${agentId}`);
      setAgents(prev =>
        prev.map(agent =>
          agent._id === agentId ? { ...agent, isApproved: true } : agent
        )
      );

      // Celebration confetti 🎉
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error('Failed to approve agent:', err);
      setError('Failed to approve agent.');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger" className="mt-3 text-center">{error}</Alert>;
  }

  if (agents.length === 0) {
    return <Alert variant="info" className="mt-3 text-center">No agents found.</Alert>;
  }

  return (
    <>
      <AdminNavbar />
      <div className="container mt-4">
        <h3 className="mb-4">All Registered Agents</h3>
        <Table ref={tableRef} striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Aadhar ID</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Joined On</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent, idx) => (
              <tr key={agent._id}>
                <td>{idx + 1}</td>
                <td>{agent.agentname}</td>
                <td>{agent.adharid}</td>
                <td>{agent.email}</td>
                <td>{agent.phone}</td>
                <td>{new Date(agent.createdAt).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}</td>
                <td>
                  <span className={`badge ${agent.isApproved ? 'bg-success' : 'bg-warning text-dark'}`}>
                    {agent.isApproved ? 'Verified' : 'Pending'}
                  </span>
                </td>
                <td>
                  <Button
                    variant="success"
                    size="sm"
                    className="me-2"
                    onClick={() => handleApprove(agent._id)}
                    disabled={agent.isApproved}
                  >
                    {agent.isApproved ? 'Approved' : 'Approve'}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(agent._id)}
                  >
                    Reject
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
}
