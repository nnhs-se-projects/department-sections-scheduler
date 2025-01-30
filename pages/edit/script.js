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


/*
    --dark-hue-1: 272;  --dark-hue-2: 282;  --light-hue-1: 11;   --light-hue-2: 18;
    --dark-sat-1: 100%; --dark-sat-2: 100%; --light-sat-1: 100%; --light-sat-2: 100%;
    --dark-lum-1: 15%;  --dark-lum-2: 23%;  --light-lum-1: 39%;  --light-lum-2: 47%;

    --dark-hue-1: 225;  --dark-hue-2: 342;  --light-hue-1: 352;  --light-hue-2: 8;
    --dark-sat-1: 66%;  --dark-sat-2: 59%;  --light-sat-1: 59%;  --light-sat-2: 68%;
    --dark-lum-1: 10%;  --dark-lum-2: 33%;  --light-lum-1: 47%;  --light-lum-2: 64%;

*/
var pallettes = [
    [[272,100,15],[282,100,23],[11,100,39],[18,100,47]], //original
    [[227,72,10],[241,53,22],[231,27,45],[242,30,66]], //dark blue
    [[222,100,15],[232,100,23],[7,80,40],[18,80,50]],
    [[303,77,22],[340,82,47],[23,100,46],[37,80,60]],
    [[247,36,15],[286,56,21],[352,59,47],[8,68,64]],
    [[319,28,16],[304,16,21],[329,17,48],[32,18,68]],
    [[247,36,15],[286,56,21],[348,43,47],[28,56,54]],
    [[225,66,10],[342,59,33],[352,59,47],[8,68,64]]
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
})