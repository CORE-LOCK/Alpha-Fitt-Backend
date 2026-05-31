import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();  

// connecting to database 

const mongodb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("database connected");
  } catch (error) {
    console.log(error, "can't conned to database");
  }
};

const userschema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      // unique: true,
    },
    phoneno: {
      type: Number,
      required: true,
    },
    message:{
      type:String,
      required: false
    }
  },
  { timestamps: true },
);

const User = mongoose.model("User", userschema);

// nodemailer config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

// using middlewares
app.use(cors());
app.use(express.json());

// routes

app.post("/submit", async (req, res) => {
  try {
    const { name, email, phoneno, message } = req.body;
    const newuser = new User({ name, email, phoneno, message });
    await newuser.save();
    // send email
    await transporter.sendMail({
      from: "sonusharma5129211@gmail.com",
      to: "sonu.webdesigner30@gmail.com",
      subject: "New Form Submission",
      html: `
<h2>new form submission </h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Phone No:</strong> ${phoneno}</p>
`,
    });

    await transporter.sendMail({
      from:"sonusharma5129211@gmail.com",
      to:email,
      subject:"thankyou for submitting form",
      html:`<h2> Welcome to AlphaFit <br>
      thank you for submitting the form</h2>`
    });

    res.status(200).json({ message: "data submited successfully + email sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/", (req, res) => {
  res.send(" server is running");
});

app.get("/about", (req, res) => {
  res.send("welcome to about page");
});

app.get("/contact", (req, res) => {
  res.json({
    name: "sonu",
    age: 21,
  });
});

// porting the server

const port = process.env.PORT || 8080;
mongodb();
app.listen(port, () => {
  console.log(`port is working on port ${port}`);
});