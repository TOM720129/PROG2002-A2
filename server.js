const express = require('express');
const categoryRoute = require('./controller/categoryController');
const organizationsRoute = require('./controller/organizationsController');
const eventRoute = require('./controller/eventController');

const app = express();

app.use('/api/category', categoryRoute);
app.use('/api/ organization', organizationsRoute);
app.use('/api/event', eventRoute);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
