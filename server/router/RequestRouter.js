// routes/Reqrouter.js
const express = require('express');
const upload = require('../middleware/upload');
const { verifyToken } = require('../auth/jwtwebtoken');
const { createRequest, getAllRequests, getUserRequests, cancelRequest, updateRequestStatus, updatePickupStatus, getApprovedRequests, getLocationCount, getRecycledDeviceCount } = require('../Controller/RequestControl');

const Reqrouter = express.Router();

// ⚠️ verifyToken comes before upload.single()
Reqrouter.post(
  '/request',
  verifyToken,
  upload.single('image'),
  createRequest
);
Reqrouter.get('/GetUserRequest',getUserRequests)
Reqrouter.get('/getrequest',getAllRequests)
Reqrouter.put('/CancelRequest/:id',cancelRequest)
Reqrouter.patch('/updatestatus/:id',updateRequestStatus)
Reqrouter.get('/approvedrequests', getApprovedRequests);
Reqrouter.patch('/updatepickupstatus/:id', updatePickupStatus);
Reqrouter.get('/loc',getLocationCount)
Reqrouter.get('/getrecyclecount',getRecycledDeviceCount)
module.exports = Reqrouter;
