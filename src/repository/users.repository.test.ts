import { getUsers, saveUser } from "./users.repository";
import getConnection from "../database/db";
import { UserFromDb } from "../models/user";

jest.mock("../database/db");

describe("Users Repository", () => {
  const mockDb = {
    none: jest.fn(),
    any: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getConnection as jest.Mock).mockReturnValue(mockDb);
  });

  const createUserMock = (): UserFromDb => ({
    id: 1,
    name: "John Doe",
    location: "new york",
    login: "johndoe",
    github_id: 12345,
    avatar_url: "https://avatar.url",
    gravatar_id: "gravatar123",
    url: "https://url",
    html_url: "https://html.url",
    followers_url: "https://followers.url",
    following_url: "https://following.url",
    gists_url: "https://gists.url",
    starred_url: "https://starred.url",
    subscriptions_url: "https://subscriptions.url",
    organizations_url: "https://organizations.url",
    repos_url: "https://repos.url",
    events_url: "https://events.url",
    received_events_url: "https://received.events.url",
    type: "User",
    site_admin: false,
    company: "Test Company",
    blog: "https://blog.url",
    email: "test@example.com",
    hireable: true,
    bio: "Test bio",
    twitter_username: "johndoe",
    public_repos: 10,
    public_gists: 5,
    followers: 100,
    following: 50,
    created_at: new Date("2021-01-01T00:00:00Z"),
    updated_at: new Date("2021-01-01T00:00:00Z"),
    node_id: "node123",
    languages: ["javascript", "typescript"],
  });

  it("should save a user successfully", async () => {
    const user = createUserMock();
    await saveUser(user);
    expect(mockDb.none).toHaveBeenCalled();
  });

  it("should throw an error when the database operation fails", async () => {
    mockDb.none.mockRejectedValue(new Error("Database error"));
    const user = createUserMock();
    await expect(saveUser(user)).rejects.toThrow(
      "Failed to add user to the database"
    );
  });

  it("should retrieve users successfully", async () => {
    const users: UserFromDb[] = [createUserMock()];
    mockDb.any.mockResolvedValue(users);
    const result = await getUsers();
    expect(mockDb.any).toHaveBeenCalledTimes(1);
    expect(mockDb.any).toHaveBeenCalledWith(
      `SELECT api.users.*, ` +
        `ARRAY_AGG(api.users_languages.language) AS languages ` +
        `FROM api.users INNER JOIN api.users_languages ` +
        `ON api.users.id = api.users_languages.user_id GROUP BY api.users.id`,
      []
    );
    expect(result).toEqual(users);
  });

  it("should retrieve users with conditions", async () => {
    const users: UserFromDb[] = [createUserMock()];
    const where = { login: "johndoe" };
    mockDb.any.mockResolvedValue(users);
    const result = await getUsers(where);
    expect(mockDb.any).toHaveBeenCalledTimes(1);
    expect(mockDb.any).toHaveBeenCalledWith(
      `SELECT api.users.*, ` +
        `ARRAY_AGG(api.users_languages.language) AS languages ` +
        `FROM api.users INNER JOIN api.users_languages ` +
        `ON api.users.id = api.users_languages.user_id ` +
        `WHERE login IN ($1) GROUP BY api.users.id`,
      ["johndoe"]
    );
    expect(result).toEqual(users);
  });
});
