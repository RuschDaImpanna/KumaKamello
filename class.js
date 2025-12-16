const classController = []
let nextClassId = 0

function addClass(){

    const basicStructure = {

        id : nextClassId++,
        title : 'Class'+ String(nextClassId - 1).padStart(2, '0'),
        color : getRandomColor(),
        firstLength : 2,
        secondLenght : 0,
        splitBlock : false

    }

    function getRandomColor() {

        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {

            color += letters[Math.floor(Math.random() * 16)];

        }

        return color;
    }

    classController.push(basicStructure)

    createPanel(classController[classController.length-1])

    console.log(classController)

}

function createPanel(classData) {

    //Get the panel container
    const container = document.getElementById('classManagement')

    //Create div
    const panel = document.createElement('div')
    panel.classList.add('class-panel')
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

    header.append(title, deleteBtn)

    //Settings
    const controls = document.createElement('div')
    controls.classList.add('panelControls')


    //Title input
    const nameInput = document.createElement('input')
    nameInput.type = 'text'
    nameInput.value = classData.title

    nameInput.oninput = () => {

        classController[classData.id].title = nameInput.value
        title.innerText = nameInput.value

    }

    //Color input
    const colorInput = document.createElement('input')
    colorInput.type = 'color'
    colorInput.value = classData.color

    colorInput.oninput = () => {
        classController[classData.id].color = colorInput.value
    }

    //Append every setting
    controls.append(
        nameInput,
        colorInput,
        /*sizeInput,
        splitInput*/
    )

    //Header + controls
    panel.append(header, controls)
    //Ship it
    container.appendChild(panel)

}

function deleteClass(id) {

    // Array delete
    classController.splice(id, 1)

    // Panel delete
    const panel = document.querySelector(`.class-panel[data-id="${id}"]`)
    if (panel) panel.remove()

    console.log(classController)

}