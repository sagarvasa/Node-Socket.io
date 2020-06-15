var controller = require("../controllers");

const router = function (app) {

    app.route("/ping")
        .get(function (req, res) {
            res.status(200).send({ message: "Server is up and running" })
        })


}


module.exports = router;