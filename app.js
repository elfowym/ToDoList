const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://elfowym:HaKDwsUjEty7b6P@cluster0.j1h7nte.mongodb.net/todolistDB");

const itemsSchema = {
  name: String
}

const Item = mongoose.model("Item", itemsSchema);

const itme1 = new Item({
  name: "Welcome to your todolist!"
})

const item2 = new Item({
  name: "Hit the + button to add a new item."
})

const item3 = new Item({
  name: "<-- Hit this to delete an item."
})

const defaultItems = [itme1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res) {
  
Item.find()
.then(items => {
  if (items.length === 0){
    Item.insertMany(defaultItems);
    res.redirect("/");
  } else {
  res.render("list", {listTitle: "Today", newListItems: items});
  }
});

});

app.post("/", function(req, res){
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if(listName === "Today"){
    item.save()
    res.redirect("/");
  } else {
    List.findOne({ name: listName }).then(foundList => {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName); 
    })
  }
});


app.post("/delete", function(req, res){
  const checkItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today"){
    Item.findByIdAndDelete(checkItemId).then();
    res.redirect("/")
  } else{
    List.findOneAndUpdate({ name: listName}, {$pull: {items: {_id: checkItemId}}})
    .then();
    res.redirect("/" + listName)
  }
});


app.get("/:customList", function(req, res){
  const listName = _.capitalize(req.params.customList);
  
  List.findOne({ name: listName })
    .then(foundList => {
      if (!foundList) {
        // List not found, create a new one
        const list = new List({
          name: listName,
          items: defaultItems
        });
        return list.save()
          .then(() => res.redirect("/" + listName));
      } else {
        // List found, render it
        res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).send(err);
    });
});


app.post("/:customList", function(req, res){
  
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

async function main(){
    // await Item.deleteOne({_id: "6656c4e7eb6bd6ed3cea1dce"});
  // const elements = await Item.find({});
  // elements.forEach(element => {
  //   console.log(element);
  // })
};

// main();

