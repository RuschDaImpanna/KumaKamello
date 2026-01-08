//Import all settings
import { classController, deleteClass } from "./class.js";
import { splitBlockToDoubleVoucher, createDarkColor, createLightColor } from "./blocks.js";
import { classSlots } from "./section.js";

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

    let splitTag
    let splitVoucher

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

        //Get split tags if it has
        const oldTag = splitTag
        const oldVoucher = splitVoucher

        splitTag = !oldTag && block.querySelector('.splitTag') ? block.querySelector('.splitTag'):oldTag
        splitVoucher = !oldVoucher && block.querySelector('.splitVoucher') ? block.querySelector('.splitVoucher'):oldVoucher

        //Get position of block
        const rect = block.getBoundingClientRect()

        //Get mouse position
        startX = e.clientX
        startY = e.clientY

        //Position by mouse and block
        offsetX = startX - rect.left
        offsetY = startY - rect.top

        //Create ghost block
        const blockIndex = Array.from(blocksContainer.children).indexOf(block)
        ghostBlock = createGhost(block, element.color, element.title)

        blocksContainer.insertBefore(ghostBlock, blocksContainer.children[blockIndex])

        //Only show the slots available for that block
        const notAvailable = classSlots.filter(s => {

            const slotKey = s.id.substring(1) // "sectionId.controllerId" from the slot
            const blockKey = block.id.slice(5) // ".controllerId" from the block

            //If slot is for the same block
            if (slotKey.endsWith(`.${blockKey}`)) {

                return false

            }

            //Inside classController...
            const isOccupied = classController.some(controller =>

                //...find on all [controller].sections
                controller.sections.some(section =>

                    //If any sectionObj is selected and find any matching slot
                    section.selected && slotKey === `${section.id}.${controller.id}`

                )

            );

            //If the slot is occupied
            return !isOccupied;

        });

        const available = classSlots.filter(s => !notAvailable.includes(s))

        notAvailable.forEach(drop => {

            drop.hidden = true
            
        })
        available.forEach(drop => {

            drop.hidden = false
            drop.style.opacity = ''

            if (drop.id.endsWith(`.${block.id.slice(5)}`)) {

                drop.style.zIndex = 2
                drop.querySelector('.dropInfo').hidden = false

            }
            
        })

        //Remove any copy if existed
        const anyCopy = document.querySelector(`.copy#${block.id}`)

        console.log(`#${block.id} .copy`)
        if (anyCopy) anyCopy.remove()

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

            placeInCalendarFix(block, currentDropContainer, voucherTop, voucherBottom, element, splitTag, splitVoucher)

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
        let finalContainer = currentDropContainer || ghostBlock.parentNode

        //Place block to ghostBlock
        ghostBlock.replaceWith(block)
        
        //If it's a slot
        slotsChk:
        if (finalContainer.classList.contains('slot')){

            //Check if it's from a matching slot -> block
            if (finalContainer.id.substring(finalContainer.id.indexOf('.')+1) != element.id){

                blocksContainer.append(block)
                finalContainer = blocksContainer
                break slotsChk

            }

            const classObj =  element.sections.find(s => s.id == finalContainer.id.substring(1, finalContainer.id.indexOf('.')))

            //Check if it fits on a B slot
            notBChk:
            if (classObj.splitSection){

                const ASlot = document.getElementById(`A${finalContainer.id.slice(1)}`)
                const BSlot = finalContainer.id[0] == 'B' ? finalContainer:document.getElementById(`B${finalContainer.id.slice(1)}`)

                //If no A slot created
                if (!ASlot){

                    blocksContainer.append(block)
                    finalContainer = blocksContainer
                    alert('Please create a First segment for this class')

                    break slotsChk

                }

                if(BSlot != ASlot && !BSlot) break notBChk

                ASlot.append(block)

                const copyBlock = document.createElement('div')
                copyBlock.id = block.id
                copyBlock.classList.add('copy')

                BSlot.append(copyBlock)

                createBVoucherBottom(copyBlock, element, block)

                //Add a listener if user wants to move the copy block
                copyBlock.addEventListener('mousedown', (e) => {

                    e.preventDefault()
                    e.stopPropagation()

                    //Replace copy with original
                    BSlot.replaceChild(block, copyBlock)

                    block.getBoundingClientRect()

                    //Find vocuhers to be pushed
                    const voucher = block.querySelector('.voucherTop, .voucherBottom')

                    //Activate mousedown event
                    voucher.dispatchEvent(new MouseEvent('mousedown', {

                        bubbles: true,
                        cancelable: true,

                        clientX: e.clientX,
                        clientY: e.clientY,
                        pageX: e.pageX,
                        pageY: e.pageY
                        
                    }))

                })

            }

            //Disable forms
            disableForm('Fh3_',element.id, false)

            document.getElementById('Sct_' + element.id).disabled = true

            element.sections.forEach(segment => {

                disableForm('ATitle',`${segment.id}.${element.id}`, false)
                disableForm('splitLabel_',`${segment.id}.${element.id}`, false)
                
            })

            //Call section.js to update sections
            //A CustomEvent lets store a variable on the event on detail.block (by this case)
            document.dispatchEvent(new CustomEvent("updateSections", {detail : {block}}))

        } 
        //Enable forms
        else {

            disableForm('Fh3_', element.id, true)

            document.getElementById('Sct_' + element.id).disabled = false

            element.sections.forEach(segment => {

                disableForm('ATitle',`${segment.id}.${element.id}`, true)
                disableForm('splitLabel_',`${segment.id}.${element.id}`, true)
                
            });

            //Call section.js to update sections
            document.dispatchEvent(new CustomEvent("updateSections", {detail : {block}}))


        }

        //If placed in calendar
        placeInCalendarFix(block, finalContainer, voucherTop, voucherBottom, element, splitTag, splitVoucher)

        //If placed to be deleted
        if (finalContainer.id == 'deleteBin'){

            document.getElementById('deleteBin').removeAttribute('selected')
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

        ghost.style.height = block.offsetHeight + 'px'
        
        ghost.style.color = color

        ghost.style.display = 'flex'
        ghost.style.justifyContent = 'center'
        ghost.style.alignItems = 'center'

        ghost.dataset.ghost = 'true'

            //Create text
            const ghostText = document.createElement('h3')
            ghostText.innerText = title

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

    function placeInCalendarFix (block, container, localTop, localBottom, controller, sT, sV) {

        //Get the info div (which is normally hidden)
        const placedInfo = localBottom.lastElementChild

        //Delete the top of the voucher
        const tops = [...block.querySelectorAll('.voucherTop')]

        tops.forEach(element => {

            element.remove()
            
        });

        //If it's at a slot
        if (container.classList.contains('slot')){

            placedInfo.hidden = false

            //If it's split
            if(controller.splitBlock){

                localBottom.style.width = ''

                splitCalendarFix(localTop, true, sT, sV, block)

            }

        } 
        // If it's anywhere else
        else {

            //Recreate the top of the voucher
            if (block.contains(localBottom)) {

                block.insertBefore(localTop, localBottom)
                localTop.addEventListener('mousedown', onMouseDown)

            }
            placedInfo.hidden = true

            //If it's split
            if(controller.splitBlock){

                localBottom.style.width = '60%'
                localTop.style.width = '60%'

                splitCalendarFix(localTop, false,  sT, sV, block)

            } else {

                localTop.style.width = ''
                localBottom.style.width = ''

            }

        }

    }

    function splitCalendarFix (localTop, atSlot, localsT, localsV, block){

        let localTag = [...block.querySelectorAll('.splitTag')]
        let localVoucher = [...block.querySelectorAll('.splitVoucher')]

        if(atSlot){

            localTag.forEach(element => {

            element.remove()
                    
            });
            localVoucher.forEach(element => {

                element.remove()
                    
            });

        } else {

            //Recreate the split tags
            if (block.contains(localTop)) {
                
                block.insertBefore(localsV, localTop)
                block.insertBefore(localsT, localsV)

            }

        }

    }
}

