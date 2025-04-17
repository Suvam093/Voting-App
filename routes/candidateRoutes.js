const express = require('express');
const router = express.Router();
const User = require('../Models/user');
const Candidate = require('../Models/candidate');
const {generateToken, JWTauthMiddleware} = require('../JWTauth');


const checkAdminRole = async (userID) => {
    try{
         const user = await User.findById(userID);
         if(user.role === 'admin'){
             return true;
         }
    }catch(err){
         return false;
    }
}


//Post route to add a new candidate
router.post('/',JWTauthMiddleware, async (req,res) =>{

    try{

        if(! await checkAdminRole(req.user.id))
            return res.status(403).json({message: "user is not the admin"});
        
        const data = req.body;    //assuming the request body contains the persons data

        //Creating new person object using mongoose model
        const newCandidate = new Candidate(data);

        const response = await newCandidate.save();
        console.log("data is saved");

        res.status(200).json({response: response});
    }
    catch(error){
        console.log(error);
        res.status(500).json({error: "Internal Server Error"});
    }
})

router.put('/:candidateID',JWTauthMiddleware, async (req, res) => {
    try{
        const candidateID = req.params.candidateID;          //return the updated document
        const updatedCandidatedata = req.body;      //run the mongoose validation

        const response = await Candidate.findByIdAndUpdate(candidateID, updatedCandidatedata,{
            new: true,
            runValidators: true
        })
        if(!response){
            return res.status(403).json({error: "user is not the admin"});
        }
        console.log("data is updated");
        res.status(200).json(response);
    }
    catch(err){
        console.log(err)
        res.status(500).json({error: "Internal Server Error"});
    }
})


router.delete('/:candidateID',JWTauthMiddleware, async (req, res) => {
    const candidateID = req.params.candidateID;

    try{
        const response = await Candidate.findByIdAndDelete(candidateID);
        if(!response){
            res.status(404).json({error: "user is not the admin"});
        }
        console.log("data is deleted");
        res.status(200).json(response);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Internal Server Error"});
    }
})



router.get('/vote/count',JWTauthMiddleware, async (req, res) =>{
    try {
        const user = await User.findById(req.user.id);
        if(user.role !== 'admin')
            return res.status(403).json({error: "User is not admin"});
        const candidate = await Candidate.find().sort({voteCount:'desc'});
        const voteRecord = candidate.map((data) =>{
            return{
                party : data.party,
                voteCount : data.voteCount
            }
        })

        return res.status(200).json(voteRecord)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal Server Error"})
        
    }
})


router.get('/vote/:candidateID', JWTauthMiddleware, async (req,res) => {
    try {
        const userId = req.user.id;
        const candidateID = req.params.candidateID;
        
        const user = await User.findById(userId);
        const candidate = await Candidate.findById(candidateID);

        if(!user){
            return res.status(404).json({error: "User not found"});
        }

        if(!candidate){
            return res.status(404).json({error: "Candidate not found"});
        }

        if(user.isVoted){
            return res.status(403).json({error: "User has already voted"});
        }

        if(user.role === 'admin'){
            return res.status(403).json({error: "Admin cannot vote"});
        }

        candidate.votes.push({user:userId})
        candidate.voteCount++
        await candidate.save()

        user.isVoted = true
        await user.save()
        
        return res.status(200).json({message: "Vote added successfully"})

    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Internal Server Error"})
    }
})


router.get('/', async (req, res) =>{
    try {
        const candidate =await Candidate.find({}, 'name party -_id')
        return res.status(200).json(candidate)
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Internal Server Error"})
    }
})

module.exports = router;