# UMD Router

A simple to use router that plays nicely with AMD when you need it to.

## Initializing the Router

Create a new instance of UMD Router as shown below.

	var router = new Router({

		/**
		 * A global “route container” must be defined. This ID should reference
	     * a DOM element responsible for containing the displayed routes.
		 */
		'route_container': '#route_container',

		/**
		 * Routes have the option of specifying the name of a template. For that option
		 * to have any effect, you must define a global 'template_loader' function on the
		 * router level. Load your template via GET requests to the server, use
		 * Handlebars, whatever. When you're done, pass it to the callback in the form of:
		 *
		 * callback(err, template);
		 */
		'template_loader': function(template, callback) {
			callback(false, "<div style='border: 1px solid red;'></div>");
		}

	});

## Creating a Route

Pass the `createRoute()` method two parameters: a name and an options object. The value for `name` should match the URL hashbang to which this route will be associated. In this example, the route would be invoked when the user visits:

http://site.com/#something OR http://site.com/#something/param1/param2/etc…

	router.createRoute('something', {

		/**
		 * Optional.
		 */
		'template': 'something',

		/**
		 * Call `fn()` when you are done initializing
		 * and are ready to display the route.
		 */
		'init': function(fn, arg1, arg2) {
			fn();
		},

		/**
		 * Called after the route has been loaded.
		 */
		'load': function() {

			this.test();

			console.log(this.container);

			this.setInterval(function() {
				console.log('herping...');
			}, 2000);

			this.subscribe({
				'topic': 'test',
				'callback': function(data, envelope) {
					console.log('incoming message', data, envelope);
				}
			});

		},

		/**
		 * Called when the user leaves the route.
		 */
		'unload': function() {
		},

		/**
		 * Avoid spaghetti code by breaking the login with your route
		 * into distinct methods. The init, load, unload, and any
	     * additional “extended” methods all share the same scope.
		 */
		'extend': {

			'test': function() {
				console.log('test!', this, this.herp);
			}

		}

	});
