import config from '../config';

let databaseConfig: any;
config.forEach((value) => {
  console.log(value().database);
  return (databaseConfig = value().database ?? databaseConfig);
});

export default databaseConfig;
