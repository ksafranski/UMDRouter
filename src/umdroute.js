(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['underscore', 'postal'], factory);
    } else {
        root.Router = factory(root._, root.postal);
    }
}(this, function(_, postal) {

	var UMDRoute = function(options) {

		var self = this;

		options.route = _.clone(options.route);

		if ( _.isObject(options.route.extend) ) {
			_.extend(this, options.route.extend);
			delete options.route.extend;
		}

		var interval_ids = [];
		var postal_subscriptions = [];

		_.extend(this, options.global_extensions, options.route, {
			'container': options.container,
			'setInterval': function(fn, timeout) {
				interval_ids.push(setInterval(fn, timeout));
			},
			'subscribe': function(options) {
				postal_subscriptions.push(postal.subscribe(options));
			},
			'_unload': function() {
				_.each(interval_ids, function(iid) {
					clearInterval(iid);
				});
				_.each(postal_subscriptions, function(psub) {
					psub.unsubscribe();
				});
				self.unload();
			}
		});

		options.args.unshift(function() {
			self.load();
		});

		this.init.apply(this, options.args);

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
