import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import authRouter from './routes/auth.js';
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

// Candidate paths for built frontend assets
const candidatePaths = [
  path.resolve(process.cwd(), 'backend/public'),
  path.resolve(__dirname, '../public'),
  path.resolve(process.cwd(), 'public'),
];
const publicPath = candidatePaths.find((p) => fs.existsSync(p)) || candidatePaths[0];

// Middlewares
app.use(cors());
app.use(express.json());

console.log(`Starting DOSEBRIDGE backend on port ${PORT}`);

// API Health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'DOSEBRIDGE - Accessible Medication Platform',
    server: 'Node.js + Express with Prisma ORM & RBAC Authentication',
    timestamp: new Date().toISOString(),
    features: [
      'prisma-sqlite-persistence',
      'rbac-role-based-access-control',
      'jwt-authentication-endpoints',
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
app.use('/api/auth', authRouter);
app.use('/api/patients', patientsRouter);
app.use('/api/medications', medicationsRouter);
app.use('/api/schedule', scheduleRouter);
app.use('/api/adherence', adherenceRouter);
app.use('/api/caregiver', caregiverRouter);
app.use('/api/resources', resourcesRouter);

// Static file serving & SPA fallback
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));

  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(publicPath, 'index.html'));
  });
  console.log(`Serving static frontend from: ${publicPath}`);
} else {
  console.warn(`Static frontend build not found. Run 'npm run build' to bundle assets.`);
}

app.listen(PORT, () => {
  console.log(`DOSEBRIDGE backend running at http://localhost:${PORT}`);
});
