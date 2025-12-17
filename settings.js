const form = document.getElementById('tableSettings')
const table = document.querySelector(".table")
const tableTitle = document.getElementById('tableTitle')

const setting = ['', 0, 4, 420, 1140, 2, false, true]

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

function dynamicText(){

    //Title
    setting[0] = form.title.value

    //Set title
    tableTitle.innerHTML = setting[0]

}

function readSettings() {

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
            
            errorLog.hidden = false

            setTimeout(() => {
                errorLog.hidden = true;
            }, 3000)

        }

    }

    //24-hour based format
    setting[7] = form.format.checked

}

function createTable() {

    //Calculate size
    const {xSize, ySize, unit, yWrap} = calculateSize()

    //Create table
    table.innerHTML = ''

    


    for (let y = 0; y < ySize+1; y++) {

        //Actual time
        const rawFirstTime = setting[3]+unit*(y-1)
        //Next time
        const rawSecondTime = setting[3]+unit*y

        //Calculate the relative to 12:00 a.m. by its unit and initTime
        const dayStart = Math.ceil((0 - rawFirstTime) / unit) * unit + rawFirstTime
        //Calculate the relative to 11:00 p.m. by its unit and initTime (unused)
        //const dayEnd = Math.floor((1440 - rawFirstTime) / unit) * unit + rawFirstTime

        // First segment: 12 a.m. → endTime
        const firstSegmentLength = Math.floor((setting[4] - dayStart) / unit) + 1
        //Line gap
        const hasGap = ((setting[4] + unit) % 1440) !== setting[3]

        for (let x = 0; x < xSize+1; x++) {

            const cell = document.createElement('div')

            

            //The useless corner
            if (x === 0 && y === 0) {

                cell.classList.add('corner')

            }
            //Days Header
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
                text.style.textAlign = 'center'
                cell.appendChild(text)

            }
            //Time Header
            else if (x === 0) {

                cell.classList.add('timeHeader')

                const text = document.createElement('h4')

                let firstHour
                let firstMinute

                let secondHour
                let secondMinute

                //If it doesn't wraps
                if (!yWrap) {

                    //Parse into undestandable time
                    firstHour = Math.floor(rawFirstTime/60)
                    firstMinute = (rawFirstTime) % 60

                    secondHour = Math.floor(rawSecondTime/60)
                    secondMinute = rawSecondTime % 60

                } else {

                    //50 min is broken

                    let currentTime

                    if (y <= firstSegmentLength) {

                        currentTime = dayStart + unit * (y - 1)

                    } 
                    // Second segment: startTime → 11 p.m.
                    else {

                        currentTime = setting[3] + unit * (y - firstSegmentLength - 1)

                    }

                    //If yWrap has separation, create a divider
                    if (hasGap && y === firstSegmentLength + 1) {

                        cell.classList.add('wrapDivider')

                    }

                    const nextTime = currentTime + unit

                    // Normalize
                    const firstNorm = currentTime % 1440
                    const secondNorm = nextTime % 1440

                    // Parse into undestandable time
                    firstHour = Math.floor(firstNorm / 60)
                    firstMinute = firstNorm % 60

                    secondHour = Math.floor(secondNorm / 60)
                    secondMinute = secondNorm % 60

                }

                //Check if it's a.m. of p.m.
                const firstSet = rawFirstTime < 720 ? 'a.m.':'p.m'
                const secondSet = rawFirstTime < 720 ? 'a.m.':'p.m'
                    
                //Format to 12-hour based time
                if (!setting[7]){

                    firstHour = firstHour % 12 || 12
                    secondHour = secondHour % 12 || 12

                } 

                //Place the text, padStart for 00:00 format, and if !setting[7], place a.m. or p.m.
                text.innerText = `${String(firstHour).padStart(2, '0')}:${String(firstMinute).padStart(2, '0')} ${!setting[7] ? firstSet : ''} - ${String(secondHour).padStart(2, '0')}:${String(secondMinute).padStart(2, '0')} ${!setting[7] ? secondSet : ''}`

                text.style.textAlign = 'center'
                cell.appendChild(text)

            }
            else {

                cell.classList.add('slot')

                if(yWrap && hasGap && y === firstSegmentLength + 1){
                
                    cell.classList.add('wrapDivider')

                }

            }

            cell.id = `${String(x)}${String(y).padStart(2, '0')}`
            table.appendChild(cell)

        }
    }

    table.style.gridTemplateColumns = `repeat(${xSize + 1}, 1fr)`
    table.style.gridTemplateRows = `repeat(${ySize + 1}, 50px)`
    table.style.gap = '5px'

    console.log(xSize)
    console.log(ySize)

    styleTweaks()

    //Get xSize to CSS
    document.documentElement.style.setProperty('--xSize', xSize+1)

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

        const duration = endTime - startTime
        const steps = Math.ceil(duration / unit)

        //If the grid doesn't fit, rearrenges the grid
        const gridEnd = startTime + steps * unit
        fitToUnit(gridEnd % 1440, endTime % 1440, form.endTime)
        setting[4] = gridEnd % 1440

        //Change the display on the form
        function fitToUnit (fixed, old, formParam){

            const incompLog = document.getElementById('incompErrorLog');

            if(fixed != old){

                formParam.value = `${String(Math.floor(fixed/60)).padStart(2, '0')}:${String(fixed%60).padStart(2, '0')}`
            
                incompLog.hidden = false

                setTimeout(() => {
                    incompLog.hidden = true;
                }, 3000)

            }
        }

        const ySize = steps + 1
        console.log(setting)

        return {xSize, ySize, unit, yWrap}

    }

    function styleTweaks(){

        document.getElementById('001').style.borderRadius = '15px 0 0 0'

        //Right top border
        if (xSize > 1){

            document.getElementById('100').style.borderRadius = '15px 0 0 0'
            document.getElementById(xSize + '00').style.borderRadius = '0 15px 0 0'

        } else {

            document.getElementById('100').style.borderRadius = '15px 15px 0 0'

        }

        //Left bottom border
        if (ySize > 1){

            document.getElementById('0' + String(ySize).padStart(2, '0')).style.borderRadius = '0 0 0 15px'

        } else {

             document.getElementById('001').style.borderRadius = '15px 0 0 15px'

        }


        document.getElementById(xSize + String(ySize).padStart(2, '0')).style.borderRadius = '0 0 15px 0'

    }

}