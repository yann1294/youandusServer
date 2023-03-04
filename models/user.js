import mongoose from "mongoose";
const { Schema } = mongoose;
const { ObjectId } = Schema

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 64,
    },
    picture: {
      type: String,
      default: "/avatar.png",
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: {},
    age: { type: Number, min: 18, max: 65 },
    country: String,
    role: {
      type: [String],
      // default: ["Subscriber"],
      enum: ["Subscriber", "Instructor", "Admin"],
    },
    passwordResetCode: {
      data: String,
      default: "",
    },
    student: {
      type: ObjectId,
      ref: 'User',
    },
    instructor: {
      type: ObjectId,
      ref: 'User',
    },
    courses: [
      {
        type: ObjectId,
        ref: 'Course'
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
