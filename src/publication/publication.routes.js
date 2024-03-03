import { Router } from "express";
import { check } from "express-validator";
import { getPublications, getPublicationById, createPublication} from "./publication.controller.js";
import { existePublicacionById} from "../helpers/db-validators-publi.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();


router.get("/", getPublications);

router.get(
  "/:id",
  [
    check("id", "Not a valid ID").isMongoId(),
    check("id").custom(existePublicacionById),
    validarCampos,
  ],
  getPublicationById
);

router.post(
  "/",
  [
      validarJWT,
      check("title", "The title is required").not().isEmpty(),
      check("category", "The category is required").not().isEmpty(),
      check("text", "The text is required").not().isEmpty(),
      validarCampos
  ],
  createPublication
);

export default router;
