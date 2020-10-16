const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");

const schema = require("./src/graphql/schema");
const resolvers = require("./src/graphql/resolvers");
const isAuth = require("./src/middleware/is-auth");

const app = express();

app.use(express.json());
app.use(isAuth);

app.use(
  "/api/graphql/v1",
  graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql: { headerEditorEnabled: true },
    customFormatErrorFn: err => {
      return {
        message: err.message,
        code: (err.originalError && err.originalError.code) || 500,
      };
    },
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@bipin-cluster.9pnlq.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`server is listening on port: ${port}`);
    });
  })
  .catch(err => console.log({ MongooseConnectError: err }));
