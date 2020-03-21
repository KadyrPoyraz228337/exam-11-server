const
  path = require('path'),
  express = require('express'),
  nanoid = require('nanoid'),
  multer = require('multer'),
  isAuth = require('../middlewares/isAuth'),
  ThingService = require('../services/things'),
  config = require('../config'),
  router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cd) => cd(null, config.uploadPath),
  filename: (req, file, cd) => cd(null, nanoid() + path.extname(file.originalname))
});
const upload = multer({storage});

router.get('/categories', async (req, res) => {
  try {
    const service = new ThingService();
    const categories = await service.getCategories();

    res.send(categories);
  } catch (e) {
    res.status(500).send(e)
  }
});

router.delete('/:id', isAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const user = req.currentUser._id;

    const service = new ThingService();
    const categories = await service.deleteThing(id, user);

    res.send(categories);
  } catch (e) {
    res.status(403).send(e)
  }
});

router.get('/categories/:id', isAuth, async (req, res) => {
  try {
    const id = req.params.id;

    const service = new ThingService();
    const things = await service.getThingsById(id);
    res.send(things);
  } catch (e) {
    res.status(500).send(e)
  }
});

router.get('/', async (req, res) => {
  try {
    const service = new ThingService();
    const things = await service.getThings();
    res.send(things);
  } catch (e) {
    res.status(500).send(e)
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const service = new ThingService();
    const thing = await service.getThing(id);
    res.send(thing);
  } catch (e) {
    res.status(500).send(e)
  }
});

router.post('/', isAuth, upload.single('image'), async (req, res) => {
  try {
    let
      title = req.body.title,
      description = req.body.description,
      image = req.body.image,
      category = req.body.category,
      price = req.body.price,
      user = req.currentUser._id;

    if (req.file) image = req.file.filename;

    const service = new ThingService();
    const thing = await service.addThing(title, description, price, image, category, user);

    res.send(thing);
  } catch (e) {
    res.status(500).send(e)
  }
});

module.exports = router;