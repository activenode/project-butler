const { ProjectOrchestrator } = require("./projectOrchestrator");

describe("ProjectOrchestrator", () => {
   test("should initialize with given JSON data", () => {
      const projectOrchestrator = new ProjectOrchestrator(
         '{"nextAvailableIndex":3,"projects":[{"index":0,"path":"/one","aliases":["f","o"]},{"index":1,"path":"/two","aliases":["b","a","r"]},{"index":2,"path":"/three","aliases":["foobar"]}]}'
      );
      expect(projectOrchestrator._nextAvailableIndex).toBe(3);
      expect(projectOrchestrator._projects.length).toBe(3);
      expect(projectOrchestrator.getProject("f").getAliases()).toEqual([
         "0",
         "elk",
         "f",
         "o",
      ]);
   });
   describe("addProject", () => {
      test("should add a project with the given aliases and path to the list while ignoring already existing aliases and paths", () => {
         const projectOrchestrator = new ProjectOrchestrator();

         expect(
            projectOrchestrator.addProject("/home/user", "foo", "bar")
         ).toBeDefined();
         expect(projectOrchestrator._projects.length).toBe(1);
         expect(projectOrchestrator._projects[0].getAliases()).toContain("foo");
         expect(projectOrchestrator._projects[0].getAliases()).toContain("bar");
         expect(projectOrchestrator._projects[0].path).toBe("/home/user");

         expect(
            projectOrchestrator.addProject("/foo/bar", "ele", "phant")
         ).toBeDefined();
         expect(projectOrchestrator._projects.length).toBe(2);
         expect(projectOrchestrator._projects[1].getAliases()).toContain("ele");
         expect(projectOrchestrator._projects[1].getAliases()).toContain(
            "phant"
         );
         expect(projectOrchestrator._projects[1].path).toBe("/foo/bar");

         expect(projectOrchestrator.addProject("/foo/bar")).toBeUndefined();
         expect(projectOrchestrator._projects.length).toBe(2);

         expect(
            projectOrchestrator.addProject("/a/path", "ele")
         ).toBeUndefined();
         expect(projectOrchestrator._projects.length).toBe(2);
      });
   });

   describe("removeProject", () => {
      test("should do nothing and return undefined if project is not available", () => {
         const projectOrchestrator = new ProjectOrchestrator();

         expect(projectOrchestrator.removeProject("foo")).toBeUndefined();
      });
      test("should track the next available index, if the project comes before the current target index", () => {
         const projectOrchestrator = new ProjectOrchestrator();
         projectOrchestrator.addProject("/one", "foo");
         projectOrchestrator.addProject("/two", "bar");
         projectOrchestrator.addProject("/three", "foobar");

         expect(projectOrchestrator._nextAvailableIndex).toBe(3);
         expect(projectOrchestrator.removeProject("foo")).toBeDefined();
         expect(projectOrchestrator._nextAvailableIndex).toBe(0);
         expect(projectOrchestrator.removeProject("foobar")).toBeDefined();
         expect(projectOrchestrator._nextAvailableIndex).toBe(0);
      });
      test("should remove a given project", () => {
         const projectOrchestrator = new ProjectOrchestrator();
         projectOrchestrator.addProject("/one", "foo");
         projectOrchestrator.addProject("/two", "bar");
         projectOrchestrator.addProject("/three", "foobar");

         expect(projectOrchestrator.removeProject("foo")).toBeDefined();
         expect(projectOrchestrator.removeProject("foobar")).toBeDefined();
         expect(projectOrchestrator._projects.length).toBe(1);
      });
   });

   describe("getProject", () => {
      test("should do nothing and return undefined if project is not available", () => {
         const projectOrchestrator = new ProjectOrchestrator();

         expect(projectOrchestrator.getProject("foo")).toBeUndefined();
      });
      test("should return the project if it can be identified by its path", () => {
         const projectOrchestrator = new ProjectOrchestrator();
         projectOrchestrator.addProject("/one", "foo");
         projectOrchestrator.addProject("/two", "bar");
         projectOrchestrator.addProject("/three", "foobar");

         expect(projectOrchestrator.getProject("/one").getAliases()).toEqual([
            "0",
            "elk",
            "foo",
         ]);
      });
      test("should return the project if it can be identified by its alias", () => {
         const projectOrchestrator = new ProjectOrchestrator();
         projectOrchestrator.addProject("/one", "foo");
         projectOrchestrator.addProject("/two", "bar");
         projectOrchestrator.addProject("/three", "foobar");

         expect(projectOrchestrator.getProject("bar").getAliases()).toEqual([
            "1",
            "ant",
            "bar",
         ]);
      });
      test("should return the project if it can be identified by its auto alias", () => {
         const projectOrchestrator = new ProjectOrchestrator();
         projectOrchestrator.addProject("/one", "foo");

         expect(projectOrchestrator.getProject("0").getAliases()).toEqual([
            "0",
            "elk",
            "foo",
         ]);
      });
   });

   describe("updateProject", () => {
      test("should do nothing and return undefined if project is not available", () => {
         const projectOrchestrator = new ProjectOrchestrator();

         expect(projectOrchestrator.updateProject("foo")).toBeUndefined();
      });
      test("should update the project path if given", () => {
         const projectOrchestrator = new ProjectOrchestrator();
         projectOrchestrator.addProject("/one", "foo");
         projectOrchestrator.addProject("/two", "bar");
         projectOrchestrator.addProject("/three", "foobar");

         const source = projectOrchestrator.getProject("/one");
         const altered = projectOrchestrator.updateProject("/one", {
            path: "/foobar",
         });

         expect(projectOrchestrator._projects.length).toBe(3);
         expect(projectOrchestrator._projects.indexOf(altered)).toBe(0);
         expect(projectOrchestrator._projects.indexOf(source)).toBe(-1);
         expect(source.getAliases()).toEqual(altered.getAliases());
         expect(source.path).toBe("/one");
         expect(altered.path).toBe("/foobar");
      });
      test("should update the aliases if given", () => {
         const projectOrchestrator = new ProjectOrchestrator();
         projectOrchestrator.addProject("/one", "foo");
         projectOrchestrator.addProject("/two", "bar");
         projectOrchestrator.addProject("/three", "foobar");

         const source = projectOrchestrator.getProject("/two");
         const altered = projectOrchestrator.updateProject("/two", {
            aliases: ["new", "foo"],
         });

         expect(projectOrchestrator._projects.length).toBe(3);
         expect(projectOrchestrator._projects.indexOf(altered)).toBe(1);
         expect(projectOrchestrator._projects.indexOf(source)).toBe(-1);
         expect(source.getAliases()).toEqual(["1", "ant", "bar"]);
         expect(altered.getAliases()).toEqual(["1", "ant", "new", "foo"]);
         expect(altered.path).toEqual(source.path);
      });

      test("should update both, the aliases and the path if given", () => {
         const projectOrchestrator = new ProjectOrchestrator();
         projectOrchestrator.addProject("/one", "foo");
         projectOrchestrator.addProject("/two", "bar");
         projectOrchestrator.addProject("/three", "foobar");

         const source = projectOrchestrator.getProject("/three");
         const altered = projectOrchestrator.updateProject("/three", {
            aliases: ["new", "foo", "bar"],
            path: "/foobar",
         });

         expect(projectOrchestrator._projects.length).toBe(3);
         expect(projectOrchestrator._projects.indexOf(altered)).toBe(2);
         expect(projectOrchestrator._projects.indexOf(source)).toBe(-1);
         expect(source.getAliases()).toEqual(["2", "cow", "foobar"]);
         expect(altered.getAliases()).toEqual([
            "2",
            "cow",
            "new",
            "foo",
            "bar",
         ]);
         expect(source.path).toBe("/three");
         expect(altered.path).toBe("/foobar");
      });
   });

   describe("getJsonData", () => {
      test("should return a JSON string to construct projects from", () => {
         const projectOrchestrator = new ProjectOrchestrator();
         projectOrchestrator.addProject("/one", "f", "o", "o");
         projectOrchestrator.addProject("/two", "b", "a", "r");
         projectOrchestrator.addProject("/three", "foobar");

         expect(projectOrchestrator.getJsonData()).toBe(
            '{"nextAvailableIndex":3,"projects":[{"index":0,"path":"/one","aliases":["f","o"]},{"index":1,"path":"/two","aliases":["b","a","r"]},{"index":2,"path":"/three","aliases":["foobar"]}]}'
         );
      });
   });

   describe("getProjectsByFragment", () => {
      const projectOrchestrator = new ProjectOrchestrator();
      projectOrchestrator.addProject("/one", "f", "o", "o");
      projectOrchestrator.addProject("/two", "b", "a", "r");
      projectOrchestrator.addProject("/three", "foobar");
      projectOrchestrator.addProject("/four", "bar");

      test("should return a list of projects if the given fragment can be macthed", () => {
         expect(projectOrchestrator.getProjectsByFragment("f").length).toBe(3);
         expect(projectOrchestrator.getProjectsByFragment("fo").length).toBe(2);
         expect(
            projectOrchestrator.getProjectsByFragment("foobar").length
         ).toBe(1);
      });

      test("should return an empty array if the given fragment can not be matched", () => {
         expect(projectOrchestrator.getProjectsByFragment("420")).toEqual([]);
      });
   });

   describe("_updateNextAvailableIndex", () => {
      const projectOrchestrator = new ProjectOrchestrator();
      projectOrchestrator._nextAvailableIndex = 1;
      projectOrchestrator._projects = [
         {
            index: 0,
         },
         {
            index: 1,
         },
         {
            index: 3,
         },
         {
            index: 8,
         },
         {
            index: 4,
         },
      ];
      test("should find the next available index", () => {
         projectOrchestrator._updateNextAvailableIndex();
         expect(projectOrchestrator._nextAvailableIndex).toBe(2);
         projectOrchestrator._updateNextAvailableIndex();
         expect(projectOrchestrator._nextAvailableIndex).toBe(5);
         projectOrchestrator._updateNextAvailableIndex();
         expect(projectOrchestrator._nextAvailableIndex).toBe(6);
      });
   });

   describe("_returnAndUpdateNextAvailableIndex", () => {
      const projectOrchestrator = new ProjectOrchestrator();
      projectOrchestrator._projects = [
         {
            index: 0,
         },
         {
            index: 1,
         },
         {
            index: 3,
         },
      ];
      test("should find the next available index", () => {
         expect(projectOrchestrator._returnAndUpdateNextAvailableIndex()).toBe(
            0
         );
         expect(projectOrchestrator._nextAvailableIndex).toBe(2);
      });
   });
});
