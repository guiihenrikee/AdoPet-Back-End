import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const UserSchema = new Schema({
  name: {
    type: String,
    required: "Digite o nome completo"
  },
  email: {
    type: String,
    required: "Digite a senha"
  },
  password: {
    type: String,
    required: "Digite a senha"
  },
  newsletter: {
    type: Boolean,
    default: true
  }
})

