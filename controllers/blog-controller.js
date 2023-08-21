const Blogs = require("../models/Blogs");
const Comments = require("../models/Comments");

const addBlog = async (req,res) => {
    try{
        const {title, content, author,authorName} = req.body;
        const newBlog = new Blogs({
            Title: title,
            Author: authorName,
            Content: content,
            PublishedDate: new Date(),
            UserId:author,
        });


        await newBlog.save();

        res.status(200).json({
            message: "Blog created successfully"
        });
    }

    catch(err){
        console.error("Error in creating Blog", err);
        res.status(500).json({ message : "Internal Server Error"});
    }
}
const getBlogs= async (req,res)=>{
    try{
        const blogs= await Blogs.find();
        res.status(200).json(blogs);
    }
    catch(err){
        res.status(500).json({error:"Internal Error"});
    }
}

const getBlogsById= async (req,res)=>{
    const {user}=req.query
    try{
        const blogs= await Blogs.find({"UserId":user})
        res.status(200).json(blogs);
    }
    catch(err){
        res.status(500).json({error:"Internal Error"});
    }
}

exports.addBlog = addBlog;
exports.getBlogs = getBlogs;
exports.getBlogsById = getBlogsById;

