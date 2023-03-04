import User from '../models/user';
import { hashPassword } from "../utils/auth";
import AWS from "aws-sdk";
import { nanoid } from "nanoid";
import slugify from 'slugify'

const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    apiVersion: process.env.AWS_API_VERSION,
  };


const S3 = new AWS.S3(awsConfig);

export const createStudent = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      // validation
      // if (!name) return res.status(400).send("Name is required");
      // if (!password || password.length < 6) {
      //   return res
      //     .status(400)
      //     .send("Password is required and should be min 6 characters long");
      // }
      let userExist = await User.findOne({ email, slug: slugify(req.body.name.toLowerCase()) }).exec();
      if (userExist) return res.status(400).send("Email is taken");
  
      // hash password
      const hashedPassword = await hashPassword(password);
  
      // register
      const user = new User({
        ...req.body,
        name,
        slug: slugify(req.body.name),
        student: req.user._id,
        email,
        password: hashedPassword,
        role: 'Subscriber',
      });
      await user.save();
      // console.log("saved user", user);
      return res.json({ ok: true });
    } catch (err) {
      console.log(err);
      return res.status(400).send("Error. Try again.");
    }
  };

  export const uploadImage = async (req, res) => {
    // console.log(req.body);
    try {
      const { image } = req.body;
      if (!image) return res.status(400).send("No image");
  
      // prepare the image
      const base64Data = new Buffer.from(
        image.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
  
      const type = image.split(";")[0].split("/")[1];
  
      // image params
      const params = {
        Bucket: "clovimy-bucket",
        Key: `${nanoid()}.${type}`,
        Body: base64Data,
        ACL: "public-read",
        ContentEncoding: "base64",
        ContentType: `image/${type}`,
      };
  
      // upload to s3
      S3.upload(params, (err, data) => {
        if (err) {
          console.log(err);
          return res.sendStatus(400);
        }
        console.log(data);
        res.send(data);
      });
    } catch (err) {
      console.log(err);
    }
  };

  export const removeImage = async (req, res) => {
    try {
      const { image } = req.body;
      // image params
      const params = {
        Bucket: image.Bucket,
        Key: image.Key,
      };
  
      // send remove request to s3
      S3.deleteObject(params, (err, data) => {
        if (err) {
          console.log(err);
          res.sendStatus(400);
        }
        res.send({ ok: true });
      });
    } catch (err) {
      console.log(err);
    }
  };

  export const findStudent = async (req, res) => {
    try {
      const students = await User.find({ role: 'Subscriber' })
        .sort({ createdAt: -1 })
        .exec();
      res.json(students);
    } catch (err) {
      console.log(err);
    }
  };

  export const read = async(req,res) => {
    try {
        const student = await User.findOne({ slug: req.params.slug})
                                .populate(
                                    'student',
                                    '_id name'
                                ).exec()
        res.json(student)
    } catch (error) {
        console.log(error)
    }
  }

  export const deleteStudent = async(req, res) => {
    try {
        const student = await User.findOneAndDelete({slug:req.params.slug}).exec()
        res.json(student)
    } catch (error) {
        console.log(error)
    }
  }

  export const update = async(req,res) =>{
    try {
        const {slug} = req.params;
        const student = await User.findOne({slug}).exec()
        if(req.user._id != student.student){
            return res.status(400).send('Unauthorised');
        }
        const updated = await User.findOneAndUpdate(
            {slug},
            req.body,
            {new:true}
        ).exec()
        res.json(updated)
    } catch (error) {
        console.log(error)
        return res.status(400).send(err.message);
    }
  }

