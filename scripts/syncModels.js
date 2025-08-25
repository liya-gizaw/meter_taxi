import { sequelize } from '../src/models/index.js';

async function syncModels() {
  try {
    await sequelize.authenticate();
    console.log('Database connected!');
    await sequelize.sync({ alter: true }); // alter:true updates existing tables
    console.log('Models synced!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error syncing database:', err);
    process.exit(1);
  }
}

syncModels();
