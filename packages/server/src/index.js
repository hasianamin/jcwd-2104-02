require('dotenv');
const express = require('express');
const cors = require('cors');
const app = express();
const bearerToken = require('express-bearer-token');
// const { join } = require('path');

const PORT = process.env.PORT || 8000;

const userRouter = require('./routers/users');


app.use(cors());
app.use(bearerToken());
app.use('/public', express.static('public'));
app.use(express.json());
app.use('/users', userRouter);

app.get('/api', (req, res) => {
  res.send(`Hello, this is my API`);
});

// error handler
app.use((error, req, res, next) => {
  console.log({ error });

  const errorObj = {
    status: "Error",
    message: error.message,
    detail: error,
  };

  const httpCode = typeof error.code == "number" ? error.code : 500;
  res.status(httpCode).send(errorObj);
});

app.listen(PORT, (err) => {
  if (err) {
    console.log(`ERROR: ${err}`);
  } else {
    console.log(`APP RUNNING at ${PORT} ✅`);
  }
});

