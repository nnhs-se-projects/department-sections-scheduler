function elementReady(sel) {
    return new Promise((resolve, reject) => {
        const el = document.querySelector(sel);
        if (el) {
            resolve(Array.from(document.querySelectorAll(sel)));
        }

        new MutationObserver((mutationRecords, observer) => {
            Array.from(document.querySelectorAll(sel)).forEach(element => {
            resolve(Array.from(document.querySelectorAll(sel)));
            observer.disconnect();
            });
        })
        .observe(document.documentElement, {
            childList: true,
            subtree: true
    });
    });
}
var palettes = [
    [[272,100,15],[282,100,23],[11,100,39],[18,100,47]], //original
    [[227,72,10],[241,53,22],[231,27,45],[242,30,66]], //dark blue
    [[222,80,15],[232,60,27],[7,80,40],[18,80,50]],
    [[303,77,22],[340,82,47],[23,100,46],[37,80,60]],
    [[247,36,15],[286,56,21],[352,59,47],[8,68,64]],
    [[225,66,10],[342,59,33],[352,59,47],[8,68,64]],
    [[216,18.1,16],[217,10.2,25],[183,80,40],[181,22,53]],
    [[237,89.7,11],[282,84.4,18],[319,93.2,23],[319,87.1,30]],
    [[102,12.7,31],[103,11.6,42],[116,14.9,62],[108,16.3,70]],
    [[343,76.9,29],[358,60.6,55],[22,89.4,48],[40,94.9,61]],
]
var r = document.querySelector(':root');
function setColors(index){
    var varNames = [["--dark","1"],["--dark","2"],["--light","1"],["--light","2"]]
    for(let i=0;i<4;i++){
        r.style.setProperty(varNames[i][0]+"-hue-"+varNames[i][1], palettes[index][i][0]+"");
        r.style.setProperty(varNames[i][0]+"-sat-"+varNames[i][1], palettes[index][i][1]+"%");
        r.style.setProperty(varNames[i][0]+"-lum-"+varNames[i][1], palettes[index][i][2]+"%");
    }
}
function darkText(){
    r.style.setProperty('--text-color', "rgb(40,40,40)");
}

//document.documentElement.style.setProperty('--dark-hue-1', '100');
setColors(0)



var globalData = null
var globalCourses = null
var globalTeachers = null

function modifyElements(selector, callback) {
    elementReady(selector).then(element2 => {
        if(element2.length==undefined){
            callback(element2)
        }else{
            element2.forEach(element2 => {callback(element2);});
        }
    });
}

modifyElements(".viewButton",element => {
    element.addEventListener('click', e => {
        location.href = "/view"
    });
});

modifyElements(".prefButton",element => {
    element.addEventListener('click', e => {
        location.href = "/preferences"
    });
});

fetch('./getJsonFiles', {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
    },
})
   .then(response => response.json())
   .then(response => {
        console.log(response)
        globalData = response
        populateTeacherList(globalData.teachers,false)
        //populateCourseList(globalData.courses,false)
        //addEntryListeners()
        
})


