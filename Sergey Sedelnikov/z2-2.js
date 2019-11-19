const fs = require('fs');
const minimist = require('minimist');
const argv = minimist(process.argv.splice(2));

var file = argv._[0];
var parties = 0;
var winparts = 0;
var losparts = 0;
var winstreak = 0;
var losstreak = 0;

fs.readFile(file,'utf8',(err,data)=>{
    if(err){
        console.log(err);
    }
    
    var arr = data.split(' ');
    arr.pop();
    
    var earlypart = 0;
    var countwin = 1;
    var countlos = 1;
    
    for(var i=0;i<arr.length;i++){
        //всего
        parties += 1;
        
        //побед|поражений
        if(arr[i]==1)
            winparts += 1
        else
            losparts += 1;
        
        //streak-и
        if(earlypart == arr[i])
            if(arr[i] == 1)
                countwin += 1
            else
                countlos += 1
        else
            if(arr[i] == 1){ 
                countwin = 1
            }else{
                countlos = 1
            }
        
        if(countlos > losstreak)
            losstreak = countlos
        if(countwin > winstreak)
            winstreak = countwin
        
        earlypart = arr[i]
    }
    
    console.log('Всего партий: ' + parties);
    console.log('Выиграно партий: ' + winparts);
    console.log('Проиграно партий: ' + losparts);
    console.log('Выиграно партий подряд: ' + winstreak);
    console.log('Проиграно партий подряд: ' + losstreak);
})