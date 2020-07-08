const userModel = require("../models/user");
const roomsModel = require("../models/rooms");
const logger = require("../../utility/logger");
const roomsSeeder = require("../../../seeder/rooms");
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * description: Middleware to check authenticated request
 */
const check_auth = function (req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.render("login", {
            success: req.flash('success')[0],
            error: req.flash('error')
        })
    }
}

const register_user = async function (req, res) {
    let username = req.body.username;
    let mobile = req.body.mobile;
    let name = req.body.name;

    if (username && mobile && name) {
        userModel.findOne({ username, mobile }).then(async (doc) => {
            if (doc) {
                req.flash('error', 'Username/mobile number combination should be unique ');
                res.redirect('/');
            } else {
                let user = new userModel({ username, mobile, name });
                await user.save()
                req.flash('success', 'Your account has been created successfully. Please log in to get started');
                res.redirect('/');
            }
        }).catch((err) => {
            logger.error("register_user:: promise catch " + err.message, res);
            req.flash('error', 'Internal server error. Please try again after sometime');
            res.redirect('/');
        })

    } else {
        req.flash('error', 'Please enter correct username, mobile number and profile name');
        res.redirect('/');
    }
}

const get_rooms = async function (req, res) {
    try {
        logger.info("get_rooms:: start:: ", res);
        let rooms = await roomsModel.find();
        res.render('rooms', { rooms: rooms, is_first: req.query.first });
    } catch (err) {
        logger.error("get_rooms:: catch-block:: " + err.message, res);
        res.render('rooms', { rooms: [], is_first: req.query.first })
    }
}

const get_room_by_id = async function (req, res) {
    let room_id = req.params.id;
    try {
        let room = await roomsModel.findById(room_id);
        logger.info("get_room_by_id:: response:: " + room + " for User:: " + JSON.stringify(req.user));
        if (!room) {
            res.render('404');
        } else {
            res.render('chat', { user: req.user, room: room });
        }
    } catch (err) {
        logger.error("get_room_by_id:: catch-block:: " + err.message, res);
        res.render('chat', { user: req.user, room: {} })
    }
}

const insert_rooms_from_seeder = async function (req, res) {
    try {
        let data = roomsSeeder.rooms;
        logger.info("insert_rooms_from_seeder:: data to insert:: " + JSON.stringify(data), res)
        let rooms = await roomsModel.insertMany(data);
        logger.info("insert_rooms_from_seeder:: response:: " + JSON.stringify(rooms), res)
        if (!rooms) {
            return res.status(400).send({ message: "bad request. No data inserted", success: false })
        } else {
            return res.status(200).send({ success: true, rooms: rooms });
        }
    } catch (err) {
        logger.error("insert_rooms_from_seeder:: catch-block:: " + err.message, res);
        res.status(500).send({ message: "Some error occurred. Please try again after sometime", success: false })
    }
}

const search_users = async function (req, res) {
    let room_id = req.query.room_id;
    let search_text = req.query.search_text;
    let unique_obj = {};
    let users = [];
    try {
        let room = await roomsModel.findById(room_id);
        if (!room) {
            res.status(200).send({ users: [] });
        } else {
            room.connections.forEach((connection) => {
                let id = connection.user_id;
                if (!unique_obj[id]) {
                    users.push(id);
                }
                unique_obj[id] = true;
            });
            if (!search_text) {
                let users_obj = await userModel.getUserDetailByUsernames(users)
                res.status(200).send({ users: users_obj });
            } else {
                users = users.filter(user => user === search_text);
                if (users.length === 0) {
                    return res.status(200).send({ users: [] })
                }
                let users_obj = await userModel.getUserDetailByUsernames(users)
                res.status(200).send({ users: users_obj });
            }
        }
    } catch (err) {
        logger.error("search_users:: catch-block:: " + err.message, res);
        return res.status(500).send({ message: "something bad happened while searching user" })
    }
}


module.exports = { check_auth, register_user, get_rooms, get_room_by_id, insert_rooms_from_seeder, search_users }