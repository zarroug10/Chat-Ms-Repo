const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const messageRoute = require('./Route/messageRoutes');
const client = require('prom-client');
const app = express();
const PORT = process.env.PORT || 3004;




// Enable Prometheus metrics collection
const register = new client.Registry();
client.collectDefaultMetrics({ register });
 
// Create a histogram metric for the Incident Reporting Service
const messageHttpRequestDurationMicroseconds = new client.Histogram({
  name: 'message_http_request_duration_seconds',
  help: 'Duration of HTTP requests in microseconds for the Incident Reporting Service',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

// Register the histogram for the Message  Service
register.registerMetric(messageHttpRequestDurationMicroseconds);

// Middleware to measure request duration for the Message Reporting Service
app.use((req, res, next) => {
  const end = messageHttpRequestDurationMicroseconds.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.url, code: res.statusCode });
  });
  next();
});

// Route to expose Prometheus metrics
app.get('/metrics', async (req, res) => {
  try {
    const metrics = await register.metrics();
    res.set('Content-Type', register.contentType);
    res.end(metrics);
  } catch (error) {
    console.error('Error generating metrics:', error);
    res.status(500).send('Error generating metrics');
  }
});
// Middleware
app.use(bodyParser.json());
app.use(cors());


// Routes
app.use('/messages', messageRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
