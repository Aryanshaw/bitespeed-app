import { Sequelize } from "sequelize";
import logger from "./logger";
import { DATABASE_URL } from "@/config";

const sequelize = new Sequelize(DATABASE_URL, {
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