document.addEventListener(('updateTable'), () => {

    classController.forEach(element =>{

        const block = document.getElementById('block' + element.id)
        const voucherBottom = block.querySelector('.voucherBottom')

        if(block.parentNode.classList.contains('slot')){

            //Move to .blocks
            blocksContainer.append(block)

            //Recreate top voucher
            const voucherTop = createVoucherTop(element)
            block.insertBefore(voucherTop, voucherBottom)

            const placedInfo = voucherBottom.lastElementChild

            //Hide placed information
            placedInfo.hidden = true

            if (element.splitBlock){

                const taggers = splitBlockToDoubleVoucher(voucherTop, voucherBottom, element.color, element.id).childNodes

                console.log(taggers[0], taggers[1])
                block.insertBefore(taggers[1], voucherTop)
                block.insertBefore(taggers[0], document.querySelector('.splitVoucher'))

            }

            //Enable forms
            disableForm('Fh3_', element.id, true)

            document.getElementById('Sct_' + element.id).disabled = false

            element.sections.forEach(segment => {

                disableForm('ATitle',`${segment.id}.${element.id}`, true)
                disableForm('splitLabel_',`${segment.id}.${element.id}`, true)
                
            });

        }

    })

})

export function disableForm (string, id, enable){

    let disableRef = document.getElementById(string+id)

    if (!disableRef) return

    let sibling = disableRef.nextElementSibling

    while (sibling) {

        //Each input after the disableRef, disable
        if (sibling.matches('input, select, textarea')) {

            sibling.disabled = !enable

        }

        //If the sibling has input childs, disable them too
        sibling.querySelectorAll('input, select, textarea')
                .forEach(el => el.disabled = !enable)

        sibling = sibling.nextElementSibling

    }


}

