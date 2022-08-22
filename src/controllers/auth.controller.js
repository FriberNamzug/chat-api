import Usuario from "../models/usuario.model.js";
import Perfil from "../models/perfil.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import errorLog from "../config/error";

/*             Registro de usuario                    */
export const registrarse = async (req, res) => {
    try {

        const { nickname, password, email } = req.body

        if (!nickname || !password || !email) return res.status(400).json({ message: "Faltan datos" })

        if (nickname.length < 3 || nickname.length > 20) return res.status(400).json({ message: "El nickname debe tener entre 3 y 20 caracteres" })
        if (!nickname.match(/^[a-zA-Z0-9]+$/)) return res.status(400).json({ message: "El nickname debe tener solo caracteres alfanumericos" })
        if (email.length < 3 || email.length > 50) return res.status(400).json({ message: "El email debe tener entre 3 y 50 caracteres" })
        if (!email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)) return res.status(400).json({ message: "El email debe tener un formato valido" })
        if (password.length < 8 || password.length > 20) return res.status(400).json({ message: "La contraseña debe tener entre 8 y 20 caracteres" })
        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/)) return res.status(400).json({ message: "La contraseña debe tener al menos una mayuscula, una minuscula, un numero y un caracter especial" })

        const emailExiste = await Usuario.findOne({ email: email.toLowerCase() })
        if (emailExiste) return res.status(400).json({ message: "El email ya existe" })

        const nickNameExiste = await Usuario.findOne({ nickname }) 
        if (nickNameExiste) return res.status(400).json({ message: "El NickName ya existe" })

        const passwordEncriptado = await bcrypt.hash(password, 10)

        const usuario = await Usuario.create({
            nickname,
            email,
            password: passwordEncriptado
        })
        const perfil = await Perfil.create({
            perfil: usuario._id,
        })
        usuario.perfil = perfil._id

        await usuario.save()

        const token = jwt.sign({ _id: usuario._id, nickname: usuario.nickname }, process.env.TOKEN_SECRET, {
            expiresIn: parseInt(process.env.TOKEN_EXPIRES_IN)

        })

        res.status(200).json({
            message: `Bienvenid@ ${nickname} has sido registrad@ con exito`,
            data: {
                usuario: {
                    nickname: nickname,
                    email: email
                },
                token: token
            },

        })

    } catch (error) {
        errorLog(error, res)
    }
}

/*             INICIAMOS SESION                     */
export const inicioSesion = async (req, res) => {

    try {

        const { email, password } = req.body
        if (!email || !password) return res.status(400).json({ message: "Faltan datos", })
        if (!email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)) return res.status(400).json({ message: "El email debe tener un formato valido" })

        const usuario = await Usuario.findOne({ email: email.toLowerCase() })
        if (!usuario) return res.status(400).json({ message: "El E-mail no se encuntra registrado" })
        if (usuario.deshabilitado === true) return res.status(400).json({ message: "El usuario esta deshabilitado" })

        const passwordCorrecto = await bcrypt.compare(password, usuario.password)
        if (!passwordCorrecto) return res.status(400).json({ message: "La contraseña es incorrecta" })

        const token = jwt.sign({ _id: usuario._id, nickname: usuario.nickname }, process.env.TOKEN_SECRET, {
            expiresIn: parseInt(process.env.TOKEN_EXPIRES_IN)
        })


        res.status(200).json({
            message: `Bienvenid@ ${usuario.nickname} iniciaste sesion de forma exitosa`,
            data: {
                usuario: {
                    nickname: usuario.nickname,
                    email: usuario.email
                },
                token: token,
            }
        })

    } catch (error) {
        errorLog(error, res)
    }
}

export const validarNickName = async (req, res) => {
    try {
        const { nickname } = req.body
        if (!nickname) return res.status(400).json({ message: "Faltan datos" })
        if (nickname.length < 3 || nickname.length > 20) return res.status(400).json({ message: "El nickname debe tener entre 3 y 20 caracteres" })
        if (!nickname.match(/^[a-zA-Z0-9]+$/)) return res.status(400).json({ message: "El nickname debe tener solo caracteres alfanumericos" })
        const usuario = await Usuario.findOne({ nickname })
        if (usuario) return res.status(400).json({ message: "El nickname ya existe" })
        res.status(200).json({ message: "El nickname esta disponible" })
    } catch (error) {
        capturarError(error, res)
    }
}