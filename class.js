import { updateVoucherColor } from "./blocks.js"

//Get the panel container
const container = document.getElementById('classManagement')

//Class container objects
export let classController = []

const addBtn = document.getElementById('addClass')
addBtn.addEventListener('click', addClass)

function addClass(){

    let nextClassId = classController[classController.length-1] === undefined ? 0:classController[classController.length-1].id+1

    const basicStructure = {

        id : nextClassId,
        title : 'Class'+ String(nextClassId).padStart(2, '0'),
        code: '0000',
        color : getRandomColor(),
        unitLength : 2,
        secondLength : 1, //This is temporary
        splitBlock : false, //This is temporary
        offset: 1 //This is temporary

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

        classController.push(basicStructure)

        //Assign a panel for a classController object
        createPanel(classController[classController.length-1])

        //For inmedate update to blocks.js
        document.dispatchEvent(new Event("updateBlock"))

    } else {

        alert('Class limit. Please delete a class to add a new one')

    }

}

function createPanel(classData) {

    //Find real object instead of looking by index
    const classObj = classController.find(obj => obj.id === classData.id)

    //Create div
    const panel = document.createElement('div')
    panel.classList.add('classPanel')
    panel.dataset.id = classData.id

    //Header
    const header = document.createElement('div')
    header.classList.add('panelHeader')

        //Title
        const title = document.createElement('h3')
        title.innerText = classData.title

        //Add available section
        const addSctBtn = document.createElement('button')
        addSctBtn.innerText = 'Add available section'
        addSctBtn.onclick = () => addSection(classData.id) //Add Section function

        //Delete button
        const deleteBtn = document.createElement('button')
        deleteBtn.innerText = 'Delete'
        deleteBtn.onclick = () => deleteClass(classData.id) //Delete function

        //Push and title to header
        header.append(title, addSctBtn, deleteBtn)

    //Settings
    const controls = document.createElement('div')
    controls.classList.add('panelControls')


        //Title input
        const nameInput = document.createElement('input')
        nameInput.type = 'text'
        nameInput.value = classData.title
        nameInput.placeholder = 'Class title'
        nameInput.maxLength = 32

        //OnInput, changes on real time
        nameInput.oninput = () => {

            //Rewrite title at classController object
            classObj.title = nameInput.value
            //Dynamically, change text on real time
            title.innerText = nameInput.value
            document.getElementById('titleBlock'+classData.id).innerText = nameInput.value
            document.getElementById('titlePlacedBlock'+classData.id).innerText = nameInput.value

        }

        //Color input
        const colorInput = document.createElement('input')
        colorInput.type = 'color'
        colorInput.value = classData.color

        colorInput.oninput = () => {

            //Rewrite title at classController object
            classObj.color = colorInput.value

            updateVoucherColor(colorInput.value, classData.id)

        }

        //Fancy label for code
        const codeH3 = document.createElement('h3')
        codeH3.innerText = 'Class code'

        //Code input
        const codeInput = document.createElement('input')
        codeInput.type = 'number'
        codeInput.min = 0
        codeInput.max = 9999

        codeInput.oninput = () => {

            //Rewrite first length at classController object
            const inputValue = Number(codeInput.value)

            //In case it's an invalid input, use the last value
            if (Number.isNaN(inputValue) || inputValue == ''){

                codeInput.value = classObj.code

            }

            //Take the value between 0 to 9999
            const clampValue = Math.min(Math.max(inputValue, 0), 9999)

            //Change the controller and the display
            codeInput.value = String(clampValue).padStart(4, '0')
            classObj.code = String(clampValue).padStart(4, '0')

            //Dynamically, change text on real time
            document.getElementById('labelPlacedBlock'+classData.id).innerText = codeInput.value

        }

        //Fancy label for the first length
        const fstLngthH3 = document.createElement('h3')
        fstLngthH3.innerText = 'Class unit length'
        fstLngthH3.id = 'Fh3_' + classData.id

        //First hour length
        const unitLengthInput = document.createElement('input')
        unitLengthInput.type = 'number'
        unitLengthInput.min = 1
        unitLengthInput.max = 3
        unitLengthInput.value= classData.unitLength

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
        
        //Available section park to place in
        const sectionPark = document.createElement('div')
        sectionPark.classList.add('sectionPark'+classData.id)
        

        //Push every setting
        controls.append(
            nameInput,
            colorInput,
            codeH3,
            codeInput,
            fstLngthH3,
            unitLengthInput
        )

    //Header + controls + section park (for available sections)
    panel.append(document.createElement('br'), header, controls, sectionPark)

    //Ship it
    container.appendChild(panel)

}

//This is for deleting a class at the delete class button
export function deleteClass(id) {

    // Array delete
    classController = classController.filter(del => del.id !== id)

    // Panel delete
    const panel = document.querySelector(`.classPanel[data-id="${id}"]`)
    if (panel) panel.remove()

    //For inmedate update to blocks.js
    document.dispatchEvent(new Event("updateBlock"))

}

//This is for new each segment for each class block
function addSection(id) {

    alert('New section')

}