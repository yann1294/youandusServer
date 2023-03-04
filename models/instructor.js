import mongoose from 'mongoose'
const {Schema} = mongoose
const {ObjectId} = Schema

const instructorSchema = new Schema(
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
        passwordResetCode: {
            data: String,
            default: "",
          },
        image: {},
        role: {
            type: String,
            default: 'Instructor'
        },
        courses: [
            {
                type: ObjectId,
                ref: 'Course'
            }
        ]
    },
    {timestamps: true}
)

export default mongoose.model('Instructor',instructorSchema);