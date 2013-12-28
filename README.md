# UMD Router

A simple to use router that places nicely with AMD when you need it to.

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
	before: function () {
		// ... do something before firing the route handler ...
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

These parameters function the same in the simple, callback method as well as the object-event
structure.