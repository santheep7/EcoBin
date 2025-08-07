import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Lazy imports
const Register = lazy(() => import('./User/Userregister'));
const Login = lazy(() => import('./User/login'));
const Home = lazy(() => import('./User/homepage'));
const Request = lazy(() => import('./User/request'));
const MyRequests = lazy(() => import('./User/UserRequest'));
const ViewApprovedRequests =lazy(()=>import('./Agent/viewuserRequest')) ;
const AgentRegister =lazy(()=> import('./Agent/agentreg'));
const ViewAgentsAdmin =lazy(()=> import('./Admin/viewAgent'));
const ViewProfile = lazy(() => import('./Agent/profile'));
const AdminLogin = lazy(() => import('./Admin/adminlogin'));
const AdminHome = lazy(() => import('./Admin/adminhome'));
const AgentMapView = lazy(() => import('./Agent/AgentMapView'));
const UserHome = lazy(() => import('./User/home'));
const GetUser = lazy(() => import('./Admin/viewuser'));
const ViewRequests = lazy(() => import('./Admin/viewrequest'));
const AgentHome =lazy(()=>import('./Agent/agenthome'));
const AgentLogin =lazy(()=>import('./Agent/agentlogin'));
const ContactForm =lazy(()=>import('./User/contact'));
const AdminMessages = lazy(()=>import('./Admin/AdminMessage'))
export default function App() {
  return (
    <Router>
      <Suspense fallback={<div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading...</div>}>
        <Routes>
          <Route path='/AdminMessage' element={<AdminMessages/>} />
          <Route path="/homepage" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<ContactForm />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/Userregister" element={<Register />} />
          <Route path="/request" element={<Request />} />
          <Route path="/adminhome" element={<AdminHome />} />
          <Route path="/viewuser" element={<GetUser />} />
          <Route path="/viewrequest" element={<ViewRequests />} />
          <Route path="/UserRequest" element={<MyRequests />} />
          <Route path="/agentreg" element={<AgentRegister />} />
          <Route path="/agenthome" element={<AgentHome/>} />
          <Route path="/agentlogin" element={<AgentLogin/>} />
          <Route path="/viewAgent" element={<ViewAgentsAdmin/>} />
          <Route path="/viewuserRequest" element={<ViewApprovedRequests/>} />
          <Route path="/profile" element={<ViewProfile/>} />
          <Route path="/AgentMapView" element={<AgentMapView />} />
          <Route path="/" element={<UserHome />} />

          
        </Routes>
      </Suspense>
    </Router>
  );
}
