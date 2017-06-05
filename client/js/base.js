/*global PIXI*/
/*global io*/
/*global ion*/
/*global lastover*/
/*global $*/

var LOCKBEHAVIOR = true;

var playernames=[];
var yourOpp="";
var playerOppChoice=-1;
var oppscore=0;
var nexti=Math.floor(Math.random()*10);

var startTime=Date.now();
var timeElapsed=0;
var lastTimeElapsed=0;
var theRecords=[];

var showIndex = 0;
var globalWord = "";
var wordobjs = [];

var words = "[WELCOME TO THE GAME]";

var high = {
  'score': 0,
  'player': 'you',
  'color': 'gold'
};

var szx = 60;
var szy = 60;
var letterWidth = 30;
var letterHeight = 60;
var dragsteps = 0;

var scores = [];
var names = [];
var myscore = 0;

var data = {};

var theData; 
var myColor = pastelColors(); //Function randomizes colors with a base of 127.
var myName = ""; 
var fcount = 0;
var w, h;

var sizeX = 60;
var sizeY = 60;

var dagameboard;

var OBJECTS = [];


var MOUSEISDOWN = 0;
var DRAG = 0;
var DRAGGING = false;
var DRAGMODEON = 0;

var SCALE = 1.0; 
var selectedTiles = [];

var TILES = [];
var USERSCORE = 0;

var stage = new PIXI.Container();
var graphics = new PIXI.Graphics();
var renderer = new PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {
  backgroundColor: 0x000000
}); //PIXI.WebGLRenderer(window.innerWidth, window.innerHeight);

stage.addChild(graphics);

var connectstring = "http://" + window.location.host + ":3000";
if (window.location.host.search("c9users") > -1) connectstring = ""; // this means if on dev server use blank connection string

var socket = io.connect(connectstring); // io.connect('http://publicpuzzle.com:3000');

var PUZZLE = {};
var team1col = 0xff0000;
var team2col = 0x0000ff;
var basecol = 0xaaaaaa;
var highlightcol = 0xffff00;
var key_leftarrow = 37;
var key_rightarrow = 39;
var key_downarrow = 40;
var key_uparrow = 38;

//var key_win = 87;
//var ownercolors = [basecol, team1col, team2col];
//var ownerhtmlcolors = ["#aaaaaa", "#ff0000", "#0000ff"];
//var usercolors = [0xff4488, 0x88ff44, 0x4488ff, 0xff8844, 0x8844ff, 0x448888];
//var userhtmlcolors = ["#ff4488", "#88ff44", "#4488ff", "#ff8844", "#8844ff", "#448888"];

var SOUND = 0;

ion.sound({
  sounds: [{
    name: "snap"
  }, {
    name: "staple"
  }, {
    name: "door_bump"
  }, {
    name: "bell_ring"
  }, {
    name: "metal_plate_2"
  }, {
    name: "gong"
  }, {
    name: "clickoff"
  }, {
    name: "pop_cork"
  }, {
    name: "click2"
  }, {
    name: "water_droplet"
  }, ],
  path: "/snd/",
  preload: true,
  multiplay: true,
  volume: 0.4
});

// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function(callback, thisArg) {
    var T, k;
    if (this == null) {
      throw new TypeError(' this is null or not defined');
    }
    var O = Object(this);
    var len = O.length >>> 0;
    if (typeof callback !== "function") {
      throw new TypeError(callback + ' is not a function');
    }
    if (arguments.length > 1) {
      T = thisArg;
    }
    k = 0;
    while (k < len) {
      var kValue;
      if (k in O) {
        kValue = O[k];
        callback.call(T, kValue, k, O);
      }
      k++;
    }
  };
}

/*global Element*/
function toggleFullScreen() {
  if ((document.fullScreenElement && document.fullScreenElement !== null) || // alternative standard method  
    (!document.mozFullScreen && !document.webkitIsFullScreen)) { // current working methods  
    if (document.documentElement.requestFullScreen) {
      document.documentElement.requestFullScreen();
    }
    else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    }
    else if (document.documentElement.webkitRequestFullScreen) {
      document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  }
  else {
    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    }
    else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    }
    else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
  }
}

function playit(it) {
  if (SOUND) {
    ion.sound.play(it);
  }
}

