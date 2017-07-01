module.exports = function (app) {
    app.get("/tim-gui-backend/tables/get/listAll", function (req, res) {
        res.status(200).send(require("./src/timgui/mockdata/tables.json"));
    });

    app.get("/tim-gui-backend/tables/get/AAA", function (req, res) {
        res.status(200).send(require("./src/timgui/mockdata/tableContents/AAA.json"));
    });

    app.get("/tim-gui-backend/tables/get/BBB", function (req, res) {
        res.status(200).send(require("./src/timgui/mockdata/tableContents/BBB.json"));
    });

    app.get("/tim-gui-backend/tables/get/CCC", function (req, res) {
        res.status(200).send(require("./src/timgui/mockdata/tableContents/CCC.json"));
    });

    app.get("/tim-gui-backend/tables/filter/AAA", function (req, res) {
        res.status(200).send(require("./src/timgui/mockdata/filter/AAA.json"));
    });

    app.get("/tim-gui-backend/tables/filter/BBB", function (req, res) {
        res.status(200).send(require("./src/timgui/mockdata/filter/BBB.json"));
    });

    app.get("/tim-gui-backend/tables/filter/CCC", function (req, res) {
        res.status(200).send(require("./src/timgui/mockdata/filter/CCC.json"));
    });


    app.post("/tim-gui-backend/tables/insert/AAA", function (req, res) {
        res.status(204).send();
    });

    app.post("/tim-gui-backend/tables/insert/BBB", function (req, res) {
        res.status(204).send();
    });

    app.post("/tim-gui-backend/tables/insert/CCC", function (req, res) {
        res.status(204).send();
    });

    app.delete("/tim-gui-backend/tables/delete/AAA", function (req, res) {
        res.status(204).send();
    });

    app.delete("/tim-gui-backend/tables/delete/BBB", function (req, res) {
        res.status(204).send();
    });

    app.delete("/tim-gui-backend/tables/delete/CCC", function (req, res) {
        res.status(204).send();
    });

    app.put("/tim-gui-backend/tables/set/AAA", function (req, res) {
        res.status(204).send();
    });

    app.put("/tim-gui-backend/tables/set/BBB", function (req, res) {
        res.status(204).send();
    });

    app.put("/tim-gui-backend/tables/set/CCC", function (req, res) {
        res.status(204).send();
    });


    app.get("/oauth/v1/session", function (req, res) {
        res.status(204).send();
    });

    app.get("/oauth/v1/refresh", function (req, res) {
        res.cookie("TOKEN", "TokenSetFromMockServer", {maxAge: 50000000, httpOnly: false});
        res.status(204).send();
    });
}