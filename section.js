//Import all settings
import { classController, deleteClass } from "./class.js";
import { setting, timeFloor } from "./settings.js";
import { createDarkColor, splitBlockToDoubleVoucher } from "./blocks.js";
import { callToStep } from "./movingBlocks.js";

const daysParse = {

    0:'Monday',
    1:'Tuesday',
    2:'Wednesday',
    3:'Thursday',
    4:'Friday',
    5:'Saturday',
    6:'Sunday'

}

const timeParse = {

    0:45,
    1:50,
    2:60

}

export const classSlots = []

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
        nameInput.placeholder = `Teacher's name`
        nameInput.type = 'text'
        nameInput.value = sectionObj.teacher
        nameInput.maxLength = 32

        //OnInput, changes on real time
        nameInput.oninput = () => {

            //Rewrite title at classController object
            sectionObj.teacher = nameInput.value
            //Dynamically, change text on real time
            title.innerText = nameInput.value

            const dropTitle = document.querySelectorAll(`#teacherTitle${sectionObj.id}\\.${controller.id}`)

            if (!dropTitle) return

            dropTitle.forEach(txt => {

                txt.innerText = nameInput.value
                
            });

        }

        //Code input
        const codeInput = document.createElement('input')
        codeInput.placeholder = 'Code'
        codeInput.type = 'number'
        codeInput.value = sectionObj.code
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
            
            document.querySelectorAll('#labelPlacedBlock'+controller.id).forEach(element => { element.innerText = codeInput.value })

            const dropCode = document.querySelectorAll(`#codeTitle${sectionObj.id}\\.${controller.id}`)

            if (!dropCode) return

            dropCode.forEach(txt => {
    
                txt.innerText = codeInput.value

            });

        }

        //A Time
        const ATime = document.createElement('div')
        ATime.classList.add('ATime')

            //A title
            const ATitle = document.createElement('h3')
            ATitle.innerText = 'Section class schedule'
            ATitle.id = `ATitle${sectionObj.id}.${controller.id}`

            //A days
            const ADays = document.createElement('div')
            ADays.classList.add(`ADays`)

                //All days
                daysCreation(ADays, sectionObj, controller)

            //A Initial time
            const AInitTimeLabel = document.createElement('label')
            AInitTimeLabel.htmlFor = `AInitTime${sectionObj.id}.${controller.id}`
            AInitTimeLabel.innerText = 'Initial time'

            const AInitTime = document.createElement('input')
            AInitTime.type = 'time'
            AInitTime.value = sectionObj.aInitHour == sectionObj.aEndHour ? '':`${String(Math.floor(sectionObj.aInitHour/60)).padStart(2, '0')}:${String(sectionObj.aInitHour % 60).padStart(2, '0')}`

            AInitTime.name = 'ATime'
            AInitTime.id = `AInitTime${sectionObj.id}.${controller.id}`

            //A End time
            const AEndTimeLabel = document.createElement('label')
            AEndTimeLabel.htmlFor = `AEndTime${sectionObj.id}.${controller.id}`
            AEndTimeLabel.innerText = 'End time'

            const AEndTime = document.createElement('input')
            AEndTime.type = 'time'
            AEndTime.value = sectionObj.aEndHour == sectionObj.aInitHour ? '':`${String(Math.floor(sectionObj.aEndHour/60)).padStart(2, '0')}:${String(sectionObj.aEndHour % 60).padStart(2, '0')}`
            AEndTime.disabled = true

            AEndTime.name = 'ATime'
            AEndTime.id = `AEndTime${sectionObj.id}.${controller.id}`

            //Time fixes
            AInitTime.onblur = () => {

                if (!AInitTime.value) return

                timeFloor(sectionObj, 'aInitHour', AInitTime.value, AInitTime)

                const addTime = timeParse[setting[5]]*controller.unitLength

                if (sectionObj.splitSection && sectionObj.bDay == sectionObj.aDay) {

                    const step = timeParse[setting[5]]
                    const aEnd = sectionObj.aInitHour + addTime

                    for (let t = sectionObj.aInitHour; t < aEnd; t += step) {

                        for (let bT = sectionObj.bInitHour; bT < sectionObj.bEndHour; bT += step) {

                            if (t === bT) {

                                AInitTime.value = ''
                                sectionObj.aInitHour = 0

                                Swal.fire({

                                    title:'Time conflict',
                                    icon:'error',
                                    text: `You can't place the first segment into a time that the second segment is using`

                                })

                                return
                            }
                        }
                    }
                }


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
        splitLabel.id = `splitLabel_${sectionObj.id}.${controller.id}`
        splitLabel.htmlFor = `splitFor${sectionObj.id}.${controller.id}`
        splitLabel.innerText = 'Split to double class'


        const splitBtn = document.createElement('input')
        splitBtn.type = 'checkbox'
        splitBtn.id = `splitFor${sectionObj.id}.${controller.id}`

        //B Time
        const BTime = document.createElement('div')
        BTime.classList.add('BTime')
        BTime.hidden = true

            //B title
            const BTitle = document.createElement('h3')
            BTitle.innerText = 'Second segment schedule'
            BTitle.id = `BTitle${sectionObj.id}.${controller.id}`

            //B days
            const BDays = document.createElement('div')
            BDays.classList.add(`BDays`)

                //All days
                daysCreation(BDays, sectionObj, controller)

            //B Initial time
            const BInitTimeLabel = document.createElement('label')
            BInitTimeLabel.htmlFor = `BInitTime${sectionObj.id}.${controller.id}`
            BInitTimeLabel.innerText = 'Initial time'

            const BInitTime = document.createElement('input')
            BInitTime.type = 'time'
            BInitTime.value = sectionObj.bInitHour == sectionObj.bEndHour ? '':`${String(Math.floor(sectionObj.bInitHour/60)).padStart(2, '0')}:${String(sectionObj.bInitHour % 60).padStart(2, '0')}`

            BInitTime.name = 'BTime'
            BInitTime.id = `BInitTime${sectionObj.id}.${controller.id}`

            //B End time
            const BEndTimeLabel = document.createElement('label')
            BEndTimeLabel.htmlFor = `BEndTime${sectionObj.id}.${controller.id}`
            BEndTimeLabel.innerText = 'End time'

            const BEndTime = document.createElement('input')
            BEndTime.type = 'time'
            BEndTime.value = sectionObj.bEndHour == sectionObj.bInitHour ? '':`${String(Math.floor(sectionObj.bEndHour/60)).padStart(2, '0')}:${String(sectionObj.bEndHour % 60).padStart(2, '0')}`
            BEndTime.disabled = true

            BEndTime.name = 'BTime'
            BEndTime.id = `BEndTime${sectionObj.id}.${controller.id}`

            //Time fixes
            BInitTime.onblur = () => {

                if (!BInitTime.value) return
                
                timeFloor(sectionObj, 'bInitHour', BInitTime.value, BInitTime)

                const addTime = timeParse[setting[5]]*controller.secondLength

                const step = timeParse[setting[5]]
                const bEnd = sectionObj.bInitHour + addTime

                if (sectionObj.aDay == sectionObj.bDay) {

                    for (let t = sectionObj.bInitHour; t < bEnd; t += step) {
    
                        for (let aT = sectionObj.aInitHour; aT < sectionObj.aEndHour; aT += step) {
    
                            if (t === aT) {
    
                                BInitTime.value = ''
                                sectionObj.bInitHour = 0

                                Swal.fire({

                                    title:'Time conflict',
                                    icon:'error',
                                    text: `You can't place the second segment into a time that the first segment is using`

                                })

                                return

                            }
                        }
                    }
                }


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
            sectionObj.splitSection = splitBtn.checked

            const secondHourInput = document.getElementById('SlI_'+controller.id)

            if (sectionObj.splitSection){

                BTime.hidden = false
                secondHourInput.hidden = false

                ATitle.innerText = 'First segment schedule'

            } else {

                BTime.hidden = true
                secondHourInput.hidden = true

                ATitle.innerText = 'Section class schedule'

                //Find corresponding B slot to delete
                const index = classSlots.findIndex(s => s.id === `B${sectionObj.id}.${controller.id}`)
                const oldBSlot = classSlots[index]

                if (index != -1){

                    classSlots.splice(index, 1)
                    oldBSlot.remove()

                }

                //Reseting all BInputs if unmarked
                BTime.querySelectorAll('input').forEach(input => {

                    if (input.type === 'radio') input.checked = false
                    if (input.type === 'time') input.value = ''

                })
            }

        }

        //If any import has a splitSection
        if (sectionObj.splitSection) {

            const block = document.getElementById('block' + controller.id)
            const voucherTop = block.querySelector('.voucherTop')
            const voucherBottom = block.querySelector('.voucherBottom')

            splitBtn.click()

            block.insertBefore(splitBlockToDoubleVoucher(voucherTop, voucherBottom, controller.color, controller.id), voucherTop)

        }


    controls.append(nameInput, codeInput, ATime, document.createElement('br'), splitLabel, splitBtn, BTime)

    panel.append(document.createElement('br'), header, controls)

    //Ship it
    sectionPark.appendChild(panel)

}

