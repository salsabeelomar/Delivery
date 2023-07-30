/ eslint-disable complexity /;

import { Dialect } from 'sequelize/types';

export const config = () => ({
  database: {
    dialect:  process.env.DB_DIALECT as Dialect ,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT),
    host: process.env.DB_HOST,
  },
  secretKey: process.env.JWT_SECRET,
});
