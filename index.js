const
  express = require('express'),
  cors = require('cors'),
  mongoose = require('mongoose'),
  config = require('./config'),
  app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(cors());

const run = async () => {
  await mongoose.connect('mongodb://localhost:27017/myApp',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  app.listen(config.port, () => {
    console.log(`HTTP server start on ${config.port} port!`);
  })
};

run().catch(e => {
  console.log(e);
});