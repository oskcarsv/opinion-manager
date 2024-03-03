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

    const userId = req.usuario._id;

    const user = await User.findById(userId);

    const post = new Post({ title, category, text, user: userId });

    await post.save();

    res.status(200).json({
        msg: "Post created successfully",
        post: {
            ...post._doc,
            user: user.nombre,
        },
    });
}

export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { _id, ...rest } = req.body;
  
    const userId = req.usuario._id;
  
    const user = await User.findById(userId);
  
    const post = await Post.findById(id);
  
    if (post.user.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({
        msg: "Access denied, only the owner of the post can edit this post",
      });
    }
  
    const updatedPost = await Post.findByIdAndUpdate(id, { ...rest }, { new: true });
  
    if (!updatedPost) {
      return res.status(404).json({
        msg: "Post not found",
      });
    }
  
    res.status(200).json({
      msg: "Post updated successfully",
      post: {
        ...updatedPost._doc,
        user: user.nombre,
      },
    });
  };
    

export const deletePost = async (req, res) => {
    const { id } = req.params;

    const post = await Post.findById(id);

    if (post.user.toString() !== req.usuario._id.toString()) {
        return res.status(403).json({
            msg: "Access denied, only the owner of the post can delete this post"
        });
    }

    await Post.findByIdAndUpdate(id, { estado: false });

    res.status(200).json({
        msg: "Post deleted successfully"
    });
}