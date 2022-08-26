const autoAliasFactory = require("./autoAliasFactory");

describe("autoAliasFactory", () => {
   test("should return the first word with no prefix if index is 0", () => {
      const result = autoAliasFactory.generateAutoAliasesForIndex(0);
      expect(result).toEqual(["0", "elk"]);
   });
});
