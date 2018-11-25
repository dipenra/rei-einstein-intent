# rei-einstein-intent
Testing SalesForce Einstein on REI Search

This is a demo project to show how a website's SEARCH feature can take advantage of Eintein Intent and make educated decision to route users to the right resources.

# Demo
https://rei-einstein-intent.herokuapp.com/

# Getting Started
## Requirements
	- git
	- NPM

## git

Intall git from: https://git-scm.com/downloads

OR

Install git through Homebrew:

`$brew install git`


## NPM

Intall NPM from: https://www.npmjs.com/get-npm


## Install & Starting the Project

`$npm install`

`$grunt build`

`$npm start`


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
	- /data : data used to train Einstein
	- /lib : contains custom middleware libraries for the project
	- /public : contains publicly accessable files 
		/public/dist : created using grunt task. contains minified js & css files for production env
	- /routes : contains files that handles the website routes
	- /views : contains the view templates


## Configuration For Testing
Since this project is publicly aviable this project does not contain the `private key` nor the functions to create the `token` to access the Einstein Intent API.

If the `token` has experied, please email me for a new one OR one can use their their own account and train Einstein Intent using the data found in `data` directory. And update the `token` and `modelId` variables located in `/lib/einsteinIntent.js`, with their own data.

## Steps of Training Einstein
1) Create Developer's Account @ https://developer.salesforce.com/einstein
2) Make sure you save the `Private Key` once you create the account
3) Use your `Private Key` & `Email` to create `Token` @ https://api.einstein.ai/token
4) Upload the data to Einstein Server. `datasetId` will returned on a successful upload
	- curl -X POST -H "Authorization: Bearer <TOKEN>" -H "Cache-Control: no-cache" -H "Content-Type: multipart/form-data" -F "data=PATH_TO\data\training-data.csv" -F "type=text-intent"   https://api.einstein.ai/v2/language/datasets/upload
5) Train the dataset. On a successful submission you will get a `modelId`
	- curl -X POST -H "Authorization: Bearer <TOKEN>" -H "Cache-Control: no-cache" -H "Content-Type: multipart/form-data" -F "name=Weather Intent Model" -F "datasetId=YOUR-DATASET-ID" https://api.einstein.ai/v2/language/train
6) Update config in `/lib/einsteinIntent.js` with your `token` and `modelId`

## More on Einstein API
 API details can be found @ https://metamind.readme.io/docs/
