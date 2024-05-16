# Department Sections Scheduler App

## Designed for Mrs. Oskroba and the great venture of schedule-making
*There are many a schedule that can be generated from a data set*

*There are not so many working schedules that can be made, even fewer under the special CTE restrictions*

*There are just a few preferable "good" schedules*

## Project Overview:
Hi! This is the CTE Department Sections Scheduling App. Basically, this is a web app / algorithm that *tries* to generate a schedule based on three categories of objects. Basically, on the surface, a schedule is made up of three things: Teachers, Courses, and Classrooms. Basically, what our program currently does is it takes these three object types, and uses their conditions to try and craft a schedule that meets all of these categories. There are a couple more criteria that are involved in the scheduling process that aren't listed within the scheduler but are performed passively, such as teachers needing an open period for lunch.


## Platform Requirements:
NodeJS and other device tools that were used in the making of this project can be found in the [2023-2024 Software Engineering Toolchain Setup](https://docs.google.com/document/d/1wvdn-MVotuBM6wehNdPpbbOFMzmKLPxFzErH8-mkP1s/edit?usp=sharing)
Our current build of the CTE Department Sections Scheduler runs primarily off of NodeJS on VS Code. 


## How to run our project:
There are a couple of ways to run our project, based on what you want to do. 

To generate schedules, you can add in the writeSchedules method in Scheduler.js, in which the first parameter is how many schedules you want to generate, and the second one is whether or not they get printed into console. 

To use the website, go to the vs code debugger and begin the node server. after this, start the node client. You should get sent to the schedule generator page, in which you can generate schedules. if you have bad data, the website will tell you so. Otherwise, you should get a monospaced string schedule, and the ability to download a csv file. 

The other pages on the website should let you edit the data and save changes. These changes should appear when the page gets reloaded, and should also be reflected in the server side json.

## Valid Schedule / Scheduler.js:

The first part of thre algorithim still uses course priority to randomly assign sections into period classes based on their restricitons. Once this is done, the algorithim inserts teacher into a random set of sections based on the section they are supposed to teach. this means if there are 3 sections of ECE, and this teacher teaches two of them, they get two random sections of the 3 ECE periods to teach. If the schedule runs into some errer (can't fit a teacher into this section without them not getting lunch) it'll throw the whole schedule out and start from scratch.

The swap method is created due to a bug/oversight in our code that ended up putting a teacher into a single period multiple times. In theory, it has a really easy fix, but when you implemented that fix, the amount of failures per schedule cycle skyrockets. It ended up taking ~10 min to generate one schedule, which is horrendous. So instead, I decided to have the algorithm take a look at the faulty schedules we got, and just swap teachers around to see if they’d work. This actually ended up working a lot better, giving us an average cycle time of 11 seconds, and generating a valid schedule with all conditions met. If you would like, you can simply add in an extra condition into the alogrithim and get rid of the sweappage method entirely. This will increace your runtime, but will ensure non scuffed code.

## Current Architecture
The current flow of our program is mostly handled by the router.js file on the server. What this file does is it manages requests from the client side website and then uses these requests to send JSON files to the website to display all of the data, such as classrooms teachers and courses, or data that gets generated on the server side, like schedules, that then get sent over to be displayed/downloaded. The router also handles incoming JSON information, like changes to data made from the website on certain pieces of data.

#### **For File Changes:**  
Router gets a "get" request from the website, based on what page is being loaded. Router then sends the necessary JSON over to the client, where it is formatted using client side js. after the data is edited client side, Router gets a "post" request in which it receives formatted JSON from the client, which then overrides the current stored JSON.

#### **For Schedule Generation:**  
Router gets a "get" request from the schedule generation page. Once this request is called, the client awaits a response from the server. Router then calls on Scheduler.js to create a valid schedule, which is then returned in string and csv format using the "printInCoolWay" and "csvEncode" methods. Router then encodes csv into a URI and sends this information over to the client, who now gets the data it waited for and is able to display it on the page as a monospaced string and downloadable as a csv. All JSON files are currently stored server-side, and not in a database, which isn't the most optimal and should be moved over to MongoDB at some point.


## Schema Setup:
### JSON:
**JSON skeleton for a course:**

| {  
|   "name": [String]  
|   "sections": [Number]  
|   "compatibleClassrooms": [StringArray]  
|   "compatiblePeriods": [NumberArray]  
|   "schedulingPriority": [Number]  
| }  

**JSON skeleton for a teacher:**

| {  
|   "name": [String]  
|   "coursesAssigned": [  
|     { "course": [String], "sections": [Number] },  
|     ...  
|   ]  
|   "sectionsTaught": [Number]  
|   "openPeriods": [NumberArray]  
| }  

**JSON skeleton for a classroom:**

| {  
|   "roomNum": [String]  
|   "periodsAvailable": [NumberArray]  
| }  


### MongoDB:
There exist a couple of blank and unused schemas for Mongo, but we never really used them and they're probably no longer up to date. rather than saving the data types individually, you should probably save an entire set of data so you can switch departments easily.

### Schedules: 
The schedules are a 2D array of rooms and periods. Each "cell" contains the information contained in a "section", which includes the room, period, teacher, and course. This data then gets stored into a json file.


## Genetic Algorithm
So basically we anticipated doing valid schedule very quickly, however it took really long so I had to work on genetic algorithm by myself which mostly consisted of a lot of whiteboard thinking and writing, but basically we figured out that using IDs for crossover instead of duplicate sections made scheduling a lot easier. By the time you are reading this, crossover and scoring should be done (probably maybe) so work on mutations and the actual population management function (killing the bottom 50) and reproduction selection, and you should be good.


## All Known Issues:
 - So the website's and data's way of knowing what is encapsulated in what (ex. which rooms can be picked for a course) is currently dependent on the names of these objects. this is bad, Because it causes some issues along the line with not being able to hire teachers with the same name, and some other stuff. Something this affects is, if you edit the name of a course through the website, it will not change the names of the course that the teacher teaches, which can lead to a ton of errors down the line. there's current a fix for courses and classrooms, in which the classrooms changed will also change for the courses, but this can all be solved by instead using an id system to identify all the data structures. 

- Valid schedule is so scuffed, but it works. There is no bridge currently between valid schedule and the genetic algorithm, and that needs to be fixed. 

- The filters on the dataView page do not work. The classrooms one works mostly, but it doesn't space everything out right.

- The "hidden" class in the css files doesn't really work. It does some weird formatting errors with Pico (I think).





## Good Luck and Commencement by Saul Goodman and George
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣤⠴⠒⠒⠛⠛⠓⠚⣻⣿⣗⣦⣤  
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡠⠊⣩⣴⣶⣶⣶⣶⣶⣶⣶⣿⣿⣿⣷⣌⡙⠢⡀⠀  
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠞⣰⣾⣿⠟⠉⠉⠉⠉⠙⠟⣿⣿⣿⣿⣿⣿⡟⢦⠹⣦  
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⢋⣴⣿⣿⠁⠀⠀⠀⠀⠀⠀⠀⠈⠋⢿⣿⣿⣿⡃⠀⡀⠙⡇  
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⢏⣼⣿⣿⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣿⣿⣧⠀⢻⣆⣇  
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⡏⣼⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⣄⠀⣶⠈⢻⣿⡄⠸⡟⢻⡆  
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⠙⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣿⡆⢸⣿⡇⠀⡁⠈⡟  
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣿⣿⣿⣿⠀⠀⣀⡀⠀⠀⠀⠀⠃⠀⠀⠀⠘⠙⢃⣾⣿⠃⠀⡇⠀⡇  
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣟⣿⣿⡇⢠⡾⢻⡿⠿⢷⣦⣤⠁⣷⣄⣤⣾⠿⠿⢿⣿⣄⠀⣯⣀⡇  
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⠃⠈⠡⠾⣿⣿⣿⡿⠁⠀⣼⣿⣿⡿⠛⢶⣿⣿⣿⠀⠹⢿⡇  
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⡇⠀⠀⠀⠀⠈⡹⠏⠀⠀⢻⣿⣿⣷⠀⠀⠙⠻⣿⡇⣠⡼⣟  
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⣿⣿⣿⣿⠀⠀⠀⠀⠈⠀⠀⠀⠀⣸⣿⣿⣿⣧⠀⠀⠀⣿⠀⢿⡻⢿⡇  
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⠀⠀⣼⣿⠀⠀⣿⠟⠁  
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢻⡿⡄⠀⠀⠀⠀⠀⠀⠉⢳⣶⣿⣿⣿⣯⡀⢸⣧⣼⡀⠀⣿  
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⢀⠀⠀⠀⡀⠀⠀⠀⢸⡅⢘⣟⣽⣿⣿⣿⣿⣿⠤⣼⠃  
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⣮⡀⡀⠀⠙⠛⠛⠛⠛⠿⠻⣿⣿⣿⣿⣻⣧⡿⢿⡏  
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣷⠀⠀⠀⠀⠀⠐⠛⠃⠀⠛⣿⣿⣿⣿⣿⣷⣿⡄  
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣬⣿⣿⣷⣴⣦⠀⠀⠀⠀⣀⡀⣴⣿⣿⣿⣿⣿⣿⢸⣟⢢⣤⣄⡀  
⠀⠀⠀⠀⠀⢀⣠⣤⣴⣶⣶⣿⣿⣿⣿⣿⣿⠻⣿⡷⢷⣦⠴⡾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣸⣿⠀⢲⣾⡿⠦⣀⣀  
⢀⣠⣴⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠈⠛⢦⣀⠀⠐⠛⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣼⣿⣿⣷⣶⣾⣯⣄  
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀⠀⠀⠀⠉⠳⣦⣀⣀⣾⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣤⡀    
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀⠀⠀⠀⠀⣨⡿⢟⣵⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷  
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⠀⠀⢀⣼⣿⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿  
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣇⣴⣿⣿⢿⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿  
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿  

![Depiction of George](assets/img/George/george.png)
