'use strict';

import { Schema, model } from "mongoose";

const CommentSchema = Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: [true, "El ID del usuario es obligatorio"],
    },
    post: {
        type: Schema.ObjectId,
        ref: 'Post',
        required: [true, "El ID de la publicación es obligatorio"],
    },
    text: {
        type: String,
        required: [true, "El texto del comentario es obligatorio"],
    },
    estado: {
        type: Boolean,
        default: true,
    },
});

export default model('Comment', CommentSchema);
