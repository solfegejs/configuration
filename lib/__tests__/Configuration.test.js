const util = require("util");
const Configuration = require("../Configuration");

describe("Configuration", () => {
  let config;
  beforeEach(() => {
    config = new Configuration();
  });

  describe("set()", () => {
    it("should set a property", () => {
      const value = Symbol();
      config.set("foo", value);

      expect(config.get("foo")).toBe(value);
    });

    it("should fail if the property is not a string", () => {
      expect(() => {
        config.set(Symbol(), Symbol());
      }).toThrow(TypeError);
    });
  });

  describe("addProperties()", () => {
    it("should add properties", () => {
      const value = Symbol();
      const properties = {
        foo: "bar",
        plop: value
      };

      config.addProperties(properties);
      expect(config.get("foo")).toBe("bar");
      expect(config.get("plop")).toBe(value);
    });

    it("should throw an error if the argument is not an object", () => {
      let properties = Symbol();
      expect(() => {
        config.addProperties(properties);
      }).toThrow(TypeError);
    });

    it("should override properties", () => {
      config.addProperties({
        foo: "bar",
        tic: 42
      });
      config.addProperties({
        tic: 1337
      });

      expect(config.get("foo")).toEqual("bar");
      expect(config.get("tic")).toEqual(1337);
    });

    it("should merge objects", () => {
      config.addProperties({
        a: {
          b: {
            foo: "bar"
          },
          c: 42
        }
      });
      config.addProperties({
        a: {
          b: {
            tic: "tac"
          }
        }
      });

      expect(config.get("a.b.foo")).toEqual("bar");
      expect(config.get("a.b.tic")).toEqual("tac");
      expect(config.get("a.c")).toEqual(42);
    });

    it("should merge arrays", () => {
      config.addProperties({
        a: ["tic", "tac"]
      });
      config.addProperties({
        a: ["toc"]
      });

      expect(config.get("a")).toEqual(["tic", "tac", "toc"]);
    });

    it("should merge object in array", () => {
      config.addProperties({
        a: [
          {
            foo: "bar"
          }
        ]
      });
      config.addProperties({
        a: [
          {
            tic: "tac"
          },
          42
        ]
      });

      expect(config.get("a")).toEqual([{ foo: "bar", tic: "tac" }, 42]);
    });

    it("should merge object in array", () => {
      const a = Symbol();
      const b = Symbol();

      config.addProperties({
        foo: [[a]]
      });
      config.addProperties({
        foo: [[b]]
      });

      expect(config.get("foo")).toEqual([[a, b]]);
    });

    it("should resolve dependencies", () => {
      config.addProperties({
        foo: "bar"
      });
      config.addProperties({
        tic: "%foo%"
      });

      expect(config.get("tic")).toEqual("bar");
    });

    it("should resolve deep dependencies", () => {
      config.addProperties({
        foo: "bar"
      });
      config.addProperties({
        tac: "%tic%",
        tic: "%foo%"
      });

      expect(config.get("tac")).toEqual("bar");
    });

    it("should throw an error if infinite recursion is detected", () => {
      expect(() => {
        config.addProperties({
          a: "%b%",
          b: "%c%",
          c: "%a%"
        });
      }).toThrow(Error);
    });
  });

  describe("get()", () => {
    it("should retrieve parameter previously set", () => {
      config.set("foo", "bar");
      expect(config.get("foo")).toEqual("bar");
    });

    it("should retrieve attribute of an object", () => {
      config.addProperties({
        foo: {
          bar: 42
        }
      });
      expect(config.get("foo.bar")).toEqual(42);
    });

    it("should return undefined if the value does not exists", () => {
      expect(config.get("foo")).toBeUndefined();
    });
  });

  describe("propertyHasDependency()", () => {
    it("should return false if the value is not a string", () => {
      const fooHasDependency = config.propertyHasDependency(42);
      expect(fooHasDependency).toBe(false);
    });

    it("should return fase if the property has no dependency", () => {
      const fooHasDependency = config.propertyHasDependency("foo");
      expect(fooHasDependency).toBe(false);
    });

    it("should return true if the property has a direct dependency", () => {
      const fooHasDependency = config.propertyHasDependency("%foo%");
      expect(fooHasDependency).toBe(true);
    });
  });

  describe("resolvePropertyValue()", () => {
    it("should resolve number", () => {
      config.addProperties({
        foo: 42
      });

      const resolved = config.resolvePropertyValue("%foo%");
      expect(resolved).toEqual(42);
    });

    it("should resolve string", () => {
      config.addProperties({
        foo: "bar"
      });

      const resolved = config.resolvePropertyValue("%foo%");
      expect(resolved).toEqual("bar");
    });

    it("should resolve composed string", () => {
      config.addProperties({
        foo: "bar",
        tic: "tac"
      });

      const resolved = config.resolvePropertyValue("%foo%/%tic%");
      expect(resolved).toEqual("bar/tac");
    });

    it("should resolve undefined value", () => {
      config.addProperties({
        foo: undefined,
        tic: "tac"
      });

      const resolved = config.resolvePropertyValue("%foo%/%tic%");
      expect(resolved).toEqual("/tac");
    });
  });

  describe("inspect()", () => {
    it("should return string output of the inspection", () => {
      const output = util.inspect(config);

      expect(output).toEqual("SolfegeJS/Configuration {}");
    });

    it("should return string output with some properties", () => {
      config.addProperties({
        foo: "bar",
        tic: "%foo%"
      });
      const output = util.inspect(config);

      expect(output).toEqual('SolfegeJS/Configuration {\n  "foo": "bar",\n  "tic": "bar"\n}');
    });
  });
});
