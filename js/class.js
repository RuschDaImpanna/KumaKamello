import { disintegrateAnim, getMesh } from "./animations.js"
import { updateVoucherColor, createDarkColor } from "./blocks.js"
import { callToStep } from "./movingBlocks.js"
import { addSection, classSlots } from "./section.js"

//Get the panel container
const container = document.getElementById('classManagement')

//Class container objects
export let classController = []

const addBtn = document.getElementById('addClass')
addBtn.addEventListener('click', () => addClass())

export function addClass(fileImprt){

    console.log(fileImprt)

    let nextClassId = classController[classController.length-1] === undefined ? 0:classController[classController.length-1].id+1

    const basicStructure = {

        id : nextClassId,
        title : 'Class'+ String(nextClassId).padStart(2, '0'),
        color : getRandomColor(),
        unitLength : 2,
        secondLength : 1,
        splitBlock : false,
        sections : []

    }

    //Stolen from stackoverflow
    function getRandomColor() {

        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {

            color += letters[Math.floor(Math.random() * 16)];

        }

        return color;
    }

    if(classController.length < 20){

        nextClassId++

        const stuff = !fileImprt ? basicStructure:fileImprt

        classController.push(stuff)

        //Assign a panel for a classController object
        createPanel(classController[classController.length-1])

        //For inmedate update to blocks.js
        document.dispatchEvent(new Event("updateBlock"))

    } else {

        Swal.fire({

            title: 'Class limit',
            icon: 'error',
            text: 'Please delete a class to add a new one'

        })


    }

}

function createPanel (classObj) {

    const lightController = `color-mix(in srgb, ${classObj.color} 25%, white)`
    const darkController = createDarkColor(classObj.color)

    //Create div
    const panel = document.createElement('div')
    panel.classList.add('classPanel')
    panel.dataset.id = classObj.id
    panel.style.backgroundColor = `color-mix(in srgb, ${classObj.color} 45%, white)`

    //Header
    const header = document.createElement('div')
    header.classList.add('panelHeader')

        //Title
        const title = document.createElement('h3')
        title.innerText = classObj.title
        title.style.color = darkController

        //Add available section
        const addSctBtn = document.createElement('button')
        addSctBtn.id = 'Sct_' + classObj.id

            const addSctLbl = document.createElement('span')
            addSctLbl.classList.add('material-symbols-outlined')
            addSctLbl.innerText = 'add_circle'
            addSctBtn.append(addSctLbl)

        addSctBtn.style.backgroundColor = darkController
        addSctBtn.onclick = () => addSection(classObj) //Add Section function

        //Delete button
        const deleteBtn = document.createElement('button')

            const deleteLbl = document.createElement('span')
            deleteLbl.classList.add('material-symbols-outlined')
            deleteLbl.innerText = 'delete'
            deleteBtn.append(deleteLbl)
        
        deleteBtn.style.backgroundColor = darkController
        deleteBtn.onclick = () => deleteClass(classObj.id) //Delete function

        //Push and title to header
        header.append(title, addSctBtn, deleteBtn)

    //Settings
    const controls = document.createElement('div')
    controls.classList.add('panelControls')

        //Title Wrap 
        const titleWrap = document.createElement('div')
        titleWrap.classList.add('titleWrap')

            //Title input
            const nameInput = document.createElement('input')
            nameInput.type = 'text'
            nameInput.value = classObj.title
            nameInput.placeholder = 'Class title'
            nameInput.maxLength = 32
            nameInput.style.backgroundColor = lightController

            //OnInput, changes on real time
            nameInput.oninput = () => {

                //Rewrite title at classController object
                classObj.title = nameInput.value
                //Dynamically, change text on real time
                title.innerText = nameInput.value
                document.getElementById('titlePlacedBlock'+classObj.id).innerText = nameInput.value

                if (!document.getElementById('titleBlock'+classObj.id)) return
                document.getElementById('titleBlock'+classObj.id).innerText = nameInput.value

            }

            //Color input
            const colorInput = document.createElement('input')
            colorInput.type = 'color'
            colorInput.value = classObj.color
            colorInput.style.width = '100%'

        //Fancy label for the first length
        const unitLngthH3 = document.createElement('h3')
        unitLngthH3.innerText = 'Class unit length'
        unitLngthH3.id = 'Fh3_' + classObj.id
        unitLngthH3.style.color = darkController

        //First hour length
        const unitLengthInput = document.createElement('input')
        unitLengthInput.type = 'number'
        unitLengthInput.min = 1
        unitLengthInput.max = 3
        unitLengthInput.value = classObj.unitLength
        unitLengthInput.style.backgroundColor = lightController

        unitLengthInput.oninput = () => {

            //Rewrite first length at classController object
            const inputValue = Number(unitLengthInput.value)

            //In case it's an invalid input, use the last value
            if (Number.isNaN(inputValue) || inputValue == ''){

                unitLengthInput.value = classObj.unitLength

            }

            //Take the value between 1 to 3
            const clampValue = Math.min(Math.max(inputValue, 1), 3)

            //Change the controller and the display
            unitLengthInput.value = clampValue
            classObj.unitLength = clampValue

        }

        //Fancy label for the second length
        const sndLngthH3 = document.createElement('h3')
        sndLngthH3.innerText = 'Second class segment length'
        sndLngthH3.id = 'Sh3_' + classObj.id
        sndLngthH3.hidden = true
        sndLngthH3.style.color = darkController

        //Second hour length
        const secondLengthInput = document.createElement('input')
        secondLengthInput.id = 'SlI_' + classObj.id
        secondLengthInput.type = 'number'
        secondLengthInput.min = 1
        secondLengthInput.max = 3
        secondLengthInput.value = classObj.secondLength
        secondLengthInput.hidden = true
        secondLengthInput.style.backgroundColor = lightController

        secondLengthInput.oninput = () => {

            //Rewrite first length at classController object
            const inputValue = Number(secondLengthInput.value)

            //In case it's an invalid input, use the last value
            if (Number.isNaN(inputValue) || inputValue == ''){

                secondLengthInput.value = classObj.secondLength

            }

            //Take the value between 1 to 3
            const clampValue = Math.min(Math.max(inputValue, 1), 3)

            //Change the controller and the display
            secondLengthInput.value = clampValue
            classObj.secondLength = clampValue

        }
        
        //Available section park to place in
        const sectionPark = document.createElement('div')
        sectionPark.classList.add('sectionPark'+classObj.id)

            colorInput.oninput = () => {

                const newDark = createDarkColor(classObj.color)
                const newLight = `color-mix(in srgb, ${classObj.color} 25%, white)`

                //Rewrite title at classController object
                classObj.color = colorInput.value

                //Change voucher color
                updateVoucherColor(colorInput.value, classObj.id)

                //Change drop color
                const slots = classSlots.filter(s => s.id.substring(s.id.indexOf('.')+1) == classObj.id)

                slots.forEach(slot => {

                    slot.style.backgroundColor = classObj.color + '4D'
                    slot.style.border = '5px solid ' + classObj.color

                    slot.childNodes.forEach(obj => {

                        if(obj.classList.contains('dropInfo')){

                            obj.childNodes.forEach(txt => txt.style.color = newDark)

                        }

                    })
                    
                });

                //Change controller colors
                panel.style.backgroundColor = `color-mix(in srgb, ${classObj.color} 45%, white)`
                title.style.color = newDark
                addSctBtn.style.backgroundColor = newDark
                deleteBtn.style.backgroundColor = newDark
                nameInput.style.backgroundColor = newLight
                unitLngthH3.style.color = newDark
                sndLngthH3.style.color = newDark
                unitLengthInput.style.backgroundColor = newLight

                const sectionControllers = panel.querySelectorAll('.sectionPanel')
                sectionControllers.forEach(section => {

                    section.style.backgroundColor = `color-mix(in srgb, ${classObj.color} 65%, white)`
                    section.querySelectorAll('h3').forEach(t => t.style.color = newDark)
                    section.querySelectorAll('button').forEach(t => t.style.backgroundColor = newDark)
                    section.querySelectorAll('input:not(input[type="radio"], input[type="checkbox"])').forEach(t => t.style.backgroundColor = newLight)
                    
                })

            }

            titleWrap.append(nameInput, colorInput)
        

        //Push every setting
        controls.append(
            titleWrap,
            unitLngthH3,
            unitLengthInput,
            sndLngthH3,
            secondLengthInput,
            document.createElement('br')
        )

    //Header + controls + section park (for available sections)
    panel.append(header, controls, sectionPark)

    //Ship it
    container.appendChild(panel)

}

