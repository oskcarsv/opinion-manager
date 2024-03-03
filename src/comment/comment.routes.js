import { Router } from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';

import {
    getComments,
    createComment,
    updateComment,
    deleteComment,
} from './comment.controller.js';

const router = Router();

router.get('/', getComments);

router.post(
    '/',
    [
        validarJWT,
        check('post', 'The id post is required').isMongoId(),
        check('text', 'Comment text is required').not().isEmpty(),
        validarCampos,
    ],
    createComment
);

router.put(
    '/:id',
    [
        validarJWT,
        check('id', 'Not a valid ID').isMongoId(),
        validarCampos, 
    ],
    updateComment
);

router.delete(
    '/:id',
    [
        validarJWT,
        check('id', 'Not a valid ID').isMongoId(),
        validarCampos,
    ],
    deleteComment
);

export default router;
