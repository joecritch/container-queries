/**
 * Track the width of container elements,
 * and apply media-query-like classes to their child modules
 */

var ContainerQueries = function(options) {
	var _this = this;
	var defaults = {
		interval: 500, // This should be 'often enough' to avoid significant layout breakages
		selectors: {
			modules: '.module' // A global class that we apply to all concerned elements
		},
		suffixes: {
			maxWidth: '--max-width-', // Will output as e.g. '.module--max-width-300'
			minWidth: '--min-width-' // Will output as e.g. '.module--min-width-300'
		},
		dataAttrs: {
			name: 'rm-name',
			modules: 'rm-modules',
			container: 'rm-container',
			breakpoints: 'rm-breakpoints',
			widthCache: 'rm-width'
		}
	};

	this.config = $.extend({}, defaults, options);

	// Cache any elements that are on the page when the DOM is ready.
	this.cacheElements();

	// Poll for changes 'often enough'
	(function fireWatch() {
		_this.watch();
		setTimeout(fireWatch, _this.config.interval);
	})();

	// Fire straight away when resizing.
	$(window).resize(_.bind(this.watch, this));
};

ContainerQueries.prototype = {

	/**
	 * Calculate the width of all cached containers
	 * and apply query classes if a width has changed.
	 */
	watch: function() {
		var _this = this;
		var $containersForWidth;

		// Sort the containers, making sure outer containers are handled first.
		// so that we don't miss anything if the width of a child module should be affected by the width of a parent module.
		$containersForWidth = $(_.sortBy(this.$containers, function(v, k) {
			return $(v).parents(_this.config.selectors.modules).length;
		}));

		$containersForWidth.each(function() {
			var $container = $(this);
			var width = $container.width();
			if(width !== $container.data(_this.config.dataAttrs.widthCache)) {
				$container.data(_this.config.dataAttrs.widthCache, width);
				_this.applyQueryClasses($container);
			}
		});
	},

	/**
	 * Cache all modules and their respective parents.
	 */
	cacheElements: function() {
		var _this = this;
		var containers = [ ];
		this.$modules = $(_this.config.selectors.modules);
		this.$modules.each(function() {
			var $module = $(this);
			var cachedModule;
			var $container = $module.parent();
			var modulesAttr = $container.data(_this.config.dataAttrs.modules) || [ ];
			if(!$container.data(_this.config.dataAttrs.modules)) {
				$container.data(_this.config.dataAttrs.modules, []);
			}
			else {
				cachedModule = _.find($container.data(_this.config.dataAttrs.modules), function(v) {
					return $(v) === $module;
				});
			}
			if(typeof cachedModule === 'undefined') {
				modulesAttr.push($module);
			}
			$module.data(_this.config.dataAttrs.modules, $container);
			$container.data(_this.config.dataAttrs.modules, modulesAttr);
			containers.push($container);
		});
		this.$containers = $(containers);
	},

	/**
	 * Remove any existing string-matching classes
	 * and apply new ones based on any current breakpoints.
	 */
	applyQueryClasses: function($container) {
		var _this = this;
		var modules = $container.data(_this.config.dataAttrs.modules);
		var width = $container.data(_this.config.dataAttrs.widthCache);
		$.each(modules, function(k, v) {
			var $module = $(v);
			var i;
			var newClasses = [ ];

			// Remove existing classes
			var allClasses = $module.attr('class').split(' ');
			var minClasses = _this.filterClassesBySubString(allClasses, _this.config.suffixes.minWidth);
			var maxClasses = _this.filterClassesBySubString(allClasses, _this.config.suffixes.maxWidth);
			$module.removeClass(minClasses.concat(maxClasses).join(' '));
			var moduleName = $module.data('rm-name');

			// Apply new classes
			if($module.data(_this.config.dataAttrs.breakpoints)) {
				var breakpoints = $module.data(_this.config.dataAttrs.breakpoints).toString().replace(/ /g,'').split(',');
				for(i = 0; i < breakpoints.length; i++) {
					if(width < breakpoints[i]) {
						newClasses.push(moduleName + _this.config.suffixes.maxWidth + breakpoints[i]);
					}
					else if(width >= breakpoints[i]) {
						newClasses.push(moduleName + _this.config.suffixes.minWidth + breakpoints[i]);
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

