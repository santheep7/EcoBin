import Button from 'react-bootstrap/Button';
import React from 'react';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './adminlogin.css'
export default function AdminLogin() {
  const [admin, setadmin] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setadmin({ ...admin, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      admin.email.trim().toLowerCase() === 'admin@gmail.com' &&
      admin.password.trim().toLowerCase() === '12345'
    ) {
      toast.success('Login Successful');
      setTimeout(() => {
        navigate('/adminhome');
      }, 2000);
      setadmin({ email: '', password: '' });
    } else {
      toast.error('Invalid credentials');
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="admin-login-bg d-flex justify-content-center align-items-center"

        style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}
      >
        <Form
          onSubmit={handleSubmit}
          className="p-4 shadow rounded bg-white"
          style={{ width: '100%', maxWidth: '400px' }}
        >
          <h4 className="text-center mb-4 text-primary">Admin Login</h4>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter email"
              value={admin.email}
              onChange={handleChange}
              required
            />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              value={admin.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Remember me" />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Login
          </Button>
        </Form>
      </div>
    </>
  );
}