globalData = JSON.parse('{"classrooms":[{"roomNum":"121","periodsAvailable":[1,2,3,4,5,6,7,8]},{"roomNum":"123","periodsAvailable":[1,2,3,4,5,6,7,8]},{"roomNum":"134","periodsAvailable":[1,2,3,4,5,6,7,8]},{"roomNum":"115","periodsAvailable":[1,2,3,4,5,6,7,8]},{"roomNum":"116","periodsAvailable":[1,2,3,4,5,6,7,8]},{"roomNum":"138","periodsAvailable":[1,2,3,4,5,6,7,8]},{"roomNum":"114","periodsAvailable":[1,2,3,4,5,6,7,8]},{"roomNum":"119","periodsAvailable":[1,2,3,4,5,6,7,8]},{"roomNum":"120","periodsAvailable":[1,2,3,4,5,6,7,8]},{"roomNum":"126","periodsAvailable":[1,2,3,4,5,6,7,8]},{"roomNum":"128","periodsAvailable":[1,2,3,4,5,6,7,8]},{"roomNum":"132","periodsAvailable":[1,2,3,4,5,6,7,8]},{"roomNum":"139","periodsAvailable":[1,2,3,4,5,6,7,8]},{"roomNum":"129","periodsAvailable":[1,2,3,4,5,6,7,8]},{"roomNum":"130","periodsAvailable":[1,2,3,4,5,6,7,8]},{"roomNum":"117","periodsAvailable":[1,2,3,4,5,6,7,8]}],"courses":[{"name":"New Course","sections":1,"compatibleClassrooms":["23"],"compatiblePeriods":[],"openSemesters":[]},{"name":"New Course","sections":1,"compatibleClassrooms":[],"compatiblePeriods":[],"openSemesters":[]},{"name":"Introduction to Business","sections":4,"compatibleClassrooms":["128","126","120"],"compatiblePeriods":[1,2,3,4,5,6,7,8],"schedulingPriority":0.75},{"name":"Accounting 1","sections":2,"compatibleClassrooms":["121","123"],"compatiblePeriods":[1,2,3,4,5,6,7,8]},{"name":"Honors Accounting","sections":1,"compatibleClassrooms":["121","123"],"compatiblePeriods":[1,2,3,4,5,6,7,8]},{"name":"Marketing","sections":2,"compatibleClassrooms":["126","128","120"],"compatiblePeriods":[1,2,3,4,5,6,7,8]},{"name":"Advertising","sections":2,"compatibleClassrooms":["126","128","120"],"compatiblePeriods":[1,2,3,4,5,6,7,8]},{"name":"Incubator","sections":6,"compatibleClassrooms":["120"],"compatiblePeriods":[1,2,3,4,5,6,7,8],"schedulingPriority":1},{"name":"ACCElerator","sections":1,"compatibleClassrooms":["120"],"compatiblePeriods":[1,2,3,4,5,6,7,8],"schedulingPriority":0.9},{"name":"Business Law","sections":1,"compatibleClassrooms":["128","126","120"],"compatiblePeriods":[1,2,3,4,5,6,7,8]},{"name":"International Business","sections":1,"compatibleClassrooms":["128","126","120"],"compatiblePeriods":[1,2,3,4,5,6,7,8],"schedulingPriority":0.8},{"name":"Comp Programming 1","sections":1,"compatibleClassrooms":["121","123"],"compatiblePeriods":[1,2,3,4,5,6,7,8],"schedulingPriority":0.6},{"name":"Comp Programming 2","sections":3,"compatibleClassrooms":["121","123"],"compatiblePeriods":[1,2,3,4,5,6,7,8],"schedulingPriority":0.6},{"name":"Game Design","sections":1,"compatibleClassrooms":["114"],"compatiblePeriods":[1,2,3,4,5,6,7,8]},{"name":"Fashion Design","sections":1,"compatibleClassrooms":["119"],"compatiblePeriods":[1,2,3,4,5,6,7,8]},{"name":"AP Computer Science","sections":3,"compatibleClassrooms":["121","123"],"compatiblePeriods":[1,2,3,4,5,6,7,8]},{"name":"Software Engineering 2","sections":2,"compatibleClassrooms":["121","123"],"compatiblePeriods":[1,2,3,4,5,6,7,8]},{"name":"Consumer Econ","sections":3,"compatibleClassrooms":["120","126","128","119"],"compatiblePeriods":[1,2,3,4,5,6,7,8]},{"name":"Consumer Econ TT","sections":1,"compatibleClassrooms":["120","126","128","119"],"compatiblePeriods":[5,7]},{"name":"Blended Consumer","sections":2,"compatibleClassrooms":["120","126","128","119"],"compatiblePeriods":[1,2,3,4,5,6,7,8]},{"name":"Floral & Landscape Design","sections":1,"compatibleClassrooms":["132"],"compatiblePeriods":[1,2,3,4,5,6,7,8]},{"name":"Aqua & Urban Food Prod.","sections":1,"compatibleClassrooms":["132"],"compatiblePeriods":[1,2,3,4,5,6,7,8]},{"name":"Comp Animal 1","sections":1,"compatibleClassrooms":["132"],"compatiblePeriods":[1,2,3,4,5,6,7,8]},{"name":"Comp Animal 2","sections":1,"compatibleClassrooms":["132"],"compatiblePeriods":[1,2,3,4,5,6,7,8]},{"name":"Vet Science","sections":1,"compatibleClassrooms":["132"],"compatiblePeriods":[1,2,3,4,5,6,7,8],"schedulingPriority":0.5},{"name":"Graphics 1","sections":1,"compatibleClassrooms":["114"],"compatiblePeriods":[1,2,3,4,5,6,7,8]},{"name":"Graphics 2","sections":1,"compatibleClassrooms":["114"],"compatiblePeriods":[1,2,3,4,5,6,7,8]},{"name":"Graphics 3","sections":1,"compatibleClassrooms":["114"],"compatiblePeriods":[1,2,3,4,5,6,7,8]},{"name":"Electronics","sections":1,"compatibleClassrooms":["138"],"compatiblePeriods":[2],"schedulingPriority":0.7},{"name":"Cybersecurity","sections":1,"compatibleClassrooms":["138"],"compatiblePeriods":[1],"schedulingPriority":0.7},{"name":"Workshop Elements","sections":1,"compatibleClassrooms":["134"],"compatiblePeriods":[1,2,3,4,5,6,7,8],"schedulingPriority":0.8},{"name":"Workshop Studio","sections":1,"compatibleClassrooms":["134"],"compatiblePeriods":[1,2,3,4,5,6,7,8]},{"name":"Geo in Construction","sections":2,"compatibleClassrooms":["134"],"compatiblePeriods":[4,5],"schedulingPriority":0.9134},{"name":"EDS","sections":1,"compatibleClassrooms":["115"],"compatiblePeriods":[1,2,3,4,5,6,7,8]},{"name":"Auto 1","sections":2,"compatibleClassrooms":["139"],"compatiblePeriods":[1,2,3,4,5,6,7,8]},{"name":"Auto 2","sections":1,"compatibleClassrooms":["139"],"compatiblePeriods":[1,2,3,4,5,6,7,8]},{"name":"Auto 3","sections":1,"compatibleClassrooms":["139"],"compatiblePeriods":[1,2,3,4,5,6,7,8]},{"name":"Blended Career Internship","sections":1,"compatibleClassrooms":["120","119","126","128","138"],"compatiblePeriods":[5]},{"name":"Cul 1","sections":4,"compatibleClassrooms":["129","130"],"compatiblePeriods":[1,2,3,4,5,6,7,8]},{"name":"Cul 2","sections":1,"compatibleClassrooms":["129","130"],"compatiblePeriods":[1,2,3,4,5,6,7,8]},{"name":"Cul 3","sections":1,"compatibleClassrooms":["129","130"],"compatiblePeriods":[1,2,3,4,5,6,7,8]},{"name":"Senior Foods","sections":6,"compatibleClassrooms":["129","130"],"compatiblePeriods":[1,2,3,4,5,6,7,8]},{"name":"Human Growth and Dev","sections":1,"compatibleClassrooms":["119"],"compatiblePeriods":[1,2,3,4,5,6,7,8]},{"name":"ECE 1","sections":2,"compatibleClassrooms":["117"],"compatiblePeriods":[3,4,6,7]},{"name":"ECE 2","sections":2,"compatibleClassrooms":["117"],"compatiblePeriods":[3,4,6,7]},{"name":"Intro to Teaching 2","sections":2,"compatibleClassrooms":["126"],"compatiblePeriods":[2,3]},{"name":"Health Occ","sections":2,"compatibleClassrooms":["119"],"compatiblePeriods":[2,3]}],"teachers":[{"name":"New Course","coursesAssigned":[],"sectionsTaught":4,"openPeriods":[1,2,3,4,5,6,7,8]},{"name":"Callaghan, Matt","coursesAssigned":[{"course":"AP Computer Science","sections":3},{"course":"Software Engineering 2","sections":1},{"course":"Comp Programming 2","sections":1}],"sectionsTaught":5,"openPeriods":[1,2,3,4,5,6,7,8]},{"name":"Morenus, Terry","coursesAssigned":[{"course":"Consumer Econ","sections":1},{"course":"Consumer Econ TT","sections":1},{"course":"Accounting 1","sections":2},{"course":"Honors Accounting","sections":1},{"course":"International Business","sections":1}],"sectionsTaught":6,"openPeriods":[1,2,3,4,5,6,7,8]},{"name":"Nolan, Gene","coursesAssigned":[{"course":"Incubator","sections":4}],"sectionsTaught":4,"openPeriods":[1,2,3,4,5,6,7,8]},{"name":"Reid, Jason","coursesAssigned":[{"course":"Introduction to Business","sections":4},{"course":"Comp Programming 2","sections":2}],"sectionsTaught":6,"openPeriods":[1,2,3,4,5,6,7,8]},{"name":"Schmit, Geoff","coursesAssigned":[{"course":"Software Engineering 2","sections":1}],"sectionsTaught":1,"openPeriods":[1,2,3,4,5,6,7,8]},{"name":"Thompson, Brett","coursesAssigned":[{"course":"Blended Career Internship","sections":1}],"sectionsTaught":1,"openPeriods":[1,2,3,4,5,6,7,8]},{"name":"Ryan, Jon","coursesAssigned":[{"course":"Incubator","sections":2},{"course":"Game Design","sections":1},{"course":"ACCElerator","sections":1},{"course":"Advertising","sections":2}],"sectionsTaught":6,"openPeriods":[1,2,3,4,5,6,7,8]},{"name":"Donovan, Meghan","coursesAssigned":[{"course":"Blended Consumer","sections":2},{"course":"ECE 1","sections":2},{"course":"Human Growth and Dev","sections":1}],"sectionsTaught":5,"openPeriods":[1,2,3,4,5,6,7,8]},{"name":"Hillyer, Allison","coursesAssigned":[{"course":"Senior Foods","sections":3},{"course":"Cul 1","sections":2}],"sectionsTaught":5,"openPeriods":[1,2,3,4,5,6,7,8]},{"name":"Klen, Dana","coursesAssigned":[{"course":"Consumer Econ","sections":1},{"course":"Health Occ","sections":2},{"course":"ECE 2","sections":2}],"sectionsTaught":5,"openPeriods":[1,2,3,4,5,6,7,8]},{"name":"Lewandowski, Angela","coursesAssigned":[{"course":"Consumer Econ","sections":1},{"course":"Senior Foods","sections":2},{"course":"Fashion Design","sections":1}],"sectionsTaught":4,"openPeriods":[1,2,3,4,5,6,7,8]},{"name":"Oskroba, Melissa","coursesAssigned":[{"course":"Intro to Teaching 2","sections":2}],"sectionsTaught":2,"openPeriods":[1,2,3,4,5,6,7,8]},{"name":"Tuazon, Jasmin","coursesAssigned":[{"course":"Cul 1","sections":2},{"course":"Cul 2","sections":1},{"course":"Cul 3","sections":1},{"course":"Senior Foods","sections":1}],"sectionsTaught":5,"openPeriods":[1,2,3,4,5,6,7,8]},{"name":"DiOrio, Becky","coursesAssigned":[{"course":"Graphics 1","sections":1},{"course":"Graphics 2","sections":1},{"course":"Graphics 3","sections":1}],"sectionsTaught":6,"openPeriods":[1,2,3,4,5,6,7,8]},{"name":"Gleamza, Henry","coursesAssigned":[{"course":"Geo in Construction","sections":2},{"course":"Workshop Studio","sections":1},{"course":"Workshop Elements","sections":1}],"sectionsTaught":5,"openPeriods":[1,2,3,4,5,6,7,8]},{"name":"Ingram, Dawn","coursesAssigned":[{"course":"Floral & Landscape Design","sections":1},{"course":"Aqua & Urban Food Prod.","sections":1},{"course":"Comp Animal 1","sections":1},{"course":"Comp Animal 2","sections":1},{"course":"Vet Science","sections":1}],"sectionsTaught":5,"openPeriods":[1,2,3,4,5,6,7,8]},{"name":"Kischuk, Dan","coursesAssigned":[{"course":"Cybersecurity","sections":1},{"course":"Electronics","sections":1}],"sectionsTaught":2,"openPeriods":[1,2,3,4,5,6,7,8]},{"name":"Lentino, Dan","coursesAssigned":[{"course":"Auto 1","sections":2},{"course":"Auto 2","sections":1},{"course":"Auto 3","sections":1}],"sectionsTaught":4,"openPeriods":[1,2,3,4,5,6,7,8]},{"name":"Ryan, Jason","coursesAssigned":[{"course":"EDS","sections":1}],"sectionsTaught":1,"openPeriods":[1,2,3,4,5,6,7,8]}]}')
populateCourseList(globalData.courses,true);

