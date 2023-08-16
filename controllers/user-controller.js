const Users = require("../models/Users");

const signup = async (req,res) => {
    console.log(req.body, 'Body');
    try{
        const {userName, password, fullName} = req.body;

        const existingUser = await Users.findOne({
            userName,
        });

        if(existingUser){
            return res
            .status(409)
            .json({ message: "UserName already exists!!!"});
        }

        const user = new Users({
            FullName: fullName,
            UserName: userName,
            Password: password
        });


        await user.save();

        res.status(200).json({
            message: "User created successfully"
        });
    }

    catch(err){
        console.error("Error in creating user", err);
        res.status(500).json({ message : "Internal Server Error"});
    }
}


const login = async(req,res) => {
    console.log(req.body)
    try{
        const {userName, password } = req.body;

        const user = await Users.findOne({ UserName: userName});
        console.log(user, 'user');
        if(!user){
            return res.status(401).json({ message: "Invalid UserName or Password"});
        }

       

        else if(password !== user.Password){
            return res.status(401).json({ message: "Invalid UserName or Password"});
        }



        const userData = {
            userName: user.UserName,
            fullName: user.FullName,
        };

        res.status(200).json({message: "Login Successful", userData: userData});

    }
    catch(err){
        console.error("Error Logging in", err);
        res.status(500).json({ message : "Internal Server Error"});
    }
}

exports.signup = signup;
exports.login = login;

