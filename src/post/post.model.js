'use strict';

import { Schema, model } from "mongoose";

const PostSchema = Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: [true, "The user id is required"],
  },
  title: {
    type: String,
    required: [true, "The title is required"],
  },
  category: {
    type: String,
    required: [true, "The category is required"],
  },
  text: {
    type: String,
    required: [true, "The text is required"],
  },
  estado: {
    type: Boolean,
    default: true,
  },
});


export default model('Post', PostSchema);
