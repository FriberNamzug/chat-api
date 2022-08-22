import { Router } from 'express'
import * as user from '../controllers/usuario.controller'
import { verifyToken, verifyUserEnable } from '../middlewares/verify'
import { upload } from '../middlewares/storage'

const router = Router()


// Ruta para obtenemos a un usuario por el nickName
router.get('/buscar/:nickname', verifyToken, verifyUserEnable, user.obtenerUsuarioPorNickName)

// Ruta para actualizar a un usuario
router.post('/update', verifyToken, verifyUserEnable, user.actualizarUsuario)

// Ruta para actualizar la contraseña de un usuario
router.post('/password', verifyToken, verifyUserEnable, user.actualizarPassword)

//Ruta para deshabilitar a un usuario
router.delete('/disable', verifyToken, verifyUserEnable, user.deshabilitarUsuario)

//Ruta para subir una imagen de perfil
router.post('/image', verifyToken, verifyUserEnable, upload, user.subirImagenPerfil)

//Ruta para borrar una imagen de perfil
router.delete('/image', verifyToken, verifyUserEnable, user.borrarImagenPerfil)


export default router