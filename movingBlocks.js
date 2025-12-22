//Import all settings from classController
import { classController } from "./class.js";

document.addEventListener("updateBlock", () => {

    classController.forEach((element, i) => {

        const block = document.getElementById('block' + element.id)


        makeDraggable(block, i)

    })

})

function makeDraggable (block, id) {

    if (block.dataset.draggableInit) return
    block.dataset.draggableInit = 'true'

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

    let ghostBlock = null

    function onMouseDown (e) {

        if (isDragging) return

        document.body.style.cursor = 'grabbing'

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
        const blocksContainer = document.querySelector('.blocks')
        const blockIndex = Array.from(blocksContainer.children).indexOf(block)
        ghostBlock = createGhost(block, classController[id].color, classController[id].title)

        blocksContainer.insertBefore(ghostBlock, blocksContainer.children[blockIndex])

        //Move to body so doesn't have a parent
        document.body.appendChild(block)

        //Make class styles
        block.classList.add('dragging')

        block.style.position = 'absolute'

        block.style.left = rect.left + 'px'
        block.style.top  = rect.top + 'px'

        block.style.width = rect.width + 'px'
        block.style.height = rect.height + 'px'

        block.style.zIndex = 1000

        block.style.opacity = 0.7

        block.style.pointerEvents = 'none'

        //While grabbing, you can move or drop
        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseup', onMouseUp)

    }

    function onMouseMove(e) {

        if (!isDragging) return

        block.style.left = `${e.pageX - offsetX}px`
        block.style.top = `${e.pageY - offsetY}px`

        const zone = isDroppable(e)
        if (zone) {

            moveGhost(ghostBlock, block, zone)

        }

    }

    function onMouseUp() {

        if (!ghostBlock) return

        document.body.style.cursor = ''

        //Stop dragging
        isDragging = false

        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)

        //Place block to ghostBlock
        ghostBlock.replaceWith(block)

        //Take to normal
        block.style.position = 'relative'
        block.style.left = ''
        block.style.top = ''

        block.classList.remove('dragging')
        block.style.zIndex = ''
        block.style.opacity = 1

        block.style.pointerEvents = ''

        ghostBlock = null

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

        ghost.dataset.ghost = 'true'

            //Create text
            const ghostText = document.createElement('h3')
            ghostText.innerText = title
            ghostText.style.color = color

            ghostText.style.textAlign = 'center'

        ghost.append(ghostText)
        

        return ghost

    }

    function isDroppable (e){

        return document.elementFromPoint(e.clientX, e.clientY)?.closest('.drop')

    }

    //ChatGPt did this
    function moveGhost (ghost, block, container){

        if (!ghost || !container.contains(ghost)) return

        //Get center of moving block to know how block will rearrange if needed
        const dragRect = block.getBoundingClientRect()
        const dragCenterX = dragRect.left + dragRect.width / 2
        const dragCenterY = dragRect.top  + dragRect.height / 2

        //Get all blocks except the one being drag and the ghost
        const items = container.querySelectorAll('[data-draggable]:not(.dragging)')


        for (const item of items) {

            //Get the center of each item
            const rect = item.getBoundingClientRect()
            const itemCenterX = rect.left + rect.width / 2
            const itemCenterY = rect.top  + rect.height / 2

            //Get same row size
            const sameRow = Math.abs(dragCenterY - itemCenterY) < rect.height / 2

            const shouldInsertBefore = dragCenterY < itemCenterY || (sameRow && dragCenterX < itemCenterX)

            if (shouldInsertBefore) {

                if (ghost.nextSibling !== item) {

                    container.insertBefore(ghost, item)
                    
                }
                return

            }

        }

        if (ghost !== container.lastElementChild) {

            container.appendChild(ghost)

        }


    }


}