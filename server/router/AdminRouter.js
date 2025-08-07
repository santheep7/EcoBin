const express = require('express')
const { getuser, deluser, getAgent, delagent, approveAgent, getAdminStats, getmessage, delmsg } = require('../Controller/AdminControl')
const AdminRoute = express.Router()

AdminRoute.get('/getuser',getuser)
AdminRoute.delete('/deleteuser',deluser)
AdminRoute.get('/getagent',getAgent)
AdminRoute.delete('/delagent',delagent)
AdminRoute.put('/approveagent/:id',approveAgent)
AdminRoute.get('/stats',getAdminStats)
AdminRoute.get('/getmsg',getmessage)
AdminRoute.delete('/delmsg',delmsg)
module.exports = AdminRoute;