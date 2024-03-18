const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    name: String,
    authorId: Number,
    authorName: String,
    cookTime: String,
    prepTime: String,
    totalTime: String,
    datePublished: Date,
    description: String,
    images: [String],
    recipeCategory: String,
    keywords: [String],
    recipeIngredientQuantities: [String],
    recipeIngredientParts: [String],
    aggregatedRating: Number,
    reviewCount: Number,
    nutrition: {
        calories: Number,
        fatContent: Number,
        saturatedFatContent: Number,
        cholesterolContent: Number,
        sodiumContent: Number,
        carbohydrateContent: Number,
        fiberContent: Number,
        sugarContent: Number,
        proteinContent: Number,
    },
    recipeServings: Number,
    recipeYield: String,
    recipeInstructions: [String]
});

const Recipe = mongoose.model('recipe', recipeSchema);

module.exports = Recipe;