function generate_user_name() {
  var namesads = ['Slippery', 'Smelly', 'Old', 'Sloppy', 'Happy', 'Happy', 'Happy', 'Lively', 'Angry', 'Muddy', 'Ugly', 'Rich', 'Speedy', 'CrossEyed', 'Happy', 'Thirsty', 'Ms', 'Mister', 'Mistic', 'Vanilla', 'Chocolate', 'Dusty', 'Super', 'Sad', 'Simple', 'Simply', 'Sugar', 'Horny', 'Hot', 'Hollywood', 'Lucky', 'Deputy', 'King', 'Queen', 'Prince', 'Princess', 'Nuclear', 'Breezy', 'Sassy', 'White', 'Green', 'Blue', 'Yellow', 'Golden', 'Bad', 'Good', 'Silver', 'Stormy', 'Tiny', 'New_World', 'Clumsy', 'Bossy', 'Freaky', 'Twisted', 'Fancy', 'Dancing', 'Dirty', 'Hairy', 'Hungry', 'Champagne', 'Total', 'Sweet', 'Liquid', 'Temporary', 'Peppermint', 'Amazing', 'Fat', 'Phat', 'Naked', 'Silent', 'Insane', 'Smooth', 'Mighty', 'Dangerous', 'Psycho', 'Wild', 'Famous', 'Suicidal', 'Gloomy', 'Disturbed', 'Wet', 'Wrong', 'Dark', 'Devious', 'Salty', 'Evil', 'Crude', 'Lazy', 'Lone', 'Sleepy', 'Foolish', 'Bleeding', 'Stealthy', 'Stupid', 'Doctor', 'Scrawny', 'Slick', 'Little', 'Chubby', 'Thunder', 'Whispering', 'Childish', 'Bitter', 'Proud', 'Friendly', 'Shy', 'Swift', 'Nervous', 'Rotten', 'Count', 'Innocent', 'Rude', 'Frosty', 'Captain', 'Rusty', 'Jedi', 'Flying', 'Yuppie', 'Smokin', 'Eternal', 'Magic', 'Monster', 'Big', 'Lightning', 'Fantastic', 'Global', 'Blazing', 'Samurai', 'Candy', 'Cute', 'Beautiful', 'Colorful', 'Smart', 'Cowboy', 'Futuristic', 'Devious', 'Metallic', 'Cool', 'Castaway', 'Modern', 'Homeless', 'Ancient', 'Nerdy', 'Hippy', 'Brilliant', 'Handsome', 'Florescent', 'Clueless', 'Southern', 'Communist', 'Tropical', 'Jumping', 'Sexy', 'Rainbow', 'Nice', 'Drooling', 'Foul', 'Gypsy', 'Platinum', 'Old_School', 'Blonde', 'Street', 'Baby', 'Anonymous', 'Intergalactic', 'Olympic', 'Real', 'Country', 'Missing', 'Cheating', 'Whiskey', 'Coach', 'Special', 'Handicapped', 'Dead', 'Vertical', 'Manic', 'Young', 'Wacky', 'Numb', 'Undercover', 'Cinnamon', 'Omnipotent', 'Peewee', 'Hurricane', 'Original', 'Amber', 'Doubtful', 'Elite', 'Social', 'Hardcore', 'Solar', 'Atomic', 'Misty', 'Average', 'Black', 'Heavy', 'Fresh', 'Stale', 'Slimy', 'Spicy', 'Eager', 'Perfect', 'Sir', 'New', 'Soviet', 'Corrupt', 'Senior', 'First', 'Major', 'Private', 'Rare', 'Red', 'Former', 'Corporate', 'Fake', 'Crazy', 'Generic', 'Purple', 'Broken', 'Poor', 'Sour', 'Digital', 'Cold', 'Fast', 'Great', 'Polite', 'Hobo', 'Silly', 'Savage', 'Deaf', 'Dumb', 'Blind', 'Only', 'Single', 'Steel', 'Cyber', 'Max', 'Melted', 'Ultra', 'Magnetic', 'Useless', 'Unique', 'Klingon', 'Alien', 'Cartoon', 'Gangster', 'Clever', 'Oak', 'Amish', 'Giant', 'Elf', 'Giddy', 'Outlaw', 'Working', 'Classic', 'Classy', 'Tiger', 'Iron', 'Limp', 'Sick', 'Bald', 'Wooden', 'Last', 'Northern', 'Sky', 'Peaceful', 'Voodoo', 'Mad', 'Gay', 'Peppy', 'Raging', 'Foxy', 'Disgrunteled', 'Noble', 'Terrible', 'Explosive', 'Lovely', 'Pretty', 'War', 'Rowdy', 'Graceful', 'Strawberry', 'Buffalo', 'Electric', 'Grizzly', 'Witty', 'Political', 'Prime', 'Deep', 'Soft', 'Pure', 'Secret', 'Chemical', 'Holy', 'Plain', 'Lost', 'Raw', 'Primal', 'Sole', 'Bare', 'Chronic', 'Hostile', 'Magnetic', 'Shallow', 'Polish', 'Tender', 'Burning', 'Tragic', 'Resident', 'Goth', 'Romantic', 'Frozen', 'Wicked', 'Weird', 'Busy', 'Clean', 'Broad', 'Fair', 'Strong', 'Solid', 'Final', 'Altered', 'Basic', 'Proper', 'Minor', 'Flat', 'Spare', 'Marine', 'Asian', 'American', 'English', 'Mexican', 'Flaming', 'Wireless', 'The', 'Loyal', 'Rubber', 'Plastic', 'Slim', 'Bloody', 'Normal', 'Crackhead', 'Future', 'Immortal', 'Violent', 'Unbalanced', 'Covert', 'Tribal', 'Free', 'Common', 'Daily', 'Slow', 'Catholic', 'Religious', 'Lord', 'Mint', 'Dizzy', 'Exotic', 'Illegal', 'Tricky', 'Used', 'Secondhand', 'Thrifty', 'Macho', 'Burly', 'Artistic', 'Brave', 'Kid', 'Distant', 'Arctic', 'Bleak', 'Polar', 'Easy', 'Stiff', 'President'];
  namesads.push('Slippery', 'Professor', 'Capitalist', 'Chief', 'Phantom', 'Shadow', 'Royal', 'Space', 'Action', 'Rebel', 'Da', 'Chunky', 'Scarred', 'Sacred', 'Fickel', 'Sumo', 'Dull', 'Crooked', 'Forgetful', 'Disco', 'Toxic', 'Intoxicating', 'Enchanting', 'Demonic', 'Heroic', 'Scared', 'Frustrated', 'Frugal', 'Moral', 'Immoral', 'Icy', 'Firey', 'Rocky', 'Explicit', 'Barefoot', 'Sitting', 'Cloaked', 'Greedy', 'Genius', 'Annoyed', 'Annoying', 'Amused', 'Amusing', 'Frantic', 'Grumpy', 'Damp', 'Fuzzy', 'Ripe', 'Faithful', 'Damaged', 'Scientific', 'Russian');
  var namesnons = ['Sue', 'Suzy', 'Pete', 'Dude', 'Elite', 'Momma', 'Gal', 'Chick', 'Hippy', 'Republican', 'Girl', 'Dancer', 'MoFo', 'Devil', 'Joe', 'Beast', 'Dog', 'Sam', 'Major', 'Private', 'Cop', 'Geek', 'Tomcat', 'General', 'Gypsy', 'Rose', 'Man', 'HillBilly', 'Fiend', 'Communiist', 'Star', 'Thug', 'Cloud', 'Boy', 'Me', 'Buddy', 'Hobo', 'Friend', 'Max', 'Hitman', 'Goddess', 'God', 'Diamond', 'Emerald', 'Magic', 'Hero', 'Yuppie', 'Corruption', 'Soul', 'Ghost', 'Summer', 'Winter', 'Goon', 'Brat', 'Kid', 'Baby', 'Amber', 'Fool', 'Rascal', 'Daddy', 'Snoball', 'Thief', 'Fish', 'Rabbi', 'Goat', 'Hustler', 'Angel', 'Dollar', 'Guy', 'Thing', 'Flyer', 'Butterfly', 'Emperor', 'Bum', 'Moron', 'Lawyer', 'Hippo', 'Shark', 'Clown', 'Cannonball', 'Bullet', 'Mistic', 'Coward', 'Gangster', 'Revolver', 'Dragon', 'Hello', 'Flash', 'Fire', 'Rooster', 'Hooker', 'Smile', 'Thumb', 'Mouse', 'Rebel', 'Doll', 'Scum', 'Mustang', 'Whiskey', 'Stuff', 'Water', 'Logic', 'Blade', 'Fireball', 'Rat', 'Pimp', 'Gimp', 'Priest', 'Bomb', 'Marine', 'Monster', 'Drifter', 'Bastard', 'Runner', 'Rocket', 'Democrat', 'Actor', 'Ray', 'Snake', 'Weasel', 'Tramp', 'Knight', 'Illusion', 'Comet', 'Poet', 'Ninja', 'Fist', 'Victory', 'Jester', 'Love', 'Lad', 'Hussy', 'Monkey', 'Liquid', 'Dictator', 'One', 'Captain', 'King', 'Queen', 'Prince', 'Lightning', 'Rainbow', 'Parrot', 'Player', 'Champagne', 'Thunder', 'Samurai', 'Psycho', 'Drunk', 'Soldier', 'Surfer', 'Princess', 'Candy', 'Cheese', 'Brain', 'Moon', 'Castaway', 'Ice', 'Master', 'Refugee', 'Monk', 'Centurion', 'Jerk', 'Vandal', 'Gentleman', 'Worm', 'Hermit', 'Bolt', 'Wizard', 'Trouble', 'Power', 'Bully', 'Truth', 'WitchCraft', 'Kitten', 'Blonde', 'Nut', 'Bubble', 'Moon', 'Affair', 'Killer', 'Escape', 'Cowboy', 'Engineer', 'Sneak', 'Coach', 'Fred', 'Crusader', 'Dawn', 'Flower', 'Maniac', 'Madman', 'Villian', 'Crook', 'Mistress', 'Engine', 'Problem', 'Snow', 'Hell', 'Eyes', 'Kidnapper', 'Lemming', 'Rockstar', 'PeeWee', 'Hurricane', 'Goose', 'Fox', 'Whale', 'Trance', 'Omen', 'Outlaw', 'Thrill', 'Warning', 'Style', 'Punk', 'Cartoon', 'Heat', 'Rabbit', 'Klingon', 'Dwarf', 'Alien', 'Liver', 'Nerd', 'Burnout', 'Oak', 'Duck', 'Amish', 'G', 'Elf', 'Ogre', 'Giant', 'Skater', 'Cat', 'Jedi', 'Tiger', 'Iron', 'Wonder', 'Smoke', 'Lips', 'Stud', 'Toad', 'Sky', 'Barbie', 'Bush', 'Hunk', 'Babe', 'War', 'Game', 'Strawberry', 'Elephant', 'Buffalo', 'Hawk', 'Lizard', 'Ferret', 'Bear', 'Beer', 'Beaver', 'Secret', 'Chemical', 'Chronic', 'Resident', 'Broad', 'Culture', 'Solution', 'Color', 'Dancing', 'Nun', 'Asian', 'American', 'Mexican', 'Flame', 'Doctor', 'Stuntman', 'Moe', 'Sally', 'Blood', 'Jane', 'Bob', 'Troll', 'Crackhead', 'Idiot', 'Future', 'Tommorrow', 'Willy', 'Catholic', 'Tank', 'Lord', 'Nipple', 'Illegal', 'Momma', 'Beefcake', 'Chump', 'Hype', 'Centerfold', 'Leech', 'Pony', 'Bubba', 'Wench', 'Santa', 'Boss', 'President', 'Imp', 'Professor', 'Pope', 'Capitalist', 'Leader', 'Chief', 'Chef', 'Phantom', 'Shadow', 'Stooge', 'Dick', 'Robot', 'Space', 'Nap', 'Action', 'Slap', 'Kiss', 'Subway', 'Passion', 'Junkie', 'Freak', 'Hacker', 'Judge', 'Vampire', 'Lover', 'Ape', 'Gangster', 'Friar', 'Slim', 'Sprite', 'Spark', 'Shock', 'Peach', 'Nurse', 'Disco', 'Demon', 'Rock', 'Stone', 'Genius', 'Gump', 'Faith', 'Damage', 'Narc', 'Joke', 'Blues', 'Russian', 'Asteriod', 'Hussie', 'Toes', 'Fingers'];
  var xx = Math.floor(Math.random() * (namesads.length));
  var yy = Math.floor(Math.random() * (namesnons.length));
  if (namesads[xx].substr(0, 4) == namesnons[yy].substr(0, 4)) {
    xx = Math.floor(Math.random() * (namesads.length));
    yy = Math.floor(Math.random() * (namesnons.length));
  }
  if (namesads[xx].substr(0, 4) == namesnons[yy].substr(0, 4)) {
    xx = Math.floor(Math.random() * (namesads.length));
    yy = Math.floor(Math.random() * (namesnons.length));
  }
  if (namesads[xx].substr(0, 4) == namesnons[yy].substr(0, 4)) {
    xx = Math.floor(Math.random() * (namesads.length));
    yy = Math.floor(Math.random() * (namesnons.length));
  }
  return (namesads[xx] + "_" + namesnons[yy]);
}

