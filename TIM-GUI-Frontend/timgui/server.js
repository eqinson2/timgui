module.exports = function (app) {
    app.get("/timgui-backend/tables/list", function (req, res) {
        res.status(200).send(require("./src/timgui/mockdata/tables.json"));
    });

    app.get("/timgui-backend/tables/AAA", function (req, res) {
        res.status(200).send(require("./src/timgui/mockdata/tableContents/AAA.json"));
    });

    app.get("/timgui-backend/tables/BBB", function (req, res) {
        res.status(200).send(require("./src/timgui/mockdata/tableContents/BBB.json"));
    });

    app.get("/timgui-backend/tables/CCC", function (req, res) {
        res.status(200).send(require("./src/timgui/mockdata/tableContents/CCC.json"));
    });

    app.put("/timgui-backend/tables/AAA", function (req, res) {
        res.status(204).send();
    });

    app.put("/timgui-backend/tables/BBB", function (req, res) {
        res.status(204).send();
    });

    app.put("/timgui-backend/tables/CCC", function (req, res) {
        res.status(204).send();
    });

    app.post("/timgui-backend/tables/AAA", function (req, res) {
        res.status(204).send();
    });

    app.post("/timgui-backend/tables/BBB", function (req, res) {
        res.status(204).send();
    });

    app.post("/timgui-backend/tables/CCC", function (req, res) {
        res.status(204).send();
    });

    app.delete("/timgui-backend/tables/AAA", function (req, res) {
        res.status(204).send();
    });

    app.delete("/timgui-backend/tables/BBB", function (req, res) {
        res.status(204).send();
    });

    app.delete("/timgui-backend/tables/CCC", function (req, res) {
        res.status(204).send();
    });

    app.get("/timgui-backend/tables/filtering/AAA*", function (req, res) {
        res.status(200).send(require("./src/timgui/mockdata/filter/AAA.json"));
    });

    app.get("/timgui-backend/tables/filtering/BBB*", function (req, res) {
        res.status(200).send(require("./src/timgui/mockdata/filter/BBB.json"));
    });

    app.get("/timgui-backend/tables/filtering/CCC*", function (req, res) {
        res.status(200).send(require("./src/timgui/mockdata/filter/CCC.json"));
    });

    app.get("/oauth/v1/session", function (req, res) {
        res.status(204).send();
    });

    app.get("/oauth/v1/refresh", function (req, res) {
        res.cookie("TOKEN", "TokenSetFromMockServer", {maxAge: 50000000, httpOnly: false});
        res.status(204).send();
    });
}