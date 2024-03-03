// Importar módulos y controladores necesarios
import { Router } from "express";
import { check } from "express-validator";
import { login } from "./auth.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";

const router = Router();

router.post(
    '/login',
    [
        check('correo', 'This is not a valid email').isEmail(),
        check('password', 'The password is required').not().isEmpty(),
        validarCampos,
    ],
    login
);

export default router;