window.onkeydown = function(e) {

  switch (e.which) {
    case key_leftarrow:
      event.preventDefault();
      break;
    case key_rightarrow:
      event.preventDefault();
      break;
    case key_uparrow:
      event.preventDefault();
      break;
    case key_downarrow:
      event.preventDefault();
      break;
  }
};

function onDragStart(event) {

  dragsteps = 0;
  this.data = event.data;
  this.rotation = 0;
  this.dragging = true;
  this.alive = false;
  this.width = letterWidth+15; //szx;
  this.height = letterHeight+15; //szy;//letterHeight;
  playit('click2');
}

function onDragEnd() {

  this.dragging = false;
  this.data = null;
  this.alive = true;
  this.stop = true;
  playit('snap');

  this.locked = LOCKBEHAVIOR;

  //option
  if (dragsteps < 10) {
    if (this.y < 156) {
      this.y = 201 + Math.random() * 100;
      this.x = Math.random() * (w / 2) + w / 4;
    }
    else {
      this.y = 100;
      this.x = w - 1;
    }
  } // a tap moves new letter to end of word for spelling

  alignAndSpell(false);
}

function onDragMove() {

  if (this.dragging) {
    dragsteps++;
    var newPosition = this.data.getLocalPosition(this.parent);
    this.position.x = newPosition.x;
    this.position.y = newPosition.y;
    //options
    //alignAndSpell(false);
  }
}