export function createVoucherTop(element){

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
    voucherTop.style.boxShadow = '0 10px 8px 0 ' + createDarkColor(element.color)

    voucherTop.style.borderRadius = '10px'

        //Create the title
        const textTitle = document.createElement('h3')

        textTitle.id = 'titleBlock' + element.id

        textTitle.style.margin = '0'

        textTitle.innerText = element.title
        textTitle.style.textAlign = 'center'
        textTitle.style.color = createLightColor(element.color)

    //Push title to top voucher
    voucherTop.append(textTitle)

    return voucherTop

}

function createBVoucherBottom (block, element, ref){

    const darkColor = createDarkColor(element.color)
    const lightColor = createLightColor(element.color)

    const betterContrast = ref.querySelector(`#titlePlacedBlock${element.id}`).style.color == lightColor

    //Create bottom voucher
    const voucherBottom = document.createElement('div')
    voucherBottom.classList.add('voucherBottom')

    voucherBottom.style.position = 'relative'
    voucherBottom.style.height = (50 * element.secondLength) + 'px'

    voucherBottom.style.display = 'flex'
    voucherBottom.style.flexDirection = 'column'
    voucherBottom.style.alignItems = 'center'
    voucherBottom.style.justifyContent = 'center'
        
    voucherBottom.style.boxShadow = '0 10px 8px 0 ' + (darkColor+'B2')
    voucherBottom.style.backgroundColor = element.color
    voucherBottom.style.borderRadius = '10px 10px 0 0'

        //Create a fucking div bc text won't be placing
        const placedText = document.createElement('div')
        placedText.style.position = 'absolute'

            //Create title for positioned
            const textTitlePlaced = document.createElement('h3')
            textTitlePlaced.id = 'titlePlacedBlock' + element.id

            textTitlePlaced.style.margin = '5px 0'
            textTitlePlaced.style.textAlign = 'center'
                
            textTitlePlaced.innerText = element.title
            textTitlePlaced.style.color = betterContrast ? String(lightColor):String(darkColor)

            //Create label for positioned
            const labelPlaced = document.createElement('p')
            labelPlaced.id = 'labelPlacedBlock' + element.id

            labelPlaced.style.margin = '5px 0'
            labelPlaced.style.textAlign = 'center'
            labelPlaced.style.top = '-50px'
            labelPlaced.style.color = betterContrast ? String(lightColor):String(darkColor)
                
                
            //Push to div
            placedText.append(textTitlePlaced, labelPlaced)

        //Create dotted lines
        for (let i = 0; i < element.secondLength; i++) {

            if (i != 0){

                const dottedLine = document.createElement('div')
                dottedLine.style.position = 'absolute'

                dottedLine.style.top = 50 * i + 'px'
                dottedLine.style.left = '10px'
                dottedLine.style.right = '10px'

                dottedLine.style.borderBottom = '3px dashed ' + (betterContrast ? String(darkColor):String(lightColor))

                voucherBottom.append(dottedLine)

            }
                
        }

        //Push to botton voucher
        voucherBottom.append(placedText)

    block.append(voucherBottom)

}