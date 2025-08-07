const express = require('express')
const { agentRegisteration,AgentLogin, getAgentProfile } = require('../Controller/AgentControl')

const AgentRoute = express.Router()

AgentRoute.post('/agentreg',agentRegisteration)
AgentRoute.post('/agentlogin',AgentLogin)
AgentRoute.get('/profile/:id',getAgentProfile)
module.exports = AgentRoute