window.onmousemove = function(e) {};

window.onmousedown = function(e) {
  if (e.which > 1) {
    DRAGMODEON = 1;
    e.preventDefault();
    return;
  }
  MOUSEISDOWN = 1;
  if (typeof lastover !== 'undefined') {
    lastover.tint = highlightcol;
    selectedTiles.push(lastover);
  }
};

// var mousewheelevent = function(e) {
//   //var delta = e.wheelDelta ? e.wheelDelta : -e.detail;
//   mixthem();
//   for (var j = 0; j < 1; j++) mixLetters(false);
// };

// window.addEventListener('mousewheel', mousewheelevent);
// window.addEventListener('DOMMouseScroll', mousewheelevent);

function resizewin() {

  w = window.innerWidth;
  h = window.innerHeight;

  renderer.view.style.width = w + "px";
  renderer.view.style.height = h + "px";
  renderer.resize(w, h);

  // stage.scale.x = SCALE;
  // stage.scale.y = SCALE;
  
  ///localImageBackground
  
    for (var i = stage.children.length - 1; i >= 0; i--) {
      if (stage.children[i].id=='localImageBackground' ) {
        stage.children[i].width=w;
        stage.children[i].height=h;
      }
    }  

  mixLetters(false);

  alignAndSpell(false);

}

function addImageToStage(id, imgURL, x, y, w, h, interactiveOrNot) {
  
  var texture = PIXI.Texture.fromImage(imgURL);
  var bunny = new PIXI.Sprite(texture);
 
  //var texture2 = PIXI.Texture.fromImage('./img/bat.jpg'); 
  //bunny.setTexture(texture2);
  
  bunny.id = id;
  bunny.dirx = 0; //1 - Math.floor(Math.random() * 3); //(0,2);
  bunny.diry = 0; //1 - Math.floor(Math.random() * 3); //(0,2);
  bunny.speedx = 1; //Math.random()*1.5;
  bunny.speedy = 1; //Math.random()*1.25;
  bunny.type = 'image';
  bunny.letter = "";
  bunny.alive = true;
  bunny.width = w;
  bunny.height = h;
  bunny.locked = false;
  bunny.interactive = interactiveOrNot;
  bunny.x = x;
  bunny.y = y;
  bunny.tx = 0;
  bunny.ty = 0;
  bunny.buttonMode = true;
  bunny.blendMode = PIXI.BLEND_MODES.NORMAL;
  bunny.rotation = 0;
  stage.addChild(bunny);
}

function createGraphics() {

}

function pastelColors() {
  
  ////'#'+Math.floor(Math.random()*16777215).toString(16);
  
  var r = (Math.round(Math.random() * 127) + 127).toString(16);
  var g = (Math.round(Math.random() * 127) + 127).toString(16);
  var b = (Math.round(Math.random() * 127) + 127).toString(16);
  
  //france paris
  //var r=['red','white','blue'];return r[randRange(0,2)];
  
  return '#' + r + g + b;
}

function movethings() {

  fcount++;

  var bcount = 0.0;

  OBJECTS.forEach(function(bunny) {

    bcount += 1;

    if (bunny.alive) {

      if (bunny.y > 156) {
        if (bunny.locked == false) {

          bunny.rotation += bunny.dirr * Math.random() * 4 / 150;

          //todo things like can resize, canmove, canrotate, can ?, etc
          if (bunny.type !== 'o') {
            bunny.width = (Math.sin(bcount + fcount / 20) + 2) * 36;
            bunny.height = (Math.cos(bcount + fcount / 20) + 2) * 36;
          }

          bunny.x += bunny.dirx * bunny.speedx;
          bunny.y += bunny.diry * bunny.speedy;

          bunny.y += Math.random() / 10;
        }
      }
      else {
        bunny.width = letterWidth;
        bunny.height = letterHeight;
        bunny.rotation = 0;
      }

      if (bunny.y > h - 60) {
        if (bunny.type == "l") bunny.y = 201; //h / 2 + 100 - Math.random() * 156;
      }

      if (bunny.y > 156)
        if (bunny.y < 201) {
          bunny.y = h / 2; //+= h/2;// h / 2 + 100 - Math.random() * 156;
          //  bunny.diry *= -1
        }
      if (bunny.x < 1) {
        bunny.x = w - 1; 
      }
      if (bunny.x > (w - 1)) {
        bunny.x = 1; 
      }

    }

  });
}

function scramble(str) {
  var scrambled = '',
    src = str.split(''),
    randomNum;
  while (src.length > 1) {
    randomNum = Math.floor(Math.random() * src.length);
    scrambled += src[randomNum];
    src.splice(randomNum, 1);
  }
  scrambled += src[0];
  return scrambled;
}

function mixWordLetters(submit) {

  submit = submit || false;

  for (var i = stage.children.length - 1; i >= 0; i--) {
    if (stage.children[i].type == 'l') {
      stage.children[i].x = Math.random() * (w / 2) + w / 4;

      //option
      //if (stage.children[i].y > 156) stage.children[i].y = 225 + Math.random() * (h / 4);

      //option
      // if (Math.random() > .96) stage.children[i].y = 100 + h / 2 - Math.cos(i) * 69;
      // if (Math.random() > .97) stage.children[i].y = 100; //100+h/2 - Math.cos(i) * 69;

      //option on mix
      //stage.children[i].rotation=Math.random()*360;

      //option on mix
      //stage.children[i].locked=false;

    }
  }

  //option
  alignAndSpell(submit); ///submits word attempt after aligning upon randomizing

}


function mixLetters(submit) {

  submit = submit || false;

  for (var i = stage.children.length - 1; i >= 0; i--) {
    if (stage.children[i].type == 'l') {
      stage.children[i].x = Math.random() * (w / 2) + w / 4;

      //option
      if (stage.children[i].y > 156) stage.children[i].y = 225 + Math.random() * (h / 4);

      //option
      if (Math.random() > .96) stage.children[i].y = 100 + h / 2 - Math.cos(i) * 69;
      //if (Math.random() > .97) stage.children[i].y = 100; //100+h/2 - Math.cos(i) * 69;

      //option on mix
      //stage.children[i].rotation=Math.random()*360;

      //option on mix
      //stage.children[i].locked=false;

    }
  }

  //option
  alignAndSpell(submit); ///submits word attempt after aligning upon randomizing

}

