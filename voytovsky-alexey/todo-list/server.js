//================= Core server with REST implementation =================
const { xterm, bold, underline }  = require('cli-color');
const consolidate                 = require('consolidate');
const db                          = require('./config/db');
const express                     = require('express');
const mongoose                    = require('mongoose');
const session                     = require('express-session');
const MongoStore                  = require('connect-mongo')(session);
const passport                    = require('./auth/auth-local');
const cors                        = require('cors');
const jwt                         = require('jsonwebtoken');

const app                         = express();
const port                        = (process.env.PORT || 3000);

// It lets mongoose call the createIndex method on the mongodb native driver
mongoose.set('useCreateIndex', true);

// Database connection
mongoose.connect(db.uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
})
.catch(error => console.error(error));

// View engine
app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');

// Middlewares
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(session({
  resave: true,                 // Resave session if something has been changed
  saveUninitialized: false,    // No session creation for unauthorized users
  secret: 'BqXaaz3q',         // Session signature ( session ID --> cookies ) for session ID secure
                             //     some private key (only server knows it)
  store: new MongoStore({ mongooseConnection: mongoose.connection }),   // Store for the sessions
}));
app.use(passport.initialize);
app.use(passport.session);
app.use('/tasks', passport.mustBeAuthenticated);

// Custom middleware
const checkAuthentication = (req, res, next) => {
  console.log(req.headers.authorization);
  // Authorization: Bearer <token>
  if (req.headers.authorization) {
    const [ type, token ] = req.headers.authorization.split(' ');

    jwt.verify(token, '9UwBWnYD', (err, decoded) => {
      if (err) return res.status(403).send();
      req.user = decoded;   // decoded == token content
      next();
    });
  } else {
    res.status(403).send();
  }
};

app.use('/api/tasks', checkAuthentication); 

// Controllers and helpers(?) inclusion
require('./index')(app);

// Initial router
app.get('/', (req, res) => req.user ? res.redirect('/tasks') : res.redirect('/auth'));

// Listening for connection setup
const server = app.listen(port, () => {
  const { address, port } = server.address();
  console.log(bold.xterm(92)('REST inclusive, field marshal.') + '\n' + xterm(227)('App listening at http://%s:%d' + '\nMongoDB :%d'), address, port, db.port);
});

// Run server
server;
