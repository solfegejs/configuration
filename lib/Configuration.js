module.exports = class Configuration {
  constructor() {
    this.store = {};
    this.resolveProperties = this.resolveProperties.bind(this);
  }

  addProperties(properties) {
    if (properties instanceof Object === false) {
      throw new TypeError("Properties should be an object");
    }

    this.store = this.merge(this.store, properties);

    for (let i = 0; i < 100; i++) {
      let dependencyCount = this.resolveProperties(this.store);
      if (dependencyCount === 0) {
        return;
      }
    }

    throw new Error("Recursion in configuration detected");
  }

  set(propertyName, value) {
    const nameType = typeof propertyName;
    if (nameType !== "string") {
      throw new TypeError(`Property name should be a string, invalid type: ${nameType}`);
    }

    this.addProperties({ [propertyName]: value });
  }

  get(propertyName) {
    // Find the property value
    let propertyValue = undefined;
    let propertySplittedName = propertyName.split(".");
    let property = this.store;
    for (let name of propertySplittedName) {
      if (typeof property !== "object" || !property.hasOwnProperty(name)) {
        return undefined;
      }
      property = property[name];
      propertyValue = property;
    }

    return propertyValue;
  }

  resolvePropertyValue(value) {
    if (typeof value !== "string") {
      return value;
    }

    // If the value contains only 1 property, then I replace it with the property value
    // Otherwise, the value stays a string and the properties are replaced
    let resolvedValue;
    let singlePropertyMatched = value.match(/^%([^%]+)%$/);
    if (Array.isArray(singlePropertyMatched)) {
      let propertyName = singlePropertyMatched[1];
      resolvedValue = this.get(propertyName);
    } else {
      resolvedValue = value.replace(/%([^%]+)%/g, (match, propertyName) => {
        let propertyValue = this.get(propertyName);
        if (propertyValue === undefined) {
          return "";
        }

        return propertyValue;
      });
    }

    // Check number
    let numberCast = Number(resolvedValue);
    if (numberCast == resolvedValue) {
      return numberCast;
    }

    return resolvedValue;
  }

  resolveProperties(store) {
    let dependencyCount = 0;

    for (let key in store) {
      let item = store[key];

      if (typeof item === "object") {
        let subDependencyCount = this.resolveProperties(item);
        dependencyCount += subDependencyCount;
        continue;
      }

      let resolvedValue = this.resolvePropertyValue(item);
      if (this.propertyHasDependency(resolvedValue)) {
        dependencyCount++;
      } else {
        store[key] = resolvedValue;
      }
    }

    return dependencyCount;
  }

  propertyHasDependency(propertyValue) {
    if (typeof propertyValue !== "string") {
      return false;
    }

    let dependentPropertyNames = propertyValue.match(/%[^%]+%/g);
    if (!Array.isArray(dependentPropertyNames)) {
      return false;
    }

    return true;
  }

  merge(source, properties) {
    let result;

    if (Array.isArray(properties)) {
      result = [];
      source = source || [];

      // Copy source properties
      result = result.concat(source);

      // Merge new properties
      for (let key in properties) {
        let index = parseInt(key);
        let item = properties[index];

        if (typeof result[index] === "undefined") {
          // The index does not exist
          result[index] = item;
        } else if (typeof item === "object") {
          // The new property is an object
          result[index] = this.merge(source[index], item);
        } else if (source.indexOf(item) === -1) {
          // The new property is not in the list
          result.push(item);
        }
      }
    } else {
      result = {};

      // Copy source properties
      if (typeof source === "object") {
        for (let key in source) {
          result[key] = source[key];
        }
      }

      // Merge new properties
      for (let key in properties) {
        let item = properties[key];

        if (typeof result[key] === "undefined") {
          // The key does not exist
          result[key] = item;
        } else if (typeof item === "object") {
          // The new property is an object
          result[key] = this.merge(source[key], item);
        } else {
          // Override value
          result[key] = item;
        }
      }
    }

    return result;
  }

  inspect() {
    let output = "SolfegeJS/Configuration ";
    output += JSON.stringify(this.store, null, "  ");

    return output;
  }
};
