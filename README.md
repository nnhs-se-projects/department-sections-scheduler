# Department Sections Scheduler App

## Designed for Mrs. Oskroba and the great venture of schedule-making
*There are many a schedule that can be generated from a data set*
*There are not so many working schedules that can be made, along with the special CTE restrictions*
*There are just a few preferable "good" schedules*

## Project Overview:
Hi! This is the CTE Department Sections Scheduling App. Basically, this is a web app / algorithm that *tries* to generate a schedule based on three categories of objects. Basically, on the surface, a schedule is made up of three things: Teachers, Courses, and Classrooms. Basically, what our program currently does is it takes these three object types, and uses their conditions to try and craft a schedule that meets all of these categories. There are a couple more criteria that are involved in the scheduling process that aren't listed within the scheduler but are performed passively, such as teacher's needing an open period for lunch








## Schema Setup:

**JSON skeleton for a course:**
{
  "name": [String]
  "sections": [Number]
  "compatibleClassrooms": Array of String
  "compatiblePeriods": Arr
  "schedulingPriority": 
}

**JSON skeleton for a teacher:**
{
  "name": [String]
  "coursesAssigned": [
    { "course": [String], "sections": [Number] },
    ...
  ]
  "sectionsTaught": [Number]
  "openPeriods": Number Array
}




### Genetic Algorithm
so basically we anticipated doing valid schedule very quickly, however it took really long
so I had to work on ge
toglA cite




## Good Luck
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣤⠴⠒⠒⠛⠛⠓⠚⣻⣿⣗⣦⣤⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡠⠊⣩⣴⣶⣶⣶⣶⣶⣶⣶⣿⣿⣿⣷⣌⡙⠢⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠞⣰⣾⣿⠟⠉⠉⠉⠉⠙⠟⣿⣿⣿⣿⣿⣿⡟⢦⠹⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⢋⣴⣿⣿⠁⠀⠀⠀⠀⠀⠀⠀⠈⠋⢿⣿⣿⣿⡃⠀⡀⠙⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⢏⣼⣿⣿⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣿⣿⣧⠀⢻⣆⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⡏⣼⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⣄⠀⣶⠈⢻⣿⡄⠸⡟⢻⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⠙⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣿⡆⢸⣿⡇⠀⡁⠈⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣿⣿⣿⣿⠀⠀⣀⡀⠀⠀⠀⠀⠃⠀⠀⠀⠘⠙⢃⣾⣿⠃⠀⡇⠀⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣟⣿⣿⡇⢠⡾⢻⡿⠿⢷⣦⣤⠁⣷⣄⣤⣾⠿⠿⢿⣿⣄⠀⣯⣀⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⠃⠈⠡⠾⣿⣿⣿⡿⠁⠀⣼⣿⣿⡿⠛⢶⣿⣿⣿⠀⠹⢿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⣿⣿⣿⡇⠀⠀⠀⠀⠈⡹⠏⠀⠀⢻⣿⣿⣷⠀⠀⠙⠻⣿⡇⣠⡼⣟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⣿⣿⣿⣿⠀⠀⠀⠀⠈⠀⠀⠀⠀⣸⣿⣿⣿⣧⠀⠀⠀⣿⠀⢿⡻⢿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⠀⠀⣼⣿⠀⠀⣿⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢻⡿⡄⠀⠀⠀⠀⠀⠀⠉⢳⣶⣿⣿⣿⣯⡀⢸⣧⣼⡀⠀⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⢀⠀⠀⠀⡀⠀⠀⠀⢸⡅⢘⣟⣽⣿⣿⣿⣿⣿⠤⣼⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⣮⡀⡀⠀⠙⠛⠛⠛⠛⠿⠻⣿⣿⣿⣿⣻⣧⡿⢿⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣷⠀⠀⠀⠀⠀⠐⠛⠃⠀⠛⣿⣿⣿⣿⣿⣷⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣬⣿⣿⣷⣴⣦⠀⠀⠀⠀⣀⡀⣴⣿⣿⣿⣿⣿⣿⢸⣟⢢⣤⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢀⣠⣤⣴⣶⣶⣿⣿⣿⣿⣿⣿⠻⣿⡷⢷⣦⠴⡾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣸⣿⠀⢲⣾⡿⠦⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀
⢀⣠⣴⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠈⠛⢦⣀⠀⠐⠛⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣼⣿⣿⣷⣶⣾⣯⣄⠀⠀⠀⠀⠀⠀
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀⠀⠀⠀⠉⠳⣦⣀⣀⣾⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣤⡀⠀⠀
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀⠀⠀⠀⠀⣨⡿⢟⣵⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⠀⠀⢀⣼⣿⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣇⣴⣿⣿⢿⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