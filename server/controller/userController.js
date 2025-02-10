import User from "../model/userModel.js";

export const create = async(req, res) => {
    try {
        const newUser = new User(req.body)
        const {email} = newUser

        const userExists = await User.findOne({email})
        if (userExists) {
            return res.status(400).json({message: "Уже есть"});
        }
        const savedData = await newUser.save();
        res.status(200).json(savedData);

    } catch (error) {
        res.status(500).json({errorMessage:error.message})
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const userData = await User.find();
        if(!userData || userData.length === 0){
            return res.status(404).json({message :"Не поймал"})
        }
        res.status(200).json(userData);
    } catch (error) {
        res.status(500).json({ errorMessage: error.message})
    }

};

export const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const userExists = await User.findById(id);
        if(!userExists){
            return res.status(404).json({message :"Не поймал 2"})
        }
        res.status(200).json(userExists)
    } catch (error) {
        res.status(500).json({ errorMessage: error.message})
    }

};

export const update = async (req, res) => {
    try{
        const id = req.params.id;
        const userExists = await User.findById(id);
        if(!userExists){
            return res.status(404).json({message :"Не поймал 2"})
        }
       const updatedData = await User.findByIdAndUpdate(id, req.body, {
            new:true
        })
        res.status(200).json(updatedData);
    }catch(error){
        res.status(500).json({ errorMessage: error.message})
    }
};

export const deleteUser = async (req, res) =>{
    try{
        const id = req.params.id;
        const userExists = await User.findById(id);
        if(!userExists){
            return res.status(404).json({message :"Не поймал 3"})
        }
        await User.findByIdAndDelete(id);
        res.status(200).json({message:"Удалил"});
    } catch(error) {
        res.status(500).json({ errorMessage: error.message});
    }
};