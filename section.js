//Import all settings
import { deleteClass } from "./class.js";
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
                for (let i = setting[1]-1; i < setting[2]; i++) {

                    const radio = document.createElement('input')
                    radio.type = 'radio'
                    radio.id = `ADay${sectionObj.id}-${i}`
                    radio.name = `ADays${sectionObj.id}`
                    
                    const label = document.createElement('label')
                    label.htmlFor = `ADay${sectionObj.id}-${i}`
                    label.innerHTML = daysParse[i+1]

                    ADays.append(radio, label)

                }

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

                const modHour = (Number(AInitTime.value.slice(0,2))+controller.unitLength)%24
                const modTime = `${modHour}:${AInitTime.value.slice(-2)}`
                
                console.log(AInitTime.value.slice(0,2))
                console.log(modTime)

                AEndTime.disabled = false

                timeFloor(sectionObj, 'aEndHour', modTime, AEndTime)

                AEndTime.disabled = true

            }

        ATime.append(ATitle, ADays, AInitTimeLabel, AInitTime, AEndTimeLabel, AEndTime)

    controls.append(nameInput, codeInput, ATime)

    panel.append(header, controls)

    //Ship it
    const sectionPark = document.querySelector('.sectionPark'+controller.id)

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
        aDay: 0,
        aInitHour : 0,
        aEndHour : 0,
        splitSection : false,
        bDay: 0,
        bInitHour : 0,
        bEndHour : 0,

    }

    sections.push(basicSection)

    createSectionPanel(controller,sections[sections.length-1])


    alert('New section')

}