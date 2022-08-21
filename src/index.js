import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path'
import http from 'http'
import 'dotenv/config'
import "./config/db"


const app = () => {
    const app = express();
    const servidor = http.createServer(app);
    app.use(express.static(path.join(__dirname, '../public')))
    app.use(express.json());
    app.use(cors({}));
    app.use(morgan('dev'));
    app.use(helmet());

    servidor.listen(process.env.PORT, () => {
        console.log(`Servidor funcionando en el puerto ${process.env.PORT}`);
    });

    app.use('/api/v1/', (req, res) => {
        res.send('Hello World!');
    });
}

app();


