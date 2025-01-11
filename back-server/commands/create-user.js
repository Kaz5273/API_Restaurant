require("dotenv").config();
require("../src/utils/mongoose");

const prompts = require("prompts");
const authenticator = require("../src/services/authenticator");

async function main() {
  try {
    const questions = [
      {
        type: "text",
        name: "name",
        message: "What is your name ?",
      },
      {
        type: "text",
        name: "email",
        message: "What is your email ?",
      },
      {
        type: "password",
        name: "password",
        message: "What is your password ?",
      },
    ];

    const response = await prompts(questions);
    const user = await authenticator.create({ ...response, role: "USER" });
    console.log("\nUser created", "\n");
    process.exit(0);

  } catch (error) {
    console.error("\nAn error occurred:", error.message, "\n");
    process.exit(1);
  }
}

main();
