import getConnection from "../database/db";

const saveUserLanguage = async (
  userId: number,
  userRepos: Set<string>
): Promise<void> => {
  if (!userRepos.size) throw new Error("User repos not found");

  for (const language of userRepos) {
    const query = `
    INSERT INTO api.users_languages (user_id, language) VALUES ($1, $2)
  `;
    const values = [userId, language.toLowerCase()];
    try {
      const db = getConnection();
      await db.none(query, values);
    } catch (error) {
      console.error("Error adding language:", error);
      throw new Error("Failed to add language to the database");
    }
  }
};

export { saveUserLanguage };
