const jwt = require("jsonwebtoken");
const Router = require("express").Router;
const router = new Router();

const User = require("../models/user");
const {SECRET_KEY} = require("../config");
const ExpressError = require("../expressError");
const Message = require("../models/messages")
const {ensureLoggedIn, ensureCorrectUser} = require("../middleware/auth");


/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/
router.get("/:id", ensureCorrectUser, async function (req, res, next) {
    try{
        let {id} = req.body;
        let message = Message.get(id);
        return res.json({message})
        
    } catch (err) {return next(err);}}
)

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/
router.post("/", ensureCorrectUser, async function (req, res, next) {
    try{
        let {info} = req.body;
        let message = Message.create(info);
        return res.json({message})
    } catch (err) {return next(err);}}
)

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/
router.post("/:id/read", ensureCorrectUser, async function (req, res, next) {
    try{
        let {id} = req.body;
        let messageRead = Message.messageRead(id);
        return res.json(messageRead)
    } catch (err) {return next(err);}}
)
