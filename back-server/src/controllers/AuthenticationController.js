const { Router } = require("express");

const authenticator = require("../services/authenticator");
const User = require("../models/User");

/**
 * @param {Express.Application} app
 * @param {Router} router
 */
module.exports = function (app, router) {
  /**
   * @swagger
   * /login:
   *   post:
   *     summary: Authentifier un utilisateur
   *     tags:
   *       - Authentication
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *             required:
   *               - email
   *               - password
   *     responses:
   *       200:
   *         description: Succès - Renvoie les informations d'authentification
   *       400:
   *         description: Requête invalide - L'authentification a échoué en raison de données incorrectes
   */
  router.post("/login", async (req, res) => {
    try {
      res.send(await authenticator.authenticate(req.body.email, req.body.password));
    } catch (e) {
      res.status(400).send(e);
    }
  });

  /**
   * @swagger
   * /register:
   *   post:
   *     summary: Enregistrer un utilisateur
   *     tags:
   *       - Authentication
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *             required:
   *               - email
   *               - password
   *     responses:
   *       200:
   *         description: Succès - Renvoie les informations d'authentification pour le nouvel utilisateur
   *       400:
   *         description: Requête invalide - L'enregistrement a échoué en raison de données incorrectes ou d'un utilisateur existant
   */
  router.post("/register", async (req, res) => {
    try {
      const user = await authenticator.create(req.body);
      res.send(await authenticator.authenticate(user.email, req.body.password));
    } catch (e) {
      res.status(400).send("Bad Request");
    }
  });
};
