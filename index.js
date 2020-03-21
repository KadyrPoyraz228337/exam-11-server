const
  express = require('express'),
  cors = require('cors'),
  mongoose = require('mongoose'),
  config = require('./config'),
  users = require('./routes/users'),
  things = require('./routes/things'),
  app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(cors());

const run = async () => {
  await mongoose.connect('mongodb://localhost/myApp',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });

  app.use('/users', users);
  app.use('/things', things);
  // app.use('/comments', comments);

  app.listen(config.port, () => {
    console.log(`HTTP server start on ${config.port} port!`);
  })
};

run().catch(e => {
  console.log(e);
});