//populateClassroomList(globalData.classrooms,true);


//TEMP HIDE FUNCTIONS
modifyElements(".teacherColumn",element => {element.style.display = "none"});


function populateTeacherList(teacherData,insert){
    modifyElements(".teacherList",element => {
        if((!insert)&&element.children.length==1){element.children[0].remove()}
        for(let i=0;i<teacherData.length;i++){
            const a = teacherData[i]
            const t1 = document.createElement("div");t1.className="teacherEntry entry";t1.index = i;
            const t2 = document.createElement("div");t2.className="teacherMain entryMain";
            const t3 = document.createElement("span");t3.className="teacherMainText teacherText entryMainText";t3.textContent = a.name;
            const t41 = document.createElement("div");t41.className="removeTeacher";
            const t4 = document.createElement("div");t4.className="dropdown";
            const t5 = document.createElement("div");t5.className="dropdownIcon";
            if(insert){
                modifyElements(".teacherEntry",element2 => {
                    element2.index++
                })
                t1.index = 0;
                element.insertBefore(t1,element.children[0]);
            }else{
                element.appendChild(t1);
                t1.index = i;
            }
            t1.appendChild(t2);
            t2.appendChild(t3);
            t2.appendChild(t41);
            t2.appendChild(t4);
            t4.appendChild(t5);

            const t6 = document.createElement("div");t6.className="teacherSubList";
            const t7 = document.createElement("div");t7.className="teacherName";
            const t8 = document.createElement("input");t8.className="teacherNameText teacherText";t8.type="text";t8.value=a.name;t8.placeholder="Teacher Name (Last, First)";
            const t9 = document.createElement("div");t9.className="teacherCourses";
            const t31 = document.createElement("div");t31.className="teacherCourseBar";
            const t10 = document.createElement("span");t10.className="teacherCourseText teacherText";t10.textContent = "Courses Taught:";
            const t32 = document.createElement("div");t32.className="addTeacherCourse";
            const t33 = document.createElement("span");t33.className="addTeacherCourseText buttonText";t33.textContent = "+";
            t1.appendChild(t6);
            t6.appendChild(t7);
            t7.appendChild(t8);
            t6.appendChild(t9);
            t9.appendChild(t31);
            t31.appendChild(t10);
            t31.appendChild(t32);
            t32.appendChild(t33);
            addTeacherCourse(t32);

            let j=0
            for(const b of a.coursesAssigned){
                addCourseEntry(b.course,b.sections,t9,j)
                j++
            }

            const t29 = document.createElement("div");t29.className="teacherPeriods";
            const t30 = document.createElement("span");t30.className="teacherPeriodText2 teacherText";t30.textContent = "Open Periods:";
            const t24 = document.createElement("div");t24.className="openPeriods";
            t6.appendChild(t29);
            t29.appendChild(t30);
            t29.appendChild(t24);
            
            for(let i=0;i<8;i++){
                var checked = true
                if(a.openPeriods.indexOf(i+1) == -1){
                    checked = false
                }

                const t25 = document.createElement("div");t25.className="teacherCheckbox";
                const t26 = document.createElement("span");t26.className="teacherPeriodText teacherText";t26.textContent = ""+(i+1);
                const t27 = document.createElement("div");t27.className="teacherPeriodCheckboxContainer";
                const t28 = document.createElement("input");t28.className="teacherPeriodCheckbox";t28.type="checkbox";
                if(checked){t28.checked=true;}else{
                    t25.style.opacity = "0.5"
                }
                t25.index = i;
                t24.appendChild(t25);
                t25.appendChild(t26);
                t25.appendChild(t27);
                t27.appendChild(t28);
            }
            if(insert){
                t1.style.fontSize = element.parentElement.getBoundingClientRect().width+"px"
                t1.style.animation = "add-entry-shadow 0.5s cubic-bezier(0.2, 0, 0, 1) forwards, add-entry-clip 0.5s cubic-bezier(0.2, 0.7, 0.2, 1) forwards";
                setTimeout(()=>{
                    t1.style.animation = "none";
                },500)
            }
        }
        addTeacherEntryListeners()
    })
}
function populateCourseList(courseData, insert) {
    modifyElements(".courseList", element => {
        if ((!insert) && element.children.length == 1) {
            element.children[0].remove();
        }
        for (let i = 0; i < courseData.length; i++) {
            const a = courseData[i];
            const t1 = document.createElement("div");
            t1.className = "courseEntry entry";
            t1.index = i;
            const t2 = document.createElement("div");
            t2.className = "courseMain entryMain";
            const t3 = document.createElement("span");
            t3.className = "courseMainText courseText entryMainText";
            t3.textContent = a.name;
            const t41 = document.createElement("div");
            t41.className = "removeCourse removeButton";
            const t4 = document.createElement("div");
            t4.className = "dropdown";
            const t5 = document.createElement("div");
            t5.className = "dropdownIcon";
            if (insert) {
                modifyElements(".courseEntry", element2 => {
                    element2.index++;
                });
                t1.index = 0;
                element.insertBefore(t1, element.children[0]);
            } else {
                element.appendChild(t1);
                t1.index = i;
            }
            t1.appendChild(t2);
            t2.appendChild(t3);
            t2.appendChild(t41);
            t2.appendChild(t4);
            t4.appendChild(t5);

            const t6 = document.createElement("div");
            t6.className = "courseDetails entryDetails";
            const t7 = document.createElement("div");
            t7.className = "courseName";
            const t8 = document.createElement("input");
            t8.className = "courseNameInput";
            t8.type = "text";
            t8.value = a.name;
            t8.placeholder = "Course Name";
            const t9 = document.createElement("div");
            t9.className = "compatibleClassrooms";
            const t10 = document.createElement("span");
            t10.className = "courseText";
            t10.textContent = "Compatible Classrooms:";
            const t11 = document.createElement("div");
            t11.className = "courseClassroomList";

            
            t1.appendChild(t6);
            t6.appendChild(t7);
            t7.appendChild(t8);
            t6.appendChild(t9);
            t9.appendChild(t10);
            t9.appendChild(t11);

            let j=0
            for(const b of a.compatibleClassrooms){
                addCourseClassroom(b,t11,t1.index)
                j++
            }
            
            const t12 = document.createElement("div");
            t12.className = "addClassroomDiv";
            const t13 = document.createElement("div");
            t13.className = "addClassroom addButton";
            t12.appendChild(t13);
            t11.appendChild(t12);

            const t14 = document.createElement("div");
            t14.className = "coursePeriods";
            const t15 = document.createElement("span");
            t15.className = "courseText";
            t15.textContent = "Periods Open:";
            const t16 = document.createElement("ul");
            t16.className = "courseOpenPeriods";
            t6.appendChild(t14);
            t14.appendChild(t15);
            t14.appendChild(t16);

            for(let i=0;i<8;i++){
                var checked = true
                if(a.compatiblePeriods.indexOf(i+1) == -1){
                    checked = false
                }

                const t17 = document.createElement("li");t17.className="courseCheckbox";
                const t18 = document.createElement("span");t18.className="coursePeriodText courseText";t18.textContent = ""+(i+1);
                const t19 = document.createElement("div");t19.className="coursePeriodCheckboxContainer";
                const t20 = document.createElement("input");t20.className="coursePeriodCheckbox";t20.type="checkbox";
                if(checked){t20.checked=true;}else{
                    t17.style.opacity = "0.5"
                }
                t17.index = i;
        
                t17.appendChild(t18);
                t17.appendChild(t19);
                t19.appendChild(t20);
                t16.appendChild(t17);
            }

            const t21 = document.createElement("div");
            t21.className = "courseSemesters";
            const t22 = document.createElement("span");
            t22.className = "courseText";
            t22.textContent = "Semesters Open:";
            const t23 = document.createElement("ul");
            t23.className = "semesterList";

            t6.appendChild(t21);
            t21.appendChild(t22);
            t21.appendChild(t23);

            for(let i=0;i<2;i++){
                var checked = true
                if(a.openSemesters!=null){
                    if(a.openSemesters.indexOf(i+1) == -1){
                        checked = false
                    }
                }
                const t24 = document.createElement("li");t24.className="semesterCheckbox";
                const t25 = document.createElement("span");t25.className="semesterText courseText";t25.textContent = "Semester "+(i+1);
                const t26 = document.createElement("div");t26.className="semesterCheckboxContainer";
                const t27 = document.createElement("input");t27.className="semesterInputCheckbox";t27.type="checkbox";
                if(checked){t27.checked=true;}else{
                    t24.style.opacity = "0.5"
                }
                t24.index = i;
                t24.appendChild(t25);
                t24.appendChild(t26);
                t26.appendChild(t27);
                t23.appendChild(t24);
            }


            if (insert) {
                t1.style.fontSize = element.parentElement.getBoundingClientRect().width + "px";
                t1.style.animation = "add-entry-shadow 0.5s cubic-bezier(0.2, 0, 0, 1) forwards, add-entry-clip 0.5s cubic-bezier(0.2, 0.7, 0.2, 1) forwards";
                setTimeout(() => {
                    t1.style.animation = "none";
                }, 500);
            }
        }
        addCourseEntryListeners();
    });
}

