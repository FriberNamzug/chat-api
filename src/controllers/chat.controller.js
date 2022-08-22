import Mensaje from '../models/mensaje.model'
import Chat from '../models/chat.model'
import Usuario from '../models/usuario.model'
import errorLog from "../config/error"

/* -    -   -   Ruta para obtener todos los chats de un usuario */
export const obtenerChats = async (req, res) => {
    try {
        const { _id, nickname } = req.user
        if (!_id) return res.status(400).json({ msg: 'Faltan datos' })
        //Obtenemos el campo chat del usuario+
        const chat = await Chat.find({ miembros: { $all: [_id] }, deshabilitado: false }).populate('miembros', {
            amigos: 1,
            estatus: 1,
            nickname: 1,
            email: 1,
            avatar: 1,
            deshabilitado: 1,
        })


        if (chat.length === 0) return res.status(400).json({ message: `${nickname} no tiene chats todavia` })
        /* Respondemos con el resultado */
        res.status(200).json({
            message: "Los chats se obtuvieron de forma correcta",
            data: chat
        })


    } catch (error) {
        errorLog(error, res)
    }

}

/* -    -   -   Ruta para crear un nuevo chat */
export const crearChat = async (req, res) => {
    try {
        const { _id, nickname } = req.user
        const { destino } = req.body
        if (!_id) return res.status(400).json({ message: "Falta el id del usuario" })
        if (!nickname) return res.status(400).json({ message: "Falta el nickname del usuario" })
        if (nickname === destino) return res.status(400).json({ message: "No puedes crear un chat con ti mismo" })

        const usuario = await Usuario.findOne({ nickname })
        if (!usuario) return res.status(400).json({ message: "El usuario no existe" })
        const destinatario = await Usuario.findOne({ nickname: destino })
        if (!destinatario) return res.status(400).json({ message: "El destinatario no existe" })


        const chat = await Chat.findOne({
            miembros: {
                $all: [
                    _id,
                    destinatario._id
                ]
            }
        })
        if (chat) {
            if (chat.deshabilitado) return res.status(400).json({ message: "Ya existe un chat y este se encuentra deshabilitado" })
            return res.status(400).json({ message: "El usuario ya tiene un chat con el destinatario" })
        }

        const responseCreateChat = await Chat.create({
            miembros: [_id, destinatario._id],
        })
        await Usuario.updateMany({ "_id": { $in: [_id, destinatario._id] } }, { $push: { chat: responseCreateChat._id } })

        res.status(200).json({
            message: "El chat se creo de forma correcta",
            data: responseCreateChat,
        })


    } catch (error) {
        errorLog(error, res)
    }
}

/* -    -   -   Ruta para actualizar un chat */
export const actualizarChat = async (req, res) => {
    try {
        const { _id } = req.user
        const { idChat, nombre } = req.body
        if (!_id) return res.status(400).json({ message: "Falta el id del usuario" })
        if (!idChat) return res.status(400).json({ message: "Falta el id del chat" })
        if (!nombre) return res.status(400).json({ message: "Falta el nombre a actualizar del chat" })

        const usuario = await Usuario.findOne({ _id })
        if (!usuario) return res.status(400).json({ message: "El usuario no existe" })
        const chatUsuario = await Chat.findOne({ _id: idChat })
        if (!chatUsuario) return res.status(400).json({ message: "El chat no existe" })
        if (chatUsuario.deshabilitado) return res.status(400).json({ message: "El chat se encuentra deshabilitado" })
        //Validamos que el usuario sea un miembro del chat
        if (!chatUsuario.miembros.includes(_id)) return res.status(400).json({ message: "El usuario no es miembro del chat" })


        const chat = await Chat.findOneAndUpdate({ _id: idChat }, { nombre })
        if (!chat) return res.status(400).json({ message: "El chat no se pudo actualizar" })

        res.status(200).json({
            message: "El chat se actualizo de forma correcta",
            data: {
                nombre
            },
        })
    } catch (error) {
        errorLog(error, res)
    }
}

/* -    -   -   Ruta para deshabilitar un chat */
export const deshabilitarChat = async (req, res) => {
    try {
        const { _id } = req.user
        /* Obtenemos el idChat por params */
        const { idChat } = req.params
        if (!_id) return res.status(400).json({ message: "Falta el id del usuario" })
        if (!idChat) return res.status(400).json({ message: "Falta el id del chat" })

        const usuario = await Usuario.findOne({ _id })
        if (!usuario) return res.status(400).json({ message: "El usuario no existe" })
        const chatUsuario = await Chat.findOne({ _id: idChat })
        if (!chatUsuario) return res.status(400).json({ message: "El chat no existe" })
        if (!chatUsuario.miembros.includes(_id)) return res.status(400).json({ message: "El usuario no es miembro del chat" })
        if (chatUsuario.deshabilitado) return res.status(400).json({ message: "El chat se encuentra deshabilitado" })
        const chat = await Chat.findByIdAndUpdate({ _id: idChat }, { deshabilitado: true })
        if (!chat) return res.status(400).json({ message: "El chat no se pudo eliminar" })



        res.status(200).json({
            message: "El chat se desactivo de forma correcta, se eliminara dentro de 30 dias de forma permanente",
            data: {
                chat
            },
        })

        console.log(chat)

    } catch (error) {
        errorLog(error, res)
    }
}

/* -    -   -   Ruta para habilitar un chat */
export const habilitarChat = async (req, res) => {
    try {
        const { _id } = req.user
        const { idChat } = req.params
        if (!_id) return res.status(400).json({ message: "Falta el id del usuario" })
        if (!idChat) return res.status(400).json({ message: "Falta el id del chat" })

        const usuario = await Usuario.findOne({ _id })
        if (!usuario) return res.status(400).json({ message: "El usuario no existe" })
        const chatUsuario = await Chat.findOne({ _id: idChat })
        if (!chatUsuario) return res.status(400).json({ message: "El chat no existe" })
        if (!chatUsuario.miembros.includes(_id)) return res.status(400).json({ message: "El usuario no es miembro del chat" })
        if (!chatUsuario.deshabilitado) return res.status(400).json({ message: "El chat se encuentra habilitado" })
        const chat = await Chat.findByIdAndUpdate({ _id: idChat }, { deshabilitado: false })
        if (!chat) return res.status(400).json({ message: "El chat no se pudo eliminar" })

        res.status(200).json({
            message: "El chat se activo de forma correcta",
            data: {
                chat
            },
        })

    } catch (error) {
        errorLog(error, res)
    }
}
