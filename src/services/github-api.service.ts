import { ApiUser } from "../models/user";
import axios from "axios";

/**
 * Function to get a user user github api.
 * @param {string} username
 * @returns {Object}
 */
const getUserFromGithub = async (username: string): Promise<void | ApiUser> => {
  console.log("getUser function called with username:", username);
  if (!username) throw new Error("Username is required");

  try {
    const result = await axios.get(`${process.env.BASE_API_URL}/${username}`);
    return result.data;
  } catch (error: any) {
    throw new Error("User not found on GitHub");
  }
};

/**
 * Function to get the user's repositories info from github api.
 * @param {string} username
 * @returns {Object}
 */
const getUserRepositoriesFromGithub = async (username: string) => {
  console.log("getUserRepos function called with username:", username);
  if (!username) throw new Error("Username is required");

  try {
    const result = await axios.get(
      `${process.env.BASE_API_URL}/${username}/repos`
    );

    console.log("result: ", result);
    if (!Array.isArray(result.data) || !result.data.length) {
      throw new Error("User repositories not found");
    }

    const response = new Set<string>(
      result.data
        .map((repo) => repo.language)
        .filter((language) => language != null)
    );
    return response;
  } catch (error: any) {
    throw new Error("User repositories not found");
  }
};

export { getUserFromGithub, getUserRepositoriesFromGithub };
