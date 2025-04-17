const express = require('express');
const router = express.Router();
const User = require('../Models/user');
const {generateToken, JWTauthMiddleware} = require('../JWTauth');


router.post('/signup', async (req,res) =>{

    try{
        const data = req.body;    //assuming the request body contains the persons data

        const adminUser = await User.findOne({role: 'admin'});
        if(data.role === 'admin' && adminUser){
            return res.status(403).json({error: "Admin already exists"});
        }

        //Creating new person object using mongoose model
        const newUser = new User(data);

        const response = await newUser.save();
        console.log("data is saved");

        const payload = {
            id: response.id,
        }

        const token = generateToken(payload);
        res.status(200).json({response: response, token: token});
    }
    catch(error){
        console.log(error);
        res.status(500).json({error: "Internal Server Error"});
    }
})


router.post('/login', async (req,res) =>{
    try {
        const {aadharnumber, password} = req.body;

        if (!aadharnumber || !password) {
            return res.status(400).json({ error: 'Aadhar Card Number and password are required' });
        }

        const user = await User.findOne({aadhar: aadharnumber})
        console.log(user)

        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({error: "Invalid aadhar or Password"});
        }
        console.log("found user")
        
        const payload = {
            id: user.id,              //not giving aadhar no so that if someone got access to the token he cant decode the aadhar of that person
        }

        const token = generateToken(payload);
        res.status(200).json({token: token});

    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Internal Server Error"});
    }

})


router.get('/profile', JWTauthMiddleware, async (req,res) => {
    try{
        const userData = req.user;
        const id = userData.id;
        const user = await User.findById(id)
        res.status(200).json({user});
    }
    catch(error){
        console.log(error);
        res.status(500).json({error: "Internal Server Error"});
    }
})



router.put('/profile/password',JWTauthMiddleware, async (req, res) => {
    try{
        const userId = req.user.id;          //return the updated document
        const {currentPassword, newPassword} = req.body;

        if(!currentPassword || !newPassword){
            return res.status(400).json({error: "Both current Password and new Password is required"});
        }


        const user = await User.findById(userId);

        if(!user || !(await user.comparePassword(currentPassword))){
            return res.status(401).json({error: "Invalid Password"});
        }

        user.password = newPassword;
        await user.save();
        console.log("data is updated");
        res.status(200).json({message: "Password updated successfully"});
    }
    catch(err){
        console.log(err)
        res.status(500).json({error: "Internal Server Error"});
    }
})


module.exports = router;