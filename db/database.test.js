const io = require("../io"),
   { ProjectDatabase } = require("./database");

describe("ProjectDatabase", () => {
   describe("_load", () => {
      const databaseFile = io.open(
         io.resolveRelativePath("./db/storage-fixture.json")
      );
      const databaseConnection = new ProjectDatabase(databaseFile);
      test("should load correctly from file", async () => {
         await databaseConnection._load();

         expect(databaseConnection._projectOrchestrator).toBeDefined();
         expect(databaseConnection._projectOrchestrator._projects.length).toBe(
            3
         );
      });
      test("should not load again once called", async () => {
         const parseDataSpy = jest.spyOn(
            databaseConnection.fileHandler,
            "read"
         );
         await databaseConnection._load();

         expect(parseDataSpy).not.toHaveBeenCalled();
      });
      test("should load with an empty Orchestrator when file can not be found", async () => {
         // This is when the app is initialized for the first time (no file is present in that case)
         const nonExistentDatabaseFile = io.open(
            io.resolveRelativePath("./foobar")
         );
         const emptyDatabase = new ProjectDatabase(nonExistentDatabaseFile);
         await emptyDatabase._load();

         expect(emptyDatabase._projectOrchestrator).toBeDefined();
         expect(emptyDatabase._projectOrchestrator._projects.length).toBe(0);
      });
   });
   describe("_save", () => {
      test("should write the current state to a file", async () => {
         const databaseFile = io.open(
            io.resolveRelativePath("./db/storage-fixture.json")
         );
         const databaseConnection = new ProjectDatabase(databaseFile);
         const writeFileSpy = jest.spyOn(
            databaseConnection.fileHandler,
            "write"
         );
         await databaseConnection._load();
         await databaseConnection._save();

         expect(writeFileSpy).toHaveBeenCalledTimes(1);
      });
   });
   describe("fetchAll", () => {
      test("should return a ProjectCollection with the stored data", async () => {
         const databaseFile = io.open(
            io.resolveRelativePath("./db/storage-fixture.json")
         );
         const databaseConnection = new ProjectDatabase(databaseFile);

         const result = await databaseConnection.fetchAll();
         expect(result.projects.length).toBe(3);
      });
      test("should return a ProjectCollection with the stored data", async () => {
         const databaseFile = io.open(io.resolveRelativePath("./foobar"));
         const databaseConnection = new ProjectDatabase(databaseFile);

         const result = await databaseConnection.fetchAll();
         expect(result.projects.length).toBe(0);
         expect(result.isEmpty()).toBe(true);
      });
   });
   describe("getExactProjectResultByIdentifier", () => {
      test("should return exact project result", async () => {
         const databaseFile = io.open(
            io.resolveRelativePath("./db/storage-fixture.json")
         );
         const databaseConnection = new ProjectDatabase(databaseFile);

         const getByPath =
            await databaseConnection.getExactProjectResultByIdentifier("/one");
         expect(getByPath.project).toBeDefined();

         const getByAlias =
            await databaseConnection.getExactProjectResultByIdentifier(
               "foobar"
            );
         expect(getByAlias.project).toBeDefined();

         const getByAutoAlias =
            await databaseConnection.getExactProjectResultByIdentifier("0");
         expect(getByAutoAlias.project).toBeDefined();
      });
      test("should throw if identifier can not be matched", async () => {
         const databaseFile = io.open(
            io.resolveRelativePath("./db/storage-fixture.json")
         );
         const databaseConnection = new ProjectDatabase(databaseFile);

         try {
            await databaseConnection.getExactProjectResultByIdentifier(
               "/very/wrong"
            );
         } catch (e) {
            expect(e.message).toBe(
               "Tried to fetch an exact project by a presumably existing identifier /very/wrong but could not find anything"
            );
         }
      });
   });
   describe("findBestMatch", () => {
      const databaseFile = io.open(
         io.resolveRelativePath("./db/storage-fixture.json")
      );
      const databaseConnection = new ProjectDatabase(databaseFile);
      test("should return exact match if possible", async () => {
         const result = await databaseConnection.findBestMatch("foobar");
         expect(result.project).toBeDefined();
      });
      test("should return matching projects if exact match is not possible", async () => {
         const result = await databaseConnection.findBestMatch("e");
         expect(result.projects.length).toBe(2);
      });
   });
   describe("addProject", () => {
      // => already taken error
      // => project suceess
      // Spy on io write
   });
});
