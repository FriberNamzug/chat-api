import { Router } from 'express'
import * as auth from '../controllers/auth.controller'

const router = Router()

router.post('/register', auth.registrarse)
router.post('/login', auth.inicioSesion)
router.post('/register/nickname', auth.validarNickName)

export default router