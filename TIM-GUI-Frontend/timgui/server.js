module.exports = function (app) {
    app.get("/timgui-backend/tables/get/listAll", function (req, res) {
        res.status(200).send(require("./src/timgui/mockdata/tables.json"));
    });

    app.get("/timgui-backend/tables/get/AAA", function (req, res) {
        res.status(200).send(require("./src/timgui/mockdata/tableContents/AAA.json"));
    });

    app.get("/timgui-backend/tables/get/BBB", function (req, res) {
        res.status(200).send(require("./src/timgui/mockdata/tableContents/BBB.json"));
    });

    app.get("/timgui-backend/tables/get/CCC", function (req, res) {
        res.status(200).send(require("./src/timgui/mockdata/tableContents/CCC.json"));
    });

    app.get("/timgui-backend/tables/filter/AAA", function (req, res) {
        res.status(200).send(require("./src/timgui/mockdata/filter/AAA.json"));
    });

    app.get("/timgui-backend/tables/filter/BBB", function (req, res) {
        res.status(200).send(require("./src/timgui/mockdata/filter/BBB.json"));
    });

    app.get("/timgui-backend/tables/filter/CCC", function (req, res) {
        res.status(200).send(require("./src/timgui/mockdata/filter/CCC.json"));
    });


    app.post("/timgui-backend/tables/insert/AAA", function (req, res) {
        res.status(204).send();
    });

    app.post("/timgui-backend/tables/insert/BBB", function (req, res) {
        res.status(204).send();
    });

    app.post("/timgui-backend/tables/insert/CCC", function (req, res) {
        res.status(204).send();
    });

    app.delete("/timgui-backend/tables/delete/AAA", function (req, res) {
        res.status(204).send();
    });

    app.delete("/timgui-backend/tables/delete/BBB", function (req, res) {
        res.status(204).send();
    });

    app.delete("/timgui-backend/tables/delete/CCC", function (req, res) {
        res.status(204).send();
    });

    app.put("/timgui-backend/tables/set/AAA", function (req, res) {
        res.status(204).send();
    });

    app.put("/timgui-backend/tables/set/BBB", function (req, res) {
        res.status(204).send();
    });

    app.put("/timgui-backend/tables/set/CCC", function (req, res) {
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