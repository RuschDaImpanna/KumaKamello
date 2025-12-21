import { updateVoucherColor } from "./blocks.js"

//Get the panel container
const container = document.getElementById('classManagement')

//Class container objects
export let classController = []

const addBtn = document.getElementById('add')
addBtn.addEventListener('click', addClass)

function addClass(){

    let nextClassId = classController[classController.length-1] === undefined ? 0:classController[classController.length-1].id+1

    const basicStructure = {

        id : nextClassId,
        title : 'Class'+ String(nextClassId).padStart(2, '0'),
        code: '0000',
        color : getRandomColor(),
        firstLength : 2,
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
        const firstLengthInput = document.createElement('input')
        firstLengthInput.type = 'number'
        firstLengthInput.min = 1
        firstLengthInput.max = 3
        firstLengthInput.value= classData.firstLength

        firstLengthInput.oninput = () => {

            //Rewrite first length at classController object
            const inputValue = Number(firstLengthInput.value)

            //In case it's an invalid input, use the last value
            if (Number.isNaN(inputValue) || inputValue == ''){

                firstLengthInput.value = classObj.firstLength

            }

            //Take the value between 1 to 3
            const clampValue = Math.min(Math.max(inputValue, 1), 3)

            //Change the controller and the display
            firstLengthInput.value = clampValue
            classObj.firstLength = clampValue

        }

        //This is temporary too
            //Fancy label for the second length
            const sndLngthH3 = document.createElement('h3')
            sndLngthH3.innerText = 'Second class segment length'
            sndLngthH3.id = 'Sh3_' + classData.id
            sndLngthH3.hidden = true

            //Second hour length
            const secondLengthInput = document.createElement('input')
            secondLengthInput.id = 'SlI_' + classData.id
            secondLengthInput.type = 'number'
            secondLengthInput.min = 1
            secondLengthInput.max = 3
            secondLengthInput.value = classData.secondLength
            secondLengthInput.hidden = true

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

            //Offset
            const offsetInput = document.createElement('input')
            offsetInput.id = 'offset' + classData.id
            offsetInput.type = 'number'
            offsetInput.min = 1
            offsetInput.max = 6
            offsetInput.value = classData.offset
            offsetInput.hidden = true

            offsetInput.oninput = () => {

                //Rewrite first length at classController object
                const inputValue = Number(offsetInput.value)

                //In case it's an invalid input, use the last value
                if (Number.isNaN(inputValue) || inputValue == ''){

                    offsetInput.value = classObj.offset

                }

                //Take the value between 1 to 6
                const clampValue = Math.min(Math.max(inputValue, 1), 6)

                //Change the controller and the display
                offsetInput.value = clampValue
                classObj.offset = clampValue

            }

            //Offset label
            const offsetLabel = document.createElement('label')
            offsetLabel.id = 'ofsLbl' + classData.id
            offsetLabel.htmlFor = 'offset' + classData.id
            offsetLabel.innerText = 'Offset'
            offsetInput.hidden = true


            //Splitted class (two classes per weer)
            const splitInput = document.createElement('input')
            splitInput.type = 'checkbox'
            splitInput.id = 'splitFor' + classData.id
            splitInput.checked = classData.splitBlock

            //The label too
            const splitLabel = document.createElement('label')
            splitLabel.htmlFor = 'splitFor'+ classData.id
            splitLabel.innerText = 'Splitted class (seen twice a week)'

            splitInput.onclick = () => {

                //Rewrite split at classController object
                classObj.splitBlock = splitInput.checked

                const Fh3 = document.getElementById('Fh3_' + classData.id)
                const Sh3 = document.getElementById('Sh3_' + classData.id)
                const SlI = document.getElementById('SlI_' + classData.id)
                const Ofs = document.getElementById('offset' + classData.id)
                const OfsLbl = document.getElementById('ofsLbl' + classData.id)

                if(classObj.splitBlock) {

                    Fh3.innerText = 'First class segment length'
                    Sh3.hidden = false
                    SlI.hidden = false
                    Ofs.hidden = false
                    OfsLbl.hidden = false

                } else {

                    Fh3.innerText = 'Class unit length'
                    Sh3.hidden = true
                    SlI.hidden = true
                    Ofs.hidden = true
                    OfsLbl.hidden = true

                }
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
            firstLengthInput,
            sndLngthH3,
            secondLengthInput,
            offsetInput,
            offsetLabel,
            splitInput,
            splitLabel,
        )

    //Header + controls + section park (for available sections)
    panel.append(header, controls, sectionPark)

    //Ship it
    container.appendChild(panel)

}

//This is for deleting a class at the delete class button
function deleteClass(id) {

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