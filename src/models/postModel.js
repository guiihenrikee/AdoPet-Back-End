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
  cloudinary_id: {
    type: String,
  },
  description: {
    type: String,
    required: "Digite sobre o pet",
  },
  // contactInfo: {
  //   name: {
  //     type: String,
  //     required: "Digite o seu nome",
  //   },
  //   phone: {
  //     type: String,
  //     required: "Digite o seu telefone",
  //   },
  //   email: {
  //     type: String,
  //     required: "Digite o seu email",
  //   },
  // },
});
