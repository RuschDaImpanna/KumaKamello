const form = document.getElementById('tableSettings');
//const schedule = document.querySelector(".schedule");

const setting = ['', 0, 4, 420, 1140, 2, false]

form.addEventListener("change", () => {

    readSettings()
    createTable()

})

form.addEventListener("reset", () => { 

    setTimeout(() => {

        readSettings()
        createTable()
        
    }, 0)

})

function readSettings() {

    //Title
    setting[0] = form.title.value

    //Days
    setting[1] = [...form.initDay].findIndex(obj => obj.checked)
    setting[2] = [...form.finalDay].findIndex(obj => obj.checked)

    //Time
    setting[3] = form.initTime.value
    setting[4] = form.endTime.value

    timeFloor(setting[3], form.initTime)
    timeFloor(setting[4], form.endTime)

    //Unit time
    setting[5] = [...form.units].findIndex(obj => obj.checked)

    if (setting[5] < 2){

        document.getElementById('deadtime').disabled = false

    } else {

        document.getElementById('deadtime').checked = false
        document.getElementById('deadtime').disabled = true

    }

    //Deadtime
    setting[6] = form.deadtime.checked

    console.log(setting)

    function timeFloor(timeStr, sendStr){

        let hour = parseInt(timeStr.slice(0,2))
        let min = parseInt(timeStr.slice(-2))

        //In case it floors to 55 min, add +1 hour
        if (Math.floor((min+5)/10) >= 6){

            hour++
            min = 0

        }
        //In case is +11:55 p.m.
        if (hour >= 24){

            hour = 0

        }

        let modIndex = setting.indexOf(timeStr)
        //Convert into a number and snap it to 10 min
        setting[modIndex] = hour*60 + Math.floor(((min+5)/10))*10

        //Remake the string by diving by 60 (hour) and the % with 60 (minutes)
        //The padStart creates 0's if there's space for it by two characters
        newStr =  `${String(Math.floor(setting[modIndex]/60)).padStart(2, '0')}:${String(setting[modIndex] % 60).padStart(2, '0')}`

        //Rewrite the form
        const errorLog = document.getElementById('timeErrorLog');

        if(newStr != timeStr){

            sendStr.value = newStr
            
            errorLog.innerText = 'Only 10 min-based time available'
            errorLog.hidden = false

        }

    }

}

function createTable() {

    //Set title
    document.getElementById('tableTitle').innerHTML = setting[0]

    //Calculate x table
    const xSize = ((setting[2] - setting[1] + 7) % 7) + 1;

    console.log(xSize)

    //Calculate y table
    const unitSize = [45, 50, 60]
    const unit = unitSize[setting[5]]

    let startTime = setting[3]
    let endTime = setting[4]

    //If wraps 11:00 p.m. 12:00 a.m.
    const yWrap = startTime > endTime

    if(yWrap){

        endTime = setting[4] + 1440

    }

    //Fix start to fit unit
    const gridStart = Math.floor(startTime / unit) * unit
    fitToUnit(gridStart, startTime, form.initTime)

    //If the grid doesn't fit, add +1 unit
    const gridEnd = Math.ceil(endTime / unit) * unit  

    function fitToUnit (fixed, old, formParam){

        const errorLog = document.getElementById('timeErrorLog');

        if(fixed != old){

            formParam.value = `${String(Math.floor(fixed/60)).padStart(2, '0')}:${String(fixed%60).padStart(2, '0')}`
            
            errorLog.innerText = 'Not compatible unit. Time rearranged'
            errorLog.hidden = false

        }

    }

    

    const ySize = ((gridEnd - gridStart) / unit)

    console.log(yWrap)
    console.log(startTime + ' | ' + endTime)
    console.log(gridEnd)
    console.log (ySize)

}