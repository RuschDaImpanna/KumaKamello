//Import all settings from classController
import { classController } from "./class.js";
let availableBlocks = []

//Block park
const blockPark = document.querySelector('.blocks')

document.addEventListener("updateBlock", () => {

    //Check last object
    const lastController = classController[classController.length - 1]

    if (availableBlocks.length < classController.length) {

        //Light and dark color variants
        const lightColor = createLightColor(classController.color)
        const darkColor = createDarkColor(classController.color)

        //Ship it
        blockPark.appendChild(createNewBlock(lastController))

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

function createNewBlock (lastController){

    //Create the block
    const newBlock = document.createElement('div')
    newBlock.id = 'block' + lastController.id
    newBlock.style.position = 'relative'
    newBlock.style.height = (50 * lastController.firstLength) + 40 +'px'

    //Child objects

        //Create top voucher
        const voucherTop = document.createElement('div')
        voucherTop.style.position = 'relative'
        voucherTop.style.height = '40px'

        voucherTop.style.display = 'flex'
        voucherTop.style.flexDirection = 'column'
        voucherTop.style.alignItems = 'center'
        voucherTop.style.justifyContent = 'center'

        voucherTop.style.backgroundColor = lastController.color

        voucherTop.style.borderRadius = '10px'

            //Create the title
            const textTitle = document.createElement('h3')

            textTitle.id = 'titleBlock' + lastController.id

            textTitle.style.margin = '0'

            textTitle.innerText = lastController.title
            textTitle.style.textAlign = 'center'

            //Push title to top voucher
            voucherTop.append(textTitle)

        //Create bottom voucher
        const voucherBottom = document.createElement('div')
        voucherBottom.style.position = 'relative'
        voucherBottom.style.height = (50 * lastController.firstLength) + 'px'

        voucherBottom.style.display = 'flex'
        voucherBottom.style.flexDirection = 'column'
        voucherBottom.style.alignItems = 'center'
        voucherBottom.style.justifyContent = 'center'
        
        voucherBottom.style.backgroundColor = lastController.color
        voucherBottom.style.borderRadius = '10px 10px 0 0'

            //Create a fucking div bc text won't be placing
            const placedText = document.createElement('div')
            placedText.position = 'absolute'

                //Create title for positioned
                const textTitlePlaced = document.createElement('h3')
                textTitlePlaced.id = 'titlePlacedBlock' + lastController.id
                textTitlePlaced.hidden = 'true'

                textTitlePlaced.style.margin = '5px 0'
                textTitlePlaced.style.textAlign = 'center'
                
                textTitlePlaced.innerText = lastController.title

                //Create label for positioned
                const labelPlaced = document.createElement('p')
                labelPlaced.id = 'labelPlacedBlock' + lastController.id
                labelPlaced.hidden = 'true'

                labelPlaced.style.margin = '5px 0'
                labelPlaced.style.textAlign = 'center'
                labelPlaced.style.top = '-50px'
                
                labelPlaced.innerText = '0000'
                
                
                //Push to div
                placedText.append(textTitlePlaced, labelPlaced)

            //Create dotted lines
            for (let i = 0; i < lastController.firstLength; i++) {

                if (i != 0){

                    const dottedLine = document.createElement('div')
                    dottedLine.style.position = 'absolute'

                    dottedLine.style.top = 50 * i + 'px'
                    dottedLine.style.left = '10px'
                    dottedLine.style.right = '10px'

                    dottedLine.style.borderBottom = '3px dashed black'

                    voucherBottom.append(dottedLine)

                }
                
            }

            //Push to botton voucher
            voucherBottom.append(placedText)


        //Push children into block
        newBlock.append(voucherTop, voucherBottom)

    console.log('New', newBlock)

    return newBlock

}

function createLightColor (original){

    console.log(original)

}

function createDarkColor (original){

    console.log(original)
    
}

function hexToHSV (){
    
}

function HSVToHex (){


}