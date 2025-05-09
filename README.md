# Department Sections Scheduler App

## Designed for Mrs. Oskroba and the great venture of schedule-making
*There are many schedules that can be generated from a data set*

*There are few working schedules that can be made, even less under the special CTE restrictions*

*There are a tiny amount of preferable "good" schedules*

## Project Overview: ✅
Hi! This is the CTE Department Sections Scheduling App. Basically, this is a web app / algorithm that generates a schedule based on three categories of objects. On the surface, a schedule is made up of three things: Teachers, Courses, and Classrooms. What our program currently does is it takes these three object types, and uses their conditions to create a schedule that correctly organizes these categories. There are a couple more constraints that go into making the schedule (ex: some classes need to be during certain periods, some classes need to be in certain classrooms, specific teachers teaching classes and every teacher needing a lunch and planning period). Along with that there are preferences that could be accounted for however they are less important, Preferences include which period they want for lunch and which period they want for planning. Our goal is to take all of these things into consideration and make a valid schedule without conflicts.


## Platform Requirements: ✅
NodeJS and other device tools that were used in the making of this project can be found in the [2023-2024 Software Engineering Toolchain Setup](https://docs.google.com/document/d/1wvdn-MVotuBM6wehNdPpbbOFMzmKLPxFzErH8-mkP1s/edit?usp=sharing)
Our current build of the CTE Department Sections Scheduler runs primarily off of NodeJS on VS Code. 


## How to run our project: ✅
There are a couple of ways to run our project, based on what you want to do. 

After running the node client, you will land on the view page of the website. 
To generate a schedule, you simply click the "generate schedule" button, and in mere milliseconds, a schedule is generated. You have the option to either download as a CSV or JSON file

To change data, navigate your way to the edit page. The edit page is split into 3 sections: teachers, courses, and classrooms. To edit the data, find the correct column to edit data from, then make the changes you would like. 

The view page and generate schedule button doesn't immediately reflect these changes. Instead, go to the section you made changes to, then click the download button. Once done, go back to the view page and upload the file you just downloaded. Clicking “generate schedule” will now reflect your changes.  `

As of right now, the only way to save edit page data is to download it, as reloading will unfortunately not save your data. 

There is a dedicated page called the help page to give you visual guidance on how to use the website :)


### Schedules: ✅
The schedules are a 2D array of rooms and periods in the view page of the website. Each "cell" contains the information contained in a "section", which includes the room, period, teacher, and course. You can delete and add cells manually as needed, and the schedule features a nice, interactable UI. The schedule data can then be downloaded as a CSV or JSON file. 


## Valid Schedule generation: 
The first part of the algorithm makes teacher/course and classroom/period groups. Once this is done, the algorithm will begin a type of tree search as it pairs these groups with each other. For example, the group callaghan/CP2 could be paired up with Room 123/Period 3. If the scheduler runs into some error where a match is invalid, it will try a few other possibilities. If these changes dont fix it either, it'll throw the whole schedule out and start from scratch.


## Scheduling algorithm 
Essentially the algorithm is a combination of brute force and a greedy algorithm. Greedy algorithm meaning that it chooses the best possible option at the time without any regard for future consequences. However if it ends up going down a path where a schedule cannot be made then it backtracks and makes a new decision. The entirety of the algorithm is in the Scheduler.js file.


#### **For Schedule Generation:**  
Router gets a "get" request from the schedule generation page. Once this request is called, the client awaits a response from the server. Router then calls on Scheduler.js to create a valid schedule, which is then returned in string and json format. There are also methods to download as csv and json, in which the json data is transcribed to a file and sent to the client. All JSON files are currently stored server-side instead of a database, which isn't the most optimal if we want to store all the schedules generated so far. Should server-side long-term storage be implemented, it would be wise to move over to MongoDB at some point.


## Current Architecture
The current flow of our program is mostly handled by the router.js file on the server. What this file does is it manages requests from the client side website and then uses these requests to send JSON files to the website to display all of the data, such as classrooms teachers and courses, or data that gets generated on the server side, like schedules, that then get sent over to be displayed/downloaded. The router also handles incoming JSON information, like changes to data made from the website on certain pieces of data.


#### **For File Changes:**  
Router gets a "get" request from the website, based on what page is being loaded. Router then sends the necessary JSON over to the client, where it is formatted using client side js. After the data is edited client side, Router gets a "post" request in which it receives formatted JSON from the client, which then overrides the current stored JSON.


## All Known Issues:
- Changes made in the edit page do not save when moving between pages
    Either add client-side temporary saving or a prompt for the user to save when they navigate away

- Preferences
    The preferences page is currently blank. It’s not populated with teachers and doesn't have a first/second semester button.
    Also it isn’t taken into consideration when making the schedule; however this would assumably be a easy fix by biasing the greedy algorithm to choose preferences when it is making random decisions

- 2 semester system
    Currently, we were unable to get the view page to work with 2 semesters both showing at the same time
    However, you can go to the edit page, select semester 2, and then download that file to put into the view page. This will allow you to make a schedule for the second semester.

- No automatic checking for the schedule
    Our product owner wanted a way to check to see if the schedule met all the requirements which we did not have time for. Although all generated schedules shouldn’t have conflicts, manual editing can produce errors that could be easily overlooked.