function populateClassroomList(classroomData, insert) {
    modifyElements(".classroomList", element => {
        if ((!insert) && element.children.length == 1) {
            element.children[0].remove();
        }
        for (let i = 0; i < classroomData.length; i++) {
            const a = classroomData[i];
            const t1 = document.createElement("div");
            t1.className = "classroomEntry entry";
            t1.index = i;
            const t2 = document.createElement("div");
            t2.className = "classroomMain entryMain";
            const t3 = document.createElement("span");
            t3.className = "classroomMainText classroomText entryMainText";
            t3.textContent = a.roomNum;
            const t4 = document.createElement("div");
            t4.className = "dropdown classroomDropdown";
            const t5 = document.createElement("div");
            t5.className = "dropdownIcon";
            if (insert) {
                modifyElements(".classroomEntry", element2 => {
                    element2.index++;
                });
                t1.index = 0;
                element.insertBefore(t1, element.children[0]);
            } else {
                element.appendChild(t1);
                t1.index = i;
            }
            t1.appendChild(t2);
            t2.appendChild(t3);
            t2.appendChild(t4);
            t4.appendChild(t5);


            const t6 = document.createElement("div");
            t6.className = "classroomSubList";
            const t7 = document.createElement("div");
            t7.className = "classroomPeriods";
            const t8 = document.createElement("span");
            t8.className = "classroomPeriodText2 classroomText";
            t8.textContent = "Periods Open:";
            const t9 = document.createElement("ul");
            t9.className = "classroomOpenPeriods";

            t1.appendChild(t6);
            t6.appendChild(t7);
            t7.appendChild(t8);
            t7.appendChild(t9);
            for(let i=0;i<8;i++){
                var checked = true
                if(a.periodsAvailable.indexOf(i+1) == -1){
                    checked = false
                }

                const t17 = document.createElement("li");t17.className="classroomCheckbox";
                const t18 = document.createElement("span");t18.className="classroomPeriodText classroomText";t18.textContent = ""+(i+1);
                const t19 = document.createElement("div");t19.className="classroomPeriodCheckboxContainer";
                const t20 = document.createElement("input");t20.className="classroomInputCheckbox";t20.type="checkbox";
                if(checked){t20.checked=true;}else{
                    t17.style.opacity = "0.5"
                }
                t17.index = i;
        
                t17.appendChild(t18);
                t17.appendChild(t19);
                t19.appendChild(t20);
                t9.appendChild(t17);
            }

            if (insert) {
                t1.style.fontSize = element.parentElement.getBoundingClientRect().width + "px";
                t1.style.animation = "add-entry-shadow 0.5s cubic-bezier(0.2, 0, 0, 1) forwards, add-entry-clip 0.5s cubic-bezier(0.2, 0.7, 0.2, 1) forwards";
                setTimeout(() => {
                    t1.style.animation = "none";
                }, 500);
            }
        }
        addClassroomEntryListeners();
    });
}

