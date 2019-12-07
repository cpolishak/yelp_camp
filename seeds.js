var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name: "Clouds Rest", 
        image: "https://cdn.pixabay.com/photo/2016/11/21/15/14/camping-1845906__340.jpg",
        description: "Lorem ipsum dolor amet vHS umami direct trade pabst. Kitsch sriracha man bun, gluten-free tilde palo santo narwhal celiac biodiesel tbh schlitz readymade. IPhone microdosing butcher kinfolk. Snackwave chicharrones affogato, church-key adaptogen activated charcoal lomo squid franzen. Ugh tumblr street art lo-fi, irony next level cardigan gochujang. DIY poke kitsch jean shorts tattooed, meggings 3 wolf moon pinterest messenger bag synth cronut hella drinking vinegar letterpress. Readymade raw denim cred cronut, celiac pok pok beard banjo taxidermy YOLO 8-bit poke literally put a bird on it gastropub."
    },
    {
        name: "Pike's Peak", 
        image: "https://cdn.pixabay.com/photo/2016/02/18/22/16/tent-1208201__340.jpg",
        description: "Keffiyeh literally kitsch man bun microdosing, craft beer kogi adaptogen mixtape. Mixtape edison bulb celiac ethical meh letterpress DIY deep v small batch stumptown mumblecore seitan gentrify. Shaman banjo XOXO, cloud bread church-key farm-to-table polaroid literally you probably haven't heard of them la croix tbh cronut cliche organic bicycle rights. Intelligentsia lumbersexual single-origin coffee helvetica, synth gentrify bespoke plaid actually man braid yr poutine four loko DIY. Mixtape stumptown street art microdosing keffiyeh pug actually, vape ugh venmo kogi lomo brunch selfies kombucha."
    },
    {
        name: "Flower Coast", 
        image: "https://cdn.pixabay.com/photo/2016/02/09/16/35/night-1189929__340.jpg",
        description: "Deep v blog iPhone kale chips. Tumeric vinyl adaptogen lomo, banjo tumblr vaporware meggings everyday carry ramps health goth swag bitters. Raclette salvia pug blog chartreuse, woke four dollar toast. Tote bag lo-fi truffaut biodiesel, leggings forage bespoke four dollar toast chillwave live-edge celiac. Enamel pin schlitz fixie etsy readymade pitchfork tilde iPhone."
    }
]

function seedDB() {
  // Remove all campgrounds
  Campground.remove({}, function(err) {
    if (err) {
      console.log(err);
    }
    console.log("removed campgrounds!");

    // Add a few campgrounds
    data.forEach(function(seed) {
      Campground.create(seed, (err, campground) => {
        if (err) {
          console.log(err);
        } else {
          console.log("added a campground");
          // Create a comment
          Comment.create(
              {
                  text: "This is a wonderful place. You should totally check it out",
                  author: "Pistol"
                }, function(err, comment) {
                    if(err) {
                        console.log(err);
                    } else {
                        campground.comments.push(comment);
                        campground.save();
                        console.log("created new comment")
                    }
                    
                });
        }

      });
    });
  });

  // Add a few comments
}

module.exports = seedDB;