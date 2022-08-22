import { agregarMensaje } from "./controllers/socket.controller";
import { obtenerHabitacion } from "./controllers/socket.controller";



export default (io) => {

    io.on('connection', async (socket) => {

        socket.on('conectado', async (data) => {
            console.log("Usuario conectado: " + data.token)
            /*  Cuando el usuario se conecte obtenemos todas las habitaciones(chats) y luego iteramos con el id del chat para obtener
                el nombre del evento del cual se ejecutara y dependera  */
            })

        socket.on('reconexion', async (data) => {
            console.log("Usuario reconexion: " + data.nickname)
        })



        socket.on('mensaje', async (data) => {
            await agregarMensaje(data)
            io.emit("mensajes", data)
        })







        socket.on("desconectado", async (data) => {
            console.log(data + socket.id)
        })

        socket.on('disconnect', async (data) => {
            io.emit("mensajes", { servidor: "Servidor", mensaje: "El usuario " + data + " se ha desconectado" })

            console.log("Usuario desconectado: " + socket.id)
        })



    });
}