const { create } = require('domain');
const fs = require('fs');

// add preference to teachers
// lunch period, free period, classroom preference

async function createSchedules() {
    const classrooms = JSON.parse(fs.readFileSync('classrooms.json',{encoding:'utf8',flag:'r'}));
    const courses = JSON.parse(fs.readFileSync('courses.json',{encoding:'utf8',flag:'r'}));
    const teachers = JSON.parse(fs.readFileSync('teachers.json',{encoding:'utf8',flag:'r'}));

    const CTpairs = createCTpairs(teachers);
    const RPpairs = createRPpairs(classrooms);
    const newCTpairs = evaluatePairs(CTpairs,RPpairs,courses);
    newCTpairs.sort((a,b)=>{return a.RPpairs.length - b.RPpairs.length})
    //newCTpairs.sort((a,b)=>{return b.RPpairs.length - a.RPpairs.length})
    //console.log(newCTpairs)
    var combinations = 1;
    for(const pair of newCTpairs){
        combinations *= pair.RPpairs.length
    }
    var teacherPairs = createTeacherPairs(newCTpairs)
    //teacherPairs.sort((a,b)=>{return parseInt(b.pairs[0][0].RPpair.classroom) - parseInt(a.pairs[0][0].RPpair.classroom)})
    //console.dir(teacherPairs,{depth:5})
    testRandomSolutions(teacherPairs)

    
}

function testRandomSolutions(teacherPairs){
    var solutionCount = 0
    for(let i=0;i<100000;i++){
        var solutionList = []
        var valid = true;
        for(const a of teacherPairs){
            //pass current solution list to findTeacherSolution
            const solution = findTeacherSolution(a,solutionList)
            if(solution==null){
                valid = false
                break
            }else{
                solutionList.push({teacher:a.teacher,courses:solution})
            }
            if(valid==false){break}
        }
        //console.dir(solutionList,{depth:4})
        
        if(valid){
            solutionCount++
        }
        if(solutionCount==2000){break}
    }
    console.log(solutionCount+" Solutions Found!")
}

function countScheduleOverlap(solutionList){
    var periods = [[],[],[],[],[],[],[],[]]
    var overlap = 0
    for(const a of solutionList){
        for(const b of a.courses){
            if(periods[b.RPpair.period-1].includes(b.RPpair.classroom)){
                overlap+=1
            }else{
                periods[b.RPpair.period-1].push(b.RPpair.classroom)
            }
        }
    }
    return overlap
}

function findTeacherSolution(teacher,solutionList){
    //console.log(teacher.pairs)
    var teacher2 = {teacher:teacher.teacher,pairs:[]}
    for(const a of teacher.pairs){
        var pairToPush = []
        for(const b of a){
            var overlap = false
            for(const c of solutionList){
                for(const d of c.courses){
                    if(d.RPpair.classroom == b.RPpair.classroom && d.RPpair.period == b.RPpair.period){
                        //console.log("OVERLAP")
                        overlap = true
                        break
                    }
                }
                if(overlap){break}
            }
            if(overlap == false){pairToPush.push(b)}
        }
        if(pairToPush.length == 0){return null}
        teacher2.pairs.push(pairToPush)
    }
    //console.dir(teacher2,{depth:5})
    var loopCount = 0
    var pairs = []
    while(true){
        loopCount++
        pairs = []
        var periods = [0,0,0,0,0,0,0,0]
        for(const a of teacher2.pairs){
            var item = a[Math.floor((Math.random()*a.length))]
            periods[item.RPpair.period-1]++
            if(periods[item.RPpair.period-1]>1){break}
            if(periods[3]>0&&periods[4]>0&&periods[5]>0){break}
            if(check4periods(periods)){break}
            pairs.push(item)
        }
        if(pairs.length == teacher2.pairs.length){
            break
        }
        if(loopCount>800){
            //console.log("LOOP OVERFLOW")
            return null
        }
    }
    return pairs
}

function createTeacherPairs(newCTpairs){
    var pairs = []
    for(const a of newCTpairs){
        //console.log(a)
        var foundPair = pairs.find((b)=>{return b.teacher == a.teacher})
        if(foundPair == undefined){
            foundPair = {teacher: a.teacher, pairs: [{course:a.course, RPpairs: a.RPpairs}]}
            pairs.push(foundPair)
        }else{
            foundPair.pairs.push({course:a.course, RPpairs: a.RPpairs})
        }
    }
    // [{course:, RPpair:{}}]
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
    
    //console.dir(pairs2,{depth:5})

    return pairs2
}

//
//function getPair(pair)

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

function checkDuplicatePointers(pointerCount){
    for(const a of pointerCount){
        if(a>1){return true}
    }
    return false
}

function evaluatePairs(CTpairs,RPpairs,courses){
    //console.log(courses)
    var newPairs = []
    for(const a of CTpairs){
        //console.log(a.course)
        var newPair = {teacher: a.teacher, course: a.course, RPpairs: []}
        const courseData = courses.find((i)=>{return i.name==a.course})
        for(const b of RPpairs){
            const classroom = b.classroom
            const period = b.period
            if(courseData.compatiblePeriods.includes(period) && courseData.compatibleClassrooms.includes(classroom)){
                newPair.RPpairs.push({classroom: classroom, period: period})
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

createSchedules();