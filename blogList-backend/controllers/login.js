const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body

    const user = await User.findOne({ username })
    const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.password)

    if (!(user)) {
        return response.status(401).json({
            error: 'invalid username'
        })
    }
    if (!passwordCorrect) {
        return response.status(401).json({
            error: 'invalid password'
        })
    }

    const useForToken = {
        username: user.username,
        id: user.id
    }

    const token = jwt.sign(useForToken, process.env.secret)

    response
        .status(200)
        .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter