const express = require("express");
const exphbs = require("express-handlebars"); 
const path = require("path");
const produkte = require("./data/produkt.json");

const server = express();
const port = 3001;

server.engine("hbs", exphbs.engine({
    extname: ".hbs",
    layoutsDir: path.join(__dirname, "templates", "layouts"),
    partialsDir: path.join(__dirname, "templates", "partials"),
    defaultLayout: "main",
     helpers: {
         stars: (anzahl) => {
         const count = typeof anzahl === "number" && anzahl > 0 ? anzahl : 0;
         return Array.from({ length: count });
        }
        }
}));

server.set("view engine", "hbs");

server.set("views", path.join(__dirname, "templates"));

server.use(express.static('public_html'));

server.get("/", function (req, res) {
    res.send('<p>Welcome to the IMI server! Visit <a href="/produkte">/produkte</a> to see the product list.</p>');
});

server.get("/hello", function (req, res) {
    res.send("Hello IMIs!");
});

server.get("/produkte", function (req, res) {
    res.render("product", {
        title: "Produktliste",
        produkte
    });
});


server.listen(port, function () {
    console.log("Express listening on http://localhost:" + port);
});