//This is for new each segment for each class block
export function addSection(controller, fileImprt) {

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
        selected: false,
        disabled: false

    }

    if(sections.length < 50){

        const stuff = !fileImprt ? basicSection:fileImprt

        sections.push(stuff)
        createSectionPanel(controller,sections[sections.length-1])

    } else {

        Swal.fire({

            title: 'Class section limit',
            icon: 'error',
            text: 'Please, delete a section to add a new one'

        })
        
    }

}

function daysCreation (container, sectionObj, controller){

    const name = container.classList[0]

    for (let i = setting[1]-1; i < setting[2]; i++) {

        const radio = document.createElement('input')
        radio.type = 'radio'
        radio.id = `${name.slice(0,-1)}${sectionObj.id}-${i+1}.${controller.id}`
        radio.name = `${name}${sectionObj.id}.${controller.id}`
        radio.value = i+1
        radio.checked = sectionObj[name[0].toLowerCase()+'Day'] == i+1
                    
        const label = document.createElement('label')
        label.htmlFor = `${name.slice(0,-1)}${sectionObj.id}-${i+1}.${controller.id}`
        label.innerHTML = daysParse[i+1]

        radio.onclick = () => {

            const key = name[0] === 'A' ? 'aDay':'bDay'
            sectionObj[key] = Number(radio.value)

        }

        container.append(radio, label)

    }

}

