const { Router } = require("express");
const requireRoles = require("../middlewares/require-role");
const requireAuth = require("../middlewares/require-auth");
const User = require("../models/User");
const Recipe = require("../models/Recipe");
const Hash = require("../utils/hash");

/**
 * @param {Express.Application} app
 * @param {Router} router
 */
module.exports = function (app, router) {
  /**
   * @swagger
   * /users:
   *   get:
   *     summary: Récupérer tous les utilisateurs
   *     tags:
   *       - Users
   *     responses:
   *       200:
   *         description: Succès - Renvoie tous les utilisateurs
   *         content:
   *           application/json:
   *             example:
   *               - _id: "605e0abae3b6373d40f2a4b1"
   *                 email: "utilisateur1@example.com"
   *                 name: "utilisateur1"
   *                 role: "USER"
   *       404:
   *         description: Non trouvé - Aucun utilisateur trouvé
   *       500:
   *         description: Erreur serveur - Erreur lors de la récupération des utilisateurs
   */
  router.get("/users", [requireAuth, requireRoles(["ADMIN"])], async (req, res) => {
    try {
      const users = await User.find();

      // Si existe
      if (users.length === 0) res.status(404).send({ message: "Aucun utilisateur trouvé" });

      res.status(200).send(users);
    } catch (e) {
      res.status(500).send({ message: "Erreur lors de la récupération des utilisateurs" });
    }
  });

  /**
   * @swagger
   * /users/@me:
   *   get:
   *     summary: Récupérer un utilisateur authentifié
   *     tags:
   *       - Users
   *     responses:
   *       200:
   *         description: Succès - Renvoie un utilisateur authentifié
   *         content:
   *           application/json:
   *             example:
   *                 _id: "605e0abae3b6373d40f2a4b1"
   *                 email: "utilisateur1@example.com"
   *                 name: "utilisateur1"
   *                 role: "USER"
   *       404:
   *         description: Non trouvé - Aucun utilisateur trouvé
   */
  router.get("/users/@me", [requireAuth], async (req, res) => {
    try {
      res.status(200).send(req.user);
    } catch (e) {
      res.status(404).send(e);
    }
  });

  /**
   * @swagger
   * /restaurants:
   *   get:
   *     summary: Récupérer tous les utilisateurs - restaurant
   *     tags:
   *       - Users
   *     responses:
   *       200:
   *         description: Succès - Renvoie tous les restaurants
   *         content:
   *           application/json:
   *             example:
   *               - _id: "605e0abae3b6373d40f2a4b1"
   *                 email: "restaurant1@example.com"
   *                 name: "restaurant1"
   *                 role: "RESTAURANT"
   *                 address: "address1"
   *                 postalCode: "cp1"
   *                 city: "city1"
   *       404:
   *         description: Non trouvé - Aucun restaurant trouvé
   *       500:
   *         description: Erreur serveur - Erreur lors de la récupération des restaurants
   */
  router.get("/restaurants", [requireAuth, requireRoles(["ADMIN"])], async (req, res) => {
    try {
      const restaurants = await User.find({ role: "RESTAURANT" });

      // Si existe
      if (restaurants.length === 0) res.status(404).send({ message: "Aucun restaurant trouvé" });

      res.status(200).send(restaurants);
    } catch (e) {
      res.status(500).send({ message: "Erreur lors de la récupération des restaurants" });
    }
  });

  /**
   * @swagger
   * /restaurants:
   *   post:
   *     summary: Créer un utilisateur - restaurant
   *     tags:
   *       - Users
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
   *                   email:
   *                     type: string
   *                   password:
   *                     type: string
   *                   name:
   *                     type: string
   *                   role:
   *                     type: string
   *                   address:
   *                     type: string
   *                   postalCode:
   *                     type: string
   *                   city:
   *                     type: string
   *             required:
   *               - email
   *               - password
   *               - name
   *               - role
   *               - address
   *               - postalCode
   *               - city
   *     responses:
   *       201:
   *         description: Création réussie - Renvoie le restaurant créé
   *         content:
   *           application/json:
   *             example:
   *                 _id: "605e0abae3b6373d40f2a4b1"
   *                 email: "restaurant1@example.com"
   *                 password: "..."
   *                 name: "restaurant1"
   *                 role: "RESTAURANT"
   *                 address: "address1"
   *                 postalCode: "cp1"
   *                 city: "city1"
   *       400:
   *         description: Requête invalide - Erreur lors de la création du restaurant
   */
  router.post("/restaurants", [requireAuth, requireRoles(["ADMIN"])], async (req, res) => {
    try {
      const { password, ...userData } = req.body.data;
      const hashedPassword = await Hash.hash(password);
      const user = new User({ ...userData, password: hashedPassword, role: "RESTAURANT" });
      res.status(201).send(await user.save());
    } catch (e) {
      res.status(400).send('Erreur lors de la création du restaurant');
    }
  });

  /**
   * @swagger
   * /restaurants/{id}:
   *   patch:
   *     summary: Mettre à jour un utilisateur - restaurant
   *     tags:
   *       - Users
   *     parameters:
   *       - in: path
   *         name: id
   *         description: ID du restaurant à mettre à jour
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
   *                   address:
   *                     type: string
   *                   postalCode:
   *                     type: string
   *                   city:
   *                     type: string
   *             required:
   *               - name
   *               - address
   *               - postalCode
   *               - city
   *     responses:
   *       200:
   *         description: Succès - Renvoie le restaurant mis à jour
   *         content:
   *           application/json:
   *             example:
   *                 _id: "605e0abae3b6373d40f2a4b1"
   *                 email: "restaurant1@example.com"
   *                 name: "restaurant1"
   *                 role: "RESTAURANT"
   *                 address: "address1"
   *                 postalCode: "cp1"
   *                 city: "city1"
   *       404:
   *         description: Non trouvé - Aucun restaurant trouvé
   *       500:
   *         description: Erreur serveur - Erreur lors de la mise à jour du restaurant
   */
  router.patch("/restaurants/:id", [requireAuth, requireRoles(["RESTAURANT"])], async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      // Si existe
      if (!user) return res.status(404).send({ message: "Aucun restaurant trouvé" });

      user.set(req.body.data);
      const updatedUser = await user.save();
      res.status(200).send(updatedUser);
    } catch (e) {
      res.status(500).send({ message: "Erreur lors de la mise à jour du restaurant" });
    }
  });

  /**
   * @swagger
   * /restaurants/{id}:
   *   delete:
   *     summary: Supprimer un utilisateur - restaurant
   *     tags:
   *       - Users
   *     parameters:
   *       - in: path
   *         name: id
   *         description: ID du restaurant à supprimer
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       204:
   *         description: Suppression réussie - Aucun contenu renvoyé
   *       404:
   *         description: Non trouvé - Aucun restaurant trouvé
   *       500:
   *         description: Erreur interne du serveur - Erreur lors de la suppression du restaurant
   */
  router.delete("/restaurants/:id", [requireAuth, requireRoles(["ADMIN"])], async (req, res) => {
    try {
      await Recipe.deleteMany({ user_id: req.params.id });
      const deletedUser = await User.findByIdAndDelete(req.params.id);

      // Si existe
      if (!deletedUser) return res.status(404).send({ message: "Aucun restaurant trouvé" });

      res.status(204).end();
    } catch (e) {
      res.status(500).send({ message: "Erreur lors de la suppression du restaurant" });
    }
  });
};
