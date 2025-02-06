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
        r.style.setProperty(varNames[i][0]+"-hue-"+varNames[i][1], pallettes[index][i][0]+"");
        r.style.setProperty(varNames[i][0]+"-sat-"+varNames[i][1], pallettes[index][i][1]+"%");
        r.style.setProperty(varNames[i][0]+"-lum-"+varNames[i][1], pallettes[index][i][2]+"%");
    }
}

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

//CODE START

var alternate = 0;
var style = window.getComputedStyle(document.body)
modifyElements(".classDisplay",element => {
    alternate++;
    if(alternate%2==0){
        element.classList.add("darkBox")
    }else{
        element.classList.add("normalBox")
    }
});

var alternate2 = 0;
modifyElements(".periodDisplay",element => {
    alternate2++;
    if(alternate2%2==0){
        element.classList.add("darkBox")
    }else{
        element.classList.add("normalBox")
    }
});

modifyElements(".popupXImage",element => {
    element.addEventListener('click', e => {
        closePopup()
    });
});

modifyElements(".editButton",element => {
    element.addEventListener('click', e => {
        location.href = "/edit"
    });
});

modifyElements(".prefButton",element => {
    element.addEventListener('click', e => {
        location.href = "/preferences"
    });
});

modifyElements(".popupTrashImage",element => {
    element.addEventListener('click', e => {
        globalData[popupIndex] = null
        closePopup()
        resizeText()
    });
});

var globalClassrooms = []
modifyElements(".classBar",element => {
    for(const a of element.children){
        globalClassrooms.push(a.children[0].textContent)
    }
});

populateScheduleBox(null)
const schedulePopup = document.getElementsByClassName("schedulePopUp")[0]

modifyElements(".generateButton",element => {
    element.addEventListener("click",function(e){
        fetch('./createSchedule', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        })
           .then(response => response.json())
           .then(response => {
                globalCourses = response.courses
                globalTeachers = response.teachers
                globalData = response.data
                populateScheduleBox(globalData)
           })
    },false);
});




function populateScheduleBox(data){
    modifyElements(".scheduleBox",element => {
        element.innerHTML = ""
        element.addEventListener('mousemove', e => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
    
            element.style.setProperty('--x', x + 'px');
            element.style.setProperty('--y', y + 'px');
        });
    
        const periods = document.getElementsByClassName("periodDisplay").length
        const classes = document.getElementsByClassName("classDisplay").length
        var index = 0;
        for(let i=0;i<(periods*classes);i++){
            const baseEntry = document.createElement("div");
            baseEntry.classList.add("scheduleItem");
            const spanNode = document.createElement("span");
            spanNode.classList.add("scheduleText");

            var textToAdd = "-"
            const text = document.createTextNode(textToAdd);

            spanNode.appendChild(text)
            baseEntry.addEventListener("click",function(e){
                handleScheduleClick(baseEntry,(data))
            })

            baseEntry.appendChild(spanNode);
            i2 = periods*classes-i-1
            var lum = (i2-(Math.floor(i2/8)*8))+Math.floor(i2/8)
    
            var lum2 = 1.05+(lum/100)

            baseEntry.style.filter = "brightness("+lum2+")"
            baseEntry.style.strokeWidth = lum2
    
            //baseEntry.style.background = 
            //    'linear-gradient(90deg, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0) 20%, rgba(0,0,0,0) 80%, rgba(0,0,0,0.03) 100%),'+
            //    'linear-gradient(0deg, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.03) 100%),'+
            //    'linear-gradient(-20deg, rgba('+(r*0.9)+','+(g*0.9)+',0,1) 0%, rgba('+r+','+g+',0,1) 100%)'
                
            element.appendChild(baseEntry);
            index++;
        }
        resizeText()
    });
}

var activeElement = null
var openPopup = false
var popupIndex = -1;

window.addEventListener("resize", (event) => {
    closePopup()
    resizeText()
});

function resizeText(){
    modifyElements(".scheduleBox",(elm2)=>{
        const children = Array.from(elm2.children)
        for(let i=0;i<children.length;i++){
            const item = children[i].children[0]
            const width = item.parentElement.getBoundingClientRect().width

            var textToAdd = "-"
            var lengthCutoff = (width/8)
            if(lengthCutoff<3){lengthCutoff=3}
            if(globalData!=null){
                if(globalData[i]!=null){
                    textToAdd = globalData[i].teacher
                }
            }
            if(textToAdd.length>lengthCutoff){
                textToAdd = textToAdd.substring(0,lengthCutoff-2)+"..."
            }

            item.textContent = textToAdd
        }
    })
}

modifyElements(".csvButton",(element)=>{
    element.onclick = function(){
        if(globalData!=null){
            location.href = "/downloadCSV?data="+encodeURIComponent(JSON.stringify(globalData))
        }
    }
})

modifyElements(".jsonButton",(element)=>{
    element.onclick = function(){
        if(globalData!=null){
            location.href = "/downloadJSON?data="+encodeURIComponent(JSON.stringify(globalData))
        }
    }
})

modifyElements(".editTeacher",element => {
    element.addEventListener('click', e => {
        if(dropdownOpen==true&&activeDropdown!=".teacherBox"){
            dropdownOpen = true
            handleDropdown()
        }
        activeDropdown = ".teacherBox"
        handleDropdown()
    });
});

