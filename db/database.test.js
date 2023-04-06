const io = require("../io"),
   { ProjectDatabase } = require("./database");

const fileHandlerMock = {
   read: async () =>
      '{"nextAvailableIndex":3,"projects":[{"index":0,"path":"/one","aliases":["f","o"]},{"index":1,"path":"/two","aliases":["b","a","r"]},{"index":2,"path":"/three","aliases":["foobar"]}]}',
   write: async (payload) => console.log({ payload }),
};

describe("ProjectDatabase", () => {
   const databaseConnection = new ProjectDatabase(fileHandlerMock);
   describe("_load", () => {
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
         parseDataSpy.mockClear();
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
         const writeFileSpy = jest.spyOn(
            databaseConnection.fileHandler,
            "write"
         );
         await databaseConnection._load();
         await databaseConnection._save();

         expect(writeFileSpy).toHaveBeenCalledTimes(1);
         writeFileSpy.mockClear();
      });
   });
   describe("fetchAll", () => {
      test("should return a ProjectCollection with the stored data", async () => {
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
      test("should return an Error if any of the given aliasas is already in use", async () => {
         const result = await databaseConnection.addProject("/", "1234", "f");
         expect(result.message).toBe("Aliases are taken");
      });
      test("should return an Error if the given path is already in use", async () => {
         const result = await databaseConnection.addProject("/one", "1234");
         expect(result.message).toBe("Aliases are taken");
      });
      test("should add a project if none of the identifiers are in use yet", async () => {
         const writeFileSpy = jest.spyOn(
            databaseConnection.fileHandler,
            "write"
         );
         const result = await databaseConnection.addProject("/", "1234");

         expect(result._projectDetails).toBeDefined;
         expect(writeFileSpy).toHaveBeenCalledTimes(1);

         writeFileSpy.mockClear();
      });
   });
   describe("removeProject", () => {
      test("should remove projects, save the state and return a collection of removed projects", async () => {
         const writeFileSpy = jest.spyOn(
            databaseConnection.fileHandler,
            "write"
         );
         const result = await databaseConnection.removeProject(
            0,
            1,
            "foobar",
            "non-existent"
         );

         expect(result.projects).toBeDefined();
         expect(result.projects.length).toBe(3);
         expect(writeFileSpy).toHaveBeenCalledTimes(1);

         writeFileSpy.mockClear();
      });
   });
});
