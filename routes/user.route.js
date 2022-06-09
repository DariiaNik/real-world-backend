const { getUser } = require('../controller/user.controller');
const { checkUserUpdateExist } = require('../middleware/user.middelware');

module.exports = (app) => {
  app.get('/user', getUser);
  app.put('/user', [checkUserUpdateExist], updateUser);

  app.get('/profiles/:username', getProfile);
  app.post('/profiles/:username/follow', followProfile);
  app.delete('/profiles/:username/follow', unFollowProfile);
};
