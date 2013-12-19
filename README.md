# UMD Router

A simple to use router that places nicely with AMD when you need it to.

	var router = new Router();

	router.createRoute('name', {
		'init': function(fn, arg1, arg2) {
			console.log('init');
			fn();
		},
		'load': function() {
			console.log('load');
		},
		'unload': function() {
			console.log('unload');
		}
	});
