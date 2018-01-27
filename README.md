# Grub Here

**Authors**: Tiger Hsu, Trevor Dobson, Mitch Hall , and  Ayanle
**Version**: 2.0.0  Started adding files, JSON, 


## Overview
This application allows user to locate nearby resturants using either zipcode search or by Geographic location. The User can then view lists up to 30 resturants in a list view or one resturant at a time in single view. This application has a built in functionality using an API called from Zumato and google maps.

## Getting Started
Vist website at 
https://go-grub.herokuapp.com/

## Architecture
-Zumato API
-Google API
-handlebars 
-Javascript
-Jquery
-JSON
-HTML,CSS
-PSQL and HEROKU

## Change Log
01-15-2018 4:59pm - Application has a server.js file with appropriate folders

01-16-2018 8:59pm - API calls were completed to zumato website to retrieve JSON data.  

01-17-2018 8:59pm - JSON files were filtered in order to retrieve resturant names, and images, appropiate files landing pages were created and page.js is utilized to populate the page with html.

01-18-2018 8:59pm - Competed JSON file filter with approprate view passed in handle bars in order to append to html.

01-20-2018 8:59pm - Major CSS changes were added to accomidate media query and 

01-22-2018 8:59pm - psql was used in order to create a backend database which will hold user names, and passwords.

01-23-2018 8:59pm - Functionality is present on resturant reviews; and 

01-24-2018 8:59pm- functionally is present on Zipcode search;

01-27-2018 8:59pm- Application now has a fully-functional express server, with GET and POST routes for the resturant resource. A working branch is deployed to heroku.

## Credits and Collaborations
Tiger Hsu, Trevor Dobson, Mitch Hall , and Ayanle.
