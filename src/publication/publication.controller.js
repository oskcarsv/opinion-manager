import { response, request } from "express";
import Publication from './publication.model.js';
import User from '../user/user.model.js';

export const getPublications = async (req = request, res = response) => {
    const { limite, desde } = req.query;
    const query = { estado: true };

    const [total, publications] = await Promise.all([
        Publication.countDocuments(query),
        Publication.find(query)
            .skip(Number(desde))
            .limit(Number(limite)),
    ]);

    res.status(200).json({
        total,
        publications,
    });
}

export const getPublicationById = async (req, res) => {
    const { id } = req.params;
    const publication = await Publication.findOne({ _id: id });

    res.status(200).json({
        publication,
    });
}

export const createPublication = async (req, res) => {
    const { title, category, text } = req.body;

    // Accede al ID del usuario autenticado
    const userId = req.usuario._id;

    // Obtener el nombre del usuario
    const user = await User.findById(userId);

    const publication = new Publication({ title, category, text, user: userId });

    await publication.save();

    res.status(200).json({
        msg: "Post created successfully",
        publication: {
            ...publication._doc, // Mostrar todos los datos de la publicación
            user: user.nombre, // Mostrar solo el nombre del usuario
        },
    });
}