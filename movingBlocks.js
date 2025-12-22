//Import all settings from classController
import { classController } from "./class.js";

document.addEventListener("updateBlock", () => {

    classController.forEach(classObj => {

        const block = document.getElementById('block' + classObj.id)

        makeDraggable(block)

    })

})

function makeDraggable (block) {

    let isDragging = false

    //Mouse position
    let startX = 0
    let startY = 0

    //Block offset
    let offsetX = 0
    let offsetY = 0

    block.addEventListener('mousedown', onMouseDown)

    function onMouseDown (e) {

        //e is mouse properties
        //No non-expected dragging and text
        e.preventDefault()

        isDragging = true

        //Get position of block
        const rect = block.getBoundingClientRect()

        //Get mouse position
        startX = e.clientX
        startY = e.clientY

        //Position by mouse and block
        offsetX = startX - rect.left
        offsetY = startY - rect.top

        //Make class styles
        block.classList.add('dragging')

        block.style.position = 'absolute'

        block.style.width = rect.width + 'px'
        block.style.height = rect.height + 'px'

        block.style.zIndex = 1000

        block.style.opacity = 0.7 

        console.log(true)

    }


}