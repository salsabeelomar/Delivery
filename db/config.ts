import config from '../config';
let databaseConfig: any;
config.forEach(
  (value) => (databaseConfig = value().database ?? databaseConfig),
);

export default databaseConfig;
