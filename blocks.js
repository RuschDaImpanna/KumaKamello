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
        const lightColor = createLightColor(lastController.color)
        const darkColor = createDarkColor(lastController.color)

        //Ship it
        blockPark.appendChild(createNewBlock(lastController, lightColor, darkColor))

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

function createNewBlock (lastController, lightColor, darkColor){

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
            textTitle.style.color = String(lightColor)

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
            placedText.style.position = 'absolute'

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

                    dottedLine.style.borderBottom = '3px dashed ' + darkColor

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

    const { h, s, l } = hexToHSL(original)
    return HSLToHex(h, s, Math.min(100, l + 30))

}

function createDarkColor (original){

    const { h, s, l } = hexToHSL(original);
    return HSLToHex(h, s, Math.max(0, l - 30));
    
}

function hexToHSL (hex){

    hex = hex.slice(1)

    //Convert into numbers
    let r = parseInt(hex.substring(0, 2), 16) / 255;
    let g = parseInt(hex.substring(2, 4), 16) / 255;
    let b = parseInt(hex.substring(4, 6), 16) / 255;

    //Average value
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    // I gave up. ChatGPT did it
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
    
}

function HSLToHex (h, s, l){

    //Same as this one. I don't understand
    s /= 100;
    l /= 100;

    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n =>
        l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

    const toHex = x =>
        Math.round(x * 255).toString(16).padStart(2, '0');

    return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;

}