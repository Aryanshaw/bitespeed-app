import { Sequelize } from "sequelize";
import logger from "./logger";
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USERNAME } from "@/config";

const sequelize = new Sequelize({
  host: DB_HOST,
  port: parseInt(DB_PORT),
  password: DB_PASSWORD,
  username: DB_USERNAME,
  database: DB_DATABASE,
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
  },
});

export default sequelize;

import Contact from "@/models/contact";

export async function initDb(){

    sequelize
    .authenticate()
    .then(() => {
        logger.info('Connection to the database has been established successfully.');
    })
    .catch((error) => {
        logger.error('Unable to connect to the database:', error);
    });
    sequelize.sync({ force: false }).then(async () => {
        logger.info('Database & tables created!');
        await Contact.sync({force: false}).then(()=>{
            logger.info('Contact table created successfully');
        }).catch((error)=>{
            logger.error('Error creating Contact table:', error);
        });
    });
}
