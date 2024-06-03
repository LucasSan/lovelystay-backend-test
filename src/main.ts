import dotenv from "dotenv";
import { Command } from "commander";
import figlet from "figlet";
import { getUsers, saveUser } from "./services/users.service";
import { saveUserLanguage } from "./services/users-languages.service";
import {
  getUserFromGithub,
  getUserRepositoriesFromGithub,
} from "./services/github-api.service";
dotenv.config();

console.log(figlet.textSync("Lovely Stay"));
export const program = new Command();

program
  .version("1.0.0")
  .description("Lovely Stay CLI tool for GitHub users")
  .option("-g, --get <username>", "Get GitHub user info")
  .option("-l, --list", "List all users from the database")
  .option("-loc, --location <location>", "List users by location")
  .option("-lang, --language <language>", "List users by programming language")
  .parse(process.argv);

const options = program.opts();

const main = async () => {
  try {
    if (options.get) {
      if (typeof options.get !== "string")
        throw new Error("Username should be a string");

      const username = options.get;
      const user = await getUserFromGithub(username);
      if (!user) throw new Error("User not found on GitHub");

      const repos = await getUserRepositoriesFromGithub(username);
      if (!repos) throw new Error("User repositories not found on GitHub");

      const userResponse = await saveUser(user);
      if (!userResponse) throw new Error("User already exists in the database");

      if (repos && repos.size) {
        console.log("userResponse: ", userResponse);
        await saveUserLanguage(userResponse[0].id, repos);
      }

      console.log("User and languages saved successfully");
    }

    if (options.list) {
      const users = await getUsers();
      console.log("Users in database:", users);
    }

    if (options.location) {
      if (typeof options.location !== "string")
        throw new Error("Location should be a string");

      const location = options.location;
      const users = await getUsers({ location: location.toLowerCase() });
      console.log(`Users in ${location}:`, users);
    }

    if (options.language) {
      if (typeof options.language !== "string")
        throw new Error("Language should be a string");

      const language = options.language;
      const users = await getUsers({ language: language });
      console.log(`Users who know ${language}:`, users);
    }
  } catch (error: any) {
    console.log("Error:", error.message);
  }
};

main().catch((error: any) => {
  console.error("Unhandled error:", error);
});
