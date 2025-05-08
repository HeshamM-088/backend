const users = require("../models/users");


const getAllusers = async (request, response) => {
    try {
        const Users = await users.find({}, { __v: false, password: false });
        return response.status(200).json({ Users });
           
    } catch (error) {
        return response.status(500).json({ error });
           
    }
}
const getUser = async (request, response) => {
    try {
        const userId = request.params.id
        const User = await users.findById(userId ,{ __v: false, password: false });
        if (!User) {
            return response.status(404).json({ message: "User not found" })
        }

        return response.status(200).json({ User })
            
    } catch (error) {
        return response.status(500).json({message: error })
           
    }
        
}
const addUser = async (request, response) => {
    try {
        const User = await users.create(request.body)
        return response.status(200).json({ User })
           
        
    } catch (error) {
        return response.status(500).json({ message: error })
          
    }
}

const editUser = async (request, response) => {
    try {
        const userId = request.params.id;
        const User = await users.findByIdAndUpdate(userId , request.body, {
            new: true,
            projection: { __v: false, password: false }
        });
        if (!User) {
            return response.status(404).json({message: "User not found"})
        }
        return response.status(200).json({ User })
             
        

    } catch (error) {
        return response.status(500).json({ message: error })
           
        
    }
    
}



const deleteUser = async (request,response) => {
    try {
        const userId = request.params.id;
        const User = await users.findByIdAndDelete( userId )
        if (!User) {
            return response.status(404).json({message: "User not found"})
        }
        return response.status(200).json({ User })
            
    } catch (error) {
        return response.status(500).json({ message: error })
           
    }  
}


module.exports ={ getAllusers,getUser,addUser,editUser,deleteUser}