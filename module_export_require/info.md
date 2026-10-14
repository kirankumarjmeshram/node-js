# Importing and Exporting in Node.js

Node.js supports two module systems:

1. **CommonJS (CJS)** — `require()` and `module.exports`
2. **ECMAScript Modules (ESM)** — `import` and `export`

Modules allow us to organize code into separate files and reuse functions, objects, classes, and variables across an application.

---

## 1. CommonJS (CJS)

CommonJS is the traditional module system used in Node.js.

### Configuration

CommonJS can be enabled using the following configuration in `package.json`:

```json
{
  "type": "commonjs"
}
```

Alternatively, use the `.cjs` file extension. In packages without a `"type"` field, `.js` files are traditionally treated as CommonJS, although newer Node.js versions can also detect ESM syntax in some cases.

### Key Features

- Uses `require()` to import modules.
- Uses `module.exports` or `exports` to export values.
- Module loading through `require()` is synchronous.
- Each module has its own scope.
- CommonJS modules are not automatically in strict mode.
- Commonly found in existing Node.js applications and packages.

### Exporting a Single Function

**File: `greet.js`**

```javascript
function greet(name) {
  return `Hello, ${name}!`;
}

module.exports = greet;
```

**File: `app.js`**

```javascript
const greet = require("./greet");

console.log(greet("World"));
```

**Output:**

```text
Hello, World!
```

### Exporting Multiple Functions

**File: `utils.js`**

```javascript
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;

module.exports = {
  add,
  subtract,
  multiply
};
```

**File: `app.js`**

```javascript
const { add, subtract, multiply } = require("./utils");

console.log(add(5, 3));       // 8
console.log(subtract(5, 3));  // 2
console.log(multiply(5, 3));  // 15
```

### Exporting an Object

**File: `user.js`**

```javascript
const user = {
  name: "Kiran",
  role: "Software Engineer"
};

module.exports = user;
```

**File: `app.js`**

```javascript
const user = require("./user");

console.log(user.name);
console.log(user.role);
```

### Understanding `module.exports` vs `exports`

Both can be used to export values, but they are not identical.

```javascript
exports.add = (a, b) => a + b;
exports.subtract = (a, b) => a - b;
```

This works because `exports` initially references the same object as `module.exports`.

However, assigning a completely new value to `exports` does not replace the exported value:

```javascript
exports = function greet() {
  return "Hello";
};
```

The code above does not export the new function.

To export a single function, use:

```javascript
module.exports = function greet() {
  return "Hello";
};
```

**Interview tip:** `module.exports` determines what `require()` returns.

### How `require()` Works

When Node.js executes a CommonJS module:

1. It resolves the module path.
2. It loads and evaluates the module if it has not already been loaded.
3. It caches the module.
4. It returns the value assigned to `module.exports`.

Example:

**File: `data.js`**

```javascript
const secret = "Private data";
const publicData = "Public data";

module.exports = publicData;
```

**File: `app.js`**

```javascript
const data = require("./data");

console.log(data); // Public data
console.log(secret); // ReferenceError
```

The `secret` variable is not accessible from `app.js` because it is not exported.

---

## 2. ECMAScript Modules (ESM)

ES Modules are the standardized JavaScript module system. They are supported in modern Node.js and are widely used in frontend development.

### Configuration

Add the following to `package.json`:

```json
{
  "type": "module"
}
```

Alternatively, use the `.mjs` file extension.

### Key Features

- Uses `import` to import modules.
- Uses `export` and `export default` to export values.
- Uses static module declarations that Node.js can analyze before executing the module body.
- Uses strict mode automatically.
- Supports top-level `await` in modules.
- Supports live bindings for named exports.

**Important:** ESM is not inherently asynchronous in every respect. Module loading and evaluation have defined semantics, and top-level `await` allows asynchronous module evaluation.

### Named Exports

Named exports allow a module to export multiple values.

**File: `utils.js`**

```javascript
export const add = (a, b) => a + b;

export const subtract = (a, b) => a - b;

export function multiply(a, b) {
  return a * b;
}
```

**File: `app.js`**

```javascript
import { add, subtract, multiply } from "./utils.js";

console.log(add(5, 3));       // 8
console.log(subtract(5, 3));  // 2
console.log(multiply(5, 3));  // 15
```

Notice that relative imports in Node.js ESM generally require the file extension, such as `./utils.js`.

### Default Export

A module can provide one default export.

**File: `greet.js`**

```javascript
export default function greet(name) {
  return `Hello, ${name}!`;
}
```

**File: `app.js`**

```javascript
import greet from "./greet.js";

console.log(greet("World"));
```

**Output:**

```text
Hello, World!
```

The imported name does not need to match the function's original name.

### Combining Named and Default Exports

**File: `math.js`**

