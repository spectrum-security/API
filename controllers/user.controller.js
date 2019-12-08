const User = require("../models/user");


async function get(req, res) {
    const user = req.query
    try {
        //search by id
        if (user.id) {
            return res.send(await User.find({ _id: user.id }))
        }
        //Searches mongodb for everything
        else {
            return res.send(await User.find())
        }

    } catch (err) {
        return res.status(400).send({ error: `Could not get: ${err}` })
    }
}


//Edit user
async function put(req, res) {
    try {
        console.log("edited")
        console.log(req.params.id)
        User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true },
            (err, data) => {
                if (err) {
                    return res.status(400).send({ error: `Could not edit user: ${err}` })
                }
            }
        )
        return res.send("edited " + req.params.id)
    }

    catch (err) {
        return res.status(400).send({ error: `Could not edit user: ${err}` })

    }
}


//Remove user
async function del(req, res) {
    const _id = req.params.id
    try {
        console.log(_id)
        await User.findByIdAndDelete(_id)
        console.log("removed")
        return res.send("removed")
    }

    catch (err) {
        return res.status(400).send({ error: `Could not remove user: ${err}` })

    }
}



module.exports = { get, post, put, del }