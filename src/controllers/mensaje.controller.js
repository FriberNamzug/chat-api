import Mensaje from '../models/mensaje.model'
import Chat from '../models/chat.model'
import Usuario from '../models/usuario.model'
import errorLog from "../config/error";

/* -    -   -   Obtenemos todos los mensajes por Id de un usuario especifico */
export const obtenerMensajes = async (req, res, next) => {
    try {
        const { idChat } = req.params
        const { _id, nickname } = req.user

        if (!idChat) return res.status(400).json({ msg: 'No se envio id del chat' })

        const chat = await Chat.findOne({ _id: idChat, deshabilitado: false }).populate({
            path: 'mensajes',
            match: { deshabilitado: false },
            populate: [{
                path: 'remitente',
                select: { "_id": 0, "nickname": 1 }
            }, {
                path: 'destinatario',
                select: { "_id": 0, "nickname": 1 }
            }],

        }).sort({ createdAt: 1 })

        if (!chat) return res.status(400).json({ msg: 'El chat no existe' })
        if (!chat.miembros.includes(_id)) return res.status(400).json({ msg: 'El usuario no es miembro del chat' })
        if (chat.deshabilitado) return res.status(400).json({ msg: 'El chat se encuentra deshabilitado' })
        if (chat.mensajes.length === 0) return res.status(400).json({ msg: 'El chat no tiene mensajes' })

        const mensajeReordenado = chat.mensajes.map((msg) => {
            return {
                id: msg._id,
                remitente: msg.remitente.nickname === nickname,
                mensaje: msg.mensaje,
                fecha: msg.createdAt,
            }
        })


        res.status(200).json({
            message: 'Mensajes obtenidos correctamente',
            data: mensajeReordenado
        })


    } catch (error) {
        errorLog(error, res)
    }
}
/* -    -   -    Agregamos mensaje por Id */
export const agregarMensaje = async (req, res) => {
    try {
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

        // Buscamos el chat entre el remitente y el destinatario
        const chat = await Chat.find({
            $and: [
                { miembros: { $in: [validacionDestinatario._id] } },
                { miembros: { $in: [validacionRemitente._id] } }

            ]
        })
        if (chat.deshabilitado) return res.status(400).json({ message: 'El chat esta deshabilitado' })

        // Si no existe el chat, lo creamos
        if (chat.length === 0) {
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
        console.log(refChatMsg)



        /* Respondemos con el mensaje guardado */
        res.status(200).json({
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
    }
}
/*  -   -   - Actualizamos un mensaje por Id del mensaje y Id del usuario */
export const actualizarMensaje = async (req, res) => {
    try {
        const { idMensaje, mensaje } = req.body
        const idUser = req.user._id
        if (!idMensaje) return res.status(400).json({ message: "Se requiere que se envie el id del mensaje" })
        if (idMensaje.trim().length === 0) return res.status(400).json({ message: "El id no puede ser vacio" })
        if (!mensaje) return res.status(400).json({ message: "Se requiere que se envie el mensaje" })
        if (mensaje.trim().length === 0) return res.status(400).json({ message: "El mensaje no puede ser vacio" })

        //validamos que el mensaje exista
        const mensajeExiste = await Mensaje.findById({ _id: idMensaje })//.populate('remitente')
        if (!mensajeExiste) return res.status(400).json({ message: "El mensaje no existe" })
        //validamos que el mensaje no este deshabilitado
        if (mensajeExiste.deshabilitado) return res.status(400).json({ message: "El mensaje ya se encuentra deshabilitado" })
        //validamos que el usuario que intenta actualizar el mensaje sea el mismo que lo creo
        if (mensajeExiste.remitente.toString() !== idUser) return res.status(400).json({ message: "El usuario no tiene permisos para actualizar este mensaje" })
        //actualizamos el mensaje

        /* la variable de la actualizacion*/
        let update = {
            $set: {
                'mensaje': mensaje
            }
        }


        /* Buscamos el mensaje por el id y actualizamos */
        const mensajeActualizado = await Mensaje.findByIdAndUpdate({ _id: idMensaje }, update, { new: true })
        /* Respondemos con el resultado */
        res.status(200).json({
            message: "El mensaje se actualizo de forma correcta",
            data: mensajeActualizado,

        })

    } catch (error) {
        errorLog(error, res)
    }
}
/* -    -   -   Eliminamos mensaje por el id de mensaje */
export const eliminarMensaje = async (req, res) => {
    try {
        const { idMensaje } = req.params
        const { _id } = req.user

        if (!idMensaje) return res.status(400).json({ message: "Se requiere que se envie el id del mensaje" })
        if (idMensaje.trim().length === 0) return res.status(400).json({ message: "El id no puede ser vacio" })

        /* Buscamos el mensaje por el id */
        const mensaje = await Mensaje.findById({ _id: idMensaje }, { remitente: 1, destinatario: 1, _id: 1, deshabilitado: 1 })

        console.log(mensaje)
        if (!mensaje) return res.status(400).json({ message: "El mensaje no existe" })
        if (mensaje.deshabilitado) return res.status(400).json({ message: "El mensaje ya esta eliminado" })
        if (mensaje.remitente.toString() !== _id) return res.status(400).json({ message: "No puedes eliminar un mensaje que no te pertenece" })

        await Mensaje.findByIdAndUpdate(idMensaje, { deshabilitado: true })


        res.status(200).json({
            message: "El mensaje se elimino de forma correcta",
        })

    } catch (error) {
        errorLog(error, res)
    }
}