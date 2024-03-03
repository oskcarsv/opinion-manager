import Post from '../post/post.model.js';


export const existePublicacionById = async (id = '') => {
    const existePublicacion = await Post.findById(id);

    if (!existePublicacion) {
        throw new Error(`ID: ${id} Doesn't exist`);
    }
}
