

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.reifuuPluginCore = {}));
})(this, (function (exports) { 'use strict';

  var __defProp$1 = Object.defineProperty;
  var __name$1 = (target, value) => __defProp$1(target, "name", { value, configurable: true });

  // packages/cosmokit/src/misc.ts
  function noop() {
  }
  __name$1(noop, "noop");
  function isNullable(value) {
    return value === null || value === void 0;
  }
  __name$1(isNullable, "isNullable");
  function isPlainObject(data) {
    return data && typeof data === "object" && !Array.isArray(data);
  }
  __name$1(isPlainObject, "isPlainObject");
  function filterKeys(object, filter) {
    return Object.fromEntries(Object.entries(object).filter(([key, value]) => filter(key, value)));
  }
  __name$1(filterKeys, "filterKeys");
  function mapValues(object, transform) {
    return Object.fromEntries(Object.entries(object).map(([key, value]) => [key, transform(value, key)]));
  }
  __name$1(mapValues, "mapValues");
  function is(type, value) {
    if (arguments.length === 1)
      return (value2) => is(type, value2);
    return type in globalThis && value instanceof globalThis[type] || Object.prototype.toString.call(value).slice(8, -1) === type;
  }
  __name$1(is, "is");
  function clone(source) {
    if (!source || typeof source !== "object")
      return source;
    if (Array.isArray(source))
      return source.map(clone);
    if (is("Date", source))
      return new Date(source.valueOf());
    if (is("RegExp", source))
      return new RegExp(source.source, source.flags);
    return mapValues(source, clone);
  }
  __name$1(clone, "clone");
  function deepEqual(a, b, strict) {
    if (a === b)
      return true;
    if (!strict && isNullable(a) && isNullable(b))
      return true;
    if (typeof a !== typeof b)
      return false;
    if (typeof a !== "object")
      return false;
    if (!a || !b)
      return false;
    function check(test, then) {
      return test(a) ? test(b) ? then(a, b) : false : test(b) ? false : void 0;
    }
    __name$1(check, "check");
    return check(Array.isArray, (a2, b2) => a2.length === b2.length && a2.every((item, index) => deepEqual(item, b2[index]))) ?? check(is("Date"), (a2, b2) => a2.valueOf() === b2.valueOf()) ?? check(is("RegExp"), (a2, b2) => a2.source === b2.source && a2.flags === b2.flags) ?? Object.keys({ ...a, ...b }).every((key) => deepEqual(a[key], b[key], strict));
  }
  __name$1(deepEqual, "deepEqual");
  function pick(source, keys, forced) {
    if (!keys)
      return { ...source };
    const result = {};
    for (const key of keys) {
      if (forced || source[key] !== void 0)
        result[key] = source[key];
    }
    return result;
  }
  __name$1(pick, "pick");
  function omit(source, keys) {
    if (!keys)
      return { ...source };
    const result = { ...source };
    for (const key of keys) {
      Reflect.deleteProperty(result, key);
    }
    return result;
  }
  __name$1(omit, "omit");
  function defineProperty(object, key, value) {
    return Object.defineProperty(object, key, { writable: true, value, enumerable: false });
  }
  __name$1(defineProperty, "defineProperty");

  // packages/cosmokit/src/array.ts
  function contain(array1, array2) {
    return array2.every((item) => array1.includes(item));
  }
  __name$1(contain, "contain");
  function intersection(array1, array2) {
    return array1.filter((item) => array2.includes(item));
  }
  __name$1(intersection, "intersection");
  function difference(array1, array2) {
    return array1.filter((item) => !array2.includes(item));
  }
  __name$1(difference, "difference");
  function union(array1, array2) {
    return Array.from(/* @__PURE__ */ new Set([...array1, ...array2]));
  }
  __name$1(union, "union");
  function deduplicate(array) {
    return [...new Set(array)];
  }
  __name$1(deduplicate, "deduplicate");
  function remove(list, item) {
    const index = list.indexOf(item);
    if (index >= 0) {
      list.splice(index, 1);
      return true;
    } else {
      return false;
    }
  }
  __name$1(remove, "remove");
  function makeArray(source) {
    return Array.isArray(source) ? source : isNullable(source) ? [] : [source];
  }
  __name$1(makeArray, "makeArray");

  // packages/cosmokit/src/binary.ts
  function arrayBufferToBase64(buffer) {
    if (typeof Buffer !== "undefined") {
      return Buffer.from(buffer).toString("base64");
    }
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
  __name$1(arrayBufferToBase64, "arrayBufferToBase64");
  function base64ToArrayBuffer(base64) {
    if (typeof Buffer !== "undefined") {
      const buf = Buffer.from(base64, "base64");
      return new Uint8Array(buf.buffer, buf.byteOffset, buf.length);
    }
    const binary = atob(base64.replace(/\s/g, ""));
    const buffer = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      buffer[i] = binary.charCodeAt(i);
    }
    return buffer;
  }
  __name$1(base64ToArrayBuffer, "base64ToArrayBuffer");

  // packages/cosmokit/src/string.ts
  function capitalize(source) {
    return source.charAt(0).toUpperCase() + source.slice(1);
  }
  __name$1(capitalize, "capitalize");
  function uncapitalize(source) {
    return source.charAt(0).toLowerCase() + source.slice(1);
  }
  __name$1(uncapitalize, "uncapitalize");
  function camelCase(source) {
    return source.replace(/[_-][a-z]/g, (str) => str.slice(1).toUpperCase());
  }
  __name$1(camelCase, "camelCase");
  function paramCase(source) {
    return uncapitalize(source).replace(/_/g, "-").replace(/.[A-Z]+/g, (str) => str[0] + "-" + str.slice(1).toLowerCase());
  }
  __name$1(paramCase, "paramCase");
  function snakeCase(source) {
    return uncapitalize(source).replace(/-/g, "_").replace(/.[A-Z]+/g, (str) => str[0] + "_" + str.slice(1).toLowerCase());
  }
  __name$1(snakeCase, "snakeCase");
  function trimSlash(source) {
    return source.replace(/\/$/, "");
  }
  __name$1(trimSlash, "trimSlash");
  function sanitize(source) {
    if (!source.startsWith("/"))
      source = "/" + source;
    return trimSlash(source);
  }
  __name$1(sanitize, "sanitize");

  // packages/cosmokit/src/time.ts
  var Time;
  ((Time2) => {
    Time2.millisecond = 1;
    Time2.second = 1e3;
    Time2.minute = Time2.second * 60;
    Time2.hour = Time2.minute * 60;
    Time2.day = Time2.hour * 24;
    Time2.week = Time2.day * 7;
    let timezoneOffset = (/* @__PURE__ */ new Date()).getTimezoneOffset();
    function setTimezoneOffset(offset) {
      timezoneOffset = offset;
    }
    Time2.setTimezoneOffset = setTimezoneOffset;
    __name$1(setTimezoneOffset, "setTimezoneOffset");
    function getTimezoneOffset() {
      return timezoneOffset;
    }
    Time2.getTimezoneOffset = getTimezoneOffset;
    __name$1(getTimezoneOffset, "getTimezoneOffset");
    function getDateNumber(date = /* @__PURE__ */ new Date(), offset) {
      if (typeof date === "number")
        date = new Date(date);
      if (offset === void 0)
        offset = timezoneOffset;
      return Math.floor((date.valueOf() / Time2.minute - offset) / 1440);
    }
    Time2.getDateNumber = getDateNumber;
    __name$1(getDateNumber, "getDateNumber");
    function fromDateNumber(value, offset) {
      const date = new Date(value * Time2.day);
      if (offset === void 0)
        offset = timezoneOffset;
      return new Date(+date + offset * Time2.minute);
    }
    Time2.fromDateNumber = fromDateNumber;
    __name$1(fromDateNumber, "fromDateNumber");
    const numeric = /\d+(?:\.\d+)?/.source;
    const timeRegExp = new RegExp(`^${[
    "w(?:eek(?:s)?)?",
    "d(?:ay(?:s)?)?",
    "h(?:our(?:s)?)?",
    "m(?:in(?:ute)?(?:s)?)?",
    "s(?:ec(?:ond)?(?:s)?)?"
  ].map((unit) => `(${numeric}${unit})?`).join("")}$`);
    function parseTime(source) {
      const capture = timeRegExp.exec(source);
      if (!capture)
        return 0;
      return (parseFloat(capture[1]) * Time2.week || 0) + (parseFloat(capture[2]) * Time2.day || 0) + (parseFloat(capture[3]) * Time2.hour || 0) + (parseFloat(capture[4]) * Time2.minute || 0) + (parseFloat(capture[5]) * Time2.second || 0);
    }
    Time2.parseTime = parseTime;
    __name$1(parseTime, "parseTime");
    function parseDate(date) {
      const parsed = parseTime(date);
      if (parsed) {
        date = Date.now() + parsed;
      } else if (/^\d{1,2}(:\d{1,2}){1,2}$/.test(date)) {
        date = `${(/* @__PURE__ */ new Date()).toLocaleDateString()}-${date}`;
      } else if (/^\d{1,2}-\d{1,2}-\d{1,2}(:\d{1,2}){1,2}$/.test(date)) {
        date = `${(/* @__PURE__ */ new Date()).getFullYear()}-${date}`;
      }
      return date ? new Date(date) : /* @__PURE__ */ new Date();
    }
    Time2.parseDate = parseDate;
    __name$1(parseDate, "parseDate");
    function format(ms) {
      const abs = Math.abs(ms);
      if (abs >= Time2.day - Time2.hour / 2) {
        return Math.round(ms / Time2.day) + "d";
      } else if (abs >= Time2.hour - Time2.minute / 2) {
        return Math.round(ms / Time2.hour) + "h";
      } else if (abs >= Time2.minute - Time2.second / 2) {
        return Math.round(ms / Time2.minute) + "m";
      } else if (abs >= Time2.second) {
        return Math.round(ms / Time2.second) + "s";
      }
      return ms + "ms";
    }
    Time2.format = format;
    __name$1(format, "format");
    function toDigits(source, length = 2) {
      return source.toString().padStart(length, "0");
    }
    Time2.toDigits = toDigits;
    __name$1(toDigits, "toDigits");
    function template(template2, time = /* @__PURE__ */ new Date()) {
      return template2.replace("yyyy", time.getFullYear().toString()).replace("yy", time.getFullYear().toString().slice(2)).replace("MM", toDigits(time.getMonth() + 1)).replace("dd", toDigits(time.getDate())).replace("hh", toDigits(time.getHours())).replace("mm", toDigits(time.getMinutes())).replace("ss", toDigits(time.getSeconds())).replace("SSS", toDigits(time.getMilliseconds(), 3));
    }
    Time2.template = template;
    __name$1(template, "template");
  })(Time || (Time = {}));

  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var require_src = __commonJS({
    "packages/schemastery/packages/core/src/index.ts"(exports, module) {
      var kSchema = Symbol.for("schemastery");
      globalThis.__schemastery_index__ ??= 0;
      var Schema = /* @__PURE__ */ __name(function(options) {
        const schema = /* @__PURE__ */ __name(function(data, options2) {
          return Schema.resolve(data, schema, options2)[0];
        }, "schema");
        if (options.refs) {
          const refs2 = mapValues(options.refs, (options2) => new Schema(options2));
          const getRef = /* @__PURE__ */ __name((uid) => refs2[uid], "getRef");
          for (const key in refs2) {
            const options2 = refs2[key];
            options2.sKey = getRef(options2.sKey);
            options2.inner = getRef(options2.inner);
            options2.list = options2.list && options2.list.map(getRef);
            options2.dict = options2.dict && mapValues(options2.dict, getRef);
          }
          return refs2[options.uid];
        }
        Object.assign(schema, options);
        if (typeof schema.callback === "string") {
          try {
            schema.callback = new Function("return " + schema.callback)();
          } catch {
          }
        }
        Object.defineProperty(schema, "uid", { value: globalThis.__schemastery_index__++ });
        Object.setPrototypeOf(schema, Schema.prototype);
        schema.meta ||= {};
        schema.toString = schema.toString.bind(schema);
        return schema;
      }, "Schema");
      Schema.prototype = Object.create(Function.prototype);
      Schema.prototype[kSchema] = true;
      var refs;
      Schema.prototype.toJSON = /* @__PURE__ */ __name(function toJSON() {
        if (refs) {
          refs[this.uid] ??= JSON.parse(JSON.stringify({ ...this }));
          return this.uid;
        }
        refs = { [this.uid]: { ...this } };
        refs[this.uid] = JSON.parse(JSON.stringify({ ...this }));
        const result = { uid: this.uid, refs };
        refs = void 0;
        return result;
      }, "toJSON");
      Schema.prototype.set = /* @__PURE__ */ __name(function set(key, value) {
        this.dict[key] = value;
        return this;
      }, "set");
      Schema.prototype.push = /* @__PURE__ */ __name(function push(value) {
        this.list.push(value);
        return this;
      }, "push");
      function mergeDesc(original, messages) {
        const result = typeof original === "string" ? { "": original } : { ...original };
        for (const locale in messages) {
          const value = messages[locale];
          if (value?.$description || value?.$desc) {
            result[locale] = value.$description || value.$desc;
          } else if (typeof value === "string") {
            result[locale] = value;
          }
        }
        return result;
      }
      __name(mergeDesc, "mergeDesc");
      function getInner(value) {
        return value?.$value ?? value?.$inner;
      }
      __name(getInner, "getInner");
      function extractKeys(data) {
        return Object.fromEntries(Object.entries(data ?? {}).filter(([key]) => !key.startsWith("$")));
      }
      __name(extractKeys, "extractKeys");
      Schema.prototype.i18n = /* @__PURE__ */ __name(function i18n(messages) {
        const schema = Schema(this);
        schema.meta.description = mergeDesc(schema.meta.description, messages);
        if (schema.dict) {
          schema.dict = mapValues(schema.dict, (inner, key) => {
            return inner.i18n(mapValues(messages, (data) => getInner(data)?.[key] ?? data?.[key]));
          });
        }
        if (schema.list) {
          schema.list = schema.list.map((inner, index) => {
            return inner.i18n(mapValues(messages, (data = {}) => {
              if (Array.isArray(getInner(data)))
                return getInner(data)[index];
              if (Array.isArray(data))
                return data[index];
              return extractKeys(data);
            }));
          });
        }
        if (schema.inner) {
          schema.inner = schema.inner.i18n(mapValues(messages, (data) => {
            if (getInner(data))
              return getInner(data);
            return extractKeys(data);
          }));
        }
        if (schema.sKey) {
          schema.sKey = schema.sKey.i18n(mapValues(messages, (data) => data?.$key));
        }
        return schema;
      }, "i18n");
      Schema.prototype.extra = /* @__PURE__ */ __name(function extra(key, value) {
        const schema = Schema(this);
        schema.meta = { ...schema.meta, [key]: value };
        return schema;
      }, "extra");
      for (const key of ["required", "disabled", "collapse", "hidden", "loose"]) {
        Object.assign(Schema.prototype, {
          [key](value = true) {
            const schema = Schema(this);
            schema.meta = { ...schema.meta, [key]: value };
            return schema;
          }
        });
      }
      Schema.prototype.deprecated = /* @__PURE__ */ __name(function deprecated() {
        const schema = Schema(this);
        schema.meta.badges ||= [];
        schema.meta.badges.push({ text: "deprecated", type: "danger" });
        return schema;
      }, "deprecated");
      Schema.prototype.experimental = /* @__PURE__ */ __name(function experimental() {
        const schema = Schema(this);
        schema.meta.badges ||= [];
        schema.meta.badges.push({ text: "experimental", type: "warning" });
        return schema;
      }, "experimental");
      Schema.prototype.pattern = /* @__PURE__ */ __name(function pattern(regexp) {
        const schema = Schema(this);
        const pattern2 = pick(regexp, ["source", "flags"]);
        schema.meta = { ...schema.meta, pattern: pattern2 };
        return schema;
      }, "pattern");
      Schema.prototype.simplify = /* @__PURE__ */ __name(function simplify(value) {
        if (deepEqual(value, this.meta.default))
          return null;
        if (isNullable(value))
          return value;
        if (this.type === "object" || this.type === "dict") {
          const result = {};
          for (const key in value) {
            const schema = this.type === "object" ? this.dict[key] : this.inner;
            const item = schema?.simplify(value[key]);
            if (!isNullable(item))
              result[key] = item;
          }
          return result;
        } else if (this.type === "array" || this.type === "tuple") {
          const result = [];
          value.forEach((value2, index) => {
            const schema = this.type === "array" ? this.inner : this.list[index];
            const item = schema ? schema.simplify(value2) : value2;
            result.push(item);
          });
          return result;
        } else if (this.type === "intersect") {
          const result = {};
          for (const item of this.list) {
            Object.assign(result, item.simplify(value));
          }
          return result;
        } else if (this.type === "union") {
          for (const schema of this.list) {
            try {
              Schema.resolve(value, schema);
              return schema.simplify(value);
            } catch {
            }
          }
        }
        return value;
      }, "simplify");
      Schema.prototype.toString = /* @__PURE__ */ __name(function toString(inline) {
        return formatters[this.type]?.(this, inline) ?? `Schema<${this.type}>`;
      }, "toString");
      Schema.prototype.role = /* @__PURE__ */ __name(function role(role, extra) {
        const schema = Schema(this);
        schema.meta = { ...schema.meta, role, extra };
        return schema;
      }, "role");
      for (const key of ["default", "link", "comment", "description", "max", "min", "step"]) {
        Object.assign(Schema.prototype, {
          [key](value) {
            const schema = Schema(this);
            schema.meta = { ...schema.meta, [key]: value };
            return schema;
          }
        });
      }
      var resolvers = {};
      Schema.extend = /* @__PURE__ */ __name(function extend(type, resolve) {
        resolvers[type] = resolve;
      }, "extend");
      Schema.resolve = /* @__PURE__ */ __name(function resolve(data, schema, options = {}, strict = false) {
        if (!schema)
          return [data];
        if (isNullable(data)) {
          if (schema.meta.required)
            throw new TypeError(`missing required value`);
          let current = schema;
          let fallback = schema.meta.default;
          while (current?.type === "intersect" && isNullable(fallback)) {
            current = current.list[0];
            fallback = current?.meta.default;
          }
          if (isNullable(fallback))
            return [data];
          data = clone(fallback);
        }
        const callback = resolvers[schema.type];
        if (!callback)
          throw new TypeError(`unsupported type "${schema.type}"`);
        try {
          return callback(data, schema, options, strict);
        } catch (error) {
          if (!schema.meta.loose)
            throw error;
          return [schema.meta.default];
        }
      }, "resolve");
      Schema.from = /* @__PURE__ */ __name(function from(source) {
        if (isNullable(source)) {
          return Schema.any();
        } else if (["string", "number", "boolean"].includes(typeof source)) {
          return Schema.const(source).required();
        } else if (source[kSchema]) {
          return source;
        } else if (typeof source === "function") {
          switch (source) {
            case String:
              return Schema.string().required();
            case Number:
              return Schema.number().required();
            case Boolean:
              return Schema.boolean().required();
            case Function:
              return Schema.function().required();
            default:
              return Schema.is(source).required();
          }
        } else {
          throw new TypeError(`cannot infer schema from ${source}`);
        }
      }, "from");
      Schema.natural = /* @__PURE__ */ __name(function natural() {
        return Schema.number().step(1).min(0);
      }, "natural");
      Schema.percent = /* @__PURE__ */ __name(function percent() {
        return Schema.number().step(0.01).min(0).max(1).role("slider");
      }, "percent");
      Schema.date = /* @__PURE__ */ __name(function date() {
        return Schema.union([
          Schema.is(Date),
          Schema.transform(Schema.string().role("datetime"), (value) => {
            const date2 = new Date(value);
            if (isNaN(+date2))
              throw new TypeError(`invalid date "${value}"`);
            return date2;
          }, true)
        ]);
      }, "date");
      Schema.extend("any", (data) => {
        return [data];
      });
      Schema.extend("never", (data) => {
        throw new TypeError(`expected nullable but got ${data}`);
      });
      Schema.extend("const", (data, { value }) => {
        if (data === value)
          return [value];
        throw new TypeError(`expected ${value} but got ${data}`);
      });
      function checkWithinRange(data, meta, description) {
        const { max = Infinity, min = -Infinity } = meta;
        if (data > max)
          throw new TypeError(`expected ${description} <= ${max} but got ${data}`);
        if (data < min)
          throw new TypeError(`expected ${description} >= ${min} but got ${data}`);
      }
      __name(checkWithinRange, "checkWithinRange");
      Schema.extend("string", (data, { meta }) => {
        if (typeof data !== "string")
          throw new TypeError(`expected string but got ${data}`);
        if (meta.pattern) {
          const regexp = new RegExp(meta.pattern.source, meta.pattern.flags);
          if (!regexp.test(data))
            throw new TypeError(`expect string to match regexp ${regexp}`);
        }
        checkWithinRange(data.length, meta, "string length");
        return [data];
      });
      function decimalShift(data, digits) {
        const str = data.toString();
        if (str.includes("e"))
          return data * Math.pow(10, digits);
        const index = str.indexOf(".");
        if (index === -1)
          return data * Math.pow(10, digits);
        const frac = str.slice(index + 1);
        const integer = str.slice(0, index);
        if (frac.length <= digits)
          return +(integer + frac.padEnd(digits, "0"));
        return +(integer + frac.slice(0, digits) + "." + frac.slice(digits));
      }
      __name(decimalShift, "decimalShift");
      function isMultipleOf(data, min, step) {
        step = Math.abs(step);
        if (!/^\d+\.\d+$/.test(step.toString())) {
          return (data - min) % step === 0;
        }
        const index = step.toString().indexOf(".");
        const digits = step.toString().slice(index + 1).length;
        return Math.abs(decimalShift(data, digits) - decimalShift(min, digits)) % decimalShift(step, digits) === 0;
      }
      __name(isMultipleOf, "isMultipleOf");
      Schema.extend("number", (data, { meta }) => {
        if (typeof data !== "number")
          throw new TypeError(`expected number but got ${data}`);
        checkWithinRange(data, meta, "number");
        const { step } = meta;
        if (step && !isMultipleOf(data, meta.min ?? 0, step)) {
          throw new TypeError(`expected number multiple of ${step} but got ${data}`);
        }
        return [data];
      });
      Schema.extend("boolean", (data) => {
        if (typeof data === "boolean")
          return [data];
        throw new TypeError(`expected boolean but got ${data}`);
      });
      Schema.extend("bitset", (data, { bits, meta }) => {
        let value = 0, keys = [];
        if (typeof data === "number") {
          value = data;
          for (const key in bits) {
            if (data & bits[key]) {
              keys.push(key);
            }
          }
        } else if (Array.isArray(data)) {
          keys = data;
          for (const key of keys) {
            if (typeof key !== "string")
              throw new TypeError(`expected string but got ${key}`);
            if (key in bits)
              value |= bits[key];
          }
        } else {
          throw new TypeError(`expected number or array but got ${data}`);
        }
        if (value === meta.default)
          return [value];
        return [value, keys];
      });
      Schema.extend("function", (data) => {
        if (typeof data === "function")
          return [data];
        throw new TypeError(`expected function but got ${data}`);
      });
      Schema.extend("is", (data, { callback }) => {
        if (data instanceof callback)
          return [data];
        throw new TypeError(`expected ${callback.name} but got ${data}`);
      });
      function property(data, key, schema, options) {
        try {
          const [value, adapted] = Schema.resolve(data[key], schema, options);
          if (adapted !== void 0)
            data[key] = adapted;
          return value;
        } catch (e) {
          if (!options?.autofix)
            throw e;
          delete data[key];
          return schema.meta.default;
        }
      }
      __name(property, "property");
      Schema.extend("array", (data, { inner, meta }, options) => {
        if (!Array.isArray(data))
          throw new TypeError(`expected array but got ${data}`);
        checkWithinRange(data.length, meta, "array length");
        return [data.map((_, index) => property(data, index, inner, options))];
      });
      Schema.extend("dict", (data, { inner, sKey }, options, strict) => {
        if (!isPlainObject(data))
          throw new TypeError(`expected object but got ${data}`);
        const result = {};
        for (const key in data) {
          let rKey;
          try {
            rKey = Schema.resolve(key, sKey)[0];
          } catch (error) {
            if (strict)
              continue;
            throw error;
          }
          result[rKey] = property(data, key, inner, options);
          data[rKey] = data[key];
          if (key !== rKey)
            delete data[key];
        }
        return [result];
      });
      Schema.extend("tuple", (data, { list }, options, strict) => {
        if (!Array.isArray(data))
          throw new TypeError(`expected array but got ${data}`);
        const result = list.map((inner, index) => property(data, index, inner, options));
        if (strict)
          return [result];
        result.push(...data.slice(list.length));
        return [result];
      });
      function merge(result, data) {
        for (const key in data) {
          if (key in result)
            continue;
          result[key] = data[key];
        }
      }
      __name(merge, "merge");
      Schema.extend("object", (data, { dict }, options, strict) => {
        if (!isPlainObject(data))
          throw new TypeError(`expected object but got ${data}`);
        const result = {};
        for (const key in dict) {
          const value = property(data, key, dict[key], options);
          if (!isNullable(value) || key in data) {
            result[key] = value;
          }
        }
        if (!strict)
          merge(result, data);
        return [result];
      });
      Schema.extend("union", (data, { list, toString }, options, strict) => {
        for (const inner of list) {
          try {
            return Schema.resolve(data, inner, options, strict);
          } catch (error) {
          }
        }
        throw new TypeError(`expected ${toString()} but got ${JSON.stringify(data)}`);
      });
      Schema.extend("intersect", (data, { list, toString }, options, strict) => {
        let result;
        for (const inner of list) {
          const value = Schema.resolve(data, inner, options, true)[0];
          if (isNullable(value))
            continue;
          if (isNullable(result)) {
            result = value;
          } else if (typeof result !== typeof value) {
            throw new TypeError(`expected ${toString()} but got ${JSON.stringify(data)}`);
          } else if (typeof value === "object") {
            merge(result ??= {}, value);
          } else if (result !== value) {
            throw new TypeError(`expected ${toString()} but got ${JSON.stringify(data)}`);
          }
        }
        if (!strict && isPlainObject(data))
          merge(result, data);
        return [result];
      });
      Schema.extend("transform", (data, { inner, callback, preserve }, options) => {
        const [result, adapted = data] = Schema.resolve(data, inner, options, true);
        if (preserve) {
          return [callback(result)];
        } else {
          return [callback(result), callback(adapted)];
        }
      });
      var formatters = {};
      function defineMethod(name, keys, format) {
        formatters[name] = format;
        Object.assign(Schema, {
          [name](...args) {
            const schema = new Schema({ type: name });
            keys.forEach((key, index) => {
              switch (key) {
                case "sKey":
                  schema.sKey = args[index] ?? Schema.string();
                  break;
                case "inner":
                  schema.inner = Schema.from(args[index]);
                  break;
                case "list":
                  schema.list = args[index].map(Schema.from);
                  break;
                case "dict":
                  schema.dict = mapValues(args[index], Schema.from);
                  break;
                case "bits": {
                  schema.bits = {};
                  for (const key2 in args[index]) {
                    if (typeof args[index][key2] !== "number")
                      continue;
                    schema.bits[key2] = args[index][key2];
                  }
                  break;
                }
                case "callback": {
                  schema.callback = args[index];
                  schema.callback["toJSON"] ||= () => schema.callback.toString();
                  break;
                }
                default:
                  schema[key] = args[index];
              }
            });
            if (name === "object" || name === "dict") {
              schema.meta.default = {};
            } else if (name === "array" || name === "tuple") {
              schema.meta.default = [];
            } else if (name === "bitset") {
              schema.meta.default = 0;
            }
            return schema;
          }
        });
      }
      __name(defineMethod, "defineMethod");
      defineMethod("is", ["callback"], ({ callback }) => callback.name);
      defineMethod("any", [], () => "any");
      defineMethod("never", [], () => "never");
      defineMethod("const", ["value"], ({ value }) => typeof value === "string" ? JSON.stringify(value) : value);
      defineMethod("string", [], () => "string");
      defineMethod("number", [], () => "number");
      defineMethod("boolean", [], () => "boolean");
      defineMethod("bitset", ["bits"], () => "bitset");
      defineMethod("function", [], () => "function");
      defineMethod("array", ["inner"], ({ inner }) => `${inner.toString(true)}[]`);
      defineMethod("dict", ["inner", "sKey"], ({ inner, sKey }) => `{ [key: ${sKey.toString()}]: ${inner.toString()} }`);
      defineMethod("tuple", ["list"], ({ list }) => `[${list.map((inner) => inner.toString()).join(", ")}]`);
      defineMethod("object", ["dict"], ({ dict }) => {
        if (Object.keys(dict).length === 0)
          return "{}";
        return `{ ${Object.entries(dict).map(([key, inner]) => {
        return `${key}${inner.meta.required ? "" : "?"}: ${inner.toString()}`;
      }).join(", ")} }`;
      });
      defineMethod("union", ["list"], ({ list }, inline) => {
        const result = list.map(({ toString: format }) => format()).join(" | ");
        return inline ? `(${result})` : result;
      });
      defineMethod("intersect", ["list"], ({ list }) => {
        return `${list.map((inner) => inner.toString(true)).join(" & ")}`;
      });
      defineMethod("transform", ["inner", "callback", "preserve"], ({ inner }, isInner) => inner.toString(isInner));
      module.exports = Schema;
    }
  });
  var Schema = require_src();

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function getDefaultExportFromCjs (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  var md5$1 = {exports: {}};

  var crypt = {exports: {}};

  (function() {
    var base64map
        = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',

    crypt$1 = {
      // Bit-wise rotation left
      rotl: function(n, b) {
        return (n << b) | (n >>> (32 - b));
      },

      // Bit-wise rotation right
      rotr: function(n, b) {
        return (n << (32 - b)) | (n >>> b);
      },

      // Swap big-endian to little-endian and vice versa
      endian: function(n) {
        // If number given, swap endian
        if (n.constructor == Number) {
          return crypt$1.rotl(n, 8) & 0x00FF00FF | crypt$1.rotl(n, 24) & 0xFF00FF00;
        }

        // Else, assume array and swap all items
        for (var i = 0; i < n.length; i++)
          n[i] = crypt$1.endian(n[i]);
        return n;
      },

      // Generate an array of any length of random bytes
      randomBytes: function(n) {
        for (var bytes = []; n > 0; n--)
          bytes.push(Math.floor(Math.random() * 256));
        return bytes;
      },

      // Convert a byte array to big-endian 32-bit words
      bytesToWords: function(bytes) {
        for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
          words[b >>> 5] |= bytes[i] << (24 - b % 32);
        return words;
      },

      // Convert big-endian 32-bit words to a byte array
      wordsToBytes: function(words) {
        for (var bytes = [], b = 0; b < words.length * 32; b += 8)
          bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
        return bytes;
      },

      // Convert a byte array to a hex string
      bytesToHex: function(bytes) {
        for (var hex = [], i = 0; i < bytes.length; i++) {
          hex.push((bytes[i] >>> 4).toString(16));
          hex.push((bytes[i] & 0xF).toString(16));
        }
        return hex.join('');
      },

      // Convert a hex string to a byte array
      hexToBytes: function(hex) {
        for (var bytes = [], c = 0; c < hex.length; c += 2)
          bytes.push(parseInt(hex.substr(c, 2), 16));
        return bytes;
      },

      // Convert a byte array to a base-64 string
      bytesToBase64: function(bytes) {
        for (var base64 = [], i = 0; i < bytes.length; i += 3) {
          var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
          for (var j = 0; j < 4; j++)
            if (i * 8 + j * 6 <= bytes.length * 8)
              base64.push(base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
            else
              base64.push('=');
        }
        return base64.join('');
      },

      // Convert a base-64 string to a byte array
      base64ToBytes: function(base64) {
        // Remove non-base-64 characters
        base64 = base64.replace(/[^A-Z0-9+\/]/ig, '');

        for (var bytes = [], i = 0, imod4 = 0; i < base64.length;
            imod4 = ++i % 4) {
          if (imod4 == 0) continue;
          bytes.push(((base64map.indexOf(base64.charAt(i - 1))
              & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2))
              | (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
        }
        return bytes;
      }
    };

    crypt.exports = crypt$1;
  })();

  var cryptExports = crypt.exports;

  var charenc = {
    // UTF-8 encoding
    utf8: {
      // Convert a string to a byte array
      stringToBytes: function(str) {
        return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
      },

      // Convert a byte array to a string
      bytesToString: function(bytes) {
        return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
      }
    },

    // Binary encoding
    bin: {
      // Convert a string to a byte array
      stringToBytes: function(str) {
        for (var bytes = [], i = 0; i < str.length; i++)
          bytes.push(str.charCodeAt(i) & 0xFF);
        return bytes;
      },

      // Convert a byte array to a string
      bytesToString: function(bytes) {
        for (var str = [], i = 0; i < bytes.length; i++)
          str.push(String.fromCharCode(bytes[i]));
        return str.join('');
      }
    }
  };

  var charenc_1 = charenc;

  /*!
   * Determine if an object is a Buffer
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   */

  // The _isBuffer check is for Safari 5-7 support, because it's missing
  // Object.prototype.constructor. Remove this eventually
  var isBuffer_1 = function (obj) {
    return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
  };

  function isBuffer (obj) {
    return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
  }

  // For Node v0.10 support. Remove this eventually.
  function isSlowBuffer (obj) {
    return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
  }

  (function(){
    var crypt = cryptExports,
        utf8 = charenc_1.utf8,
        isBuffer = isBuffer_1,
        bin = charenc_1.bin,

    // The core
    md5 = function (message, options) {
      // Convert to byte array
      if (message.constructor == String)
        if (options && options.encoding === 'binary')
          message = bin.stringToBytes(message);
        else
          message = utf8.stringToBytes(message);
      else if (isBuffer(message))
        message = Array.prototype.slice.call(message, 0);
      else if (!Array.isArray(message) && message.constructor !== Uint8Array)
        message = message.toString();
      // else, assume byte array already

      var m = crypt.bytesToWords(message),
          l = message.length * 8,
          a =  1732584193,
          b = -271733879,
          c = -1732584194,
          d =  271733878;

      // Swap endian
      for (var i = 0; i < m.length; i++) {
        m[i] = ((m[i] <<  8) | (m[i] >>> 24)) & 0x00FF00FF |
               ((m[i] << 24) | (m[i] >>>  8)) & 0xFF00FF00;
      }

      // Padding
      m[l >>> 5] |= 0x80 << (l % 32);
      m[(((l + 64) >>> 9) << 4) + 14] = l;

      // Method shortcuts
      var FF = md5._ff,
          GG = md5._gg,
          HH = md5._hh,
          II = md5._ii;

      for (var i = 0; i < m.length; i += 16) {

        var aa = a,
            bb = b,
            cc = c,
            dd = d;

        a = FF(a, b, c, d, m[i+ 0],  7, -680876936);
        d = FF(d, a, b, c, m[i+ 1], 12, -389564586);
        c = FF(c, d, a, b, m[i+ 2], 17,  606105819);
        b = FF(b, c, d, a, m[i+ 3], 22, -1044525330);
        a = FF(a, b, c, d, m[i+ 4],  7, -176418897);
        d = FF(d, a, b, c, m[i+ 5], 12,  1200080426);
        c = FF(c, d, a, b, m[i+ 6], 17, -1473231341);
        b = FF(b, c, d, a, m[i+ 7], 22, -45705983);
        a = FF(a, b, c, d, m[i+ 8],  7,  1770035416);
        d = FF(d, a, b, c, m[i+ 9], 12, -1958414417);
        c = FF(c, d, a, b, m[i+10], 17, -42063);
        b = FF(b, c, d, a, m[i+11], 22, -1990404162);
        a = FF(a, b, c, d, m[i+12],  7,  1804603682);
        d = FF(d, a, b, c, m[i+13], 12, -40341101);
        c = FF(c, d, a, b, m[i+14], 17, -1502002290);
        b = FF(b, c, d, a, m[i+15], 22,  1236535329);

        a = GG(a, b, c, d, m[i+ 1],  5, -165796510);
        d = GG(d, a, b, c, m[i+ 6],  9, -1069501632);
        c = GG(c, d, a, b, m[i+11], 14,  643717713);
        b = GG(b, c, d, a, m[i+ 0], 20, -373897302);
        a = GG(a, b, c, d, m[i+ 5],  5, -701558691);
        d = GG(d, a, b, c, m[i+10],  9,  38016083);
        c = GG(c, d, a, b, m[i+15], 14, -660478335);
        b = GG(b, c, d, a, m[i+ 4], 20, -405537848);
        a = GG(a, b, c, d, m[i+ 9],  5,  568446438);
        d = GG(d, a, b, c, m[i+14],  9, -1019803690);
        c = GG(c, d, a, b, m[i+ 3], 14, -187363961);
        b = GG(b, c, d, a, m[i+ 8], 20,  1163531501);
        a = GG(a, b, c, d, m[i+13],  5, -1444681467);
        d = GG(d, a, b, c, m[i+ 2],  9, -51403784);
        c = GG(c, d, a, b, m[i+ 7], 14,  1735328473);
        b = GG(b, c, d, a, m[i+12], 20, -1926607734);

        a = HH(a, b, c, d, m[i+ 5],  4, -378558);
        d = HH(d, a, b, c, m[i+ 8], 11, -2022574463);
        c = HH(c, d, a, b, m[i+11], 16,  1839030562);
        b = HH(b, c, d, a, m[i+14], 23, -35309556);
        a = HH(a, b, c, d, m[i+ 1],  4, -1530992060);
        d = HH(d, a, b, c, m[i+ 4], 11,  1272893353);
        c = HH(c, d, a, b, m[i+ 7], 16, -155497632);
        b = HH(b, c, d, a, m[i+10], 23, -1094730640);
        a = HH(a, b, c, d, m[i+13],  4,  681279174);
        d = HH(d, a, b, c, m[i+ 0], 11, -358537222);
        c = HH(c, d, a, b, m[i+ 3], 16, -722521979);
        b = HH(b, c, d, a, m[i+ 6], 23,  76029189);
        a = HH(a, b, c, d, m[i+ 9],  4, -640364487);
        d = HH(d, a, b, c, m[i+12], 11, -421815835);
        c = HH(c, d, a, b, m[i+15], 16,  530742520);
        b = HH(b, c, d, a, m[i+ 2], 23, -995338651);

        a = II(a, b, c, d, m[i+ 0],  6, -198630844);
        d = II(d, a, b, c, m[i+ 7], 10,  1126891415);
        c = II(c, d, a, b, m[i+14], 15, -1416354905);
        b = II(b, c, d, a, m[i+ 5], 21, -57434055);
        a = II(a, b, c, d, m[i+12],  6,  1700485571);
        d = II(d, a, b, c, m[i+ 3], 10, -1894986606);
        c = II(c, d, a, b, m[i+10], 15, -1051523);
        b = II(b, c, d, a, m[i+ 1], 21, -2054922799);
        a = II(a, b, c, d, m[i+ 8],  6,  1873313359);
        d = II(d, a, b, c, m[i+15], 10, -30611744);
        c = II(c, d, a, b, m[i+ 6], 15, -1560198380);
        b = II(b, c, d, a, m[i+13], 21,  1309151649);
        a = II(a, b, c, d, m[i+ 4],  6, -145523070);
        d = II(d, a, b, c, m[i+11], 10, -1120210379);
        c = II(c, d, a, b, m[i+ 2], 15,  718787259);
        b = II(b, c, d, a, m[i+ 9], 21, -343485551);

        a = (a + aa) >>> 0;
        b = (b + bb) >>> 0;
        c = (c + cc) >>> 0;
        d = (d + dd) >>> 0;
      }

      return crypt.endian([a, b, c, d]);
    };

    // Auxiliary functions
    md5._ff  = function (a, b, c, d, x, s, t) {
      var n = a + (b & c | ~b & d) + (x >>> 0) + t;
      return ((n << s) | (n >>> (32 - s))) + b;
    };
    md5._gg  = function (a, b, c, d, x, s, t) {
      var n = a + (b & d | c & ~d) + (x >>> 0) + t;
      return ((n << s) | (n >>> (32 - s))) + b;
    };
    md5._hh  = function (a, b, c, d, x, s, t) {
      var n = a + (b ^ c ^ d) + (x >>> 0) + t;
      return ((n << s) | (n >>> (32 - s))) + b;
    };
    md5._ii  = function (a, b, c, d, x, s, t) {
      var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
      return ((n << s) | (n >>> (32 - s))) + b;
    };

    // Package private blocksize
    md5._blocksize = 16;
    md5._digestsize = 16;

    md5$1.exports = function (message, options) {
      if (message === undefined || message === null)
        throw new Error('Illegal argument ' + message);

      var digestbytes = crypt.wordsToBytes(md5(message, options));
      return options && options.asBytes ? digestbytes :
          options && options.asString ? bin.bytesToString(digestbytes) :
          crypt.bytesToHex(digestbytes);
    };

  })();

  var md5Exports = md5$1.exports;
  var md5 = /*@__PURE__*/getDefaultExportFromCjs(md5Exports);

  var re$2 = {exports: {}};

  // Note: this is the semver.org version of the spec that it implements
  // Not necessarily the package version of this code.
  const SEMVER_SPEC_VERSION = '2.0.0';

  const MAX_LENGTH$1 = 256;
  const MAX_SAFE_INTEGER$1 = Number.MAX_SAFE_INTEGER ||
  /* istanbul ignore next */ 9007199254740991;

  // Max safe segment length for coercion.
  const MAX_SAFE_COMPONENT_LENGTH = 16;

  // Max safe length for a build identifier. The max length minus 6 characters for
  // the shortest version with a build 0.0.0+BUILD.
  const MAX_SAFE_BUILD_LENGTH = MAX_LENGTH$1 - 6;

  const RELEASE_TYPES = [
    'major',
    'premajor',
    'minor',
    'preminor',
    'patch',
    'prepatch',
    'prerelease',
  ];

  var constants$1 = {
    MAX_LENGTH: MAX_LENGTH$1,
    MAX_SAFE_COMPONENT_LENGTH,
    MAX_SAFE_BUILD_LENGTH,
    MAX_SAFE_INTEGER: MAX_SAFE_INTEGER$1,
    RELEASE_TYPES,
    SEMVER_SPEC_VERSION,
    FLAG_INCLUDE_PRERELEASE: 0b001,
    FLAG_LOOSE: 0b010,
  };

  var global$1 = (typeof global !== "undefined" ? global :
    typeof self !== "undefined" ? self :
    typeof window !== "undefined" ? window : {});

  var env = {};

  // from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
  var performance = global$1.performance || {};
  performance.now        ||
    performance.mozNow     ||
    performance.msNow      ||
    performance.oNow       ||
    performance.webkitNow  ||
    function(){ return (new Date()).getTime() };

  var browser$1 = {
    env: env};

  const debug$1 = (
    typeof browser$1 === 'object' &&
    browser$1.env &&
    browser$1.env.NODE_DEBUG &&
    /\bsemver\b/i.test(browser$1.env.NODE_DEBUG)
  ) ? (...args) => console.error('SEMVER', ...args)
    : () => {};

  var debug_1 = debug$1;

  (function (module, exports) {
  	const {
  	  MAX_SAFE_COMPONENT_LENGTH,
  	  MAX_SAFE_BUILD_LENGTH,
  	  MAX_LENGTH,
  	} = constants$1;
  	const debug = debug_1;
  	exports = module.exports = {};

  	// The actual regexps go on exports.re
  	const re = exports.re = [];
  	const safeRe = exports.safeRe = [];
  	const src = exports.src = [];
  	const t = exports.t = {};
  	let R = 0;

  	const LETTERDASHNUMBER = '[a-zA-Z0-9-]';

  	// Replace some greedy regex tokens to prevent regex dos issues. These regex are
  	// used internally via the safeRe object since all inputs in this library get
  	// normalized first to trim and collapse all extra whitespace. The original
  	// regexes are exported for userland consumption and lower level usage. A
  	// future breaking change could export the safer regex only with a note that
  	// all input should have extra whitespace removed.
  	const safeRegexReplacements = [
  	  ['\\s', 1],
  	  ['\\d', MAX_LENGTH],
  	  [LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH],
  	];

  	const makeSafeRegex = (value) => {
  	  for (const [token, max] of safeRegexReplacements) {
  	    value = value
  	      .split(`${token}*`).join(`${token}{0,${max}}`)
  	      .split(`${token}+`).join(`${token}{1,${max}}`);
  	  }
  	  return value
  	};

  	const createToken = (name, value, isGlobal) => {
  	  const safe = makeSafeRegex(value);
  	  const index = R++;
  	  debug(name, index, value);
  	  t[name] = index;
  	  src[index] = value;
  	  re[index] = new RegExp(value, isGlobal ? 'g' : undefined);
  	  safeRe[index] = new RegExp(safe, isGlobal ? 'g' : undefined);
  	};

  	// The following Regular Expressions can be used for tokenizing,
  	// validating, and parsing SemVer version strings.

  	// ## Numeric Identifier
  	// A single `0`, or a non-zero digit followed by zero or more digits.

  	createToken('NUMERICIDENTIFIER', '0|[1-9]\\d*');
  	createToken('NUMERICIDENTIFIERLOOSE', '\\d+');

  	// ## Non-numeric Identifier
  	// Zero or more digits, followed by a letter or hyphen, and then zero or
  	// more letters, digits, or hyphens.

  	createToken('NONNUMERICIDENTIFIER', `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);

  	// ## Main Version
  	// Three dot-separated numeric identifiers.

  	createToken('MAINVERSION', `(${src[t.NUMERICIDENTIFIER]})\\.` +
  	                   `(${src[t.NUMERICIDENTIFIER]})\\.` +
  	                   `(${src[t.NUMERICIDENTIFIER]})`);

  	createToken('MAINVERSIONLOOSE', `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
  	                        `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
  	                        `(${src[t.NUMERICIDENTIFIERLOOSE]})`);

  	// ## Pre-release Version Identifier
  	// A numeric identifier, or a non-numeric identifier.

  	createToken('PRERELEASEIDENTIFIER', `(?:${src[t.NUMERICIDENTIFIER]
	}|${src[t.NONNUMERICIDENTIFIER]})`);

  	createToken('PRERELEASEIDENTIFIERLOOSE', `(?:${src[t.NUMERICIDENTIFIERLOOSE]
	}|${src[t.NONNUMERICIDENTIFIER]})`);

  	// ## Pre-release Version
  	// Hyphen, followed by one or more dot-separated pre-release version
  	// identifiers.

  	createToken('PRERELEASE', `(?:-(${src[t.PRERELEASEIDENTIFIER]
	}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);

  	createToken('PRERELEASELOOSE', `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]
	}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);

  	// ## Build Metadata Identifier
  	// Any combination of digits, letters, or hyphens.

  	createToken('BUILDIDENTIFIER', `${LETTERDASHNUMBER}+`);

  	// ## Build Metadata
  	// Plus sign, followed by one or more period-separated build metadata
  	// identifiers.

  	createToken('BUILD', `(?:\\+(${src[t.BUILDIDENTIFIER]
	}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);

  	// ## Full Version String
  	// A main version, followed optionally by a pre-release version and
  	// build metadata.

  	// Note that the only major, minor, patch, and pre-release sections of
  	// the version string are capturing groups.  The build metadata is not a
  	// capturing group, because it should not ever be used in version
  	// comparison.

  	createToken('FULLPLAIN', `v?${src[t.MAINVERSION]
	}${src[t.PRERELEASE]}?${
	  src[t.BUILD]}?`);

  	createToken('FULL', `^${src[t.FULLPLAIN]}$`);

  	// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
  	// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
  	// common in the npm registry.
  	createToken('LOOSEPLAIN', `[v=\\s]*${src[t.MAINVERSIONLOOSE]
	}${src[t.PRERELEASELOOSE]}?${
	  src[t.BUILD]}?`);

  	createToken('LOOSE', `^${src[t.LOOSEPLAIN]}$`);

  	createToken('GTLT', '((?:<|>)?=?)');

  	// Something like "2.*" or "1.2.x".
  	// Note that "x.x" is a valid xRange identifer, meaning "any version"
  	// Only the first item is strictly required.
  	createToken('XRANGEIDENTIFIERLOOSE', `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
  	createToken('XRANGEIDENTIFIER', `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);

  	createToken('XRANGEPLAIN', `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})` +
  	                   `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
  	                   `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
  	                   `(?:${src[t.PRERELEASE]})?${
	                     src[t.BUILD]}?` +
  	                   `)?)?`);

  	createToken('XRANGEPLAINLOOSE', `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})` +
  	                        `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
  	                        `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
  	                        `(?:${src[t.PRERELEASELOOSE]})?${
	                          src[t.BUILD]}?` +
  	                        `)?)?`);

  	createToken('XRANGE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
  	createToken('XRANGELOOSE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);

  	// Coercion.
  	// Extract anything that could conceivably be a part of a valid semver
  	createToken('COERCEPLAIN', `${'(^|[^\\d])' +
	              '(\\d{1,'}${MAX_SAFE_COMPONENT_LENGTH}})` +
  	              `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` +
  	              `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`);
  	createToken('COERCE', `${src[t.COERCEPLAIN]}(?:$|[^\\d])`);
  	createToken('COERCEFULL', src[t.COERCEPLAIN] +
  	              `(?:${src[t.PRERELEASE]})?` +
  	              `(?:${src[t.BUILD]})?` +
  	              `(?:$|[^\\d])`);
  	createToken('COERCERTL', src[t.COERCE], true);
  	createToken('COERCERTLFULL', src[t.COERCEFULL], true);

  	// Tilde ranges.
  	// Meaning is "reasonably at or greater than"
  	createToken('LONETILDE', '(?:~>?)');

  	createToken('TILDETRIM', `(\\s*)${src[t.LONETILDE]}\\s+`, true);
  	exports.tildeTrimReplace = '$1~';

  	createToken('TILDE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
  	createToken('TILDELOOSE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);

  	// Caret ranges.
  	// Meaning is "at least and backwards compatible with"
  	createToken('LONECARET', '(?:\\^)');

  	createToken('CARETTRIM', `(\\s*)${src[t.LONECARET]}\\s+`, true);
  	exports.caretTrimReplace = '$1^';

  	createToken('CARET', `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
  	createToken('CARETLOOSE', `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);

  	// A simple gt/lt/eq thing, or just "" to indicate "any version"
  	createToken('COMPARATORLOOSE', `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
  	createToken('COMPARATOR', `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);

  	// An expression to strip any whitespace between the gtlt and the thing
  	// it modifies, so that `> 1.2.3` ==> `>1.2.3`
  	createToken('COMPARATORTRIM', `(\\s*)${src[t.GTLT]
	}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
  	exports.comparatorTrimReplace = '$1$2$3';

  	// Something like `1.2.3 - 1.2.4`
  	// Note that these all use the loose form, because they'll be
  	// checked against either the strict or loose comparator form
  	// later.
  	createToken('HYPHENRANGE', `^\\s*(${src[t.XRANGEPLAIN]})` +
  	                   `\\s+-\\s+` +
  	                   `(${src[t.XRANGEPLAIN]})` +
  	                   `\\s*$`);

  	createToken('HYPHENRANGELOOSE', `^\\s*(${src[t.XRANGEPLAINLOOSE]})` +
  	                        `\\s+-\\s+` +
  	                        `(${src[t.XRANGEPLAINLOOSE]})` +
  	                        `\\s*$`);

  	// Star ranges basically just allow anything at all.
  	createToken('STAR', '(<|>)?=?\\s*\\*');
  	// >=0.0.0 is like a star
  	createToken('GTE0', '^\\s*>=\\s*0\\.0\\.0\\s*$');
  	createToken('GTE0PRE', '^\\s*>=\\s*0\\.0\\.0-0\\s*$'); 
  } (re$2, re$2.exports));

  var reExports = re$2.exports;

  // parse out just the options we care about
  const looseOption = Object.freeze({ loose: true });
  const emptyOpts = Object.freeze({ });
  const parseOptions$1 = options => {
    if (!options) {
      return emptyOpts
    }

    if (typeof options !== 'object') {
      return looseOption
    }

    return options
  };
  var parseOptions_1 = parseOptions$1;

  const numeric = /^[0-9]+$/;
  const compareIdentifiers$1 = (a, b) => {
    const anum = numeric.test(a);
    const bnum = numeric.test(b);

    if (anum && bnum) {
      a = +a;
      b = +b;
    }

    return a === b ? 0
      : (anum && !bnum) ? -1
      : (bnum && !anum) ? 1
      : a < b ? -1
      : 1
  };

  const rcompareIdentifiers = (a, b) => compareIdentifiers$1(b, a);

  var identifiers$1 = {
    compareIdentifiers: compareIdentifiers$1,
    rcompareIdentifiers,
  };

  const debug = debug_1;
  const { MAX_LENGTH, MAX_SAFE_INTEGER } = constants$1;
  const { safeRe: re$1, t: t$1 } = reExports;

  const parseOptions = parseOptions_1;
  const { compareIdentifiers } = identifiers$1;
  let SemVer$d = class SemVer {
    constructor (version, options) {
      options = parseOptions(options);

      if (version instanceof SemVer) {
        if (version.loose === !!options.loose &&
            version.includePrerelease === !!options.includePrerelease) {
          return version
        } else {
          version = version.version;
        }
      } else if (typeof version !== 'string') {
        throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`)
      }

      if (version.length > MAX_LENGTH) {
        throw new TypeError(
          `version is longer than ${MAX_LENGTH} characters`
        )
      }

      debug('SemVer', version, options);
      this.options = options;
      this.loose = !!options.loose;
      // this isn't actually relevant for versions, but keep it so that we
      // don't run into trouble passing this.options around.
      this.includePrerelease = !!options.includePrerelease;

      const m = version.trim().match(options.loose ? re$1[t$1.LOOSE] : re$1[t$1.FULL]);

      if (!m) {
        throw new TypeError(`Invalid Version: ${version}`)
      }

      this.raw = version;

      // these are actually numbers
      this.major = +m[1];
      this.minor = +m[2];
      this.patch = +m[3];

      if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
        throw new TypeError('Invalid major version')
      }

      if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
        throw new TypeError('Invalid minor version')
      }

      if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
        throw new TypeError('Invalid patch version')
      }

      // numberify any prerelease numeric ids
      if (!m[4]) {
        this.prerelease = [];
      } else {
        this.prerelease = m[4].split('.').map((id) => {
          if (/^[0-9]+$/.test(id)) {
            const num = +id;
            if (num >= 0 && num < MAX_SAFE_INTEGER) {
              return num
            }
          }
          return id
        });
      }

      this.build = m[5] ? m[5].split('.') : [];
      this.format();
    }

    format () {
      this.version = `${this.major}.${this.minor}.${this.patch}`;
      if (this.prerelease.length) {
        this.version += `-${this.prerelease.join('.')}`;
      }
      return this.version
    }

    toString () {
      return this.version
    }

    compare (other) {
      debug('SemVer.compare', this.version, this.options, other);
      if (!(other instanceof SemVer)) {
        if (typeof other === 'string' && other === this.version) {
          return 0
        }
        other = new SemVer(other, this.options);
      }

      if (other.version === this.version) {
        return 0
      }

      return this.compareMain(other) || this.comparePre(other)
    }

    compareMain (other) {
      if (!(other instanceof SemVer)) {
        other = new SemVer(other, this.options);
      }

      return (
        compareIdentifiers(this.major, other.major) ||
        compareIdentifiers(this.minor, other.minor) ||
        compareIdentifiers(this.patch, other.patch)
      )
    }

    comparePre (other) {
      if (!(other instanceof SemVer)) {
        other = new SemVer(other, this.options);
      }

      // NOT having a prerelease is > having one
      if (this.prerelease.length && !other.prerelease.length) {
        return -1
      } else if (!this.prerelease.length && other.prerelease.length) {
        return 1
      } else if (!this.prerelease.length && !other.prerelease.length) {
        return 0
      }

      let i = 0;
      do {
        const a = this.prerelease[i];
        const b = other.prerelease[i];
        debug('prerelease compare', i, a, b);
        if (a === undefined && b === undefined) {
          return 0
        } else if (b === undefined) {
          return 1
        } else if (a === undefined) {
          return -1
        } else if (a === b) {
          continue
        } else {
          return compareIdentifiers(a, b)
        }
      } while (++i)
    }

    compareBuild (other) {
      if (!(other instanceof SemVer)) {
        other = new SemVer(other, this.options);
      }

      let i = 0;
      do {
        const a = this.build[i];
        const b = other.build[i];
        debug('prerelease compare', i, a, b);
        if (a === undefined && b === undefined) {
          return 0
        } else if (b === undefined) {
          return 1
        } else if (a === undefined) {
          return -1
        } else if (a === b) {
          continue
        } else {
          return compareIdentifiers(a, b)
        }
      } while (++i)
    }

    // preminor will bump the version up to the next minor release, and immediately
    // down to pre-release. premajor and prepatch work the same way.
    inc (release, identifier, identifierBase) {
      switch (release) {
        case 'premajor':
          this.prerelease.length = 0;
          this.patch = 0;
          this.minor = 0;
          this.major++;
          this.inc('pre', identifier, identifierBase);
          break
        case 'preminor':
          this.prerelease.length = 0;
          this.patch = 0;
          this.minor++;
          this.inc('pre', identifier, identifierBase);
          break
        case 'prepatch':
          // If this is already a prerelease, it will bump to the next version
          // drop any prereleases that might already exist, since they are not
          // relevant at this point.
          this.prerelease.length = 0;
          this.inc('patch', identifier, identifierBase);
          this.inc('pre', identifier, identifierBase);
          break
        // If the input is a non-prerelease version, this acts the same as
        // prepatch.
        case 'prerelease':
          if (this.prerelease.length === 0) {
            this.inc('patch', identifier, identifierBase);
          }
          this.inc('pre', identifier, identifierBase);
          break

        case 'major':
          // If this is a pre-major version, bump up to the same major version.
          // Otherwise increment major.
          // 1.0.0-5 bumps to 1.0.0
          // 1.1.0 bumps to 2.0.0
          if (
            this.minor !== 0 ||
            this.patch !== 0 ||
            this.prerelease.length === 0
          ) {
            this.major++;
          }
          this.minor = 0;
          this.patch = 0;
          this.prerelease = [];
          break
        case 'minor':
          // If this is a pre-minor version, bump up to the same minor version.
          // Otherwise increment minor.
          // 1.2.0-5 bumps to 1.2.0
          // 1.2.1 bumps to 1.3.0
          if (this.patch !== 0 || this.prerelease.length === 0) {
            this.minor++;
          }
          this.patch = 0;
          this.prerelease = [];
          break
        case 'patch':
          // If this is not a pre-release version, it will increment the patch.
          // If it is a pre-release it will bump up to the same patch version.
          // 1.2.0-5 patches to 1.2.0
          // 1.2.0 patches to 1.2.1
          if (this.prerelease.length === 0) {
            this.patch++;
          }
          this.prerelease = [];
          break
        // This probably shouldn't be used publicly.
        // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
        case 'pre': {
          const base = Number(identifierBase) ? 1 : 0;

          if (!identifier && identifierBase === false) {
            throw new Error('invalid increment argument: identifier is empty')
          }

          if (this.prerelease.length === 0) {
            this.prerelease = [base];
          } else {
            let i = this.prerelease.length;
            while (--i >= 0) {
              if (typeof this.prerelease[i] === 'number') {
                this.prerelease[i]++;
                i = -2;
              }
            }
            if (i === -1) {
              // didn't increment anything
              if (identifier === this.prerelease.join('.') && identifierBase === false) {
                throw new Error('invalid increment argument: identifier already exists')
              }
              this.prerelease.push(base);
            }
          }
          if (identifier) {
            // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
            // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
            let prerelease = [identifier, base];
            if (identifierBase === false) {
              prerelease = [identifier];
            }
            if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
              if (isNaN(this.prerelease[1])) {
                this.prerelease = prerelease;
              }
            } else {
              this.prerelease = prerelease;
            }
          }
          break
        }
        default:
          throw new Error(`invalid increment argument: ${release}`)
      }
      this.raw = this.format();
      if (this.build.length) {
        this.raw += `+${this.build.join('.')}`;
      }
      return this
    }
  };

  var semver$2 = SemVer$d;

  const SemVer$c = semver$2;
  const parse$6 = (version, options, throwErrors = false) => {
    if (version instanceof SemVer$c) {
      return version
    }
    try {
      return new SemVer$c(version, options)
    } catch (er) {
      if (!throwErrors) {
        return null
      }
      throw er
    }
  };

  var parse_1 = parse$6;

  const parse$5 = parse_1;
  const valid$2 = (version, options) => {
    const v = parse$5(version, options);
    return v ? v.version : null
  };
  var valid_1 = valid$2;

  const parse$4 = parse_1;
  const clean$1 = (version, options) => {
    const s = parse$4(version.trim().replace(/^[=v]+/, ''), options);
    return s ? s.version : null
  };
  var clean_1 = clean$1;

  const SemVer$b = semver$2;

  const inc$1 = (version, release, options, identifier, identifierBase) => {
    if (typeof (options) === 'string') {
      identifierBase = identifier;
      identifier = options;
      options = undefined;
    }

    try {
      return new SemVer$b(
        version instanceof SemVer$b ? version.version : version,
        options
      ).inc(release, identifier, identifierBase).version
    } catch (er) {
      return null
    }
  };
  var inc_1 = inc$1;

  const parse$3 = parse_1;

  const diff$1 = (version1, version2) => {
    const v1 = parse$3(version1, null, true);
    const v2 = parse$3(version2, null, true);
    const comparison = v1.compare(v2);

    if (comparison === 0) {
      return null
    }

    const v1Higher = comparison > 0;
    const highVersion = v1Higher ? v1 : v2;
    const lowVersion = v1Higher ? v2 : v1;
    const highHasPre = !!highVersion.prerelease.length;
    const lowHasPre = !!lowVersion.prerelease.length;

    if (lowHasPre && !highHasPre) {
      // Going from prerelease -> no prerelease requires some special casing

      // If the low version has only a major, then it will always be a major
      // Some examples:
      // 1.0.0-1 -> 1.0.0
      // 1.0.0-1 -> 1.1.1
      // 1.0.0-1 -> 2.0.0
      if (!lowVersion.patch && !lowVersion.minor) {
        return 'major'
      }

      // Otherwise it can be determined by checking the high version

      if (highVersion.patch) {
        // anything higher than a patch bump would result in the wrong version
        return 'patch'
      }

      if (highVersion.minor) {
        // anything higher than a minor bump would result in the wrong version
        return 'minor'
      }

      // bumping major/minor/patch all have same result
      return 'major'
    }

    // add the `pre` prefix if we are going to a prerelease version
    const prefix = highHasPre ? 'pre' : '';

    if (v1.major !== v2.major) {
      return prefix + 'major'
    }

    if (v1.minor !== v2.minor) {
      return prefix + 'minor'
    }

    if (v1.patch !== v2.patch) {
      return prefix + 'patch'
    }

    // high and low are preleases
    return 'prerelease'
  };

  var diff_1 = diff$1;

  const SemVer$a = semver$2;
  const major$1 = (a, loose) => new SemVer$a(a, loose).major;
  var major_1 = major$1;

  const SemVer$9 = semver$2;
  const minor$1 = (a, loose) => new SemVer$9(a, loose).minor;
  var minor_1 = minor$1;

  const SemVer$8 = semver$2;
  const patch$1 = (a, loose) => new SemVer$8(a, loose).patch;
  var patch_1 = patch$1;

  const parse$2 = parse_1;
  const prerelease$1 = (version, options) => {
    const parsed = parse$2(version, options);
    return (parsed && parsed.prerelease.length) ? parsed.prerelease : null
  };
  var prerelease_1 = prerelease$1;

  const SemVer$7 = semver$2;
  const compare$b = (a, b, loose) =>
    new SemVer$7(a, loose).compare(new SemVer$7(b, loose));

  var compare_1 = compare$b;

  const compare$a = compare_1;
  const rcompare$1 = (a, b, loose) => compare$a(b, a, loose);
  var rcompare_1 = rcompare$1;

  const compare$9 = compare_1;
  const compareLoose$1 = (a, b) => compare$9(a, b, true);
  var compareLoose_1 = compareLoose$1;

  const SemVer$6 = semver$2;
  const compareBuild$3 = (a, b, loose) => {
    const versionA = new SemVer$6(a, loose);
    const versionB = new SemVer$6(b, loose);
    return versionA.compare(versionB) || versionA.compareBuild(versionB)
  };
  var compareBuild_1 = compareBuild$3;

  const compareBuild$2 = compareBuild_1;
  const sort$1 = (list, loose) => list.sort((a, b) => compareBuild$2(a, b, loose));
  var sort_1 = sort$1;

  const compareBuild$1 = compareBuild_1;
  const rsort$1 = (list, loose) => list.sort((a, b) => compareBuild$1(b, a, loose));
  var rsort_1 = rsort$1;

  const compare$8 = compare_1;
  const gt$4 = (a, b, loose) => compare$8(a, b, loose) > 0;
  var gt_1 = gt$4;

  const compare$7 = compare_1;
  const lt$3 = (a, b, loose) => compare$7(a, b, loose) < 0;
  var lt_1 = lt$3;

  const compare$6 = compare_1;
  const eq$2 = (a, b, loose) => compare$6(a, b, loose) === 0;
  var eq_1 = eq$2;

  const compare$5 = compare_1;
  const neq$2 = (a, b, loose) => compare$5(a, b, loose) !== 0;
  var neq_1 = neq$2;

  const compare$4 = compare_1;
  const gte$3 = (a, b, loose) => compare$4(a, b, loose) >= 0;
  var gte_1 = gte$3;

  const compare$3 = compare_1;
  const lte$3 = (a, b, loose) => compare$3(a, b, loose) <= 0;
  var lte_1 = lte$3;

  const eq$1 = eq_1;
  const neq$1 = neq_1;
  const gt$3 = gt_1;
  const gte$2 = gte_1;
  const lt$2 = lt_1;
  const lte$2 = lte_1;

  const cmp$1 = (a, op, b, loose) => {
    switch (op) {
      case '===':
        if (typeof a === 'object') {
          a = a.version;
        }
        if (typeof b === 'object') {
          b = b.version;
        }
        return a === b

      case '!==':
        if (typeof a === 'object') {
          a = a.version;
        }
        if (typeof b === 'object') {
          b = b.version;
        }
        return a !== b

      case '':
      case '=':
      case '==':
        return eq$1(a, b, loose)

      case '!=':
        return neq$1(a, b, loose)

      case '>':
        return gt$3(a, b, loose)

      case '>=':
        return gte$2(a, b, loose)

      case '<':
        return lt$2(a, b, loose)

      case '<=':
        return lte$2(a, b, loose)

      default:
        throw new TypeError(`Invalid operator: ${op}`)
    }
  };
  var cmp_1 = cmp$1;

  const SemVer$5 = semver$2;
  const parse$1 = parse_1;
  const { safeRe: re, t } = reExports;

  const coerce$1 = (version, options) => {
    if (version instanceof SemVer$5) {
      return version
    }

    if (typeof version === 'number') {
      version = String(version);
    }

    if (typeof version !== 'string') {
      return null
    }

    options = options || {};

    let match = null;
    if (!options.rtl) {
      match = version.match(options.includePrerelease ? re[t.COERCEFULL] : re[t.COERCE]);
    } else {
      // Find the right-most coercible string that does not share
      // a terminus with a more left-ward coercible string.
      // Eg, '1.2.3.4' wants to coerce '2.3.4', not '3.4' or '4'
      // With includePrerelease option set, '1.2.3.4-rc' wants to coerce '2.3.4-rc', not '2.3.4'
      //
      // Walk through the string checking with a /g regexp
      // Manually set the index so as to pick up overlapping matches.
      // Stop when we get a match that ends at the string end, since no
      // coercible string can be more right-ward without the same terminus.
      const coerceRtlRegex = options.includePrerelease ? re[t.COERCERTLFULL] : re[t.COERCERTL];
      let next;
      while ((next = coerceRtlRegex.exec(version)) &&
          (!match || match.index + match[0].length !== version.length)
      ) {
        if (!match ||
              next.index + next[0].length !== match.index + match[0].length) {
          match = next;
        }
        coerceRtlRegex.lastIndex = next.index + next[1].length + next[2].length;
      }
      // leave it in a clean state
      coerceRtlRegex.lastIndex = -1;
    }

    if (match === null) {
      return null
    }

    const major = match[2];
    const minor = match[3] || '0';
    const patch = match[4] || '0';
    const prerelease = options.includePrerelease && match[5] ? `-${match[5]}` : '';
    const build = options.includePrerelease && match[6] ? `+${match[6]}` : '';

    return parse$1(`${major}.${minor}.${patch}${prerelease}${build}`, options)
  };
  var coerce_1 = coerce$1;

  var iterator;
  var hasRequiredIterator;

  function requireIterator () {
  	if (hasRequiredIterator) return iterator;
  	hasRequiredIterator = 1;
  	iterator = function (Yallist) {
  	  Yallist.prototype[Symbol.iterator] = function* () {
  	    for (let walker = this.head; walker; walker = walker.next) {
  	      yield walker.value;
  	    }
  	  };
  	};
  	return iterator;
  }

  var yallist;
  var hasRequiredYallist;

  function requireYallist () {
  	if (hasRequiredYallist) return yallist;
  	hasRequiredYallist = 1;
  	yallist = Yallist;

  	Yallist.Node = Node;
  	Yallist.create = Yallist;

  	function Yallist (list) {
  	  var self = this;
  	  if (!(self instanceof Yallist)) {
  	    self = new Yallist();
  	  }

  	  self.tail = null;
  	  self.head = null;
  	  self.length = 0;

  	  if (list && typeof list.forEach === 'function') {
  	    list.forEach(function (item) {
  	      self.push(item);
  	    });
  	  } else if (arguments.length > 0) {
  	    for (var i = 0, l = arguments.length; i < l; i++) {
  	      self.push(arguments[i]);
  	    }
  	  }

  	  return self
  	}

  	Yallist.prototype.removeNode = function (node) {
  	  if (node.list !== this) {
  	    throw new Error('removing node which does not belong to this list')
  	  }

  	  var next = node.next;
  	  var prev = node.prev;

  	  if (next) {
  	    next.prev = prev;
  	  }

  	  if (prev) {
  	    prev.next = next;
  	  }

  	  if (node === this.head) {
  	    this.head = next;
  	  }
  	  if (node === this.tail) {
  	    this.tail = prev;
  	  }

  	  node.list.length--;
  	  node.next = null;
  	  node.prev = null;
  	  node.list = null;

  	  return next
  	};

  	Yallist.prototype.unshiftNode = function (node) {
  	  if (node === this.head) {
  	    return
  	  }

  	  if (node.list) {
  	    node.list.removeNode(node);
  	  }

  	  var head = this.head;
  	  node.list = this;
  	  node.next = head;
  	  if (head) {
  	    head.prev = node;
  	  }

  	  this.head = node;
  	  if (!this.tail) {
  	    this.tail = node;
  	  }
  	  this.length++;
  	};

  	Yallist.prototype.pushNode = function (node) {
  	  if (node === this.tail) {
  	    return
  	  }

  	  if (node.list) {
  	    node.list.removeNode(node);
  	  }

  	  var tail = this.tail;
  	  node.list = this;
  	  node.prev = tail;
  	  if (tail) {
  	    tail.next = node;
  	  }

  	  this.tail = node;
  	  if (!this.head) {
  	    this.head = node;
  	  }
  	  this.length++;
  	};

  	Yallist.prototype.push = function () {
  	  for (var i = 0, l = arguments.length; i < l; i++) {
  	    push(this, arguments[i]);
  	  }
  	  return this.length
  	};

  	Yallist.prototype.unshift = function () {
  	  for (var i = 0, l = arguments.length; i < l; i++) {
  	    unshift(this, arguments[i]);
  	  }
  	  return this.length
  	};

  	Yallist.prototype.pop = function () {
  	  if (!this.tail) {
  	    return undefined
  	  }

  	  var res = this.tail.value;
  	  this.tail = this.tail.prev;
  	  if (this.tail) {
  	    this.tail.next = null;
  	  } else {
  	    this.head = null;
  	  }
  	  this.length--;
  	  return res
  	};

  	Yallist.prototype.shift = function () {
  	  if (!this.head) {
  	    return undefined
  	  }

  	  var res = this.head.value;
  	  this.head = this.head.next;
  	  if (this.head) {
  	    this.head.prev = null;
  	  } else {
  	    this.tail = null;
  	  }
  	  this.length--;
  	  return res
  	};

  	Yallist.prototype.forEach = function (fn, thisp) {
  	  thisp = thisp || this;
  	  for (var walker = this.head, i = 0; walker !== null; i++) {
  	    fn.call(thisp, walker.value, i, this);
  	    walker = walker.next;
  	  }
  	};

  	Yallist.prototype.forEachReverse = function (fn, thisp) {
  	  thisp = thisp || this;
  	  for (var walker = this.tail, i = this.length - 1; walker !== null; i--) {
  	    fn.call(thisp, walker.value, i, this);
  	    walker = walker.prev;
  	  }
  	};

  	Yallist.prototype.get = function (n) {
  	  for (var i = 0, walker = this.head; walker !== null && i < n; i++) {
  	    // abort out of the list early if we hit a cycle
  	    walker = walker.next;
  	  }
  	  if (i === n && walker !== null) {
  	    return walker.value
  	  }
  	};

  	Yallist.prototype.getReverse = function (n) {
  	  for (var i = 0, walker = this.tail; walker !== null && i < n; i++) {
  	    // abort out of the list early if we hit a cycle
  	    walker = walker.prev;
  	  }
  	  if (i === n && walker !== null) {
  	    return walker.value
  	  }
  	};

  	Yallist.prototype.map = function (fn, thisp) {
  	  thisp = thisp || this;
  	  var res = new Yallist();
  	  for (var walker = this.head; walker !== null;) {
  	    res.push(fn.call(thisp, walker.value, this));
  	    walker = walker.next;
  	  }
  	  return res
  	};

  	Yallist.prototype.mapReverse = function (fn, thisp) {
  	  thisp = thisp || this;
  	  var res = new Yallist();
  	  for (var walker = this.tail; walker !== null;) {
  	    res.push(fn.call(thisp, walker.value, this));
  	    walker = walker.prev;
  	  }
  	  return res
  	};

  	Yallist.prototype.reduce = function (fn, initial) {
  	  var acc;
  	  var walker = this.head;
  	  if (arguments.length > 1) {
  	    acc = initial;
  	  } else if (this.head) {
  	    walker = this.head.next;
  	    acc = this.head.value;
  	  } else {
  	    throw new TypeError('Reduce of empty list with no initial value')
  	  }

  	  for (var i = 0; walker !== null; i++) {
  	    acc = fn(acc, walker.value, i);
  	    walker = walker.next;
  	  }

  	  return acc
  	};

  	Yallist.prototype.reduceReverse = function (fn, initial) {
  	  var acc;
  	  var walker = this.tail;
  	  if (arguments.length > 1) {
  	    acc = initial;
  	  } else if (this.tail) {
  	    walker = this.tail.prev;
  	    acc = this.tail.value;
  	  } else {
  	    throw new TypeError('Reduce of empty list with no initial value')
  	  }

  	  for (var i = this.length - 1; walker !== null; i--) {
  	    acc = fn(acc, walker.value, i);
  	    walker = walker.prev;
  	  }

  	  return acc
  	};

  	Yallist.prototype.toArray = function () {
  	  var arr = new Array(this.length);
  	  for (var i = 0, walker = this.head; walker !== null; i++) {
  	    arr[i] = walker.value;
  	    walker = walker.next;
  	  }
  	  return arr
  	};

  	Yallist.prototype.toArrayReverse = function () {
  	  var arr = new Array(this.length);
  	  for (var i = 0, walker = this.tail; walker !== null; i++) {
  	    arr[i] = walker.value;
  	    walker = walker.prev;
  	  }
  	  return arr
  	};

  	Yallist.prototype.slice = function (from, to) {
  	  to = to || this.length;
  	  if (to < 0) {
  	    to += this.length;
  	  }
  	  from = from || 0;
  	  if (from < 0) {
  	    from += this.length;
  	  }
  	  var ret = new Yallist();
  	  if (to < from || to < 0) {
  	    return ret
  	  }
  	  if (from < 0) {
  	    from = 0;
  	  }
  	  if (to > this.length) {
  	    to = this.length;
  	  }
  	  for (var i = 0, walker = this.head; walker !== null && i < from; i++) {
  	    walker = walker.next;
  	  }
  	  for (; walker !== null && i < to; i++, walker = walker.next) {
  	    ret.push(walker.value);
  	  }
  	  return ret
  	};

  	Yallist.prototype.sliceReverse = function (from, to) {
  	  to = to || this.length;
  	  if (to < 0) {
  	    to += this.length;
  	  }
  	  from = from || 0;
  	  if (from < 0) {
  	    from += this.length;
  	  }
  	  var ret = new Yallist();
  	  if (to < from || to < 0) {
  	    return ret
  	  }
  	  if (from < 0) {
  	    from = 0;
  	  }
  	  if (to > this.length) {
  	    to = this.length;
  	  }
  	  for (var i = this.length, walker = this.tail; walker !== null && i > to; i--) {
  	    walker = walker.prev;
  	  }
  	  for (; walker !== null && i > from; i--, walker = walker.prev) {
  	    ret.push(walker.value);
  	  }
  	  return ret
  	};

  	Yallist.prototype.splice = function (start, deleteCount, ...nodes) {
  	  if (start > this.length) {
  	    start = this.length - 1;
  	  }
  	  if (start < 0) {
  	    start = this.length + start;
  	  }

  	  for (var i = 0, walker = this.head; walker !== null && i < start; i++) {
  	    walker = walker.next;
  	  }

  	  var ret = [];
  	  for (var i = 0; walker && i < deleteCount; i++) {
  	    ret.push(walker.value);
  	    walker = this.removeNode(walker);
  	  }
  	  if (walker === null) {
  	    walker = this.tail;
  	  }

  	  if (walker !== this.head && walker !== this.tail) {
  	    walker = walker.prev;
  	  }

  	  for (var i = 0; i < nodes.length; i++) {
  	    walker = insert(this, walker, nodes[i]);
  	  }
  	  return ret;
  	};

  	Yallist.prototype.reverse = function () {
  	  var head = this.head;
  	  var tail = this.tail;
  	  for (var walker = head; walker !== null; walker = walker.prev) {
  	    var p = walker.prev;
  	    walker.prev = walker.next;
  	    walker.next = p;
  	  }
  	  this.head = tail;
  	  this.tail = head;
  	  return this
  	};

  	function insert (self, node, value) {
  	  var inserted = node === self.head ?
  	    new Node(value, null, node, self) :
  	    new Node(value, node, node.next, self);

  	  if (inserted.next === null) {
  	    self.tail = inserted;
  	  }
  	  if (inserted.prev === null) {
  	    self.head = inserted;
  	  }

  	  self.length++;

  	  return inserted
  	}

  	function push (self, item) {
  	  self.tail = new Node(item, self.tail, null, self);
  	  if (!self.head) {
  	    self.head = self.tail;
  	  }
  	  self.length++;
  	}

  	function unshift (self, item) {
  	  self.head = new Node(item, null, self.head, self);
  	  if (!self.tail) {
  	    self.tail = self.head;
  	  }
  	  self.length++;
  	}

  	function Node (value, prev, next, list) {
  	  if (!(this instanceof Node)) {
  	    return new Node(value, prev, next, list)
  	  }

  	  this.list = list;
  	  this.value = value;

  	  if (prev) {
  	    prev.next = this;
  	    this.prev = prev;
  	  } else {
  	    this.prev = null;
  	  }

  	  if (next) {
  	    next.prev = this;
  	    this.next = next;
  	  } else {
  	    this.next = null;
  	  }
  	}

  	try {
  	  // add if support for Symbol.iterator is present
  	  requireIterator()(Yallist);
  	} catch (er) {}
  	return yallist;
  }

  var lruCache;
  var hasRequiredLruCache;

  function requireLruCache () {
  	if (hasRequiredLruCache) return lruCache;
  	hasRequiredLruCache = 1;

  	// A linked list to keep track of recently-used-ness
  	const Yallist = requireYallist();

  	const MAX = Symbol('max');
  	const LENGTH = Symbol('length');
  	const LENGTH_CALCULATOR = Symbol('lengthCalculator');
  	const ALLOW_STALE = Symbol('allowStale');
  	const MAX_AGE = Symbol('maxAge');
  	const DISPOSE = Symbol('dispose');
  	const NO_DISPOSE_ON_SET = Symbol('noDisposeOnSet');
  	const LRU_LIST = Symbol('lruList');
  	const CACHE = Symbol('cache');
  	const UPDATE_AGE_ON_GET = Symbol('updateAgeOnGet');

  	const naiveLength = () => 1;

  	// lruList is a yallist where the head is the youngest
  	// item, and the tail is the oldest.  the list contains the Hit
  	// objects as the entries.
  	// Each Hit object has a reference to its Yallist.Node.  This
  	// never changes.
  	//
  	// cache is a Map (or PseudoMap) that matches the keys to
  	// the Yallist.Node object.
  	class LRUCache {
  	  constructor (options) {
  	    if (typeof options === 'number')
  	      options = { max: options };

  	    if (!options)
  	      options = {};

  	    if (options.max && (typeof options.max !== 'number' || options.max < 0))
  	      throw new TypeError('max must be a non-negative number')
  	    // Kind of weird to have a default max of Infinity, but oh well.
  	    this[MAX] = options.max || Infinity;

  	    const lc = options.length || naiveLength;
  	    this[LENGTH_CALCULATOR] = (typeof lc !== 'function') ? naiveLength : lc;
  	    this[ALLOW_STALE] = options.stale || false;
  	    if (options.maxAge && typeof options.maxAge !== 'number')
  	      throw new TypeError('maxAge must be a number')
  	    this[MAX_AGE] = options.maxAge || 0;
  	    this[DISPOSE] = options.dispose;
  	    this[NO_DISPOSE_ON_SET] = options.noDisposeOnSet || false;
  	    this[UPDATE_AGE_ON_GET] = options.updateAgeOnGet || false;
  	    this.reset();
  	  }

  	  // resize the cache when the max changes.
  	  set max (mL) {
  	    if (typeof mL !== 'number' || mL < 0)
  	      throw new TypeError('max must be a non-negative number')

  	    this[MAX] = mL || Infinity;
  	    trim(this);
  	  }
  	  get max () {
  	    return this[MAX]
  	  }

  	  set allowStale (allowStale) {
  	    this[ALLOW_STALE] = !!allowStale;
  	  }
  	  get allowStale () {
  	    return this[ALLOW_STALE]
  	  }

  	  set maxAge (mA) {
  	    if (typeof mA !== 'number')
  	      throw new TypeError('maxAge must be a non-negative number')

  	    this[MAX_AGE] = mA;
  	    trim(this);
  	  }
  	  get maxAge () {
  	    return this[MAX_AGE]
  	  }

  	  // resize the cache when the lengthCalculator changes.
  	  set lengthCalculator (lC) {
  	    if (typeof lC !== 'function')
  	      lC = naiveLength;

  	    if (lC !== this[LENGTH_CALCULATOR]) {
  	      this[LENGTH_CALCULATOR] = lC;
  	      this[LENGTH] = 0;
  	      this[LRU_LIST].forEach(hit => {
  	        hit.length = this[LENGTH_CALCULATOR](hit.value, hit.key);
  	        this[LENGTH] += hit.length;
  	      });
  	    }
  	    trim(this);
  	  }
  	  get lengthCalculator () { return this[LENGTH_CALCULATOR] }

  	  get length () { return this[LENGTH] }
  	  get itemCount () { return this[LRU_LIST].length }

  	  rforEach (fn, thisp) {
  	    thisp = thisp || this;
  	    for (let walker = this[LRU_LIST].tail; walker !== null;) {
  	      const prev = walker.prev;
  	      forEachStep(this, fn, walker, thisp);
  	      walker = prev;
  	    }
  	  }

  	  forEach (fn, thisp) {
  	    thisp = thisp || this;
  	    for (let walker = this[LRU_LIST].head; walker !== null;) {
  	      const next = walker.next;
  	      forEachStep(this, fn, walker, thisp);
  	      walker = next;
  	    }
  	  }

  	  keys () {
  	    return this[LRU_LIST].toArray().map(k => k.key)
  	  }

  	  values () {
  	    return this[LRU_LIST].toArray().map(k => k.value)
  	  }

  	  reset () {
  	    if (this[DISPOSE] &&
  	        this[LRU_LIST] &&
  	        this[LRU_LIST].length) {
  	      this[LRU_LIST].forEach(hit => this[DISPOSE](hit.key, hit.value));
  	    }

  	    this[CACHE] = new Map(); // hash of items by key
  	    this[LRU_LIST] = new Yallist(); // list of items in order of use recency
  	    this[LENGTH] = 0; // length of items in the list
  	  }

  	  dump () {
  	    return this[LRU_LIST].map(hit =>
  	      isStale(this, hit) ? false : {
  	        k: hit.key,
  	        v: hit.value,
  	        e: hit.now + (hit.maxAge || 0)
  	      }).toArray().filter(h => h)
  	  }

  	  dumpLru () {
  	    return this[LRU_LIST]
  	  }

  	  set (key, value, maxAge) {
  	    maxAge = maxAge || this[MAX_AGE];

  	    if (maxAge && typeof maxAge !== 'number')
  	      throw new TypeError('maxAge must be a number')

  	    const now = maxAge ? Date.now() : 0;
  	    const len = this[LENGTH_CALCULATOR](value, key);

  	    if (this[CACHE].has(key)) {
  	      if (len > this[MAX]) {
  	        del(this, this[CACHE].get(key));
  	        return false
  	      }

  	      const node = this[CACHE].get(key);
  	      const item = node.value;

  	      // dispose of the old one before overwriting
  	      // split out into 2 ifs for better coverage tracking
  	      if (this[DISPOSE]) {
  	        if (!this[NO_DISPOSE_ON_SET])
  	          this[DISPOSE](key, item.value);
  	      }

  	      item.now = now;
  	      item.maxAge = maxAge;
  	      item.value = value;
  	      this[LENGTH] += len - item.length;
  	      item.length = len;
  	      this.get(key);
  	      trim(this);
  	      return true
  	    }

  	    const hit = new Entry(key, value, len, now, maxAge);

  	    // oversized objects fall out of cache automatically.
  	    if (hit.length > this[MAX]) {
  	      if (this[DISPOSE])
  	        this[DISPOSE](key, value);

  	      return false
  	    }

  	    this[LENGTH] += hit.length;
  	    this[LRU_LIST].unshift(hit);
  	    this[CACHE].set(key, this[LRU_LIST].head);
  	    trim(this);
  	    return true
  	  }

  	  has (key) {
  	    if (!this[CACHE].has(key)) return false
  	    const hit = this[CACHE].get(key).value;
  	    return !isStale(this, hit)
  	  }

  	  get (key) {
  	    return get(this, key, true)
  	  }

  	  peek (key) {
  	    return get(this, key, false)
  	  }

  	  pop () {
  	    const node = this[LRU_LIST].tail;
  	    if (!node)
  	      return null

  	    del(this, node);
  	    return node.value
  	  }

  	  del (key) {
  	    del(this, this[CACHE].get(key));
  	  }

  	  load (arr) {
  	    // reset the cache
  	    this.reset();

  	    const now = Date.now();
  	    // A previous serialized cache has the most recent items first
  	    for (let l = arr.length - 1; l >= 0; l--) {
  	      const hit = arr[l];
  	      const expiresAt = hit.e || 0;
  	      if (expiresAt === 0)
  	        // the item was created without expiration in a non aged cache
  	        this.set(hit.k, hit.v);
  	      else {
  	        const maxAge = expiresAt - now;
  	        // dont add already expired items
  	        if (maxAge > 0) {
  	          this.set(hit.k, hit.v, maxAge);
  	        }
  	      }
  	    }
  	  }

  	  prune () {
  	    this[CACHE].forEach((value, key) => get(this, key, false));
  	  }
  	}

  	const get = (self, key, doUse) => {
  	  const node = self[CACHE].get(key);
  	  if (node) {
  	    const hit = node.value;
  	    if (isStale(self, hit)) {
  	      del(self, node);
  	      if (!self[ALLOW_STALE])
  	        return undefined
  	    } else {
  	      if (doUse) {
  	        if (self[UPDATE_AGE_ON_GET])
  	          node.value.now = Date.now();
  	        self[LRU_LIST].unshiftNode(node);
  	      }
  	    }
  	    return hit.value
  	  }
  	};

  	const isStale = (self, hit) => {
  	  if (!hit || (!hit.maxAge && !self[MAX_AGE]))
  	    return false

  	  const diff = Date.now() - hit.now;
  	  return hit.maxAge ? diff > hit.maxAge
  	    : self[MAX_AGE] && (diff > self[MAX_AGE])
  	};

  	const trim = self => {
  	  if (self[LENGTH] > self[MAX]) {
  	    for (let walker = self[LRU_LIST].tail;
  	      self[LENGTH] > self[MAX] && walker !== null;) {
  	      // We know that we're about to delete this one, and also
  	      // what the next least recently used key will be, so just
  	      // go ahead and set it now.
  	      const prev = walker.prev;
  	      del(self, walker);
  	      walker = prev;
  	    }
  	  }
  	};

  	const del = (self, node) => {
  	  if (node) {
  	    const hit = node.value;
  	    if (self[DISPOSE])
  	      self[DISPOSE](hit.key, hit.value);

  	    self[LENGTH] -= hit.length;
  	    self[CACHE].delete(hit.key);
  	    self[LRU_LIST].removeNode(node);
  	  }
  	};

  	class Entry {
  	  constructor (key, value, length, now, maxAge) {
  	    this.key = key;
  	    this.value = value;
  	    this.length = length;
  	    this.now = now;
  	    this.maxAge = maxAge || 0;
  	  }
  	}

  	const forEachStep = (self, fn, node, thisp) => {
  	  let hit = node.value;
  	  if (isStale(self, hit)) {
  	    del(self, node);
  	    if (!self[ALLOW_STALE])
  	      hit = undefined;
  	  }
  	  if (hit)
  	    fn.call(thisp, hit.value, hit.key, self);
  	};

  	lruCache = LRUCache;
  	return lruCache;
  }

  var range;
  var hasRequiredRange;

  function requireRange () {
  	if (hasRequiredRange) return range;
  	hasRequiredRange = 1;
  	// hoisted class for cyclic dependency
  	class Range {
  	  constructor (range, options) {
  	    options = parseOptions(options);

  	    if (range instanceof Range) {
  	      if (
  	        range.loose === !!options.loose &&
  	        range.includePrerelease === !!options.includePrerelease
  	      ) {
  	        return range
  	      } else {
  	        return new Range(range.raw, options)
  	      }
  	    }

  	    if (range instanceof Comparator) {
  	      // just put it in the set and return
  	      this.raw = range.value;
  	      this.set = [[range]];
  	      this.format();
  	      return this
  	    }

  	    this.options = options;
  	    this.loose = !!options.loose;
  	    this.includePrerelease = !!options.includePrerelease;

  	    // First reduce all whitespace as much as possible so we do not have to rely
  	    // on potentially slow regexes like \s*. This is then stored and used for
  	    // future error messages as well.
  	    this.raw = range
  	      .trim()
  	      .split(/\s+/)
  	      .join(' ');

  	    // First, split on ||
  	    this.set = this.raw
  	      .split('||')
  	      // map the range to a 2d array of comparators
  	      .map(r => this.parseRange(r.trim()))
  	      // throw out any comparator lists that are empty
  	      // this generally means that it was not a valid range, which is allowed
  	      // in loose mode, but will still throw if the WHOLE range is invalid.
  	      .filter(c => c.length);

  	    if (!this.set.length) {
  	      throw new TypeError(`Invalid SemVer Range: ${this.raw}`)
  	    }

  	    // if we have any that are not the null set, throw out null sets.
  	    if (this.set.length > 1) {
  	      // keep the first one, in case they're all null sets
  	      const first = this.set[0];
  	      this.set = this.set.filter(c => !isNullSet(c[0]));
  	      if (this.set.length === 0) {
  	        this.set = [first];
  	      } else if (this.set.length > 1) {
  	        // if we have any that are *, then the range is just *
  	        for (const c of this.set) {
  	          if (c.length === 1 && isAny(c[0])) {
  	            this.set = [c];
  	            break
  	          }
  	        }
  	      }
  	    }

  	    this.format();
  	  }

  	  format () {
  	    this.range = this.set
  	      .map((comps) => comps.join(' ').trim())
  	      .join('||')
  	      .trim();
  	    return this.range
  	  }

  	  toString () {
  	    return this.range
  	  }

  	  parseRange (range) {
  	    // memoize range parsing for performance.
  	    // this is a very hot path, and fully deterministic.
  	    const memoOpts =
  	      (this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) |
  	      (this.options.loose && FLAG_LOOSE);
  	    const memoKey = memoOpts + ':' + range;
  	    const cached = cache.get(memoKey);
  	    if (cached) {
  	      return cached
  	    }

  	    const loose = this.options.loose;
  	    // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
  	    const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
  	    range = range.replace(hr, hyphenReplace(this.options.includePrerelease));
  	    debug('hyphen replace', range);

  	    // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
  	    range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace);
  	    debug('comparator trim', range);

  	    // `~ 1.2.3` => `~1.2.3`
  	    range = range.replace(re[t.TILDETRIM], tildeTrimReplace);
  	    debug('tilde trim', range);

  	    // `^ 1.2.3` => `^1.2.3`
  	    range = range.replace(re[t.CARETTRIM], caretTrimReplace);
  	    debug('caret trim', range);

  	    // At this point, the range is completely trimmed and
  	    // ready to be split into comparators.

  	    let rangeList = range
  	      .split(' ')
  	      .map(comp => parseComparator(comp, this.options))
  	      .join(' ')
  	      .split(/\s+/)
  	      // >=0.0.0 is equivalent to *
  	      .map(comp => replaceGTE0(comp, this.options));

  	    if (loose) {
  	      // in loose mode, throw out any that are not valid comparators
  	      rangeList = rangeList.filter(comp => {
  	        debug('loose invalid filter', comp, this.options);
  	        return !!comp.match(re[t.COMPARATORLOOSE])
  	      });
  	    }
  	    debug('range list', rangeList);

  	    // if any comparators are the null set, then replace with JUST null set
  	    // if more than one comparator, remove any * comparators
  	    // also, don't include the same comparator more than once
  	    const rangeMap = new Map();
  	    const comparators = rangeList.map(comp => new Comparator(comp, this.options));
  	    for (const comp of comparators) {
  	      if (isNullSet(comp)) {
  	        return [comp]
  	      }
  	      rangeMap.set(comp.value, comp);
  	    }
  	    if (rangeMap.size > 1 && rangeMap.has('')) {
  	      rangeMap.delete('');
  	    }

  	    const result = [...rangeMap.values()];
  	    cache.set(memoKey, result);
  	    return result
  	  }

  	  intersects (range, options) {
  	    if (!(range instanceof Range)) {
  	      throw new TypeError('a Range is required')
  	    }

  	    return this.set.some((thisComparators) => {
  	      return (
  	        isSatisfiable(thisComparators, options) &&
  	        range.set.some((rangeComparators) => {
  	          return (
  	            isSatisfiable(rangeComparators, options) &&
  	            thisComparators.every((thisComparator) => {
  	              return rangeComparators.every((rangeComparator) => {
  	                return thisComparator.intersects(rangeComparator, options)
  	              })
  	            })
  	          )
  	        })
  	      )
  	    })
  	  }

  	  // if ANY of the sets match ALL of its comparators, then pass
  	  test (version) {
  	    if (!version) {
  	      return false
  	    }

  	    if (typeof version === 'string') {
  	      try {
  	        version = new SemVer(version, this.options);
  	      } catch (er) {
  	        return false
  	      }
  	    }

  	    for (let i = 0; i < this.set.length; i++) {
  	      if (testSet(this.set[i], version, this.options)) {
  	        return true
  	      }
  	    }
  	    return false
  	  }
  	}

  	range = Range;

  	const LRU = requireLruCache();
  	const cache = new LRU({ max: 1000 });

  	const parseOptions = parseOptions_1;
  	const Comparator = requireComparator();
  	const debug = debug_1;
  	const SemVer = semver$2;
  	const {
  	  safeRe: re,
  	  t,
  	  comparatorTrimReplace,
  	  tildeTrimReplace,
  	  caretTrimReplace,
  	} = reExports;
  	const { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = constants$1;

  	const isNullSet = c => c.value === '<0.0.0-0';
  	const isAny = c => c.value === '';

  	// take a set of comparators and determine whether there
  	// exists a version which can satisfy it
  	const isSatisfiable = (comparators, options) => {
  	  let result = true;
  	  const remainingComparators = comparators.slice();
  	  let testComparator = remainingComparators.pop();

  	  while (result && remainingComparators.length) {
  	    result = remainingComparators.every((otherComparator) => {
  	      return testComparator.intersects(otherComparator, options)
  	    });

  	    testComparator = remainingComparators.pop();
  	  }

  	  return result
  	};

  	// comprised of xranges, tildes, stars, and gtlt's at this point.
  	// already replaced the hyphen ranges
  	// turn into a set of JUST comparators.
  	const parseComparator = (comp, options) => {
  	  debug('comp', comp, options);
  	  comp = replaceCarets(comp, options);
  	  debug('caret', comp);
  	  comp = replaceTildes(comp, options);
  	  debug('tildes', comp);
  	  comp = replaceXRanges(comp, options);
  	  debug('xrange', comp);
  	  comp = replaceStars(comp, options);
  	  debug('stars', comp);
  	  return comp
  	};

  	const isX = id => !id || id.toLowerCase() === 'x' || id === '*';

  	// ~, ~> --> * (any, kinda silly)
  	// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0-0
  	// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0-0
  	// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0-0
  	// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0-0
  	// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0-0
  	// ~0.0.1 --> >=0.0.1 <0.1.0-0
  	const replaceTildes = (comp, options) => {
  	  return comp
  	    .trim()
  	    .split(/\s+/)
  	    .map((c) => replaceTilde(c, options))
  	    .join(' ')
  	};

  	const replaceTilde = (comp, options) => {
  	  const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE];
  	  return comp.replace(r, (_, M, m, p, pr) => {
  	    debug('tilde', comp, _, M, m, p, pr);
  	    let ret;

  	    if (isX(M)) {
  	      ret = '';
  	    } else if (isX(m)) {
  	      ret = `>=${M}.0.0 <${+M + 1}.0.0-0`;
  	    } else if (isX(p)) {
  	      // ~1.2 == >=1.2.0 <1.3.0-0
  	      ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`;
  	    } else if (pr) {
  	      debug('replaceTilde pr', pr);
  	      ret = `>=${M}.${m}.${p}-${pr
	      } <${M}.${+m + 1}.0-0`;
  	    } else {
  	      // ~1.2.3 == >=1.2.3 <1.3.0-0
  	      ret = `>=${M}.${m}.${p
	      } <${M}.${+m + 1}.0-0`;
  	    }

  	    debug('tilde return', ret);
  	    return ret
  	  })
  	};

  	// ^ --> * (any, kinda silly)
  	// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0-0
  	// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0-0
  	// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0-0
  	// ^1.2.3 --> >=1.2.3 <2.0.0-0
  	// ^1.2.0 --> >=1.2.0 <2.0.0-0
  	// ^0.0.1 --> >=0.0.1 <0.0.2-0
  	// ^0.1.0 --> >=0.1.0 <0.2.0-0
  	const replaceCarets = (comp, options) => {
  	  return comp
  	    .trim()
  	    .split(/\s+/)
  	    .map((c) => replaceCaret(c, options))
  	    .join(' ')
  	};

  	const replaceCaret = (comp, options) => {
  	  debug('caret', comp, options);
  	  const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET];
  	  const z = options.includePrerelease ? '-0' : '';
  	  return comp.replace(r, (_, M, m, p, pr) => {
  	    debug('caret', comp, _, M, m, p, pr);
  	    let ret;

  	    if (isX(M)) {
  	      ret = '';
  	    } else if (isX(m)) {
  	      ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
  	    } else if (isX(p)) {
  	      if (M === '0') {
  	        ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
  	      } else {
  	        ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
  	      }
  	    } else if (pr) {
  	      debug('replaceCaret pr', pr);
  	      if (M === '0') {
  	        if (m === '0') {
  	          ret = `>=${M}.${m}.${p}-${pr
	          } <${M}.${m}.${+p + 1}-0`;
  	        } else {
  	          ret = `>=${M}.${m}.${p}-${pr
	          } <${M}.${+m + 1}.0-0`;
  	        }
  	      } else {
  	        ret = `>=${M}.${m}.${p}-${pr
	        } <${+M + 1}.0.0-0`;
  	      }
  	    } else {
  	      debug('no pr');
  	      if (M === '0') {
  	        if (m === '0') {
  	          ret = `>=${M}.${m}.${p
	          }${z} <${M}.${m}.${+p + 1}-0`;
  	        } else {
  	          ret = `>=${M}.${m}.${p
	          }${z} <${M}.${+m + 1}.0-0`;
  	        }
  	      } else {
  	        ret = `>=${M}.${m}.${p
	        } <${+M + 1}.0.0-0`;
  	      }
  	    }

  	    debug('caret return', ret);
  	    return ret
  	  })
  	};

  	const replaceXRanges = (comp, options) => {
  	  debug('replaceXRanges', comp, options);
  	  return comp
  	    .split(/\s+/)
  	    .map((c) => replaceXRange(c, options))
  	    .join(' ')
  	};

  	const replaceXRange = (comp, options) => {
  	  comp = comp.trim();
  	  const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
  	  return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
  	    debug('xRange', comp, ret, gtlt, M, m, p, pr);
  	    const xM = isX(M);
  	    const xm = xM || isX(m);
  	    const xp = xm || isX(p);
  	    const anyX = xp;

  	    if (gtlt === '=' && anyX) {
  	      gtlt = '';
  	    }

  	    // if we're including prereleases in the match, then we need
  	    // to fix this to -0, the lowest possible prerelease value
  	    pr = options.includePrerelease ? '-0' : '';

  	    if (xM) {
  	      if (gtlt === '>' || gtlt === '<') {
  	        // nothing is allowed
  	        ret = '<0.0.0-0';
  	      } else {
  	        // nothing is forbidden
  	        ret = '*';
  	      }
  	    } else if (gtlt && anyX) {
  	      // we know patch is an x, because we have any x at all.
  	      // replace X with 0
  	      if (xm) {
  	        m = 0;
  	      }
  	      p = 0;

  	      if (gtlt === '>') {
  	        // >1 => >=2.0.0
  	        // >1.2 => >=1.3.0
  	        gtlt = '>=';
  	        if (xm) {
  	          M = +M + 1;
  	          m = 0;
  	          p = 0;
  	        } else {
  	          m = +m + 1;
  	          p = 0;
  	        }
  	      } else if (gtlt === '<=') {
  	        // <=0.7.x is actually <0.8.0, since any 0.7.x should
  	        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
  	        gtlt = '<';
  	        if (xm) {
  	          M = +M + 1;
  	        } else {
  	          m = +m + 1;
  	        }
  	      }

  	      if (gtlt === '<') {
  	        pr = '-0';
  	      }

  	      ret = `${gtlt + M}.${m}.${p}${pr}`;
  	    } else if (xm) {
  	      ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
  	    } else if (xp) {
  	      ret = `>=${M}.${m}.0${pr
	      } <${M}.${+m + 1}.0-0`;
  	    }

  	    debug('xRange return', ret);

  	    return ret
  	  })
  	};

  	// Because * is AND-ed with everything else in the comparator,
  	// and '' means "any version", just remove the *s entirely.
  	const replaceStars = (comp, options) => {
  	  debug('replaceStars', comp, options);
  	  // Looseness is ignored here.  star is always as loose as it gets!
  	  return comp
  	    .trim()
  	    .replace(re[t.STAR], '')
  	};

  	const replaceGTE0 = (comp, options) => {
  	  debug('replaceGTE0', comp, options);
  	  return comp
  	    .trim()
  	    .replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], '')
  	};

  	// This function is passed to string.replace(re[t.HYPHENRANGE])
  	// M, m, patch, prerelease, build
  	// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
  	// 1.2.3 - 3.4 => >=1.2.0 <3.5.0-0 Any 3.4.x will do
  	// 1.2 - 3.4 => >=1.2.0 <3.5.0-0
  	const hyphenReplace = incPr => ($0,
  	  from, fM, fm, fp, fpr, fb,
  	  to, tM, tm, tp, tpr, tb) => {
  	  if (isX(fM)) {
  	    from = '';
  	  } else if (isX(fm)) {
  	    from = `>=${fM}.0.0${incPr ? '-0' : ''}`;
  	  } else if (isX(fp)) {
  	    from = `>=${fM}.${fm}.0${incPr ? '-0' : ''}`;
  	  } else if (fpr) {
  	    from = `>=${from}`;
  	  } else {
  	    from = `>=${from}${incPr ? '-0' : ''}`;
  	  }

  	  if (isX(tM)) {
  	    to = '';
  	  } else if (isX(tm)) {
  	    to = `<${+tM + 1}.0.0-0`;
  	  } else if (isX(tp)) {
  	    to = `<${tM}.${+tm + 1}.0-0`;
  	  } else if (tpr) {
  	    to = `<=${tM}.${tm}.${tp}-${tpr}`;
  	  } else if (incPr) {
  	    to = `<${tM}.${tm}.${+tp + 1}-0`;
  	  } else {
  	    to = `<=${to}`;
  	  }

  	  return `${from} ${to}`.trim()
  	};

  	const testSet = (set, version, options) => {
  	  for (let i = 0; i < set.length; i++) {
  	    if (!set[i].test(version)) {
  	      return false
  	    }
  	  }

  	  if (version.prerelease.length && !options.includePrerelease) {
  	    // Find the set of versions that are allowed to have prereleases
  	    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
  	    // That should allow `1.2.3-pr.2` to pass.
  	    // However, `1.2.4-alpha.notready` should NOT be allowed,
  	    // even though it's within the range set by the comparators.
  	    for (let i = 0; i < set.length; i++) {
  	      debug(set[i].semver);
  	      if (set[i].semver === Comparator.ANY) {
  	        continue
  	      }

  	      if (set[i].semver.prerelease.length > 0) {
  	        const allowed = set[i].semver;
  	        if (allowed.major === version.major &&
  	            allowed.minor === version.minor &&
  	            allowed.patch === version.patch) {
  	          return true
  	        }
  	      }
  	    }

  	    // Version has a -pre, but it's not one of the ones we like.
  	    return false
  	  }

  	  return true
  	};
  	return range;
  }

  var comparator;
  var hasRequiredComparator;

  function requireComparator () {
  	if (hasRequiredComparator) return comparator;
  	hasRequiredComparator = 1;
  	const ANY = Symbol('SemVer ANY');
  	// hoisted class for cyclic dependency
  	class Comparator {
  	  static get ANY () {
  	    return ANY
  	  }

  	  constructor (comp, options) {
  	    options = parseOptions(options);

  	    if (comp instanceof Comparator) {
  	      if (comp.loose === !!options.loose) {
  	        return comp
  	      } else {
  	        comp = comp.value;
  	      }
  	    }

  	    comp = comp.trim().split(/\s+/).join(' ');
  	    debug('comparator', comp, options);
  	    this.options = options;
  	    this.loose = !!options.loose;
  	    this.parse(comp);

  	    if (this.semver === ANY) {
  	      this.value = '';
  	    } else {
  	      this.value = this.operator + this.semver.version;
  	    }

  	    debug('comp', this);
  	  }

  	  parse (comp) {
  	    const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
  	    const m = comp.match(r);

  	    if (!m) {
  	      throw new TypeError(`Invalid comparator: ${comp}`)
  	    }

  	    this.operator = m[1] !== undefined ? m[1] : '';
  	    if (this.operator === '=') {
  	      this.operator = '';
  	    }

  	    // if it literally is just '>' or '' then allow anything.
  	    if (!m[2]) {
  	      this.semver = ANY;
  	    } else {
  	      this.semver = new SemVer(m[2], this.options.loose);
  	    }
  	  }

  	  toString () {
  	    return this.value
  	  }

  	  test (version) {
  	    debug('Comparator.test', version, this.options.loose);

  	    if (this.semver === ANY || version === ANY) {
  	      return true
  	    }

  	    if (typeof version === 'string') {
  	      try {
  	        version = new SemVer(version, this.options);
  	      } catch (er) {
  	        return false
  	      }
  	    }

  	    return cmp(version, this.operator, this.semver, this.options)
  	  }

  	  intersects (comp, options) {
  	    if (!(comp instanceof Comparator)) {
  	      throw new TypeError('a Comparator is required')
  	    }

  	    if (this.operator === '') {
  	      if (this.value === '') {
  	        return true
  	      }
  	      return new Range(comp.value, options).test(this.value)
  	    } else if (comp.operator === '') {
  	      if (comp.value === '') {
  	        return true
  	      }
  	      return new Range(this.value, options).test(comp.semver)
  	    }

  	    options = parseOptions(options);

  	    // Special cases where nothing can possibly be lower
  	    if (options.includePrerelease &&
  	      (this.value === '<0.0.0-0' || comp.value === '<0.0.0-0')) {
  	      return false
  	    }
  	    if (!options.includePrerelease &&
  	      (this.value.startsWith('<0.0.0') || comp.value.startsWith('<0.0.0'))) {
  	      return false
  	    }

  	    // Same direction increasing (> or >=)
  	    if (this.operator.startsWith('>') && comp.operator.startsWith('>')) {
  	      return true
  	    }
  	    // Same direction decreasing (< or <=)
  	    if (this.operator.startsWith('<') && comp.operator.startsWith('<')) {
  	      return true
  	    }
  	    // same SemVer and both sides are inclusive (<= or >=)
  	    if (
  	      (this.semver.version === comp.semver.version) &&
  	      this.operator.includes('=') && comp.operator.includes('=')) {
  	      return true
  	    }
  	    // opposite directions less than
  	    if (cmp(this.semver, '<', comp.semver, options) &&
  	      this.operator.startsWith('>') && comp.operator.startsWith('<')) {
  	      return true
  	    }
  	    // opposite directions greater than
  	    if (cmp(this.semver, '>', comp.semver, options) &&
  	      this.operator.startsWith('<') && comp.operator.startsWith('>')) {
  	      return true
  	    }
  	    return false
  	  }
  	}

  	comparator = Comparator;

  	const parseOptions = parseOptions_1;
  	const { safeRe: re, t } = reExports;
  	const cmp = cmp_1;
  	const debug = debug_1;
  	const SemVer = semver$2;
  	const Range = requireRange();
  	return comparator;
  }

  const Range$9 = requireRange();
  const satisfies$4 = (version, range, options) => {
    try {
      range = new Range$9(range, options);
    } catch (er) {
      return false
    }
    return range.test(version)
  };
  var satisfies_1 = satisfies$4;

  const Range$8 = requireRange();

  // Mostly just for testing and legacy API reasons
  const toComparators$1 = (range, options) =>
    new Range$8(range, options).set
      .map(comp => comp.map(c => c.value).join(' ').trim().split(' '));

  var toComparators_1 = toComparators$1;

  const SemVer$4 = semver$2;
  const Range$7 = requireRange();

  const maxSatisfying$1 = (versions, range, options) => {
    let max = null;
    let maxSV = null;
    let rangeObj = null;
    try {
      rangeObj = new Range$7(range, options);
    } catch (er) {
      return null
    }
    versions.forEach((v) => {
      if (rangeObj.test(v)) {
        // satisfies(v, range, options)
        if (!max || maxSV.compare(v) === -1) {
          // compare(max, v, true)
          max = v;
          maxSV = new SemVer$4(max, options);
        }
      }
    });
    return max
  };
  var maxSatisfying_1 = maxSatisfying$1;

  const SemVer$3 = semver$2;
  const Range$6 = requireRange();
  const minSatisfying$1 = (versions, range, options) => {
    let min = null;
    let minSV = null;
    let rangeObj = null;
    try {
      rangeObj = new Range$6(range, options);
    } catch (er) {
      return null
    }
    versions.forEach((v) => {
      if (rangeObj.test(v)) {
        // satisfies(v, range, options)
        if (!min || minSV.compare(v) === 1) {
          // compare(min, v, true)
          min = v;
          minSV = new SemVer$3(min, options);
        }
      }
    });
    return min
  };
  var minSatisfying_1 = minSatisfying$1;

  const SemVer$2 = semver$2;
  const Range$5 = requireRange();
  const gt$2 = gt_1;

  const minVersion$1 = (range, loose) => {
    range = new Range$5(range, loose);

    let minver = new SemVer$2('0.0.0');
    if (range.test(minver)) {
      return minver
    }

    minver = new SemVer$2('0.0.0-0');
    if (range.test(minver)) {
      return minver
    }

    minver = null;
    for (let i = 0; i < range.set.length; ++i) {
      const comparators = range.set[i];

      let setMin = null;
      comparators.forEach((comparator) => {
        // Clone to avoid manipulating the comparator's semver object.
        const compver = new SemVer$2(comparator.semver.version);
        switch (comparator.operator) {
          case '>':
            if (compver.prerelease.length === 0) {
              compver.patch++;
            } else {
              compver.prerelease.push(0);
            }
            compver.raw = compver.format();
            /* fallthrough */
          case '':
          case '>=':
            if (!setMin || gt$2(compver, setMin)) {
              setMin = compver;
            }
            break
          case '<':
          case '<=':
            /* Ignore maximum versions */
            break
          /* istanbul ignore next */
          default:
            throw new Error(`Unexpected operation: ${comparator.operator}`)
        }
      });
      if (setMin && (!minver || gt$2(minver, setMin))) {
        minver = setMin;
      }
    }

    if (minver && range.test(minver)) {
      return minver
    }

    return null
  };
  var minVersion_1 = minVersion$1;

  const Range$4 = requireRange();
  const validRange$1 = (range, options) => {
    try {
      // Return '*' instead of '' so that truthiness works.
      // This will throw if it's invalid anyway
      return new Range$4(range, options).range || '*'
    } catch (er) {
      return null
    }
  };
  var valid$1 = validRange$1;

  const SemVer$1 = semver$2;
  const Comparator$2 = requireComparator();
  const { ANY: ANY$1 } = Comparator$2;
  const Range$3 = requireRange();
  const satisfies$3 = satisfies_1;
  const gt$1 = gt_1;
  const lt$1 = lt_1;
  const lte$1 = lte_1;
  const gte$1 = gte_1;

  const outside$3 = (version, range, hilo, options) => {
    version = new SemVer$1(version, options);
    range = new Range$3(range, options);

    let gtfn, ltefn, ltfn, comp, ecomp;
    switch (hilo) {
      case '>':
        gtfn = gt$1;
        ltefn = lte$1;
        ltfn = lt$1;
        comp = '>';
        ecomp = '>=';
        break
      case '<':
        gtfn = lt$1;
        ltefn = gte$1;
        ltfn = gt$1;
        comp = '<';
        ecomp = '<=';
        break
      default:
        throw new TypeError('Must provide a hilo val of "<" or ">"')
    }

    // If it satisfies the range it is not outside
    if (satisfies$3(version, range, options)) {
      return false
    }

    // From now on, variable terms are as if we're in "gtr" mode.
    // but note that everything is flipped for the "ltr" function.

    for (let i = 0; i < range.set.length; ++i) {
      const comparators = range.set[i];

      let high = null;
      let low = null;

      comparators.forEach((comparator) => {
        if (comparator.semver === ANY$1) {
          comparator = new Comparator$2('>=0.0.0');
        }
        high = high || comparator;
        low = low || comparator;
        if (gtfn(comparator.semver, high.semver, options)) {
          high = comparator;
        } else if (ltfn(comparator.semver, low.semver, options)) {
          low = comparator;
        }
      });

      // If the edge version comparator has a operator then our version
      // isn't outside it
      if (high.operator === comp || high.operator === ecomp) {
        return false
      }

      // If the lowest version comparator has an operator and our version
      // is less than it then it isn't higher than the range
      if ((!low.operator || low.operator === comp) &&
          ltefn(version, low.semver)) {
        return false
      } else if (low.operator === ecomp && ltfn(version, low.semver)) {
        return false
      }
    }
    return true
  };

  var outside_1 = outside$3;

  // Determine if version is greater than all the versions possible in the range.
  const outside$2 = outside_1;
  const gtr$1 = (version, range, options) => outside$2(version, range, '>', options);
  var gtr_1 = gtr$1;

  const outside$1 = outside_1;
  // Determine if version is less than all the versions possible in the range
  const ltr$1 = (version, range, options) => outside$1(version, range, '<', options);
  var ltr_1 = ltr$1;

  const Range$2 = requireRange();
  const intersects$1 = (r1, r2, options) => {
    r1 = new Range$2(r1, options);
    r2 = new Range$2(r2, options);
    return r1.intersects(r2, options)
  };
  var intersects_1 = intersects$1;

  // given a set of versions and a range, create a "simplified" range
  // that includes the same versions that the original range does
  // If the original range is shorter than the simplified one, return that.
  const satisfies$2 = satisfies_1;
  const compare$2 = compare_1;
  var simplify = (versions, range, options) => {
    const set = [];
    let first = null;
    let prev = null;
    const v = versions.sort((a, b) => compare$2(a, b, options));
    for (const version of v) {
      const included = satisfies$2(version, range, options);
      if (included) {
        prev = version;
        if (!first) {
          first = version;
        }
      } else {
        if (prev) {
          set.push([first, prev]);
        }
        prev = null;
        first = null;
      }
    }
    if (first) {
      set.push([first, null]);
    }

    const ranges = [];
    for (const [min, max] of set) {
      if (min === max) {
        ranges.push(min);
      } else if (!max && min === v[0]) {
        ranges.push('*');
      } else if (!max) {
        ranges.push(`>=${min}`);
      } else if (min === v[0]) {
        ranges.push(`<=${max}`);
      } else {
        ranges.push(`${min} - ${max}`);
      }
    }
    const simplified = ranges.join(' || ');
    const original = typeof range.raw === 'string' ? range.raw : String(range);
    return simplified.length < original.length ? simplified : range
  };

  const Range$1 = requireRange();
  const Comparator$1 = requireComparator();
  const { ANY } = Comparator$1;
  const satisfies$1 = satisfies_1;
  const compare$1 = compare_1;

  // Complex range `r1 || r2 || ...` is a subset of `R1 || R2 || ...` iff:
  // - Every simple range `r1, r2, ...` is a null set, OR
  // - Every simple range `r1, r2, ...` which is not a null set is a subset of
  //   some `R1, R2, ...`
  //
  // Simple range `c1 c2 ...` is a subset of simple range `C1 C2 ...` iff:
  // - If c is only the ANY comparator
  //   - If C is only the ANY comparator, return true
  //   - Else if in prerelease mode, return false
  //   - else replace c with `[>=0.0.0]`
  // - If C is only the ANY comparator
  //   - if in prerelease mode, return true
  //   - else replace C with `[>=0.0.0]`
  // - Let EQ be the set of = comparators in c
  // - If EQ is more than one, return true (null set)
  // - Let GT be the highest > or >= comparator in c
  // - Let LT be the lowest < or <= comparator in c
  // - If GT and LT, and GT.semver > LT.semver, return true (null set)
  // - If any C is a = range, and GT or LT are set, return false
  // - If EQ
  //   - If GT, and EQ does not satisfy GT, return true (null set)
  //   - If LT, and EQ does not satisfy LT, return true (null set)
  //   - If EQ satisfies every C, return true
  //   - Else return false
  // - If GT
  //   - If GT.semver is lower than any > or >= comp in C, return false
  //   - If GT is >=, and GT.semver does not satisfy every C, return false
  //   - If GT.semver has a prerelease, and not in prerelease mode
  //     - If no C has a prerelease and the GT.semver tuple, return false
  // - If LT
  //   - If LT.semver is greater than any < or <= comp in C, return false
  //   - If LT is <=, and LT.semver does not satisfy every C, return false
  //   - If GT.semver has a prerelease, and not in prerelease mode
  //     - If no C has a prerelease and the LT.semver tuple, return false
  // - Else return true

  const subset$1 = (sub, dom, options = {}) => {
    if (sub === dom) {
      return true
    }

    sub = new Range$1(sub, options);
    dom = new Range$1(dom, options);
    let sawNonNull = false;

    OUTER: for (const simpleSub of sub.set) {
      for (const simpleDom of dom.set) {
        const isSub = simpleSubset(simpleSub, simpleDom, options);
        sawNonNull = sawNonNull || isSub !== null;
        if (isSub) {
          continue OUTER
        }
      }
      // the null set is a subset of everything, but null simple ranges in
      // a complex range should be ignored.  so if we saw a non-null range,
      // then we know this isn't a subset, but if EVERY simple range was null,
      // then it is a subset.
      if (sawNonNull) {
        return false
      }
    }
    return true
  };

  const minimumVersionWithPreRelease = [new Comparator$1('>=0.0.0-0')];
  const minimumVersion = [new Comparator$1('>=0.0.0')];

  const simpleSubset = (sub, dom, options) => {
    if (sub === dom) {
      return true
    }

    if (sub.length === 1 && sub[0].semver === ANY) {
      if (dom.length === 1 && dom[0].semver === ANY) {
        return true
      } else if (options.includePrerelease) {
        sub = minimumVersionWithPreRelease;
      } else {
        sub = minimumVersion;
      }
    }

    if (dom.length === 1 && dom[0].semver === ANY) {
      if (options.includePrerelease) {
        return true
      } else {
        dom = minimumVersion;
      }
    }

    const eqSet = new Set();
    let gt, lt;
    for (const c of sub) {
      if (c.operator === '>' || c.operator === '>=') {
        gt = higherGT(gt, c, options);
      } else if (c.operator === '<' || c.operator === '<=') {
        lt = lowerLT(lt, c, options);
      } else {
        eqSet.add(c.semver);
      }
    }

    if (eqSet.size > 1) {
      return null
    }

    let gtltComp;
    if (gt && lt) {
      gtltComp = compare$1(gt.semver, lt.semver, options);
      if (gtltComp > 0) {
        return null
      } else if (gtltComp === 0 && (gt.operator !== '>=' || lt.operator !== '<=')) {
        return null
      }
    }

    // will iterate one or zero times
    for (const eq of eqSet) {
      if (gt && !satisfies$1(eq, String(gt), options)) {
        return null
      }

      if (lt && !satisfies$1(eq, String(lt), options)) {
        return null
      }

      for (const c of dom) {
        if (!satisfies$1(eq, String(c), options)) {
          return false
        }
      }

      return true
    }

    let higher, lower;
    let hasDomLT, hasDomGT;
    // if the subset has a prerelease, we need a comparator in the superset
    // with the same tuple and a prerelease, or it's not a subset
    let needDomLTPre = lt &&
      !options.includePrerelease &&
      lt.semver.prerelease.length ? lt.semver : false;
    let needDomGTPre = gt &&
      !options.includePrerelease &&
      gt.semver.prerelease.length ? gt.semver : false;
    // exception: <1.2.3-0 is the same as <1.2.3
    if (needDomLTPre && needDomLTPre.prerelease.length === 1 &&
        lt.operator === '<' && needDomLTPre.prerelease[0] === 0) {
      needDomLTPre = false;
    }

    for (const c of dom) {
      hasDomGT = hasDomGT || c.operator === '>' || c.operator === '>=';
      hasDomLT = hasDomLT || c.operator === '<' || c.operator === '<=';
      if (gt) {
        if (needDomGTPre) {
          if (c.semver.prerelease && c.semver.prerelease.length &&
              c.semver.major === needDomGTPre.major &&
              c.semver.minor === needDomGTPre.minor &&
              c.semver.patch === needDomGTPre.patch) {
            needDomGTPre = false;
          }
        }
        if (c.operator === '>' || c.operator === '>=') {
          higher = higherGT(gt, c, options);
          if (higher === c && higher !== gt) {
            return false
          }
        } else if (gt.operator === '>=' && !satisfies$1(gt.semver, String(c), options)) {
          return false
        }
      }
      if (lt) {
        if (needDomLTPre) {
          if (c.semver.prerelease && c.semver.prerelease.length &&
              c.semver.major === needDomLTPre.major &&
              c.semver.minor === needDomLTPre.minor &&
              c.semver.patch === needDomLTPre.patch) {
            needDomLTPre = false;
          }
        }
        if (c.operator === '<' || c.operator === '<=') {
          lower = lowerLT(lt, c, options);
          if (lower === c && lower !== lt) {
            return false
          }
        } else if (lt.operator === '<=' && !satisfies$1(lt.semver, String(c), options)) {
          return false
        }
      }
      if (!c.operator && (lt || gt) && gtltComp !== 0) {
        return false
      }
    }

    // if there was a < or >, and nothing in the dom, then must be false
    // UNLESS it was limited by another range in the other direction.
    // Eg, >1.0.0 <1.0.1 is still a subset of <2.0.0
    if (gt && hasDomLT && !lt && gtltComp !== 0) {
      return false
    }

    if (lt && hasDomGT && !gt && gtltComp !== 0) {
      return false
    }

    // we needed a prerelease range in a specific tuple, but didn't get one
    // then this isn't a subset.  eg >=1.2.3-pre is not a subset of >=1.0.0,
    // because it includes prereleases in the 1.2.3 tuple
    if (needDomGTPre || needDomLTPre) {
      return false
    }

    return true
  };

  // >=1.2.3 is lower than >1.2.3
  const higherGT = (a, b, options) => {
    if (!a) {
      return b
    }
    const comp = compare$1(a.semver, b.semver, options);
    return comp > 0 ? a
      : comp < 0 ? b
      : b.operator === '>' && a.operator === '>=' ? b
      : a
  };

  // <=1.2.3 is higher than <1.2.3
  const lowerLT = (a, b, options) => {
    if (!a) {
      return b
    }
    const comp = compare$1(a.semver, b.semver, options);
    return comp < 0 ? a
      : comp > 0 ? b
      : b.operator === '<' && a.operator === '<=' ? b
      : a
  };

  var subset_1 = subset$1;

  // just pre-load all the stuff that index.js lazily exports
  const internalRe = reExports;
  const constants = constants$1;
  const SemVer = semver$2;
  const identifiers = identifiers$1;
  const parse = parse_1;
  const valid = valid_1;
  const clean = clean_1;
  const inc = inc_1;
  const diff = diff_1;
  const major = major_1;
  const minor = minor_1;
  const patch = patch_1;
  const prerelease = prerelease_1;
  const compare = compare_1;
  const rcompare = rcompare_1;
  const compareLoose = compareLoose_1;
  const compareBuild = compareBuild_1;
  const sort = sort_1;
  const rsort = rsort_1;
  const gt = gt_1;
  const lt = lt_1;
  const eq = eq_1;
  const neq = neq_1;
  const gte = gte_1;
  const lte = lte_1;
  const cmp = cmp_1;
  const coerce = coerce_1;
  const Comparator = requireComparator();
  const Range = requireRange();
  const satisfies = satisfies_1;
  const toComparators = toComparators_1;
  const maxSatisfying = maxSatisfying_1;
  const minSatisfying = minSatisfying_1;
  const minVersion = minVersion_1;
  const validRange = valid$1;
  const outside = outside_1;
  const gtr = gtr_1;
  const ltr = ltr_1;
  const intersects = intersects_1;
  const simplifyRange = simplify;
  const subset = subset_1;
  var semver = {
    parse,
    valid,
    clean,
    inc,
    diff,
    major,
    minor,
    patch,
    prerelease,
    compare,
    rcompare,
    compareLoose,
    compareBuild,
    sort,
    rsort,
    gt,
    lt,
    eq,
    neq,
    gte,
    lte,
    cmp,
    coerce,
    Comparator,
    Range,
    satisfies,
    toComparators,
    maxSatisfying,
    minSatisfying,
    minVersion,
    validRange,
    outside,
    gtr,
    ltr,
    intersects,
    simplifyRange,
    subset,
    SemVer,
    re: internalRe.re,
    src: internalRe.src,
    tokens: internalRe.t,
    SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
    RELEASE_TYPES: constants.RELEASE_TYPES,
    compareIdentifiers: identifiers.compareIdentifiers,
    rcompareIdentifiers: identifiers.rcompareIdentifiers,
  };

  var semver$1 = /*@__PURE__*/getDefaultExportFromCjs(semver);

  var domain;

  // This constructor is used to store event handlers. Instantiating this is
  // faster than explicitly calling `Object.create(null)` to get a "clean" empty
  // object (tested with v8 v4.9).
  function EventHandlers() {}
  EventHandlers.prototype = Object.create(null);

  function EventEmitter$1() {
    EventEmitter$1.init.call(this);
  }

  // nodejs oddity
  // require('events') === require('events').EventEmitter
  EventEmitter$1.EventEmitter = EventEmitter$1;

  EventEmitter$1.usingDomains = false;

  EventEmitter$1.prototype.domain = undefined;
  EventEmitter$1.prototype._events = undefined;
  EventEmitter$1.prototype._maxListeners = undefined;

  // By default EventEmitters will print a warning if more than 10 listeners are
  // added to it. This is a useful default which helps finding memory leaks.
  EventEmitter$1.defaultMaxListeners = 10;

  EventEmitter$1.init = function() {
    this.domain = null;
    if (EventEmitter$1.usingDomains) {
      // if there is an active domain, then attach to it.
      if (domain.active && !(this instanceof domain.Domain)) {
        this.domain = domain.active;
      }
    }

    if (!this._events || this._events === Object.getPrototypeOf(this)._events) {
      this._events = new EventHandlers();
      this._eventsCount = 0;
    }

    this._maxListeners = this._maxListeners || undefined;
  };

  // Obviously not all Emitters should be limited to 10. This function allows
  // that to be increased. Set to zero for unlimited.
  EventEmitter$1.prototype.setMaxListeners = function setMaxListeners(n) {
    if (typeof n !== 'number' || n < 0 || isNaN(n))
      throw new TypeError('"n" argument must be a positive number');
    this._maxListeners = n;
    return this;
  };

  function $getMaxListeners(that) {
    if (that._maxListeners === undefined)
      return EventEmitter$1.defaultMaxListeners;
    return that._maxListeners;
  }

  EventEmitter$1.prototype.getMaxListeners = function getMaxListeners() {
    return $getMaxListeners(this);
  };

  // These standalone emit* functions are used to optimize calling of event
  // handlers for fast cases because emit() itself often has a variable number of
  // arguments and can be deoptimized because of that. These functions always have
  // the same number of arguments and thus do not get deoptimized, so the code
  // inside them can execute faster.
  function emitNone(handler, isFn, self) {
    if (isFn)
      handler.call(self);
    else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);
      for (var i = 0; i < len; ++i)
        listeners[i].call(self);
    }
  }
  function emitOne(handler, isFn, self, arg1) {
    if (isFn)
      handler.call(self, arg1);
    else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);
      for (var i = 0; i < len; ++i)
        listeners[i].call(self, arg1);
    }
  }
  function emitTwo(handler, isFn, self, arg1, arg2) {
    if (isFn)
      handler.call(self, arg1, arg2);
    else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);
      for (var i = 0; i < len; ++i)
        listeners[i].call(self, arg1, arg2);
    }
  }
  function emitThree(handler, isFn, self, arg1, arg2, arg3) {
    if (isFn)
      handler.call(self, arg1, arg2, arg3);
    else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);
      for (var i = 0; i < len; ++i)
        listeners[i].call(self, arg1, arg2, arg3);
    }
  }

  function emitMany(handler, isFn, self, args) {
    if (isFn)
      handler.apply(self, args);
    else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);
      for (var i = 0; i < len; ++i)
        listeners[i].apply(self, args);
    }
  }

  EventEmitter$1.prototype.emit = function emit(type) {
    var er, handler, len, args, i, events, domain;
    var doError = (type === 'error');

    events = this._events;
    if (events)
      doError = (doError && events.error == null);
    else if (!doError)
      return false;

    domain = this.domain;

    // If there is no 'error' event listener then throw.
    if (doError) {
      er = arguments[1];
      if (domain) {
        if (!er)
          er = new Error('Uncaught, unspecified "error" event');
        er.domainEmitter = this;
        er.domain = domain;
        er.domainThrown = false;
        domain.emit('error', er);
      } else if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
      return false;
    }

    handler = events[type];

    if (!handler)
      return false;

    var isFn = typeof handler === 'function';
    len = arguments.length;
    switch (len) {
      // fast cases
      case 1:
        emitNone(handler, isFn, this);
        break;
      case 2:
        emitOne(handler, isFn, this, arguments[1]);
        break;
      case 3:
        emitTwo(handler, isFn, this, arguments[1], arguments[2]);
        break;
      case 4:
        emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
        break;
      // slower
      default:
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        emitMany(handler, isFn, this, args);
    }

    return true;
  };

  function _addListener(target, type, listener, prepend) {
    var m;
    var events;
    var existing;

    if (typeof listener !== 'function')
      throw new TypeError('"listener" argument must be a function');

    events = target._events;
    if (!events) {
      events = target._events = new EventHandlers();
      target._eventsCount = 0;
    } else {
      // To avoid recursion in the case that type === "newListener"! Before
      // adding it to the listeners, first emit "newListener".
      if (events.newListener) {
        target.emit('newListener', type,
                    listener.listener ? listener.listener : listener);

        // Re-assign `events` because a newListener handler could have caused the
        // this._events to be assigned to a new object
        events = target._events;
      }
      existing = events[type];
    }

    if (!existing) {
      // Optimize the case of one listener. Don't need the extra array object.
      existing = events[type] = listener;
      ++target._eventsCount;
    } else {
      if (typeof existing === 'function') {
        // Adding the second element, need to change to array.
        existing = events[type] = prepend ? [listener, existing] :
                                            [existing, listener];
      } else {
        // If we've already got an array, just append.
        if (prepend) {
          existing.unshift(listener);
        } else {
          existing.push(listener);
        }
      }

      // Check for listener leak
      if (!existing.warned) {
        m = $getMaxListeners(target);
        if (m && m > 0 && existing.length > m) {
          existing.warned = true;
          var w = new Error('Possible EventEmitter memory leak detected. ' +
                              existing.length + ' ' + type + ' listeners added. ' +
                              'Use emitter.setMaxListeners() to increase limit');
          w.name = 'MaxListenersExceededWarning';
          w.emitter = target;
          w.type = type;
          w.count = existing.length;
          emitWarning(w);
        }
      }
    }

    return target;
  }
  function emitWarning(e) {
    typeof console.warn === 'function' ? console.warn(e) : console.log(e);
  }
  EventEmitter$1.prototype.addListener = function addListener(type, listener) {
    return _addListener(this, type, listener, false);
  };

  EventEmitter$1.prototype.on = EventEmitter$1.prototype.addListener;

  EventEmitter$1.prototype.prependListener =
      function prependListener(type, listener) {
        return _addListener(this, type, listener, true);
      };

  function _onceWrap(target, type, listener) {
    var fired = false;
    function g() {
      target.removeListener(type, g);
      if (!fired) {
        fired = true;
        listener.apply(target, arguments);
      }
    }
    g.listener = listener;
    return g;
  }

  EventEmitter$1.prototype.once = function once(type, listener) {
    if (typeof listener !== 'function')
      throw new TypeError('"listener" argument must be a function');
    this.on(type, _onceWrap(this, type, listener));
    return this;
  };

  EventEmitter$1.prototype.prependOnceListener =
      function prependOnceListener(type, listener) {
        if (typeof listener !== 'function')
          throw new TypeError('"listener" argument must be a function');
        this.prependListener(type, _onceWrap(this, type, listener));
        return this;
      };

  // emits a 'removeListener' event iff the listener was removed
  EventEmitter$1.prototype.removeListener =
      function removeListener(type, listener) {
        var list, events, position, i, originalListener;

        if (typeof listener !== 'function')
          throw new TypeError('"listener" argument must be a function');

        events = this._events;
        if (!events)
          return this;

        list = events[type];
        if (!list)
          return this;

        if (list === listener || (list.listener && list.listener === listener)) {
          if (--this._eventsCount === 0)
            this._events = new EventHandlers();
          else {
            delete events[type];
            if (events.removeListener)
              this.emit('removeListener', type, list.listener || listener);
          }
        } else if (typeof list !== 'function') {
          position = -1;

          for (i = list.length; i-- > 0;) {
            if (list[i] === listener ||
                (list[i].listener && list[i].listener === listener)) {
              originalListener = list[i].listener;
              position = i;
              break;
            }
          }

          if (position < 0)
            return this;

          if (list.length === 1) {
            list[0] = undefined;
            if (--this._eventsCount === 0) {
              this._events = new EventHandlers();
              return this;
            } else {
              delete events[type];
            }
          } else {
            spliceOne(list, position);
          }

          if (events.removeListener)
            this.emit('removeListener', type, originalListener || listener);
        }

        return this;
      };
      
  // Alias for removeListener added in NodeJS 10.0
  // https://nodejs.org/api/events.html#events_emitter_off_eventname_listener
  EventEmitter$1.prototype.off = function(type, listener){
      return this.removeListener(type, listener);
  };

  EventEmitter$1.prototype.removeAllListeners =
      function removeAllListeners(type) {
        var listeners, events;

        events = this._events;
        if (!events)
          return this;

        // not listening for removeListener, no need to emit
        if (!events.removeListener) {
          if (arguments.length === 0) {
            this._events = new EventHandlers();
            this._eventsCount = 0;
          } else if (events[type]) {
            if (--this._eventsCount === 0)
              this._events = new EventHandlers();
            else
              delete events[type];
          }
          return this;
        }

        // emit removeListener for all listeners on all events
        if (arguments.length === 0) {
          var keys = Object.keys(events);
          for (var i = 0, key; i < keys.length; ++i) {
            key = keys[i];
            if (key === 'removeListener') continue;
            this.removeAllListeners(key);
          }
          this.removeAllListeners('removeListener');
          this._events = new EventHandlers();
          this._eventsCount = 0;
          return this;
        }

        listeners = events[type];

        if (typeof listeners === 'function') {
          this.removeListener(type, listeners);
        } else if (listeners) {
          // LIFO order
          do {
            this.removeListener(type, listeners[listeners.length - 1]);
          } while (listeners[0]);
        }

        return this;
      };

  EventEmitter$1.prototype.listeners = function listeners(type) {
    var evlistener;
    var ret;
    var events = this._events;

    if (!events)
      ret = [];
    else {
      evlistener = events[type];
      if (!evlistener)
        ret = [];
      else if (typeof evlistener === 'function')
        ret = [evlistener.listener || evlistener];
      else
        ret = unwrapListeners(evlistener);
    }

    return ret;
  };

  EventEmitter$1.listenerCount = function(emitter, type) {
    if (typeof emitter.listenerCount === 'function') {
      return emitter.listenerCount(type);
    } else {
      return listenerCount.call(emitter, type);
    }
  };

  EventEmitter$1.prototype.listenerCount = listenerCount;
  function listenerCount(type) {
    var events = this._events;

    if (events) {
      var evlistener = events[type];

      if (typeof evlistener === 'function') {
        return 1;
      } else if (evlistener) {
        return evlistener.length;
      }
    }

    return 0;
  }

  EventEmitter$1.prototype.eventNames = function eventNames() {
    return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
  };

  // About 1.5x faster than the two-arg version of Array#splice().
  function spliceOne(list, index) {
    for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
      list[i] = list[k];
    list.pop();
  }

  function arrayClone(arr, i) {
    var copy = new Array(i);
    while (i--)
      copy[i] = arr[i];
    return copy;
  }

  function unwrapListeners(arr) {
    var ret = new Array(arr.length);
    for (var i = 0; i < ret.length; ++i) {
      ret[i] = arr[i].listener || arr[i];
    }
    return ret;
  }

  /**
   * 
   * @typedef {object} modifyFaceHolder
   * @property {function} addPageItem 添加faceHolder子页面
   * @property {function} hiddenPageType 隐藏faceHolderType项 
   * @property {function} hiddenPageItem 隐藏hiddenPageItem项 
   */

  /**
   * 修改faceHolder相关方法
   * @type {modifyFaceHolder}
   */
  const modifyFaceHolder = (() => {
      const faceHolder = document.getElementById("faceHolder");
      const faceHolderType = faceHolder.querySelector(".faceHolderType");
      const pageList = faceHolder.querySelector("div:nth-child(2)");
      const initAddPageItem = {};

      const pageDisplayBlock = "display: block; opacity: 1;";
      const pageDisplayNoneLeft = "opacity: 1; transform: translateX(10%); display: none;";
      const pageDisplayNoneRight = "opacity: 1; transform: translateX(-10%); display: none;";
      const pageTransitionON = "opacity: 1; display: block; transition: opacity 0.25s ease 0s, transform 0.25s ease 0s;z-index:1;";
      const pageTransitionOFFLeft = "opacity: 0; transition: opacity 0.25s ease 0s, transform 0.25s ease 0s; transform: translateX(10%);z-index:999;";
      const pageTransitionOFFRight = "opacity: 0; transition: opacity 0.25s ease 0s, transform 0.25s ease 0s; transform: translateX(-10%);z-index:999;";


      const pageListObserver = new MutationObserver(mutationsList => {
          // @ts-ignore
          const /**@type {Element} */ isPage = mutationsList[0].addedNodes[0];
          const className = isPage?.className;
          if (className === "emojiContentBox")
          {
              const index = isPage.getAttribute("index");
              if (initAddPageItem[index])
              {
                  initCreatePage(index, isPage);
              }
          }
      });
      pageListObserver.observe(pageList, { characterData: true, childList: true, subtree: true });

      /**
       * 
       * @param {number} index - 被添加页面的序号 
       * @param {string} title - 添加子页面标题
       * @param {Element|string} [content] - 添加子页面内容
       */
      function addPageItem(index, title, content) {
          // @ts-ignore
          if (!(content && content.nodeType === 1))
          {
              const /**@type {Element} */ addElement = document.createElement("div");
              addElement.setAttribute("style", "height: 100%;width: 100%;");
              // @ts-ignore
              addElement.innerHTML = content;
              content = addElement;
          }

          const isPage = pageList.querySelector(`div[index="${index}"]`);
          if (isPage)
          {
              // @ts-ignore
              createPage(index, isPage, title, content);
          } else
          {
              if (!initAddPageItem[index])
              {
                  initAddPageItem[index] = [];
              }
              initAddPageItem[index].push([title, content]);
          }
      }

      /**
       * 初始化创建相关element以及事件
       * @param {string} index 
       * @param {*} page 
       */
      function initCreatePage(index, page) {
          const emojiPage = page.querySelector(".emojiPage");
          const emojiContent = page.querySelector(".emojiContent");
          const emojiPageItem = emojiPage.querySelectorAll("span");

          // 获取当前主题emojiPageItem选中颜色
          let electStyle = emojiPage.querySelector("span[style]").getAttribute("style");

          // emojiPageItem切换
          emojiPage.addEventListener("click", event => {
              if (event.target.classList.contains("faceHolderPageItem"))
              {
                  emojiPage.querySelectorAll("span").forEach(item => {
                      item.setAttribute("style", "");
                  });
                  event.target.setAttribute("style", electStyle);

                  emojiContent.querySelectorAll(":scope > div").forEach(item => {
                      const targetP = event.target.getAttribute("p");
                      const nowIndex = item.getAttribute("index");
                      if (targetP == nowIndex)
                      {
                          item.setAttribute("style", pageTransitionON);
                          setTimeout(() => {
                              item.setAttribute("style", pageDisplayBlock);
                          }, 250);
                      } else if (targetP > nowIndex)
                      {
                          item.setAttribute("style", pageTransitionOFFRight);
                          setTimeout(() => {
                              item.setAttribute("style", pageDisplayNoneRight);
                          }, 250);
                      } else if (targetP < nowIndex)
                      {
                          item.setAttribute("style", pageTransitionOFFLeft);
                          setTimeout(() => {
                              item.setAttribute("style", pageDisplayNoneLeft);
                          }, 250);
                      }
                  });
              }
          });

          // 添加emojiPage
          initAddPageItem[index].forEach((item, index) => {
              // item
              const newItem = document.createElement("span");
              newItem.className = "faceHolderPageItem";
              newItem.textContent = item[0];
              newItem.setAttribute("p", emojiPageItem.length + index);
              emojiPage.appendChild(newItem);

              // content
              const newContent = document.createElement("div");
              newContent.className = "faceHolderBoxChild textColor panelHolderItem";
              newContent.setAttribute("index", emojiPageItem.length + index);
              newContent.setAttribute("style", pageDisplayNoneLeft);
              newContent.appendChild(item[1]);
              emojiContent.appendChild(newContent);
          });
      }

      /**
       * 创建pageItem
       * @param {number} index 
       * @param {*} page 
       * @param {string} title 
       * @param {Element} content 
       */
      function createPage(index, page, title, content) {
          const emojiPage = page.querySelector(".emojiPage");
          const emojiContent = page.querySelector(".emojiContent");
          const emojiPageItem = emojiPage.querySelectorAll("span");

          // item
          const newItem = document.createElement("span");
          newItem.className = "faceHolderPageItem";
          newItem.textContent = title;
          newItem.setAttribute("p", emojiPageItem.length + index);
          emojiPage.appendChild(newItem);

          // content
          const newContent = document.createElement("div");
          newContent.className = "faceHolderBoxChild textColor panelHolderItem";
          newContent.setAttribute("index", emojiPageItem.length + index);
          newContent.setAttribute("style", pageDisplayNoneLeft);
          newContent.appendChild(content);
          emojiContent.appendChild(newContent);
      }

      /**
       * 隐藏faceHolderType项
       * @param {number} eq faceHolderType项的行内eq值
       * @returns 
       */
      function hiddenPageType(eq) {
          const /**@type {HTMLElement} */ targetType = faceHolderType.querySelector(`span[eq="${eq}"]`);
          if (targetType)
          {
              targetType.style.display = "none";
              return true;
          } else
          {
              return null;
          }
      }

      /**
       * 隐藏faceHolderPageItem项
       * @param {number} index faceHolderType项的行内index值
       * @param {number} p faceHolderPageItem项的行内p值
       * @returns 
       */
      function hiddenPageItem(index, p) {
          const /**@type {HTMLElement} */ targetPage = pageList.querySelector(`div[index="${index}"]`);
          if (targetPage)
          {
              const /**@type {HTMLElement} */ targetItem = targetPage.querySelector(`.emojiPage>span[p="${p}"]`);
              if (targetItem)
              {
                  targetItem.style.display = "none";
                  return true;
              } else
              {
                  return null;
              }
          } else
          {
              return null;
          }
      }

      return {
          addPageItem,
          hiddenPageType,
          hiddenPageItem
      };
  })();

  /**
   * 创建插件配置页面及方法
   */
  const createConfigPage = (() => {
      // 基础UI
      const pageBox = document.createElement("div");
      pageBox.setAttribute("style", "height: 100%;width: 100%;display: flex;flex-direction: row;background-color: rgb(49, 49, 54);color: rgba(255, 255, 245, 0.86);");

      const plugList = document.createElement("div");
      pageBox.append(plugList);
      plugList.setAttribute("style", "background-color: rgb(37, 37, 41);border-right: 1px solid rgba(82, 82, 89, 0.5);min-width: 16%;height: 100%;overflow-x: hidden;padding: 8px 0 0 24px;");

      const plugConfigBox = document.createElement("div");
      const plugConfigPageArr = {};
      pageBox.append(plugConfigBox);
      plugConfigBox.setAttribute("style", "height: 100%;flex-grow: 1;display: flex;flex-direction: column;");

      // 添加插件配置页面于faceHolder
      modifyFaceHolder.addPageItem(6, "插件配置", pageBox);

      // 添加插件配置主页内容并显示
      addPage({ name: "REIFUU" }, newElement("ff0000"));
      plugConfigBox.appendChild(plugConfigPageArr[0]);

      // devtest
      function newElement(str) {
          const ele = document.createElement("div");
          ele.setAttribute("style", `height: 90%;width: 90%;background:#${str};margin:12px`);
          ele.textContent = str;
          return ele;
      }

      /**
       * 添加插件页面
       * @param {*} plugin 
       * @param {Element} [Element] 
       */
      function addPage(plugin, Element) {
          const plugItem = document.createElement("div");
          const plugListArr = plugList.querySelectorAll("div");
          const itemIndex = plugListArr.length.toString();
          plugList.append(plugItem);
          plugItem.setAttribute("style", "width: 100%;padding: 8px 0px 8px 0px;cursor: pointer;");
          plugItem.setAttribute("index", itemIndex);
          Element.setAttribute("index", itemIndex);
          plugConfigPageArr[itemIndex] = Element;

          plugItem.addEventListener("click", () => {
              switchConfigPage(itemIndex);
          });
          plugItem.textContent = plugin.name;
      }

      /**
       * 切换配置页面
       * @param {number} target
       */
      function switchConfigPage(target) {
          const controls = plugConfigBox.querySelector('div');
          const nowIndex = controls.getAttribute("index");
          if (nowIndex != target)
          {
              const targetDom = plugConfigPageArr[target];
              controls.remove();
              plugConfigPageArr[nowIndex] = controls;
              plugConfigBox.appendChild(targetDom);
          }
      }

      /**
       * 创建插件页面内容
       * @param { REIFUU_Plugin } plugin 
       * @returns 
       */
      function createPlugContent(plugin) {

          // 读取localStorage内插件的配置
          const key = `reifuuTemp.${plugin.name}`;
          const readData = (localStorage.getItem(key)) ? localStorage.getItem(key) : "{}";
          const dataTemp = JSON.parse(readData);
          const list = Object.keys(dataTemp);

          if (list.length > 0)
          {
              plugin.value = dataTemp[list[0]];
              plugin.status = plugin.value.ReifuuPluginStatus;
              // console.log('a', plugin.value);
              delete dataTemp[list[0]];
          }

          localStorage.setItem(key, JSON.stringify(dataTemp));

          const plugConfigBox = document.createElement("div");
          plugConfigBox.setAttribute("style", "height: 100%;flex-grow: 1;display: flex;flex-direction: column;");

          const plugConfigTop = document.createElement("div");
          plugConfigBox.append(plugConfigTop);
          plugConfigTop.setAttribute("style", "margin: 0 0 16px 0;position: relative;width: 100%;height: 56px;border-bottom: solid 1px rgba(82, 82, 89, 0.5);display: flex;flex-direction: row;align-items: center;");

          const plugConfigTitle = document.createElement("div");
          plugConfigTop.append(plugConfigTitle);
          plugConfigTitle.setAttribute("style", "font-size: 18px;font-weight: bolder;margin: 0 24px 0 30px;");
          plugConfigTitle.textContent = plugin.name;

          const plugConfigButton_Status = document.createElement("div");
          plugConfigTop.append(plugConfigButton_Status);
          plugConfigButton_Status.setAttribute("style", "position: absolute;right: 20px;font-size: 24px;margin: 0 20px 0 0;cursor: pointer;");

          const statusSwitchButton = document.createElement("span");

          if (plugin.status == 'stop')
          {
              statusSwitchButton.className = "mdi mdi-play-outline";
          } else if (plugin.status == 'start')
          {
              statusSwitchButton.className = "mdi mdi-pause";
          }

          plugConfigButton_Status.append(statusSwitchButton);

          // 开始关闭按钮修改状态
          statusSwitchButton.addEventListener('click', () => {
              if (plugin.status == 'stop')
              {
                  statusSwitchButton.className = "mdi mdi-pause";
                  plugin.pluginStart();

              } else if (plugin.status == 'start')
              {
                  statusSwitchButton.className = "mdi mdi-play-outline";
                  plugin.pluginStop();
              }
          });

          const configView = document.createElement("div");
          plugConfigBox.append(configView);
          configView.setAttribute("style", "overflow: auto;position: relative;height: 100%;");

          const scrollbarView = document.createElement("div");
          configView.append(scrollbarView);
          scrollbarView.id = "pageContent";
          scrollbarView.setAttribute("style", "margin: 0 30px;");

          // const navBtn = document.createElement("div");
          // plugConfigTop.append(navBtn);
          // navBtn.setAttribute("style", "display: flex;flex-direction: row;margin: 0 0 16px 0;");


          const btn0 = document.createElement("div");
          const btn1 = document.createElement("div");
          const btn2 = document.createElement("div");

          btn0.setAttribute("style", "border-radius: 2px;white-space: nowrap;padding: 3px 8px;margin: 0 12px 0 0;");
          btn1.setAttribute("style", "cursor: pointer;border: solid 1px rgba(82, 82, 89, 0.8);border-radius: 2px;white-space: nowrap;padding: 3px 8px;margin: 0 12px 0 0;");
          btn2.setAttribute("style", "cursor: pointer;border: solid 1px rgba(82, 82, 89, 0.8);border-radius: 2px;white-space: nowrap;padding: 3px 8px;margin: 0 12px 0 0;");

          if (plugin?.versions)
          {
              btn0.textContent = `当前版本：${plugin.versions}`;
              plugConfigTop.append(btn0);
          }

          if (plugin?.url)
          {
              btn1.textContent = "插件主页";
              btn1.addEventListener('click', () => {
                  window.open(plugin.url);
              });
              plugConfigTop.append(btn1);
          }

          if (plugin?.feedback)
          {
              btn2.textContent = "问题反馈";
              btn2.addEventListener('click', () => {
                  window.open(plugin.feedback);
              });
              plugConfigTop.append(btn2);
          }

          return plugConfigBox;
      }

      /**
       * 创建tips控件
       * @param {string} text 提示文本
       * @param {number} type 类型 0：true  1：info 2：warning
       * @returns {Element}
       */
      function createTipsElement(text, type) {
          const tips = document.createElement("div");
          if (type === 0)
          {
              tips.setAttribute("style", "background: rgba(59, 165, 94, .1);border-left: #3ba55e 4px solid;padding: 6px 12px;margin: 0 0 12px 0;");

          } else if (type === 1)
          {
              tips.setAttribute("style", "margin: 0 0 12px 0;background: rgba(116, 89, 255, .1);border-left: #7459ff 4px solid;padding: 6px 12px;");
          } else if (type === 2)
          {
              tips.setAttribute("style", "margin: 0 0 12px 0;background: rgba(249, 175, 27, .1);border-left: #f9af1b 4px solid;padding: 6px 12px;");
          }
          else
          {
              return;
          }
          tips.textContent = text;
          return tips;
      }

      function createConfigElement(plugin) {
          const box = document.createElement("div");
          box.setAttribute("style", " margin: 0 0 20px 0;");

          // // 读取localStorage内插件的配置
          // const key = `reifuuTemp.${plugin.name}`;
          // const readData = (localStorage.getItem(key)) ? localStorage.getItem(key) : "{}";
          // const dataTemp = JSON.parse(readData);
          // const list = Object.keys(dataTemp);

          // if (list.length > 0)
          // {
          //     plugin.value = dataTemp[list[0]];
          //     plugin.status = dataTemp[list[0]].status;
          //     delete dataTemp[list[0]];
          // }

          // localStorage.setItem(key, JSON.stringify(dataTemp));

          const configList = Object.keys(plugin.config);
          configList.forEach(item => {
              if (typeof plugin.config[item] == "function" || plugin.config[item].type == 'button')
              {
                  const schema = plugin.config[item];
                  box.append(createConfigItem(schema, item, plugin));

              } else if (typeof plugin.config[item] == "object")
              {
                  const configKeyList = Object.keys(plugin.config[item]);
                  const title = document.createElement("div");
                  title.textContent = item;
                  title.setAttribute("style", "padding: 0px 6px 8px 0;border-bottom: 1px solid rgba(82, 82, 89, .5);font-size: 18px;font-weight: bold;");
                  box.append(title);
                  configKeyList.forEach(key => {
                      const schema = plugin.config[item][key];
                      box.append(createConfigItem(schema, key, plugin));
                  });
              }
          });
          if (plugin.status) { plugin.pluginStart(); }
          delete plugin.value.ReifuuPluginStatus;

          return box;
      }

      function createConfigItem(schema, title, pluginConfig) {
          const schemaElement = document.createElement("div");
          schemaElement.setAttribute("style", "display: flex;flex-direction: row-reverse;padding: 6px 8px;border-bottom: 1px solid rgba(82, 82, 89, .5);");

          const right = document.createElement("div");
          schemaElement.append(right);
          const left = document.createElement("div");
          schemaElement.append(left);
          left.setAttribute("style", "flex-grow: 1;margin-top: 4px;");

          const name = document.createElement("div");
          name.textContent = title;
          left.append(name);
          const description = document.createElement("div");
          left.append(description);
          description.setAttribute("style", "width: 100%;font-size: 12px;overflow-wrap: anywhere;");

          if (schema.meta?.description)
          {
              description.textContent = schema.meta.description;
          }

          switch (schema.type)
          {
              case "number": {
                  const number = document.createElement("div");
                  number.setAttribute("style", "margin: 0 12px;display: flex;border: 1px solid rgba(82, 82, 89, .5);border-radius: 4px;");
                  const input = document.createElement("input");
                  input.setAttribute("style", "border-left: 1px solid rgba(82, 82, 89, .5);width: 64px;border-right: 1px solid rgba(82, 82, 89, .5);padding: 4px 6px;text-align: center;");
                  const plus = document.createElement("span");
                  plus.className = "mdi mdi-plus";
                  plus.setAttribute("style", "width: 30px;display: flex;align-items: center;justify-content: center;");
                  const sub = document.createElement("span");
                  sub.className = "mdi mdi-minus";
                  sub.setAttribute("style", "width: 30px;display: flex;align-items: center;justify-content: center;");

                  const saveData = pluginConfig.value[title];

                  let valueTemp = schema();
                  input.value = (valueTemp) ? valueTemp : 0;

                  if (saveData) { input.value = saveData; }

                  pluginConfig.value[title] = input.value;
                  // console.log('c', pluginConfig.value);

                  plus.addEventListener("click", () => {
                      try { input.value = schema(parseInt(input.value, 10) + 1); } catch (err)
                      {
                          if (schema.meta.hasOwnProperty('default'))
                          {
                              input.value = schema();
                          } else if (schema.meta.hasOwnProperty('max'))
                          {
                              input.value = schema.meta.max;
                          } else
                          {
                              input.value = 0;
                          }
                      }
                      pluginConfig.value[title] = input.value;
                  });

                  sub.addEventListener("click", () => {
                      try { input.value = schema(parseInt(input.value, 10) - 1); } catch (err)
                      {
                          if (schema.meta.hasOwnProperty('default'))
                          {
                              input.value = schema();
                          } else if (schema.meta.hasOwnProperty('min'))
                          {
                              input.value = schema.meta.min;
                          } else
                          {
                              input.value = 0;
                          }
                      }
                      pluginConfig.value[title] = input.value;
                  });

                  input.addEventListener('focus', function () {
                      // 在聚焦时更改样式
                      number.style.outline = '1px solid rgb(116, 89, 255)';
                  });

                  input.addEventListener("click", () => {
                      if (window["isMobile"])
                      {

                          Utils.sync(2, ["请输入值", null, null, input.value], (e) => {
                              if (e !== null)
                              {
                                  try
                                  {
                                      const value = (schema((parseInt(e, 10) == NaN) ? schema.meta.min : parseInt(e, 10)));
                                      input.value = value;
                                  }
                                  catch (err)
                                  {
                                      if (schema.meta.hasOwnProperty('default'))
                                      {
                                          input.value = schema();
                                      } else if (schema.meta.hasOwnProperty('min') && ((parseInt(e, 10) < schema.meta.min)))
                                      {
                                          input.value = schema.meta.min;
                                      } else if (schema.meta.hasOwnProperty('max') && ((parseInt(e, 10) > schema.meta.max)))
                                      {
                                          input.value = schema.meta.max;
                                      }
                                      else
                                      {
                                          input.value = 0;
                                      }
                                  }
                              }

                              requestAnimationFrame(function () {
                                  Utils.service.emoji();
                              });
                          });
                      }
                  });

                  // 添加失焦事件处理程序（可选，根据需要）
                  input.addEventListener('blur', function () {
                      // 在失焦时还原样式
                      number.style.outline = '';

                      try { input.value = schema(parseInt(input.value, 10)); } catch (err)
                      {
                          if (schema.meta.hasOwnProperty('default'))
                          {
                              input.value = schema();
                          } else if (schema.meta.hasOwnProperty('min'))
                          {
                              input.value = schema.meta.min;
                          } else if (schema.meta.hasOwnProperty('max'))
                          {
                              input.value = schema.meta.max;
                          } else
                          {
                              input.value = 0;
                          }
                      }
                      pluginConfig.value[title] = input.value;
                  });

                  number.append(sub);
                  number.append(input);
                  number.append(plus);

                  right.append(number);

                  break;
              }

              case "string": {
                  const string = document.createElement("div");
                  string.setAttribute("style", "margin: 0 12px;display: flex;border: 1px solid rgba(82, 82, 89, .5);border-radius: 4px;");
                  const input = document.createElement("input");
                  input.setAttribute("style", "width: 124px;padding: 4px 6px;text-align: center;");

                  if (schema.meta?.role)
                  {
                      if (schema.meta?.role == "secret") { input.type = "password"; }
                  }
                  const saveData = pluginConfig.value[title];

                  let value = schema();
                  input.value = (value) ? value : "";

                  if (saveData) { input.value = saveData; }

                  pluginConfig.value[title] = input.value;

                  input.addEventListener('focus', function () {
                      // 在聚焦时更改样式
                      string.style.outline = '2px solid rgb(116, 89, 255)';
                  });

                  input.addEventListener('blur', function () {
                      // 在失焦时还原样式
                      string.style.outline = '';
                      try
                      {
                          const value = (schema((input.value == '') ? undefined : input.value));
                          input.value = (value) ? value : '';
                      } catch (err)
                      {
                          if (schema.meta.hasOwnProperty('default'))
                          {
                              input.value = schema();
                          } else
                          {
                              input.value = "";
                          }
                      }
                      pluginConfig.value[title] = input.value;
                  });

                  input.addEventListener("click", () => {
                      if (window["isMobile"])
                      {
                          Utils.sync(2, ["请输入值", null, null, input.value], (e) => {
                              if (e !== null)
                              {
                                  try
                                  {
                                      const value = (schema((e == '') ? undefined : e));
                                      input.value = (value) ? value : '';
                                  } catch (err)
                                  {
                                      if (schema.meta.hasOwnProperty('default'))
                                      {
                                          input.value = schema();
                                      } else
                                      {
                                          input.value = "";
                                      }
                                  }
                              }
                              requestAnimationFrame(function () {
                                  Utils.service.emoji();
                              });
                          });
                      }
                  });

                  string.append(input);
                  right.append(string);
                  break;
              }

              case "boolean": {
                  const boolean = document.createElement("div");
                  boolean.setAttribute("style", " transition: all 0.5s cubic-bezier(0.215, 0.61, 0.355, 1) 0s;position: relative;padding: 2px; display: flex; align-items: center; justify-content: flex-end; border-radius: 10px; height: 14px; width: 32px; text-align: center; background-color: rgb(116, 89, 255);");

                  const inputDiv = document.createElement("div");
                  inputDiv.setAttribute("style", "transition: all 0.5s cubic-bezier(0.215, 0.61, 0.355, 1) 0s;position: absolute;padding: 2px;display: flex;align-items: center;justify-content: center;border-radius: 10px;height: 70%;width: 42%;text-align: center;");

                  const ball = document.createElement("div");
                  ball.setAttribute("style", "height:13px;width:13px;border-radius:12px;background-color: #252529;");

                  const saveData = pluginConfig.value[title];

                  let value = schema();
                  let status = (value) ? value : false;

                  if (saveData) { status = saveData; }

                  pluginConfig.value[title] = status;

                  if (status)
                  {
                      inputDiv.style.left = "calc( 58% - 4px)";
                      boolean.style.backgroundColor = "#7459ff";
                  } else
                  {
                      // inputDiv.style.justifyContent = "flex-start";
                      inputDiv.style.left = 0;
                      boolean.style.backgroundColor = "#4c4c52";
                  }
                  pluginConfig.value[title] = status;

                  boolean.addEventListener("click", () => {
                      if (inputDiv.style.left == "0px")
                      {
                          inputDiv.style.left = "calc( 58% - 4px)";
                          boolean.style.backgroundColor = "#7459ff";
                          pluginConfig.value[title] = true;
                      } else if (inputDiv.style.left !== "0px")
                      {
                          inputDiv.style.left = "0";
                          boolean.style.backgroundColor = "#4c4c52";
                          pluginConfig.value[title] = false;
                      }

                  });
                  inputDiv.append(ball);
                  boolean.append(inputDiv);
                  right.append(boolean);

                  break;
              }

              case "button": {
                  console.log(schema);

                  const button = document.createElement("div");
                  button.setAttribute("style", "margin: 0 12px;display: flex;border: 1px solid rgba(82, 82, 89, .5);border-radius: 4px;");

                  const buttonDiv = document.createElement("div");
                  buttonDiv.setAttribute("style", "height:17px;border-left: 1px solid rgba(82, 82, 89, .5);width: 110px;border-right: 1px solid rgba(82, 82, 89, .5);padding: 4px 6px;text-align: center;");
                  buttonDiv.innerHTML = "click";

                  button.addEventListener('mouseenter', function () {
                      // 在鼠标移入时更改样式
                      button.style.outline = '1px solid rgb(116, 89, 255)';
                  });

                  // 添加失焦事件处理程序（可选，根据需要）
                  button.addEventListener('mouseleave', function () {
                      // 在鼠标移出时还原样式
                      button.style.outline = '';
                  });

                  button.addEventListener('click', () => {
                      pluginConfig[schema.click]();
                  });

                  button.append(buttonDiv);
                  right.append(button);
                  break;
              }

              case "array": {
                  const listBox = document.createElement("div");
                  listBox.setAttribute("style", "border: rgb(60, 63, 68) 1px solid;border-bottom: none;");

                  const saveData = pluginConfig.value[title];
                  let value = schema();
                  value = (value) ? value : [];

                  if (saveData) { value = saveData; }

                  pluginConfig.value[title] = value;

                  if (value.length <= 0)
                  {
                      createArrItem(schema.type, null);
                  } else
                  {
                      value.forEach((item, index) => {
                          listBox.append(createArrItem(schema.type, item, index));
                      });
                  }
                  listBox.append(createArrAddElement());

                  right.append(listBox);

                  /**
                   * 创建数组项
                   * @param {*} type 
                   * @param {*} value 
                   * @returns 
                   */
                  function createArrItem(type, value, index) {
                      const item = document.createElement("div");
                      item.setAttribute("style", "display: flex;flex-direction: row-reverse;text-align: center; border-bottom:rgb(60, 63, 68) 1px solid;");
                      item.setAttribute("index", index);
                      const input = document.createElement("input");
                      input.setAttribute("style", "flex-grow: 1;width: 0;padding: 4px 6px;text-align: center;");
                      const up = document.createElement("div");
                      up.setAttribute("style", "color:rgb(144, 147, 153);cursor: pointer;font-size: 20px;width: 30px;border-left: rgb(60, 63, 68) 1px solid;display: flex;align-items: center;justify-content: center;");
                      up.innerHTML = `<span class="mdi mdi-arrow-up-thin"></span>`;
                      const down = document.createElement("div");
                      down.setAttribute("style", "color:rgb(144, 147, 153);cursor: pointer;font-size: 20px;width: 30px;border-left: rgb(60, 63, 68) 1px solid;display: flex;align-items: center;justify-content: center;");
                      down.innerHTML = `<span class="mdi mdi-arrow-down-thin"></span>`;
                      const del = document.createElement("div");
                      del.setAttribute("style", "color:rgb(144, 147, 153);cursor: pointer;font-size: 20px;width: 30px;border-left: rgb(60, 63, 68) 1px solid;display: flex;align-items: center;justify-content: center;");
                      del.innerHTML = `<span class="mdi mdi-trash-can-outline"></span>`;

                      // 聚焦事件
                      input.addEventListener('focus', () => {
                          input.style.outline = "2px solid rgb(116, 89, 255)";
                          input.style.zIndex = "999";
                      });

                      // 失焦事件
                      input.addEventListener('blur', () => {

                          input.style.outline = "";
                          input.style.zIndex = "";

                          updateArr();
                          try { pluginConfig.arrayConfigChange(title, 'add'); } catch (err) { console.log(err); }
                      });

                      input.addEventListener("click", () => {
                          let arr = getInputArr();
                          if (window["isMobile"])
                          {
                              Utils.sync(2, ["请输入值", null, null, arr[index]], (e) => {
                                  if (schema.inner.type === "number")
                                  {
                                      arr[index] = parseInt(e, 10);
                                  } else
                                  {
                                      arr[index] = e;
                                  }
                                  updateArr(arr);

                                  requestAnimationFrame(function () {
                                      Utils.service.emoji();
                                  });
                              });
                          }

                      });

                      // 删除点击事件
                      del.addEventListener("click", () => {
                          item.replaceWith();

                          updateArr();
                          // 值删除时触发钩子
                          try { pluginConfig.arrayConfigChange(title, 'del'); } catch (err) { console.log(err); }
                      });

                      up.addEventListener("click", () => {
                          let nowArr = getInputArr();
                          if (index > 0)
                          {
                              [nowArr[index], nowArr[index - 1]] = [nowArr[index - 1], nowArr[index]];
                          }
                          updateArr(nowArr);
                      });

                      down.addEventListener("click", () => {
                          let nowArr = getInputArr();

                          if (index < nowArr.length - 1)
                          {
                              [nowArr[index], nowArr[index + 1]] = [nowArr[index + 1], nowArr[index]];
                          }
                          updateArr(nowArr);

                      });

                      input.value = value;

                      item.append(del);
                      item.append(down);
                      item.append(up);
                      item.append(input);

                      return item;
                  }

                  /**
                   * 创建列表添加element
                   * @returns 
                   */
                  function createArrAddElement() {
                      const add = document.createElement("div");
                      add.setAttribute("style", "cursor: pointer;width:206px;font-size: 20px;display: flex;align-items: center;justify-content: center;border-bottom: rgb(60, 63, 68) 1px solid;color: rgb(144, 147, 153);");
                      add.innerHTML = `<span class="mdi mdi-plus"></span>`;
                      add.addEventListener("click", () => {
                          let arr = getInputArr();
                          if (schema.inner.type === "number")
                          {
                              arr.push(0);
                          } else
                          {
                              arr.push("item");
                          }
                          updateArr(arr);
                      });
                      return add;
                  }

                  /**
                   * 提交修改数组构型value
                   * @param {string} [arr]
                   */
                  function updateArr(arr) {
                      let valueList = [];

                      if (arr)
                      {
                          valueList = arr;
                      } else
                      {
                          valueList = getInputArr();
                      }
                      try
                      {
                          const value = schema(valueList);
                          valueList = value;
                      } catch (err)
                      {
                          if (schema.meta.hasOwnProperty('default'))
                          {
                              const temp = schema();
                              valueList = temp;
                          } else
                          {
                              valueList = [];
                          }
                      }

                      listBox.innerHTML = "";
                      pluginConfig.value[title] = valueList;

                      valueList.forEach((item, index) => {
                          listBox.append(createArrItem(schema.type, item, index));
                      });
                      listBox.append(createArrAddElement());
                  }

                  /**
                   * 获取当前构型arr
                   * @returns {Array} 
                   */
                  function getInputArr() {
                      const inputItemList = listBox.querySelectorAll("input");
                      // let arr = observeArray([], schema?.observe);
                      let arr = [];
                      // if (pluginConfig.value[title].add) { arr.add = pluginConfig.value[title].add; }
                      // if (pluginConfig.value[title].del) { arr.add = pluginConfig.value[title].del; }

                      inputItemList.forEach(item => {
                          if (schema.inner.type === "number")
                          {
                              arr.push(parseInt(item.value, 10));
                          } else
                          {
                              arr.push(item.value);
                          }
                      });
                      return arr;
                  }
              }
          }

          return schemaElement;
      }

      return {
          addPage,
          newElement,
          createPlugContent,
          createTipsElement,
          createConfigElement
      };
  })();

  // function observeArray(array, callback)
  // {
  //     const handler = {
  //         set: function (target, property, value)
  //         {
  //             target[property] = value;
  //             callback(property, value);
  //             return true;
  //         },
  //         deleteProperty: function (target, property)
  //         {
  //             delete target[property];
  //             callback(property);
  //             return true;
  //         }
  //     };

  //     return new Proxy(array, handler);
  // }

  //TODO：冲突检测

  /**
   * 
   * @typedef {object} inputHolder
   * @property {HTMLElement} moveInput 输入框控件
   * @property {string} moveInputValue 输入框当前内容
   * @property {number} selectionStart 输入框光标起始位置
   * @property {function} addTrigger 添加触发词与事件
   * @property {function} triggerContent 触发后根据条件分割的当前输入框内容
   * @property {function} createinputHolder 创建面板控件
   * @property {function} deleteHolder    删除面板控件
   */

  /**
   * 输入框弹出面板相关方法
   * @type {inputHolder} 
   */
  const inputHolder = (() =>
  {
      const moveInput = document.querySelector("#moveinput");

      let triggerCondition = [];
      let triggerContent = [];
      let isTrigger = 0;
      let selectIndex = 0;
      let nowCondition;

      let moveInputValue;
      let selectionStart;
      let triggerStartIndex;
      let triggerEndIndex;
      let callback;

      moveInput.addEventListener("keydown", (event) =>
      {
          const inputHolder = document.getElementById('inputHolder');
          const holderItem = document.querySelectorAll("#holderItem");

          // 屏蔽默认上下事件
          if ((inputHolder ? true : false) && (event.key === 'ArrowUp' || event.key === 'ArrowDown'))
          {
              event.preventDefault();
          }

          // 面板上下键选择
          if (event.key === 'ArrowUp')
          {
              selectIndex = (selectIndex - 1 + holderItem.length) % holderItem.length;
              updateSelectedElement(holderItem);
          } else if (event.key === 'ArrowDown')
          {
              selectIndex = (selectIndex + 1) % holderItem.length;
              updateSelectedElement(holderItem);
          }

          // 选择触发事件
          if (event.key === 'Tab' && (inputHolder ? true : false))
          {
              event.preventDefault();
              holderItem[selectIndex].click();
          }

          //关闭面板
          if (event.key === "Escape")
          {
              isTrigger = 0;
              deleteHolder();
          }

          //输入内容检查
          requestAnimationFrame(() =>
          {
              if (event.key !== "ArrowDown" && event.key !== "ArrowUp")
              {
                  detectInput();
              }
          });
      });

      /**
       * 检查当前输入
       */
      function detectInput()
      {

          moveInputValue = moveInput.value;
          selectionStart = moveInput.selectionStart;

          // 是否进入匹配后状态
          if (isTrigger)
          {
              //光标越界退出
              if (selectionStart < triggerEndIndex)
              {
                  isTrigger = 0;
                  deleteHolder();
                  return;
              }

              // 分割当前内容
              triggerContent[0] = moveInputValue.slice(0, triggerStartIndex);
              triggerContent[1] = moveInputValue.slice(triggerStartIndex, triggerEndIndex);
              triggerContent[2] = moveInputValue.slice(triggerEndIndex, selectionStart);
              triggerContent[3] = moveInputValue.slice(selectionStart);

              // 将符合要求的文本输入
              // console.log(nowCondition.condition)
              callback(moveInputValue.match(nowCondition.condition));

          } else
          {
              // 匹配检查
              const contentBeforeCursor = moveInputValue.slice(0, selectionStart);
              for (let condition of triggerCondition)
              {
                  if (condition.condition instanceof RegExp)
                  {
                      const matchDataTemp = contentBeforeCursor.match(condition.condition);
                      if (!matchDataTemp) { break; }
                      const matchLenght = matchDataTemp.length;
                      const matchData = contentBeforeCursor.match(condition.condition)[matchLenght - 1];

                      if (contentBeforeCursor.endsWith(matchData))
                      {
                          triggerStartIndex = selectionStart - contentBeforeCursor.match(condition.condition)[0].length;
                          triggerEndIndex = selectionStart;
                          isTrigger = 1;
                          callback = condition.callback;
                          // 保存当前触发的段
                          nowCondition = condition;

                          detectInput();
                          break;
                      }
                  } else
                  {
                      if (contentBeforeCursor.endsWith(condition.condition))
                      {
                          triggerStartIndex = selectionStart - condition.condition.length;
                          triggerEndIndex = selectionStart;
                          isTrigger = 1;
                          callback = condition.callback;
                          // 保存当前触发的段
                          nowCondition = condition;

                          detectInput();
                          break;
                      }
                  }
              }
          }
      }

      /**
       * 添加触发内容
       * @param {string|RegExp} condition 匹配触发内容，不包括匹配上后的进一步输入内容
       * @param {*} callback 匹配上后的回调
       */
      function addTrigger(condition, callback)
      {
          const trigger = { condition: condition, callback: callback };
          triggerCondition.push(trigger);
      }

      /**
       * 更新面板列表选中样式
       */
      function updateSelectedElement(elementAll)
      {
          elementAll.forEach((element, index) =>
          {
              if (index === selectIndex)
              {
                  // @ts-ignore
                  element.style.backgroundColor = `#${window['inputcolorhex']}88`;
              } else
              {
                  // @ts-ignore
                  element.style.backgroundColor = 'transparent';
              }
          });
      }

      /**
       * @typedef {Object} holderList 创建面板的依据数组
       * @property {string} content - 显示内容
       * @property {function} callback 触发的回调
       */
      /**
       * 创建弹出面板
       * @param {holderList[]} list 创建面板的依据数组
       */
      function createinputHolder(list)
      {
          // 清除当前存在面板
          deleteHolder();

          // 空列表
          if (list.length === 0)
          {
              deleteHolder();
              return;
          }


          const moveInputBubble = document.querySelector('#moveinputBubble');
          const moveInput = document.querySelector("#moveinput");

          const moveInputBubbleStyle = window.getComputedStyle(moveInputBubble);
          const moveInputStyle = window.getComputedStyle(moveInput);

          const inputHolder = document.createElement('div');
          inputHolder.id = 'inputHolder';
          inputHolder.style.left = '0px';
          inputHolder.style.position = 'absolute';
          inputHolder.style.zIndex = '999';
          inputHolder.style.backgroundColor = moveInputBubbleStyle.backgroundColor;
          inputHolder.style.width = '100%';
          inputHolder.style.height = 'auto';
          inputHolder.style.borderColor = moveInputBubbleStyle.borderColor;
          inputHolder.style.borderStyle = moveInputBubbleStyle.borderStyle;
          inputHolder.style.borderWidth = moveInputBubbleStyle.borderWidth;
          inputHolder.style.borderBottom = 'none';
          inputHolder.style.borderLeft = 'none';
          inputHolder.style.padding = ' 24px 0 12px 0';
          inputHolder.style.backdropFilter = 'blur(2px)';

          const close = document.createElement('div');
          close.id = "atClose";
          close.style.position = 'absolute';
          close.style.background = `#${window['inputcolorhex']}`;
          close.style.height = '6px';
          close.style.width = '20%';
          close.style.top = '4px';
          close.style.left = '50%';
          close.style.borderRadius = '4px';
          close.style.transform = 'translateX(-50%)';
          close.style.maxWidth = '100px';
          close.style.cursor = 'pointer';
          close.addEventListener('click', () =>
          {
              deleteHolder();
              moveInput.focus();
          });
          inputHolder.appendChild(close);

          list.forEach((item, index) =>
          {
              const userItem = document.createElement('div');
              userItem.id = 'holderItem';
              userItem.style.margin = '0 20px 0 20px';
              userItem.style.padding = '0 8px';
              userItem.style.whiteSpace = 'nowrap';
              userItem.style.overflow = 'hidden';
              userItem.style.height = '24px';
              userItem.style.textOverflow = 'ellipsis';
              userItem.style.color = moveInputStyle.color;
              userItem.style.textShadow = moveInputStyle.textShadow;
              userItem.style.cursor = 'pointer';
              userItem.style.borderRadius = '4px';

              if (index == selectIndex)
              {
                  userItem.style.background = `#${window['inputcolorhex']}88`;
              }

              userItem.addEventListener('click', () =>
              {
                  isTrigger = 0;
                  item.callback();
                  deleteHolder();
                  moveInput.focus();
              });

              userItem.textContent = item.content;
              inputHolder.appendChild(userItem);
          });

          inputHolder.style.height = list.length * 24 + 'px';
          inputHolder.style.top = -1 * (list.length * 24 + 36) + 'px';

          moveInputBubble.appendChild(inputHolder);

      }

      /**
       * 删除面板
       */
      function deleteHolder()
      {
          let existingAtTipBox = document.querySelector('#inputHolder');
          if (existingAtTipBox) existingAtTipBox.remove();
      }

      return {
          moveInput,
          moveInputValue,
          selectionStart,
          addTrigger,
          triggerContent,
          deleteHolder,
          createinputHolder
      };
  })();

  // uid
  const uid = () => {
      // @ts-ignore
      return window.uid;
  };
  // 用户名
  const username = () => {
      const e = document.querySelector("#functionHolderInfoName");
      return e ? e.innerHTML : '';
  };
  // 颜色
  const color = () => {
      // @ts-ignore
      return window.namecolor;
  };
  const allSounds = Object.keys(window).filter(k => k.endsWith('soundprobe')).map(s => s.slice(0, -10));
  const sounds = () => {
      return allSounds;
  };
  const playSound = (sound) => {
      const soundName = sound;
      if (allSounds.includes(soundName)) {
          const k = `${soundName}sound`;
          const e = window[k];
          if (e) {
              return e.play();
          }
          else {
              return Promise.reject(new Error(`Sound ${sound} not playable`));
          }
      }
      return Promise.reject(new Error(`Sound ${sound} not found`));
  };
  // @ts-ignore
  const uniqueId = () => window.Utils.smallTools.uniqueID(); // 获取唯一ID

  var IIROSE_Vars = /*#__PURE__*/Object.freeze({
    __proto__: null,
    color: color,
    playSound: playSound,
    sounds: sounds,
    uid: uid,
    uniqueId: uniqueId,
    username: username
  });

  var lib = {};

  var namedReferences = {};

  Object.defineProperty(namedReferences,"__esModule",{value:true});namedReferences.bodyRegExps={xml:/&(?:#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);?/g,html4:/&notin;|&(?:nbsp|iexcl|cent|pound|curren|yen|brvbar|sect|uml|copy|ordf|laquo|not|shy|reg|macr|deg|plusmn|sup2|sup3|acute|micro|para|middot|cedil|sup1|ordm|raquo|frac14|frac12|frac34|iquest|Agrave|Aacute|Acirc|Atilde|Auml|Aring|AElig|Ccedil|Egrave|Eacute|Ecirc|Euml|Igrave|Iacute|Icirc|Iuml|ETH|Ntilde|Ograve|Oacute|Ocirc|Otilde|Ouml|times|Oslash|Ugrave|Uacute|Ucirc|Uuml|Yacute|THORN|szlig|agrave|aacute|acirc|atilde|auml|aring|aelig|ccedil|egrave|eacute|ecirc|euml|igrave|iacute|icirc|iuml|eth|ntilde|ograve|oacute|ocirc|otilde|ouml|divide|oslash|ugrave|uacute|ucirc|uuml|yacute|thorn|yuml|quot|amp|lt|gt|#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);?/g,html5:/&centerdot;|&copysr;|&divideontimes;|&gtcc;|&gtcir;|&gtdot;|&gtlPar;|&gtquest;|&gtrapprox;|&gtrarr;|&gtrdot;|&gtreqless;|&gtreqqless;|&gtrless;|&gtrsim;|&ltcc;|&ltcir;|&ltdot;|&lthree;|&ltimes;|&ltlarr;|&ltquest;|&ltrPar;|&ltri;|&ltrie;|&ltrif;|&notin;|&notinE;|&notindot;|&notinva;|&notinvb;|&notinvc;|&notni;|&notniva;|&notnivb;|&notnivc;|&parallel;|&timesb;|&timesbar;|&timesd;|&(?:AElig|AMP|Aacute|Acirc|Agrave|Aring|Atilde|Auml|COPY|Ccedil|ETH|Eacute|Ecirc|Egrave|Euml|GT|Iacute|Icirc|Igrave|Iuml|LT|Ntilde|Oacute|Ocirc|Ograve|Oslash|Otilde|Ouml|QUOT|REG|THORN|Uacute|Ucirc|Ugrave|Uuml|Yacute|aacute|acirc|acute|aelig|agrave|amp|aring|atilde|auml|brvbar|ccedil|cedil|cent|copy|curren|deg|divide|eacute|ecirc|egrave|eth|euml|frac12|frac14|frac34|gt|iacute|icirc|iexcl|igrave|iquest|iuml|laquo|lt|macr|micro|middot|nbsp|not|ntilde|oacute|ocirc|ograve|ordf|ordm|oslash|otilde|ouml|para|plusmn|pound|quot|raquo|reg|sect|shy|sup1|sup2|sup3|szlig|thorn|times|uacute|ucirc|ugrave|uml|uuml|yacute|yen|yuml|#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);?/g};namedReferences.namedReferences={xml:{entities:{"&lt;":"<","&gt;":">","&quot;":'"',"&apos;":"'","&amp;":"&"},characters:{"<":"&lt;",">":"&gt;",'"':"&quot;","'":"&apos;","&":"&amp;"}},html4:{entities:{"&apos;":"'","&nbsp":" ","&nbsp;":" ","&iexcl":"¡","&iexcl;":"¡","&cent":"¢","&cent;":"¢","&pound":"£","&pound;":"£","&curren":"¤","&curren;":"¤","&yen":"¥","&yen;":"¥","&brvbar":"¦","&brvbar;":"¦","&sect":"§","&sect;":"§","&uml":"¨","&uml;":"¨","&copy":"©","&copy;":"©","&ordf":"ª","&ordf;":"ª","&laquo":"«","&laquo;":"«","&not":"¬","&not;":"¬","&shy":"­","&shy;":"­","&reg":"®","&reg;":"®","&macr":"¯","&macr;":"¯","&deg":"°","&deg;":"°","&plusmn":"±","&plusmn;":"±","&sup2":"²","&sup2;":"²","&sup3":"³","&sup3;":"³","&acute":"´","&acute;":"´","&micro":"µ","&micro;":"µ","&para":"¶","&para;":"¶","&middot":"·","&middot;":"·","&cedil":"¸","&cedil;":"¸","&sup1":"¹","&sup1;":"¹","&ordm":"º","&ordm;":"º","&raquo":"»","&raquo;":"»","&frac14":"¼","&frac14;":"¼","&frac12":"½","&frac12;":"½","&frac34":"¾","&frac34;":"¾","&iquest":"¿","&iquest;":"¿","&Agrave":"À","&Agrave;":"À","&Aacute":"Á","&Aacute;":"Á","&Acirc":"Â","&Acirc;":"Â","&Atilde":"Ã","&Atilde;":"Ã","&Auml":"Ä","&Auml;":"Ä","&Aring":"Å","&Aring;":"Å","&AElig":"Æ","&AElig;":"Æ","&Ccedil":"Ç","&Ccedil;":"Ç","&Egrave":"È","&Egrave;":"È","&Eacute":"É","&Eacute;":"É","&Ecirc":"Ê","&Ecirc;":"Ê","&Euml":"Ë","&Euml;":"Ë","&Igrave":"Ì","&Igrave;":"Ì","&Iacute":"Í","&Iacute;":"Í","&Icirc":"Î","&Icirc;":"Î","&Iuml":"Ï","&Iuml;":"Ï","&ETH":"Ð","&ETH;":"Ð","&Ntilde":"Ñ","&Ntilde;":"Ñ","&Ograve":"Ò","&Ograve;":"Ò","&Oacute":"Ó","&Oacute;":"Ó","&Ocirc":"Ô","&Ocirc;":"Ô","&Otilde":"Õ","&Otilde;":"Õ","&Ouml":"Ö","&Ouml;":"Ö","&times":"×","&times;":"×","&Oslash":"Ø","&Oslash;":"Ø","&Ugrave":"Ù","&Ugrave;":"Ù","&Uacute":"Ú","&Uacute;":"Ú","&Ucirc":"Û","&Ucirc;":"Û","&Uuml":"Ü","&Uuml;":"Ü","&Yacute":"Ý","&Yacute;":"Ý","&THORN":"Þ","&THORN;":"Þ","&szlig":"ß","&szlig;":"ß","&agrave":"à","&agrave;":"à","&aacute":"á","&aacute;":"á","&acirc":"â","&acirc;":"â","&atilde":"ã","&atilde;":"ã","&auml":"ä","&auml;":"ä","&aring":"å","&aring;":"å","&aelig":"æ","&aelig;":"æ","&ccedil":"ç","&ccedil;":"ç","&egrave":"è","&egrave;":"è","&eacute":"é","&eacute;":"é","&ecirc":"ê","&ecirc;":"ê","&euml":"ë","&euml;":"ë","&igrave":"ì","&igrave;":"ì","&iacute":"í","&iacute;":"í","&icirc":"î","&icirc;":"î","&iuml":"ï","&iuml;":"ï","&eth":"ð","&eth;":"ð","&ntilde":"ñ","&ntilde;":"ñ","&ograve":"ò","&ograve;":"ò","&oacute":"ó","&oacute;":"ó","&ocirc":"ô","&ocirc;":"ô","&otilde":"õ","&otilde;":"õ","&ouml":"ö","&ouml;":"ö","&divide":"÷","&divide;":"÷","&oslash":"ø","&oslash;":"ø","&ugrave":"ù","&ugrave;":"ù","&uacute":"ú","&uacute;":"ú","&ucirc":"û","&ucirc;":"û","&uuml":"ü","&uuml;":"ü","&yacute":"ý","&yacute;":"ý","&thorn":"þ","&thorn;":"þ","&yuml":"ÿ","&yuml;":"ÿ","&quot":'"',"&quot;":'"',"&amp":"&","&amp;":"&","&lt":"<","&lt;":"<","&gt":">","&gt;":">","&OElig;":"Œ","&oelig;":"œ","&Scaron;":"Š","&scaron;":"š","&Yuml;":"Ÿ","&circ;":"ˆ","&tilde;":"˜","&ensp;":" ","&emsp;":" ","&thinsp;":" ","&zwnj;":"‌","&zwj;":"‍","&lrm;":"‎","&rlm;":"‏","&ndash;":"–","&mdash;":"—","&lsquo;":"‘","&rsquo;":"’","&sbquo;":"‚","&ldquo;":"“","&rdquo;":"”","&bdquo;":"„","&dagger;":"†","&Dagger;":"‡","&permil;":"‰","&lsaquo;":"‹","&rsaquo;":"›","&euro;":"€","&fnof;":"ƒ","&Alpha;":"Α","&Beta;":"Β","&Gamma;":"Γ","&Delta;":"Δ","&Epsilon;":"Ε","&Zeta;":"Ζ","&Eta;":"Η","&Theta;":"Θ","&Iota;":"Ι","&Kappa;":"Κ","&Lambda;":"Λ","&Mu;":"Μ","&Nu;":"Ν","&Xi;":"Ξ","&Omicron;":"Ο","&Pi;":"Π","&Rho;":"Ρ","&Sigma;":"Σ","&Tau;":"Τ","&Upsilon;":"Υ","&Phi;":"Φ","&Chi;":"Χ","&Psi;":"Ψ","&Omega;":"Ω","&alpha;":"α","&beta;":"β","&gamma;":"γ","&delta;":"δ","&epsilon;":"ε","&zeta;":"ζ","&eta;":"η","&theta;":"θ","&iota;":"ι","&kappa;":"κ","&lambda;":"λ","&mu;":"μ","&nu;":"ν","&xi;":"ξ","&omicron;":"ο","&pi;":"π","&rho;":"ρ","&sigmaf;":"ς","&sigma;":"σ","&tau;":"τ","&upsilon;":"υ","&phi;":"φ","&chi;":"χ","&psi;":"ψ","&omega;":"ω","&thetasym;":"ϑ","&upsih;":"ϒ","&piv;":"ϖ","&bull;":"•","&hellip;":"…","&prime;":"′","&Prime;":"″","&oline;":"‾","&frasl;":"⁄","&weierp;":"℘","&image;":"ℑ","&real;":"ℜ","&trade;":"™","&alefsym;":"ℵ","&larr;":"←","&uarr;":"↑","&rarr;":"→","&darr;":"↓","&harr;":"↔","&crarr;":"↵","&lArr;":"⇐","&uArr;":"⇑","&rArr;":"⇒","&dArr;":"⇓","&hArr;":"⇔","&forall;":"∀","&part;":"∂","&exist;":"∃","&empty;":"∅","&nabla;":"∇","&isin;":"∈","&notin;":"∉","&ni;":"∋","&prod;":"∏","&sum;":"∑","&minus;":"−","&lowast;":"∗","&radic;":"√","&prop;":"∝","&infin;":"∞","&ang;":"∠","&and;":"∧","&or;":"∨","&cap;":"∩","&cup;":"∪","&int;":"∫","&there4;":"∴","&sim;":"∼","&cong;":"≅","&asymp;":"≈","&ne;":"≠","&equiv;":"≡","&le;":"≤","&ge;":"≥","&sub;":"⊂","&sup;":"⊃","&nsub;":"⊄","&sube;":"⊆","&supe;":"⊇","&oplus;":"⊕","&otimes;":"⊗","&perp;":"⊥","&sdot;":"⋅","&lceil;":"⌈","&rceil;":"⌉","&lfloor;":"⌊","&rfloor;":"⌋","&lang;":"〈","&rang;":"〉","&loz;":"◊","&spades;":"♠","&clubs;":"♣","&hearts;":"♥","&diams;":"♦"},characters:{"'":"&apos;"," ":"&nbsp;","¡":"&iexcl;","¢":"&cent;","£":"&pound;","¤":"&curren;","¥":"&yen;","¦":"&brvbar;","§":"&sect;","¨":"&uml;","©":"&copy;","ª":"&ordf;","«":"&laquo;","¬":"&not;","­":"&shy;","®":"&reg;","¯":"&macr;","°":"&deg;","±":"&plusmn;","²":"&sup2;","³":"&sup3;","´":"&acute;","µ":"&micro;","¶":"&para;","·":"&middot;","¸":"&cedil;","¹":"&sup1;","º":"&ordm;","»":"&raquo;","¼":"&frac14;","½":"&frac12;","¾":"&frac34;","¿":"&iquest;","À":"&Agrave;","Á":"&Aacute;","Â":"&Acirc;","Ã":"&Atilde;","Ä":"&Auml;","Å":"&Aring;","Æ":"&AElig;","Ç":"&Ccedil;","È":"&Egrave;","É":"&Eacute;","Ê":"&Ecirc;","Ë":"&Euml;","Ì":"&Igrave;","Í":"&Iacute;","Î":"&Icirc;","Ï":"&Iuml;","Ð":"&ETH;","Ñ":"&Ntilde;","Ò":"&Ograve;","Ó":"&Oacute;","Ô":"&Ocirc;","Õ":"&Otilde;","Ö":"&Ouml;","×":"&times;","Ø":"&Oslash;","Ù":"&Ugrave;","Ú":"&Uacute;","Û":"&Ucirc;","Ü":"&Uuml;","Ý":"&Yacute;","Þ":"&THORN;","ß":"&szlig;","à":"&agrave;","á":"&aacute;","â":"&acirc;","ã":"&atilde;","ä":"&auml;","å":"&aring;","æ":"&aelig;","ç":"&ccedil;","è":"&egrave;","é":"&eacute;","ê":"&ecirc;","ë":"&euml;","ì":"&igrave;","í":"&iacute;","î":"&icirc;","ï":"&iuml;","ð":"&eth;","ñ":"&ntilde;","ò":"&ograve;","ó":"&oacute;","ô":"&ocirc;","õ":"&otilde;","ö":"&ouml;","÷":"&divide;","ø":"&oslash;","ù":"&ugrave;","ú":"&uacute;","û":"&ucirc;","ü":"&uuml;","ý":"&yacute;","þ":"&thorn;","ÿ":"&yuml;",'"':"&quot;","&":"&amp;","<":"&lt;",">":"&gt;","Œ":"&OElig;","œ":"&oelig;","Š":"&Scaron;","š":"&scaron;","Ÿ":"&Yuml;","ˆ":"&circ;","˜":"&tilde;"," ":"&ensp;"," ":"&emsp;"," ":"&thinsp;","‌":"&zwnj;","‍":"&zwj;","‎":"&lrm;","‏":"&rlm;","–":"&ndash;","—":"&mdash;","‘":"&lsquo;","’":"&rsquo;","‚":"&sbquo;","“":"&ldquo;","”":"&rdquo;","„":"&bdquo;","†":"&dagger;","‡":"&Dagger;","‰":"&permil;","‹":"&lsaquo;","›":"&rsaquo;","€":"&euro;","ƒ":"&fnof;","Α":"&Alpha;","Β":"&Beta;","Γ":"&Gamma;","Δ":"&Delta;","Ε":"&Epsilon;","Ζ":"&Zeta;","Η":"&Eta;","Θ":"&Theta;","Ι":"&Iota;","Κ":"&Kappa;","Λ":"&Lambda;","Μ":"&Mu;","Ν":"&Nu;","Ξ":"&Xi;","Ο":"&Omicron;","Π":"&Pi;","Ρ":"&Rho;","Σ":"&Sigma;","Τ":"&Tau;","Υ":"&Upsilon;","Φ":"&Phi;","Χ":"&Chi;","Ψ":"&Psi;","Ω":"&Omega;","α":"&alpha;","β":"&beta;","γ":"&gamma;","δ":"&delta;","ε":"&epsilon;","ζ":"&zeta;","η":"&eta;","θ":"&theta;","ι":"&iota;","κ":"&kappa;","λ":"&lambda;","μ":"&mu;","ν":"&nu;","ξ":"&xi;","ο":"&omicron;","π":"&pi;","ρ":"&rho;","ς":"&sigmaf;","σ":"&sigma;","τ":"&tau;","υ":"&upsilon;","φ":"&phi;","χ":"&chi;","ψ":"&psi;","ω":"&omega;","ϑ":"&thetasym;","ϒ":"&upsih;","ϖ":"&piv;","•":"&bull;","…":"&hellip;","′":"&prime;","″":"&Prime;","‾":"&oline;","⁄":"&frasl;","℘":"&weierp;","ℑ":"&image;","ℜ":"&real;","™":"&trade;","ℵ":"&alefsym;","←":"&larr;","↑":"&uarr;","→":"&rarr;","↓":"&darr;","↔":"&harr;","↵":"&crarr;","⇐":"&lArr;","⇑":"&uArr;","⇒":"&rArr;","⇓":"&dArr;","⇔":"&hArr;","∀":"&forall;","∂":"&part;","∃":"&exist;","∅":"&empty;","∇":"&nabla;","∈":"&isin;","∉":"&notin;","∋":"&ni;","∏":"&prod;","∑":"&sum;","−":"&minus;","∗":"&lowast;","√":"&radic;","∝":"&prop;","∞":"&infin;","∠":"&ang;","∧":"&and;","∨":"&or;","∩":"&cap;","∪":"&cup;","∫":"&int;","∴":"&there4;","∼":"&sim;","≅":"&cong;","≈":"&asymp;","≠":"&ne;","≡":"&equiv;","≤":"&le;","≥":"&ge;","⊂":"&sub;","⊃":"&sup;","⊄":"&nsub;","⊆":"&sube;","⊇":"&supe;","⊕":"&oplus;","⊗":"&otimes;","⊥":"&perp;","⋅":"&sdot;","⌈":"&lceil;","⌉":"&rceil;","⌊":"&lfloor;","⌋":"&rfloor;","〈":"&lang;","〉":"&rang;","◊":"&loz;","♠":"&spades;","♣":"&clubs;","♥":"&hearts;","♦":"&diams;"}},html5:{entities:{"&AElig":"Æ","&AElig;":"Æ","&AMP":"&","&AMP;":"&","&Aacute":"Á","&Aacute;":"Á","&Abreve;":"Ă","&Acirc":"Â","&Acirc;":"Â","&Acy;":"А","&Afr;":"𝔄","&Agrave":"À","&Agrave;":"À","&Alpha;":"Α","&Amacr;":"Ā","&And;":"⩓","&Aogon;":"Ą","&Aopf;":"𝔸","&ApplyFunction;":"⁡","&Aring":"Å","&Aring;":"Å","&Ascr;":"𝒜","&Assign;":"≔","&Atilde":"Ã","&Atilde;":"Ã","&Auml":"Ä","&Auml;":"Ä","&Backslash;":"∖","&Barv;":"⫧","&Barwed;":"⌆","&Bcy;":"Б","&Because;":"∵","&Bernoullis;":"ℬ","&Beta;":"Β","&Bfr;":"𝔅","&Bopf;":"𝔹","&Breve;":"˘","&Bscr;":"ℬ","&Bumpeq;":"≎","&CHcy;":"Ч","&COPY":"©","&COPY;":"©","&Cacute;":"Ć","&Cap;":"⋒","&CapitalDifferentialD;":"ⅅ","&Cayleys;":"ℭ","&Ccaron;":"Č","&Ccedil":"Ç","&Ccedil;":"Ç","&Ccirc;":"Ĉ","&Cconint;":"∰","&Cdot;":"Ċ","&Cedilla;":"¸","&CenterDot;":"·","&Cfr;":"ℭ","&Chi;":"Χ","&CircleDot;":"⊙","&CircleMinus;":"⊖","&CirclePlus;":"⊕","&CircleTimes;":"⊗","&ClockwiseContourIntegral;":"∲","&CloseCurlyDoubleQuote;":"”","&CloseCurlyQuote;":"’","&Colon;":"∷","&Colone;":"⩴","&Congruent;":"≡","&Conint;":"∯","&ContourIntegral;":"∮","&Copf;":"ℂ","&Coproduct;":"∐","&CounterClockwiseContourIntegral;":"∳","&Cross;":"⨯","&Cscr;":"𝒞","&Cup;":"⋓","&CupCap;":"≍","&DD;":"ⅅ","&DDotrahd;":"⤑","&DJcy;":"Ђ","&DScy;":"Ѕ","&DZcy;":"Џ","&Dagger;":"‡","&Darr;":"↡","&Dashv;":"⫤","&Dcaron;":"Ď","&Dcy;":"Д","&Del;":"∇","&Delta;":"Δ","&Dfr;":"𝔇","&DiacriticalAcute;":"´","&DiacriticalDot;":"˙","&DiacriticalDoubleAcute;":"˝","&DiacriticalGrave;":"`","&DiacriticalTilde;":"˜","&Diamond;":"⋄","&DifferentialD;":"ⅆ","&Dopf;":"𝔻","&Dot;":"¨","&DotDot;":"⃜","&DotEqual;":"≐","&DoubleContourIntegral;":"∯","&DoubleDot;":"¨","&DoubleDownArrow;":"⇓","&DoubleLeftArrow;":"⇐","&DoubleLeftRightArrow;":"⇔","&DoubleLeftTee;":"⫤","&DoubleLongLeftArrow;":"⟸","&DoubleLongLeftRightArrow;":"⟺","&DoubleLongRightArrow;":"⟹","&DoubleRightArrow;":"⇒","&DoubleRightTee;":"⊨","&DoubleUpArrow;":"⇑","&DoubleUpDownArrow;":"⇕","&DoubleVerticalBar;":"∥","&DownArrow;":"↓","&DownArrowBar;":"⤓","&DownArrowUpArrow;":"⇵","&DownBreve;":"̑","&DownLeftRightVector;":"⥐","&DownLeftTeeVector;":"⥞","&DownLeftVector;":"↽","&DownLeftVectorBar;":"⥖","&DownRightTeeVector;":"⥟","&DownRightVector;":"⇁","&DownRightVectorBar;":"⥗","&DownTee;":"⊤","&DownTeeArrow;":"↧","&Downarrow;":"⇓","&Dscr;":"𝒟","&Dstrok;":"Đ","&ENG;":"Ŋ","&ETH":"Ð","&ETH;":"Ð","&Eacute":"É","&Eacute;":"É","&Ecaron;":"Ě","&Ecirc":"Ê","&Ecirc;":"Ê","&Ecy;":"Э","&Edot;":"Ė","&Efr;":"𝔈","&Egrave":"È","&Egrave;":"È","&Element;":"∈","&Emacr;":"Ē","&EmptySmallSquare;":"◻","&EmptyVerySmallSquare;":"▫","&Eogon;":"Ę","&Eopf;":"𝔼","&Epsilon;":"Ε","&Equal;":"⩵","&EqualTilde;":"≂","&Equilibrium;":"⇌","&Escr;":"ℰ","&Esim;":"⩳","&Eta;":"Η","&Euml":"Ë","&Euml;":"Ë","&Exists;":"∃","&ExponentialE;":"ⅇ","&Fcy;":"Ф","&Ffr;":"𝔉","&FilledSmallSquare;":"◼","&FilledVerySmallSquare;":"▪","&Fopf;":"𝔽","&ForAll;":"∀","&Fouriertrf;":"ℱ","&Fscr;":"ℱ","&GJcy;":"Ѓ","&GT":">","&GT;":">","&Gamma;":"Γ","&Gammad;":"Ϝ","&Gbreve;":"Ğ","&Gcedil;":"Ģ","&Gcirc;":"Ĝ","&Gcy;":"Г","&Gdot;":"Ġ","&Gfr;":"𝔊","&Gg;":"⋙","&Gopf;":"𝔾","&GreaterEqual;":"≥","&GreaterEqualLess;":"⋛","&GreaterFullEqual;":"≧","&GreaterGreater;":"⪢","&GreaterLess;":"≷","&GreaterSlantEqual;":"⩾","&GreaterTilde;":"≳","&Gscr;":"𝒢","&Gt;":"≫","&HARDcy;":"Ъ","&Hacek;":"ˇ","&Hat;":"^","&Hcirc;":"Ĥ","&Hfr;":"ℌ","&HilbertSpace;":"ℋ","&Hopf;":"ℍ","&HorizontalLine;":"─","&Hscr;":"ℋ","&Hstrok;":"Ħ","&HumpDownHump;":"≎","&HumpEqual;":"≏","&IEcy;":"Е","&IJlig;":"Ĳ","&IOcy;":"Ё","&Iacute":"Í","&Iacute;":"Í","&Icirc":"Î","&Icirc;":"Î","&Icy;":"И","&Idot;":"İ","&Ifr;":"ℑ","&Igrave":"Ì","&Igrave;":"Ì","&Im;":"ℑ","&Imacr;":"Ī","&ImaginaryI;":"ⅈ","&Implies;":"⇒","&Int;":"∬","&Integral;":"∫","&Intersection;":"⋂","&InvisibleComma;":"⁣","&InvisibleTimes;":"⁢","&Iogon;":"Į","&Iopf;":"𝕀","&Iota;":"Ι","&Iscr;":"ℐ","&Itilde;":"Ĩ","&Iukcy;":"І","&Iuml":"Ï","&Iuml;":"Ï","&Jcirc;":"Ĵ","&Jcy;":"Й","&Jfr;":"𝔍","&Jopf;":"𝕁","&Jscr;":"𝒥","&Jsercy;":"Ј","&Jukcy;":"Є","&KHcy;":"Х","&KJcy;":"Ќ","&Kappa;":"Κ","&Kcedil;":"Ķ","&Kcy;":"К","&Kfr;":"𝔎","&Kopf;":"𝕂","&Kscr;":"𝒦","&LJcy;":"Љ","&LT":"<","&LT;":"<","&Lacute;":"Ĺ","&Lambda;":"Λ","&Lang;":"⟪","&Laplacetrf;":"ℒ","&Larr;":"↞","&Lcaron;":"Ľ","&Lcedil;":"Ļ","&Lcy;":"Л","&LeftAngleBracket;":"⟨","&LeftArrow;":"←","&LeftArrowBar;":"⇤","&LeftArrowRightArrow;":"⇆","&LeftCeiling;":"⌈","&LeftDoubleBracket;":"⟦","&LeftDownTeeVector;":"⥡","&LeftDownVector;":"⇃","&LeftDownVectorBar;":"⥙","&LeftFloor;":"⌊","&LeftRightArrow;":"↔","&LeftRightVector;":"⥎","&LeftTee;":"⊣","&LeftTeeArrow;":"↤","&LeftTeeVector;":"⥚","&LeftTriangle;":"⊲","&LeftTriangleBar;":"⧏","&LeftTriangleEqual;":"⊴","&LeftUpDownVector;":"⥑","&LeftUpTeeVector;":"⥠","&LeftUpVector;":"↿","&LeftUpVectorBar;":"⥘","&LeftVector;":"↼","&LeftVectorBar;":"⥒","&Leftarrow;":"⇐","&Leftrightarrow;":"⇔","&LessEqualGreater;":"⋚","&LessFullEqual;":"≦","&LessGreater;":"≶","&LessLess;":"⪡","&LessSlantEqual;":"⩽","&LessTilde;":"≲","&Lfr;":"𝔏","&Ll;":"⋘","&Lleftarrow;":"⇚","&Lmidot;":"Ŀ","&LongLeftArrow;":"⟵","&LongLeftRightArrow;":"⟷","&LongRightArrow;":"⟶","&Longleftarrow;":"⟸","&Longleftrightarrow;":"⟺","&Longrightarrow;":"⟹","&Lopf;":"𝕃","&LowerLeftArrow;":"↙","&LowerRightArrow;":"↘","&Lscr;":"ℒ","&Lsh;":"↰","&Lstrok;":"Ł","&Lt;":"≪","&Map;":"⤅","&Mcy;":"М","&MediumSpace;":" ","&Mellintrf;":"ℳ","&Mfr;":"𝔐","&MinusPlus;":"∓","&Mopf;":"𝕄","&Mscr;":"ℳ","&Mu;":"Μ","&NJcy;":"Њ","&Nacute;":"Ń","&Ncaron;":"Ň","&Ncedil;":"Ņ","&Ncy;":"Н","&NegativeMediumSpace;":"​","&NegativeThickSpace;":"​","&NegativeThinSpace;":"​","&NegativeVeryThinSpace;":"​","&NestedGreaterGreater;":"≫","&NestedLessLess;":"≪","&NewLine;":"\n","&Nfr;":"𝔑","&NoBreak;":"⁠","&NonBreakingSpace;":" ","&Nopf;":"ℕ","&Not;":"⫬","&NotCongruent;":"≢","&NotCupCap;":"≭","&NotDoubleVerticalBar;":"∦","&NotElement;":"∉","&NotEqual;":"≠","&NotEqualTilde;":"≂̸","&NotExists;":"∄","&NotGreater;":"≯","&NotGreaterEqual;":"≱","&NotGreaterFullEqual;":"≧̸","&NotGreaterGreater;":"≫̸","&NotGreaterLess;":"≹","&NotGreaterSlantEqual;":"⩾̸","&NotGreaterTilde;":"≵","&NotHumpDownHump;":"≎̸","&NotHumpEqual;":"≏̸","&NotLeftTriangle;":"⋪","&NotLeftTriangleBar;":"⧏̸","&NotLeftTriangleEqual;":"⋬","&NotLess;":"≮","&NotLessEqual;":"≰","&NotLessGreater;":"≸","&NotLessLess;":"≪̸","&NotLessSlantEqual;":"⩽̸","&NotLessTilde;":"≴","&NotNestedGreaterGreater;":"⪢̸","&NotNestedLessLess;":"⪡̸","&NotPrecedes;":"⊀","&NotPrecedesEqual;":"⪯̸","&NotPrecedesSlantEqual;":"⋠","&NotReverseElement;":"∌","&NotRightTriangle;":"⋫","&NotRightTriangleBar;":"⧐̸","&NotRightTriangleEqual;":"⋭","&NotSquareSubset;":"⊏̸","&NotSquareSubsetEqual;":"⋢","&NotSquareSuperset;":"⊐̸","&NotSquareSupersetEqual;":"⋣","&NotSubset;":"⊂⃒","&NotSubsetEqual;":"⊈","&NotSucceeds;":"⊁","&NotSucceedsEqual;":"⪰̸","&NotSucceedsSlantEqual;":"⋡","&NotSucceedsTilde;":"≿̸","&NotSuperset;":"⊃⃒","&NotSupersetEqual;":"⊉","&NotTilde;":"≁","&NotTildeEqual;":"≄","&NotTildeFullEqual;":"≇","&NotTildeTilde;":"≉","&NotVerticalBar;":"∤","&Nscr;":"𝒩","&Ntilde":"Ñ","&Ntilde;":"Ñ","&Nu;":"Ν","&OElig;":"Œ","&Oacute":"Ó","&Oacute;":"Ó","&Ocirc":"Ô","&Ocirc;":"Ô","&Ocy;":"О","&Odblac;":"Ő","&Ofr;":"𝔒","&Ograve":"Ò","&Ograve;":"Ò","&Omacr;":"Ō","&Omega;":"Ω","&Omicron;":"Ο","&Oopf;":"𝕆","&OpenCurlyDoubleQuote;":"“","&OpenCurlyQuote;":"‘","&Or;":"⩔","&Oscr;":"𝒪","&Oslash":"Ø","&Oslash;":"Ø","&Otilde":"Õ","&Otilde;":"Õ","&Otimes;":"⨷","&Ouml":"Ö","&Ouml;":"Ö","&OverBar;":"‾","&OverBrace;":"⏞","&OverBracket;":"⎴","&OverParenthesis;":"⏜","&PartialD;":"∂","&Pcy;":"П","&Pfr;":"𝔓","&Phi;":"Φ","&Pi;":"Π","&PlusMinus;":"±","&Poincareplane;":"ℌ","&Popf;":"ℙ","&Pr;":"⪻","&Precedes;":"≺","&PrecedesEqual;":"⪯","&PrecedesSlantEqual;":"≼","&PrecedesTilde;":"≾","&Prime;":"″","&Product;":"∏","&Proportion;":"∷","&Proportional;":"∝","&Pscr;":"𝒫","&Psi;":"Ψ","&QUOT":'"',"&QUOT;":'"',"&Qfr;":"𝔔","&Qopf;":"ℚ","&Qscr;":"𝒬","&RBarr;":"⤐","&REG":"®","&REG;":"®","&Racute;":"Ŕ","&Rang;":"⟫","&Rarr;":"↠","&Rarrtl;":"⤖","&Rcaron;":"Ř","&Rcedil;":"Ŗ","&Rcy;":"Р","&Re;":"ℜ","&ReverseElement;":"∋","&ReverseEquilibrium;":"⇋","&ReverseUpEquilibrium;":"⥯","&Rfr;":"ℜ","&Rho;":"Ρ","&RightAngleBracket;":"⟩","&RightArrow;":"→","&RightArrowBar;":"⇥","&RightArrowLeftArrow;":"⇄","&RightCeiling;":"⌉","&RightDoubleBracket;":"⟧","&RightDownTeeVector;":"⥝","&RightDownVector;":"⇂","&RightDownVectorBar;":"⥕","&RightFloor;":"⌋","&RightTee;":"⊢","&RightTeeArrow;":"↦","&RightTeeVector;":"⥛","&RightTriangle;":"⊳","&RightTriangleBar;":"⧐","&RightTriangleEqual;":"⊵","&RightUpDownVector;":"⥏","&RightUpTeeVector;":"⥜","&RightUpVector;":"↾","&RightUpVectorBar;":"⥔","&RightVector;":"⇀","&RightVectorBar;":"⥓","&Rightarrow;":"⇒","&Ropf;":"ℝ","&RoundImplies;":"⥰","&Rrightarrow;":"⇛","&Rscr;":"ℛ","&Rsh;":"↱","&RuleDelayed;":"⧴","&SHCHcy;":"Щ","&SHcy;":"Ш","&SOFTcy;":"Ь","&Sacute;":"Ś","&Sc;":"⪼","&Scaron;":"Š","&Scedil;":"Ş","&Scirc;":"Ŝ","&Scy;":"С","&Sfr;":"𝔖","&ShortDownArrow;":"↓","&ShortLeftArrow;":"←","&ShortRightArrow;":"→","&ShortUpArrow;":"↑","&Sigma;":"Σ","&SmallCircle;":"∘","&Sopf;":"𝕊","&Sqrt;":"√","&Square;":"□","&SquareIntersection;":"⊓","&SquareSubset;":"⊏","&SquareSubsetEqual;":"⊑","&SquareSuperset;":"⊐","&SquareSupersetEqual;":"⊒","&SquareUnion;":"⊔","&Sscr;":"𝒮","&Star;":"⋆","&Sub;":"⋐","&Subset;":"⋐","&SubsetEqual;":"⊆","&Succeeds;":"≻","&SucceedsEqual;":"⪰","&SucceedsSlantEqual;":"≽","&SucceedsTilde;":"≿","&SuchThat;":"∋","&Sum;":"∑","&Sup;":"⋑","&Superset;":"⊃","&SupersetEqual;":"⊇","&Supset;":"⋑","&THORN":"Þ","&THORN;":"Þ","&TRADE;":"™","&TSHcy;":"Ћ","&TScy;":"Ц","&Tab;":"\t","&Tau;":"Τ","&Tcaron;":"Ť","&Tcedil;":"Ţ","&Tcy;":"Т","&Tfr;":"𝔗","&Therefore;":"∴","&Theta;":"Θ","&ThickSpace;":"  ","&ThinSpace;":" ","&Tilde;":"∼","&TildeEqual;":"≃","&TildeFullEqual;":"≅","&TildeTilde;":"≈","&Topf;":"𝕋","&TripleDot;":"⃛","&Tscr;":"𝒯","&Tstrok;":"Ŧ","&Uacute":"Ú","&Uacute;":"Ú","&Uarr;":"↟","&Uarrocir;":"⥉","&Ubrcy;":"Ў","&Ubreve;":"Ŭ","&Ucirc":"Û","&Ucirc;":"Û","&Ucy;":"У","&Udblac;":"Ű","&Ufr;":"𝔘","&Ugrave":"Ù","&Ugrave;":"Ù","&Umacr;":"Ū","&UnderBar;":"_","&UnderBrace;":"⏟","&UnderBracket;":"⎵","&UnderParenthesis;":"⏝","&Union;":"⋃","&UnionPlus;":"⊎","&Uogon;":"Ų","&Uopf;":"𝕌","&UpArrow;":"↑","&UpArrowBar;":"⤒","&UpArrowDownArrow;":"⇅","&UpDownArrow;":"↕","&UpEquilibrium;":"⥮","&UpTee;":"⊥","&UpTeeArrow;":"↥","&Uparrow;":"⇑","&Updownarrow;":"⇕","&UpperLeftArrow;":"↖","&UpperRightArrow;":"↗","&Upsi;":"ϒ","&Upsilon;":"Υ","&Uring;":"Ů","&Uscr;":"𝒰","&Utilde;":"Ũ","&Uuml":"Ü","&Uuml;":"Ü","&VDash;":"⊫","&Vbar;":"⫫","&Vcy;":"В","&Vdash;":"⊩","&Vdashl;":"⫦","&Vee;":"⋁","&Verbar;":"‖","&Vert;":"‖","&VerticalBar;":"∣","&VerticalLine;":"|","&VerticalSeparator;":"❘","&VerticalTilde;":"≀","&VeryThinSpace;":" ","&Vfr;":"𝔙","&Vopf;":"𝕍","&Vscr;":"𝒱","&Vvdash;":"⊪","&Wcirc;":"Ŵ","&Wedge;":"⋀","&Wfr;":"𝔚","&Wopf;":"𝕎","&Wscr;":"𝒲","&Xfr;":"𝔛","&Xi;":"Ξ","&Xopf;":"𝕏","&Xscr;":"𝒳","&YAcy;":"Я","&YIcy;":"Ї","&YUcy;":"Ю","&Yacute":"Ý","&Yacute;":"Ý","&Ycirc;":"Ŷ","&Ycy;":"Ы","&Yfr;":"𝔜","&Yopf;":"𝕐","&Yscr;":"𝒴","&Yuml;":"Ÿ","&ZHcy;":"Ж","&Zacute;":"Ź","&Zcaron;":"Ž","&Zcy;":"З","&Zdot;":"Ż","&ZeroWidthSpace;":"​","&Zeta;":"Ζ","&Zfr;":"ℨ","&Zopf;":"ℤ","&Zscr;":"𝒵","&aacute":"á","&aacute;":"á","&abreve;":"ă","&ac;":"∾","&acE;":"∾̳","&acd;":"∿","&acirc":"â","&acirc;":"â","&acute":"´","&acute;":"´","&acy;":"а","&aelig":"æ","&aelig;":"æ","&af;":"⁡","&afr;":"𝔞","&agrave":"à","&agrave;":"à","&alefsym;":"ℵ","&aleph;":"ℵ","&alpha;":"α","&amacr;":"ā","&amalg;":"⨿","&amp":"&","&amp;":"&","&and;":"∧","&andand;":"⩕","&andd;":"⩜","&andslope;":"⩘","&andv;":"⩚","&ang;":"∠","&ange;":"⦤","&angle;":"∠","&angmsd;":"∡","&angmsdaa;":"⦨","&angmsdab;":"⦩","&angmsdac;":"⦪","&angmsdad;":"⦫","&angmsdae;":"⦬","&angmsdaf;":"⦭","&angmsdag;":"⦮","&angmsdah;":"⦯","&angrt;":"∟","&angrtvb;":"⊾","&angrtvbd;":"⦝","&angsph;":"∢","&angst;":"Å","&angzarr;":"⍼","&aogon;":"ą","&aopf;":"𝕒","&ap;":"≈","&apE;":"⩰","&apacir;":"⩯","&ape;":"≊","&apid;":"≋","&apos;":"'","&approx;":"≈","&approxeq;":"≊","&aring":"å","&aring;":"å","&ascr;":"𝒶","&ast;":"*","&asymp;":"≈","&asympeq;":"≍","&atilde":"ã","&atilde;":"ã","&auml":"ä","&auml;":"ä","&awconint;":"∳","&awint;":"⨑","&bNot;":"⫭","&backcong;":"≌","&backepsilon;":"϶","&backprime;":"‵","&backsim;":"∽","&backsimeq;":"⋍","&barvee;":"⊽","&barwed;":"⌅","&barwedge;":"⌅","&bbrk;":"⎵","&bbrktbrk;":"⎶","&bcong;":"≌","&bcy;":"б","&bdquo;":"„","&becaus;":"∵","&because;":"∵","&bemptyv;":"⦰","&bepsi;":"϶","&bernou;":"ℬ","&beta;":"β","&beth;":"ℶ","&between;":"≬","&bfr;":"𝔟","&bigcap;":"⋂","&bigcirc;":"◯","&bigcup;":"⋃","&bigodot;":"⨀","&bigoplus;":"⨁","&bigotimes;":"⨂","&bigsqcup;":"⨆","&bigstar;":"★","&bigtriangledown;":"▽","&bigtriangleup;":"△","&biguplus;":"⨄","&bigvee;":"⋁","&bigwedge;":"⋀","&bkarow;":"⤍","&blacklozenge;":"⧫","&blacksquare;":"▪","&blacktriangle;":"▴","&blacktriangledown;":"▾","&blacktriangleleft;":"◂","&blacktriangleright;":"▸","&blank;":"␣","&blk12;":"▒","&blk14;":"░","&blk34;":"▓","&block;":"█","&bne;":"=⃥","&bnequiv;":"≡⃥","&bnot;":"⌐","&bopf;":"𝕓","&bot;":"⊥","&bottom;":"⊥","&bowtie;":"⋈","&boxDL;":"╗","&boxDR;":"╔","&boxDl;":"╖","&boxDr;":"╓","&boxH;":"═","&boxHD;":"╦","&boxHU;":"╩","&boxHd;":"╤","&boxHu;":"╧","&boxUL;":"╝","&boxUR;":"╚","&boxUl;":"╜","&boxUr;":"╙","&boxV;":"║","&boxVH;":"╬","&boxVL;":"╣","&boxVR;":"╠","&boxVh;":"╫","&boxVl;":"╢","&boxVr;":"╟","&boxbox;":"⧉","&boxdL;":"╕","&boxdR;":"╒","&boxdl;":"┐","&boxdr;":"┌","&boxh;":"─","&boxhD;":"╥","&boxhU;":"╨","&boxhd;":"┬","&boxhu;":"┴","&boxminus;":"⊟","&boxplus;":"⊞","&boxtimes;":"⊠","&boxuL;":"╛","&boxuR;":"╘","&boxul;":"┘","&boxur;":"└","&boxv;":"│","&boxvH;":"╪","&boxvL;":"╡","&boxvR;":"╞","&boxvh;":"┼","&boxvl;":"┤","&boxvr;":"├","&bprime;":"‵","&breve;":"˘","&brvbar":"¦","&brvbar;":"¦","&bscr;":"𝒷","&bsemi;":"⁏","&bsim;":"∽","&bsime;":"⋍","&bsol;":"\\","&bsolb;":"⧅","&bsolhsub;":"⟈","&bull;":"•","&bullet;":"•","&bump;":"≎","&bumpE;":"⪮","&bumpe;":"≏","&bumpeq;":"≏","&cacute;":"ć","&cap;":"∩","&capand;":"⩄","&capbrcup;":"⩉","&capcap;":"⩋","&capcup;":"⩇","&capdot;":"⩀","&caps;":"∩︀","&caret;":"⁁","&caron;":"ˇ","&ccaps;":"⩍","&ccaron;":"č","&ccedil":"ç","&ccedil;":"ç","&ccirc;":"ĉ","&ccups;":"⩌","&ccupssm;":"⩐","&cdot;":"ċ","&cedil":"¸","&cedil;":"¸","&cemptyv;":"⦲","&cent":"¢","&cent;":"¢","&centerdot;":"·","&cfr;":"𝔠","&chcy;":"ч","&check;":"✓","&checkmark;":"✓","&chi;":"χ","&cir;":"○","&cirE;":"⧃","&circ;":"ˆ","&circeq;":"≗","&circlearrowleft;":"↺","&circlearrowright;":"↻","&circledR;":"®","&circledS;":"Ⓢ","&circledast;":"⊛","&circledcirc;":"⊚","&circleddash;":"⊝","&cire;":"≗","&cirfnint;":"⨐","&cirmid;":"⫯","&cirscir;":"⧂","&clubs;":"♣","&clubsuit;":"♣","&colon;":":","&colone;":"≔","&coloneq;":"≔","&comma;":",","&commat;":"@","&comp;":"∁","&compfn;":"∘","&complement;":"∁","&complexes;":"ℂ","&cong;":"≅","&congdot;":"⩭","&conint;":"∮","&copf;":"𝕔","&coprod;":"∐","&copy":"©","&copy;":"©","&copysr;":"℗","&crarr;":"↵","&cross;":"✗","&cscr;":"𝒸","&csub;":"⫏","&csube;":"⫑","&csup;":"⫐","&csupe;":"⫒","&ctdot;":"⋯","&cudarrl;":"⤸","&cudarrr;":"⤵","&cuepr;":"⋞","&cuesc;":"⋟","&cularr;":"↶","&cularrp;":"⤽","&cup;":"∪","&cupbrcap;":"⩈","&cupcap;":"⩆","&cupcup;":"⩊","&cupdot;":"⊍","&cupor;":"⩅","&cups;":"∪︀","&curarr;":"↷","&curarrm;":"⤼","&curlyeqprec;":"⋞","&curlyeqsucc;":"⋟","&curlyvee;":"⋎","&curlywedge;":"⋏","&curren":"¤","&curren;":"¤","&curvearrowleft;":"↶","&curvearrowright;":"↷","&cuvee;":"⋎","&cuwed;":"⋏","&cwconint;":"∲","&cwint;":"∱","&cylcty;":"⌭","&dArr;":"⇓","&dHar;":"⥥","&dagger;":"†","&daleth;":"ℸ","&darr;":"↓","&dash;":"‐","&dashv;":"⊣","&dbkarow;":"⤏","&dblac;":"˝","&dcaron;":"ď","&dcy;":"д","&dd;":"ⅆ","&ddagger;":"‡","&ddarr;":"⇊","&ddotseq;":"⩷","&deg":"°","&deg;":"°","&delta;":"δ","&demptyv;":"⦱","&dfisht;":"⥿","&dfr;":"𝔡","&dharl;":"⇃","&dharr;":"⇂","&diam;":"⋄","&diamond;":"⋄","&diamondsuit;":"♦","&diams;":"♦","&die;":"¨","&digamma;":"ϝ","&disin;":"⋲","&div;":"÷","&divide":"÷","&divide;":"÷","&divideontimes;":"⋇","&divonx;":"⋇","&djcy;":"ђ","&dlcorn;":"⌞","&dlcrop;":"⌍","&dollar;":"$","&dopf;":"𝕕","&dot;":"˙","&doteq;":"≐","&doteqdot;":"≑","&dotminus;":"∸","&dotplus;":"∔","&dotsquare;":"⊡","&doublebarwedge;":"⌆","&downarrow;":"↓","&downdownarrows;":"⇊","&downharpoonleft;":"⇃","&downharpoonright;":"⇂","&drbkarow;":"⤐","&drcorn;":"⌟","&drcrop;":"⌌","&dscr;":"𝒹","&dscy;":"ѕ","&dsol;":"⧶","&dstrok;":"đ","&dtdot;":"⋱","&dtri;":"▿","&dtrif;":"▾","&duarr;":"⇵","&duhar;":"⥯","&dwangle;":"⦦","&dzcy;":"џ","&dzigrarr;":"⟿","&eDDot;":"⩷","&eDot;":"≑","&eacute":"é","&eacute;":"é","&easter;":"⩮","&ecaron;":"ě","&ecir;":"≖","&ecirc":"ê","&ecirc;":"ê","&ecolon;":"≕","&ecy;":"э","&edot;":"ė","&ee;":"ⅇ","&efDot;":"≒","&efr;":"𝔢","&eg;":"⪚","&egrave":"è","&egrave;":"è","&egs;":"⪖","&egsdot;":"⪘","&el;":"⪙","&elinters;":"⏧","&ell;":"ℓ","&els;":"⪕","&elsdot;":"⪗","&emacr;":"ē","&empty;":"∅","&emptyset;":"∅","&emptyv;":"∅","&emsp13;":" ","&emsp14;":" ","&emsp;":" ","&eng;":"ŋ","&ensp;":" ","&eogon;":"ę","&eopf;":"𝕖","&epar;":"⋕","&eparsl;":"⧣","&eplus;":"⩱","&epsi;":"ε","&epsilon;":"ε","&epsiv;":"ϵ","&eqcirc;":"≖","&eqcolon;":"≕","&eqsim;":"≂","&eqslantgtr;":"⪖","&eqslantless;":"⪕","&equals;":"=","&equest;":"≟","&equiv;":"≡","&equivDD;":"⩸","&eqvparsl;":"⧥","&erDot;":"≓","&erarr;":"⥱","&escr;":"ℯ","&esdot;":"≐","&esim;":"≂","&eta;":"η","&eth":"ð","&eth;":"ð","&euml":"ë","&euml;":"ë","&euro;":"€","&excl;":"!","&exist;":"∃","&expectation;":"ℰ","&exponentiale;":"ⅇ","&fallingdotseq;":"≒","&fcy;":"ф","&female;":"♀","&ffilig;":"ﬃ","&fflig;":"ﬀ","&ffllig;":"ﬄ","&ffr;":"𝔣","&filig;":"ﬁ","&fjlig;":"fj","&flat;":"♭","&fllig;":"ﬂ","&fltns;":"▱","&fnof;":"ƒ","&fopf;":"𝕗","&forall;":"∀","&fork;":"⋔","&forkv;":"⫙","&fpartint;":"⨍","&frac12":"½","&frac12;":"½","&frac13;":"⅓","&frac14":"¼","&frac14;":"¼","&frac15;":"⅕","&frac16;":"⅙","&frac18;":"⅛","&frac23;":"⅔","&frac25;":"⅖","&frac34":"¾","&frac34;":"¾","&frac35;":"⅗","&frac38;":"⅜","&frac45;":"⅘","&frac56;":"⅚","&frac58;":"⅝","&frac78;":"⅞","&frasl;":"⁄","&frown;":"⌢","&fscr;":"𝒻","&gE;":"≧","&gEl;":"⪌","&gacute;":"ǵ","&gamma;":"γ","&gammad;":"ϝ","&gap;":"⪆","&gbreve;":"ğ","&gcirc;":"ĝ","&gcy;":"г","&gdot;":"ġ","&ge;":"≥","&gel;":"⋛","&geq;":"≥","&geqq;":"≧","&geqslant;":"⩾","&ges;":"⩾","&gescc;":"⪩","&gesdot;":"⪀","&gesdoto;":"⪂","&gesdotol;":"⪄","&gesl;":"⋛︀","&gesles;":"⪔","&gfr;":"𝔤","&gg;":"≫","&ggg;":"⋙","&gimel;":"ℷ","&gjcy;":"ѓ","&gl;":"≷","&glE;":"⪒","&gla;":"⪥","&glj;":"⪤","&gnE;":"≩","&gnap;":"⪊","&gnapprox;":"⪊","&gne;":"⪈","&gneq;":"⪈","&gneqq;":"≩","&gnsim;":"⋧","&gopf;":"𝕘","&grave;":"`","&gscr;":"ℊ","&gsim;":"≳","&gsime;":"⪎","&gsiml;":"⪐","&gt":">","&gt;":">","&gtcc;":"⪧","&gtcir;":"⩺","&gtdot;":"⋗","&gtlPar;":"⦕","&gtquest;":"⩼","&gtrapprox;":"⪆","&gtrarr;":"⥸","&gtrdot;":"⋗","&gtreqless;":"⋛","&gtreqqless;":"⪌","&gtrless;":"≷","&gtrsim;":"≳","&gvertneqq;":"≩︀","&gvnE;":"≩︀","&hArr;":"⇔","&hairsp;":" ","&half;":"½","&hamilt;":"ℋ","&hardcy;":"ъ","&harr;":"↔","&harrcir;":"⥈","&harrw;":"↭","&hbar;":"ℏ","&hcirc;":"ĥ","&hearts;":"♥","&heartsuit;":"♥","&hellip;":"…","&hercon;":"⊹","&hfr;":"𝔥","&hksearow;":"⤥","&hkswarow;":"⤦","&hoarr;":"⇿","&homtht;":"∻","&hookleftarrow;":"↩","&hookrightarrow;":"↪","&hopf;":"𝕙","&horbar;":"―","&hscr;":"𝒽","&hslash;":"ℏ","&hstrok;":"ħ","&hybull;":"⁃","&hyphen;":"‐","&iacute":"í","&iacute;":"í","&ic;":"⁣","&icirc":"î","&icirc;":"î","&icy;":"и","&iecy;":"е","&iexcl":"¡","&iexcl;":"¡","&iff;":"⇔","&ifr;":"𝔦","&igrave":"ì","&igrave;":"ì","&ii;":"ⅈ","&iiiint;":"⨌","&iiint;":"∭","&iinfin;":"⧜","&iiota;":"℩","&ijlig;":"ĳ","&imacr;":"ī","&image;":"ℑ","&imagline;":"ℐ","&imagpart;":"ℑ","&imath;":"ı","&imof;":"⊷","&imped;":"Ƶ","&in;":"∈","&incare;":"℅","&infin;":"∞","&infintie;":"⧝","&inodot;":"ı","&int;":"∫","&intcal;":"⊺","&integers;":"ℤ","&intercal;":"⊺","&intlarhk;":"⨗","&intprod;":"⨼","&iocy;":"ё","&iogon;":"į","&iopf;":"𝕚","&iota;":"ι","&iprod;":"⨼","&iquest":"¿","&iquest;":"¿","&iscr;":"𝒾","&isin;":"∈","&isinE;":"⋹","&isindot;":"⋵","&isins;":"⋴","&isinsv;":"⋳","&isinv;":"∈","&it;":"⁢","&itilde;":"ĩ","&iukcy;":"і","&iuml":"ï","&iuml;":"ï","&jcirc;":"ĵ","&jcy;":"й","&jfr;":"𝔧","&jmath;":"ȷ","&jopf;":"𝕛","&jscr;":"𝒿","&jsercy;":"ј","&jukcy;":"є","&kappa;":"κ","&kappav;":"ϰ","&kcedil;":"ķ","&kcy;":"к","&kfr;":"𝔨","&kgreen;":"ĸ","&khcy;":"х","&kjcy;":"ќ","&kopf;":"𝕜","&kscr;":"𝓀","&lAarr;":"⇚","&lArr;":"⇐","&lAtail;":"⤛","&lBarr;":"⤎","&lE;":"≦","&lEg;":"⪋","&lHar;":"⥢","&lacute;":"ĺ","&laemptyv;":"⦴","&lagran;":"ℒ","&lambda;":"λ","&lang;":"⟨","&langd;":"⦑","&langle;":"⟨","&lap;":"⪅","&laquo":"«","&laquo;":"«","&larr;":"←","&larrb;":"⇤","&larrbfs;":"⤟","&larrfs;":"⤝","&larrhk;":"↩","&larrlp;":"↫","&larrpl;":"⤹","&larrsim;":"⥳","&larrtl;":"↢","&lat;":"⪫","&latail;":"⤙","&late;":"⪭","&lates;":"⪭︀","&lbarr;":"⤌","&lbbrk;":"❲","&lbrace;":"{","&lbrack;":"[","&lbrke;":"⦋","&lbrksld;":"⦏","&lbrkslu;":"⦍","&lcaron;":"ľ","&lcedil;":"ļ","&lceil;":"⌈","&lcub;":"{","&lcy;":"л","&ldca;":"⤶","&ldquo;":"“","&ldquor;":"„","&ldrdhar;":"⥧","&ldrushar;":"⥋","&ldsh;":"↲","&le;":"≤","&leftarrow;":"←","&leftarrowtail;":"↢","&leftharpoondown;":"↽","&leftharpoonup;":"↼","&leftleftarrows;":"⇇","&leftrightarrow;":"↔","&leftrightarrows;":"⇆","&leftrightharpoons;":"⇋","&leftrightsquigarrow;":"↭","&leftthreetimes;":"⋋","&leg;":"⋚","&leq;":"≤","&leqq;":"≦","&leqslant;":"⩽","&les;":"⩽","&lescc;":"⪨","&lesdot;":"⩿","&lesdoto;":"⪁","&lesdotor;":"⪃","&lesg;":"⋚︀","&lesges;":"⪓","&lessapprox;":"⪅","&lessdot;":"⋖","&lesseqgtr;":"⋚","&lesseqqgtr;":"⪋","&lessgtr;":"≶","&lesssim;":"≲","&lfisht;":"⥼","&lfloor;":"⌊","&lfr;":"𝔩","&lg;":"≶","&lgE;":"⪑","&lhard;":"↽","&lharu;":"↼","&lharul;":"⥪","&lhblk;":"▄","&ljcy;":"љ","&ll;":"≪","&llarr;":"⇇","&llcorner;":"⌞","&llhard;":"⥫","&lltri;":"◺","&lmidot;":"ŀ","&lmoust;":"⎰","&lmoustache;":"⎰","&lnE;":"≨","&lnap;":"⪉","&lnapprox;":"⪉","&lne;":"⪇","&lneq;":"⪇","&lneqq;":"≨","&lnsim;":"⋦","&loang;":"⟬","&loarr;":"⇽","&lobrk;":"⟦","&longleftarrow;":"⟵","&longleftrightarrow;":"⟷","&longmapsto;":"⟼","&longrightarrow;":"⟶","&looparrowleft;":"↫","&looparrowright;":"↬","&lopar;":"⦅","&lopf;":"𝕝","&loplus;":"⨭","&lotimes;":"⨴","&lowast;":"∗","&lowbar;":"_","&loz;":"◊","&lozenge;":"◊","&lozf;":"⧫","&lpar;":"(","&lparlt;":"⦓","&lrarr;":"⇆","&lrcorner;":"⌟","&lrhar;":"⇋","&lrhard;":"⥭","&lrm;":"‎","&lrtri;":"⊿","&lsaquo;":"‹","&lscr;":"𝓁","&lsh;":"↰","&lsim;":"≲","&lsime;":"⪍","&lsimg;":"⪏","&lsqb;":"[","&lsquo;":"‘","&lsquor;":"‚","&lstrok;":"ł","&lt":"<","&lt;":"<","&ltcc;":"⪦","&ltcir;":"⩹","&ltdot;":"⋖","&lthree;":"⋋","&ltimes;":"⋉","&ltlarr;":"⥶","&ltquest;":"⩻","&ltrPar;":"⦖","&ltri;":"◃","&ltrie;":"⊴","&ltrif;":"◂","&lurdshar;":"⥊","&luruhar;":"⥦","&lvertneqq;":"≨︀","&lvnE;":"≨︀","&mDDot;":"∺","&macr":"¯","&macr;":"¯","&male;":"♂","&malt;":"✠","&maltese;":"✠","&map;":"↦","&mapsto;":"↦","&mapstodown;":"↧","&mapstoleft;":"↤","&mapstoup;":"↥","&marker;":"▮","&mcomma;":"⨩","&mcy;":"м","&mdash;":"—","&measuredangle;":"∡","&mfr;":"𝔪","&mho;":"℧","&micro":"µ","&micro;":"µ","&mid;":"∣","&midast;":"*","&midcir;":"⫰","&middot":"·","&middot;":"·","&minus;":"−","&minusb;":"⊟","&minusd;":"∸","&minusdu;":"⨪","&mlcp;":"⫛","&mldr;":"…","&mnplus;":"∓","&models;":"⊧","&mopf;":"𝕞","&mp;":"∓","&mscr;":"𝓂","&mstpos;":"∾","&mu;":"μ","&multimap;":"⊸","&mumap;":"⊸","&nGg;":"⋙̸","&nGt;":"≫⃒","&nGtv;":"≫̸","&nLeftarrow;":"⇍","&nLeftrightarrow;":"⇎","&nLl;":"⋘̸","&nLt;":"≪⃒","&nLtv;":"≪̸","&nRightarrow;":"⇏","&nVDash;":"⊯","&nVdash;":"⊮","&nabla;":"∇","&nacute;":"ń","&nang;":"∠⃒","&nap;":"≉","&napE;":"⩰̸","&napid;":"≋̸","&napos;":"ŉ","&napprox;":"≉","&natur;":"♮","&natural;":"♮","&naturals;":"ℕ","&nbsp":" ","&nbsp;":" ","&nbump;":"≎̸","&nbumpe;":"≏̸","&ncap;":"⩃","&ncaron;":"ň","&ncedil;":"ņ","&ncong;":"≇","&ncongdot;":"⩭̸","&ncup;":"⩂","&ncy;":"н","&ndash;":"–","&ne;":"≠","&neArr;":"⇗","&nearhk;":"⤤","&nearr;":"↗","&nearrow;":"↗","&nedot;":"≐̸","&nequiv;":"≢","&nesear;":"⤨","&nesim;":"≂̸","&nexist;":"∄","&nexists;":"∄","&nfr;":"𝔫","&ngE;":"≧̸","&nge;":"≱","&ngeq;":"≱","&ngeqq;":"≧̸","&ngeqslant;":"⩾̸","&nges;":"⩾̸","&ngsim;":"≵","&ngt;":"≯","&ngtr;":"≯","&nhArr;":"⇎","&nharr;":"↮","&nhpar;":"⫲","&ni;":"∋","&nis;":"⋼","&nisd;":"⋺","&niv;":"∋","&njcy;":"њ","&nlArr;":"⇍","&nlE;":"≦̸","&nlarr;":"↚","&nldr;":"‥","&nle;":"≰","&nleftarrow;":"↚","&nleftrightarrow;":"↮","&nleq;":"≰","&nleqq;":"≦̸","&nleqslant;":"⩽̸","&nles;":"⩽̸","&nless;":"≮","&nlsim;":"≴","&nlt;":"≮","&nltri;":"⋪","&nltrie;":"⋬","&nmid;":"∤","&nopf;":"𝕟","&not":"¬","&not;":"¬","&notin;":"∉","&notinE;":"⋹̸","&notindot;":"⋵̸","&notinva;":"∉","&notinvb;":"⋷","&notinvc;":"⋶","&notni;":"∌","&notniva;":"∌","&notnivb;":"⋾","&notnivc;":"⋽","&npar;":"∦","&nparallel;":"∦","&nparsl;":"⫽⃥","&npart;":"∂̸","&npolint;":"⨔","&npr;":"⊀","&nprcue;":"⋠","&npre;":"⪯̸","&nprec;":"⊀","&npreceq;":"⪯̸","&nrArr;":"⇏","&nrarr;":"↛","&nrarrc;":"⤳̸","&nrarrw;":"↝̸","&nrightarrow;":"↛","&nrtri;":"⋫","&nrtrie;":"⋭","&nsc;":"⊁","&nsccue;":"⋡","&nsce;":"⪰̸","&nscr;":"𝓃","&nshortmid;":"∤","&nshortparallel;":"∦","&nsim;":"≁","&nsime;":"≄","&nsimeq;":"≄","&nsmid;":"∤","&nspar;":"∦","&nsqsube;":"⋢","&nsqsupe;":"⋣","&nsub;":"⊄","&nsubE;":"⫅̸","&nsube;":"⊈","&nsubset;":"⊂⃒","&nsubseteq;":"⊈","&nsubseteqq;":"⫅̸","&nsucc;":"⊁","&nsucceq;":"⪰̸","&nsup;":"⊅","&nsupE;":"⫆̸","&nsupe;":"⊉","&nsupset;":"⊃⃒","&nsupseteq;":"⊉","&nsupseteqq;":"⫆̸","&ntgl;":"≹","&ntilde":"ñ","&ntilde;":"ñ","&ntlg;":"≸","&ntriangleleft;":"⋪","&ntrianglelefteq;":"⋬","&ntriangleright;":"⋫","&ntrianglerighteq;":"⋭","&nu;":"ν","&num;":"#","&numero;":"№","&numsp;":" ","&nvDash;":"⊭","&nvHarr;":"⤄","&nvap;":"≍⃒","&nvdash;":"⊬","&nvge;":"≥⃒","&nvgt;":">⃒","&nvinfin;":"⧞","&nvlArr;":"⤂","&nvle;":"≤⃒","&nvlt;":"<⃒","&nvltrie;":"⊴⃒","&nvrArr;":"⤃","&nvrtrie;":"⊵⃒","&nvsim;":"∼⃒","&nwArr;":"⇖","&nwarhk;":"⤣","&nwarr;":"↖","&nwarrow;":"↖","&nwnear;":"⤧","&oS;":"Ⓢ","&oacute":"ó","&oacute;":"ó","&oast;":"⊛","&ocir;":"⊚","&ocirc":"ô","&ocirc;":"ô","&ocy;":"о","&odash;":"⊝","&odblac;":"ő","&odiv;":"⨸","&odot;":"⊙","&odsold;":"⦼","&oelig;":"œ","&ofcir;":"⦿","&ofr;":"𝔬","&ogon;":"˛","&ograve":"ò","&ograve;":"ò","&ogt;":"⧁","&ohbar;":"⦵","&ohm;":"Ω","&oint;":"∮","&olarr;":"↺","&olcir;":"⦾","&olcross;":"⦻","&oline;":"‾","&olt;":"⧀","&omacr;":"ō","&omega;":"ω","&omicron;":"ο","&omid;":"⦶","&ominus;":"⊖","&oopf;":"𝕠","&opar;":"⦷","&operp;":"⦹","&oplus;":"⊕","&or;":"∨","&orarr;":"↻","&ord;":"⩝","&order;":"ℴ","&orderof;":"ℴ","&ordf":"ª","&ordf;":"ª","&ordm":"º","&ordm;":"º","&origof;":"⊶","&oror;":"⩖","&orslope;":"⩗","&orv;":"⩛","&oscr;":"ℴ","&oslash":"ø","&oslash;":"ø","&osol;":"⊘","&otilde":"õ","&otilde;":"õ","&otimes;":"⊗","&otimesas;":"⨶","&ouml":"ö","&ouml;":"ö","&ovbar;":"⌽","&par;":"∥","&para":"¶","&para;":"¶","&parallel;":"∥","&parsim;":"⫳","&parsl;":"⫽","&part;":"∂","&pcy;":"п","&percnt;":"%","&period;":".","&permil;":"‰","&perp;":"⊥","&pertenk;":"‱","&pfr;":"𝔭","&phi;":"φ","&phiv;":"ϕ","&phmmat;":"ℳ","&phone;":"☎","&pi;":"π","&pitchfork;":"⋔","&piv;":"ϖ","&planck;":"ℏ","&planckh;":"ℎ","&plankv;":"ℏ","&plus;":"+","&plusacir;":"⨣","&plusb;":"⊞","&pluscir;":"⨢","&plusdo;":"∔","&plusdu;":"⨥","&pluse;":"⩲","&plusmn":"±","&plusmn;":"±","&plussim;":"⨦","&plustwo;":"⨧","&pm;":"±","&pointint;":"⨕","&popf;":"𝕡","&pound":"£","&pound;":"£","&pr;":"≺","&prE;":"⪳","&prap;":"⪷","&prcue;":"≼","&pre;":"⪯","&prec;":"≺","&precapprox;":"⪷","&preccurlyeq;":"≼","&preceq;":"⪯","&precnapprox;":"⪹","&precneqq;":"⪵","&precnsim;":"⋨","&precsim;":"≾","&prime;":"′","&primes;":"ℙ","&prnE;":"⪵","&prnap;":"⪹","&prnsim;":"⋨","&prod;":"∏","&profalar;":"⌮","&profline;":"⌒","&profsurf;":"⌓","&prop;":"∝","&propto;":"∝","&prsim;":"≾","&prurel;":"⊰","&pscr;":"𝓅","&psi;":"ψ","&puncsp;":" ","&qfr;":"𝔮","&qint;":"⨌","&qopf;":"𝕢","&qprime;":"⁗","&qscr;":"𝓆","&quaternions;":"ℍ","&quatint;":"⨖","&quest;":"?","&questeq;":"≟","&quot":'"',"&quot;":'"',"&rAarr;":"⇛","&rArr;":"⇒","&rAtail;":"⤜","&rBarr;":"⤏","&rHar;":"⥤","&race;":"∽̱","&racute;":"ŕ","&radic;":"√","&raemptyv;":"⦳","&rang;":"⟩","&rangd;":"⦒","&range;":"⦥","&rangle;":"⟩","&raquo":"»","&raquo;":"»","&rarr;":"→","&rarrap;":"⥵","&rarrb;":"⇥","&rarrbfs;":"⤠","&rarrc;":"⤳","&rarrfs;":"⤞","&rarrhk;":"↪","&rarrlp;":"↬","&rarrpl;":"⥅","&rarrsim;":"⥴","&rarrtl;":"↣","&rarrw;":"↝","&ratail;":"⤚","&ratio;":"∶","&rationals;":"ℚ","&rbarr;":"⤍","&rbbrk;":"❳","&rbrace;":"}","&rbrack;":"]","&rbrke;":"⦌","&rbrksld;":"⦎","&rbrkslu;":"⦐","&rcaron;":"ř","&rcedil;":"ŗ","&rceil;":"⌉","&rcub;":"}","&rcy;":"р","&rdca;":"⤷","&rdldhar;":"⥩","&rdquo;":"”","&rdquor;":"”","&rdsh;":"↳","&real;":"ℜ","&realine;":"ℛ","&realpart;":"ℜ","&reals;":"ℝ","&rect;":"▭","&reg":"®","&reg;":"®","&rfisht;":"⥽","&rfloor;":"⌋","&rfr;":"𝔯","&rhard;":"⇁","&rharu;":"⇀","&rharul;":"⥬","&rho;":"ρ","&rhov;":"ϱ","&rightarrow;":"→","&rightarrowtail;":"↣","&rightharpoondown;":"⇁","&rightharpoonup;":"⇀","&rightleftarrows;":"⇄","&rightleftharpoons;":"⇌","&rightrightarrows;":"⇉","&rightsquigarrow;":"↝","&rightthreetimes;":"⋌","&ring;":"˚","&risingdotseq;":"≓","&rlarr;":"⇄","&rlhar;":"⇌","&rlm;":"‏","&rmoust;":"⎱","&rmoustache;":"⎱","&rnmid;":"⫮","&roang;":"⟭","&roarr;":"⇾","&robrk;":"⟧","&ropar;":"⦆","&ropf;":"𝕣","&roplus;":"⨮","&rotimes;":"⨵","&rpar;":")","&rpargt;":"⦔","&rppolint;":"⨒","&rrarr;":"⇉","&rsaquo;":"›","&rscr;":"𝓇","&rsh;":"↱","&rsqb;":"]","&rsquo;":"’","&rsquor;":"’","&rthree;":"⋌","&rtimes;":"⋊","&rtri;":"▹","&rtrie;":"⊵","&rtrif;":"▸","&rtriltri;":"⧎","&ruluhar;":"⥨","&rx;":"℞","&sacute;":"ś","&sbquo;":"‚","&sc;":"≻","&scE;":"⪴","&scap;":"⪸","&scaron;":"š","&sccue;":"≽","&sce;":"⪰","&scedil;":"ş","&scirc;":"ŝ","&scnE;":"⪶","&scnap;":"⪺","&scnsim;":"⋩","&scpolint;":"⨓","&scsim;":"≿","&scy;":"с","&sdot;":"⋅","&sdotb;":"⊡","&sdote;":"⩦","&seArr;":"⇘","&searhk;":"⤥","&searr;":"↘","&searrow;":"↘","&sect":"§","&sect;":"§","&semi;":";","&seswar;":"⤩","&setminus;":"∖","&setmn;":"∖","&sext;":"✶","&sfr;":"𝔰","&sfrown;":"⌢","&sharp;":"♯","&shchcy;":"щ","&shcy;":"ш","&shortmid;":"∣","&shortparallel;":"∥","&shy":"­","&shy;":"­","&sigma;":"σ","&sigmaf;":"ς","&sigmav;":"ς","&sim;":"∼","&simdot;":"⩪","&sime;":"≃","&simeq;":"≃","&simg;":"⪞","&simgE;":"⪠","&siml;":"⪝","&simlE;":"⪟","&simne;":"≆","&simplus;":"⨤","&simrarr;":"⥲","&slarr;":"←","&smallsetminus;":"∖","&smashp;":"⨳","&smeparsl;":"⧤","&smid;":"∣","&smile;":"⌣","&smt;":"⪪","&smte;":"⪬","&smtes;":"⪬︀","&softcy;":"ь","&sol;":"/","&solb;":"⧄","&solbar;":"⌿","&sopf;":"𝕤","&spades;":"♠","&spadesuit;":"♠","&spar;":"∥","&sqcap;":"⊓","&sqcaps;":"⊓︀","&sqcup;":"⊔","&sqcups;":"⊔︀","&sqsub;":"⊏","&sqsube;":"⊑","&sqsubset;":"⊏","&sqsubseteq;":"⊑","&sqsup;":"⊐","&sqsupe;":"⊒","&sqsupset;":"⊐","&sqsupseteq;":"⊒","&squ;":"□","&square;":"□","&squarf;":"▪","&squf;":"▪","&srarr;":"→","&sscr;":"𝓈","&ssetmn;":"∖","&ssmile;":"⌣","&sstarf;":"⋆","&star;":"☆","&starf;":"★","&straightepsilon;":"ϵ","&straightphi;":"ϕ","&strns;":"¯","&sub;":"⊂","&subE;":"⫅","&subdot;":"⪽","&sube;":"⊆","&subedot;":"⫃","&submult;":"⫁","&subnE;":"⫋","&subne;":"⊊","&subplus;":"⪿","&subrarr;":"⥹","&subset;":"⊂","&subseteq;":"⊆","&subseteqq;":"⫅","&subsetneq;":"⊊","&subsetneqq;":"⫋","&subsim;":"⫇","&subsub;":"⫕","&subsup;":"⫓","&succ;":"≻","&succapprox;":"⪸","&succcurlyeq;":"≽","&succeq;":"⪰","&succnapprox;":"⪺","&succneqq;":"⪶","&succnsim;":"⋩","&succsim;":"≿","&sum;":"∑","&sung;":"♪","&sup1":"¹","&sup1;":"¹","&sup2":"²","&sup2;":"²","&sup3":"³","&sup3;":"³","&sup;":"⊃","&supE;":"⫆","&supdot;":"⪾","&supdsub;":"⫘","&supe;":"⊇","&supedot;":"⫄","&suphsol;":"⟉","&suphsub;":"⫗","&suplarr;":"⥻","&supmult;":"⫂","&supnE;":"⫌","&supne;":"⊋","&supplus;":"⫀","&supset;":"⊃","&supseteq;":"⊇","&supseteqq;":"⫆","&supsetneq;":"⊋","&supsetneqq;":"⫌","&supsim;":"⫈","&supsub;":"⫔","&supsup;":"⫖","&swArr;":"⇙","&swarhk;":"⤦","&swarr;":"↙","&swarrow;":"↙","&swnwar;":"⤪","&szlig":"ß","&szlig;":"ß","&target;":"⌖","&tau;":"τ","&tbrk;":"⎴","&tcaron;":"ť","&tcedil;":"ţ","&tcy;":"т","&tdot;":"⃛","&telrec;":"⌕","&tfr;":"𝔱","&there4;":"∴","&therefore;":"∴","&theta;":"θ","&thetasym;":"ϑ","&thetav;":"ϑ","&thickapprox;":"≈","&thicksim;":"∼","&thinsp;":" ","&thkap;":"≈","&thksim;":"∼","&thorn":"þ","&thorn;":"þ","&tilde;":"˜","&times":"×","&times;":"×","&timesb;":"⊠","&timesbar;":"⨱","&timesd;":"⨰","&tint;":"∭","&toea;":"⤨","&top;":"⊤","&topbot;":"⌶","&topcir;":"⫱","&topf;":"𝕥","&topfork;":"⫚","&tosa;":"⤩","&tprime;":"‴","&trade;":"™","&triangle;":"▵","&triangledown;":"▿","&triangleleft;":"◃","&trianglelefteq;":"⊴","&triangleq;":"≜","&triangleright;":"▹","&trianglerighteq;":"⊵","&tridot;":"◬","&trie;":"≜","&triminus;":"⨺","&triplus;":"⨹","&trisb;":"⧍","&tritime;":"⨻","&trpezium;":"⏢","&tscr;":"𝓉","&tscy;":"ц","&tshcy;":"ћ","&tstrok;":"ŧ","&twixt;":"≬","&twoheadleftarrow;":"↞","&twoheadrightarrow;":"↠","&uArr;":"⇑","&uHar;":"⥣","&uacute":"ú","&uacute;":"ú","&uarr;":"↑","&ubrcy;":"ў","&ubreve;":"ŭ","&ucirc":"û","&ucirc;":"û","&ucy;":"у","&udarr;":"⇅","&udblac;":"ű","&udhar;":"⥮","&ufisht;":"⥾","&ufr;":"𝔲","&ugrave":"ù","&ugrave;":"ù","&uharl;":"↿","&uharr;":"↾","&uhblk;":"▀","&ulcorn;":"⌜","&ulcorner;":"⌜","&ulcrop;":"⌏","&ultri;":"◸","&umacr;":"ū","&uml":"¨","&uml;":"¨","&uogon;":"ų","&uopf;":"𝕦","&uparrow;":"↑","&updownarrow;":"↕","&upharpoonleft;":"↿","&upharpoonright;":"↾","&uplus;":"⊎","&upsi;":"υ","&upsih;":"ϒ","&upsilon;":"υ","&upuparrows;":"⇈","&urcorn;":"⌝","&urcorner;":"⌝","&urcrop;":"⌎","&uring;":"ů","&urtri;":"◹","&uscr;":"𝓊","&utdot;":"⋰","&utilde;":"ũ","&utri;":"▵","&utrif;":"▴","&uuarr;":"⇈","&uuml":"ü","&uuml;":"ü","&uwangle;":"⦧","&vArr;":"⇕","&vBar;":"⫨","&vBarv;":"⫩","&vDash;":"⊨","&vangrt;":"⦜","&varepsilon;":"ϵ","&varkappa;":"ϰ","&varnothing;":"∅","&varphi;":"ϕ","&varpi;":"ϖ","&varpropto;":"∝","&varr;":"↕","&varrho;":"ϱ","&varsigma;":"ς","&varsubsetneq;":"⊊︀","&varsubsetneqq;":"⫋︀","&varsupsetneq;":"⊋︀","&varsupsetneqq;":"⫌︀","&vartheta;":"ϑ","&vartriangleleft;":"⊲","&vartriangleright;":"⊳","&vcy;":"в","&vdash;":"⊢","&vee;":"∨","&veebar;":"⊻","&veeeq;":"≚","&vellip;":"⋮","&verbar;":"|","&vert;":"|","&vfr;":"𝔳","&vltri;":"⊲","&vnsub;":"⊂⃒","&vnsup;":"⊃⃒","&vopf;":"𝕧","&vprop;":"∝","&vrtri;":"⊳","&vscr;":"𝓋","&vsubnE;":"⫋︀","&vsubne;":"⊊︀","&vsupnE;":"⫌︀","&vsupne;":"⊋︀","&vzigzag;":"⦚","&wcirc;":"ŵ","&wedbar;":"⩟","&wedge;":"∧","&wedgeq;":"≙","&weierp;":"℘","&wfr;":"𝔴","&wopf;":"𝕨","&wp;":"℘","&wr;":"≀","&wreath;":"≀","&wscr;":"𝓌","&xcap;":"⋂","&xcirc;":"◯","&xcup;":"⋃","&xdtri;":"▽","&xfr;":"𝔵","&xhArr;":"⟺","&xharr;":"⟷","&xi;":"ξ","&xlArr;":"⟸","&xlarr;":"⟵","&xmap;":"⟼","&xnis;":"⋻","&xodot;":"⨀","&xopf;":"𝕩","&xoplus;":"⨁","&xotime;":"⨂","&xrArr;":"⟹","&xrarr;":"⟶","&xscr;":"𝓍","&xsqcup;":"⨆","&xuplus;":"⨄","&xutri;":"△","&xvee;":"⋁","&xwedge;":"⋀","&yacute":"ý","&yacute;":"ý","&yacy;":"я","&ycirc;":"ŷ","&ycy;":"ы","&yen":"¥","&yen;":"¥","&yfr;":"𝔶","&yicy;":"ї","&yopf;":"𝕪","&yscr;":"𝓎","&yucy;":"ю","&yuml":"ÿ","&yuml;":"ÿ","&zacute;":"ź","&zcaron;":"ž","&zcy;":"з","&zdot;":"ż","&zeetrf;":"ℨ","&zeta;":"ζ","&zfr;":"𝔷","&zhcy;":"ж","&zigrarr;":"⇝","&zopf;":"𝕫","&zscr;":"𝓏","&zwj;":"‍","&zwnj;":"‌"},characters:{"Æ":"&AElig;","&":"&amp;","Á":"&Aacute;","Ă":"&Abreve;","Â":"&Acirc;","А":"&Acy;","𝔄":"&Afr;","À":"&Agrave;","Α":"&Alpha;","Ā":"&Amacr;","⩓":"&And;","Ą":"&Aogon;","𝔸":"&Aopf;","⁡":"&af;","Å":"&angst;","𝒜":"&Ascr;","≔":"&coloneq;","Ã":"&Atilde;","Ä":"&Auml;","∖":"&ssetmn;","⫧":"&Barv;","⌆":"&doublebarwedge;","Б":"&Bcy;","∵":"&because;","ℬ":"&bernou;","Β":"&Beta;","𝔅":"&Bfr;","𝔹":"&Bopf;","˘":"&breve;","≎":"&bump;","Ч":"&CHcy;","©":"&copy;","Ć":"&Cacute;","⋒":"&Cap;","ⅅ":"&DD;","ℭ":"&Cfr;","Č":"&Ccaron;","Ç":"&Ccedil;","Ĉ":"&Ccirc;","∰":"&Cconint;","Ċ":"&Cdot;","¸":"&cedil;","·":"&middot;","Χ":"&Chi;","⊙":"&odot;","⊖":"&ominus;","⊕":"&oplus;","⊗":"&otimes;","∲":"&cwconint;","”":"&rdquor;","’":"&rsquor;","∷":"&Proportion;","⩴":"&Colone;","≡":"&equiv;","∯":"&DoubleContourIntegral;","∮":"&oint;","ℂ":"&complexes;","∐":"&coprod;","∳":"&awconint;","⨯":"&Cross;","𝒞":"&Cscr;","⋓":"&Cup;","≍":"&asympeq;","⤑":"&DDotrahd;","Ђ":"&DJcy;","Ѕ":"&DScy;","Џ":"&DZcy;","‡":"&ddagger;","↡":"&Darr;","⫤":"&DoubleLeftTee;","Ď":"&Dcaron;","Д":"&Dcy;","∇":"&nabla;","Δ":"&Delta;","𝔇":"&Dfr;","´":"&acute;","˙":"&dot;","˝":"&dblac;","`":"&grave;","˜":"&tilde;","⋄":"&diamond;","ⅆ":"&dd;","𝔻":"&Dopf;","¨":"&uml;","⃜":"&DotDot;","≐":"&esdot;","⇓":"&dArr;","⇐":"&lArr;","⇔":"&iff;","⟸":"&xlArr;","⟺":"&xhArr;","⟹":"&xrArr;","⇒":"&rArr;","⊨":"&vDash;","⇑":"&uArr;","⇕":"&vArr;","∥":"&spar;","↓":"&downarrow;","⤓":"&DownArrowBar;","⇵":"&duarr;","̑":"&DownBreve;","⥐":"&DownLeftRightVector;","⥞":"&DownLeftTeeVector;","↽":"&lhard;","⥖":"&DownLeftVectorBar;","⥟":"&DownRightTeeVector;","⇁":"&rightharpoondown;","⥗":"&DownRightVectorBar;","⊤":"&top;","↧":"&mapstodown;","𝒟":"&Dscr;","Đ":"&Dstrok;","Ŋ":"&ENG;","Ð":"&ETH;","É":"&Eacute;","Ě":"&Ecaron;","Ê":"&Ecirc;","Э":"&Ecy;","Ė":"&Edot;","𝔈":"&Efr;","È":"&Egrave;","∈":"&isinv;","Ē":"&Emacr;","◻":"&EmptySmallSquare;","▫":"&EmptyVerySmallSquare;","Ę":"&Eogon;","𝔼":"&Eopf;","Ε":"&Epsilon;","⩵":"&Equal;","≂":"&esim;","⇌":"&rlhar;","ℰ":"&expectation;","⩳":"&Esim;","Η":"&Eta;","Ë":"&Euml;","∃":"&exist;","ⅇ":"&exponentiale;","Ф":"&Fcy;","𝔉":"&Ffr;","◼":"&FilledSmallSquare;","▪":"&squf;","𝔽":"&Fopf;","∀":"&forall;","ℱ":"&Fscr;","Ѓ":"&GJcy;",">":"&gt;","Γ":"&Gamma;","Ϝ":"&Gammad;","Ğ":"&Gbreve;","Ģ":"&Gcedil;","Ĝ":"&Gcirc;","Г":"&Gcy;","Ġ":"&Gdot;","𝔊":"&Gfr;","⋙":"&ggg;","𝔾":"&Gopf;","≥":"&geq;","⋛":"&gtreqless;","≧":"&geqq;","⪢":"&GreaterGreater;","≷":"&gtrless;","⩾":"&ges;","≳":"&gtrsim;","𝒢":"&Gscr;","≫":"&gg;","Ъ":"&HARDcy;","ˇ":"&caron;","^":"&Hat;","Ĥ":"&Hcirc;","ℌ":"&Poincareplane;","ℋ":"&hamilt;","ℍ":"&quaternions;","─":"&boxh;","Ħ":"&Hstrok;","≏":"&bumpeq;","Е":"&IEcy;","Ĳ":"&IJlig;","Ё":"&IOcy;","Í":"&Iacute;","Î":"&Icirc;","И":"&Icy;","İ":"&Idot;","ℑ":"&imagpart;","Ì":"&Igrave;","Ī":"&Imacr;","ⅈ":"&ii;","∬":"&Int;","∫":"&int;","⋂":"&xcap;","⁣":"&ic;","⁢":"&it;","Į":"&Iogon;","𝕀":"&Iopf;","Ι":"&Iota;","ℐ":"&imagline;","Ĩ":"&Itilde;","І":"&Iukcy;","Ï":"&Iuml;","Ĵ":"&Jcirc;","Й":"&Jcy;","𝔍":"&Jfr;","𝕁":"&Jopf;","𝒥":"&Jscr;","Ј":"&Jsercy;","Є":"&Jukcy;","Х":"&KHcy;","Ќ":"&KJcy;","Κ":"&Kappa;","Ķ":"&Kcedil;","К":"&Kcy;","𝔎":"&Kfr;","𝕂":"&Kopf;","𝒦":"&Kscr;","Љ":"&LJcy;","<":"&lt;","Ĺ":"&Lacute;","Λ":"&Lambda;","⟪":"&Lang;","ℒ":"&lagran;","↞":"&twoheadleftarrow;","Ľ":"&Lcaron;","Ļ":"&Lcedil;","Л":"&Lcy;","⟨":"&langle;","←":"&slarr;","⇤":"&larrb;","⇆":"&lrarr;","⌈":"&lceil;","⟦":"&lobrk;","⥡":"&LeftDownTeeVector;","⇃":"&downharpoonleft;","⥙":"&LeftDownVectorBar;","⌊":"&lfloor;","↔":"&leftrightarrow;","⥎":"&LeftRightVector;","⊣":"&dashv;","↤":"&mapstoleft;","⥚":"&LeftTeeVector;","⊲":"&vltri;","⧏":"&LeftTriangleBar;","⊴":"&trianglelefteq;","⥑":"&LeftUpDownVector;","⥠":"&LeftUpTeeVector;","↿":"&upharpoonleft;","⥘":"&LeftUpVectorBar;","↼":"&lharu;","⥒":"&LeftVectorBar;","⋚":"&lesseqgtr;","≦":"&leqq;","≶":"&lg;","⪡":"&LessLess;","⩽":"&les;","≲":"&lsim;","𝔏":"&Lfr;","⋘":"&Ll;","⇚":"&lAarr;","Ŀ":"&Lmidot;","⟵":"&xlarr;","⟷":"&xharr;","⟶":"&xrarr;","𝕃":"&Lopf;","↙":"&swarrow;","↘":"&searrow;","↰":"&lsh;","Ł":"&Lstrok;","≪":"&ll;","⤅":"&Map;","М":"&Mcy;"," ":"&MediumSpace;","ℳ":"&phmmat;","𝔐":"&Mfr;","∓":"&mp;","𝕄":"&Mopf;","Μ":"&Mu;","Њ":"&NJcy;","Ń":"&Nacute;","Ň":"&Ncaron;","Ņ":"&Ncedil;","Н":"&Ncy;","​":"&ZeroWidthSpace;","\n":"&NewLine;","𝔑":"&Nfr;","⁠":"&NoBreak;"," ":"&nbsp;","ℕ":"&naturals;","⫬":"&Not;","≢":"&nequiv;","≭":"&NotCupCap;","∦":"&nspar;","∉":"&notinva;","≠":"&ne;","≂̸":"&nesim;","∄":"&nexists;","≯":"&ngtr;","≱":"&ngeq;","≧̸":"&ngeqq;","≫̸":"&nGtv;","≹":"&ntgl;","⩾̸":"&nges;","≵":"&ngsim;","≎̸":"&nbump;","≏̸":"&nbumpe;","⋪":"&ntriangleleft;","⧏̸":"&NotLeftTriangleBar;","⋬":"&ntrianglelefteq;","≮":"&nlt;","≰":"&nleq;","≸":"&ntlg;","≪̸":"&nLtv;","⩽̸":"&nles;","≴":"&nlsim;","⪢̸":"&NotNestedGreaterGreater;","⪡̸":"&NotNestedLessLess;","⊀":"&nprec;","⪯̸":"&npreceq;","⋠":"&nprcue;","∌":"&notniva;","⋫":"&ntriangleright;","⧐̸":"&NotRightTriangleBar;","⋭":"&ntrianglerighteq;","⊏̸":"&NotSquareSubset;","⋢":"&nsqsube;","⊐̸":"&NotSquareSuperset;","⋣":"&nsqsupe;","⊂⃒":"&vnsub;","⊈":"&nsubseteq;","⊁":"&nsucc;","⪰̸":"&nsucceq;","⋡":"&nsccue;","≿̸":"&NotSucceedsTilde;","⊃⃒":"&vnsup;","⊉":"&nsupseteq;","≁":"&nsim;","≄":"&nsimeq;","≇":"&ncong;","≉":"&napprox;","∤":"&nsmid;","𝒩":"&Nscr;","Ñ":"&Ntilde;","Ν":"&Nu;","Œ":"&OElig;","Ó":"&Oacute;","Ô":"&Ocirc;","О":"&Ocy;","Ő":"&Odblac;","𝔒":"&Ofr;","Ò":"&Ograve;","Ō":"&Omacr;","Ω":"&ohm;","Ο":"&Omicron;","𝕆":"&Oopf;","“":"&ldquo;","‘":"&lsquo;","⩔":"&Or;","𝒪":"&Oscr;","Ø":"&Oslash;","Õ":"&Otilde;","⨷":"&Otimes;","Ö":"&Ouml;","‾":"&oline;","⏞":"&OverBrace;","⎴":"&tbrk;","⏜":"&OverParenthesis;","∂":"&part;","П":"&Pcy;","𝔓":"&Pfr;","Φ":"&Phi;","Π":"&Pi;","±":"&pm;","ℙ":"&primes;","⪻":"&Pr;","≺":"&prec;","⪯":"&preceq;","≼":"&preccurlyeq;","≾":"&prsim;","″":"&Prime;","∏":"&prod;","∝":"&vprop;","𝒫":"&Pscr;","Ψ":"&Psi;",'"':"&quot;","𝔔":"&Qfr;","ℚ":"&rationals;","𝒬":"&Qscr;","⤐":"&drbkarow;","®":"&reg;","Ŕ":"&Racute;","⟫":"&Rang;","↠":"&twoheadrightarrow;","⤖":"&Rarrtl;","Ř":"&Rcaron;","Ŗ":"&Rcedil;","Р":"&Rcy;","ℜ":"&realpart;","∋":"&niv;","⇋":"&lrhar;","⥯":"&duhar;","Ρ":"&Rho;","⟩":"&rangle;","→":"&srarr;","⇥":"&rarrb;","⇄":"&rlarr;","⌉":"&rceil;","⟧":"&robrk;","⥝":"&RightDownTeeVector;","⇂":"&downharpoonright;","⥕":"&RightDownVectorBar;","⌋":"&rfloor;","⊢":"&vdash;","↦":"&mapsto;","⥛":"&RightTeeVector;","⊳":"&vrtri;","⧐":"&RightTriangleBar;","⊵":"&trianglerighteq;","⥏":"&RightUpDownVector;","⥜":"&RightUpTeeVector;","↾":"&upharpoonright;","⥔":"&RightUpVectorBar;","⇀":"&rightharpoonup;","⥓":"&RightVectorBar;","ℝ":"&reals;","⥰":"&RoundImplies;","⇛":"&rAarr;","ℛ":"&realine;","↱":"&rsh;","⧴":"&RuleDelayed;","Щ":"&SHCHcy;","Ш":"&SHcy;","Ь":"&SOFTcy;","Ś":"&Sacute;","⪼":"&Sc;","Š":"&Scaron;","Ş":"&Scedil;","Ŝ":"&Scirc;","С":"&Scy;","𝔖":"&Sfr;","↑":"&uparrow;","Σ":"&Sigma;","∘":"&compfn;","𝕊":"&Sopf;","√":"&radic;","□":"&square;","⊓":"&sqcap;","⊏":"&sqsubset;","⊑":"&sqsubseteq;","⊐":"&sqsupset;","⊒":"&sqsupseteq;","⊔":"&sqcup;","𝒮":"&Sscr;","⋆":"&sstarf;","⋐":"&Subset;","⊆":"&subseteq;","≻":"&succ;","⪰":"&succeq;","≽":"&succcurlyeq;","≿":"&succsim;","∑":"&sum;","⋑":"&Supset;","⊃":"&supset;","⊇":"&supseteq;","Þ":"&THORN;","™":"&trade;","Ћ":"&TSHcy;","Ц":"&TScy;","\t":"&Tab;","Τ":"&Tau;","Ť":"&Tcaron;","Ţ":"&Tcedil;","Т":"&Tcy;","𝔗":"&Tfr;","∴":"&therefore;","Θ":"&Theta;","  ":"&ThickSpace;"," ":"&thinsp;","∼":"&thksim;","≃":"&simeq;","≅":"&cong;","≈":"&thkap;","𝕋":"&Topf;","⃛":"&tdot;","𝒯":"&Tscr;","Ŧ":"&Tstrok;","Ú":"&Uacute;","↟":"&Uarr;","⥉":"&Uarrocir;","Ў":"&Ubrcy;","Ŭ":"&Ubreve;","Û":"&Ucirc;","У":"&Ucy;","Ű":"&Udblac;","𝔘":"&Ufr;","Ù":"&Ugrave;","Ū":"&Umacr;",_:"&lowbar;","⏟":"&UnderBrace;","⎵":"&bbrk;","⏝":"&UnderParenthesis;","⋃":"&xcup;","⊎":"&uplus;","Ų":"&Uogon;","𝕌":"&Uopf;","⤒":"&UpArrowBar;","⇅":"&udarr;","↕":"&varr;","⥮":"&udhar;","⊥":"&perp;","↥":"&mapstoup;","↖":"&nwarrow;","↗":"&nearrow;","ϒ":"&upsih;","Υ":"&Upsilon;","Ů":"&Uring;","𝒰":"&Uscr;","Ũ":"&Utilde;","Ü":"&Uuml;","⊫":"&VDash;","⫫":"&Vbar;","В":"&Vcy;","⊩":"&Vdash;","⫦":"&Vdashl;","⋁":"&xvee;","‖":"&Vert;","∣":"&smid;","|":"&vert;","❘":"&VerticalSeparator;","≀":"&wreath;"," ":"&hairsp;","𝔙":"&Vfr;","𝕍":"&Vopf;","𝒱":"&Vscr;","⊪":"&Vvdash;","Ŵ":"&Wcirc;","⋀":"&xwedge;","𝔚":"&Wfr;","𝕎":"&Wopf;","𝒲":"&Wscr;","𝔛":"&Xfr;","Ξ":"&Xi;","𝕏":"&Xopf;","𝒳":"&Xscr;","Я":"&YAcy;","Ї":"&YIcy;","Ю":"&YUcy;","Ý":"&Yacute;","Ŷ":"&Ycirc;","Ы":"&Ycy;","𝔜":"&Yfr;","𝕐":"&Yopf;","𝒴":"&Yscr;","Ÿ":"&Yuml;","Ж":"&ZHcy;","Ź":"&Zacute;","Ž":"&Zcaron;","З":"&Zcy;","Ż":"&Zdot;","Ζ":"&Zeta;","ℨ":"&zeetrf;","ℤ":"&integers;","𝒵":"&Zscr;","á":"&aacute;","ă":"&abreve;","∾":"&mstpos;","∾̳":"&acE;","∿":"&acd;","â":"&acirc;","а":"&acy;","æ":"&aelig;","𝔞":"&afr;","à":"&agrave;","ℵ":"&aleph;","α":"&alpha;","ā":"&amacr;","⨿":"&amalg;","∧":"&wedge;","⩕":"&andand;","⩜":"&andd;","⩘":"&andslope;","⩚":"&andv;","∠":"&angle;","⦤":"&ange;","∡":"&measuredangle;","⦨":"&angmsdaa;","⦩":"&angmsdab;","⦪":"&angmsdac;","⦫":"&angmsdad;","⦬":"&angmsdae;","⦭":"&angmsdaf;","⦮":"&angmsdag;","⦯":"&angmsdah;","∟":"&angrt;","⊾":"&angrtvb;","⦝":"&angrtvbd;","∢":"&angsph;","⍼":"&angzarr;","ą":"&aogon;","𝕒":"&aopf;","⩰":"&apE;","⩯":"&apacir;","≊":"&approxeq;","≋":"&apid;","'":"&apos;","å":"&aring;","𝒶":"&ascr;","*":"&midast;","ã":"&atilde;","ä":"&auml;","⨑":"&awint;","⫭":"&bNot;","≌":"&bcong;","϶":"&bepsi;","‵":"&bprime;","∽":"&bsim;","⋍":"&bsime;","⊽":"&barvee;","⌅":"&barwedge;","⎶":"&bbrktbrk;","б":"&bcy;","„":"&ldquor;","⦰":"&bemptyv;","β":"&beta;","ℶ":"&beth;","≬":"&twixt;","𝔟":"&bfr;","◯":"&xcirc;","⨀":"&xodot;","⨁":"&xoplus;","⨂":"&xotime;","⨆":"&xsqcup;","★":"&starf;","▽":"&xdtri;","△":"&xutri;","⨄":"&xuplus;","⤍":"&rbarr;","⧫":"&lozf;","▴":"&utrif;","▾":"&dtrif;","◂":"&ltrif;","▸":"&rtrif;","␣":"&blank;","▒":"&blk12;","░":"&blk14;","▓":"&blk34;","█":"&block;","=⃥":"&bne;","≡⃥":"&bnequiv;","⌐":"&bnot;","𝕓":"&bopf;","⋈":"&bowtie;","╗":"&boxDL;","╔":"&boxDR;","╖":"&boxDl;","╓":"&boxDr;","═":"&boxH;","╦":"&boxHD;","╩":"&boxHU;","╤":"&boxHd;","╧":"&boxHu;","╝":"&boxUL;","╚":"&boxUR;","╜":"&boxUl;","╙":"&boxUr;","║":"&boxV;","╬":"&boxVH;","╣":"&boxVL;","╠":"&boxVR;","╫":"&boxVh;","╢":"&boxVl;","╟":"&boxVr;","⧉":"&boxbox;","╕":"&boxdL;","╒":"&boxdR;","┐":"&boxdl;","┌":"&boxdr;","╥":"&boxhD;","╨":"&boxhU;","┬":"&boxhd;","┴":"&boxhu;","⊟":"&minusb;","⊞":"&plusb;","⊠":"&timesb;","╛":"&boxuL;","╘":"&boxuR;","┘":"&boxul;","└":"&boxur;","│":"&boxv;","╪":"&boxvH;","╡":"&boxvL;","╞":"&boxvR;","┼":"&boxvh;","┤":"&boxvl;","├":"&boxvr;","¦":"&brvbar;","𝒷":"&bscr;","⁏":"&bsemi;","\\":"&bsol;","⧅":"&bsolb;","⟈":"&bsolhsub;","•":"&bullet;","⪮":"&bumpE;","ć":"&cacute;","∩":"&cap;","⩄":"&capand;","⩉":"&capbrcup;","⩋":"&capcap;","⩇":"&capcup;","⩀":"&capdot;","∩︀":"&caps;","⁁":"&caret;","⩍":"&ccaps;","č":"&ccaron;","ç":"&ccedil;","ĉ":"&ccirc;","⩌":"&ccups;","⩐":"&ccupssm;","ċ":"&cdot;","⦲":"&cemptyv;","¢":"&cent;","𝔠":"&cfr;","ч":"&chcy;","✓":"&checkmark;","χ":"&chi;","○":"&cir;","⧃":"&cirE;","ˆ":"&circ;","≗":"&cire;","↺":"&olarr;","↻":"&orarr;","Ⓢ":"&oS;","⊛":"&oast;","⊚":"&ocir;","⊝":"&odash;","⨐":"&cirfnint;","⫯":"&cirmid;","⧂":"&cirscir;","♣":"&clubsuit;",":":"&colon;",",":"&comma;","@":"&commat;","∁":"&complement;","⩭":"&congdot;","𝕔":"&copf;","℗":"&copysr;","↵":"&crarr;","✗":"&cross;","𝒸":"&cscr;","⫏":"&csub;","⫑":"&csube;","⫐":"&csup;","⫒":"&csupe;","⋯":"&ctdot;","⤸":"&cudarrl;","⤵":"&cudarrr;","⋞":"&curlyeqprec;","⋟":"&curlyeqsucc;","↶":"&curvearrowleft;","⤽":"&cularrp;","∪":"&cup;","⩈":"&cupbrcap;","⩆":"&cupcap;","⩊":"&cupcup;","⊍":"&cupdot;","⩅":"&cupor;","∪︀":"&cups;","↷":"&curvearrowright;","⤼":"&curarrm;","⋎":"&cuvee;","⋏":"&cuwed;","¤":"&curren;","∱":"&cwint;","⌭":"&cylcty;","⥥":"&dHar;","†":"&dagger;","ℸ":"&daleth;","‐":"&hyphen;","⤏":"&rBarr;","ď":"&dcaron;","д":"&dcy;","⇊":"&downdownarrows;","⩷":"&eDDot;","°":"&deg;","δ":"&delta;","⦱":"&demptyv;","⥿":"&dfisht;","𝔡":"&dfr;","♦":"&diams;","ϝ":"&gammad;","⋲":"&disin;","÷":"&divide;","⋇":"&divonx;","ђ":"&djcy;","⌞":"&llcorner;","⌍":"&dlcrop;",$:"&dollar;","𝕕":"&dopf;","≑":"&eDot;","∸":"&minusd;","∔":"&plusdo;","⊡":"&sdotb;","⌟":"&lrcorner;","⌌":"&drcrop;","𝒹":"&dscr;","ѕ":"&dscy;","⧶":"&dsol;","đ":"&dstrok;","⋱":"&dtdot;","▿":"&triangledown;","⦦":"&dwangle;","џ":"&dzcy;","⟿":"&dzigrarr;","é":"&eacute;","⩮":"&easter;","ě":"&ecaron;","≖":"&eqcirc;","ê":"&ecirc;","≕":"&eqcolon;","э":"&ecy;","ė":"&edot;","≒":"&fallingdotseq;","𝔢":"&efr;","⪚":"&eg;","è":"&egrave;","⪖":"&eqslantgtr;","⪘":"&egsdot;","⪙":"&el;","⏧":"&elinters;","ℓ":"&ell;","⪕":"&eqslantless;","⪗":"&elsdot;","ē":"&emacr;","∅":"&varnothing;"," ":"&emsp13;"," ":"&emsp14;"," ":"&emsp;","ŋ":"&eng;"," ":"&ensp;","ę":"&eogon;","𝕖":"&eopf;","⋕":"&epar;","⧣":"&eparsl;","⩱":"&eplus;","ε":"&epsilon;","ϵ":"&varepsilon;","=":"&equals;","≟":"&questeq;","⩸":"&equivDD;","⧥":"&eqvparsl;","≓":"&risingdotseq;","⥱":"&erarr;","ℯ":"&escr;","η":"&eta;","ð":"&eth;","ë":"&euml;","€":"&euro;","!":"&excl;","ф":"&fcy;","♀":"&female;","ﬃ":"&ffilig;","ﬀ":"&fflig;","ﬄ":"&ffllig;","𝔣":"&ffr;","ﬁ":"&filig;",fj:"&fjlig;","♭":"&flat;","ﬂ":"&fllig;","▱":"&fltns;","ƒ":"&fnof;","𝕗":"&fopf;","⋔":"&pitchfork;","⫙":"&forkv;","⨍":"&fpartint;","½":"&half;","⅓":"&frac13;","¼":"&frac14;","⅕":"&frac15;","⅙":"&frac16;","⅛":"&frac18;","⅔":"&frac23;","⅖":"&frac25;","¾":"&frac34;","⅗":"&frac35;","⅜":"&frac38;","⅘":"&frac45;","⅚":"&frac56;","⅝":"&frac58;","⅞":"&frac78;","⁄":"&frasl;","⌢":"&sfrown;","𝒻":"&fscr;","⪌":"&gtreqqless;","ǵ":"&gacute;","γ":"&gamma;","⪆":"&gtrapprox;","ğ":"&gbreve;","ĝ":"&gcirc;","г":"&gcy;","ġ":"&gdot;","⪩":"&gescc;","⪀":"&gesdot;","⪂":"&gesdoto;","⪄":"&gesdotol;","⋛︀":"&gesl;","⪔":"&gesles;","𝔤":"&gfr;","ℷ":"&gimel;","ѓ":"&gjcy;","⪒":"&glE;","⪥":"&gla;","⪤":"&glj;","≩":"&gneqq;","⪊":"&gnapprox;","⪈":"&gneq;","⋧":"&gnsim;","𝕘":"&gopf;","ℊ":"&gscr;","⪎":"&gsime;","⪐":"&gsiml;","⪧":"&gtcc;","⩺":"&gtcir;","⋗":"&gtrdot;","⦕":"&gtlPar;","⩼":"&gtquest;","⥸":"&gtrarr;","≩︀":"&gvnE;","ъ":"&hardcy;","⥈":"&harrcir;","↭":"&leftrightsquigarrow;","ℏ":"&plankv;","ĥ":"&hcirc;","♥":"&heartsuit;","…":"&mldr;","⊹":"&hercon;","𝔥":"&hfr;","⤥":"&searhk;","⤦":"&swarhk;","⇿":"&hoarr;","∻":"&homtht;","↩":"&larrhk;","↪":"&rarrhk;","𝕙":"&hopf;","―":"&horbar;","𝒽":"&hscr;","ħ":"&hstrok;","⁃":"&hybull;","í":"&iacute;","î":"&icirc;","и":"&icy;","е":"&iecy;","¡":"&iexcl;","𝔦":"&ifr;","ì":"&igrave;","⨌":"&qint;","∭":"&tint;","⧜":"&iinfin;","℩":"&iiota;","ĳ":"&ijlig;","ī":"&imacr;","ı":"&inodot;","⊷":"&imof;","Ƶ":"&imped;","℅":"&incare;","∞":"&infin;","⧝":"&infintie;","⊺":"&intercal;","⨗":"&intlarhk;","⨼":"&iprod;","ё":"&iocy;","į":"&iogon;","𝕚":"&iopf;","ι":"&iota;","¿":"&iquest;","𝒾":"&iscr;","⋹":"&isinE;","⋵":"&isindot;","⋴":"&isins;","⋳":"&isinsv;","ĩ":"&itilde;","і":"&iukcy;","ï":"&iuml;","ĵ":"&jcirc;","й":"&jcy;","𝔧":"&jfr;","ȷ":"&jmath;","𝕛":"&jopf;","𝒿":"&jscr;","ј":"&jsercy;","є":"&jukcy;","κ":"&kappa;","ϰ":"&varkappa;","ķ":"&kcedil;","к":"&kcy;","𝔨":"&kfr;","ĸ":"&kgreen;","х":"&khcy;","ќ":"&kjcy;","𝕜":"&kopf;","𝓀":"&kscr;","⤛":"&lAtail;","⤎":"&lBarr;","⪋":"&lesseqqgtr;","⥢":"&lHar;","ĺ":"&lacute;","⦴":"&laemptyv;","λ":"&lambda;","⦑":"&langd;","⪅":"&lessapprox;","«":"&laquo;","⤟":"&larrbfs;","⤝":"&larrfs;","↫":"&looparrowleft;","⤹":"&larrpl;","⥳":"&larrsim;","↢":"&leftarrowtail;","⪫":"&lat;","⤙":"&latail;","⪭":"&late;","⪭︀":"&lates;","⤌":"&lbarr;","❲":"&lbbrk;","{":"&lcub;","[":"&lsqb;","⦋":"&lbrke;","⦏":"&lbrksld;","⦍":"&lbrkslu;","ľ":"&lcaron;","ļ":"&lcedil;","л":"&lcy;","⤶":"&ldca;","⥧":"&ldrdhar;","⥋":"&ldrushar;","↲":"&ldsh;","≤":"&leq;","⇇":"&llarr;","⋋":"&lthree;","⪨":"&lescc;","⩿":"&lesdot;","⪁":"&lesdoto;","⪃":"&lesdotor;","⋚︀":"&lesg;","⪓":"&lesges;","⋖":"&ltdot;","⥼":"&lfisht;","𝔩":"&lfr;","⪑":"&lgE;","⥪":"&lharul;","▄":"&lhblk;","љ":"&ljcy;","⥫":"&llhard;","◺":"&lltri;","ŀ":"&lmidot;","⎰":"&lmoustache;","≨":"&lneqq;","⪉":"&lnapprox;","⪇":"&lneq;","⋦":"&lnsim;","⟬":"&loang;","⇽":"&loarr;","⟼":"&xmap;","↬":"&rarrlp;","⦅":"&lopar;","𝕝":"&lopf;","⨭":"&loplus;","⨴":"&lotimes;","∗":"&lowast;","◊":"&lozenge;","(":"&lpar;","⦓":"&lparlt;","⥭":"&lrhard;","‎":"&lrm;","⊿":"&lrtri;","‹":"&lsaquo;","𝓁":"&lscr;","⪍":"&lsime;","⪏":"&lsimg;","‚":"&sbquo;","ł":"&lstrok;","⪦":"&ltcc;","⩹":"&ltcir;","⋉":"&ltimes;","⥶":"&ltlarr;","⩻":"&ltquest;","⦖":"&ltrPar;","◃":"&triangleleft;","⥊":"&lurdshar;","⥦":"&luruhar;","≨︀":"&lvnE;","∺":"&mDDot;","¯":"&strns;","♂":"&male;","✠":"&maltese;","▮":"&marker;","⨩":"&mcomma;","м":"&mcy;","—":"&mdash;","𝔪":"&mfr;","℧":"&mho;","µ":"&micro;","⫰":"&midcir;","−":"&minus;","⨪":"&minusdu;","⫛":"&mlcp;","⊧":"&models;","𝕞":"&mopf;","𝓂":"&mscr;","μ":"&mu;","⊸":"&mumap;","⋙̸":"&nGg;","≫⃒":"&nGt;","⇍":"&nlArr;","⇎":"&nhArr;","⋘̸":"&nLl;","≪⃒":"&nLt;","⇏":"&nrArr;","⊯":"&nVDash;","⊮":"&nVdash;","ń":"&nacute;","∠⃒":"&nang;","⩰̸":"&napE;","≋̸":"&napid;","ŉ":"&napos;","♮":"&natural;","⩃":"&ncap;","ň":"&ncaron;","ņ":"&ncedil;","⩭̸":"&ncongdot;","⩂":"&ncup;","н":"&ncy;","–":"&ndash;","⇗":"&neArr;","⤤":"&nearhk;","≐̸":"&nedot;","⤨":"&toea;","𝔫":"&nfr;","↮":"&nleftrightarrow;","⫲":"&nhpar;","⋼":"&nis;","⋺":"&nisd;","њ":"&njcy;","≦̸":"&nleqq;","↚":"&nleftarrow;","‥":"&nldr;","𝕟":"&nopf;","¬":"&not;","⋹̸":"&notinE;","⋵̸":"&notindot;","⋷":"&notinvb;","⋶":"&notinvc;","⋾":"&notnivb;","⋽":"&notnivc;","⫽⃥":"&nparsl;","∂̸":"&npart;","⨔":"&npolint;","↛":"&nrightarrow;","⤳̸":"&nrarrc;","↝̸":"&nrarrw;","𝓃":"&nscr;","⊄":"&nsub;","⫅̸":"&nsubseteqq;","⊅":"&nsup;","⫆̸":"&nsupseteqq;","ñ":"&ntilde;","ν":"&nu;","#":"&num;","№":"&numero;"," ":"&numsp;","⊭":"&nvDash;","⤄":"&nvHarr;","≍⃒":"&nvap;","⊬":"&nvdash;","≥⃒":"&nvge;",">⃒":"&nvgt;","⧞":"&nvinfin;","⤂":"&nvlArr;","≤⃒":"&nvle;","<⃒":"&nvlt;","⊴⃒":"&nvltrie;","⤃":"&nvrArr;","⊵⃒":"&nvrtrie;","∼⃒":"&nvsim;","⇖":"&nwArr;","⤣":"&nwarhk;","⤧":"&nwnear;","ó":"&oacute;","ô":"&ocirc;","о":"&ocy;","ő":"&odblac;","⨸":"&odiv;","⦼":"&odsold;","œ":"&oelig;","⦿":"&ofcir;","𝔬":"&ofr;","˛":"&ogon;","ò":"&ograve;","⧁":"&ogt;","⦵":"&ohbar;","⦾":"&olcir;","⦻":"&olcross;","⧀":"&olt;","ō":"&omacr;","ω":"&omega;","ο":"&omicron;","⦶":"&omid;","𝕠":"&oopf;","⦷":"&opar;","⦹":"&operp;","∨":"&vee;","⩝":"&ord;","ℴ":"&oscr;","ª":"&ordf;","º":"&ordm;","⊶":"&origof;","⩖":"&oror;","⩗":"&orslope;","⩛":"&orv;","ø":"&oslash;","⊘":"&osol;","õ":"&otilde;","⨶":"&otimesas;","ö":"&ouml;","⌽":"&ovbar;","¶":"&para;","⫳":"&parsim;","⫽":"&parsl;","п":"&pcy;","%":"&percnt;",".":"&period;","‰":"&permil;","‱":"&pertenk;","𝔭":"&pfr;","φ":"&phi;","ϕ":"&varphi;","☎":"&phone;","π":"&pi;","ϖ":"&varpi;","ℎ":"&planckh;","+":"&plus;","⨣":"&plusacir;","⨢":"&pluscir;","⨥":"&plusdu;","⩲":"&pluse;","⨦":"&plussim;","⨧":"&plustwo;","⨕":"&pointint;","𝕡":"&popf;","£":"&pound;","⪳":"&prE;","⪷":"&precapprox;","⪹":"&prnap;","⪵":"&prnE;","⋨":"&prnsim;","′":"&prime;","⌮":"&profalar;","⌒":"&profline;","⌓":"&profsurf;","⊰":"&prurel;","𝓅":"&pscr;","ψ":"&psi;"," ":"&puncsp;","𝔮":"&qfr;","𝕢":"&qopf;","⁗":"&qprime;","𝓆":"&qscr;","⨖":"&quatint;","?":"&quest;","⤜":"&rAtail;","⥤":"&rHar;","∽̱":"&race;","ŕ":"&racute;","⦳":"&raemptyv;","⦒":"&rangd;","⦥":"&range;","»":"&raquo;","⥵":"&rarrap;","⤠":"&rarrbfs;","⤳":"&rarrc;","⤞":"&rarrfs;","⥅":"&rarrpl;","⥴":"&rarrsim;","↣":"&rightarrowtail;","↝":"&rightsquigarrow;","⤚":"&ratail;","∶":"&ratio;","❳":"&rbbrk;","}":"&rcub;","]":"&rsqb;","⦌":"&rbrke;","⦎":"&rbrksld;","⦐":"&rbrkslu;","ř":"&rcaron;","ŗ":"&rcedil;","р":"&rcy;","⤷":"&rdca;","⥩":"&rdldhar;","↳":"&rdsh;","▭":"&rect;","⥽":"&rfisht;","𝔯":"&rfr;","⥬":"&rharul;","ρ":"&rho;","ϱ":"&varrho;","⇉":"&rrarr;","⋌":"&rthree;","˚":"&ring;","‏":"&rlm;","⎱":"&rmoustache;","⫮":"&rnmid;","⟭":"&roang;","⇾":"&roarr;","⦆":"&ropar;","𝕣":"&ropf;","⨮":"&roplus;","⨵":"&rotimes;",")":"&rpar;","⦔":"&rpargt;","⨒":"&rppolint;","›":"&rsaquo;","𝓇":"&rscr;","⋊":"&rtimes;","▹":"&triangleright;","⧎":"&rtriltri;","⥨":"&ruluhar;","℞":"&rx;","ś":"&sacute;","⪴":"&scE;","⪸":"&succapprox;","š":"&scaron;","ş":"&scedil;","ŝ":"&scirc;","⪶":"&succneqq;","⪺":"&succnapprox;","⋩":"&succnsim;","⨓":"&scpolint;","с":"&scy;","⋅":"&sdot;","⩦":"&sdote;","⇘":"&seArr;","§":"&sect;",";":"&semi;","⤩":"&tosa;","✶":"&sext;","𝔰":"&sfr;","♯":"&sharp;","щ":"&shchcy;","ш":"&shcy;","­":"&shy;","σ":"&sigma;","ς":"&varsigma;","⩪":"&simdot;","⪞":"&simg;","⪠":"&simgE;","⪝":"&siml;","⪟":"&simlE;","≆":"&simne;","⨤":"&simplus;","⥲":"&simrarr;","⨳":"&smashp;","⧤":"&smeparsl;","⌣":"&ssmile;","⪪":"&smt;","⪬":"&smte;","⪬︀":"&smtes;","ь":"&softcy;","/":"&sol;","⧄":"&solb;","⌿":"&solbar;","𝕤":"&sopf;","♠":"&spadesuit;","⊓︀":"&sqcaps;","⊔︀":"&sqcups;","𝓈":"&sscr;","☆":"&star;","⊂":"&subset;","⫅":"&subseteqq;","⪽":"&subdot;","⫃":"&subedot;","⫁":"&submult;","⫋":"&subsetneqq;","⊊":"&subsetneq;","⪿":"&subplus;","⥹":"&subrarr;","⫇":"&subsim;","⫕":"&subsub;","⫓":"&subsup;","♪":"&sung;","¹":"&sup1;","²":"&sup2;","³":"&sup3;","⫆":"&supseteqq;","⪾":"&supdot;","⫘":"&supdsub;","⫄":"&supedot;","⟉":"&suphsol;","⫗":"&suphsub;","⥻":"&suplarr;","⫂":"&supmult;","⫌":"&supsetneqq;","⊋":"&supsetneq;","⫀":"&supplus;","⫈":"&supsim;","⫔":"&supsub;","⫖":"&supsup;","⇙":"&swArr;","⤪":"&swnwar;","ß":"&szlig;","⌖":"&target;","τ":"&tau;","ť":"&tcaron;","ţ":"&tcedil;","т":"&tcy;","⌕":"&telrec;","𝔱":"&tfr;","θ":"&theta;","ϑ":"&vartheta;","þ":"&thorn;","×":"&times;","⨱":"&timesbar;","⨰":"&timesd;","⌶":"&topbot;","⫱":"&topcir;","𝕥":"&topf;","⫚":"&topfork;","‴":"&tprime;","▵":"&utri;","≜":"&trie;","◬":"&tridot;","⨺":"&triminus;","⨹":"&triplus;","⧍":"&trisb;","⨻":"&tritime;","⏢":"&trpezium;","𝓉":"&tscr;","ц":"&tscy;","ћ":"&tshcy;","ŧ":"&tstrok;","⥣":"&uHar;","ú":"&uacute;","ў":"&ubrcy;","ŭ":"&ubreve;","û":"&ucirc;","у":"&ucy;","ű":"&udblac;","⥾":"&ufisht;","𝔲":"&ufr;","ù":"&ugrave;","▀":"&uhblk;","⌜":"&ulcorner;","⌏":"&ulcrop;","◸":"&ultri;","ū":"&umacr;","ų":"&uogon;","𝕦":"&uopf;","υ":"&upsilon;","⇈":"&uuarr;","⌝":"&urcorner;","⌎":"&urcrop;","ů":"&uring;","◹":"&urtri;","𝓊":"&uscr;","⋰":"&utdot;","ũ":"&utilde;","ü":"&uuml;","⦧":"&uwangle;","⫨":"&vBar;","⫩":"&vBarv;","⦜":"&vangrt;","⊊︀":"&vsubne;","⫋︀":"&vsubnE;","⊋︀":"&vsupne;","⫌︀":"&vsupnE;","в":"&vcy;","⊻":"&veebar;","≚":"&veeeq;","⋮":"&vellip;","𝔳":"&vfr;","𝕧":"&vopf;","𝓋":"&vscr;","⦚":"&vzigzag;","ŵ":"&wcirc;","⩟":"&wedbar;","≙":"&wedgeq;","℘":"&wp;","𝔴":"&wfr;","𝕨":"&wopf;","𝓌":"&wscr;","𝔵":"&xfr;","ξ":"&xi;","⋻":"&xnis;","𝕩":"&xopf;","𝓍":"&xscr;","ý":"&yacute;","я":"&yacy;","ŷ":"&ycirc;","ы":"&ycy;","¥":"&yen;","𝔶":"&yfr;","ї":"&yicy;","𝕪":"&yopf;","𝓎":"&yscr;","ю":"&yucy;","ÿ":"&yuml;","ź":"&zacute;","ž":"&zcaron;","з":"&zcy;","ż":"&zdot;","ζ":"&zeta;","𝔷":"&zfr;","ж":"&zhcy;","⇝":"&zigrarr;","𝕫":"&zopf;","𝓏":"&zscr;","‍":"&zwj;","‌":"&zwnj;"}}};

  var numericUnicodeMap = {};

  Object.defineProperty(numericUnicodeMap,"__esModule",{value:true});numericUnicodeMap.numericUnicodeMap={0:65533,128:8364,130:8218,131:402,132:8222,133:8230,134:8224,135:8225,136:710,137:8240,138:352,139:8249,140:338,142:381,145:8216,146:8217,147:8220,148:8221,149:8226,150:8211,151:8212,152:732,153:8482,154:353,155:8250,156:339,158:382,159:376};

  var surrogatePairs = {};

  Object.defineProperty(surrogatePairs,"__esModule",{value:true});surrogatePairs.fromCodePoint=String.fromCodePoint||function(astralCodePoint){return String.fromCharCode(Math.floor((astralCodePoint-65536)/1024)+55296,(astralCodePoint-65536)%1024+56320)};surrogatePairs.getCodePoint=String.prototype.codePointAt?function(input,position){return input.codePointAt(position)}:function(input,position){return (input.charCodeAt(position)-55296)*1024+input.charCodeAt(position+1)-56320+65536};surrogatePairs.highSurrogateFrom=55296;surrogatePairs.highSurrogateTo=56319;

  var __assign = (commonjsGlobal && commonjsGlobal.__assign) || function () {
      __assign = Object.assign || function(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                  t[p] = s[p];
          }
          return t;
      };
      return __assign.apply(this, arguments);
  };
  Object.defineProperty(lib, "__esModule", { value: true });
  var named_references_1 = namedReferences;
  var numeric_unicode_map_1 = numericUnicodeMap;
  var surrogate_pairs_1 = surrogatePairs;
  var allNamedReferences = __assign(__assign({}, named_references_1.namedReferences), { all: named_references_1.namedReferences.html5 });
  var encodeRegExps = {
      specialChars: /[<>'"&]/g,
      nonAscii: /[<>'"&\u0080-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/g,
      nonAsciiPrintable: /[<>'"&\x01-\x08\x11-\x15\x17-\x1F\x7f-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/g,
      nonAsciiPrintableOnly: /[\x01-\x08\x11-\x15\x17-\x1F\x7f-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/g,
      extensive: /[\x01-\x0c\x0e-\x1f\x21-\x2c\x2e-\x2f\x3a-\x40\x5b-\x60\x7b-\x7d\x7f-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/g
  };
  var defaultEncodeOptions = {
      mode: 'specialChars',
      level: 'all',
      numeric: 'decimal'
  };
  /** Encodes all the necessary (specified by `level`) characters in the text */
  function encode(text, _a) {
      var _b = _a === void 0 ? defaultEncodeOptions : _a, _c = _b.mode, mode = _c === void 0 ? 'specialChars' : _c, _d = _b.numeric, numeric = _d === void 0 ? 'decimal' : _d, _e = _b.level, level = _e === void 0 ? 'all' : _e;
      if (!text) {
          return '';
      }
      var encodeRegExp = encodeRegExps[mode];
      var references = allNamedReferences[level].characters;
      var isHex = numeric === 'hexadecimal';
      encodeRegExp.lastIndex = 0;
      var _b = encodeRegExp.exec(text);
      var _c;
      if (_b) {
          _c = '';
          var _d = 0;
          do {
              if (_d !== _b.index) {
                  _c += text.substring(_d, _b.index);
              }
              var _e = _b[0];
              var result_1 = references[_e];
              if (!result_1) {
                  var code_1 = _e.length > 1 ? surrogate_pairs_1.getCodePoint(_e, 0) : _e.charCodeAt(0);
                  result_1 = (isHex ? '&#x' + code_1.toString(16) : '&#' + code_1) + ';';
              }
              _c += result_1;
              _d = _b.index + _e.length;
          } while ((_b = encodeRegExp.exec(text)));
          if (_d !== text.length) {
              _c += text.substring(_d);
          }
      }
      else {
          _c =
              text;
      }
      return _c;
  }
  lib.encode = encode;
  var defaultDecodeOptions = {
      scope: 'body',
      level: 'all'
  };
  var strict = /&(?:#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);/g;
  var attribute = /&(?:#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+)[;=]?/g;
  var baseDecodeRegExps = {
      xml: {
          strict: strict,
          attribute: attribute,
          body: named_references_1.bodyRegExps.xml
      },
      html4: {
          strict: strict,
          attribute: attribute,
          body: named_references_1.bodyRegExps.html4
      },
      html5: {
          strict: strict,
          attribute: attribute,
          body: named_references_1.bodyRegExps.html5
      }
  };
  var decodeRegExps = __assign(__assign({}, baseDecodeRegExps), { all: baseDecodeRegExps.html5 });
  var fromCharCode = String.fromCharCode;
  var outOfBoundsChar = fromCharCode(65533);
  var defaultDecodeEntityOptions = {
      level: 'all'
  };
  /** Decodes a single entity */
  function decodeEntity(entity, _a) {
      var _b = (_a === void 0 ? defaultDecodeEntityOptions : _a).level, level = _b === void 0 ? 'all' : _b;
      if (!entity) {
          return '';
      }
      var _b = entity;
      entity[entity.length - 1];
      {
          var decodeResultByReference_1 = allNamedReferences[level].entities[entity];
          if (decodeResultByReference_1) {
              _b = decodeResultByReference_1;
          }
          else if (entity[0] === '&' && entity[1] === '#') {
              var decodeSecondChar_1 = entity[2];
              var decodeCode_1 = decodeSecondChar_1 == 'x' || decodeSecondChar_1 == 'X'
                  ? parseInt(entity.substr(3), 16)
                  : parseInt(entity.substr(2));
              _b =
                  decodeCode_1 >= 0x10ffff
                      ? outOfBoundsChar
                      : decodeCode_1 > 65535
                          ? surrogate_pairs_1.fromCodePoint(decodeCode_1)
                          : fromCharCode(numeric_unicode_map_1.numericUnicodeMap[decodeCode_1] || decodeCode_1);
          }
      }
      return _b;
  }
  lib.decodeEntity = decodeEntity;
  /** Decodes all entities in the text */
  function decode(text, _a) {
      var decodeSecondChar_1 = _a === void 0 ? defaultDecodeOptions : _a, decodeCode_1 = decodeSecondChar_1.level, level = decodeCode_1 === void 0 ? 'all' : decodeCode_1, _b = decodeSecondChar_1.scope, scope = _b === void 0 ? level === 'xml' ? 'strict' : 'body' : _b;
      if (!text) {
          return '';
      }
      var decodeRegExp = decodeRegExps[level][scope];
      var references = allNamedReferences[level].entities;
      var isAttribute = scope === 'attribute';
      var isStrict = scope === 'strict';
      decodeRegExp.lastIndex = 0;
      var replaceMatch_1 = decodeRegExp.exec(text);
      var replaceResult_1;
      if (replaceMatch_1) {
          replaceResult_1 = '';
          var replaceLastIndex_1 = 0;
          do {
              if (replaceLastIndex_1 !== replaceMatch_1.index) {
                  replaceResult_1 += text.substring(replaceLastIndex_1, replaceMatch_1.index);
              }
              var replaceInput_1 = replaceMatch_1[0];
              var decodeResult_1 = replaceInput_1;
              var decodeEntityLastChar_2 = replaceInput_1[replaceInput_1.length - 1];
              if (isAttribute
                  && decodeEntityLastChar_2 === '=') {
                  decodeResult_1 = replaceInput_1;
              }
              else if (isStrict
                  && decodeEntityLastChar_2 !== ';') {
                  decodeResult_1 = replaceInput_1;
              }
              else {
                  var decodeResultByReference_2 = references[replaceInput_1];
                  if (decodeResultByReference_2) {
                      decodeResult_1 = decodeResultByReference_2;
                  }
                  else if (replaceInput_1[0] === '&' && replaceInput_1[1] === '#') {
                      var decodeSecondChar_2 = replaceInput_1[2];
                      var decodeCode_2 = decodeSecondChar_2 == 'x' || decodeSecondChar_2 == 'X'
                          ? parseInt(replaceInput_1.substr(3), 16)
                          : parseInt(replaceInput_1.substr(2));
                      decodeResult_1 =
                          decodeCode_2 >= 0x10ffff
                              ? outOfBoundsChar
                              : decodeCode_2 > 65535
                                  ? surrogate_pairs_1.fromCodePoint(decodeCode_2)
                                  : fromCharCode(numeric_unicode_map_1.numericUnicodeMap[decodeCode_2] || decodeCode_2);
                  }
              }
              replaceResult_1 += decodeResult_1;
              replaceLastIndex_1 = replaceMatch_1.index + replaceInput_1.length;
          } while ((replaceMatch_1 = decodeRegExp.exec(text)));
          if (replaceLastIndex_1 !== text.length) {
              replaceResult_1 += text.substring(replaceLastIndex_1);
          }
      }
      else {
          replaceResult_1 =
              text;
      }
      return replaceResult_1;
  }
  var decode_1 = lib.decode = decode;

  class EventEmitter {
      constructor() {
          this.listeners = new Map();
      }
      on(event, callback) {
          if (!this.listeners.has(event)) {
              this.listeners.set(event, []);
          }
          this.listeners.get(event).push({ callback, once: false });
      }
      once(event, callback) {
          if (!this.listeners.has(event)) {
              this.listeners.set(event, []);
          }
          this.listeners.get(event).push({ callback, once: true });
      }
      off(event, callback) {
          if (!this.listeners.has(event)) {
              return;
          }
          this.listeners.get(event).forEach((listener, index) => {
              if (listener.callback === callback) {
                  this.listeners.get(event).splice(index, 1);
              }
          });
      }
      emit(event, ...args) {
          console.log(`[EventEmitter] Emitting event: ${event}, data`, args);
          if (!this.listeners.has(event)) {
              return;
          }
          this.listeners.get(event).forEach((listener) => {
              listener.callback(...args);
              if (listener.once) {
                  this.off(event, listener.callback);
              }
          });
      }
      removeAllListeners(event) {
          this.listeners.delete(event);
      }
      removeListener(event, callback) {
          this.off(event, callback);
      }
      getListeners(event) {
          return this.listeners.get(event);
      }
      getEventNames() {
          return Array.from(this.listeners.keys());
      }
  }

  const events$1 = new EventEmitter();

  const replyMsg = (msg) => {
      if (msg.includes(' (_hr) ')) {
          const replies = [];
          msg.split(' (hr_) ').forEach(e => {
              if (e.includes(' (_hr) ')) {
                  const tmp = e.split(' (_hr) ');
                  const user = tmp[1].split('_');
                  replies.unshift({
                      message: decode_1(tmp[0]),
                      username: decode_1(user[0]),
                      time: Number(user[1])
                  });
                  replies.sort((a, b) => {
                      return (a.time - b.time);
                  });
              }
              else {
                  // @ts-ignore
                  replies.unshift(e);
              }
          });
          return replies;
      }
      return null;
  };
  var PublicMessages = (input) => {
      if (input.substring(0, 1) !== '"')
          return false;
      const message = input.substring(1);
      if (message.indexOf('<') !== -1) {
          let parser = false;
          const tmp1 = message.split('<');
          tmp1.forEach(e => {
              const tmp = e.split('>');
              if (/^\d+$/.test(tmp[0])) {
                  if (tmp.length === 11) {
                      parser = true;
                      const reply = replyMsg(tmp[3]);
                      events$1.emit('message.public', {
                          timestamp: Number(tmp[0]),
                          avatar: tmp[1],
                          username: decode_1(tmp[2]),
                          message: decode_1(reply ? String(reply.shift()) : tmp[3]),
                          color: tmp[5],
                          uid: tmp[8],
                          title: tmp[9],
                          messageId: Number(tmp[10]),
                          replyMessage: reply
                      });
                  }
                  else if (tmp.length === 12) {
                      if (tmp[3] === "'1") {
                          parser = true;
                          const msg = {
                              timestamp: Number(tmp[0]),
                              avatar: tmp[1],
                              username: decode_1(tmp[2]),
                              color: tmp[5],
                              uid: tmp[8],
                              title: tmp[9],
                              room: tmp[10]
                          };
                          // Bot.emit('JoinRoom', msg)
                          events$1.emit('room.join', msg);
                      }
                      else if (tmp[3].substr(0, 2) === "'2") {
                          parser = true;
                          const msg = {
                              timestamp: Number(tmp[0]),
                              avatar: tmp[1],
                              username: decode_1(tmp[2]),
                              color: tmp[5],
                              uid: tmp[8],
                              title: tmp[9],
                              room: tmp[10],
                              targetRoom: tmp[3].substr(2)
                          };
                          // Bot.emit('SwitchRoom', msg)
                          events$1.emit('room.switch', msg);
                      }
                      else if (tmp[3] === "'3") {
                          parser = true;
                          const msg = {
                              timestamp: Number(tmp[0]),
                              avatar: tmp[1],
                              username: decode_1(tmp[2]),
                              color: tmp[5],
                              uid: tmp[8],
                              title: tmp[9],
                              room: tmp[10]
                          };
                          events$1.emit('room.leave', msg);
                      }
                  }
              }
          });
          return parser;
      }
      else {
          const tmp = message.split('>');
          if (tmp.length === 11) {
              if (/^\d+$/.test(tmp[0])) {
                  const reply = replyMsg(tmp[3]);
                  const message = reply ? String(reply.shift()) : tmp[3];
                  const msg = {
                      timestamp: Number(tmp[0]),
                      avatar: tmp[1],
                      username: decode_1(tmp[2]),
                      message: decode_1(message),
                      color: tmp[5],
                      uid: tmp[8],
                      title: tmp[9],
                      messageId: Number(tmp[10]),
                      replyMessage: reply
                  };
                  events$1.emit('message.public', msg);
                  return true;
              }
          }
      }
  };

  // @ts-ignore
  const rawSocket = window.socket;
  const hooks = {
      onmsg: [],
      onsend: []
  };
  // Hook掉花园的websocket
  const getHookedSocket = (onmessage, send) => {
      hooks.onmsg.push(onmessage);
      hooks.onsend.push(send);
      return true;
  };
  const originOnmessage = rawSocket._onmessage.bind(rawSocket);
  const originSend = rawSocket._send.bind(rawSocket);
  rawSocket._onmessage = (data) => {
      for (const hook of hooks.onmsg) {
          if (!hook(data)) {
              return;
          }
      }
      originOnmessage(data);
  };
  rawSocket._send = (data) => {
      data.text().then((text) => {
          for (const hook of hooks.onsend) {
              if (!hook(text)) {
                  return;
              }
          }
      });
      originSend(data);
  };

  const events = new EventEmitter();
  getHookedSocket((data) => {
      // 收到信息
      // events.emit('rx', data)
      return true;
  }, (data) => {
      // 发送信息
      // events.emit('tx', data)
      return true;
  });

  var NetworkEvents = () => {
      const decoders = [
          PublicMessages
      ];
      events.on('rx', data => {
          decoders.forEach(decoder => {
              decoder(data);
          });
      });
      return events;
  };

  const globalExports = {
      iirose: IIROSE_Vars,
      events: {
          iirose: NetworkEvents()
      }
  };
  // @ts-ignore
  window.OwOSDK = globalExports;

  /**
   * 获取内层message.html
   * @param {document} 内层内容
   */
  const getInsideDoc = () => {
      if (location.host != "iirose.com")
          return;

      let doc = null;

      if (location.pathname == "/")
      {
          doc = document;
      }
      else if (location.pathname == "/messages.html")
      {
          doc = parent.document;
      }
      else return;

  	const inside = doc.getElementById('mainFrame');
      // const insideDoc = (inside.contentDocument)? inside.contentDocument: inside.contentWindow.document;
      const insideDoc = inside.contentDocument;

  	return insideDoc
  };

  Schema.button = () => {
      let description='';
      let funcName ='';

      const includeFun = {
          type: "button",
          click: funcName,
          meta:{description:description},
          link: (funcName) => {
              includeFun.click = funcName;
              return includeFun;
          },
          description:(str)=>{
              includeFun.meta.description = str;
              return includeFun;
          }
      };

      return includeFun
  };

  window.Schema = Schema;

  /**
   * 生成16位随机英文+数字 
   * @returns 
   */
  // TODO:优化唯一性生成
  function generateRandomString() {
      let characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let result = '';
      for (let i = 0; i < 16; i++)
      {
          let randomIndex = Math.floor(Math.random() * characters.length);
          result += characters[randomIndex];
      }
      const now = Date.now();
      result += md5(now);    return result;
  }

  /** @class */
  // class EventEmitter {
  //     constructor() {
  //         this.events = {};
  //     }

  //     /** @method on 仿event的on */
  //     on(eventName, listener) {
  //         if (!this.events[eventName])
  //         {
  //             this.events[eventName] = [];
  //         }

  //         this.events[eventName].push(listener);
  //     }

  //     /** @method emit 仿event的emit */
  //     emit(eventName, ...args) {
  //         const eventListeners = this.events[eventName];

  //         if (eventListeners)
  //         {
  //             eventListeners.forEach(listener => listener.apply(null, args));
  //         }
  //     }
  // }

  const eventEmitter = new EventEmitter$1();
  const corxList = {};

  /** @class */
  class REIFUU_Plugin {
      /** @type { string } name - 插件名称 */
      name;
      /** @type { string } versions -  插件版本 */
      versions;
      /** @type { JSON } 插件依赖 */
      depend;
      /** @type { JSON } 插件配置构型 */
      config;
      /** @type { String } 插件详情网站地址 */
      url;
      /** @type { String } 插件反馈网站地址 */
      feedback;

      /** 插件服务 */
      ctx = {
          schema: Schema,
          event: eventEmitter,
          inputHolder: inputHolder,
          sdk: globalExports.iirose
      };

      // 插件共享空间
      corx = {};

      /** 插件配置构型的数据 */
      value = {};

      /** @type { 'start' | 'stop' | 'reload' | 'error' | 'remove' } */
      status = 'stop';

      /** @type { REIFUU_Plugin } 当前子类*/
      /** @private */
      plugin;

      /** @type {string} 插件id */
      pluginID;

      /** @method constructor*/
      constructor() {
          this.corx = corxList;
      }

      /** @method start 启动主要子插件 */
      async pluginStart() {
          if (!this.plugin) { return; }

          this.plugin.status = 'start';

          nowREIFUUPluginList[this.plugin.name] = this.plugin.versions;

          if (!REIFUUPluginListTemp[this.plugin.name]) { REIFUUPluginListTemp[this.plugin.name] = []; }

          REIFUUPluginListTemp[this.plugin.name].push(this.plugin.pluginID);

          if (typeof this.plugin.start !== "undefined") { await this.plugin?.start(); }
          if (typeof this.plugin.server !== "undefined") { this.corx[this.plugin.serverName] = this.plugin.server; }
          this.pluginConfigSave();
      }

      /** @method start 停止主要子插件 */
      async pluginStop() {
          if (!this.plugin) { return; }

          this.plugin.status = 'stop';
          delete nowREIFUUPluginList[this.plugin.name];

          const index = REIFUUPluginListTemp[this.plugin.name].indexOf(this.plugin.pluginID);
          if (index > 0) { REIFUUPluginListTemp[this.plugin.name].splice(index, 1); }

          if (typeof this.plugin.server !== "undefined") { delete this.corx[this.plugin.serverName]; delete corxList[this.plugin.serverName]; }
          if (typeof this.plugin.stop !== "undefined") { await this.plugin?.stop(); }
          this.pluginConfigSave();

      }

      async pluginRemove() {
          if (!this.plugin) { return; }
          this.plugin.status = 'remove';
          delete nowREIFUUPluginList[this.plugin.name];

          const index = REIFUUPluginListTemp[this.plugin.name].indexOf(this.plugin.pluginID);
          if (index > 0) { REIFUUPluginListTemp[this.plugin.name].splice(index, 1); }

          if (typeof this.plugin.server !== "undefined") { delete this.corx[this.plugin.serverName]; delete corxList[this.plugin.serverName]; }
          if (typeof this.plugin.stop !== "undefined") { await this.plugin?.stop(); }
          this.plugin = null;

          // 删除配置序列的最后一项
          // 也许这个也不用写
          // 不对，还是要的
          const key = `reifuuTemp.${this.plugin.name}`;
          const dataTemp = Array(localStorage.getItem(key));

          dataTemp.pop();
          localStorage.setItem(key, dataTemp.toString());
      }

      async pluginReload() {
          if (!this.plugin) { return; }
          this.plugin.status = 'reload';
          if (typeof this.plugin.stop !== "undefined") { await this.plugin?.stop(); }
          if (typeof this.plugin.start !== "undefined") { await this.plugin?.start(); }
      }

      pluginConfigSave() {
          // 存储插件配置缓存
          const key = `reifuuTemp.${this.plugin.name}`;
          let data = JSON.parse(localStorage.getItem(key));

          data[this.plugin.pluginID] = this.plugin.value;
          data[this.plugin.pluginID].ReifuuPluginStatus = this.plugin.status;

          localStorage.setItem(key, JSON.stringify(data));
      }

      async plugInit(plugin) {
          if (!plugin) { return; }
          this.plugin = plugin;

          nowREIFUUPluginList[plugin.name] = [plugin.versions];

          const addPage = createConfigPage.createPlugContent(plugin);
          const pageContent = addPage.querySelector("#pageContent");
          createConfigPage.addPage(plugin, addPage);

          if (plugin.depend)
          {
              /** @type { number } 0:通过依赖，1:缺少依赖*/
              let dependStatus = 0;

              for (let key in plugin.depend)
              {
                  const dependName = key;
                  const dependVersion = plugin.depend[dependName];

                  if (nowREIFUUPluginList[dependName])
                  {
                      // 版本对比
                      const temp = semver$1.satisfies(nowREIFUUPluginList[dependName], dependVersion);

                      if (!temp)
                      {
                          dependStatus = 1;
                          const text = `依赖项 【${key}】，版本【${nowREIFUUPluginList[dependName]}】验证失败，需要版本：【${dependVersion}】`;
                          // 这边是依赖的插件版本不对
                          pageContent.append(createConfigPage.createTipsElement(text, 2));

                      }
                  } else
                  {
                      dependStatus = 1;
                      const text = `插件【${plugin.name}】缺少依赖 【${key}】，版本：【${dependVersion}】`;
                      pageContent.append(createConfigPage.createTipsElement(text, 2));
                      // 这边是缺少依赖

                  }
              }
              if (dependStatus === 0)
              {
                  plugin.pluginID = generateRandomString();
                  eventEmitter.on(plugin.pluginID, (status) => {
                      if (status == 'stop')
                      {
                          this.pluginStop();
                      } else if (status == 'start')
                      {
                          this.pluginStart();
                      }
                  });
                  const text = `插件【${plugin.name}】启动成功！`;
                  console.log(text);
                  pageContent.append(createConfigPage.createTipsElement(text, 0));
                  pageContent.append(createConfigPage.createConfigElement(plugin));

                  // this.pluginStart();

              } else
              {
                  const text = `插件【${plugin.name}】启动失败！`;
                  console.log(text);
                  pageContent.append(createConfigPage.createTipsElement(text, 2));
                  this.plugin = null;
                  return;
              }
          } else
          {
              plugin.pluginID = generateRandomString();

              const text = `插件【${plugin.name}】启动成功！`;
              console.log(text);// 这句
              // 配置构型生成
              pageContent.append(createConfigPage.createConfigElement(text));

              this.pluginStart();
          }

          // setInterval(()=>{
          //     console.log('b', this.plugin.value)
          // },10000)

          // window.onunload = function () {
          //     this.pluginConfigSave();
          // };
          this.pluginConfigSave();
      }
  }


  const nowREIFUUPluginList = {
      core: '0.0.1'
  };

  // 缓存
  const REIFUUPluginListTemp = {};

  // 加载插件
  new class loader extends REIFUU_Plugin {
      name = '插件加载器';
      versions = '0.0.1';
      depend = {
          core: '0.0.1'
      };

      config = {
          reload: this.ctx.schema.button().link("reload").description('重载按钮'),
          url: this.ctx.schema.array(String).description('js站点地址')
      };

      // url = "https://www.baidu.com";
      // feedback = "https://www.baidu.com";
      constructor() {
          super();
          this.plugInit(this);
      }

      jsUrlList = [];

      // 添加js
      addJs(url) {
          console.log(`正在安装【${url}】`);
          const insideDoc = getInsideDoc();
          const jsDoc = document.createElement('script');
          jsDoc.src = url;
          jsDoc.id = md5(url);

          insideDoc.head.append(jsDoc);
          console.log(`安装成功【${url}】`);
          _alert(`安装成功【${url}】`);
      };

      // 删除js
      delJs(url) {
          console.log(`正在卸载【${url}】`);
          const insideDoc = getInsideDoc();
          const rmDom = insideDoc.getElementById(md5(url));
          rmDom.remove();
          console.log(`卸载成功【${url}】`);

          _alert(`卸载成功【${url}】，请点击上方重载按钮应用修改`);
      }

      start() {
          const list = this.value.url;

          list.forEach(element => {
              this.addJs(element);
          });
          this.jsUrlList = list;
      }

      stop() {
          this.value.url.forEach((e) => {
              this.delJs(e);
          });

          this.pluginConfigSave();
      }

      arrayConfigChange(title, type) {
          const newlist = this.value.url;
          const oldList = this.jsUrlList;

          // arr1:old，arr2:new
          function compareArrays(arr1, arr2) {
              const changes = [];

              // 检查arr1中是否有被修改或删除的元素
              for (let i = 0; i < arr1.length; i++)
              {
                  const indexInArr2 = arr2.indexOf(arr1[i]);

                  if (indexInArr2 === -1)
                  {
                      // 元素在arr1中存在但在arr2中不存在，即删除了
                      changes.push({ type: 'delete', value: arr1[i] });
                  }
              }

              // 检查arr2中是否有新增的元素
              for (let i = 0; i < arr2.length; i++)
              {
                  const indexInArr1 = arr1.indexOf(arr2[i]);

                  if (indexInArr1 === -1)
                  {
                      // 元素在arr2中存在但在arr1中不存在，即新增了
                      changes.push({ type: 'add', value: arr2[i] });
                  }
              }

              return changes;
          }

          const differences = compareArrays(oldList, newlist);
          console.log(differences);
          differences.forEach((e) => {
              const { type, value } = e;
              if (type == 'delete') { this.delJs(value); }
              if (type == 'add') { this.addJs(value); }
          });

          this.jsUrlList = newlist;
      }

      reload() {
          return location.reload();
      }
  };

  exports.REIFUU_Plugin = REIFUU_Plugin;

}));


(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
})((function () { 'use strict';

    new class iirose_sdk extends window.reifuuPluginCore.REIFUU_Plugin
    {
        name = '蔷薇SDK';
        versions = '0.0.1';
        depend = {
            core: '0.0.1'
        };
        
        config = {
            // '主要配置': {
            房间消息事件: this.ctx.schema.boolean().default(true),
            弹幕消息事件:this.ctx.schema.boolean().default(true),
            私聊消息事件:this.ctx.schema.boolean().default(true),
            媒体消息:this.ctx.schema.boolean().default(true),
            //     // b: this.ctx.schema.boolean().default(false),
            //     // c: this.ctx.schema.string(),
            //     // d: this.ctx.schema.string().role('secret')
            // },
            // '次要配置': {
            //     h: this.ctx.schema.button().link('test'),
            //     e: this.ctx.schema.string(),
            //     f: this.ctx.schema.array(Number).default([1, 2, 3, 4, 5]),
            //     g: this.ctx.schema.array(String).default(["12", "34"]),
            // }

        };
        url = "https://www.baidu.com";
        feedback = "https://www.baidu.com";

        constructor()
        {
            super();

            this.plugInit(this);
            // 插件进行初始化代码
            // 理论上插件允许多开，只要把变量定义在这个类里面就好了

            /* code */
        }

        
        start()
        {
            //转义函数
            function escape2Html(str) {
                var temp = document.createElement("div");
                temp.innerHTML = str;
                var output = temp.innerText || temp.textContent;
                temp = null;
                return output;
                }
            
            function getUsernameByUID(e) {
                    var t = Objs.mapHolder.Assets.userlistUid.indexOf(e);
                    if (-1 < t) {
                      // 成功找到UID时的处理流程
                      var o = Objs.mapHolder.Assets.userlistL[t];
                      return o;
                    }
                    // 未找到用户的降级处理
                    return console.warn("UID not found:" + e), null;
            }
            function getUserUIDByName(e) {
                var t = Objs.mapHolder.Assets.userlistL.indexOf(e);
                if (-1 < t) {
                  // 成功找到UID时的处理流程
                  var o = Objs.mapHolder.Assets.userlistUid[t];
                  return o;
                }
                // 未找到用户的降级处理
                return console.warn("UID not found:" + e), null;
              }
            function processLikeMessage(N){
                var oe = N.split("<");
                var messages = [];
                for (var ne = oe.length - 1; ne >= 0; ne-=1) {

                    let message_raw=oe[ne];
                    console.log(oe[ne])
                    let e = oe[ne].split(">");
                    if(e.length<2){
                        continue
                    }
                    messages.push({
                        "name":e[0]
                    })
                }
                return messages
            }
            function processRoomMessage(N) {
                console.log(N.toString())
                var oe = N.split("<");
                var messages = [];
                for (var ne = oe.length - 1; ne >= 0; ne-=1) {
                    //获取单个消息切片
                    let message_raw=oe[ne];
                    console.log(oe[ne])
                    let e = oe[ne].split(">");
                    if (e.length < 11) continue;
            
                    // 基础字段解析
                    let o = e[8]; // 用户ID
                    let I = e[9].split("'");
                    let U_raw = I[0]; // 原始权限标识
                    let y = I[2]; // 用户等级
                    let Z = I[3] || 0; // 未知字段
                    let ee = I[4] || ""; // 扩展信息
                    
                    // 用户信息
                    let l = e[6]; // 性别 0-未知 1-男 2-女
                    let i = e[2]; // 用户名
                    let s = e[4] || "ffffff"; // 用户名颜色
                    let r = e[5] || "ffffff"; // 二级颜色
                    
                    // 头像处理
                    let t = "";
                    if (e[1] && e[1][0] === "#") {
                        t = getMonsterIcon(e[1].substr(1)); 
                    } else {
                        t = avatarconv(e[1]); // 用户头像
                    }
            
                    // 消息内容处理
                    let a = e[3];
                    let msg_type = "normal";
                    if (a[0] === "'" && a[1] !== "*") {
                        
                        msg_type = "system";
                        switch (a[1]) {
                            case "0": // 玩家移动
                                msg_type="RoomMove"
                                break;
                            case "1":
                                msg_type="RoomJoin"
                                break;
                            case "2": // 房间切换
                                msg_type = "RoomChange";
                                a=a.substr(2);
                                break;
                            case "3":
                                msg_type="RoomLeave"
                                break;
                            case "4": // 卡牌分享
                                msg_type = "RoomCard";
                                break;
                            case "5": // 玩家退出
                                a = "玩家退出消息";
                                break;
                            default:
                                a = "系统消息";
                        }
                    } else if (a.substr(0, 2) === "'*") {
                        a = a.substr(2); // 过滤特殊前缀
                        msg_type = "Special";
                    }
            
                    // 构建消息对象
                    messages.push({
                        "uid": o,
                        "name": i,
                        "gender": l,
                        "color": "#" + s,
                        "role": U_raw,
                        "level": y,
                        "avatar": t,
                        "content": escape2Html(a),
                        "type": msg_type,
                        "timestamp": e[0], // 转换为毫秒
                        "raw": e ,// 保留原始数据
                        toString:()=>{
                            var s="";

                            return "id:"+o.toString()+"\n"+
                                    "name:"+i.toString()+"\n"+
                                    "gender:"+l.toString()+"\n"+
                                    "color:"+"#"+s.toString()+"\n"+
                                    "role:"+U_raw.toString()+"\n"+
                                    "level:"+y.toString()+"\n"+
                                    "avatar:"+t.toString()+"\n"+
                                    "content:"+escape2Html(a).toString()+"\n"+
                                    "type:"+msg_type.toString()+"\n"+
                                    "time:"+e[0].toString()+"\n"+
                                    "raw:"+e.toString()+"\n"
                        }
                    });
                }
                return messages;
            }
            //处理弹幕消息
            function processDanmakuMessage(N){
                var oe = N.split("<");
                var messages = [];
                for (var ne = oe.length - 1; ne >= 0; ne-=1) {
                    //获取单个消息切片
                    let message_raw=oe[ne];
                    let e = message_raw.split(">");
                    messages.push({
                        name:e[2],
                        content:escape2Html(e[4]),
                        uid:e[1],
                        toString:()=>{
                            return "name:"+e[2]+"\n"+
                                    "content:"+escape2Html(e[4])+"\n"+
                                    "uid:"+e[1]+"\n"
                        }
                    })
                }
                return messages;
            }
            // 代理函数
            function proxyFunction(targetFunction, callback,call_this) {
                return function(...param) {
	            let return_v=targetFunction.call(call_this,...param);
                // 调用回调函数
                callback.call(this,...param);
                return return_v;
                };
            }
            function ws_message_get(...param){

                //私聊消息前缀
                if(arguments[0].startsWith('""')){
                    let messages=processDanmakuMessage(arguments[0].substr(2))
                    for(var ne = messages.length - 1; ne >= 0; ne-=1){
                        console.log("收到私聊：\n"+messages[ne].toString())
                        this.ctx.event.emit(Danmaku,messages[ne])
                    }
                    
                }   
                //房间消息前缀
                else if(arguments[0].startsWith('"')){
                    let messages=processRoomMessage(arguments[0].substr(1))
                    for(var ne = messages.length - 1; ne >= 0; ne-=1){
                        console.log("收到房间：\n"+messages[ne].toString())
                        this.ctx.event.emit(messages[ne].msg_type,messages[ne])
                    }
                }
                //弹幕消息前缀
                else if(arguments[0].startsWith("=")){
                    
                }
                
                //获得赞消息

                else if(arguments[0].startsWith("@*")){
                    let messages=processLikeMessage(arguments[0].substr(2))
                    for(var ne = messages.length - 1; ne >= 0; ne-=1){
                       let uid=getUserUIDByName(messages[ne]["name"])
                       if(uid!=null){
                        window._alert("已经回赞！\n名字:"+messages[ne]["name"]+"\nUID:"+uid)
                       }
                    }
                }
                
            
            }
            var target_function_cache_ws=socket._onmessage;
            console.log(this)
            socket._onmessage=proxyFunction(ws_message_get,target_function_cache_ws,this)
        
            
        
        }

        stop()
        {
            socket._onmessage=target_function_cache_ws
            // 插件消除影响代码
            /* code */
        }

        test()
        {
        }


        processIIROSEMessage(origin_mes){

        }




        

    };

}));