//If the table refreshes
document.addEventListener(('updateTable'), (e) => {

    const refresh = e.detail.notUpdate

    if (refresh) {

        const parents = []

        classSlots.forEach(element => {

            const currentState = element.hidden

            //Program won't find slots if those are hidden
            element.hidden = false

            //Get all ids from where those slots were
            parents.push(element.parentNode.id)

            //Take back to normal state
            element.hidden = currentState
            
        });

        //Wait a little bit of time
        requestAnimationFrame(() => {

            parents.forEach((id, index) => {

                document.getElementById(id).append(classSlots[index])
                
            });

        })


    } else {

        classSlots.length = 0

        const sectionPanel =  [...document.querySelectorAll('.sectionPanel')]

        //Removing values from form
        sectionPanel.forEach(element => {

            const textId = element.parentNode.classList[0]

            const id = Number(textId.slice(11))
            const subId = Number(element.dataset.id)

            const ADays = element.querySelector('.ADays')
            const BDays = element.querySelector('.BDays')
            const ATimes = [...element.querySelectorAll('.ATime input[name=ATime]')]
            const BTimes = [...element.querySelectorAll('.BTime input[name=BTime]')]

            const section = classController[id].sections.find(s => s.id === subId)
            const classPanelParent = element.closest(`.classPanel`)

            ADays.innerHTML = ''
            daysCreation(ADays, section, classPanelParent.dataset)

            BDays.innerHTML = ''
            daysCreation(BDays, section, classPanelParent.dataset)

            ATimes.forEach(element => {

                element.value = ''
        
            });
            BTimes.forEach(element => {

                element.value = ''
        
            });

        
        });

        //Changing settings
        classController.forEach(element => {

            const sectionObj = element.sections

            sectionObj.forEach(segment => {

                segment.aDay = -1
                segment.bDay = -1

                segment.aInitHour = 0
                segment.bInitHour = 0

                segment.aEndHour = 0
                segment.bEndHour = 0

                console.log(segment)
            
            });
        
        });

    }

})