function unlockLetters() {

  for (var i = stage.children.length - 1; i >= 0; i--) {
    if (stage.children[i].type == 'l') {
      stage.children[i].locked = false;
    }
  }

}

function alignAllLetters() {

  //var x=50;
  var y = 100;

  for (var i = stage.children.length - 1; i >= 0; i--) {
    if (stage.children[i].type == 'l') {

      stage.children[i].rotation = 0.0;

      stage.children[i].x = Math.random() * (w / 2) + w / 4; //x; 
      stage.children[i].y = y;

      // if ("AEIOU".search(stage.children[i].letter) >= 0) {
      //   // stage.children[i].width = 25;//letterWidth * 1.5;
      //   // stage.children[i].height = 25;//letterHeight * 1.5;
      // }

    }
  }
  LOCKBEHAVIOR = true;
}


function goodWord(cc) {
  $('#thewordlist').css("background-color", cc);
}

function sizeAll() {
  for (var i = stage.children.length - 1; i >= 0; i--) {
    if (stage.children[i].type == 'l') {
      stage.children[i].locked = true;
      stage.children[i].rotation = 0; 
      stage.children[i].width = letterWidth;
      stage.children[i].height = letterHeight;
    }
  }
  LOCKBEHAVIOR = true;
}

function freezeAll() {
  for (var i = stage.children.length - 1; i >= 0; i--) {
    if (stage.children[i].type == 'l') {
      stage.children[i].locked = true;
      stage.children[i].width = letterWidth + Math.random() * 35;
      stage.children[i].height = letterHeight + Math.random() * 35;
      stage.children[i].rotation = 0;
    }
  }
  LOCKBEHAVIOR = true;
}


function dropLetters() {
  for (var i = stage.children.length - 1; i >= 0; i--) {
    if (stage.children[i].type == 'l') {
      if (stage.children[i].y < 156) stage.children[i].y += Math.random() * 100 + 50;
    }
  }
}

function alignAndSpell(submitIt) {

  submitIt = submitIt || false;

  var ind = 0;
  var lettercount = 0;

  for (var i = stage.children.length - 1; i >= 0; i--) {
    if (stage.children[i].type == 'l') {
      stage.children[i].x = Math.floor(stage.children[i].x);
      stage.children[i].width = letterWidth;
      stage.children[i].wasmoved = false;
      if (stage.children[i].y < 156) lettercount++;
    }
  }

  for (var ii = 0; ii < w; ii++) {

    for (var i = stage.children.length - 1; i >= 0; i--) {

      if (stage.children[i].type == 'l') {
        if (stage.children[i].wasmoved == false) {
          if (stage.children[i].x == ii) {
            if (stage.children[i].y < 156) {
              stage.children[i].x = 15 + ((ind) * letterWidth) + w / 2 - (lettercount / 4) * szx;
              stage.children[i].wasmoved = true;
              stage.children[i].forword = true;
              ind++;
            }
            if (stage.children[i].y < 156) stage.children[i].y = 100;

          }
        }
      }
    }

  }

  var theWord = "";

  for (var x = 0; x < w; x++) {
    for (var i = stage.children.length - 1; i >= 0; i--) {

      if (stage.children[i].y < 156) { //==100

        stage.children[i].rotation = 0;

        if (x == stage.children[i].x) {
          if (stage.children[i].forword == true) {
            theWord = theWord + stage.children[i].letter;
            stage.children[i].forword = false;

          }
        }
      }
    }
  }

  if (theWord.length > 1) {
     var jj=($('#wordsfound').text());
    if (jj.search(" " + theWord + " ")>-1) {
      $('#listing').html("  <b>" + "Already Found: " + theWord + "</b>  ");
      playit('water_droplet');
      return;
    }
    
    if (submitIt) socket.emit("WORD_ATTEMPT", {
      'theWord': theWord,
      'theColor': myColor,
      'secondsElapsed': Math.floor((Date.now()-startTime)/1000)
    });
  } 

  for (var i = stage.children.length - 1; i >= 0; i--) {
    stage.children[i].wasmoved = false;
  }

  globalWord = theWord;

}

function addPixiText(message, x, y, wi, hi, cc, spx, spy) {

  var letter = message;

  var style = {
    font: '26px VERDANA',
    fill: '#F7EDCA',
    stroke: '#4a1850',
    strokeThickness: 5,
    dropShadow: false,
    dropShadowColor: '#ff00ff',
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
    wordWrap: false,
    wordWrapWidth: 440,
    align: 'right'
  };

  style.fill = cc; //pastelColors();

  var bunny = new PIXI.Text(letter, style);

  bunny.dirx = 0; //1 - Math.floor(Math.random() * 3); //(0,2);
  bunny.diry = 1; //1 - Math.floor(Math.random() * 3); //(0,2);
  bunny.dirr = 0.0;
  bunny.speedx = spx; 
  bunny.speedy = spy; 
  bunny.type = 'o';
  bunny.letter = message;
  bunny.alive = true;
  bunny.width = wi;
  bunny.height = hi;

  bunny.locked = false;
  bunny.interactive = false;

 
  bunny.x = x;
  bunny.y = y;

  // this button mode will mean the hand cursor appears when you roll over the bunny with your mouse
  bunny.buttonMode = true;

  bunny.blendMode = PIXI.BLEND_MODES.NORMAL;

  bunny.rotation = 0;

  // bunny.anchor.set(0.5);

  OBJECTS.push(bunny);

  stage.addChild(bunny);

}

function removeall() {
    for (var i = stage.children.length - 1; i >= 0; i--) {
    // if (stage.children[i].type='l') {
    stage.removeChild(stage.children[i]);
    // }
  }
}

