//Import all settings
import { classController, deleteClass } from "./class.js";
import { setting, timeFloor } from "./settings.js";

const daysParse = {

    0:'Monday',
    1:'Tuesday',
    2:'Wednesday',
    3:'Thursday',
    4:'Friday',
    5:'Saturday',
    6:'Sunday'

}

function createSectionPanel (controller, sectionObj) {

    //Create div
    const panel = document.createElement('div')
    panel.classList.add('sectionPanel')
    panel.dataset.id = sectionObj.id

    //Create a header
    const header = document. createElement('div')
    header.classList.add('sectionPanelHeader')

        //Teacher's name
        const title = document.createElement('h3')
        title.innerText = sectionObj.teacher

        //Code display
        const codeDisplay = document.createElement('p')
        codeDisplay.innerText = sectionObj.code

        //Delete button
        const deleteBtn = document.createElement('button')
        deleteBtn.innerText = 'Delete'
        deleteBtn.onclick = () => deleteClass(sectionObj.id, sectionObj, controller) //Delete function

        //Push and title to header
        header.append(title, codeDisplay, deleteBtn)

    //Create settings
    const controls = document.createElement('div')
    controls.classList.add('sectionPanelControlls')

        //Title input
        const nameInput = document.createElement('input')
        nameInput.type = 'text'
        nameInput.placeholder = `Teacher's name`
        nameInput.maxLength = 32

        //OnInput, changes on real time
        nameInput.oninput = () => {

            //Rewrite title at classController object
            sectionObj.title = nameInput.value
            //Dynamically, change text on real time
            title.innerText = nameInput.value

        }

        //Code input
        const codeInput = document.createElement('input')
        codeInput.placeholder = 'Code'
        codeInput.type = 'number'
        codeInput.min = 0
        codeInput.max = 999999

        codeInput.oninput = () => {

            //Rewrite first length at classController object
            const inputValue = Number(codeInput.value)

            //In case it's an invalid input, use the last value
            if (Number.isNaN(inputValue) || inputValue == ''){

                codeInput.value = sectionObj.code

            }

            //Take the value between 0 to 9999
            const clampValue = Math.min(Math.max(inputValue, 0), 999999)

            //Change the controller and the display
            codeInput.value = String(clampValue).padStart(6, '0')
            sectionObj.code = String(clampValue).padStart(6, '0')

            //Dynamically, change text on real time
            codeDisplay.innerText = codeInput.value
            //document.getElementById('labelPlacedBlock'+controller.id).innerText = codeInput.value


        }

        //A Time
        const ATime = document.createElement('div')
        ATime.classList.add('ATime')

            //A title
            const ATitle = document.createElement('h3')
            ATitle.innerText = 'Section class schedule'
            ATitle.id = `ATitle${sectionObj.id}`

            //A days
            const ADays = document.createElement('div')
            ADays.classList.add(`ADays`)

                //All days
                daysCreation(ADays, sectionObj)

            //A Initial time
            const AInitTimeLabel = document.createElement('label')
            AInitTimeLabel.htmlFor = `AInitTime${sectionObj.id}`
            AInitTimeLabel.innerText = 'Initial time'

            const AInitTime = document.createElement('input')
            AInitTime.type = 'time'

            AInitTime.name = 'ATime'
            AInitTime.id = `AInitTime${sectionObj.id}`

            //A End time
            const AEndTimeLabel = document.createElement('label')
            AEndTimeLabel.htmlFor = `AEndTime${sectionObj.id}`
            AEndTimeLabel.innerText = 'End time'

            const AEndTime = document.createElement('input')
            AEndTime.type = 'time'
            AEndTime.disabled = true

            AEndTime.name = 'ATime'
            AEndTime.id = `AEndTime${sectionObj.id}`

            //Time fixes
            AInitTime.onblur = () => {

                timeFloor(sectionObj, 'aInitHour', AInitTime.value, AInitTime)

                const time = {

                    0:45,
                    1:50,
                    2:60

                }

                const addTime = time[setting[5]]*controller.unitLength

                let hour = parseInt(AInitTime.value.slice(0,2))
                let min = parseInt(AInitTime.value.slice(-2))

                const modTime = (hour*60 + Math.floor(((min+5)/10))*10)+addTime
                const timeStr = `${String(Math.floor(modTime/60)).padStart(2, '0')}:${String(modTime % 60).padStart(2, '0')}`
                
                sectionObj.aEndHour = modTime
                AEndTime.value = timeStr

            }

        ATime.append(ATitle, ADays, AInitTimeLabel, AInitTime, AEndTimeLabel, AEndTime)

        //For splitBlock
        const splitLabel = document.createElement('label')
        splitLabel.id = 'splitLabel_' + sectionObj.id
        splitLabel.htmlFor = 'splitFor' + sectionObj.id
        splitLabel.innerText = 'Split to double class'


        const splitBtn = document.createElement('input')
        splitBtn.type = 'checkbox'
        splitBtn.id = 'splitFor' + sectionObj.id

        //B Time
        const BTime = document.createElement('div')
        BTime.classList.add('BTime')
        BTime.hidden = true

            //B title
            const BTitle = document.createElement('h3')
            BTitle.innerText = 'Second segment schedule'
            BTitle.id = `BTitle${sectionObj.id}`

            //B days
            const BDays = document.createElement('div')
            BDays.classList.add(`BDays`)

                //All days
                daysCreation(BDays, sectionObj)

            //B Initial time
            const BInitTimeLabel = document.createElement('label')
            BInitTimeLabel.htmlFor = `BInitTime${sectionObj.id}`
            BInitTimeLabel.innerText = 'Initial time'

            const BInitTime = document.createElement('input')
            BInitTime.type = 'time'

            BInitTime.name = 'BTime'
            BInitTime.id = `BInitTime${sectionObj.id}`

            //B End time
            const BEndTimeLabel = document.createElement('label')
            BEndTimeLabel.htmlFor = `AEndTime${sectionObj.id}`
            BEndTimeLabel.innerText = 'End time'

            const BEndTime = document.createElement('input')
            BEndTime.type = 'time'
            BEndTime.disabled = true

            BEndTime.name = 'BTime'
            BEndTime.id = `BEndTime${sectionObj.id}`

            //Time fixes
            BInitTime.onblur = () => {

                timeFloor(sectionObj, 'aInitHour', BInitTime.value, BInitTime)

                const time = {

                    0:45,
                    1:50,
                    2:60

                }

                const addTime = time[setting[5]]*controller.secondLength

                let hour = parseInt(BInitTime.value.slice(0,2))
                let min = parseInt(BInitTime.value.slice(-2))

                const modTime = (hour*60 + Math.floor(((min+5)/10))*10)+addTime
                const timeStr = `${String(Math.floor(modTime/60)).padStart(2, '0')}:${String(modTime % 60).padStart(2, '0')}`

                sectionObj.bEndHour = modTime
                BEndTime.value = timeStr


            }

        BTime.append(BTitle, BDays, BInitTimeLabel, BInitTime, BEndTimeLabel, BEndTime)

        //Section park
        const sectionPark = document.querySelector('.sectionPark'+controller.id)

        //Checkbox actions
        splitBtn.onclick = () => {

            const splitsChk = sectionPark.querySelectorAll('.sectionPanelControlls input[type=checkbox]')
            controller.splitBlock = [...splitsChk].some(chk => chk.checked)

            const secondHourInput = document.getElementById('SlI_'+controller.id)

            if (controller.splitBlock){

                BTime.hidden = false
                secondHourInput.hidden = false

                ATitle.innerText = 'First segment schedule'

            } else {

                BTime.hidden = true
                secondHourInput.hidden = true

                ATitle.innerText = 'Section class schedule'

            }

        }


    controls.append(nameInput, codeInput, ATime, document.createElement('br'), splitLabel, splitBtn, BTime)

    panel.append(document.createElement('br'), header, controls)

    //Ship it
    console.log(sectionPark)
    sectionPark.appendChild(panel)

}

