import { sequelize } from '../config/db.js';

// Export only the initialized Sequelize instance.
// All model definitions live in individual files (e.g., user.js, profile.js, permission.js, rolePermission.js)
// and are wired together via src/models/associations.js

export { sequelize };
