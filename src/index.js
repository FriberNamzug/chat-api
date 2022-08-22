import 'dotenv/config'
import database from "./config/db"
import app from './app'
import { Server as WebSocketServer } from 'socket.io'
import sockets from './sockets'




database();
const servidor = app();


export const io = new WebSocketServer(servidor,{
    cors:{
        origin: process.env.URL_CLIENTE,
        credentials: true
    }
})

sockets(io)