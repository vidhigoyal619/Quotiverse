const express = require("express");
const path = require("path");
const hbs = require("hbs");
const port = process.env.PORT || 8000;
require("./db/conn");
const { fetchQuotesByCategory }= require("./api/quotesApi");
const axios = require('axios');
const nodemailer = require('nodemailer');
const Register = require("./models/registers");
const SurveyResponse = require("./models/surveyResponse");
const app = express();
 

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");
app.use(express.static(static_path))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);
app.get("/", (req, res)=>{
    res.render("index")
});
app.get("/index", (req, res) => {
    res.render("index");
});
app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/signup", (req, res) => {
    res.render("signup");
});

// if user is already registered than users data must be fetched from db.
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Register.findOne({ email });

        if (!user || user.password !== password) {
            return res.render("login", { error: "Invalid email or password." });
        }

        // Redirect to the popup page after login
        res.redirect("/popup");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

let registeredUser;
// create new user in the database. Data get from user and stored in db.
app.post("/signup", async (req, res) => {
    try {
        const { fullname, email, phone, password } = req.body;
        const newUser = new Register({
            fullname,
            email,
            phone,
            password
        });

        // Save the user data to the "registers" collection
        registeredUser = await newUser.save();

        // Redirect to the popup page after signup
        res.redirect("/login");
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
});

app.get("/popup", (req, res) => {
    res.render("popup");
});
app.get("/survey", (req, res)=>{
    res.render("survey");
});

app.post("/survey-success", async (req, res) => {
    try {
        const { category, timeInterval } = req.body;

        const userId = registeredUser._id; 
        const surveyResponse = new SurveyResponse({
            category,
            timeInterval,
            user: userId
        });
        await surveyResponse.save();
        res.redirect("/survey-success");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});
// app.get("/survey-success", async (req, res) => {
//     try {
//         // Get the registered user's email using their ID
//         const userId = registeredUser._id; // Replace with the actual user's ID
//         const userRegistered = await Register.findById(userId);
//         const userEmail = userRegistered.email;
//         // Get the user's selected category from the latest survey response
//         const latestSurveyResponse = await SurveyResponse.findOne({ user: userId }).sort({ createdAt: -1 });
//         const selectedCategory = latestSurveyResponse.category;

//         // Fetch quotes based on the selected category
//         const quotes = await fetchQuotesByCategory(selectedCategory);

//         // Send the quotes to the user's email
//         const transporter = nodemailer.createTransport({
//             host: 'smtp.ethereal.email',
//             port: 587,
//             auth: {
//                 user: 'tyrique89@ethereal.email',
//                 pass: 'qHfEBkRSETmRcuNtUX'
//             }
//         });

//        const mailOptions = {
//             from: 'quoterandom4@gmail.com', // Sender email
//             to: userEmail, // Receiver email
//             subject: 'Quotes of the Day', // Email subject
//             html: `<h1>Quotes for You</h1><p>${quotes}</p>` // Email body with fetched quotes
//         };

//         const info = await transporter.sendMail(mailOptions); // Sending email
//         transporter.sendMail(mailOptions, (error, info) => {
//             if (error) {
//                 console.log("Error sending email:", error);
//                 // Handle error
//                 return res.status(500).send("Failed to send quotes via email");
//             } else {
//                 console.log("Email sent:", info.response);
//                 // Redirect to a success page or render a success message
//                 return res.render("survey-success");
//             }
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).send("Internal Server Error");
//     }
// });


app.get("/survey-success", async (req, res) => {
    try {
        // Get the registered user's email using their ID
        const userId = registeredUser._id; // Replace with the actual user's ID
        const userRegistered = await Register.findById(userId);
        const userEmail = userRegistered.email;
        // Get the user's selected category from the latest survey response
        const latestSurveyResponse = await SurveyResponse.findOne({ user: userId }).sort({ createdAt: -1 });
        const selectedCategory = latestSurveyResponse.category;

        // Fetch quotes based on the selected category
        const quotes = await fetchQuotesByCategory(selectedCategory);

        // Send the quotes to the user's email
        const transporter = nodemailer.createTransport({
            // host: 'smtp.ethereal.email',
            service: 'gmail',
            port: 587,
            auth: {
                // user: 'tyrique89@ethereal.email',
                // pass: 'qHfEBkRSETmRcuNtUX'
                user: 'quoterandom4@gmail.com',
                pass: 'yglkxfxdfkuvjtey'
            }
        });
        
        const mailOptions = {
            from: 'quoterandom4@gmail.com', // Sender email
            to: userEmail, // Receiver email
            subject: 'Quotes of the Day', // Email subject
            html: `<h1>Quotes for You</h1><p>${quotes}</p>` // Email body with fetched quotes
        };

        const info = await transporter.sendMail(mailOptions); // Sending email
        
        console.log("Email sent:", info.response);
        // Redirect to a success page or render a success message
        return res.render("survey-success");

    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});


app.get("/survey-success", (req, res) => {
    res.render("survey-success");
});


app.listen(port, ()=>{
    console.log(`Server is running at port number ${port}`);
})


