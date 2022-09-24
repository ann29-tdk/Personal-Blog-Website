//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose  = require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

/*                        MONGODB WORK                                  */
main().catch(err => console.log(err));
async function main()
{
  await mongoose.connect("mongodb+srv://test-anurag:Society2020@cluster0.g2tqnwo.mongodb.net/blogPostDB", {useNewUrlParser: true});
}
const {Schema} = mongoose;
/*                      SCHEMA OF POSTS                                                    */
const postSchema = new Schema(
  {
    title: String,
    content: String
  }
);
const Post = mongoose.model("Post", postSchema);

/*                     END OF SCHEMA OF POSTS                                                    */
/*                       END OF MONGODB WORK                             */
app.get("/", function(req, res){
  Post.find({}, function(err, postCollections)
{
  if(err) console.log(err)
  else
  {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: postCollections
      });
  }
});

});



/*                Compose Section                                            */

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const newPost = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

newPost.save(function(err)
{
  if(err)
  {
    return handleError(err);
  }
  else
  {
    console.log("New post has been saved into your blogPostDB.");
    res.redirect("/");
  }

});



});
/*               End of Compose Section                                            */



/*                Custom Post section                                                          */
app.get("/posts/:postID", function(req, res){
  const requestedID = req.params.postID;

  Post.findById(requestedID, function(err, foundPost)
{
  if(err)
  {
    console.log(err);
  }
  else
  {
    res.render("post",{
      title: foundPost.title,
      content:foundPost.content,
      objectID: foundPost._id
    });
      console.log("opening post "+foundPost.title);
  }
});


});

//   Delete a post
app.post("/delete", function(req,res)
{
  const postID = req.body.postID;
  Post.findByIdAndRemove(postID, function(err)
{
  if(err) console.log(err);
  else {console.log("Successfully deleted post."); res.redirect("/");}
});
});
//  end of delete a post

/*                End of Custom Post section                                                          */





/*            Additional Sections                                                */
app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});
/*           End of  Additional Sections                                                */


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
