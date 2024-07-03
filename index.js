const express = require('express')
const axios = require("axios")
const requestIp = require('request-ip')
require('dotenv').config()

const app = express()
const port = 3000

const WEATHER_API_KEY = process.env.WEATHER_API_KEY

app.use(requestIp.mw())

app.get('/', (req, res) => {
   res.json({success: true, message: "Backend Connected Successfully."});
})

app.get('/api/hello', async (req, res) => {
  const { visitor_name } = req.query
  try {
    let userIp = req.clientIp

    if (userIp === '::1' || userIp === '127.0.0.1') {
      userIp = '8.8.8.8' // Example public IP address for testing
    }

    const userGeo = await axios.get(`http://api.weatherapi.com/v1/ip.json?key=${WEATHER_API_KEY}&q=${userIp}`)
    const location = userGeo.data.city

    const weather = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${userIp}`)
    const temperature = weather.data.current.temp_c
    
    res.json({
      client_ip: userIp,
      location,
      greeting: `Hello, ${visitor_name}! The temperature is ${temperature} degrees Celsius in ${location}`
    })
  }
  catch(err){
   console.log(err.message)
   res.status(404).json({success: false, message: err.message})
  }
})



app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})