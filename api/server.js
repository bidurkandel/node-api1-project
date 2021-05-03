// BUILD YOUR SERVER HERE
const express = require('express')
const Users = require('./users/model')
const server = express()
server.use(express.json())

server.get('/api/users/:id', (req, res)=>{
    const id = req.params.id
    Users.findById(id)
        .then(user=>{
            if (!user) {
                res.status(404).json({message: `no users with id of ${id} exisit`})
            } else {
                res.json(user)
            }
        })
        .catch(err=>{
            res.status(500).json({ message: err.message })
        })
})


server.get('/api/users', (req, res)=>{
    Users.find()
    .then(users=>{
        // console.log(user)
        res.status(200).json(users)
    })
    .catch(err => {
        res.status(500).json({ message: err.message })
    })
})


server.post('/api/users', (req, res)=>{
    const newUser = req.body
    if(!newUser.name || !newUser.bio){
        res.status(422).json({message: 'name and bio are required'})
    } else {

        
        Users.insert(newUser)
        .then(user=>{
            res.status(201).json(user)
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })
    }
})

server.put('/api/users/:id', (req, res)=>{
    const {id} = req.params
    const changes = req.body
    if(!changes.name || changes.bio){
        res.status(422).json({message: 'name and bio are required'})
    } else{

        Users.update(id, changes)
        .then(user=>{
            console.log(user)
            res.json(user)
        })
        .catch(err => {
            res.status(500).json({ message: err.message })
        })
    }
})

server.delete('/api/users/:id', async (req, res)=>{
    const {id} = req.params
    try{
        const removedUser = await Users.remove(id)
        if(!removedUser){
            res.status(404).json({message:'That user does not exist'})
        } else {
            res.json(removedUser)
        }
    } catch(err) {
        res.status(500).json({ message: err.message })
      }

})

server.use('*', (req, res)=>{
    res.status(404).json({message: 'resource not found'})
})
module.exports = server; // EXPORT YOUR SERVER instead of {}
