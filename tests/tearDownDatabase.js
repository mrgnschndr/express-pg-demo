const adminPool = require('./jest.poolAdmin');
require('dotenv').config({ path: '.env.test' });

async function teardownDatabase() {
  const testDbName = process.env.DB_TEST_NAME;

  try {
    console.log(`Dropping test database: ${testDbName}`);
    const { rows: activeConnections } = await adminPool.query(`
      SELECT pid FROM pg_stat_activity WHERE datname = '${testDbName}';
    `);

    for (const connection of activeConnections) {
      await adminPool.query(`SELECT pg_terminate_backend(${connection.pid});`);
      console.log(`Terminated connection with pid: ${connection.pid}`);
    }

    await adminPool.query(`DROP DATABASE IF EXISTS ${testDbName};`);
    console.log(`Test database "${testDbName}" dropped.`);
  } catch (error) {
    console.error('Error tearing down test database:', error.message);
    throw error;
  } finally {
    await adminPool.end();
  }
}

module.exports = teardownDatabase;
