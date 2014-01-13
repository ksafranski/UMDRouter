# UMD Router

UMDRouter is a lightweight, dependency-free JavaScript library that provides developers with an easy-to-use mechanism for defining dynamic "routes" based on hashbang and / or push-state history. It can be used in place of heaver solutions such as Sammy.js.

## Usage

First, create an instance of the router:

```javascript
var router = new UMDRouter();
```

Once your router is instantiated you can build routes via the `on()` method. This
method supports two formats:

### Single Callback Route Handling

A single callback can be provided which will fire when the route is matched:

```javascript
router.on("/some/route", function () {
    // ... do something ...
});
```

### Object-Event Route Handling

The router will process an object with at least one of the following:

```javascript
router.on("/some/route/", {
	before: function (fn) {
		// ... do something before firing the route handler ...
		// Continue:
		fn(true);
		// Break:
		fn(false);
	},
	load: function () {
		// ... do something when the route is matched ...
	},
	unload: function () {
		// ... do something when the route is navigated away from ...
	}
});
```

### URL Parameters

The router watches for and matches routes with the `:variable` convention, for example:

```javascript
router.on("/some/route/:id", function (id) {
    // ... {id} contains the route ID variable
});
```
These parameters function the same in the simple, callback method as well as the object-event
structure.

### Extending

The router is made to allow for extensibility independent of a specific route:

```javascript
UMDRouter.extend({
	"sayCheese": function() {
		console.log("Cheese!");
	}
});
```

Or by extending inside the route itself:

```javascript
router.on("/profile", {
	load: function () {
		this.sayCheese();
	},
	extend: {
		sayCheese: function() {
			console.log('Cheese!');
			this.derp();
		}
	}
});
```
## Installation

### Via Bower

	$ bower install umdrouter

### Via NPM

	$ npm install umdrouter
