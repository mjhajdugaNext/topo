print('Start #################################################################');

db = db.getSiblingDB('topo_prod_db');
db.createUser(
  {
    user: 'api_user',
    pwd: 'api1234',
    roles: [{ role: 'readWrite', db: 'topo_prod_db' }],
  },
);
db.createCollection('users');

db = db.getSiblingDB('topo_test_db');
db.createUser(
  {
    user: 'api_user',
    pwd: 'api1234',
    roles: [{ role: 'readWrite', db: 'topo_test_db' }],
  },
);
db.createCollection('users');

print('END #################################################################');
db.auth( "root", passwordPrompt() );
