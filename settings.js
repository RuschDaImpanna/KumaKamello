const form = document.getElementById('tableSettings');
const table = document.querySelector(".table")

const setting = ['', 0, 4, 420, 1140, 2, false]

createTable()

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

            setTimeout(() => {
                errorLog.hidden = true;
            }, 3000)

        }

    }

}

function createTable() {

    //Set title
    document.getElementById('tableTitle').innerHTML = setting[0]

    //Calculate size
    const {xSize, ySize} = calculateSize()

    //Create table
    table.innerHTML = ''
    for (let y = 0; y < ySize+1; y++) {
        for (let x = 0; x < xSize+1; x++) {

            const cell = document.createElement('div')

            if (x === 0 && y === 0) {

                cell.classList.add('corner')

            }
            else if (y === 0) {

                cell.classList.add('dayHeader')

                const days = {

                    0:'Monday',
                    1:'Tuesday',
                    2:'Wednesday',
                    3:'Thursday',
                    4:'Friday',
                    5:'Saturday',
                    6:'Sunday'

                }

                const text = document.createElement('h3')
                text.innerText = days[(setting[1]+(x-1)) % 7]
                cell.appendChild(text)

            }
            else if (x === 0) {

                cell.classList.add('timeHeader')

            }
            else {

                cell.classList.add('slot')

            }

            cell.id = `${String(x)}${String(y).padStart(2, '0')}`
            table.appendChild(cell)
        }
    }

    table.style.display = 'grid'
    table.style.gridTemplateColumns = `repeat(${xSize + 1}, 1fr)`
    table.style.gridTemplateRows = `repeat(${ySize + 1}, 40px)`
    table.style.gap = '5px'




    function calculateSize(){

        //Calculate x table
        const xSize = ((setting[2] - setting[1] + 7) % 7) + 1;

        //Calculate y table
        const unitSize = [45, 50, 60]
        const unit = !setting[6] ? unitSize[setting[5]]:unitSize[2]

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
        setting[3] = gridStart

        //If the grid doesn't fit, add +1 unit
        const gridEnd = Math.ceil(endTime / unit) * unit
        fitToUnit(gridEnd, endTime, form.endTime)
        setting[4] = gridEnd

        //Change the display on the form
        function fitToUnit (fixed, old, formParam){

            const errorLog = document.getElementById('timeErrorLog');

            if(fixed != old){

                formParam.value = `${String(Math.floor(fixed/60)).padStart(2, '0')}:${String(fixed%60).padStart(2, '0')}`
            
                errorLog.innerText = 'Not compatible unit. Time rearranged'
                errorLog.hidden = false

                setTimeout(() => {
                    errorLog.hidden = true;
                }, 3000)

            }

        }

        const ySize = ((gridEnd - gridStart) / unit)+1
        console.log(setting)

        return {xSize, ySize}

    }

    console.log(xSize)
    console.log (ySize)

    

}