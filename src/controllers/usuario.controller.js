import Usuario from "../models/usuario.model"
import bcrypt from "bcryptjs"
import errorLog from "../config/error";
import fs from "fs"

/*      OBTENER USUARIO POR NICKNAME       */
export const obtenerUsuarioPorNickName = async (req, res) => {
    try {
        const { nickname } = req.params;
        if (!nickname) return res.status(400).json({ message: "El nickname es requerido" })
        const usuario = await Usuario.findOne({ nickname: nickname }, { password: 0 })
        if (!usuario) return res.status(400).json({ message: "El usuario no existe" })

        res.status(200).json({
            message: "Se ha obtenido el usuario de forma correcta",
            data: {
                nickname: usuario.nickname,
                estatus: usuario.estatus,
                avatar: usuario.avatar,
                createdAt: usuario.createdAt,
            }
        })
    }
    catch (error) {
        errorLog(error, res)
    }
}
/*              ACTUALIZAR PASSWORD               */
export const actualizarPassword = async (req, res) => {

    try {

        const { nuevaPassword, viejaPassword } = req.body
        const id = req.user._id

        if (!nuevaPassword || !viejaPassword) return res.status(400).json({ message: "Faltan datos" })
        if (nuevaPassword.length < 8 || nuevaPassword.length > 20) return res.status(400).json({ message: "La nueva contraseña debe tener entre 8 y 20 caracteres" })
        if (!nuevaPassword.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/)) return res.status(400).json({ message: "La contraseña debe tener al menos una mayuscula, una minuscula, un numero y un caracter especial" })
        if (nuevaPassword === viejaPassword) return res.status(400).json({ message: "La nueva contraseña no puede ser igual a la anterior" })

        //Validamos que el usuario exista
        let usuarioEncontrado = await Usuario.findById(id)
        if (!usuarioEncontrado) return res.status(400).json({ message: "No encontramos el usuario buscado" })

        const viejaPasswordCorrecta = await bcrypt.compare(viejaPassword, usuarioEncontrado.password)
        if (!viejaPasswordCorrecta) return res.status(400).json({ message: "La contraseña anterior no es correcta" })

        const nuevaPasswordEncriptada = await bcrypt.hash(nuevaPassword, 10)

        const usuario = {
            password: nuevaPasswordEncriptada
        }

        await Usuario.findByIdAndUpdate(id, usuario, {})

        res.status(200).json({
            message: "Se actualizo de forma exitosa el password",
        })

        //Por si hay errores */
    } catch (error) {
        errorLog(error, res)
    }
}
/*                  ACTUALIZAR EL USUARIO             */
export const actualizarUsuario = async (req, res) => {

    try {
        const { nickname, email } = req.body
        const id = req.user._id

        if (!nickname || !email || !id) return res.status(400).json({ message: "Faltan datos" })
        if (email.length < 3 || email.length > 50) return res.status(400).json({ message: "El email debe tener entre 3 y 50 caracteres" })
        if (!email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)) return res.status(400).json({ message: "El email debe tener un formato valido" })

        const usuario = await Usuario.findById(id)
        if (!usuario) return res.status(400).json({ message: "No existe el usuario" })

        if (nickname === usuario.nickname && email === usuario.email) {
            return res.status(200).json({ message: "No se hizo ningun cambio" })
        }

        if (nickname !== usuario.nickname) {
            const existeNickName = await Usuario.findOne({ nickname: nickname })
            if (existeNickName) return res.status(400).json({ message: "El nickname ya existe" })
        }

        if (email !== usuario.email) {
            const existeEmail = await Usuario.findOne({ email: email })
            if (existeEmail) return res.status(400).json({ message: "El email ya existe" })
        }

        const nuevoUsuario = {
            nickname: nickname,
            email: email,
        }
        const usuarioActualizado = await Usuario.findByIdAndUpdate(id, nuevoUsuario, {
            new: true
        })
        res.status(200).json({
            message: 'Se actualizo de forma exitosa',
            data: {
                nickname: usuarioActualizado.nickname,
                email: usuarioActualizado.email,
            }
        })

    } catch (error) {
        errorLog(error, res)
    }

}
/*                  ELIMINAR USUARIO             */
export const deshabilitarUsuario = async (req, res) => {

    try {
        const { password } = req.body
        const id = req.user._id

        if (!password) return res.status(400).json({ message: "Faltan datos" })

        const usuario = await Usuario.findById(id)

        if (!usuario) return res.status(400).json({ message: "No encontramos el usuario buscado" })
        if (usuario.deshabilitado === true) return res.status(400).json({ message: "El Usuario ya se encuentra desactivado" })

        const passwordCorrecta = await bcrypt.compare(password, usuario.password)
        if (!passwordCorrecta) return res.status(400).json({ message: "La contraseña no es correcta" })

        const usuarioDeshabilitado = {
            deshabilitado: true
        }
        await Usuario.findByIdAndUpdate(id, usuarioDeshabilitado, {
            new: true
        })
        res.status(200).json({
            message: "Se deshabilito de forma exitosa el usuario"
        })
    } catch (error) {
        errorLog(error, res)
    }
}
/*    SUBIR/ACTUALIZAR IMAGEN DE PERFIL DE USUARIO     */
export const subirImagenPerfil = async (req, res) => {
    try {
        const { _id } = req.user

        const usuario = await Usuario.findOne({ _id: _id }, { avatar: 1 })
        if (!usuario) return res.status(400).json({ message: "El usuario no existe" })
        const url = req.file.path.split("\\").slice(1).join("/")
        const actualizado = await Usuario.findByIdAndUpdate(_id, {
            avatar: url
        }, {
            new: true
        })
        res.status(200).json({
            message: 'Se subio de forma exitosa la imagen de perfil',
            data: {
                image: actualizado.avatar,
            }
        })
    } catch (error) {
        errorLog(error, res)
    }

}
/*    BORRAR IMAGEN DE PERFIL DE USUARIO     */
export const borrarImagenPerfil = async (req, res) => {
    try {
        const { _id } = req.user

        const usuario = await Usuario.findOne({ _id: _id }, { avatar: 1 })
        if (!usuario) return res.status(400).json({ message: "El usuario no existe" })
        if (usuario.img === "images/users/default/avatar-predeterminado.png") return res.status(400).json({ message: "No se puede borrar la imagen predeterminada" })
        fs.unlinkSync(`./public/${usuario.avatar}`)

        const actualizado = await Usuario.findByIdAndUpdate(_id, {
            avatar: "images/users/default/avatar-predeterminado.png"
        }, { new: true })

        res.status(200).json({
            message: 'Se elimino de forma permanente la imagen de perfil',
            data: {
                avatar: actualizado.avatar,
            }
        })
    } catch (error) {
        errorLog(error, res)
    }

}