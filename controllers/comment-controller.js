const Comments = require("../models/Comments");

const addComment = async (req,res) => {
    try{
        const {blogComment, author, blogId, authorName} = req.body;

        console.log(req.body,"req.body")

        const newComment = new Comments({
            BlogId: blogId,
            Comment: blogComment,
            Author:author,
            AuthorName:authorName,
            CommentDate: new Date(),
        });


        await newComment.save();
        const comments= await Comments.find({"BlogId":blogId})
        res.status(200).json(comments);
        // res.status(200).json({
        //     message: "Comment Added Successfully"
        // });
    }

    catch(err){
        console.error("Error in adding comment", err);
        res.status(500).json({ message : "Internal Server Error"});
    }
}
const getComments= async (req,res)=>{
    const {id}=req.query
    try{
        const comments= await Comments.find({"BlogId":id})
        res.status(200).json(comments);
    }
    catch(err){
        console.log(err,"err")
        res.status(500).json({error:"Internal Error"});
    }
}



exports.addComment= addComment;
exports.getComments= getComments;

