const User = require('../models/User')
const Painting = require('../models/Painting')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

const getAllUsers = asyncHandler(async (req,res) => {
    const users = await User.find().select('-password').lean()
    if (!users) {
        return res.status(400).json({ message: 'No users found'})
    }
    res.json(users)
})
//lean is to not get all the text, just required json

const createNewUser = asyncHandler(async (req,res) => {
    const  { username, password, roles } = req.body

    //confirm data
    if (!userename || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({ message: 'All fields are required'})
    }

    //check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec()
    //if you use async await and wait for a promise use exec()

    if(duplicate) {
        return res.status(409).json({ message: 'Duplicate username'})
        //409 conflict  
    }

    const hashedPwd = await bcrypt.hash(password,10) //salt rounds

    const userObject = { username, 'password': hashedPwd,roles}

    //create and store new user
    const user = await User.create(userObject)

    if (user) { //created
    res.status(201).json({ message: `New user ${username} created`})
    }
    else {
        res.status(400).json({ message: 'Invalid user data received'})
    }
})

const updateUser = asyncHandler(async (req,res) => {
    const { id, username, roles, password } = req.body

    if(!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required'})
    }

    const user = await User.findById(id).exec()

    if(!user) {
        return res.status(400).json({ message: 'User not found'})
    }

    //check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec()

    //allow updates to the original user
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username'})
    }

    user.username = username
    user.roles = roles

    if (password) {
        //hash password
        user.password = await bcrypt.hash(password, 10) // salt rounds
    }

    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated` })
    
})

const deleteUser = asyncHandler(async (req,res) => {
    const { id } = req.body //destructure only id

    if(!id){
        return res.status(400).json({ message: 'User ID required'})
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found'})
    }

    const result = await user.deleteOne()

    const reply  = `Username ${result.username} with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}