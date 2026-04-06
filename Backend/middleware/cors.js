const cors = require('cors');

// CORS configuration — allow all origins
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

module.exports = cors(corsOptions);