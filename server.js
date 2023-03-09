const express = require("express");
const connectDB = require("./config/db");

const app = express();

///connect DataBase

connectDB();

//init middleware

app.use(express.json({ extended: true }));
app.get("/", (req, res) => res.send("API runing"));

//Define Route

app.use("/api/users", require("./Routes/Api/users"));
app.use("/api/auth", require("./Routes/Api/auth"));
app.use("/api/profile", require("./Routes/Api/profile"));
app.use("/api/posts", require("./Routes/api/posts"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`connected to port ${PORT}`));
