import { Router } from "express";
import { check } from "express-validator";
import { getUsers, createUser, getUserById, updateUser} from "./user.controller.js";
import { existenteEmail, existenteUsername, existeUsuarioById} from "../helpers/db-validators.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.get("/", getUsers);

router.get(
  "/:id",
  [
    check("id", "Not a valid ID").isMongoId(),
    check("id").custom(existeUsuarioById),
    validarCampos,
  ],
  getUserById
);

router.post(
  "/",
  [
    check("nombre", "The name is required").not().isEmpty(),
    check("username", "The password is required").not().isEmpty(),
    check("password", "The password must be greater than 6 characters").isLength({ min: 6,}),
    check("correo", "This is not a valid email").isEmail(),
    check("username").custom(existenteUsername),
    check("correo").custom(existenteEmail),
    validarCampos,
  ],
  createUser
);

router.put(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeUsuarioById),
    validarCampos,
  ],
  updateUser
);

export default router;

