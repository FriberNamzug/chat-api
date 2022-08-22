import 'dotenv/config'
import database from "./config/db"
import app from './app'




database();
app();

