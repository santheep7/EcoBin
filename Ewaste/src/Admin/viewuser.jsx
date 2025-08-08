import React, { useEffect, useState, useRef } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import AdminNavbar from './adminNavbar';

export default function GetUser() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [users, setUsers] = useState([]);
  const tableBodyRef = useRef(null);

  const fetchUsers = () => {
    axios.get(`${API_BASE_URL}/api/admin/getuser`)
      .then(response => setUsers(response.data))
      .catch(error => console.error("Error fetching users:", error));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (tableBodyRef.current) {
      gsap.fromTo(
        tableBodyRef.current.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: "power2.out"
        }
      );
    }
  }, [users]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      axios.delete(`${API_BASE_URL}/api/admin/deleteuser`, {
        headers: { userid: id }
      })
        .then(() => {
          // Red blast confetti for deletion ❌
          confetti({
            particleCount: 80,
            spread: 70,
            angle: 120,
            origin: { y: 0.6 },
            colors: ['#ff0000', '#990000'],
          });

          setUsers(prev => prev.filter(user => user._id !== id)); // update UI
        })
        .catch(error => {
          console.error("Error deleting user:", error);
          alert("Failed to delete user");
        });
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="container mt-5">
        <h3 className="mb-4">Registered Users</h3>
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Place</th>
              <th>Address</th>
              <th>Email</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody ref={tableBodyRef}>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.phone}</td>
                  <td>{user.place}</td>
                  <td>{user.address}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.createdAt).toLocaleString()}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center text-muted">No users found.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </>
  );
}