//This is for new each segment for each class block
export function addSection(controller) {

    const sections = controller.sections

    let nextSectionId = sections[sections.length-1] === undefined ? 0:sections[sections.length-1].id+1

    const basicSection = {

        id : nextSectionId,
        code :'000000',
        teacher : `Teacher's name`,
        aDay: -1,
        aInitHour : 0,
        aEndHour : 0,
        splitSection : false,
        bDay: -1,
        bInitHour : 0,
        bEndHour : 0,
        selected: false

    }

    sections.push(basicSection)

    createSectionPanel(controller,sections[sections.length-1])


    alert('New section')

}

function daysCreation (container, sectionObj){

    for (let i = setting[1]-1; i < setting[2]; i++) {

        const radio = document.createElement('input')
        radio.type = 'radio'
        radio.id = `ADay${sectionObj.id}-${i}`
        radio.name = `ADays${sectionObj.id}`
        radio.value = i+1
                    
        const label = document.createElement('label')
        label.htmlFor = `ADay${sectionObj.id}-${i}`
        label.innerHTML = daysParse[i+1]

        radio.onclick = () => {

            sectionObj.aDay = Number(radio.value)

        }

        container.append(radio, label)

    }

}

//If the table refreshes
document.addEventListener(('updateTable'), () => {

    const sectionPanel =  [...document.querySelectorAll('.sectionPanel')]

    sectionPanel.forEach(element => {

        const textId = element.parentNode.classList[0]

        const id = Number(textId.slice(11))
        const subId = Number(element.dataset.id)

        const ADays = element.querySelector('.ADays')
        const BDays = element.querySelector('.BDays')
        const ATimes = [...element.querySelectorAll('.ATime input[name=ATime]')]
        const BTimes = [...element.querySelectorAll('.BTime input[name=BTime]')]

        const section = classController[id].sections.find((s) => s.id === subId)

        ADays.innerHTML = ''
        daysCreation(ADays, section)

        BDays.innerHTML = ''
        daysCreation(BDays, section)

        ATimes.forEach(element => {

            element.value = ''
        
        });
        BTimes.forEach(element => {

            element.value = ''
        
        });

        
    });

})