const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3030;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const reviews_data = JSON.parse(fs.readFileSync('reviews.json', 'utf8'));
const dealerships_data = JSON.parse(fs.readFileSync('dealerships.json', 'utf8'));

const Reviews = require('./review');
const Dealerships = require('./dealership');

async function seedDatabase() {
  await Reviews.deleteMany({});
  await Reviews.insertMany(reviews_data.reviews);

  await Dealerships.deleteMany({});
  await Dealerships.insertMany(dealerships_data.dealerships);

  console.log('Database seeded successfully');
}

async function startServer() {
  try {
    await mongoose.connect('mongodb://mongo_db:27017/dealershipsDB');
    console.log('Connected to MongoDB');

    await seedDatabase();

    app.get('/', (req, res) => {
      res.send('Welcome to the Mongoose API');
    });

    app.get('/fetchReviews', async (req, res) => {
        try {
          console.log('GET /fetchReviews HIT');
          const documents = await Reviews.find();
          console.log('REVIEWS COUNT:', documents.length);
          res.json(documents);
        } catch (error) {
          console.error('FETCH REVIEWS ERROR:', error);
          res.status(500).json({ error: 'Error fetching reviews' });
        }
      });
      
      app.get('/fetchReviews/dealer/:id', async (req, res) => {
        try {
          const dealerId = Number(req.params.id);
          console.log('GET /fetchReviews/dealer/:id ->', req.params.id);
      
          if (Number.isNaN(dealerId)) {
            return res.status(400).json({ error: 'Invalid dealer id' });
          }
      
          const documents = await Reviews.find({ dealership: dealerId });
          res.json(documents);
        } catch (error) {
          console.error('FETCH REVIEWS BY DEALER ERROR:', error);
          res.status(500).json({ error: 'Error fetching reviews by dealer' });
        }
      });

    app.get('/fetchDealers', async (req, res) => {
        try {
          console.log('GET /fetchDealers');
          const documents = await Dealerships.find();
          res.json(documents);
        } catch (error) {
          console.error('FETCH DEALERS ERROR:', error);
          res.status(500).json({ error: 'Error fetching dealerships' });
        }
      });
      
      app.get('/fetchDealers/:state', async (req, res) => {
        try {
          const value = req.params.state;
          console.log('GET /fetchDealers/:state ->', value);
      
          const documents = await Dealerships.find({
            $or: [
              { state: new RegExp(`^${value}$`, 'i') },
              { st: new RegExp(`^${value}$`, 'i') }
            ]
          });
      
          res.json(documents);
        } catch (error) {
          console.error('FETCH DEALERS BY STATE ERROR:', error);
          res.status(500).json({ error: 'Error fetching dealerships by state' });
        }
      });
      
      app.get('/fetchDealer/:id', async (req, res) => {
        try {
          const dealerId = Number(req.params.id);
          console.log('GET /fetchDealer/:id ->', req.params.id);
      
          if (Number.isNaN(dealerId)) {
            return res.status(400).json({ error: 'Invalid dealer id' });
          }
      
          const document = await Dealerships.findOne({ id: dealerId });
      
          if (!document) {
            return res.status(404).json({ error: 'Dealer not found' });
          }
      
          res.json(document);
        } catch (error) {
          console.error('FETCH DEALER ERROR:', error);
          res.status(500).json({ error: 'Error fetching dealership by id' });
        }
      });

    app.post('/insert_review', async (req, res) => {
      try {
        const data = req.body;
        const documents = await Reviews.find().sort({ id: -1 });
        const new_id = documents.length ? documents[0].id + 1 : 1;

        const review = new Reviews({
          id: new_id,
          name: data.name,
          dealership: Number(data.dealership),
          review: data.review,
          purchase: data.purchase,
          purchase_date: data.purchase_date,
          car_make: data.car_make,
          car_model: data.car_model,
          car_year: Number(data.car_year),
        });

        const savedReview = await review.save();
        res.json(savedReview);
      } catch (error) {
        console.error('INSERT REVIEW ERROR:', error);
        res.status(500).json({ error: 'Error inserting review' });
      }
    });

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('STARTUP ERROR:', error);
  }
}

startServer();