function createScrambledLetters(str, willbelocked) {
  
  removeall();
  
  //nexti++;if (nexti>9) nexti=0;
  //theData.back='./img/scramback' + nexti + ".png";

  addImageToStage("localImageBackground",theData.back,0,0,w,h,false) ;
  
  console.log(theData.back);

  var tempWord = scramble(str);

  var ii = 0;

  var style = {
    font: '112pt VERDANA',
    fill: pastelColors(), //'#F7EDCA', //myColor 
    stroke: '#4a1850',
    strokeThickness: 10,
    dropShadow: true,
    dropShadowColor: pastelColors(),
    dropShadowAngle: Math.random() * 360,
    dropShadowDistance: 8,
    wordWrap: false,
    wordWrapWidth: 440,
    align: 'center'
  };

  for (var i = 0; i < tempWord.length; i++) {

    style = {
      font: '96pt Times New Roman',
      fill: myColor,//pastelColors(), //pastelColors(), //'#F7EDCA',
      stroke: 'black',
      strokeThickness: 10,
      dropShadow: true,
      dropShadowColor: myColor,
      dropShadowAngle: Math.random() * 360,
      dropShadowDistance: 8,
      dropShadowThickness: 5,
      wordWrap: false,
      wordWrapWidth: 440,
      align: 'center',
      fontWeight: 'bold'
    };

    ii = ii + 1;

    var letter = tempWord.substr(i, 1);

    var bunny = new PIXI.Text(letter, style);

    bunny.dirx = 1.0 - Math.floor(Math.random() * 3);
    bunny.diry = 1.0 - Math.floor(Math.random() * 3);
    bunny.dirr = 1.0 - Math.floor(Math.random() * 3);
    bunny.speedx = Math.random() * 1.0;
    bunny.speedy = Math.random() * 1.0;
    bunny.type = 'l';
    bunny.letter = letter;
    bunny.alive = true;
    bunny.width = szx;
    bunny.height = szy;
    bunny.locked = willbelocked; //false;

    bunny.interactive = true;

    bunny.x = Math.random() * (w / 2) + w / 4;
    bunny.y = 225 + Math.random() * (h / 4);

    // this button mode will mean the hand cursor appears when you roll over the bunny with your mouse
    bunny.buttonMode = true;

    bunny.blendMode = PIXI.BLEND_MODES.NORMAL;

    bunny
      .on('mousedown', onDragStart)
      .on('touchstart', onDragStart)
      .on('mouseup', onDragEnd)
      .on('mouseupoutside', onDragEnd)
      .on('touchend', onDragEnd)
      .on('touchendoutside', onDragEnd)
      .on('mousemove', onDragMove)
      .on('touchmove', onDragMove);

    bunny.rotation = 0;

    bunny.anchor.set(0.5);

    OBJECTS.push(bunny);

    stage.addChild(bunny);

  }

  alignAndSpell(false);

}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(stage);
  
  movethings();


  
  timeElapsed=Math.floor((Date.now()-startTime)/1000);
  if (timeElapsed!==lastTimeElapsed) {
    lastTimeElapsed=timeElapsed;
    //console.log("Tick:" + timeElapsed );//+ " History: " + JSON.stringify(theRecords));

  if (timeElapsed>=0) $('#timer').html("Time:" + timeElapsed);    
  
    var cc=0;
    for (var i=0;i<theRecords.length;i++) {
      
      if ((yourOpp=="Everyone") || (theRecords[i].player==yourOpp)) {        
      
      if (theRecords[i].secondsElapsed==timeElapsed) {
        
        console.log(theRecords[i].theWord);
        cc++;
        
          playit('bell_ring');
        
        var jj=($('#wordsfound').text());
        if (jj.search(" " + theRecords[i].theWord + " ")>-1) {
          //already found
        } else {
            words+=" " + theRecords[i].theWord +" ";
            $('#wordsfound').html(words.substr(showIndex));
        
            oppscore+=theRecords[i].theWord.length*3; //xxxxx
            scores[yourOpp]=0+oppscore;
        }
        
        if (names.indexOf(yourOpp) < 0) names.push(yourOpp);
        
           if (yourOpp!=="Yourself") $('#opp').html(myName + " -vs- " + "" + yourOpp + "(" + oppscore + " pts)");

        addPixiText(theRecords[i].theWord + " " + theRecords[i].player.replace(/\d+/g,''), 10, 201 +(20*(1+cc)), 200, 120, theRecords[i].theColor, 0, 1);
        
              // socket.emit("WORD_ATTEMPT", {
              //   'theWord': theRecords[i].theWord,
              //   'theColor': theRecords[i].theColor,
              //   'secondsElapsed': theRecords[i].secondsElapsed//Math.floor((Date.now()-startTime)/1000)
              // });
        
      }
      
    }
      
    }
    
  }
  
}

$(resizewin());

var username = generate_user_name();
$('#username').val(username);
$('#username').focus();
  $('#logonbox').css("background-color", myColor);  
  $('#username').css("background-color", 'black');
  $('#username').css("color", myColor);  

  // $('#username').css("background-color", myColor);
  // $('#username').css("color", 'black');  

function startGame(option) {
  
  var dth=new Date;
  
  if ( $('#username').val()=="" ) $('#username').val("Anonymous");

  var tmin=(dth.getMonth()+1);
  $('#username').val(   $('#username').val() + "." + dth.getHours() + "." + dth.getMinutes() + "." + tmin + "." + dth.getDate()   );

  createScrambledLetters(theData.theWord, false);

  mixLetters(false);

  alignAndSpell(false);

  scrambleTitle();

  socket.emit("LOGON", {
    'user': $('#username').val(),
    'room': 'myRoom'
  });

  $('#titlescreen').hide();

  $('#logonscreen').fadeOut(500);

 // if (prompt("Full Screen ?","Y")=="Y")  
 toggleFullScreen(); //resizewin();

  $('#titlebar').show();

  dagameboard = document.body.appendChild(renderer.view);

  SOUND = option;

  playit("gong");
  
    setyouropponent();
  
  startTime=Date.now();
  
   $('#myModal').modal('show');

}

var globalPossibilities = [];

function string_recurse(active, rest) {
  if (rest.length == 0) {
    //console.log(active);
    globalPossibilities.push(active);
    //console.log(globalPossibilities.length);
  }
  else {
    string_recurse(active + rest.charAt(0), rest.substring(1, rest.length));
    string_recurse(active, rest.substring(1, rest.length));
  }
}

function possibilities(theWord) {
  globalPossibilities = [];
  string_recurse("", theWord);
}

