const fs = require('fs');

// add preference to teachers
// lunch period, free period, classroom preference
// convert to ints?

module.exports.loadFromFile = loadFromFile;
module.exports.createSchedule = createSchedules;
module.exports.writeToCSV = writeToCSV;
module.exports.writeToJSON = writeToJSON;
module.exports.getCourseData = getCourseData;
module.exports.getTeacherData = getTeacherData;
module.exports.getClassroomData = getClassroomData;
module.exports.setCourseData = setCourseData;
module.exports.setTeacherData = setTeacherData;
module.exports.setClassroomData = setClassroomData;


var classrooms = null;
var courses = null;
var teachers = null;

async function loadFromFile(){
    classrooms = await JSON.parse(await fs.readFileSync('classrooms.json',{encoding:'utf8',flag:'r'})).sem1;
    courses = await JSON.parse(await fs.readFileSync('courses.json',{encoding:'utf8',flag:'r'})).sem1;
    teachers = await JSON.parse(await fs.readFileSync('teachers.json',{encoding:'utf8',flag:'r'})).sem1;
}

async function createSchedules(callback) {
    const CTpairs = createCTpairs(teachers);
    const RPpairs = createRPpairs(classrooms);
    const newCTpairs = evaluatePairs(CTpairs,RPpairs,courses);
    newCTpairs.sort((a,b)=>{return a.RPpairs.length - b.RPpairs.length})
    var teacherPairs = createTeacherPairs(newCTpairs)

    const solution = convertFormat(testRandomSolutions(teacherPairs),classrooms)

    callback(solution, classrooms)

    //add double semester compatability check
}

function getCourseData(){
    return courses
}

function getTeacherData(){
    return teachers
}


function getClassroomData(){
    return classrooms
}

function setCourseData(data){
    courses = data
}
function setTeacherData(data){
    teachers = data
}
function setClassroomData(data){
    classrooms = data
}

async function writeToJSON(){
    console.log("test")

}



async function writeToCSV(data){
    let writer = "Teacher,Period 1,Period 2,Period 3,Period 4,Period 5,Period 6,Period 7,Period 8"

    const PATH = "pages/view/downloads/schedule.csv"

    for(let i=0;i<teachers.length;i++){
        tempData = ["Empty","Empty","Empty","Empty","Empty","Empty","Empty","Empty"]
        for(const a of data){
            if(a!=null){
                if(a.teacher==teachers[i].name){
                    tempData[a.period-1]='"'+a.course+" - "+a.classroom+'"'
                }
            }
        }
        writer += '\n"'+teachers[i].name+'",'+tempData.join(",")
    }
    await fs.writeFileSync(PATH,writer)
    return true
}

async function writeToJSON(data){
    const PATH = "pages/view/downloads/schedule.json"
    fs.writeFileSync(PATH,JSON.stringify(data))
}



var t0 = Date.now()
//createSchedules(()=>{})
console.log((Date.now()-t0)+" ms elapsed")

function convertFormat(solution){
    var counter = 0
    var roomNumList = []
    for(const a of classrooms){
        roomNumList.push(parseInt(a.roomNum))
    }

    //sort roomNumList from lowest to highest
    roomNumList.sort((a,b)=>{return a-b})

    var solution2 = []
    for(let i=0;i<classrooms.length*8;i++){
        solution2.push(null)
    }
    for(const a of solution){
        for(const b of a.courses){
            //get the index of b.RPpair.classroom in roomNumList
            const index = roomNumList.indexOf(parseInt(b.RPpair.classroom))
            const index2 = (index*8)+(b.RPpair.period-1)
            //console.log(index2)
            counter++
            solution2[index2]={teacher: a.teacher, course: b.course, classroom: b.RPpair.classroom, period: b.RPpair.period}
        }
    }
    return solution2
}

function testRandomSolutions(teacherPairs){
    for(const a of teacherPairs){
        //a.pairs[0][0].RPpair.classroom = parseInt(a.pairs[0][0].RPpair.classroom)
    }
    var overlapCounter = 0;
    var solutionCount = 0
    for(let i=0;i<10000000;i++){
        var solutionList = []
        var valid = true;
        for(const a of teacherPairs){
            const solution = findTeacherSolution(a,solutionList)
            if(solution==null){
                valid = false
                break
            }else{
                solutionList.push({teacher:a.teacher,courses:solution})
            }
            if(valid===false){break}
        }        
        if(valid){
            solutionCount++
            if(checkFourPeriods(solutionList)==false){overlapCounter++}
            //console.dir(solutionList[66],{depth:4})
        }
        
        if(solutionCount==1){
            //console.log(solutionList)
            break
        }
    }
    //console.dir(solutionList,{depth:4})
    console.log(solutionCount+" Solutions Found! "+overlapCounter)
    return solutionList;
}

//1000:
//5.989

