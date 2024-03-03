import { response, request } from "express";
import Post from './post.model.js';
import User from '../user/user.model.js';

export const getPosts = async (req = request, res = response) => {
    const { limite, desde } = req.query;
    const query = { estado: true };

    const [total, posts] = await Promise.all([
        Post.countDocuments(query),
        Post.find(query)
            .skip(Number(desde))
            .limit(Number(limite)),
    ]);

    res.status(200).json({
        total,
        posts,
    });
}

export const getPostById = async (req, res) => {
    const { id } = req.params;
    const post = await Post.findOne({ _id: id });

    res.status(200).json({
        post,
    });
}

export const createPost = async (req, res) => {
    const { title, category, text } = req.body;

    // Accede al ID del usuario autenticado
    const userId = req.usuario._id;

    // Obtener el nombre del usuario
    const user = await User.findById(userId);

    const post = new Post({ title, category, text, user: userId });

    await post.save();

    res.status(200).json({
        msg: "Post created successfully",
        post: {
            ...post._doc, // Mostrar todos los datos de la publicación
            user: user.nombre, // Mostrar solo el nombre del usuario
        },
    });
}