function perms(data) {
  if (!(data instanceof Array)) {
    throw new TypeError("input data must be an Array");
  }

  data = data.slice(); // make a copy
  var permutations = [],
    stack = [];

  function doPerm() {
    if (data.length == 0) {
      permutations.push(stack.slice());
    }
    for (var i = 0; i < data.length; i++) {
      var x = data.splice(i, 1);
      stack.push(x);
      doPerm();
      stack.pop();
      data.splice(i, 0, x);
    }
  }
  doPerm();
  return permutations;
}

$('#textmsg').click(function(e) {
  $('#help').fadeIn(50).delay(15000).fadeOut(50);
  e.preventDefault();
  return false;
});

$('#submitWord').click(function(e) {
  alignAndSpell(true);
  $('#submitWord').fadeOut(0).delay(150).fadeIn(0);
  e.preventDefault();
  return false;
});

$('#powerup').click(function(e) {

  playit('pop_cork');
  $('#powerup').hide(); 
  freezeAll();
  mixWordLetters(false);

  //possibilities(globalWord.toUpperCase());
  //console.log(JSON.stringify(globalPossibilities));
 
  e.preventDefault();

});

$('#powerup2').click(function(e) {
  playit('staple');
  $('#powerup2').hide(); 
  freezeAll();
  sizeAll();
  alignAllLetters();
  alignAndSpell(false);
  e.preventDefault();
});

$('#quit').click(function(e) {
  window.location = "http://publicpuzzle.com";
  e.preventDefault();
});

$('#scores').click(function(e) {
 // console.log(scores.length);
  var theScore = "";
  for (var i = 0; i < names.length; i++) {
    console.log( names[i].replace(/\d+/g,'') + " " + scores[names[i]] );
    theScore = names[i].replace(/\d+/g,'') + " " + scores[names[i]];
    addPixiText(theScore, 10, 201 + i * 20, 200, 120, 'gold', 0, 1);

  }
  e.preventDefault();
});

$('#dropLetters').click(function(e) {
  dropLetters();
  $('#dropLetters').fadeOut(0).delay(10).fadeIn(0);
  e.preventDefault();
});

function scrambleTitle() {

  $('#listing').html("Scrambled Words");
  $('#highplayer').text(scramble("Scrambled Words"));
}

function mixthem() {
  scrambleTitle();
  mixLetters(false);
  var b = theData.theWord;
  theData.theWord = scramble(b);
  createScrambledLetters(theData.theWord, LOCKBEHAVIOR);
  $('#mixLetters').fadeOut(0).delay(150).fadeIn(0);
  alignAllLetters();
}

$('#mixtheLetters').click(function(e) {

  mixWordLetters(false);
  e.preventDefault();
  return false;

});

$('#getNewPuzzle').click(function(e) {
  if (prompt("Are you sure ?","Y")=="Y") {
      socket.emit("NEW_PUZZLE", myName);
      window.location = "./game.html";
  } else {
    
  }

  e.preventDefault();

});

$('#getNewOPP').click(function(e) {
  window.location = "./game.html";
  e.preventDefault();
});

$('#logonbut').click(function(e) {
  startGame(1);
  e.preventDefault();
});

$('#logonbutquiet').click(function(e) {
  startGame(0);
  e.preventDefault();
});

$('#randomnick').click(function(e) {
  myColor = pastelColors();
  username = generate_user_name();
  $('#username').val(username);
  $('#logonbox').css("background-color", myColor);  
  $('#username').css("background-color", 'black');
  $('#username').css("color", myColor);  
  e.preventDefault();
});


function setyouropponent() {

      yourOpp = $('#opponentchoice option:selected').text();
      
      //console.log(JSON.stringify($('#opponentchoice')));
    
    //console.log("You are playing against: " + yourOpp + "\n\n");
    
var howmanymovesdoeshehave=0;
var oppscore=0;
    
    for (var i=0;i<theRecords.length;i++){
      if ( (yourOpp=="Everyone") || (theRecords[i].player==yourOpp) ) {
        howmanymovesdoeshehave++;
        oppscore+=3*theRecords[i].theWord.length;
        console.log(theRecords[i].secondsElapsed + " " + theRecords[i].theWord);
      }
    }    
    
         if (yourOpp!=="Yourself")   $('#opp').html(myName + " -vs- " + oppscore + "pts " + yourOpp + "(" + howmanymovesdoeshehave + " words found)");
         if (yourOpp!=="Yourself")   $('#modalinfo').html(myName + " -vs- " + oppscore + "pts " + yourOpp + "(" + howmanymovesdoeshehave + " words found)");
  
  
}

document.addEventListener('contextmenu', function(evt) {
  evt.preventDefault();
}, false);

