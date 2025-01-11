const { Router } = require("express");
const requireRoles = require("../middlewares/require-role");
const requireAuth = require("../middlewares/require-auth");
const Order = require("../models/Order");

/**
 * @param {Express.Application} app
 * @param {Router} router
 */
module.exports = function (app, router) {
  /**
   * @swagger
   * /orders:
   *   get:
   *     summary: Récupérer les commandes d'un restaurant
   *     tags:
   *       - Orders
   *     responses:
   *       200:
   *         description: Succès - Renvoie les commandes d'un restaurant
   *         content:
   *           application/json:
   *             example:
   *               - _id: "605e0abae3b6373d40f2a4b1"
   *                 status: "PROCESSED"
   *                 restaurant_id: "605e0a8ae3b6373d40f2a4a8"
   *       404:
   *         description: Non trouvé - Aucune commande trouvée
   *       500:
   *         description: Erreur serveur - Erreur lors de la récupération des commandes
   */
  router.get("/orders", [requireAuth, requireRoles(["RESTAURANT"])], async (req, res) => {
    try {
      const orders = await Order.find({ status: "PROCESSED", restaurant_id: req.user._id });

      // Si existe
      if (orders.length === 0) res.status(404).send({ message: "Aucune commande trouvée" });

      res.status(200).send(orders);
    } catch (e) {
      res.status(500).send({ message: "Erreur lors de la récupération des commandes" });
    }
  });

  /**
   * @swagger
   * /orders/{id}:
   *   patch:
   *     summary: Annuler la commande d'un restaurant
   *     tags:
   *       - Orders
   *     parameters:
   *       - in: path
   *         name: id
   *         description: ID de la commande à annuler
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Succès - Renvoie la commande annulée avec succès
   *         content:
   *           application/json:
   *             example:
   *                 _id: "605e0abae3b6373d40f2a4b1"
   *                 status: "CANCELLED"
   *                 restaurant_id: "605e0a8ae3b6373d40f2a4a8"
   *       400:
   *         description: Requête invalide - Erreur lors de l'annulation de la commande
   *       404:
   *         description: Non trouvé - Aucune commande trouvée
   */
  router.patch("/orders/:id", [requireAuth, requireRoles(["RESTAURANT"])], async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);

      // Si existe
      if (!order) return res.status(404).send({ message: "Aucune commande trouvée" });  
      
      order.set({ status: "CANCELLED" });
      res.status(200).send(await order.save());
    } catch (e) {
      res.status(400).send({ message: "Erreur lors de l'annulation de la commande" });
    }
  });
};
