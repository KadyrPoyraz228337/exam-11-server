const
  nanoid = require('nanoid'),
  argon2 = require('argon2'),
  {randomBytes} = require('crypto'),
  User = require('../models/User');

module.exports = class AuthService {
  constructor() {
  }

  async login(email, password) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await User.findOne({email});
        if (!user) {
          return reject('Username or password not correct!')
        } else {
          const correctPassword = await argon2.verify(user.password, password);
          if (!correctPassword) {
            return reject('Username or password not correct!')
          }

          const token = this.createToken();
          await User.update({email}, {
            token: token
          });
          resolve({
            user: {
              username: user.username
            },
            token
          });
        }
      } catch (e) {
        reject(e)
      }
    })
  }


  async sigUp(username, email, password) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!username || !email || !password) {
          return reject('Password or username or email not found!');
        }

        const salt = randomBytes(32);
        const hashedPassword = await argon2.hash(password, {salt});
        const token = this.createToken();

        const user = await User.create({
          password: hashedPassword,
          username: username,
          email: email,
          token: token
        });

        return resolve({
          user: {
            username: user.username,
            email: user.email
          },
          token
        })
      } catch (e) {
        reject(e)
      }
    })
  };

  async logout(token) {
    return new Promise(async (resolve, reject) => {
      const message = {message: 'Logout success'};

      if(!token) resolve(message);

      const user = await User.findOne({token});

      if(!user) resolve(message);

      user.token = this.createToken();
      user.save();
    })
  }

  createToken() {
    return nanoid(12);
  }
};