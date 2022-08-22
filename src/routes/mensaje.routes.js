import {Router} from 'express'
import * as msgController from '../controllers/mensaje.controller'
import { verifyToken, verifyUserEnable } from '../middlewares/verify'


const router = Router()

/*  -   -   -   Rutas de mensajes   -   -   -   */
//Ruta para obtener los mensajes de un chat especifico
router.get('/:idChat',verifyToken, verifyUserEnable, msgController.obtenerMensajes)

//Ruta para enviar un mensaje a un chat especifico
router.post('/add',verifyToken, verifyUserEnable, msgController.agregarMensaje)

//Ruta para actualizar un mensaje por su ID
router.put('/update',verifyToken, verifyUserEnable, msgController.actualizarMensaje)

//Ruta para eliminar un mensaje por su ID
router.delete('/:idMensaje',verifyToken, verifyUserEnable, msgController.eliminarMensaje)

export default router