const
  nanoid = require('nanoid'),
  argon2 = require('argon2'),
  {randomBytes} = require('crypto'),
  User = require('../models/User');

module.exports = class AuthService {
  constructor() {
  }

  async login(username, password) {
    return new Promise(async (resolve, reject) => {
      try {
        if(!username || !password) {
          return reject({message: 'all fields must be filled!'})
        }
        const user = await User.findOne({username});
        if (!user) {
          return reject({message: 'Username or password not correct!'})
        } else {
          const correctPassword = await argon2.verify(user.password, password);
          if (!correctPassword) {
            return reject({message: 'Username or password not correct!'})
          }

          const token = this.createToken();
          await User.update({username}, {
            token: token
          });
          resolve({
            user: {
              username: user.username,
              displayName: user.displayName,
              number: user.number
            },
            token
          });
        }
      } catch (e) {
        reject(e)
      }
    })
  }


  async sigUp(username, password, displayName, number) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!username || !password || !displayName || !number) {
          return reject({message: 'all fields must be filled!'});
        }
        if(username.length <= 3 || displayName.length <= 3) {
          return reject({message: 'username or displayName must be at least 3 characters long!'});
        }

        const salt = randomBytes(32);
        const hashedPassword = await argon2.hash(password, {salt});
        const token = this.createToken();

        const user = await User.create({
          password: hashedPassword,
          username: username,
          displayName: displayName,
          number: number,
          token: token
        });

        return resolve({
          user: {
            username: user.username,
            displayName: user.displayName,
            number: user.number
          },
          token
        })
      } catch (e) {
        if(e.name === 'MongoError') {
          return reject({message: `${JSON.stringify(e.keyValue)} field is occupied`})
        }
        reject(e)
      }
    })
  };

  async logout(token) {
    return new Promise(async (resolve, reject) => {
      try {
        const message = {message: 'Logout success'};

        if(!token) resolve(message);

        const user = await User.findOne({token});

        if(!user) resolve(message);

        user.token = this.createToken();
        await user.save();

        resolve(message);
      } catch (e) {
        reject(e)
      }
    })
  }

  createToken() {
    return nanoid(12);
  }
};