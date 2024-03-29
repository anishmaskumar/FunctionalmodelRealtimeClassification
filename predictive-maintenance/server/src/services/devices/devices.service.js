// Initializes the `devices` service on path `/devices`
const createService = require('feathers-mongodb');
const hooks = require('./devices.hooks');

module.exports = function (app) {
  const paginate = app.get('paginate');
  const mongoClient = app.get('mongoClient');
  const options = { paginate };

  // Initialize our service with any options it requires
  app.use('/devices', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('devices');

  mongoClient.then(db => {
    service.Model = db.collection('devices');
  });

  service.hooks(hooks);
};
