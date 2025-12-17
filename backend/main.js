const express = require('express');
const cors = require('cors');
const app = express();
const session = require('express-session');


// Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(session({
   secret: 'your-secret-key',
   resave: false,
   saveUninitialized: false,
   cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 sata
      httpOnly: true,
      secure: false // true za HTTPS
   }
}));

// API routes
app.use('/', require('./routes/api.routes'));

const PORT = 3001;
app.listen(PORT, () => console.log(`API server running on ${PORT}`));