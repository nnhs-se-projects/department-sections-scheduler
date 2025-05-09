function elementReady(selector) {
    return new Promise((resolve, reject) => {
        const el = document.querySelector(selector);
        if (el) {
            resolve(el);
        }

        new MutationObserver((mutationRecords, observer) => {
            Array.from(document.querySelectorAll(selector)).forEach(element => {
            resolve(Array.from(document.querySelectorAll(selector)));
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

setColors(0)

function modifyElements(selector, callback) {
    elementReady(selector).then(element2 => {
        if(element2.length==undefined){
            callback(element2)
        }else{
            element2.forEach(element2 => {callback(element2);});
        }
    });
}

var globalCourses = null
var globalTeachers = null

modifyElements(".viewButton",element => {
    element.addEventListener('click', e => {
        location.href = "/view"
    });
});

modifyElements(".editButton",element => {
    element.addEventListener('click', e => {
        location.href = "/edit"
    });
});


function populateTeachers() {
    const teacherWrapper = document.querySelector(".teacherWrapper"); // Container for all teachers
    teacherWrapper.innerHTML = ""; // Clear existing content

    globalData.teachers.forEach(teacher => {
        // Create teacher container
        const teacherContainer = document.createElement("div");
        teacherContainer.classList.add("teacherEntry");

        // Add teacher name
        const teacherName = document.createElement("div");
        teacherName.classList.add("teacherName");
        teacherName.innerText = teacher.name;

        // Add drop-down toggle button
        const dropdownButton = document.createElement("button");
        dropdownButton.classList.add("dropdownButton");
        dropdownButton.innerText = "▼";
        dropdownButton.addEventListener("click", () => {
            dropdownContent.classList.toggle("visible");
        });

        // Create drop-down content
        const dropdownContent = document.createElement("div");
        dropdownContent.classList.add("dropdownContent");

        // Populate the drop-down with Planning and Lunch Period checkboxes
        populateDropdownContent(dropdownContent, teacher.name);

        // Append children
        teacherContainer.appendChild(teacherName);
        teacherContainer.appendChild(dropdownButton);
        teacherContainer.appendChild(dropdownContent);
        teacherWrapper.appendChild(teacherContainer);
    });
}

function createPeriodCheckbox(labelText) {
    const container = document.createElement("div");
    container.classList.add("periodCheckbox");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("periodCheckboxInput");

    const label = document.createElement("label");
    label.innerText = labelText;

    container.appendChild(checkbox);
    container.appendChild(label);

    return container;
}

function populateDropdownContent(dropdownContent, teacherName) {
    // Add Planning Period Checkbox
    const planningPeriod = createPeriodCheckbox("Planning Period");
    dropdownContent.appendChild(planningPeriod);

    // Add Lunch Period Checkbox
    const lunchPeriod = createPeriodCheckbox("Lunch Period");
    dropdownContent.appendChild(lunchPeriod);

    // Add event listeners to save state
    addCheckboxListener(planningPeriod.querySelector("input"), teacherName, "Planning Period");
    addCheckboxListener(lunchPeriod.querySelector("input"), teacherName, "Lunch Period");
}

function saveCheckboxState(teacherName, label, isChecked) {
    console.log(`Teacher: ${teacherName}, ${label}: ${isChecked}`);
    // Update global data or send to backend
    // Example: Update globalData.teachers with the checkbox state
}

function addCheckboxListener(checkbox, teacherName, label) {
    checkbox.addEventListener("change", () => {
        saveCheckboxState(teacherName, label, checkbox.checked);
    });
}

// Call this function after loading teacher data
populateTeachers();




fetch('teachers.json')
  .then(response => response.json())
  .then(data => {
    const teacherList = document.getElementById('teacher-list');
    
    data.forEach(teacher => {
      const entry = document.createElement('div');
      entry.className = 'teacherEntry entry';

      entry.innerHTML = `
        <div class="teacherMain entryMain">
          <span class="teacherMainText teacherText entryMainText">
            ${teacher.name}
          </span>
          <div class="removeTeacher removeButton"></div>
        </div>
        <div class="teacherName"></div>
        <div class="teacherCourses"></div>
        <div class="teacherPeriods"></div>
      `;

      teacherList.appendChild(entry);
    });
  })
  .catch(error => {
    console.error('Error loading teachers:', error);
  });


