# javascript-json-custom-state (Bubble plugin)

This repository holds the source of a small [Bubble](https://bubble.io) plugin, published in the Bubble plugin store as "javascript-json-custom-state", that lets a Bubble app read and write an element's custom states from plain JavaScript using JSON objects. Bubble normally changes custom states one at a time through workflow actions, which gets tedious when several related values have to change together. The plugin adds an invisible "State" element that exposes a named setter function on `window.appState`, plus a client-side "setState" action where you write JavaScript that calls that setter with an object or an updater function, so many custom states update in one step. It is aimed at Bubble builders who are comfortable writing short JavaScript snippets. The code is synced automatically from the Bubble Plugin Editor (plugin API version 3, no jQuery), was written in September 2022, and is open source.

> Status: small, finished plugin from 2022. The canonical copy lives on Bubble's servers; this repo is kept in sync from the Bubble Plugin Editor.

**Live demo:** https://demo-javascript-json-custom-state.bubbleapps.io/version-test

## Features

- **State element** (visual element, default size 1x1) with two optional fields:
  - *setState function Name*: registers a setter under that name on `window.appState`, for example `setUser`.
  - *Custom-State Initialization*: a JavaScript function body that returns a JSON object used to seed the element's custom states.
- **setState action** (client-side workflow action): runs the JavaScript you enter, with the shared `window.appState` object passed in as `state`.
- Setters accept either a plain object or an updater function `(oldValue) => newValue`, similar to React's `setState`.
- `setter.current` holds the most recently applied value.

## Tech stack

Bubble plugin API v3 · vanilla JavaScript (client-side)

## Usage

1. Install the plugin in your Bubble app and place a **State** element on the page.
2. Add custom states to that element in the Bubble editor, for example `user name` and `role`.
3. Set *setState function Name* to something like `setUser`.
4. Optionally seed the states with *Custom-State Initialization*:

   ```javascript
   return { "user name": "Guest", "role": "viewer" };
   ```

5. In any workflow, add the **setState** action and write code against `state`:

   ```javascript
   // replace values
   state.setUser({ "user name": "Jane", "role": "admin" });

   // or derive from the current values
   state.setUser(old => ({ ...old, role: "editor" }));
   ```

## How it works

- `elements/AAE-850ma/update.js` builds the setter. Each key of the object you pass is lowercased, spaces become underscores, and it is matched against Bubble's internal custom-state key `custom.<key>_` on the element instance. Only keys that already exist as custom states are written.
- For updater functions, the current values are collected from every `custom.*` state on the element and passed in. Keys in that object use Bubble's internal form (lowercase, underscores).
- The initialization function is compiled with `new Function` and applied after a 1 ms `setTimeout`, which works around a timing issue in Bubble noted in the source.
- `actions/AAC-850m6/client.js` compiles the action's code with `new Function("state", code)` and calls it with `window.appState`. The server-side action is empty.

## Project structure

```text
actions/AAC-850m6/       setState workflow action (client.js, empty server.js, params.json)
elements/AAE-850ma/      State element (update.js holds the logic; initialize/preview/reset are stubs)
meta_data.json           Plugin name, description, categories, demo page, licence
shared_tech_params.json  Plugin API version and jQuery setting
```

## Limitations

- It relies on Bubble internals (`instance.canvas.bubble_data.bubble_instance._states`), which are not a public API and may change.
- The action and initialization run user-supplied code through `new Function`, so only use trusted input there.
- Plugin code is edited in the Bubble Plugin Editor; changes made here must be synchronized back from Bubble.
