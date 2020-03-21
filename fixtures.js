const mongoose = require('mongoose');
const Category = require('./models/categoy');
const Thing = require('./models/thing');
const User = require('./models/User');

const run = async () => {
  await mongoose.connect('mongodb://localhost/myApp',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });

  const collections = await mongoose.connection.db.listCollections().toArray();

  for (let coll of collections) {
    await mongoose.connection.db.dropCollection(coll.name)
  }

  const [Kadyr, Ramazan] = await User.create(
    {
      "username": "Пойраз Кадыр",
      "password": "123456",
      "displayName": "Kadyr228",
      "number": "0556056643",
      "token": "sdffdsfd",
    },
    {
      "username": "Пойраз Рамазан",
      "password": "1234567",
      "displayName": "Ramazan228",
      "number": "0553116449",
      "token": "sfeerwwerrew",
    }
  );

  const [cars, computers, moto] = await Category.create(
    {"name": "cars"},
    {"name": "computers"},
    {"name": "moto"}
  );

  await Thing.create(
    {
      "title": "Toyota camry",
      "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      "category": cars,
      "price": "2000",
      "image": "car.jpg",
      "user": Kadyr,
    },
    {
      "title": "moto",
      "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      "category": moto,
      "price": "1200",
      "image": "moto.webp",
      "user": Ramazan,
    },
    {
      "title": "computer",
      "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      "category": computers,
      "price": "3000",
      "image": "computer.jpg",
      "user": Ramazan,
    }
  );

  mongoose.connection.close();
};

run().catch(e => {
  throw e
});