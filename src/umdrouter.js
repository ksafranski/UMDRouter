(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['underscore', 'umdrouter/umdroute'], factory);
    } else {
        // Browser globals
        root.Router = factory(root.b);
    }
}(this, function(_, UMDRoute) {

    /**
     * Router constructor function
     *
     * @constructor Router
     */
    var Router = function(options) {

        var self = this;

        options = options || {};

		_.defaults(options, {
			'route_container': null,
			'template_loader': null
		});

		if ( options.route_container.substring(0, 1) === '#' ) {
			options.route_container = options.route_container.substring(1);
		}

		self.route_container = document.getElementById(options.route_container);

		if ( !self.route_container ) {
			throw 'Specified route container does not exist: ' + options.route_container;
		}

		self.template_loader = options.template_loader;

        // Watch hashchange
        window.onhashchange = function() {
            self.process();
        };

        // Run on load
        window.onload = function() {
            self.process();
        };

        self.activeRoute = null;

    };

    /**
     * Container object for routes
     *
     * @memberof Router
     * @member {Object}
     */
    Router.prototype.routes = {};

    /**
     * Call this method once all of your routes have been defined.
     *
     * @method ready
     */
    Router.prototype.ready = function() {
		if ( document.readyState === "complete" ) {
	    	this.process();
		}
    };

    /**
     * Processes/matches routes and fires callback
     *
     * @memberof Router
     * @method process
     */
    Router.prototype.process = function() {

        var self = this,
            fragment = window.location.hash.replace("#", ""),
            matcher,
            route,
            args = [],
            matched,
            i,
            z,
            routeInstance;

		matched = this.getMatchedRoute();
		if ( !matched ) {
			return;
		}

		self.unloadActiveRoute();

		self.getTemplate(matched.name, function(err, template) {

			if ( err ) {
				throw 'Error loading template for route: `' + matched.name + '`';
			}

			self.route_container.innerHTML = template;

			self.activeRoute = new UMDRoute({
				'name': matched.name,
				'route': matched.route,
				'args': matched.args,
				'container': self.route_container
			});

		});

    };

	/**
	 * Calls the `unload` method of the currently active route (if it exists).
	 *
	 * @method unloadActiveRoute
	 */
    Router.prototype.unloadActiveRoute = function() {
    	if ( !this.activeRoute ) {
    		return;
    	}
    	this.activeRoute._unload();
    	this.activeRoute = null;
    };

	/**
	 * Analyzes the current URL and returns an object containing data related to the
	 * matching route, if found. Otherwise, returns null.
	 *
	 * @method getMatchedRoute
	 * @return {Mixed}
	 */
    Router.prototype.getMatchedRoute = function() {

        var self = this,
            fragment = window.location.hash.replace("#", ""),
            matched,
            matcher,
            route,
            argString,
            args = [];

        // Match root
        if ( fragment === "/" || fragment === "" && self.routes.hasOwnProperty("/") ) {
        	return {
        		'name': '/',
        		'route': self.routes["/"],
        		'args': []
        	};
        } else {
            // Match routes
            for ( route in self.routes ) {
                matcher = fragment.match(new RegExp(route.replace(/:[^\s/]+/g, "([\\w-]+)")));
                if ( matcher !== null && route !== "/" ) {
                	matched = route;
                    args = [];
					argString = matcher.input.substring(route.length);
					if ( argString.substring(0, 1) === '/' ) {
						argString = argString.substring(1);
					}
					args = argString.split('/');
                    break;
                }
            }
            if ( !matched ) {
            	return null;
            }
			return {
				'name': matched,
				'route': self.routes[matched],
				'args': args
			};
        }

    };

    /**
     * Method to reload (refresh) the route
     *
     * @memberof Router
     * @method reload
     */
    Router.prototype.reload = function() {
        this.process();
    };

    /**
     * Method for binding route to callback
     *
     * @memberof Router
     * @method on
     */
    Router.prototype.createRoute = function(path, options) {
    	if ( this.routes[path] ) {
    		throw 'Route `' + path + '` has already been defined.';
    	}
    	options = options || {};
    	_.defaults(options, {
    		'init': function(fn) {
    			fn();
    		},
    		'load': function() {
    		},
    		'unload': function() {
    		}
    	});
        this.routes[path] = options;
    };

	/**
	 * Fetches the template associated with a route.
	 *
	 * @method getTemplate
	 * @param {String} routeName - The name of the route in question.
	 * @param {Function} callback - Callback function to be fired when the template is ready.
	 */
    Router.prototype.getTemplate = function(routeName, callback) {
    	var route = this.routes[routeName];
    	if ( !route.template ) {
    		callback(false, null);
    	}
    	if ( !_.isFunction(this.template_loader) ) {
    		throw 'No function has been defined for `template_loader`.';
    	}
    	this.template_loader(route.template, function(err, template) {
    		callback(err, template);
    	});
    };

    /**
     * Method for programatically navigating to route
     * @memberof Router
     * @method go
     * @param {string} path - The route to navigate to
     */
    Router.prototype.go = function(path) {
        var location = window.location,
            root = location.pathname.replace(/[^\/]$/, "$&"),
            url,
            self = this;

        // Handle url composition
        if (path.length) {
            // Fragment exists
            url = root + location.search + "#" + path;
        } else {
            // Null/Blank fragment, nav to root
            url = root + location.search;
        }

        if ( history.pushState ) {
            // Browser supports pushState()
            history.pushState(null, document.title, url);
            self.process();
        } else {
            // Older browser fallback
            location.replace(root + url);
            self.process();
        }
    };

    /**
     * @returns the Router contructor
     */
    return Router;

}));
