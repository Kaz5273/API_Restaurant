const { Router } = require("express");
const requireRoles = require("../middlewares/require-role");
const requireAuth = require("../middlewares/require-auth");
const Recipe = require("../models/Recipe");

/**
 * @param {Express.Application} app
 * @param {Router} router
 */
module.exports = function (app, router) {
  /**
   * @swagger
   * /recipes:
   *   get:
   *     summary: Récupérer les recettes d'un restaurant
   *     tags:
   *       - Recipes
   *     responses:
   *       200:
   *         description: Succès - Renvoie les recettes du restaurant
   *         content:
   *           application/json:
   *             example:
   *               - _id: "605e0abae3b6373d40f2a4b1"
   *                 name: "Blanquette"
   *                 image: "https://www.elle-et-vire.com/uploads/cache/1920x1200/uploads/recip/recipe/2028/5e553cc677b55_blanquette-de-veau-1920x500.jpg"
   *                 price: "12.99"
   *                 user_id: "605e0a8ae3b6373d40f2a4a8"
   *       404:
   *         description: Non trouvé - Aucune recette trouvée
   *       500:
   *         description: Erreur serveur - Erreur lors de la récupération des recettes
   */
  router.get("/recipes", [requireAuth, requireRoles(["RESTAURANT"])], async (req, res) => {
    try {
      const recipes = await Recipe.find({ user_id: req.user._id });

      // Si existe
      if (recipes.length === 0) res.status(404).send({ message: "Aucune recette trouvée" });
        
      res.status(200).send(recipes);
    } catch (e) {
      res.status(500).send({ message: "Erreur lors de la récupération des recettes" });
    }
  });

  /**
   * @swagger
   * /recipes/{id}:
   *   get:
   *     summary: Récupérer la recette d'un restaurant
   *     tags:
   *       - Recipes
   *     parameters:
   *       - in: path
   *         name: id
   *         description: ID de la recette à récupérer
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Succès - Renvoie la recette d'un restaurant
   *         content:
   *           application/json:
   *             example:
   *                 _id: "605e0abae3b6373d40f2a4b1"
   *                 name: "Blanquette"
   *                 image: "https://www.elle-et-vire.com/uploads/cache/1920x1200/uploads/recip/recipe/2028/5e553cc677b55_blanquette-de-veau-1920x500.jpg"
   *                 price: "12.99"
   *                 user_id: "605e0a8ae3b6373d40f2a4a8"
   *       404:
   *         description: Non trouvé - Aucune recette trouvée
   *       500:
   *         description: Erreur serveur - Erreur lors de la récupération de la recette
   */
  router.get("/recipes/:id", [requireAuth, requireRoles(["RESTAURANT"])], async (req, res) => {
    try {
      const recipe = await Recipe.findOne({ _id: req.params.id });

      // Si existe
      if (!recipe) res.status(404).send({ message: "Aucune recette trouvée" });

      res.status(200).send(recipe);
    } catch (e) {
      res.status(500).send({ message: "Erreur lors de la récupération de la recette" });
    }
  });

  /**
   * @swagger
   * /recipes:
   *   post:
   *     summary: Créer la recette d'un restaurant
   *     tags:
   *       - Recipes
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               data:
   *                 type: object
   *                 properties:
   *                   name:
   *                     type: string
   *                   image:
   *                     type: string
   *                   price:
   *                     type: string
   *                   user_id:
   *                     type: string
   *             required:
   *               - name
   *               - image
   *               - price
   *               - user_id
   *     responses:
   *       201:
   *         description: Création réussie - Renvoie la recette d'un restaurant
   *         content:
   *           application/json:
   *             example:
   *                 _id: "605e0abae3b6373d40f2a4b1"
   *                 name: "Blanquette"
   *                 image: "https://www.elle-et-vire.com/uploads/cache/1920x1200/uploads/recip/recipe/2028/5e553cc677b55_blanquette-de-veau-1920x500.jpg"
   *                 price: "12.99"
   *                 user_id: "605e0a8ae3b6373d40f2a4a8"
   *       400:
   *         description: Requête invalide - Erreur lors de la création de la recette
   */
  router.post("/recipes", [requireAuth, requireRoles(["RESTAURANT"])], async (req, res) => {
    try {
      const recipe = new Recipe({ ...req.body.data, user_id: req.user._id });
      const createdRecipe = await recipe.save();
      res.status(201).send(createdRecipe);
    } catch (e) {
      res.status(400).send({ message: "Erreur lors de la création de la recette" });
    }
  });

  /**
   * @swagger
   * /recipes/{id}:
   *   patch:
   *     summary: Mettre à jour une recette d'un restaurant
   *     tags:
   *       - Recipes
   *     parameters:
   *       - in: path
   *         name: id
   *         description: ID de la recette à mettre à jour
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               data:
   *                 type: object
   *                 properties:
   *                   name:
   *                     type: string
   *                   image:
   *                     type: string
   *                   price:
   *                     type: string
   *             required:
   *               - name
   *               - image
   *               - price
   *     responses:
   *       200:
   *         description: Succès - Renvoie la recette d'un restaurant
   *         content:
   *           application/json:
   *             example:
   *                 _id: "605e0abae3b6373d40f2a4b1"
   *                 name: "Blanquette"
   *                 image: "https://www.elle-et-vire.com/uploads/cache/1920x1200/uploads/recip/recipe/2028/5e553cc677b55_blanquette-de-veau-1920x500.jpg"
   *                 price: "14.99"
   *                 user_id: "605e0a8ae3b6373d40f2a4a8"
   *       404:
   *         description: Non trouvé - Aucune recette trouvée 
   *       500:
   *         description: Erreur lors de la mise à jour de la recette
   */
  router.patch("/recipes/:id", [requireAuth, requireRoles(["RESTAURANT"])], async (req, res) => {
    try {
      const recipe = await Recipe.findById(req.params.id);

      // Si existe
      if (!recipe) return res.status(404).send({ message: "Aucune recette trouvée" });

      recipe.set(req.body.data);
      const updatedRecipe = await recipe.save();
      res.status(200).send(updatedRecipe);
    } catch (e) {
      res.status(500).send({ message: "Erreur lors de la mise à jour de la recette" });
    }
  });
};
