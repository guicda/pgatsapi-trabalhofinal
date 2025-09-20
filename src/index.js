const createApp = require('./app');
const PORT = process.env.PORT || 4000;

createApp()
  .then(app => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
    });
  })
  .catch(err => {
    console.error('Failed to start app', err);
    process.exit(1);
  });
