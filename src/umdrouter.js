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
    var Router = function() {

        var self = this;

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
     * @memberof Router
     * @member {Object}
     */
    Router.prototype.routes = {};

    /**
     * Processes/matches routes and fires callback
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

		self.activeRoute = new UMDRoute(matched.route, matched.args);

    };

    Router.prototype.unloadActiveRoute = function() {
    	if ( !this.activeRoute ) {
    		return;
    	}
    	this.activeRoute.unload();
    	this.activeRoute = null;
    };

    Router.prototype.getArgs = function() {
    };

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