//If something new is placed
document.addEventListener('change', e => {

    //Find if the form update is from any sectionPanel
    const sectionPanel = e.target.closest('.sectionPanel')

    if (!sectionPanel) return

    const formObj = e.target

    if(formObj.type !== 'radio' && formObj.type !== 'time') return

    const target = formObj.id[0]

    let classId
    let sectionId

    let controller
    let sectionObj

    let onPlaceTag

    const slots = document.querySelectorAll('.slot')

    //If it's a day, this should delete any placeTag available
    if (formObj.type == 'radio'){

        classId = Number(formObj.id.substring(formObj.id.indexOf('.')+1))
        sectionId = Number(formObj.id.substring(formObj.id.indexOf('y')+1, formObj.id.indexOf('-')))

        controller = classController.find(c => c.id == classId)
        sectionObj = controller.sections.find(c => c.id == sectionId)

        outerLoop:
        for (const slot of slots) {

            const children = slot.childNodes

            for (const child of children) {

                if (child.classList?.contains('placeTag') && child.id == `${target}${sectionObj.id}.${controller.id}`) {

                    child.remove()
                    break outerLoop

                }

            }

        }


    }
    //If it's time, should check if any tag is placed 
    else {

        classId = Number(formObj.id.substring(formObj.id.indexOf('.')+1))
        sectionId = Number(formObj.id.substring(formObj.id.indexOf('e')+1, formObj.id.indexOf('.')))

        controller = classController.find(c => c.id == classId)
        sectionObj = controller.sections.find(c => c.id == sectionId)

        outerLoop:
        for (const slot of slots) {

            const children = slot.childNodes

            for (const child of children) {

                if (child.classList?.contains('placeTag') && child.id == `${target}${sectionObj.id}.${controller.id}`) {

                    onPlaceTag = child
                    break outerLoop

                }

            }

        }

    }

    //Find if it's A or B
    const day = target == 'A' ? sectionObj.aDay:sectionObj.bDay
    const time = target == 'A' ? sectionObj.aInitHour:sectionObj.bInitHour
    const length = target == 'A' ? controller.unitLength:controller.secondLength

    let fixedTag = false

    //Remove the old slots
    oldSlot:
    for (const element of slots) {

        const children = element.childNodes

        for (const child of children) {

            if (child.classList?.contains('drop') && child.id == `${target}${sectionObj.id}.${controller.id}`) {

                child.remove()
                createTag()

                fixedTag = true

                break oldSlot

            }

        }

    }


    if (!fixedTag && formObj.type == 'radio') {

        createTag()
        
    }

    console.log('onPlaceTag:', onPlaceTag);

    //Onces there's a tag, the slot should be created
    if (onPlaceTag) {

        //Move the tag
        const yMove = findYMove()
        const availableSlot = document.getElementById(`${day+1}${String(yMove+1).padStart(2, '0')}`)
        availableSlot.appendChild(onPlaceTag)

        //Create the drop
        const slot = document.createElement('div')
        slot.classList.add('slot', 'drop')
        slot.id = `${target}${sectionObj.id}.${controller.id}`

        slot.style.zIndex = 1

        slot.style.position = 'absolute'
        slot.style.left = 0
        slot.style.right = 0

        slot.style.backgroundColor = controller.color + '4D' 

        slot.style.height = (50*length - (5 * (3 - length))) + 'px'

        slot.style.borderRadius = '5px'
        slot.style.border = '5px solid ' + controller.color

            const info = document.createElement('div')
            info.classList.add('dropInfo')

            info.style.position = 'absolute'
            info.style.top = '50%'
            info.style.left = '50%'
            info.style.transform = 'translate(-50%, -50%)'


                const teacherTitle = document.createElement('h3')
                teacherTitle.id = `teacherTitle${sectionObj.id}.${controller.id}`

                teacherTitle.innerHTML = sectionObj.teacher
                teacherTitle.style.color = createDarkColor(controller.color)

                teacherTitle.style.textAlign = 'center'

                const codeTitle = document.createElement('p')
                codeTitle.id = `codeTitle${sectionObj.id}.${controller.id}`

                codeTitle.innerHTML = sectionObj.code
                codeTitle.style.color = createDarkColor(controller.color)

                codeTitle.style.textAlign = 'center'

            info.append(teacherTitle, codeTitle)

        slot.append(info)
    
        onPlaceTag.replaceWith(slot)

        classSlots.push(slot)
        console.log(slot, classSlots)

    }

    //ChatGPT did this
    function findYMove (){

        const start = setting[3]
        const end = setting[4]

        const yWrap = start > end
        const unit = timeParse[setting[5]]

        //If normal time
        if (!yWrap) {

            return (time - start) / unit
            
        }

        //If user is nuts (yWrap)

        //Find first calendar slot based on fist avaibale time
        const dayStart = Math.ceil((0 - start) / unit) * unit + start

        //Slots between 00:00 and endTime
        const firstSegmentLength = Math.floor((end - dayStart) / unit) + 1

        //If the time is greater than 00:00 and less than the end (first segment before wrap)
        if (time >= dayStart && time <= end) {

            return (time - dayStart) / unit

        }

        //If it's not at the first half (after wrap)
        return firstSegmentLength + (time - start) / unit

    }

    function createTag () {

        //Create a place tag
        const placeTag = document.createElement('div')
        placeTag.style.position = 'relative'
        placeTag.classList.add('placeTag')
        placeTag.id = `${target}${sectionObj.id}.${controller.id}`

        document.getElementById(`${day+1}01`).append(placeTag)

        //If time was already set, use that tag as the reference
        if (time) {

            onPlaceTag = placeTag

        }

    }

})

