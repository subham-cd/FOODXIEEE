import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

const loginUser = async (req, res) => {
    const {email,password}= req.body;
    try {
        const user = await userModel.findOne({email});

        if (!user) {
            return res.json({
                success:false,
                message:"user doesn't exist"

            })
            
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if (!isMatch) {
            return res.json({
                success:false,
                message:"Invalid credantial"
            })
            
        }
          const token = createToken(user._id);
          res.json({
            success:true,
            token
          })
    } catch (error) {
        console.log(error);
         res.json({
            success:false,
            message:"Error"
         })
    } 
};
const createToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{ expiresIn: "3d" })
}

//regiester user
const registerUser = async (req, res) => {
  const { name, password, email } = req.body;
  try {
    //checking is user alredy exist
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({
        success: false,
        message: "user already exist",
      });
    }
    //validating email format and string password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter valid email",
      });
    }
    if (password.length<8) {
        return res.json({success:false,message:"Please enter a strong password"})
        
    }
    //hashing user paasword
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt);

    const newUser = new userModel({
        name:name ,
        email:email,
        password:hashedPassword
    })
    const user = await newUser.save()
    const token  = createToken(user._id)
    res.json({
        success:true,
        token,
        user: { name: user.name, email: user.email }
    })

  } catch (error) {
    console.log(error);
    res.json({
        success:false,
        message:'Error'
    })
  }
};

export { loginUser, registerUser,createToken };
