const num1 = 1
const num2 = 2

var t0=0

const str1 = 'hello'
const str2 = str1

t0 = Date.now()
for(let i=0;i<1000000000;i++){
    if(str1===str2){}
}
console.log(Date.now()-t0)







t0 = Date.now()
for(let i=0;i<1000000000;i++){
    if(num1==num2){}
}
console.log(Date.now()-t0)

t0 = Date.now()
for(let i=0;i<1000000000;i++){
    if(num1==num2){}
}
console.log(Date.now()-t0)

t0 = Date.now()
for(let i=0;i<1000000000;i++){
    if(num1==num2){}
}
console.log(Date.now()-t0)


