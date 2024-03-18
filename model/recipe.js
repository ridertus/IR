const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  RecipeId: String,
  Name: String,
  AuthorId: String,
  AuthorName: String,
  CookTime: String,
  PrepTime: String,
  TotalTime: String,
  DatePublished: Date,
  Description: String,
  Images: [String],
  RecipeCategory: String,
  Keywords: [String],
  RecipeIngredientQuantities: [String],
  RecipeIngredientParts: [String],
  AggregatedRating: mongoose.Schema.Types.Decimal128,
  Calories: mongoose.Schema.Types.Decimal128,
  FatContent: mongoose.Schema.Types.Decimal128,
  SaturatedFatContent: mongoose.Schema.Types.Decimal128,
  CholesterolContent: mongoose.Schema.Types.Decimal128,
  SodiumContent: mongoose.Schema.Types.Decimal128,
  CarbohydrateContent: mongoose.Schema.Types.Decimal128,
  FiberContent: mongoose.Schema.Types.Decimal128,
  SugarContent: mongoose.Schema.Types.Decimal128,
  ProteinContent: mongoose.Schema.Types.Decimal128,
  RecipeServings: mongoose.Schema.Types.Decimal128,
  RecipeYield: String,
  RecipeInstructions: [String]
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
