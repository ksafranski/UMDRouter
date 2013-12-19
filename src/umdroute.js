(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['require', 'underscore'], factory);
    } else {
        root.Router = factory(root.b);
    }
}(this, function(require, _) {

	var UMDRoute = function(options, args) {

		var self = this;

		options = options || {};
		_.extend(this, options);

		args.unshift(function() {
			self.load();
		});

		this.init.apply(this, args);

	};

	_.extend(UMDRoute.prototype, {

		/**
		 * Called just before the route is loaded.
		 *
		 * @method init
		 * @override
		 * @param {Function} fn - A callback function to invoke once any initial setup is complete.
		 * @param {Mixed} [arguments...] - If parameters are included in the request, they will be passed inline here.
		 */
		'init': function(fn) {
		},

		/**
		 * Called once the route has been loaded.
		 *
		 * @method load
		 */
		'load': function() {
		},

		/**
		 * Called when the user leaves the route.
		 *
		 * @method unload
		 */
		'unload': function() {
		}

	});

	return UMDRoute;

}));
