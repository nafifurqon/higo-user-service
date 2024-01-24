const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/api.doc.json');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const config = require('./config');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

const apiPrefix = config.api_prefix || '/api/v1';

// app.use(`${apiPrefix}/`, indexRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(`${apiPrefix}/users`, usersRouter);

module.exports = app;
