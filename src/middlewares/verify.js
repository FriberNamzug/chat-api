import Usuario from "../models/usuario.model"
import jwt from 'jsonwebtoken'

export function verifyToken(req, res, next) {

    try {

        const accessToken = req.headers['x-access-token'] || req.headers['authorization']
        if (!accessToken) return res.status(401).json({ message: 'No tienes autorización para estar aqui' })
        const token = accessToken.split(' ')[1]
        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if (err) return res.status(401).json({ message: 'El token de acceso no es válido' })
            req.user = user
            next()
        })

    } catch (error) {
        res.status(500).json({
            message: "Ocurrio un error en el servidor",
            error,
        })
        console.log(`Ocurrio un error en el servidor: ${error})`)
    }
}

export const verifyUserEnable = async (req, res, next) => {

    try {
        const { nickName } = req.user
        //Verificamos en la base de datos si el usuario esta habilitado
        const usuario = await Usuario.findOne({ nickName: nickName })
        //validamos que el usuario exista
        if (!usuario) return res.status(400).json({ ok: false, error: "El usuario no existe" })
        if (usuario.deshabilitado === true) return res.status(400).json({ message: "El usuario esta deshabilitado" })

        next()

    } catch (error) {
        res.status(500).json({
            message: "Ocurrio un error en el servidor al intentar validar que el usuario estubiera habilitado",
            data: error,
        })
        console.log(`Ocurrio un error en el servidor al intentar validar que el usuario estubiera habilitado: ${error})`)
        return
    }
}
