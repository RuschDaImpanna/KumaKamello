//Get the panel container
const container = document.getElementById('classManagement')

//Class container objects
let classController = []

document.addEventListener("change", () => {

    console.log(classController)

})

function addClass(){

    let nextClassId = classController[classController.length-1] === undefined ? 0:classController[classController.length-1].id+1

    const basicStructure = {

        id : nextClassId,
        title : 'Class'+ String(nextClassId).padStart(2, '0'),
        color : getRandomColor(),
        firstLength : 2,
        secondLenght : 0,
        splitBlock : false

    }

    nextClassId++

    function getRandomColor() {

        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {

            color += letters[Math.floor(Math.random() * 16)];

        }

        return color;
    }

    classController.push(basicStructure)

    //Assign a panel for a classController object
    createPanel(classController[classController.length-1])

    console.log(classController)

}

function createPanel(classData) {

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

        //Delete button
        const deleteBtn = document.createElement('button')
        deleteBtn.innerText = 'Delete'
        deleteBtn.onclick = () => deleteClass(classData.id) //Delete function

        //Push and title to header
        header.append(title, deleteBtn)

    //Settings
    const controls = document.createElement('div')
    controls.classList.add('panelControls')


        //Title input
        const nameInput = document.createElement('input')
        nameInput.type = 'text'
        nameInput.value = classData.title
        nameInput.placeholder = 'Class title'

        //OnInput, changes on real time
        nameInput.oninput = () => {

            //Rewrite title at classController object
            classController[classData.id].title = nameInput.value
            //Dynamically, change text on real time
            title.innerText = nameInput.value

        }

        //Color input
        const colorInput = document.createElement('input')
        colorInput.type = 'color'
        colorInput.value = classData.color

        colorInput.oninput = () => {

            //Rewrite title at classController object
            classController[classData.id].color = colorInput.value

        }

        //Fancy label for the first lenght
        const fstLngthH3 = document.createElement('h3')
        fstLngthH3.innerText = 'Class unit lenght'
        fstLngthH3.id = 'Fh3_' + classData.id

        //First hour lenght
        const firstLengthInput = document.createElement('input')
        firstLengthInput.type = 'number'
        firstLengthInput.min = 1
        firstLengthInput.max = 3
        firstLengthInput.value= classData.firstLength

        firstLengthInput.oninput = () => {

            //Rewrite first lenght at classController object
            classController[classData.id].firstLength = firstLengthInput.value

        }

        //Fancy label for the second lenght
        const sndLngthH3 = document.createElement('h3')
        sndLngthH3.innerText = 'Second class segment lenght'
        sndLngthH3.id = 'Sh3_' + classData.id

        //First hour lenght
        const secondLengthInput = document.createElement('input')
        secondLengthInput.type = 'number'
        secondLengthInput.min = 1
        secondLengthInput.max = 3
        secondLengthInput.value= classData.firstLength

        secondLengthInput.oninput = () => {

            //Rewrite first lenght at classController object
            classController[classData.id].secondLength = secondLengthInput.value

        }

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
            classController[classData.id].splitBlock = splitInput.checked

            if(classController[classData.id].splitBlock) {

                document.getElementById('Fh3_' + classData.id).innerText = 'First class segment lenght'

            } else {

                document.getElementById('Fh3_' + classData.id).innerText = 'Class unit lenght'

            }


        }
        

        //Push every setting
        controls.append(
            nameInput,
            colorInput,
            fstLngthH3,
            firstLengthInput,
            splitInput,
            splitLabel
        )

    //Header + controls
    panel.append(header, controls)

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

    console.log(classController)

}