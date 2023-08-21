const express = require("express");
const path = require('path');
const mysql = require("mysql");
const mysql2 =require("mysql2");
const bodyParser = require("body-parser");  
const app = express();
const port = 8000;
const fileupload = require('express-fileupload')
const cors = require('cors');
app.use(cors());
app.use(express.static(path.join(__dirname, "uploads")));
app.use(express.static("./"));


app.use(fileupload())

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  res.sendFile("index.html", { root: __dirname });
});

app.get("/login", function (req, res) {
  res.sendFile("login.html", { root: __dirname });
});

app.get("/sign", function (req, res) {
  res.sendFile("sign-up.html", { root: __dirname });
});  

app.get("/blog", function (req, res) {
  res.sendFile("blog.html", { root: __dirname });
});  

app.get("/editor", function (req, res) {
  res.sendFile("editor.html", { root: __dirname });
}); 

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test",
});
connection.connect(function (err) {
  if (err) throw err;
  console.log("connected");
});

app.post("/submit", function (req, res) {
  console.log("Received a POST request to /submit");
  console.log("Request body:", req.body);

  try {
    var sql = "INSERT INTO test (name, email, message) VALUES (?, ?, ?)";
    connection.query(
      sql,
      [req.body.name, req.body.email, req.body.message],
      function (err, result) {
        if (err) {
          console.error("Error inserting data:", err);
          res.status(500).send("Error inserting data.");
          return;
        }
        console.log("Data inserted successfully.");
        res.send("Data inserted successfully.");
      }
    );
  } catch (error) {
    console.error("Error in /submit route:", error);
    res.status(500).send("An error occurred while processing your request.");
  }
});

const connection2 = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "users",
});
connection2.connect(function (err) {
  if (err) throw err;
  console.log("connected2");
});

app.post("/sign", function (req, res) {
  console.log("Received a POST request to /sign");
  console.log("Request body:", req.body);

  try{
  var sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  connection2.query(
    sql,
    [req.body.name, req.body.email, req.body.password],
    function (err, result) {
      if (err) {
        console.error("Error inserting data:", err);
        res.status(500).send("Error inserting data.");
        return;
      }
      console.log("Data inserted successfully.");
      res.redirect("/login.html");
    }
  );
  }catch (error) {
    console.error("Error in /submit route:", error);
    res.status(500).send("An error occurred while processing your request.");
  }
});

app.post("/login", function (req, res) {
  var email = req.body.email;
  var password = req.body.password;

  var sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  connection2.query(sql, [email, password], function (error, results, fields) {
    if (error) {
      console.error("Error querying the database:", error);
      res.status(500).send("An error occurred while processing your request.");
      return;
    }

    if (results.length > 0) {
      // Login successful
      console.log("Login successful.");
      res.redirect("/blog.html");
    } else {
      // Login failed
      console.log("Login failed.");
      res.redirect("/login");
    }

    res.end();
  });
});

///upload-link

const connection3 = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'blogs',
});
connection3.connect(function (err) {
  if (err) throw err;
  console.log('connected3');
});

app.post('/uploads', (req, res)=>{
  let file= req.files.image;
  let date= new Date();

  let imagename= date.getDate()+ date.getTime() + file.name;

  let path= './uploads/'+ imagename;

  file.mv(path, (err, result)=>{
    if(err){
      throw err;
    }
    else{
      res.json(`uploads/${imagename}`)
    }
  })
})


app.post('/publish', function (req, res) {
  console.log('Received a POST request to /publish');
  console.log('Request body:', req.body);

  const title = req.body.title;
  const content = req.body.content;
  const image = req.body.image; // Assuming you're sending the image path from the client

  try {
    // Insert the blog post data into the MySQL database
    const sql = 'INSERT INTO blogs (title, content, image) VALUES (?, ?, ?)';
    connection3.query(sql, [title, content, image], function (err, result) {
      if (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ message: 'Error inserting data.', error: err.message });
        return;
      }
      console.log('Blog post inserted successfully.');
      res.json({ message: 'Blog post published successfully.' });
    });
  } catch (error) {
    console.error('Error in /publish route:', error);
    res.status(500).json({ message: 'An error occurred while processing your request.' });
  }
});


app.get("/blogdata", function (req, res) {
  connection3.query("SELECT * FROM blogs", function (error, results) {
    if (error) {
      console.error("Error querying the database:", error);
      res.status(500).send("An error occurred while fetching data.");
      return;
    }

    res.json(results);
  });
});





app.listen(port, () => console.log("successful"));