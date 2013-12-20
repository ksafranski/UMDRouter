(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else if (typeof exports === "object") {
        module.exports = factory();
    } else {
        root.UMDRouter = factory();
    }
}(this, function () {

    /**
     * Router constructor function
     * @constructor Router
     */
    var UMDRouter = function () {
        var self = this;

        // Watch hashchange
        window.onhashchange = function () {
            self.process();
        };

        // Run on load
        window.onload = function () {
            self.process();
        };
    };

    /**
     * Container object for routes
     * @memberof UMDRouter
     * @member {object}
     */
    UMDRouter.prototype.routes = {};

    /**
     * Container array for history
     * @memberof UMDRouter
     * @member {array}
     */
    UMDRouter.prototype.history = [];

    /**
     * Processes route change
     * @memberof UMDRouter
     * @method process
     */
    UMDRouter.prototype.process = function () {
        var self = this,
            fragment = window.location.hash.replace("#", ""),
            match = self.match(),
            route = match.route,
            args = match.args,
            before = true,
            prevRoute = false,
            routeObj = [];

        // Get prev_route
        if (self.history.length !== 0) {
            prevRoute = self.routes[self.history[self.history.length-1].matcher];
        }

        // Ensure a match has been made
        if (route) {
            routeObj = self.routes[route];

            // Get current route and unload
            if (prevRoute && prevRoute.unload) {
                prevRoute.unload.apply(this);
            }

            // Check and run 'before'
            if (routeObj.before) {
                before = routeObj.before.apply(this, args);
                if (before === undefined) {
                    before = true;
                }
            }

            // If before returned false, go back
            if (!before) {
                self.go(self.history[self.history.length-1].fragment);
            }

            // Check and run 'load' if fn exists and before has passed
            if (routeObj.load && before) {
                routeObj.load.apply(this, args);
                self.history.push({ matcher: route, fragment: fragment });
            }
        }

    };

    /**
     * Matches routes and fires callback
     * @memberof UMDRouter
     * @method match
     */
    UMDRouter.prototype.match = function () {
        var self = this,
            fragment = window.location.hash.replace("#", ""),
            matcher,
            route,
            args = [],
            matched = false,
            i,
            z;

        // Match root
        if (fragment === "/" || fragment === "" && self.routes.hasOwnProperty("/")) {
            matched = "/";
        } else {
            // Match routes
            for (route in self.routes) {
                matcher = fragment.match(new RegExp(route.replace(/:[^\s/]+/g, "([\\w-]+)")));
                if (matcher !== null && route !== "/") {
                    args = [];
                    // Get args
                    if (matcher.length > 1) {
                        for (i = 1, z = matcher.length; i < z; i++) {
                            args.push(matcher[i]);
                        }
                    }
                    matched = { route: route, args: args};
                }
            }
        }

        // Return matched and arguments
        return matched;

    };

    /**
     * Method to reload (refresh) the route
     * @memberof UMDRouter
     * @method reload
     */
    UMDRouter.prototype.reload = function () {
        this.process();
    };

    /**
     * Method for binding route to callback
     * @memberof UMDRouter
     * @method on
     * @param {string} route - The route to match against
     * @param {function|object} handler - The callback function or functions (object)
     */
    UMDRouter.prototype.on = function (route, handler) {
        this.routes[route] = {};
        // Build function(s) into route object
        if (handler && typeof handler === "function") {
            // Just passed a single load function
            this.routes[route].before = false;
            this.routes[route].load = handler;
            this.routes[route].unload = false;
        } else if (handler && typeof handler === "object") {
            // Passed an object
            this.routes[route].before = (handler.before) ? handler.before : false;
            this.routes[route].load = (handler.load) ? handler.load : false;
            this.routes[route].unload = (handler.unload) ? handler.unload : false;
        } else {
            throw "Error creating route";
        }
    };

    /**
     * Method for programatically navigating to route
     * @memberof UMDRouter
     * @method go
     * @param {string} path - The route to navigate to
     */
    UMDRouter.prototype.go = function (path) {
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

        if (history.pushState) {
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
     * @returns the UMDRouter contructor
     */
    return UMDRouter;

}));