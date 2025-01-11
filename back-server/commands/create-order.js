require("dotenv").config();
require("../src/utils/mongoose");

const prompts = require("prompts");
const Order = require("../src/models/Order");
const User = require("../src/models/User");
const Recipe = require("../src/models/Recipe");

async function main() {
    try {
        const userQuestions = [
            {
                type: "text",
                name: "email",
                message: "What is the email of the user creating the order?",
            },
        ];
  
        const userResponse = await prompts(userQuestions);
        const user = await User.findOne({ email: userResponse.email });
    
        if (!user || user.role !== "USER") {
            console.log("\nUser not found or does not have the required role.\n");
            process.exit(0);
        }
    
        const restaurantQuestions = [
            {
                type: "select",
                name: "restaurant",
                message: "Select a restaurant:",
                choices: async () => {
                    const restaurants = await User.find({ role: "RESTAURANT" });
                    return restaurants.map(restaurant => ({ title: restaurant.name, value: restaurant._id }));
                },
            },
        ];

        const restaurantResponse = await prompts(restaurantQuestions);
        const recipes = await Recipe.find({ user_id: restaurantResponse.restaurant });
        const items = [];

        while (true) {
            const orderQuestions = [
                {
                    type: "select",
                    name: "recipe",
                    message: "Select a recipe:",
                    choices: [
                        ...recipes.map(recipe => ({ title: recipe.name + ' = ' + recipe.price + '€', value: recipe })),
                    ],
                },
            ];

            const orderResponse = await prompts(orderQuestions);

            items.push({ ...orderResponse.recipe });

            const continueQuestions = [
                {
                    type: "select",
                    name: "continue",
                    message: "Do you want to add another recipe or proceed to order validation?",
                    choices: [
                        { title: "Add another recipe", value: true },
                        { title: "Proceed to order validation", value: false },
                    ],
                },
            ];

            const continueResponse = await prompts(continueQuestions);

            if (!continueResponse.continue) {
                break;
            }
        }
        
        const orderData = {
            user: {
                _id: user._id,
                email: user.email,
            },
            restaurant_id: restaurantResponse.restaurant,
            items
        };

        const order = await Order.create(orderData);
        console.log("\nOrder created", "\n");
        process.exit(0);

    } catch (error) {
        console.error("\nAn error occurred:", error.message, "\n");
        process.exit(1);
    }
}
  
main();
  