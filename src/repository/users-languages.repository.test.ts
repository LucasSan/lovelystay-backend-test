import { saveUserLanguage } from "../repository/users-languages.repository";
import getConnection from "../database/db";

jest.mock("../database/db");

describe("saveUserLanguage", () => {
  const mockDb = {
    none: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    (getConnection as jest.Mock).mockReturnValue(mockDb);
  });

  it("should save user languages to the database", async () => {
    const userId = 1;
    const userRepos = new Set(["javascript", "typescript"]);

    await saveUserLanguage(userId, userRepos);

    expect(mockDb.none).toHaveBeenCalledTimes(2);
    expect(mockDb.none).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO api.users_languages"),
      [userId, "javascript"]
    );
    expect(mockDb.none).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO api.users_languages"),
      [userId, "typescript"]
    );
  });

  it("should throw an error if user repos are not found", async () => {
    const userId = 1;
    const userRepos = new Set([]);

    await expect(saveUserLanguage(userId, userRepos)).rejects.toThrow(
      "User repos not found"
    );

    expect(mockDb.none).not.toHaveBeenCalled();
  });

  it("should throw an error if database operation fails", async () => {
    const userId = 1;
    const userRepos = new Set(["javascript"]);

    mockDb.none.mockRejectedValueOnce(new Error("Database error"));

    await expect(saveUserLanguage(userId, userRepos)).rejects.toThrow(
      "Failed to add language to the database"
    );

    expect(mockDb.none).toHaveBeenCalledTimes(1);
    expect(mockDb.none).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO api.users_languages"),
      [userId, "javascript"]
    );
  });
});
