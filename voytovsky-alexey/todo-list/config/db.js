// Database connection adjustment
const port = 32768;

module.exports = {
  port: port,
  uri: `mongodb://localhost:${port}/tasks`
};