function addCourseClassroom(classNum,appendTo,index){
    const t1 = document.createElement("div");
    t1.className="classroomItem";
    const t2 = document.createElement("span");
    t2.className="classroomItemText";
    const t3 = document.createElement("div");
    t3.className="removeClassroom removeButton";
    t2.role = "textbox";
    t2.contentEditable = "true";
    t3.addEventListener("click",(e)=>{
        const num = parseInt(t2.textContent)
        if(typeof num == "number"){
            globalData.courses[index].compatibleClassrooms.splice(globalData.courses[index].compatibleClassrooms.indexOf(num),1)
            e.target.parentElement.remove()
        }else{
            e.target.parentElement.remove()
        }
    });
    t1.appendChild(t2);
    t1.appendChild(t3);
    t2.textContent = classNum;
    if(appendTo.children.length<2){
        appendTo.appendChild(t1);
    }else{
        appendTo.insertBefore(t1,appendTo.children[appendTo.children.length-1]);
    }

}

function addCourseEntry(courseName,sections,appendTo,index){
    const t11 = document.createElement("div");t11.className="teacherCourseEntry";
    const t12 = document.createElement("div");t12.className="teacherCourseDropdown";
    const t13 = document.createElement("div");t13.className="teacherCourseDropdown2";
    const t14 = document.createElement("span");t14.className="teacherCourseDropdownText";t14.textContent = courseName;
    const t15 = document.createElement("div");t15.className="teacherCourseDropdownIcon2";
    const t16 = document.createElement("div");t16.className="teacherCourseDropdownIconImage2";
    const t17 = document.createElement("div");t17.className="teacherCourseCounter";
    const t18 = document.createElement("div");t18.className="minusButton";
    const t19 = document.createElement("span");t19.className="minusButtonText buttonText";t19.textContent = "-";
    const t20 = document.createElement("div");t20.className="teacherSectionCount";
    const t21 = document.createElement("span");t21.className="teacherSectionCountText teacherText";t21.textContent = sections;
    const t22 = document.createElement("div");t22.className="plusButton";
    const t23 = document.createElement("span");t23.className="plusButtonText buttonText";t23.textContent = "+";
    appendTo.appendChild(t11);
    t11.index = index
    t11.appendChild(t12);
    t12.appendChild(t13);
    t13.appendChild(t14);
    t12.appendChild(t15);
    t15.appendChild(t16);
    t11.appendChild(t17);
    t17.appendChild(t18);
    t18.appendChild(t19);
    t17.appendChild(t20);
    t20.appendChild(t21);
    t17.appendChild(t22);
    t22.appendChild(t23);
    teacherCourseDropdownListener(t12)
    teacherCourseCounter(t17)
}

