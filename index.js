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

// Static files
server.use(express.static('public'));

// Routes
// Add this route at the top of your routes
server.get("/", function (req, res) {
    // Get the latest 5 products
    const latestProdukte = produkte.slice(0, 5);

    res.render("home", {
        title: "Nachhaltiger Produktkatalog",
        produkteCount: produkte.length,
        latestProdukte: latestProdukte
    });
});

server.get("/search", function (req, res) {
    const availableLabels = ["Fairtrade", "EU Bio", "Klimaneutral", "recycling-Material"];
    const availableControversies = ["Ölindustrie", "Waffenherstellung", "Fast Fashion", "Keine"];

    res.render("search", {
        title: "Produkte suchen",
        produkte,
        availableLabels,
        availableControversies
    });
});

server.get("/review", function (req, res) {
    res.render("review", {
        title: "Produkt bewerten",
        produkte
    });
});

server.listen(port, function () {
    console.log("Express listening on http://localhost:" + port);
});