require('dotenv').config()

const express = require('express');
const connectDB = require('./config/mongoDb.js');
var bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');


const PORT = process.env.PORT || 8000;

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors("http://localhost:3000"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const roleRouters = require('./Routes/rolesRoutes.js')
app.use('/api/roles', roleRouters)

const userRouters = require('./Routes/usersRoutes.js')
app.use('/api/users', userRouters)

const eventRouters = require('./Routes/eventsRouter.js')
app.use('/api/events', eventRouters)



app.listen(PORT, () => {
  console.log(`Shope listening on port ${PORT}`);
});
