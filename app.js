const express = require('express');
const ejs = require("ejs");
const bodyParser = require('body-parser');
const sass = require('node-sass');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const flash = require('connect-flash');

const { authentication } = require('./control/authen');

const db = require("./config/db.js");
const User = require('./model/user');
const Product = require('./model/product');
const OrderList = require('./model/order');
const Recipe = require("./model/recipe.js")

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

db.connect();

//passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
	User.findOne({ email: email })
		.then((user) => {
			if (!user) {
				return done(null, false, { message: 'Incorrect email.' });
			}
			if (user.password !== password) {
				return done(null, false, { message: 'Incorrect password.' });
			}
			return done(null, user);
		})
		.catch((err) => done(err));
}));

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then((user) => {
            done(null, user);
        })
        .catch((err) => {
            done(err, null);
        });
});

// Sign Up
app.get('/sign_up', (req, res) => {
    res.render('sign_up');
});
app.post('/sign_up', (req, res) => {
	const { username, email, password, Interested } = req.body;
	const newUser = new User({
		username,
		email,
		password,
    Interested
	});
	newUser.save()
		.then(() => {
			res.redirect('/sign_in');
		})
		.catch((err) => {
			console.log(err);
			res.status(500).send('Error creating new user');
		});
});

// Sign In
app.get('/sign_in', (req, res) => {
    res.render('sign_in', { message: req.flash('error') });
});
app.post('/sign_in', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/sign_in',
    failureFlash: 'Invalid email or password'
}));

// Home
app.get("/", async (req, res) => {
  try {
    if (req.user && req.user.email) {
      const user = await User.findOne({ email: req.user.email });
      const username = user.username;

      const products = await Product.find();
      const orders = req.user.order;

      const recipe = await Recipe.findOne(); 

      res.render("home", { username: username, user: user, products: products, orders: orders, recipe: recipe });
      
    } else {
      res.redirect("/sign_in");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

// Menu
app.get("/menu", async (req, res) => {
  try {
    if (req.user && req.user.email) {
      const user = await User.findOne({ email: req.user.email });
      const username = user.username;

      const products = await Product.find();
      const orders = req.user.order;

      const recipe = await Recipe.findOne(); 

      res.render("menu", { username: username, user: user, products: products, orders: orders, recipe: recipe });
      
    } else {
      res.redirect("/sign_in");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

// Search-result
app.get("/search-result", async (req, res) => {
  try {
    if (req.user && req.user.email) {
      const user = await User.findOne({ email: req.user.email });
      const username = user.username;

      const products = await Product.find();
      const orders = req.user.order;

      const recipe = await Recipe.findOne(); 

      res.render("search-result", { username: username, user: user, products: products, orders: orders, recipe: recipe });
      
    } else {
      res.redirect("/sign_in");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});
// recipe-detail
app.get("/recipe-detail", async (req, res) => {
  try {
    if (req.user && req.user.email) {
      const user = await User.findOne({ email: req.user.email });
      const username = user.username;

      const products = await Product.find();
      const orders = req.user.order;

      const recipe = await Recipe.findOne(); 

      res.render("recipe-detail", { username: username, user: user, products: products, orders: orders, recipe: recipe });
      
    } else {
      res.redirect("/sign_in");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

// Profile
app.get('/profile', async (req, res) => {
  try {
    if (req.user && req.user.email) {
      const user = await User.findOne({ email: req.user.email });
      const username = user.username;

      const products = await Product.find();
      const orders = req.user.order;

      res.render("profile", { username: username, user: user, products: products, orders: orders });
      
    } else {
      res.redirect("/sign_in");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});

// Route for Recipe Details
app.get('/recipe-detail/:id', async (req, res) => {
  try {
    // Fetch the recipe by ID
    const recipe = await Recipe.findById(req.params.id);

    // If no recipe is found, redirect or show a not found message
    if (!recipe) {
      return res.status(404).send('Recipe not found');
    }

    // Render the recipe-detail page with the fetched recipe
    res.render("recipe-detail", { recipe: recipe });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

app.get('/test', async (req, res) => {
  try {
    if (req.user && req.user.email) {
      const user = await User.findOne({ email: req.user.email });
      const username = user.username;

      const products = await Product.find();
      const orders = req.user.order;

      // Assuming you want to pass a specific recipe or a dummy recipe for testing purposes
      const recipe = await Recipe.findOne(); // Fetches the first recipe found for demonstration

      // Ensure that 'recipe' is included here
      res.render("test", { username: username, user: user, products: products, orders: orders, recipe: recipe });
      
    } else {
      res.redirect("/sign_in");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

app.get('/search', async (req, res) => {
  try {
      // Your search logic here...
      let recipe = await searchRecipes(/* search parameters */);

      // Ensure 'recipe' is an array
      if (!Array.isArray(recipe)) {
          recipe = [recipe]; // Convert to an array if 'recipe' is not already an array
      }

      res.render('search-result', { recipe });
  } catch (err) {
      console.error(err);
      res.status(500).send("Internal server error");
  }
});



async function searchRecipes(dishName, ingredient, cookingProcess) {
  let queryConditions = [];

  if (dishName) {
      queryConditions.push({ Name: { $regex: new RegExp(dishName, 'i') } });
  }

  if (ingredient) {
      queryConditions.push({ 'RecipeIngredientParts': { $regex: new RegExp(ingredient, 'i') } });
  }

  if (cookingProcess) {
      queryConditions.push({ 'RecipeInstructions': { $regex: new RegExp(cookingProcess, 'i') } });
  }

  let query = {};
  if (queryConditions.length > 0) {
      query = { $or: queryConditions };
  }

  return Recipe.find(query);
}

app.get('/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find({}); 
    res.render('recipes-list', { recipes: recipes });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});