function findTeacherSolution(teacher,solutionList){
    const teacher2 = {teacher:teacher.teacher,pairs:[]}
    //get all periods that a teacher has
    var periods2 = [0,0,0,0,0,0,0,0]
   
    for(const a of solutionList){
        //console.log(a.courses[0].RPpair)
        if(a.teacher===teacher.teacher){
            periods2[a.courses[0].RPpair.period-1]++
        }
    }
    for(const a of teacher.pairs){
        var pairToPush = []
        for(const b of a){
            var overlap = false
            for(const c of solutionList){
                for(const d of c.courses){
                    if(periods2[b.RPpair.period-1]>0){
                        overlap = true
                        break
                    }
                    if(d.RPpair.classroom === b.RPpair.classroom && d.RPpair.period === b.RPpair.period){
                        overlap = true
                        break
                    }
                }
                if(overlap){break}
            }
            if(overlap === false){pairToPush.push(b)}
        }
        if(pairToPush.length === 0){return null}
        teacher2.pairs.push(pairToPush)
    }
    
    const randStart = Math.floor((Math.random()*teacher2.pairs[0].length))
    var item = null

    for(let i=0;i<teacher2.pairs[0].length;i++){  
        var periods = [periods2[0],periods2[1],periods2[2],periods2[3],periods2[4],periods2[5],periods2[6],periods2[7]]
        var valid = true
        //console.log(((randStart+i)===0)?(0):(teacher2.pairs[0].length+" "+(randStart+i)+" "+teacher2.pairs[0].length%(randStart+i)))
        item = teacher2.pairs[0][((randStart+i)===0)?(0):((randStart+i)%teacher2.pairs[0].length)]
        //var item = teacher2.pairs[0][Math.floor((Math.random()*teacher2.pairs[0].length))]
        periods[item.RPpair.period-1]++

        if((!(periods[3]>0&&periods[4]>0&&periods[5]>0))&&(!check4periods(periods))){
            return [item]
        }
    }
    return null
}

function checkFourPeriods(solutionList){
    var overlaps = 0;
    for(const a of teachers){
        var periods2 = [0,0,0,0,0,0,0,0]
        for(const b of solutionList){
            //console.log(a.courses[0].RPpair)
            if(b.teacher===a.name){
                periods2[b.courses[0].RPpair.period-1]++
            }
        }
        //console.log(periods2)

        if(check4periods(periods2)){overlaps++}
    }
    if(overlaps>0){
        return false
    }else{
        return true
    }
}

function createTeacherPairs(newCTpairs){
    var pairs = []
    for(const a of newCTpairs){
        a.teacherID = Math.random()
        var foundPair = pairs.find((b)=>{return b.teacherID == a.teacherID})
        if(foundPair == undefined){
            foundPair = {teacher: a.teacher,teacherID: a.teacherID, pairs: [{course:a.course, RPpairs: a.RPpairs}]}
            pairs.push(foundPair)
        }else{
            foundPair.pairs.push({course:a.course, RPpairs: a.RPpairs})
        }
    }
    var pairs2 = []
    for(const a of pairs){
        var pairToAdd = []
        for(const b of a.pairs){
            var pairToAdd2 = []
            for(const c of b.RPpairs){
                pairToAdd2.push({course: b.course, RPpair: c})
            }
            pairToAdd.push(pairToAdd2)
        }
        pairs2.push({teacher:a.teacher,pairs:pairToAdd})
    }
    return pairs2
}

function check4periods(periods){
    var periodCount = 0;
    for(const a of periods){
        if(a>0){periodCount++
            if(periodCount>3){
                return true
            }
        }else{
            periodCount = 0
        }
    }
    return false
}

function evaluatePairs(CTpairs,RPpairs,courses){
    var newPairs = []
    for(const a of CTpairs){
        var newPair = {teacher: a.teacher, course: a.course, RPpairs: []}

        const courseData = courses.find((i)=>{
            return i.name==a.course
        })
        for(const b of RPpairs){
            const classroom = b.classroom
            const period = b.period
            try{
                if(courseData.compatiblePeriods.includes(period) && courseData.compatibleClassrooms.includes(classroom)){
                    newPair.RPpairs.push({classroom: classroom, period: period})
                }
            }catch(err){
                console.error("Could not find course data for "+a.course)
            }
        }
        newPairs.push(newPair)
    }
    return newPairs
}

function createCTpairs(teachers) {
    var pairs = []
    for(const a of teachers){
        for(const b of a.coursesAssigned){
            for(let i=0;i<b.sections;i++){
                pairs.push({
                    teacher: a.name,
                    course: b.course,
                })
            }
        }
    }
    return pairs;
}

function createRPpairs(classrooms) {
    var pairs = []
    for(const a of classrooms){
        for(const b of a.periodsAvailable){
            pairs.push(
                {    
                    classroom: a.roomNum,
                    period: b
                }
            )
        }
    }
    return pairs;
}