// Dependencies
const path = require('path');

// Routes
module.exports = (app) => {
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/exercise.html'))
  }
  );
  app.get('', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/exercise.html'))
  }
  );


}