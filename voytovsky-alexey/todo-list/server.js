//================= Core server implementation =================
const { xterm, bold, underline }  = require('cli-color');
const consolidate                 = require('consolidate');
const db                          = require('./config/db');
const express                     = require('express');
const mongoose                    = require('mongoose');
const session                     = require('express-session');
const MongoStore                  = require('connect-mongo')(session);
const passport                    = require('./auth/auth-local');

const app                         = express();
const port                        = (process.env.PORT || 3000);

// View engine
app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');

// Middlewares
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(session({
  resave: true,                   // Resave session if something is changed
  saveUninitialized: false,       // No session creation for unauthorized users
  secret: 'super secret phrase',  // Session signature ( session ID --> cookies ) for session ID secure
                                  //    some private key (only server knows it)
  store: new MongoStore({ mongooseConnection: mongoose.connection }),   // Store for sessions
}));
app.use(passport.initialize);
app.use(passport.session);
app.use('/tasks', passport.mustBeAuthenticated);

// Database connection
mongoose.connect(db.uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
})
.catch(error => handleError(error));

// Controllers inclusion
require('./index')(app);

// Initial router
app.get('/', (req, res) => req.user ? res.redirect('/tasks') : res.redirect('/auth'));

// Listening for connection setup
const server = app.listen(port, () => {
  const { address, port } = server.address();
  console.log(bold.xterm(92)('We are up and running, admiral.') + '\n' + xterm(227)('App listening at http://%s:%d' + '\nMongoDB :%d'), address, port, db.port);
});

// Run server
server;
