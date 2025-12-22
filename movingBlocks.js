//Import all settings from classController
import { classController } from "./class.js";

document.addEventListener("updateBlock", () => {

    classController.forEach((element, i) => {

        const block = document.getElementById('block' + element.id)


        makeDraggable(block, i)

    })

})

function makeDraggable (block, id) {

    const voucherTop = block.querySelector('.voucherTop')
    const voucherBottom = block.querySelector('.voucherBottom')

    let isDragging = false

    //Mouse position
    let startX = 0
    let startY = 0

    //Block offset
    let offsetX = 0
    let offsetY = 0

    voucherTop?.addEventListener('mousedown', onMouseDown)
    voucherBottom?.addEventListener('mousedown', onMouseDown)

    function onMouseDown (e) {

        //e is mouse properties
        //No non-expected dragging and text
        e.preventDefault()

        isDragging = true

        //Get position of block
        const rect = block.getBoundingClientRect()

        //Get mouse position
        startX = e.pageX
        startY = e.pageY

        //Position by mouse and block
        offsetX = startX - rect.left - window.scrollX
        offsetY = startY - rect.top - window.scrollY

        //Create ghost block
        const ghostBlock = createGhost(block, classController[id].color, classController[id].title)
        const blocksContainer = document.querySelector('.blocks')

        blocksContainer.insertBefore(ghostBlock, block)

        //Move to body so doesn't have a parent
        document.body.appendChild(block, voucherTop)

        //Make class styles
        block.classList.add('dragging')

        block.style.position = 'absolute'

        block.style.left = rect.left + 'px'
        block.style.top  = rect.top + 'px'

        block.style.width = rect.width + 'px'
        block.style.height = rect.height + 'px'

        block.style.zIndex = 1000

        block.style.opacity = 0.7


        //While grabbing, you can move or drop
        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseup', onMouseUp)

    }

    function onMouseMove(e) {

        if (!isDragging) return

        block.style.left = `${e.pageX - offsetX}px`
        block.style.top = `${e.pageY - offsetY}px`

        ghostMove(ghostBlock, block, blocksContainer)

    }

    function onMouseUp() {

        //Stop dragging
        isDragging = false
        block.classList.remove('dragging')
        block.style.zIndex = ''
        block.style.opacity = 1

        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)

        snapBackToBlocks(block)

    }

    function createGhost (block, color, title) {

        //Create ghost
        const ghost = document.createElement('div')
        ghost.classList.add('ghost')

        ghost.style.height = block.offsetHeight + 'px'
        
        ghost.style.border = '3px dashed ' + color
        ghost.style.borderRadius = '5px'

        ghost.style.display = 'flex'
        ghost.style.justifyContent = 'center'
        ghost.style.alignItems = 'center'

            //Create text
            const ghostText = document.createElement('h3')
            ghostText.innerText = title
            ghostText.style.color = color

            ghostText.style.textAlign = 'center'

        ghost.append(ghostText)


        return ghost

    }

    function snapBackToBlocks(block) {

        block.style.position = 'relative'
        block.style.left = ''
        block.style.top = ''

    }



}