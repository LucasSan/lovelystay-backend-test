import { ApiUser, UserToDb, UserFromDb } from "../models/user";
import {
  saveUser as saveUserRepo,
  getUsers as getUsersRepo,
} from "../repository/users.repository";

/**
 * Formats an API user object into a database user object.
 * @param {ApiUser} user - The API user object to be formatted.
 * @throws {Error} If the user object is not provided.
 * @return {UserToDb} The formatted database user object.
 */
const _formatUserToDb = (user: ApiUser): UserToDb => {
  if (!user) throw new Error("User object is required");

  return {
    name: user.name,
    location: user.location.toLowerCase(),
    login: user.login,
    github_id: user.id,
    avatar_url: user.avatar_url,
    gravatar_id: user.gravatar_id,
    url: user.url,
    html_url: user.html_url,
    followers_url: user.followers_url,
    following_url: user.following_url,
    gists_url: user.gists_url,
    starred_url: user.starred_url,
    subscriptions_url: user.subscriptions_url,
    organizations_url: user.organizations_url,
    repos_url: user.repos_url,
    events_url: user.events_url,
    received_events_url: user.received_events_url,
    type: user.type,
    site_admin: !!user.site_admin,
    company: user.company,
    blog: user.blog,
    email: user.email,
    hireable: !!user.hireable,
    bio: user.bio,
    twitter_username: user.twitter_username,
    public_repos: user.public_repos,
    public_gists: user.public_gists,
    followers: user.followers,
    following: user.following,
    created_at: new Date(user.created_at),
    updated_at: new Date(user.updated_at),
    node_id: user.node_id,
  };
};

/**
 * Saves a user to the database and retrieves the user from the database.
 * @param {ApiUser} user - The user object to be saved.
 * @throws {Error} If the user object is not provided.
 * @return {Promise<Array<UserFromDb>>}
 */
const saveUser = async (user: ApiUser): Promise<Array<UserFromDb>> => {
  if (!user) throw new Error("User is required");
  await saveUserRepo(_formatUserToDb(user));
  return getUsersRepo({ login: user.login });
};

/**
 * Retrieves users from the repository based on the specified conditions.
 * @param {Record<string, string>} where
 * @return {Promise<Array<UserFromDb>>}
 */
const getUsers = async (
  where?: Record<string, string>
): Promise<Array<UserFromDb>> => {
  return getUsersRepo(where);
};

export { saveUser, getUsers };
