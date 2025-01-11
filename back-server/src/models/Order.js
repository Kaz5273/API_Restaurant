const mongoose = require('mongoose');

const Schema = new mongoose.Schema(
  {
    user: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
    restaurant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        name: {
          type: String,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: ['PROCESSED', 'DELIVERED', 'CANCELLED'],
      default: 'PROCESSED',
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Order", Schema);