socket.on('connect', function() {

  socket.on("disconnect", function() {
    console.log("lost connection!");
    document.write("<a href='http://publicpuzzle.com' />Lost Connection to PublicPuzzle.com</a>");
  });
  
  socket.on('HISTORY_GOT', function(data) {
    
    //console.log(data);
    
    theRecords=data;
    var pl="";
    var indd=0;
    
    //$('#opponentchoice').remove();
    
$('#opponentchoice')
    .empty()
    .append('<option selected="selected" value="Yourself">Yourself</option>')
    .append('<option value="Everyone">Everyone</option>')
;    
    
    for (var i=0;i<theRecords.length;i++){
      console.log(theRecords[i].theWord);
      if (playernames.indexOf(theRecords[i].player)>-1) {
        
      } else {
        
        playernames.push(theRecords[i].player);
        pl+=indd + " " + theRecords[i].player + "\n";
        indd++;
        
        $('#opponentchoice').append($('<option>', {value:theRecords[i].player, text:theRecords[i].player}));
      }
    }
    
    //if (playernames.length>1) if (playerOppChoice==-1) playerOppChoice=Math.floor(prompt("Enter a number for an opponent choice? \n" + pl,0));
    
    if (playerOppChoice==-1) playerOppChoice=0;
    
    yourOpp = playernames[playerOppChoice];//Math.floor(Math.random()*playernames.length)];
    
    if (playernames[playerOppChoice]==null) yourOpp="Yourself!";
    
  //  console.log(playernames);
  
  //alert($('#opponentchoice option:selected').text());
  
      yourOpp = $('#opponentchoice option:selected').text();
      
      //console.log(JSON.stringify($('#opponentchoice')));
    
  //  console.log("You are playing against: " + yourOpp + "\n\n");
    
var howmanymovesdoeshehave=0;
    
    for (var i=0;i<theRecords.length;i++){
      if ((yourOpp=="Everyone") || (theRecords[i].player==yourOpp)) {
        howmanymovesdoeshehave++;
        console.log(theRecords[i].secondsElapsed + " " + theRecords[i].theWord);
      }
    }    
    
   if (yourOpp!=="Yourself")     $('#opp').html(myName + " -vs- " + oppscore + "pts " + yourOpp + "(" + howmanymovesdoeshehave + " words found)");
    
   // console.log("History_Got" + JSON.stringify(theRecords));
    
  //   var temp;
  // // console.log("data:" + JSON.stringify(data));
  //   for (var i=0;i<history.length;i++) {
  //     temp=history[i];
  //     console.log("Temp:" + temp);
  //     if (temp.secondsElapsed<timeElapsed) {
  //       console.log("#" + i + " : " + temp.secondsElapsed + " " + temp.player + " " + temp.theWord);
  //     } else {
  //       console.log("#" + i + " : " + temp.secondsElapsed);
  //     }
  //   }     
    
    // history=[];
    
    // for (var i=0;i<data.length;i++) {
    //   history.push(data[i]);
    // }

    // //history=data;
  
  });  

  socket.on('VALIDATED_WORD_ARRAY', function(data) {
    console.log(JSON.stringify(data));
  });

  socket.on('heartbeat', function() {
    console.log('heartbeat');
  });

  socket.on('USER_GOT', function(u) {
    $('#logonscreen').fadeIn(1000);
  });

  socket.on("ID", function(d) {
    myName = d;
  });

  socket.on("BAD_BADWORD_BACK_SELF", function(d) {
    $('#wordsfound').html(words.substr(showIndex));
    // showIndex++;
    // if (showIndex > words.length) showIndex = 0;
    unlockLetters();
    $('#badd').fadeIn(0).delay(15).fadeOut(0);
    playit('door_bump');
    $('#listing').html("  <b>" + d.player + " (" + d.score + ")" + "</b>  ");
    $('#thewordlist').css("background-color", 'red');

  });

  socket.on("BADWORD_BACK_SELF", function(d) {
    $('#wordsfound').html(words.substr(showIndex));
    // showIndex++;
    // if (showIndex > words.length) showIndex = 0;
    $('#badd').fadeIn(0).delay(15).fadeOut(0);
    $('#listing').html("  <b>" + "Already Found: " + d.theWord + "(" + d.score + ")" + "</b>  ");
    playit('water_droplet');
  });

  socket.on("WORD_BACK", function(d) {

    if (d.score > high.score) {
      high.score = d.score;
      high.player = d.player;
      high.color = d.theColor;
    }

    if (names.indexOf(d.player) < 0) names.push(d.player);

    goodWord(d.theColor);

    $('#highplayer').html(" High: <b>" + high.player + "</b>   " + high.score);

    scores[d.player] = d.score;

    addPixiText(d.theWord + " " + d.player.replace(/\d+/g,''), 10, 201, 200, 120, d.theColor, 0, 1);

    $('#listing').html(d.theWord + " <br />(" + d.score + ")" + d.player);

    wordobjs.push({
      'word': d.theWord,
      'color': d.theColor,
      'player': d.player
    });
    words += " " + d.theWord + " ";
    $('#wordsfound').html(words.substr(showIndex));
    // showIndex++;
    // if (showIndex > words.length) showIndex = 0;
  });

  socket.on("WORD_BACK_SELF", function(d) {

    if (d.score > high.score) {
      high.score = d.score;
      high.player = d.player;
      high.color = d.theColor;
    }

    if (names.indexOf(d.player) < 0) names.push(d.player);

    goodWord(d.theColor);
    $('#highplayer').html(" High: <b>" + high.player + "</b>   " + high.score);

    scores[d.player] = d.score;

    $('#goood').fadeIn(0).delay(15).fadeOut(0);

    myscore = d.score;

    if (d.theWord.length >= 3) $('#powerup').show();
    if (d.theWord.length > 3) $('#powerup2').show();

    console.log("Score: " + myscore);
    playit('bell_ring');
    addPixiText(d.theWord + " " + d.player.replace(/\d+/g,''), 10, 201, 200, 120, d.theColor, 0, 1);

    $('#listing').html(d.theWord + " <br />(" + d.score + ") " + d.player);
    wordobjs.push({
      'word': d.theWord,
      'color': d.theColor,
      'player': d.player
    });
    words += " " + d.theWord + " ";
    $('#wordsfound').html(words.substr(showIndex));
    // showIndex++;
    // if (showIndex > words.length) showIndex = 0;
  });

  //alert("gp");
  //socket.emit("GET_PUZZLE", myName);

  socket.on('PLAYER_JOINED', function(data) {
    //console.log(data);
  });

  socket.on('PLAYER_LEFT', function(data) {
    //console.log(data);
  });

  socket.on('PUZZLE_NEW', function(data) {
    
    theRecords=[];
    
    for (var i = stage.children.length - 1; i >= 0; i--) {
      stage.removeChild(stage.children[i]);
    }
    
    startTime=Date.now();

    createGraphics();
    
    //reset items associated with new puzzle 
    
    theData = data;

    words = " "; 
    wordobjs = [];

    for (var i = 0; i < theData.foundWords.length; i++) {
      wordobjs.push({
        'word': theData.foundWords[i],
        'color': 'white',
        'player': 'server'
      });
      words += " " + theData.foundWords[i].toUpperCase() + " ";

    }
    showIndex = 0;
    words=" ";//todo temp no load previous found words
    $('#wordsfound').html(words.substr(showIndex)); //+ " .......... " + words );

//theData.time=1000*15;
    console.log("SECONDS UNTIL NEW PUZZLE BUTTON:" + theData.time);
    $('#getNewPuzzle').hide().delay(theData.time).fadeIn(500);

    createScrambledLetters(data.theWord, false);

  });

  window.addEventListener('resize', resizewin, false);
  //document.body.appendChild(renderer.view);  
  requestAnimationFrame(animate);
});
