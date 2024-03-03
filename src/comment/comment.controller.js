import { response, request } from "express";
import Comment from './comment.model.js';
import User from '../user/user.model.js';
import Post from '../post/post.model.js';


export const getComments = async (req, res) => {
    const { limite, desde } = req.query;
    const query = { estado: true };

    const [total, comments] = await Promise.all([
        Comment.countDocuments(query),
        Comment.find(query)
            .populate('user', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite)),
    ]);

    res.status(200).json({
        total,
        comments,
    });
};

export const createComment = async (req, res) => {
    const { text, post } = req.body;
    const userId = req.usuario._id;
  
    const user = await User.findById(userId);
    const postExists = await Post.findById(post);
  
    if (!postExists) {
      return res.status(400).json({
        msg: "The post does not exist",
      });
    }
  
    const newComment = new Comment({
      user: userId,
      post,
      text,
    });
  
    await newComment.save();
  
    res.status(201).json({
      msg: "Comment created successfully",
      comment: {
        ...newComment._doc,
        user: user.nombre,
        post: postExists.title,
      },
    });
  };
  
  export const updateComment = async (req, res) => {
    const { id } = req.params;
    const { _id, ...rest } = req.body;

    const comment = await Comment.findById(id);

    if (comment.user.toString() !== req.usuario._id.toString()) {
        return res.status(403).json({
            msg: "Access denied, only the author of the comment can edit this comment",
        });
    }

    const updatedComment = await Comment.findByIdAndUpdate(id, rest, { new: true });

    const user = await User.findById(updatedComment.user);
    const post = await Post.findById(updatedComment.post); 

    res.status(200).json({
        msg: "Comment updated successfully",
        comment: {
            ...updatedComment._doc,
            user: user.nombre,
            post: post.title,
        },
    });
};


export const deleteComment = async (req, res) => {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (comment.user.toString() !== req.usuario._id.toString()) {
        return res.status(403).json({
            msg: "Access denied, only the comment author can delete this comment",
        });
    }

    await Comment.findByIdAndUpdate(id, { estado: false });

    res.status(200).json({
        msg: "Comment successfully deleted",
    });
};
