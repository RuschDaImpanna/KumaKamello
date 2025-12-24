//Import all settings from classController
import { classController, deleteClass } from "./class.js";

const blocksContainer = document.querySelector('.blocks')

document.addEventListener('updateBlock', () => {

    classController.forEach(element => {

        const block = document.getElementById('block' + element.id)

        makeDraggable(block, element)

    })

})

function makeDraggable (block, element) {

    if (block.dataset.draggableInit) return
    block.dataset.draggableInit = 'true'

    const voucherTop = block.querySelector('.voucherTop')
    const voucherBottom = block.querySelector('.voucherBottom')

    let isDragging = false
    let isDropping = false

    let currentDropContainer

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
        isDropping = false

        //Get position of block
        const rect = block.getBoundingClientRect()

        //Get mouse position
        startX = e.pageX
        startY = e.pageY

        //Position by mouse and block
        offsetX = startX - rect.left - window.scrollX
        offsetY = startY - rect.top - window.scrollY

        //Create ghost block
        const blockIndex = Array.from(blocksContainer.children).indexOf(block)
        ghostBlock = createGhost(block, element.color, element.title)

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

        if (!isDragging || isDropping) return

        block.style.left = `${e.pageX - offsetX}px`
        block.style.top = `${e.pageY - offsetY}px`

        const zone = isDroppable(e)

        if (zone){

            currentDropContainer = zone

            moveGhost(ghostBlock, block, zone)

            placeInCalendarFix(block, currentDropContainer, voucherTop, voucherBottom)

        }

    }

    function onMouseUp() {

        if (!isDragging || isDropping || !ghostBlock) return

        document.body.style.cursor = ''

        //Stop dragging
        isDragging = false
        isDropping = true

        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)


        //Where is it now?
        const finalContainer = currentDropContainer || ghostBlock.parentNode

        //Place block to ghostBlock
        ghostBlock.replaceWith(block)

        console.log(Array.from(finalContainer.children).length, currentDropContainer)

        //If there was something there before
        if (Array.from(finalContainer.children).length >= 2 && finalContainer.classList.contains('slot')) {

            const prevBlock = finalContainer.lastElementChild
            const prevVouchBtm = prevBlock.querySelector('.voucherBottom')
            let prevElement

            for (const control in classController){

                if (classController[control].id == Number(prevBlock.id.slice(5))){

                    prevElement = classController[control]
                    break

                }

            }

            placeInCalendarFix(prevBlock, blocksContainer, createVoucherTop(prevVouchBtm, prevElement), prevVouchBtm)
            blocksContainer.append(finalContainer.lastElementChild)

        }

        //If placed in calendar
        placeInCalendarFix(block, block.parentNode, voucherTop, voucherBottom)

        //If placed to be deleted
        if (finalContainer.id == 'deleteBin'){

            deleteClass(element.id)
            
        }

        //Take to normal
        block.style.position = 'relative'
        block.style.left = ''
        block.style.top = ''

        block.style.width = ''

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

        ghost.style.position = 'relative'
        ghost.style.zindex = 2

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

    //ChatGPT did this
    function moveGhost (ghost, block, container){

        if (!ghost) return

        if (ghost.parentNode !== container) {

            container.appendChild(ghost)

        }

        //If it's at the delete bin
        container.id == 'deleteBin' ? container.setAttribute('selected', ''):document.getElementById('deleteBin').removeAttribute('selected')

        //If it's at any slot
        container.classList.contains('slot') ? ghost.style.height = block.offsetHeight - 40 + 'px':ghost.style.height = block.offsetHeight + 'px'

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

            if (ghost !== container.lastElementChild) {

                container.appendChild(ghost)

            }

        }


    }

    function placeInCalendarFix (block, container, localTop, localBottom) {

    //Get the info div (which is normally hidden)
    const placedInfo = localBottom.lastElementChild

    //Delete the top of the voucher
    const tops = [...block.querySelectorAll('.voucherTop')]

    tops.forEach(element => {

        element.remove()
            
    });

    if (container.classList.contains('slot')){

        placedInfo.hidden = false

    } else {

        //Recreate the top of the voucher
        block.insertBefore(localTop, localBottom)
        placedInfo.hidden = true

    }

}

}

document.addEventListener(('updateTable'), () => {

    classController.forEach(element =>{

        const block = document.getElementById('block' + element.id)
        const voucherBottom = block.querySelector('.voucherBottom')

        console.log(block)

        if(block.parentNode.classList.contains('slot')){

            //Move to .blocks
            blocksContainer.append(block)

            //Recreate top voucher
            block.insertBefore(createVoucherTop(voucherBottom, element), voucherBottom)

            const placedInfo = voucherBottom.lastElementChild

            //Hide placed information
            placedInfo.hidden = true

        }

    })

})

function createVoucherTop(voucherBottom, element){

    //Create top voucher
    const voucherTop = document.createElement('div')
    voucherTop.classList.add('voucherTop')

    voucherTop.style.position = 'relative'
    voucherTop.style.height = '40px'

    voucherTop.style.display = 'flex'
    voucherTop.style.flexDirection = 'column'
    voucherTop.style.alignItems = 'center'
    voucherTop.style.justifyContent = 'center'

    voucherTop.style.backgroundColor = element.color
    voucherTop.style.boxShadow = '0 10px 8px 0 ' + voucherBottom.style.boxShadow

    voucherTop.style.borderRadius = '10px'

        //Create the title
        const textTitle = document.createElement('h3')

        textTitle.id = 'titleBlock' + element.id

        textTitle.style.margin = '0'

        textTitle.innerText = element.title
        textTitle.style.textAlign = 'center'
        textTitle.style.color = voucherBottom.querySelector('h3').style.color

    //Push title to top voucher
    voucherTop.append(textTitle)

    return voucherTop

}