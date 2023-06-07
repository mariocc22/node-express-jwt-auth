const mongoose = require("mongoose");
const { isEmail } = require("validator"); //validates if its an email
const bcrypt = require("bcrypt"); //this will help us to hash our passwords

// 1. create schema
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please enter an email"],
      unique: true,
      lowercase: true,
      validate: [isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please enter an password"],
      minlength: [6, "Minimum password length is 6 characters"],
    },
  },
  { timestamps: true }
);

// fire a function AFTER doc saves to db - triggers after saving it
userSchema.post("save", function (doc, next) {
  console.log("new user was created and saved", doc);
  next();
});

// fire a function BEFORE doc saves to db
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(); //extra security to your password
  this.password = await bcrypt.hash(this.password, salt); // before saving the password we encrypt it and make it stronger

  next();
});

// create static method to login user - verify emails
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email }); //if find the user it stores it if not = undefined
  if (user) {
    const auth = await bcrypt.compare(password, user.password); // we compare passwords (hash the password first and then compare) it returns true or false
    if (auth) {
      return user;
    }
    throw new Error("incorrect password");
  }
  throw new Error("incorrect email");
};

const User = mongoose.model("user", userSchema); //THIS IS IMPORTANT - you must name it as the singular of your collection name. e.g. database = users so your model should be "user"

module.exports = User;
