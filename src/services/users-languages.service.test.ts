import {
  saveUserLanguage as saveUserLanguageRepo
} from "../repository/users-languages.repository";
import { saveUserLanguage } from "../services/users-languages.service";

jest.mock("../repository/users-languages.repository");

describe("saveUserLanguage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call saveUserLanguage with the correct arguments", async () => {
    const userId = 1;
    const userRepos = new Set(["javascript", "typescript"]);

    await saveUserLanguage(userId, userRepos);

    expect(saveUserLanguageRepo).toHaveBeenCalledWith(userId, userRepos);
  });

  it("should throw an error if saveUserLanguage throws an error", async () => {
    const userId = 1;
    const userRepos = new Set(["javascript", "typescript"]);
    const errorMessage = "Database error";

    (saveUserLanguageRepo as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    await expect(saveUserLanguage(userId, userRepos)).rejects.toThrow(
      errorMessage
    );
  });
});
