import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import patientsRouter from './routes/patients.js';
import medicationsRouter from './routes/medications.js';
import scheduleRouter from './routes/schedule.js';
import adherenceRouter from './routes/adherence.js';
import caregiverRouter from './routes/caregiver.js';
import resourcesRouter from './routes/resources.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT || 3000);
const isProd = process.env.NODE_ENV === 'production';
const publicPath = path.resolve(process.cwd(), 'public');

// Middlewares
app.use(cors());
app.use(express.json());

console.log(`Starting DOSEBRIDGE backend on port ${PORT} (${isProd ? 'production' : 'development'})`);

// API Health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'DOSEBRIDGE - Accessible Medication Platform',
    server: 'Node.js + Express',
    timestamp: new Date().toISOString(),
    features: [
      'multilingual-instructions',
      'text-to-speech-support',
      'caregiver-shared-access',
      'medication-scheduling',
      'accessible-contrast-text',
      'healthcare-education',
    ],
  });
});

// Register API Routes
app.use('/api/patients', patientsRouter);
app.use('/api/medications', medicationsRouter);
app.use('/api/schedule', scheduleRouter);
app.use('/api/adherence', adherenceRouter);
app.use('/api/caregiver', caregiverRouter);
app.use('/api/resources', resourcesRouter);

// Production static file serving & SPA fallback
if (isProd) {
  if (fs.existsSync(publicPath)) {
    app.use(express.static(publicPath));

    app.get('*', (req, res) => {
      if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API route not found' });
      }
      res.sendFile(path.join(publicPath, 'index.html'));
    });
  } else {
    console.warn(`Public directory not found at ${publicPath}. Run 'npm run build' first.`);
  }
}

app.listen(PORT, () => {
  console.log(`DOSEBRIDGE backend running at http://localhost:${PORT}`);
  if (isProd) {
    console.log(`Serving static frontend from: ${publicPath}`);
  }
});
