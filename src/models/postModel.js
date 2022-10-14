import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const PostSchema = new Schema({
  petName: {
    type: String,
    required: "Digite o nome do pet",
  },
  photo: {
    type: String,
    required: "Anexe uma foto!",
  },
  description: {
    type: String,
    required: "Digite sobre o pet",
  },
  cloudinary_id: {
    type: String,
  },
  userID: {
    type: String,
    required: "Dono do post nao vinculado",
  },
});
