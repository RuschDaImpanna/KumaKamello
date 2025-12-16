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
        secondLength : 1, //This is temporary
        splitBlock : false //This is temporary

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
            classObj.title = nameInput.value
            //Dynamically, change text on real time
            title.innerText = nameInput.value

        }

        //Color input
        const colorInput = document.createElement('input')
        colorInput.type = 'color'
        colorInput.value = classData.color

        colorInput.oninput = () => {

            //Rewrite title at classController object
            classObj.color = colorInput.value

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
            classObj.firstLength = firstLengthInput.value

        }

        //This is temporary too
            //Fancy label for the second lenght
            const sndLngthH3 = document.createElement('h3')
            sndLngthH3.innerText = 'Second class segment lenght'
            sndLngthH3.id = 'Sh3_' + classData.id
            sndLngthH3.hidden = true

            //Second hour lenght
            const secondLengthInput = document.createElement('input')
            secondLengthInput.id = 'SlI_' + classData.id
            secondLengthInput.type = 'number'
            secondLengthInput.min = 1
            secondLengthInput.max = 3
            secondLengthInput.value = classData.secondLength
            secondLengthInput.hidden = true

            secondLengthInput.oninput = () => {

                //Rewrite first lenght at classController object
                classObj.secondLength = secondLengthInput.value

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
                classObj.splitBlock = splitInput.checked

                const Fh3 = document.getElementById('Fh3_' + classData.id)
                const Sh3 = document.getElementById('Sh3_' + classData.id)
                const SlI = document.getElementById('SlI_' + classData.id)

                if(classObj.splitBlock) {

                    Fh3.innerText = 'First class segment lenght'
                    Sh3.hidden = false
                    SlI.hidden = false

                } else {

                    Fh3.innerText = 'Class unit lenght'
                    Sh3.hidden = true
                    SlI.hidden = true

                }


        }
        

        //Push every setting
        controls.append(
            nameInput,
            colorInput,
            fstLngthH3,
            firstLengthInput,
            sndLngthH3,
            secondLengthInput,
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