import mongoose from 'mongoose';

const PublicationSchema = mongoose.Schema({
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

PublicationSchema.methods.toJSON = function () {
  const { __v, _id, ...publicacion } = this.toObject();
  publicacion.uid = _id;
  return publicacion;
};

export default mongoose.model('Publication', PublicationSchema);
