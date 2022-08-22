import {Router} from 'express'
import * as chatController from '../controllers/chat.controller'
import { verifyToken, verifyUserEnable } from '../middlewares/verify'


const router = Router()

/*  -   -   -   Rutas de Chats   -   -   -   */
//Ruta para obtener todos los chats de un usuario
router.get('/',verifyToken, verifyUserEnable, chatController.obtenerChats)

//Ruta para crear un nuevo chat
router.post('/',verifyToken, verifyUserEnable, chatController.crearChat)

//Ruta para actualizar un chat
router.put('/',verifyToken, verifyUserEnable, chatController.actualizarChat)

//Ruta para deshabilitar un chat
router.delete('/disable/:idChat',verifyToken, verifyUserEnable, chatController.deshabilitarChat)

//Ruta para habilitar un chat
router.delete('/enable/:idChat',verifyToken, verifyUserEnable, chatController.habilitarChat)



export default router