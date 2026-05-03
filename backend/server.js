require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*', credentials: true }));
app.use(express.json({ limit: '2mb' }));
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

// Health
app.get('/api/health', (_, res) => res.json({ ok: true, service: 'cybercockpit-demo', mode: 'in-memory', time: new Date().toISOString() }));

// Routes
app.use('/api/auth',         require('./src/routes/auth.routes'));
app.use('/api/dashboard',    require('./src/routes/dashboard.routes'));
app.use('/api/assets',       require('./src/routes/assets.routes'));
app.use('/api/risks',        require('./src/routes/risks.routes'));
app.use('/api/assessments',  require('./src/routes/assessments.routes'));
app.use('/api/intelligence', require('./src/routes/intelligence.routes'));
app.use('/api/network',      require('./src/routes/network.routes'));
app.use('/api/copilot',      require('./src/routes/copilot.routes'));
app.use('/api/chatbot',      require('./src/routes/chatbot.routes'));
app.use('/api/game',         require('./src/routes/game.routes'));

// Serve Frontend in Production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'build', 'index.html'));
  });
}

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('🚀 CyberCockpit DEMO API on :' + PORT + ' (no database required)'));
