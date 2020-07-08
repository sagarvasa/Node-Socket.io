var controller = require("../controllers");
var passport = require("passport");

const router = function (app) {

    app.route("/ping")
        .get(function (req, res) {
            res.status(200).send({ message: "Server is up and running" })
        })
    
    //passport routes
    app.route("/")
        .get(controller.check_auth, controller.get_rooms)

    app.route("/login")
        .post(passport.authenticate("local", {
            successRedirect: '/rooms', 
            failureRedirect: '/',
            failureFlash: true
        }))

    app.route("/register")
        .post(controller.register_user)
    
    app.route("/logout")
        .get(function (req, res) {
            req.logout();
            res.redirect("/")
        })
    
    //socket routes
    app.route("/rooms")
        .get(controller.check_auth, controller.get_rooms)
        .post(controller.insert_rooms_from_seeder);
    
    app.route("/rooms/:id")
        .get(controller.check_auth, controller.get_room_by_id);
    
    app.route("/users/search")
        .get(controller.check_auth, controller.search_users);

}


module.exports = router;