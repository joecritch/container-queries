# Container Queries

This library will toggle DOM classes on modules based on their container's breakpointed widths. In theory, this should replace a workflow of using CSS media queries, which can only currently query the overall viewport dimensions, and focus on providing breakpoints for every one of your 'module' instances.

**N.B. I do not recommend using this on a production site. Mainly because I haven't yet. Treat this as a proof-of-concept, and please contribute where you can.**
```html
<div class="your-module-name" data-rm-name="your-module-name" data-rm-breakpoints="300,600,800">

</div>
```
```css
.your-module-name--max-width-300 {
  /* styling for a narrow module */
}
.your-module-name--min-width-800 {
 /* styling for a wide module */
}
```

## Getting Started

### 1. Obtain files

**via Twitter Bower**
`bower install container-queries`

**or manually**
This project has the following dependencies:
+ jQuery (1.8+)
+ Underscore

### 2. Reference files

```html
	<script src="/components/jquery/jquery.js"></script>
	<script src="/components/underscore/underscore.js"></script>
	<script src="/components/container-queries/dist/container-queries.js"></script>
```
### 3. Instantiate library

Place this inside of your boot JavaScript file

```javascript
	var cq = new ContainerQueries();
```

### 4. Insert data attributes

A lot of the control is declared through HTML data attributes. There are **two required attributes** for every module.

`data-rm-name="your-module-name" data-rm-breakpoints="300,600,800"`

**Module name**

`data-rm-name` can be repeated as many times as you need: it's just used as a way to explicitly reference the name of the main module used on that element.

**Breakpoints**

`data-rm-breakpoints` is a comma-separated list of breakpoints. These are used for producing the relevant classes on the elements (*not* their containers).

For example, if you had breakpoints of '300,600,800', and a module (whose main class was `.nav`) had parent element that was currently at a width of 500 pixels, then the classes that would be applied are `.nav--min-width-300`, `.nav--max-width-600`, and `.nav--max-width-800`. These are essentially queries that are 'true'.

**Note**: To avoid min & max queries becoming true at the same time, the 'max' query will only be true for 1 pixel less than the query itself.

## Demo

You can view a demo of this by visiting the project's page, or by cloning the `gh-pages` branch.

## API

### Methods

There are currently no useful methods to interact with. But the library is structured as a simple prototypal object, so all methods can be accessed if required.

### Configuration

Here is the default configuration.

```javascript
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
```

... you can pass in your own configuration when instantiating the library.

```javascript
	var cq = new ContainerQueries({
		selectors: {
			modules: '.iLoveCamels'
		}
	}
	});
```

## Todos

I'm looking for people to help out on this project. I don't have a huge amount of time for open-source work, and as stated at the top, this is more of a proof-of-concept at the minute, rather than a library I would recommend using on a production site.

So, please get involved, and let me know if you'd like to become a regular contributor.

+ Add support for height queries
+ Add support for 'em'-based queries
+ Investigate and improved 'tick' performance
+ Make containers actually *aware* of what their modules width hypothetically would be (to allow for 'magic queries')