//This is for deleting a class at the delete class button
export async function deleteClass(id, section, controller) {

    const delPromise = []
    const delRef = []

    //Array delete
    if(!section){

        //Delete all drops from that class
        classSlots.splice(0, classSlots.length,

            ...classSlots.filter(drop => {

                if (drop.id.substring(drop.id.indexOf('.')+1) === String(id)) {

                    drop.hidden = false
                    
                    delPromise.push(getMesh(drop))
                    delRef.push(drop)
                    return false

                }

                return true

            })
        )

        classController = classController.filter(del => del.id !== id)

    } else {

        //Delete all drops from that section
        classSlots.splice(0, classSlots.length,

            ...classSlots.filter(drop => {

                if (drop.id.substring(1) === `${id}.${controller.id}`) {

                    if (drop.childNodes.length > 1) callToStep(drop.lastElementChild)

                    drop.hidden = false
                    
                    delPromise.push(getMesh(drop))
                    delRef.push(drop)
                    return false

                }

                return true

            })
        )

        console.log(section, controller)
        controller.sections = controller.sections.filter(del => del.id !== id)

    }

    const delMeshes = await Promise.all(delPromise)

    for (let i = 0; i < delMeshes.length; i++) {

        disintegrateAnim(delMeshes[i], delRef[i])
        
    }

    //Panel delete
    const panel = !section ? document.querySelector(`.classPanel[data-id="${id}"]`):document.querySelector(`.sectionPanel[data-id="${id}"]`)
    panel.remove()

    //For inmedate update to blocks.js
    if (!section) document.dispatchEvent(new Event("updateBlock"))

}