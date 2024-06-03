import axios from "axios";
import {
  getUserFromGithub,
  getUserRepositoriesFromGithub,
} from "../services/github-api.service";
import { ApiUser } from "../models/user";

jest.mock("axios");

describe("getUserFromGithub", () => {
  it("should fetch user data from GitHub", async () => {
    const mockApiUser: ApiUser = {
      name: "John Doe",
      location: "New York",
      login: "johndoe",
      id: 12345,
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

    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockApiUser });

    const result = await getUserFromGithub("johndoe");

    expect(axios.get).toHaveBeenCalledWith(
      `${process.env.BASE_API_URL}/johndoe`
    );
    expect(result).toEqual(mockApiUser);
  });

  it("should throw an error if username is not provided", async () => {
    await expect(getUserFromGithub("")).rejects.toThrow("Username is required");
  });

  it("should throw an error if user is not found on GitHub", async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error("User not found"));

    await expect(getUserFromGithub("invaliduser")).rejects.toThrow(
      "User not found on GitHub"
    );
  });
});

describe("getUserRepositoriesFromGithub", () => {
  it("should fetch user repositories from GitHub", async () => {
    const mockRepos = [
      { language: "javascript" },
      { language: "typescript" },
      { language: null },
    ];

    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockRepos });

    const result = await getUserRepositoriesFromGithub("johndoe");

    expect(axios.get).toHaveBeenCalledWith(
      `${process.env.BASE_API_URL}/johndoe/repos`
    );
    expect(result).toEqual(new Set(["javascript", "typescript"]));
  });

  it("should throw an error if username is not provided", async () => {
    await expect(getUserRepositoriesFromGithub("")).rejects.toThrow(
      "Username is required"
    );
  });

  it("should throw an error if repository not found on GitHub", async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: [] });

    await expect(getUserRepositoriesFromGithub("johndoe")).rejects.toThrow(
      "User repositories not found"
    );
  });

  it("should throw an error if GitHub API call fails", async () => {
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error("API error"));

    await expect(getUserRepositoriesFromGithub("johndoe")).rejects.toThrow(
      "User repositories not found"
    );
  });
});
