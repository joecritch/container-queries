/**
 * Track the width of container elements,
 * and apply media-query-like classes to their child modules
 */

var ResponsiveModules = function(options) {
	var _this = this;
	var defaults = { };
	this.config = $.extend(defaults, options);
	this.cacheElements();
	(function fireWatch() {
		_this.watch();
		setTimeout(fireWatch, 500);
	})();
	$(window).resize(function() {
		_this.watch();
	});
};

ResponsiveModules.prototype = {
	watch: function() {
		var _this = this;
		this.$containers.each(function() {
			var $container = $(this);
			var width = $container.width();
			if(width !== $container.data('rm-width')) {
				$container.data('rm-width', width);
				_this.applyQueryClasses($container);
			}

		});
	},
	cacheElements: function() {
		var containers = [ ];
		this.$modules = $('.module');
		this.$modules.each(function() {
			var $module = $(this);
			var cachedModule;
			var $container = $module.parent();
			var modulesAttr = $container.data('rm-modules') || [ ];
			if(!$container.data('rm-modules')) {
				$container.data('rm-modules', []);
			}
			else {
				cachedModule = _.find($container.data('rm-modules'), function(v) {
					return $(v) === $module;
				});
			}
			// @todo -- Test if this needs to use .length property
			if(typeof cachedModule === 'undefined') {
				modulesAttr.push($module);
			}
			$module.data('rm-container', $container);
			$container.data('rm-modules', modulesAttr);
			containers.push($container);
		});
		this.$containers = $(containers);
	},
	applyQueryClasses: function($container) {
		var _this = this;
		var modules = $container.data('rm-modules');
		var width = $container.data('rm-width');
		$.each(modules, function(k, v) {
			var $module = $(v);
			var i;
			var newClasses = [ ];

			// Remove existing classes
			var allClasses = $module.attr('class').split(' ');
			var minClasses = _this.filterClassesBySubString(allClasses, '--min');
			var maxClasses = _this.filterClassesBySubString(allClasses, '--max');
			$module.removeClass(minClasses.concat(maxClasses).join(' '));
			var moduleName = $module.data('rm-name');

			// Apply new classes
			if($module.data('rm-breakpoints')) {
				var breakpoints = $module.data('rm-breakpoints').toString().replace(/ /g,'').split(',');
				for(i = 0; i < breakpoints.length; i++) {
					if(width < breakpoints[i]) {
						newClasses.push(moduleName + '--max-' + breakpoints[i]);
					}
					else if(width >= breakpoints[i]) {
						newClasses.push(moduleName + '--min-' + breakpoints[i]);
					}
				}
				$module.addClass(newClasses.join(' '));
			}
		});

	},
	filterClassesBySubString: function(classArray, substring) {
		return classArray.map(function(item) {
			return item.indexOf(substring) !== -1 ? item : "";
		});
	}
};