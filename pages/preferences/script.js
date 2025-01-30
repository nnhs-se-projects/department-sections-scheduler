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