modifyElements(".editCourse",element => {
    element.addEventListener('click', e => {
        if(dropdownOpen==true&&activeDropdown!=".courseBox"){
            handleDropdown()
        }
        activeDropdown = ".courseBox"
        handleDropdown()
    });
});

modifyElements(".createEntryButton",element => {
    element.addEventListener('click', e => {
        const per = (popupIndex%8)+1
        const cls = globalClassrooms[Math.floor(popupIndex/8)]
        console.log(globalData)
        globalData[popupIndex] = {classroom:cls,course:"Empty",period:per,teacher:"Empty"}
        const active2 = activeElement
        activeElement = null
        popupIndex = -1
        handleScheduleClick(active2,globalData)
        resizeText()
    });
});

var dropdownOpen = false
var activeDropdown = null
function handleDropdown(){
    modifyElements(activeDropdown,(element3)=>{
        if(!dropdownOpen){
            element3.children[3].innerHTML = ""
            dropdownOpen = true
            console.log(element3.children[3])
            element3.style.opacity = "1";
            element3.children[3].style.opacity = "1";
            element3.children[4].style.animation="cutoffIn 0s linear forwards";

            element3.children[0].style.zIndex = "200";
            element3.children[1].style.zIndex = "200";
            element3.children[2].style.zIndex = "200";
            element3.children[3].style.zIndex = "100";
            element3.children[4].style.zIndex = "150";
            element3.children[3].style.pointerEvents = "auto";

            element3.children[3].style.height = "200px";
            element3.children[2].children[0].style.transform = "rotate(0deg) translateZ(0)"

            var loop = null
            if(activeDropdown==".teacherBox"){
                loop = globalTeachers
            }else{
                loop = globalCourses
            }

            for(const a of loop){
                const divNode2 = document.createElement("div");
                divNode2.classList.add("dropdownDiv");
                const spanNode2 = document.createElement("span");
                spanNode2.classList.add("dropdownText");
                const text2 = document.createTextNode(a.name);
                spanNode2.appendChild(text2)

                divNode2.addEventListener('click', e => {
                    element3.children[1].textContent = a.name
                    if(activeDropdown==".teacherBox"){
                        globalData[popupIndex].teacher = a.name
                    }else{
                        globalData[popupIndex].course = a.name
                    }
                    
                    handleDropdown()
                    resizeText()
                });

                divNode2.appendChild(spanNode2);
                element3.children[3].appendChild(divNode2);
            }

            if(element3.children[3].getBoundingClientRect().width>element3.getBoundingClientRect().width){
                element3.children[3].style.width = "fit-content"
    
            }else{
                element3.children[3].style.width = element3.getBoundingClientRect().width+"px";
            }
            element3.children[4].style.width = element3.children[3].getBoundingClientRect().width+"px";

        }else{
            
            element3.children[2].children[0].style.transform = "rotate(180deg)"
            dropdownOpen = false
            element3.children[3].style.zIndex = "20";
            element3.children[4].style.animation="cutoffOut 0.5s linear forwards";


            element3.children[0].style.zIndex = "40";
            element3.children[1].style.zIndex = "40";
            element3.children[2].style.zIndex = "40";
            element3.children[4].style.zIndex = "30";

            element3.children[3].style.opacity = "0";
            element3.children[3].style.height = "0px";
            element3.children[3].style.pointerEvents = "none";
        }
    });
}

function handleScheduleClick(elm, data2){
    if(dropdownOpen===true){
        handleDropdown()
    }
    if(activeElement){activeElement.style.filter = "brightness("+activeElement.style.strokeWidth+")";}
    const index = Array.from(elm.parentElement.children).indexOf(elm)
    console.log(index)
    if(index==popupIndex){
        closePopup()
        return
    }
    
    if(data2!=null){
        popupIndex = index
        activeElement = elm
        elm.style.filter = "brightness(0.9)";
        var data = data2[index]
        console.log(data)
        const bounds = elm.getBoundingClientRect()
        
        modifyElements(".schedulePopUp",element => {
            element.style.display = "flex"
            
            openPopup = true
            if(data!=null){
                element.children[0].style.display = "flex"
                element.children[1].style.display = "none"
                var offset = (bounds.top+(bounds.height/2))+(element.getBoundingClientRect().height/2)
                if(offset>(window.innerHeight)){
                    offset = window.innerHeight-10
                }
                element.style.top = (offset-element.getBoundingClientRect().height)+"px"
                element.style.left = (bounds.left+bounds.width+12)+"px"

                element.children[0].children[0].children[0].children[0].children[1].innerHTML = data.teacher
                element.children[0].children[1].children[0].children[1].innerHTML = data.course
                element.children[0].children[2].children[1].innerHTML = "Room "+data.classroom
                element.children[0].children[3].children[0].children[1].innerHTML = "Period "+data.period
            }else{
                element.children[0].style.display = "none"
                element.children[1].style.display = "flex"
                var offset = (bounds.top+(bounds.height/2))+(element.getBoundingClientRect().height/2)
                if(offset>(window.innerHeight)){
                    offset = window.innerHeight-10
                }
                element.style.top = (offset-element.getBoundingClientRect().height)+"px"
                element.style.left = (bounds.left+bounds.width+12)+"px"
            }
        }); 
    }else{
        closePopup()
    }
}

function closePopup(){
    if(activeElement!=null){
        activeElement.style.filter = "brightness("+activeElement.style.strokeWidth+")";
    }
    modifyElements(".schedulePopUp",element => {
        element.style.display = "none"
        popupIndex = -1;
        openPopup = false
    })
}