import { ApiUser, UserToDb, UserFromDb } from "../models/user";
import {
  saveUser as saveUserRepo,
  getUsers as getUsersRepo,
} from "../repository/users.repository";
import { saveUser, getUsers } from "../services/users.service";

jest.mock("../repository/users.repository");

describe("Users Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("saveUser", () => {
    it("should throw an error if user is not provided", async () => {
      await expect(saveUser(null as unknown as ApiUser)).rejects.toThrow(
        "User is required"
      );
    });

    it("should save the user and return it from the database", async () => {
      const user: ApiUser = {
        id: 123,
        name: "John Doe",
        location: "New York",
        login: "johndoe",
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
      };

      const { id, ...props } = user;
      const formattedUser: UserToDb = {
        ...props,
        location: user.location.toLowerCase(),
        github_id: user.id,
        site_admin: !!user.site_admin,
        hireable: !!user.hireable,
        created_at: new Date(user.created_at),
        updated_at: new Date(user.updated_at),
      };

      const dbUser: UserFromDb = {
        ...formattedUser,
        id: 1,
        languages: ["javascript", "typescript"],
      };

      (saveUserRepo as jest.Mock).mockResolvedValueOnce(undefined);
      (getUsersRepo as jest.Mock).mockResolvedValueOnce([dbUser]);

      const result = await saveUser(user);

      expect(saveUserRepo).toHaveBeenCalledWith(formattedUser);
      expect(getUsersRepo).toHaveBeenCalledWith({ login: user.login });
      expect(result).toEqual([dbUser]);
    });

    it("should throw an error if saving user to database fails", async () => {
      const user: ApiUser = {
        id: 123,
        name: "John Doe",
        location: "New York",
        login: "johndoe",
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
      };

      const errorMessage = "Failed to save user to database";

      (saveUserRepo as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage)
      );

      await expect(saveUser(user)).rejects.toThrow(errorMessage);
    });
  });

  describe("getUsers", () => {
    it("should retrieve users based on the specified conditions", async () => {
      const users: Array<UserFromDb> = [
        {
          id: 1,
          name: "John Doe",
          location: "new york",
          login: "johndoe",
          github_id: 123,
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
        },
      ];

      (getUsersRepo as jest.Mock).mockResolvedValueOnce(users);

      const result = await getUsers({ location: "new york" });

      expect(getUsersRepo).toHaveBeenCalledWith({ location: "new york" });
      expect(result).toEqual(users);
    });

    it("should return an empty array if no users are found", async () => {
      (getUsersRepo as jest.Mock).mockResolvedValueOnce([]);

      const result = await getUsers({ location: "non-existent location" });

      expect(getUsersRepo).toHaveBeenCalledWith({
        location: "non-existent location",
      });
      expect(result).toEqual([]);
    });
  });
});
