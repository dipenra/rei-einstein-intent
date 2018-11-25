# rei-einstein-intent
Testing SalesForce Einstein on REI Search

This is a demo project to show how a website's SEARCH feature can take advantage of Eintein Intent and make educated decision to route users to the right resources.

# Getting Started
## Requirements
- git
- NPM

##git
Intall git from

https://git-scm.com/downloads

OR
Install git through Homebrew:

brew install git
https://git-scm.com/downloads

##NPM
Intall NPM from

https://www.npmjs.com/get-npm

##Install & Starting the Project

`npm install`

`grunt` (`grunt build`)

`npm start`


## Technologies Used
- GitHub: Project Repository
- NPM: Used to package the project
	- ExpressJS: Web Framework
	- Request: to make http calls
	- Joi: validator for JavaScript objects
- Grunt: JavaScript Task Runner
	- grunt-contrib-jshint: detect errors and potential problems in your JavaScript code
	- grunt-contrib-sass: compile SASS files to css
	- grunt-contrib-cssmin: minify css files
	- grunt-contrib-uglify: minify js files
	- grunt-contrib-watch: run predefined tasks whenever watched file patterns are added, changed or deleted

## File Structure

- / : root directory. contains most of the config files
	- /bin : contains startup scripts
	- /lib : contains custom middleware libraries for the project
	- /public : contains publicly accessable files 
		/public/dist : created using grunt task. contains minified js & css files for production env
	- /routes : contains files that handles the website routes
	- /views : contains the view templates