//If a drop has been selected
//Since is a CustomEvent, I need to acess to detail.blocks to know the current block
document.addEventListener(('updateSections'), (e) => {

    classSlots.forEach(drop => {

        drop.style.zIndex = 1
        
    });
    classController.forEach(element => {

        element.sections.forEach(segment => {

            const dropsCreated = classSlots.filter(d => d.id.endsWith(`${segment.id}.${element.id}`))

            dropsCreated.forEach(slot => {

                if(!segment.disabled){

                    slot.hidden = false

                } else {

                    slot.hidden = true

                }

            });
            
        });
        
    });

    //Information from movingBlocks.js
    const placedBlock = e.detail.block
    const drop = placedBlock.parentNode

    //Find the slot from where it was drop into the available slots
    const refDrop = classSlots.find(s => s.id == drop.id)

    //Find the controller of that object
    const controller = classController.find(c => c.id == Number(placedBlock.id.slice(5)))

    //If !refDrop, return
    if (!refDrop) {

        controller.sections.forEach(element => {

            element.selected = false

        })

        disableDrops(false)

        return 

    }

    //Find the section of the drop where the block is
    const classObj = controller.sections.find(c => c.id == Number(refDrop.id.substring(1, refDrop.id.indexOf('.'))))

    //Select current block
    classObj.selected = true
    controller.sections.forEach(c => { if (c != classObj) c.selected = false });

    disableDrops(true)

    //Place code
    placedBlock.querySelector('#labelPlacedBlock' + controller.id).innerHTML = classObj.code

    if (classObj.splitSection) {

        const copy = document.querySelector(`#${placedBlock.id}.copy`)
        copy.querySelector('#labelPlacedBlock' + controller.id).innerHTML = classObj.code

    }

    //Disable/enable drops
    function disableDrops (disabled) {

        controller.sections.forEach(element => {

            //When disabling, only the selected block affects others
            //When enabling, we must show all slots
            if (!element.selected && disabled) return

            //Disable all elements from below
            disableLoops(element, 'a', t => t < element.aEndHour, timeParse[setting[5]], disabled)

            //Disable all element from above
            disableLoops(element, 'a', t => t >= element.aInitHour - (2 * timeParse[setting[5]]), -timeParse[setting[5]], disabled)


            if (element.splitSection){

                //Disable all elements from below
                disableLoops(element, 'b', t => t < element.bEndHour, timeParse[setting[5]], disabled)


                //Disable all elements from above
                disableLoops(element, 'b', t => t >= element.bInitHour - (2 * timeParse[setting[5]]), -timeParse[setting[5]], disabled)

            }
            
        })

        classSlots.forEach(d => {

            //Get opacity to all classSlots of that block placed, but the one selected
            //Also, hide the info from the one selected
            if (disabled) {

                if (!d.id.endsWith(`${classObj.id}.${controller.id}`) && d.id.endsWith(`.${controller.id}`)) {

                    d.style.opacity = 0.3

                } else if (d.id.endsWith(`${classObj.id}.${controller.id}`)) { 

                    d.querySelector('.dropInfo').hidden = true

                }
                    
            }
                
        });

    }

    function disableLoops (element, key, compare, unit, disabled) {

        for (let t = element[key + 'InitHour']; compare(t); t += unit) {

            //Identify y position
            const yPos = ((t - setting[3]) / Math.abs(unit))+1

            //Find the possible slots from where a drop could be disabled
            const targetSlot = document.getElementById(`${element[key + 'Day']+1}${String(yPos).padStart(2, '0')}`)

            if (!targetSlot) continue

            const childsOfSlot = targetSlot.childNodes

            childsOfSlot.forEach(child => {

                //If a child is a drop of other block
                if (!child.id.endsWith(`.${controller.id}`)){

                    if (child.childNodes.length >= 2 && disabled) {

                        //Call the steping block function
                        callToStep(child.lastElementChild)

                        //Show the info from the block removed
                        child.querySelector('.dropInfo').hidden = false

                        //Remove blockings from the new block
                        element.disabled = false
                        placedBlock.hidden = false
                        drop.hidden = false

                    }

                    child.hidden = disabled
                    const otherDrop = classController.find(c => c.id == Number(child.id.substring(child.id.indexOf('.')+1))).sections.find(s => s.id == Number(child.id.substring(1, child.id.indexOf('.'))))

                    otherDrop.disabled = disabled

                    if (otherDrop.splitSection) {

                        const doubleSibling = child.id[0] == 'A' ? document.getElementById(`A${child.id.slice(1)}`):document.getElementById(`B${child.id.slice(1)}`)

                        doubleSibling.hidden = disabled

                    }
                        
                }
                    
            })
                
        }

    }

    console.log(placedBlock, drop, refDrop)
    console.log(controller, classObj)
    console.log(classSlots)

})