```javascript
export const add = (a, b) => a + b;

export const subtract = (a, b) => a - b;

export default function multiply(a, b) {
  return a * b;
}
```

**File: `app.js`**

```javascript
import multiply, { add, subtract } from "./math.js";

console.log(add(5, 3));       // 8
console.log(subtract(5, 3));  // 2
console.log(multiply(5, 3));  // 15
```

### Renaming Imports

```javascript
import { add as sum } from "./utils.js";

console.log(sum(10, 20)); // 30
```

### Importing Everything

```javascript
import * as utils from "./utils.js";

console.log(utils.add(5, 3));
console.log(utils.subtract(5, 3));
```

---

## 3. `.cjs`, `.mjs`, `.js`, and `package.json`

| File or configuration               | Module system                                                |
| ----------------------------------- | ------------------------------------------------------------ |
| `.cjs`                            | Always CommonJS                                              |
| `.mjs`                            | Always ES Modules                                            |
| `.js` with `"type": "commonjs"` | CommonJS                                                     |
| `.js` with `"type": "module"`   | ES Modules                                                   |
| `.js` without `"type"`          | Traditionally CommonJS; modern Node.js may detect ESM syntax |

The `package.json` `"type"` field determines how `.js` files are interpreted within that package scope. Explicit `.cjs` and `.mjs` extensions take precedence.

### Example Project Structure

```text
node-modules/
├── package.json
├── app.js
├── utils.js
└── greet.js
```

**For CommonJS — `package.json`**

```json
{
  "name": "node-modules",
  "version": "1.0.0",
  "type": "commonjs"
}
```

**For ES Modules — `package.json`**

```json
{
  "name": "node-modules",
  "version": "1.0.0",
  "type": "module"
}
```

Choose the configuration that matches the module syntax used by your `.js` files.

---

## 4. CommonJS vs ES Modules

| Feature                | CommonJS (CJS)                                    | ES Modules (ESM)                                         |
| ---------------------- | ------------------------------------------------- | -------------------------------------------------------- |
| Import syntax          | `require()`                                     | `import`                                               |
| Export syntax          | `module.exports`                                | `export`, `export default`                           |
| Typical extensions     | `.cjs`, `.js`                                 | `.mjs`, `.js`                                        |
| Loading model          | `require()` loads synchronously                 | Static imports are resolved and linked before evaluation |
| Strict mode            | Not automatic                                     | Always enabled                                           |
| Top-level `this`     | Module-specific exports object                    | `undefined`                                            |
| Top-level `await`    | Not supported as a module feature                 | Supported                                                |
| Import file extensions | Often optional for relative files                 | Generally required for relative Node.js imports          |
| Typical use            | Existing Node.js projects and compatible packages | Modern JavaScript and frontend tooling                   |

---

## 5. Can CommonJS and ES Modules Work Together?

Yes. Node.js supports interoperability between the two module systems, but there are some limitations.

### Importing CommonJS from ESM

**File: `utils.cjs`**

```javascript
const add = (a, b) => a + b;

module.exports = { add };
```

**File: `app.mjs`**

```javascript
import utils from "./utils.cjs";

console.log(utils.add(5, 3)); // 8
```

The CommonJS `module.exports` value is available as the default import. Named imports from CommonJS may work through static analysis, but are not guaranteed in every case.

### Importing ESM from CommonJS

Modern Node.js versions support `require()` for certain ES modules, subject to compatibility constraints, including the absence of top-level `await` in the required ESM graph. For broader compatibility, use dynamic `import()`:

```javascript
async function main() {
  const { add } = await import("./utils.mjs");

  console.log(add(5, 3)); // 8
}

main();
```

Dynamic `import()` returns a Promise.

For new applications, prefer using one module system consistently unless interoperability is necessary.

---

## 6. Which Module System Should You Use?

- **Existing CommonJS application:** Continue with `require()` and `module.exports` unless you have a reason to migrate.
- **New Node.js application:** ESM is a good default for modern JavaScript projects, provided your dependencies and runtime support it.
- **React and Angular:** ESM syntax is standard in modern source code, although bundlers and tooling determine how modules are processed for deployment.
- **Legacy Node.js packages:** CommonJS remains common and supported.

### Quick Revision

```javascript
// CommonJS: Export
module.exports = { add };

// CommonJS: Import
const { add } = require("./utils");

// ES Modules: Export
export const add = (a, b) => a + b;

// ES Modules: Import
import { add } from "./utils.js";
```

**Remember:**

- CommonJS uses `require()` and `module.exports`.
- ES Modules use `import` and `export`.
- `.cjs` always means CommonJS; `.mjs` always means ESM.
- CommonJS `require()` is synchronous, while ESM supports static imports and dynamic asynchronous imports.
- ESM automatically runs in strict mode.
- The `"type"` field in `package.json` controls how `.js` files are interpreted within its package scope.
