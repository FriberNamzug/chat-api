import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path'
import http from 'http'
import express from 'express';

import authRoutes from "./routes/auth.routes";
import usuarioRoutes from "./routes/usuario.routes";
import chatRoutes from "./routes/chat.routes";
import mensajeRoutes from "./routes/mensaje.routes";

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

    app.use(`/api/${process.env.VERSION_API}/auth`, authRoutes);
    app.use(`/api/${process.env.VERSION_API}/usuario`, usuarioRoutes);
    app.use(`/api/${process.env.VERSION_API}/chat`, chatRoutes);
    app.use(`/api/${process.env.VERSION_API}/mensaje`, mensajeRoutes);

    return servidor
}

export default app
