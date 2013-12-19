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
     * @member {Object}
     */
    UMDRouter.prototype.routes = {};

    /**
     * Processes/matches routes and fires callback
     * @memberof UMDRouter
     * @method process
     */
    UMDRouter.prototype.process = function () {
        var self = this,
            fragment = window.location.hash.replace("#", ""),
            matcher,
            route,
            args = [],
            matched,
            i,
            z;

        // Match root
        if (fragment === "/" || fragment === "" && self.routes.hasOwnProperty("/")) {
            self.routes["/"].apply(this);
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
                    matched = route;
                }
            }
            if (self.routes.hasOwnProperty(matched)) {
                self.routes[matched].apply(this, args);
            }
        }

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
     */
    UMDRouter.prototype.on = function (path, cb) {
        this.routes[path] = cb;
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