function updateTeacherData(element){
    console.log(element)
    const teacher = globalData.teachers[element.index]
    
    if(element.children[1].children[0].children[0]!=null){
        teacher.name = element.children[1].children[0].children[0].value
    }else{
        teacher.name = element.children[1].children[0].textContent
    }
    teacher.coursesAssigned = []
    let j=0
    for(const b of element.children[1].children[1].children){
        if(j>0){
            teacher.coursesAssigned.push({course:b.children[0].children[0].children[0].textContent,sections:parseInt(b.children[1].children[1].children[0].textContent)})
        }
        j++
    }
    let i = 0
    for(const c of element.children[1].children[2].children[1].children){
        i++
        if(c.children[1].children[0].checked){
            if(teacher.openPeriods.indexOf(i)==-1){
                teacher.openPeriods.push(i)
            }
        }else{
            if(teacher.openPeriods.indexOf(i)!=-1){
                teacher.openPeriods.splice(teacher.openPeriods.indexOf(i),1)
            }
        }
    }
}

function updateCourseData(element) {
    const course = globalData.courses[element.index];
    
    course.name = element.querySelector('.courseNameInput').value;
    course.compatibleClassrooms = [];
    const classroomItems = element.querySelectorAll('.classroomItem');
    classroomItems.forEach(item => {
        course.compatibleClassrooms.push(item.querySelector('.classroomItemText').textContent);
    });

    course.compatiblePeriods = [];
    const periodCheckboxes = element.querySelectorAll('.coursePeriodCheckbox');
    periodCheckboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            course.compatiblePeriods.push(index + 1);
        }
    });

    course.openSemesters = [];
    const semesterCheckboxes = element.querySelectorAll('.semesterInputCheckbox');
    semesterCheckboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            course.openSemesters.push(index + 1);
        }
    });
}

function updateTeacherEntry(element){
    const teacher = globalData.teachers[element.index]
    element.children[0].children[0].textContent = teacher.name
    element.children[1].children[0].children[0].value = teacher.name
    element.children[1].children[1].textContent = ""
    
    const t31 = document.createElement("div");t31.className="teacherCourseBar";
    const t10 = document.createElement("span");t10.className="teacherCourseText teacherText";t10.textContent = "Courses Taught:";
    const t32 = document.createElement("div");t32.className="addTeacherCourse";
    const t33 = document.createElement("span");t33.className="addTeacherCourseText buttonText";t33.textContent = "+";
    element.children[1].children[1].appendChild(t31);
    t31.appendChild(t10);
    t31.appendChild(t32);
    t32.appendChild(t33);
    addTeacherCourse(t32);
    console.log("a")
    let j=0;
    for(const a of teacher.coursesAssigned){
        addCourseEntry(a.course,a.sections,element.children[1].children[1],j)
        j++
        console.log("a2")
    }
    j=0
    console.log(element.children[1].children[2])
    for(const a of element.children[1].children[2].children[1].children){
        if(teacher.openPeriods.indexOf(j+1)!=-1){
            a.children[1].children[0].checked = true
            a.style.opacity = 1
        }else{
            a.children[1].children[0].checked = false
            a.style.opacity = 0.5
        }
        j++
    }
    console.log("b")
}


setTimeout(()=>{
    addTeacherEntryListeners()
},500)

function addCourseEntryListeners() {
    modifyElements(".courseEntry", element => {
        if (element.listener === true) return;

        element.listener = true;
        let isOpen = false;
        let clickCount = 0;

        const handleCourseNameChange = () => {
            updateCourseData(element);
            updateCourseEntry(element);
        };

        const handleExpandCollapseClick = () => {
            clickCount++;
            const arrowIcon = element.children[0].children[2].children[0];
            const currentHeight = element.getBoundingClientRect().height;

            if (isOpen) {
                arrowIcon.style.transform = "rotate(180deg)";
                element.style.height = `${currentHeight}px`;
                setTimeout(() => {
                    element.style.height = `${element.children[0].getBoundingClientRect().height}px`;
                }, 10);
                isOpen = false;
            } else {
                arrowIcon.style.transform = "rotate(0deg)";
                element.style.height = "fit-content";
                const expandedHeight = element.getBoundingClientRect().height;
                element.style.height = `${currentHeight}px`;
                setTimeout(() => {
                    element.style.height = `${expandedHeight}px`;
                }, 10);
                isOpen = true;
            }
        };

        const handleCheckboxChange = (e) => {
            updateCourseData(element);
        };

        const courseNameInput = element.querySelector('.courseNameInput');
        const expandCollapseButton = element.querySelector('.dropdown');
        const checkboxes = element.querySelectorAll('input[type="checkbox"]');

        courseNameInput.addEventListener('change', handleCourseNameChange);
        expandCollapseButton.addEventListener('click', handleExpandCollapseClick);
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', handleCheckboxChange);
        });
    });

    modifyElements(".addCourse", element => {
        if (element.listener === true) return;
        element.listener = true;
        element.addEventListener('click', e => {
            const object = {
                name: 'New Course',
                sections: 1,
                compatibleClassrooms: [],
                compatiblePeriods: [],
                openSemesters: []
            };
            globalData.courses.unshift(object);
            populateCourseList([object], true);
        });
    });

    modifyElements(".courseInput", element => {
        if (element.listener === true) return;
        element.listener = true;
        let prevValue = "";
        setInterval(() => {
            if (element.value != prevValue) {
                prevValue = element.value;
                modifyElements(".courseEntry", element2 => {
                    const content = element2.children[0].children[0].textContent.substring(0, prevValue.length);
                    if (content.toLowerCase() == prevValue.toLowerCase()) {
                        element2.style.display = "flex";
                    } else {
                        element2.style.display = "none";
                    }
                });
            }
        }, 500);
    });
    modifyElements(".courseCheckbox",element => {
        if(element.listener===true){return null}
        element.listener=true
        element.children[1].children[0].addEventListener('change', e => {
            if (element.children[1].children[0].checked) {
              element.style.opacity = "1"
            } else {
              element.style.opacity = "0.5"
            }
            updateCourseData(element.parentElement.parentElement.parentElement.parentElement)
        });
    });
    modifyElements(".semesterCheckbox",element => {
        if(element.listener===true){return null}
        element.listener=true
        element.children[1].children[0].addEventListener('change', e => {
            if (element.children[1].children[0].checked) {
              element.style.opacity = "1"
            } else {
              element.style.opacity = "0.5"
            }
            updateCourseData(element.parentElement.parentElement.parentElement.parentElement)
        });
    });
    modifyElements(".removeCourse",element=>{
        if(element.listener===true){return null}
        element.listener=true
        var fired = false
        element.addEventListener('click', e => {
            if(fired===false){
                const parent = element.parentElement.parentElement
                modifyElements(".courseEntry",element2 => {
                    if(element2.index>parent.index){
                        element2.index = element2.index-1
                    }
                })

                parent.style.height = parent.getBoundingClientRect().height+"px"
                parent.style.animation = "none";
                setTimeout(()=>{
                    parent.style.animation = "remove-entry-shadow 0.5s cubic-bezier(0.2, 0.7, 0.2, 1) forwards, remove-entry-clip 0.5s cubic-bezier(0.5, 0, 0, 0.5) forwards";
                },10)
                setTimeout(()=>{
                    globalData.courses.splice([parent.index],1)
                    parent.remove()
                },500)
                fired = true;
            }
        })
        
    });
    modifyElements(".addClassroomDiv",element=>{
        if(element.listener===true){return null}
        element.listener=true
        element.addEventListener('click', e => {
            const parent = element.parentElement.parentElement
            addCourseClassroom("000",parent.children[1],parent.children[1].children[1].children.length)
            updateCourseData(parent.parentElement)
        });
    });
}
function addClassroomEntryListeners() {
    modifyElements(".classroomEntry", element => {
        if (element.listener === true) return;

        element.listener = true;
        let isOpen = false;
        let clickCount = 0;

        const handleExpandCollapseClick = () => {
            clickCount++;
            const arrowIcon = element.children[0].children[1].children[0];
            const currentHeight = element.getBoundingClientRect().height;

            if (isOpen) {
                arrowIcon.style.transform = "rotate(180deg)";
                element.style.height = `${currentHeight}px`;
                setTimeout(() => {
                    element.style.height = `${element.children[0].getBoundingClientRect().height}px`;
                }, 10);
                isOpen = false;
            } else {
                arrowIcon.style.transform = "rotate(0deg)";
                element.style.height = "fit-content";
                const expandedHeight = element.getBoundingClientRect().height;
                element.style.height = `${currentHeight}px`;
                setTimeout(() => {
                    element.style.height = `${expandedHeight}px`;
                }, 10);
                isOpen = true;
            }
        };


        const expandCollapseButton = element.querySelector('.dropdown');
        expandCollapseButton.addEventListener('click', handleExpandCollapseClick);
        modifyElements(".classroomCheckbox",element => {
            if(element.listener===true){return null}
            element.listener=true
            element.children[1].children[0].addEventListener('change', e => {
                if (element.children[1].children[0].checked) {
                  element.style.opacity = "1"
                } else {
                  element.style.opacity = "0.5"
                }
                updateTeacherData(element.parentElement.parentElement.parentElement.parentElement)
            });
        });
    });
}

