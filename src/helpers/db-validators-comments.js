import Comment from '../Comment/comment.model.js';


export const existeCommentById = async (id = '') => {
    const existeComment = await Comment.findById(id);

    if (!existeComment) {
        throw new Error(`ID: ${id} Doesn't exist`);
    }
}
