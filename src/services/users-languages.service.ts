import {
  saveUserLanguage as saveUserLanguageRepo
} from "../repository/users-languages.repository";

/**
 * Saves the user's languages to the database.
 * @param {number} userId
 * @param {Set<string>} userRepos
 * @return {Promise<void>}
 */
const saveUserLanguage = async (
  userId: number,
  userRepos: Set<string>
): Promise<void> => {
  return saveUserLanguageRepo(userId, userRepos);
};

export { saveUserLanguage };