// Initialize course entry listeners after a delay
setTimeout(() => {
    addCourseEntryListeners();
    addClassroomEntryListeners();
}, 500);

function addTeacherEntryListeners(){
    modifyElements(".teacherEntry", element => {
        if (element.listener === true) return;

        element.listener = true;
        let isOpen = false;
        let clickCount = 0;

        const handleInputChange = () => {
            updateTeacherData(element);
            updateTeacherEntry(element);
        };

        const handleExpandCollapseClick = () => {
            clickCount++;
            const arrowIcon = element.children[0].children[2].children[0];
            const currentHeight = element.getBoundingClientRect().height;

            if (isOpen) {
                arrowIcon.style.transform = "rotate(180deg)";
                element.style.height = `${currentHeight}px`;
                setTimeout(() => {
                    element.style.height = `${element.children[0].getBoundingClientRect().height}px`;
                }, 10);
                isOpen = false;
            } else {
                arrowIcon.style.transform = "rotate(0deg)";
                element.style.height = "fit-content";
                const expandedHeight = element.getBoundingClientRect().height;
                element.style.height = `${currentHeight}px`;
                setTimeout(() => {
                    element.style.height = `${expandedHeight}px`;
                }, 10);
                isOpen = true;
            }
        };

        const inputElement = element.children[1].children[0].children[0];
        const expandCollapseButton = element.children[0].children[2];

        inputElement.addEventListener('change', handleInputChange);
        expandCollapseButton.addEventListener('click', handleExpandCollapseClick);
    });

    modifyElements(".teacherCheckbox",element => {
        if(element.listener===true){return null}
        element.listener=true
        element.children[1].children[0].addEventListener('change', e => {
            if (element.children[1].children[0].checked) {
              element.style.opacity = "1"
            } else {
              element.style.opacity = "0.5"
            }
            updateTeacherData(element.parentElement.parentElement.parentElement.parentElement)
        });
    });
    modifyElements(".addTeacher",element => {
        if(element.listener===true){return null}
        element.listener=true
        element.addEventListener('click', e => {
            const object = {name:'New Teacher',coursesAssigned:[],openPeriods:[1,2,3,4,5,6,7,8]}
            globalData.teachers.unshift(object)
            populateTeacherList([object],true)
        });
    });
    modifyElements(".teacherInput",element=>{
        if(element.listener===true){return null}
        element.listener=true
        var prevValue = ""
        setInterval(()=>{
            if(element.value!=prevValue){
                prevValue=element.value
                modifyElements(".teacherEntry",element2 => {
                    const content = element2.children[0].children[0].textContent.substring(0,prevValue.length)
                    if(content.toLowerCase()==prevValue.toLowerCase()){
                        element2.style.display = "flex"
                    }else{
                        element2.style.display = "none"
                    }
                        
                })
            }

        },100)
    });
    modifyElements(".removeTeacher",element=>{
        if(element.listener===true){return null}
        element.listener=true
        var fired = false
        element.addEventListener('click', e => {
            if(fired===false){
                const parent = element.parentElement.parentElement
                modifyElements(".teacherEntry",element2 => {
                    if(element2.index>parent.index){
                        element2.index = element2.index-1
                    }
                })

                parent.style.height = parent.getBoundingClientRect().height+"px"
                parent.style.animation = "none";
                setTimeout(()=>{
                    parent.style.animation = "remove-entry-shadow 0.5s cubic-bezier(0.2, 0.7, 0.2, 1) forwards, remove-entry-clip 0.5s cubic-bezier(0.5, 0, 0, 0.5) forwards";
                },10)
                setTimeout(()=>{
                    globalData.teachers.splice([parent.index],1)
                    parent.remove()
                },500)
                fired = true;
            }
        })
        
    });
}

