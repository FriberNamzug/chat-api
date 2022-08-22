import Mensaje from '../models/mensaje.model'
import Chat from '../models/chat.model'
import Usuario from '../models/usuario.model'
import errorLog from "../config/error";
import { io } from '../index'
/* -    -   -    Agregamos mensaje por Id */
export const agregarMensaje = async (data) => {

    console.log("Mensaje recibido: " + data)
    console.log(data)


    /*     try {
        const { mensaje, destinatario } = req.body
            const remitente = req.user.nickname
    
            if (!destinatario) return res.status(400).json({ message: "Se requiere que se envie el destinatario" })
            if (!mensaje) return res.status(400).json({ message: "El mensaje es requerido" })
            if (typeof mensaje !== 'string') return res.status(400).json({ message: "El mensaje debe ser un String" })
            if (mensaje.trim().length === 0) return res.status(400).json({ message: "El mensaje no puede estar vacio" })
    
            const validacionDestinatario = await Usuario.findOne({ nickname: destinatario }, { password: 0 })
            const validacionRemitente = await Usuario.findOne({ nickname: remitente }, { password: 0 })
    
            if (!validacionDestinatario) return res.status(400).json({ msg: 'No se encontro a quien le intentas enviar un mensaje' })
            if (validacionRemitente.nickname == validacionDestinatario.nickname) return res.status(400).json({ message: "No puedes enviarte un mensaje a ti mismo" })
            if (validacionDestinatario.deshabilitado || validacionRemitente.deshabilitado) return res.status(400).json({ message: "El usuario esta deshabilitado" })
     */
    // Buscamos el chat entre el remitente y el destinatario
    /*         const chat = await Chat.find({
                $and: [
                    { miembros: { $in: [validacionDestinatario._id] } },
                    { miembros: { $in: [validacionRemitente._id] } }
    
                ]
            })
            if (chat.deshabilitado) return res.status(400).json({ message: 'El chat esta deshabilitado' })
     */
    // Si no existe el chat, lo creamos
    /*         if (chat.length === 0) {
                console.log('No existe el chat')
                const responseCreateChat = await Chat.create({
                    miembros: [validacionDestinatario._id, validacionRemitente._id],
                })
            }
    
            const chatValidado = await Chat.find({
                $and: [
                    { miembros: { $in: [validacionDestinatario._id] } },
                    { miembros: { $in: [validacionRemitente._id] } },
                    { deshabilitado: false }
    
                ]
            })
    
            const data = await Mensaje.create({
                mensaje: mensaje,
                remitente: validacionRemitente._id,
                destinatario: validacionDestinatario._id
            })
            const refChatMsg = await Chat.findByIdAndUpdate({ _id: chatValidado[0]._id }, { $push: { mensajes: data._id } }, { new: true })
            console.log(refChatMsg) */



    /* Respondemos con el mensaje guardado */
    /*         res.status(200).json({
                message: "El mensaje se envio de forma correcta",
                data: {
                    mensaje: {
                        id: data._id,
                        mensaje: data.mensaje,
                        remitente: validacionRemitente.nickname,
                        destinatario: validacionDestinatario.nickname,
                        fecha: data.createdAt
                    },
                    chat: {
                        id: refChatMsg._id,
                        mensajes: refChatMsg.mensajes,
                    },
                }
            })
    
        } catch (error) {
            errorLog(error, res)
        } */
}

export const obtenerHabitacion = async (data) => {
    console.log(data)
    io.emit("habitacion", data)
}