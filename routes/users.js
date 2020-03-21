const
  express = require('express'),
  AuthService = require('../services/auth'),
  router = express.Router();

router.post('/', async (req, res) => {
  try {
    const
      username = req.body.username,
      password = req.body.password,
      displayName = req.body.displayName,
      number = req.body.number;

    const auth = new AuthService();
    const {user, token} = await auth.sigUp(username, password, displayName, number);

    res.send({user, token})
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post('/sessions', async (req, res) => {
  const
    password = req.body.password,
    username = req.body.username;
  try {
    const service = new AuthService();
    const {user, token} = await service.login(username, password);

    return res.send({user, token});
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

router.delete('/sessions', async (req, res) => {
  try {
    const token = req.get('Authorization').split(' ')[1];
    const service = new AuthService();
    const success = await service.logout(token);
    res.send(success);
  } catch (e) {
    res.send({message: 'Logout success'});
  }
});

module.exports = router;