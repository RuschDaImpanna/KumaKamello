//Import all settings from classController
import { classController } from "./class.js";
let availableBlocks = []

//Block park
const blockPark = document.querySelector('.blocks')

document.addEventListener("updateBlock", () => {

    //Check last object
    const lastController = classController[classController.length - 1]

    if (availableBlocks.length < classController.length) {

        //Create the block
        const newBlock = document.createElement('div')
        newBlock.id = 'block' + lastController.id
        newBlock.style.backgroundColor = lastController.color
        newBlock.style.height = (50 * lastController.firstLength) + 'px'
        newBlock.style.borderRadius = '10px'

        //Create the text
        const newText = document.createElement('h3')
        newText.id = 'textBlock' + lastController.id
        newText.innerText = lastController.title
        newText.style.textAlign = 'center'

        //Push text into block
        newBlock.append(newText)

        //Ship it
        blockPark.appendChild(newBlock)

        console.log('New', newBlock)

    } else {
        
        //Find missing object
        const deletedBlock = availableBlocks.find(

            prev => !classController.some(curr => curr.id === prev.id)

        )

        //Delete from DOM
        document.getElementById('block' + deletedBlock.id).remove()

        console.log('Delete', deletedBlock)

    }

    updateAvaliableBlocks()

    console.log("blocks.js updated", availableBlocks)

})

document.addEventListener("change", () => {

    

    if(JSON.stringify(availableBlocks) != JSON.stringify(classController)){

        console.log(true)

    } else {

        console.log(false)

    }

    console.log("blocks.js settings", classController, availableBlocks)

})

function updateAvaliableBlocks () {

    //Update available blocks
    availableBlocks = classController.map(obj => ({

        //Only block properties
        id: obj.id,
        title: obj.title,
        color: obj.color,
        firstLength: obj.firstLength,
        secondLength: obj.secondLength, //Temporary
        splitBlock: obj.splitBlock, //Temporary
        offset: obj.offset

    }))
    
}