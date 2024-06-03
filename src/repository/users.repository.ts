import { UserFromDb, UserToDb } from "../models/user";
import getConnection from "../database/db";

const saveUser = async (user: UserToDb): Promise<void> => {
  const query = `
    INSERT INTO api.users (
      name, location, login, github_id, avatar_url,
      gravatar_id, url, html_url, followers_url, following_url,
      gists_url, starred_url, subscriptions_url, organizations_url, repos_url,
      events_url, received_events_url, type, site_admin, company,
      blog, email, hireable, bio, twitter_username,
      public_repos, public_gists, followers, following, created_at,
      updated_at, node_id
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
      $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27,
      $28, $29, $30, $31, $32
    )
  `;
  const values = [
    user.name,
    user.location,
    user.login,
    user.github_id,
    user.avatar_url,
    user.gravatar_id,
    user.url,
    user.html_url,
    user.followers_url,
    user.following_url,
    user.gists_url,
    user.starred_url,
    user.subscriptions_url,
    user.organizations_url,
    user.repos_url,
    user.events_url,
    user.received_events_url,
    user.type,
    user.site_admin,
    user.company,
    user.blog,
    user.email,
    user.hireable,
    user.bio,
    user.twitter_username,
    user.public_repos,
    user.public_gists,
    user.followers,
    user.following,
    user.created_at,
    user.updated_at,
    user.node_id,
  ];

  try {
    const db = getConnection();
    await db.none(query, values);
    console.log("User added successfully");
  } catch (error) {
    console.error("Error adding user:", error);
    throw new Error("Failed to add user to the database");
  }
};

const getUsers = async (
  where?: Record<string, string>
): Promise<Array<UserFromDb>> => {
  try {
    const db = getConnection();
    let query =
      `SELECT api.users.*, ` +
      `ARRAY_AGG(api.users_languages.language) AS languages ` +
      `FROM api.users ` +
      `INNER JOIN api.users_languages ` +
      `ON api.users.id = api.users_languages.user_id`;
    const values = [];
    if (where) {
      const keys = Object.keys(where);
      const conditions = keys.map((key, index) => `${key} IN ($${index + 1})`);
      query += ` WHERE ${conditions.join(" AND ")}`;
      values.push(...Object.values(where));
    }

    query += ` GROUP BY api.users.id`;
    return db.any(query, values);
  } catch (error) {
    console.error("Error retrieving users:", error);
    return [];
  }
};

export { saveUser, getUsers };
