import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes/index.js';
import { sequelize } from './models/index.js';
import './models/associations.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api', routes);

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connected!');
    const syncForce = (process.env.DB_SYNC_FORCE || 'false') === 'true';
    const syncAlter = (process.env.DB_SYNC_ALTER || 'true') === 'true';
    await sequelize.sync({ force: syncForce, alter: syncAlter });
    const port = Number(process.env.PORT || 4000);
    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server', error);
    process.exit(1);
  }
}

start();

export default app;