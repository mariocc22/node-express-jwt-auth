const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cookieParser = require("cookie-parser"); //this pass cookie data

// routes
const authRoutes = require("./routes/authRoutes");

// middleware
const { requireAuth, checkUser } = require("./middleware/authMiddleware");

const app = express();

// middleware
app.use(express.static("public"));
app.use(express.json()); //takes any json data in a request and turns into a Javascript object to work on it in the code and send it to the handler as a req of that route
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");

// morgan middleware - give us all the details from our requests
app.use(morgan("dev"));

// database connection
const dbURI =
  "mongodb+srv://marioalbertocesea:ironmaiden123@cluster0.ofyxufd.mongodb.net/node-auth?retryWrites=true&w=majority";
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
app.get("*", checkUser); //apply for ALL ROUTES
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", requireAuth, (req, res) => res.render("smoothies")); // now you can use the requireAuth in any protected route you want to protect from users that are not logged in
app.use(authRoutes);

// // cookies - using middleware
// app.get("/set-cookies", (req, res) => {
//   res.cookie("newUser", false);
//   res.cookie("isEmployee", true, { maxAge: 1000 * 60 * 60 }); //this is how you can set the max age of expire of the cookie in your browser and other cool ways to add functionality - httpOnly: true this means you can only access in the server

//   res.send("You have the cookies now");
// });

// // read cookies
// app.get("/read-cookies", (req, res) => {
//   const cookies = req.cookies;
//   console.log(cookies.newUser);

//   // display the cookies as a json
//   res.json(cookies);
// });
