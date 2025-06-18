import { Sequelize } from "sequelize";
import logger from "./logger";
import { DATABASE_URL } from "@/config";

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // Set to true if you want to see SQL queries in the console
  dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
  },
});

export default sequelize;

export async function initDb(){

    sequelize
    .authenticate()
    .then(() => {
        logger.info('Connection to the database has been established successfully.');
    })
    .catch((error) => {
        logger.error('Unable to connect to the database:', error);
    });
    sequelize.sync({ force: false }).then(() => {
        logger.info('Database & tables created!');
    });
}
