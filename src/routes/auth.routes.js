import { Router } from 'express'
import * as auth from '../controllers/auth.controller'
import { verifyToken } from '../middlewares/verify'
const router = Router()

router.post('/register', auth.registrarse)
router.post('/login', auth.inicioSesion)
router.post('/register/nickname', auth.validarNickName)
router.get('/verify', verifyToken, auth.verifyToken)

export default router