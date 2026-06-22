const postsModel = require("../models/posts.model")

async function createPost(req, res) {
    //checking access level of the user
    if (req.user.role !== "writer") {
        return res.status(403).json({
            message: "Forbidden: Viewer cannot create post"
        });
    };

    //creating post
    const { title, desc } = req.body;
    const { id, role } = req.user;
    const post = await postsModel.create({
        title: title,
        desc: desc,
        writer: id
    });
    res.status(301).json({
        post_id: post._id,
        artist_id: id,
        role: role,
        title: title,
        desc: desc
    })


};

async function updatePost(req, res) {
    //checking access level of the user
    if (req.user.role !== "writer") {
        return res.status(403).json({
            message: "Forbidden: Viewer cannot update post"
        });
    };

    //storing post id from request params
    const postId = req.params.id;

    //checking if the writer is the same
    const post = await postsModel.findOne({ _id: postId });
    if (post.writer.toString() !== req.user.id) {
        return res.status(403).json({
            message:"Forbidden: Writer can only update their own post"
        });
    };

    //updating post
    const { title, desc } = req.body;
    const newPost = await postsModel.findByIdAndUpdate(postId, {
        title: title,
        desc: desc
    });

    res.status(200).json({
        post_id: newPost._id,
        artist_id: newPost.writer,
        old_title: post.title,
        new_title: title,
        old_desc: post.desc,
        new_desc: desc
    });
    


};

async function getAllPosts(req, res){
    const allPosts = await postsModel.find().select("title updatedAt opened").populate("writer", "username");
    res.status(200).json({
        posts: allPosts
    })
}

async function getPostById(req, res){
    //loading post by its Id
    const post = await postsModel.findById(req.params.postId)
    .select("title desc opened updatedAt")
    .populate("writer", "username");
    
    //checking if post is present
    if (!post) {
        return res.status(404).json({
            message:"Post Not Found"
        });
    }

    //incrementing opened count not for post owner
    if (req.user.id !== post.writer._id.toString()) {
        post.opened += 1;
        await post.save();
    }
    
    //sending the posts
    res.status(200).json({
        title: post.title,
        desc: post.desc,
        writer: post.writer.username,
        opened: post.opened,
        lastUpdate: post.updatedAt
    });
};
module.exports = { createPost, updatePost, getAllPosts , getPostById };