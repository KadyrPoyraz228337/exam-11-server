const Category = require('../models/categoy');
const Thing = require('../models/thing');


module.exports = class thingsService {
  constructor() {}

  async getCategories() {
    return new Promise(async (resolve, reject) => {
      try {
        const categories = await Category.find();
        resolve(categories);
      } catch (e) {
        reject(e)
      }
    })
  }

  async deleteThing(id, user) {
    return new Promise(async (resolve, reject) => {
      try {
        const things = await Thing.findOne({_id: id}).populate('user');
        if(things.user._id.toString() !== user.toString()) {
          return reject('you are not the owner of this product')
        }
        things.remove();
        resolve('Success');
      } catch (e) {
        reject(e)
      }
    })
  }

  async getThings() {
    return new Promise(async (resolve, reject) => {
      try {
        const things = await Thing.find();
        resolve(things);
      } catch (e) {
        reject(e)
      }
    })
  }

  async getThing(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const thing = await Thing.findOne({_id: id}).populate(['category', 'user']);
        resolve(thing);
      } catch (e) {
        reject(e)
      }
    })
  }

  async getThingsById(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const things = await Thing.find({category: id});
        resolve(things);
      } catch (e) {
        reject(e)
      }
    })
  }

  async addThing(title, description, price, image, category, user) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(arguments);
        if(title.length < 3)  return reject({message: 'title must be at least 3 characters long!'});
        if(description.length < 10) return reject({message: 'description must be at least 10 characters long!'});
        if(price === '0')  return reject({message: 'price must be greater than 0'});
        if(category === '')  return reject({message: 'categories is not defined!'});
        // if(title.length < 3 || description.length < 10 || price === '0' || category === '') {
        //   reject('123123')
        // }

        const thing = await Thing.create({title, description, price, image, category, user});
        resolve(thing)
      } catch (e) {
        reject(e)
      }
    })
  }
};