const teacherCourseCounter = function(element){
    element.children[0].addEventListener('click', e => {
        const num = parseInt(element.children[1].children[0].textContent)
        const parent = element.parentElement.parentElement.parentElement.parentElement
        if(num>1){
            element.children[1].children[0].textContent = num-1
        }else{
            globalData.teachers[parent.index].coursesAssigned.splice(element.parentElement.index,1)
            updateTeacherEntry(parent)
        }
        updateTeacherData(parent)
    });

    element.children[2].addEventListener('click', e => {
        const num = parseInt(element.children[1].children[0].textContent)
        const parent = element.parentElement.parentElement.parentElement.parentElement
        if(num<8){
            element.children[1].children[0].textContent = num+1
        }else{
            element.children[1].children[0].textContent = 8
        }
        updateTeacherData(parent)
    });
}

const addTeacherCourse = function(element){
    element.addEventListener('click', e => {
        const parent = element.parentElement.parentElement.parentElement.parentElement
        globalData.teachers[parent.index].coursesAssigned.push({course:"Empty",sections:1})
        updateTeacherEntry(parent)
    })
}

var activeElement = null
var dropdownOpen = false;
const teacherCourseDropdownListener = function(element){
    element.children[1].addEventListener('click', e => {
        activeElement = element
        if(dropdownOpen){
            var textElement = document.createElement('span')
            textElement.type = "text"
            textElement.className = "teacherCourseDropdownText"
            textElement.textContent = activeElement.prevText
            element.children[0].textContent = ""
            element.children[0].appendChild(textElement)
            element.children[1].children[0].style.transform = "rotate(180deg)"
            element.style.width = "fit-content"
        }else{
            element.style.width = element.getBoundingClientRect().width+"px"
            var searchElement = document.createElement('input')
            searchElement.type = "text"
            searchElement.className = "input2"
            activeElement.prevText = element.children[0].children[0].textContent
            element.children[0].textContent = ""
            element.children[0].appendChild(searchElement)
            element.children[1].children[0].style.transform = "rotate(0.1deg)"
            var prevValue = ""
            searchElement.placeholder = activeElement.prevText

            searchElement.focus()
            setInterval(()=>{
                if(searchElement.value!=prevValue){
                    prevValue=searchElement.value
                    modifyElements(".dropdownFrame",element2 => {
                        for(const b of element2.children){
                            const content = b.children[0].textContent.substring(0,prevValue.length)
                            if(content.toLowerCase()==prevValue.toLowerCase()){
                                b.style.display = "flex"
                            }else{
                                b.style.display = "none"
                            }
                        }
                    })

                }
            })
            
        }
        modifyElements(".dropdownFrame",element2 => {
            element2.style.top = (element.getBoundingClientRect().y+element.getBoundingClientRect().height)+"px"
            element2.style.left = element.getBoundingClientRect().x+"px"

            if(globalData==null){
                globalData = {courses:[{name:"Test1111111"},{name:"est2"},{name:"st3"},{name:"t4"}]}
            }
            element2.textContent = ""
            for(const a of globalData.courses){
                const t1 = document.createElement("div");t1.className="";t1.classList = "dropdownFrameDiv"
                const t2 = document.createElement("span");t2.className="";t2.textContent = a.name;t2.classList = "dropdownFrameText"
                
                t1.appendChild(t2);
                element2.appendChild(t1);

                t1.addEventListener('click', e => {
                    
                    var textElement = document.createElement('span')
                    textElement.type = "text"
                    textElement.className = "teacherCourseDropdownText"
                    textElement.textContent = t2.textContent
                    element.children[0].textContent = ""
                    element.children[0].appendChild(textElement)
                    element.children[1].children[0].style.transform = "rotate(180deg)"
                    dropdownOpen = false
                    element2.style.opacity = 0
                    element2.style.height = "0px"
                    const newWidth = element.children[0].getBoundingClientRect().width+element.children[1].getBoundingClientRect().width+19
                    element.style.width = "fit-content"

                    updateTeacherData(activeElement.parentElement.parentElement.parentElement.parentElement)
                    
                });
            }

            if(dropdownOpen){
                dropdownOpen = false
                //element2.style.display = "none"
                element2.style.opacity = 0
                element2.style.height = "0px"
            }else{
                dropdownOpen = true
                element2.style.opacity = 1
                element2.style.height = "150px"
                element2.scrollTop = 0
                element2.style.minWidth = Math.max(element2.getBoundingClientRect().width,100)+"px"
                setTimeout(()=>{
                activeElement.style.width = element2.getBoundingClientRect().width+"px"
                },100)
            }
            
        });
    });
}

var tempColors = []
function hexToHSL(H) {let r=0,g=0,b=0;if(H.length == 4){r="0x"+H[1]+H[1];g="0x" + H[2] + H[2]; b = "0x" + H[3] + H[3]; } else if(H.length==7){ r = "0x" + H[1] + H[2]; g = "0x" + H[3] + H[4];b="0x" + H[5]+H[6];} r /= 255; g /= 255; b /= 255; let cmin = Math.min(r,g,b), cmax=Math.max(r,g,b), delta = cmax - cmin, h = 0, s = 0,l=0;if(delta == 0)h=0; else if (cmax == r) h = ((g - b) / delta) % 6;else if(cmax == g) h=(b - r) / delta + 2; else h = (r - g)/delta+4;h=Math.round(h * 60); if (h < 0) h += 360; l = (cmax + cmin)/2;s=delta==0?0:delta/(1-Math.abs(2*l-1));s=+(s*100).toFixed(1);l=+(l*100).toFixed(1); tempColors.push([h,s,Math.round(l)]);}

function testColorString(colors){
    tempColors = []
    const c = colors.split("#")
    hexToHSL("#"+c[1]);hexToHSL("#"+c[2]);
    hexToHSL("#"+c[3]);hexToHSL("#"+c[4]);
    console.log(JSON.stringify(tempColors))
    palettes.push(tempColors);
    setColors(palettes.length-1)
}


document.body.onkeyup = function(e) {
    if (e.key == " " ||
        e.code == "Space" ||      
        e.keyCode == 32      
    ) {

    var tempColors2 = []
        for(let i=0;i<4;i++){
            tempColors2.push([Math.floor(Math.random()*360),Math.floor(Math.random()*100),Math.floor(Math.random()*100)])
        }
        palettes.push(tempColors2);
        setColors(palettes.length-1)
    }
}