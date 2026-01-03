//Import all settings from classController
import { classController } from "./class.js";
import { setting } from "./settings.js";

//Current blocks
let availableBlocks = []

//Block park
const blockPark = document.querySelector('.blocks')

//For create/destroy block
document.addEventListener("updateBlock", () => {

    //Check last object
    const lastController = classController[classController.length - 1]


    //Create delete bin space
    if (availableBlocks.length == 0) {

        //Place before the block park
        blockPark.parentNode.insertBefore(createBin(), blockPark)

    }

    if (availableBlocks.length <= classController.length) {

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

    updateAvailableBlocks()

    //Delete delete bin space
    if (availableBlocks.length == 0) {

        document.getElementById('deleteBin').remove()
    
    }

    console.log("Changed blocks", availableBlocks)

})

//For any change
document.addEventListener("change", () => {

    if(JSON.stringify(availableBlocks) != JSON.stringify(classController)){

        classController.forEach((element, i) => {

            //Convert object → array of [key, value]
            const arrMod = Object.entries(element)

            arrMod.forEach(([key, value]) => {

                //Find to availableBlocks in the index the value of the key being evaluated
                const oldValue = availableBlocks[i][key]

                const block = document.getElementById('block'+i)
                const voucherTop = document.querySelector(`#block${i} .voucherTop`)
                const voucherBottom = document.querySelector(`#block${i} .voucherBottom`)

                //Light and dark color variants
                const lightColor = createLightColor(classController[i].color)
                const darkColor = createDarkColor(classController[i].color)

                //If voucher should be using light or dark on the title
                const betterContrast = compareContrast(lightColor, classController[i].color)

                if (value != oldValue){

                    console.log('Cambió', key, oldValue, '→', value)

                    const timeParse = {

                        0:45,
                        1:50,
                        2:60

                    }

                    //Change size of first voucher
                    if (key == 'unitLength'){

                        //Change block size
                        block.style.height = (50*value) + 40 + 'px'

                        //Change voucherBottom size
                        voucherBottom.style.height = 50*value + 'px'

                        //Get the divs, including the last one
                        //This will help to make the dotted lines and recreating the hidden stuff
                        const bottomObjs = [...document.querySelectorAll(`#block${i} .voucherBottom div`)]

                        //The hidden stuff
                        const placedDiv = bottomObjs.pop()

                        //Delete everything
                        voucherBottom.innerHTML = ''

                        for (let x = 1; x < ((50*value)/50); x++) {
                            
                            const dottedLine = document.createElement('div')
                            dottedLine.style.position = 'absolute'

                            dottedLine.style.top = 50 * x + 'px'
                            dottedLine.style.left = '10px'
                            dottedLine.style.right = '10px'

                            dottedLine.style.borderBottom = '3px dashed ' + (betterContrast ? String(darkColor):String(lightColor))

                            voucherBottom.append(dottedLine)

                            
                        }

                        //Recreate the hidden stuff
                        voucherBottom.append(placedDiv)


                        //Change size of drops
                        const slots = document.querySelectorAll('.slot')
                        slots.forEach(slot => {

                            const children = slot.childNodes

                            for (const child of children) {

                                if (child.classList?.contains('drop')) {

                                    const sections = element.sections

                                    for (const section of sections) {

                                        if (child.id == `A${section.id}.${element.id}`){

                                            child.style.height = (50*value - (5 * (3 - value))) + 'px'

                                        }
                                
                                    }


                                }

                             }
                
                        });

                        //Change endTime of A
                        const sectionPark = document.querySelector('.sectionPark'+element.id)
                        const aTimes = sectionPark.querySelectorAll('.sectionPanelControlls input[name=ATime]')

                        aTimes.forEach((form, index) => {

                            if (!form.value) return

                            //Always gets endTime
                            if (index % 2 != 0) {

                                const initDay = aTimes[index - 1]

                                const addTime = timeParse[setting[5]]*value
                                let hour = parseInt(initDay.value.slice(0,2))
                                let min = parseInt(initDay.value.slice(-2))

                                const modTime = (hour*60 + Math.floor(((min+5)/10))*10)+addTime
                                const timeStr = `${String(Math.floor(modTime/60)).padStart(2, '0')}:${String(modTime % 60).padStart(2, '0')}`

                                const classId = Number(form.id.substring(form.id.indexOf('.')+1))
                                const sectionId = Number(form.id.substring(form.id.indexOf('e')+1, form.id.indexOf('.')))

                                const controller = classController.find(c => c.id == classId)
                                const sectionObj = controller.sections.find(c => c.id == sectionId)

                                sectionObj.aEndHour = modTime
                                form.value = timeStr

                            }

                        });

                    }
                    //Change size of second voucher
                    else if (key == 'secondLength'){

                        const splitVoucher = document.querySelector(`#block${i} .splitVoucher`)
                        const oldLines = [...splitVoucher.children]

                        //Remove old lines
                        oldLines.forEach(element => {

                            if (element.tagName  == 'DIV') {

                                element.remove()

                            } 
                            
                        });

                        //Change size
                        splitVoucher.style.height = 25*value + 'px'
                        
                        //Create new lines
                        for (let x = 1; x < ((50*value)/50); x++) {
                            
                            const dottedLine = document.createElement('div')
                            dottedLine.style.position = 'absolute'

                            dottedLine.style.top = 25 * x + 'px'
                            dottedLine.style.left = '10px'
                            dottedLine.style.right = '10px'

                            dottedLine.style.borderBottom = '3px dashed ' + lightColor

                            splitVoucher.append(dottedLine)

                            
                        }



                        //Change size of drops
                        const slots = document.querySelectorAll('.slot')
                        slots.forEach(slot => {

                            const children = slot.childNodes

                            for (const child of children) {

                                if (child.classList?.contains('drop')) {

                                    const sections = element.sections

                                    for (const section of sections) {

                                        if (child.id == `B${section.id}.${element.id}`){

                                            child.style.height = (50*value - (5 * (3 - value))) + 'px'

                                        }
                                
                                    }


                                }

                             }
                
                        });

                        //Change endTime of B
                        const sectionPark = document.querySelector('.sectionPark'+element.id)
                        const bTimes = sectionPark.querySelectorAll('.sectionPanelControlls input[name=BTime]')

                        bTimes.forEach((form, index) => {

                            if (!form.value) return

                            //Always gets endTime
                            if (index % 2 != 0) {

                                const initDay = bTimes[index - 1]

                                const addTime = timeParse[setting[5]]*value
                                let hour = parseInt(initDay.value.slice(0,2))
                                let min = parseInt(initDay.value.slice(-2))

                                const modTime = (hour*60 + Math.floor(((min+5)/10))*10)+addTime
                                const timeStr = `${String(Math.floor(modTime/60)).padStart(2, '0')}:${String(modTime % 60).padStart(2, '0')}`

                                const classId = Number(form.id.substring(form.id.indexOf('.')+1))
                                const sectionId = Number(form.id.substring(form.id.indexOf('e')+1, form.id.indexOf('.')))

                                const controller = classController.find(c => c.id == classId)
                                const sectionObj = controller.sections.find(c => c.id == sectionId)

                                sectionObj.bEndHour = modTime
                                form.value = timeStr

                            }

                        });


                    }
                    //Create split block (two vouchers)
                    else if (key == 'splitBlock'){

                        //If splitBlock
                        if (value){

                            block.insertBefore(splitBlockToDoubleVoucher(voucherTop, voucherBottom, classController[i].color, i), voucherTop)

                        } 
                        //If not splitBlock
                        else {

                            document.querySelector(`#block${i} .splitTag`).remove()
                            document.querySelector(`#block${i} .splitVoucher`).remove()

                            voucherTop.style.width = ''
                            voucherBottom.style.width = ''

                        }


                    }

                } else {

                    return

                }

            })
            
        });

        console.log("Controller changed", classController, availableBlocks)

        updateAvailableBlocks()

    }

})

function updateAvailableBlocks () {

    //Update available blocks
    availableBlocks = classController.map(obj => ({

        //Only block properties
        id: obj.id,
        title: obj.title,
        code: obj.code,
        color: obj.color,
        unitLength: obj.unitLength,
        secondLength: obj.secondLength, //Temporary
        splitBlock: obj.splitBlock, //Temporary

    }))
    
}

function createNewBlock (lastController, lightColor, darkColor) {

    //If voucher should be using light or dark on the title
    const betterContrast = compareContrast(lightColor, lastController.color)

    //Create the block
    const newBlock = document.createElement('div')
    newBlock.id = 'block' + lastController.id

    newBlock.style.position = 'relative'
    newBlock.style.height = (50 * lastController.unitLength) + 40 +'px'

    //Mark as a block that ocuppies space
    newBlock.setAttribute('data-draggable', '')

    //Child objects

        //Create top voucher
        const voucherTop = document.createElement('div')
        voucherTop.classList.add('voucherTop')

        voucherTop.style.position = 'relative'
        voucherTop.style.height = '40px'

        voucherTop.style.display = 'flex'
        voucherTop.style.flexDirection = 'column'
        voucherTop.style.alignItems = 'center'
        voucherTop.style.justifyContent = 'center'

        voucherTop.style.backgroundColor = lastController.color
        voucherTop.style.boxShadow = '0 10px 8px 0 ' + (darkColor+'B2')

        voucherTop.style.borderRadius = '10px'

            //Create the title
            const textTitle = document.createElement('h3')

            textTitle.id = 'titleBlock' + lastController.id

            textTitle.style.margin = '0'

            textTitle.innerText = lastController.title
            textTitle.style.textAlign = 'center'
            textTitle.style.color = betterContrast ? String(lightColor):String(darkColor)

            //Push title to top voucher
            voucherTop.append(textTitle)

        //Create bottom voucher
        const voucherBottom = document.createElement('div')
        voucherBottom.classList.add('voucherBottom')

        voucherBottom.style.position = 'relative'
        voucherBottom.style.height = (50 * lastController.unitLength) + 'px'

        voucherBottom.style.display = 'flex'
        voucherBottom.style.flexDirection = 'column'
        voucherBottom.style.alignItems = 'center'
        voucherBottom.style.justifyContent = 'center'
        
        voucherBottom.style.boxShadow = '0 10px 8px 0 ' + (darkColor+'B2')
        voucherBottom.style.backgroundColor = lastController.color
        voucherBottom.style.borderRadius = '10px 10px 0 0'

            //Create a fucking div bc text won't be placing
            const placedText = document.createElement('div')
            placedText.style.position = 'absolute'
            placedText.hidden = true

                //Create title for positioned
                const textTitlePlaced = document.createElement('h3')
                textTitlePlaced.id = 'titlePlacedBlock' + lastController.id

                textTitlePlaced.style.margin = '5px 0'
                textTitlePlaced.style.textAlign = 'center'
                
                textTitlePlaced.innerText = lastController.title
                textTitlePlaced.style.color = betterContrast ? String(lightColor):String(darkColor)

                //Create label for positioned
                const labelPlaced = document.createElement('p')
                labelPlaced.id = 'labelPlacedBlock' + lastController.id

                labelPlaced.style.margin = '5px 0'
                labelPlaced.style.textAlign = 'center'
                labelPlaced.style.top = '-50px'
                labelPlaced.style.color = betterContrast ? String(lightColor):String(darkColor)
                
                labelPlaced.innerText = lastController.code
                
                
                //Push to div
                placedText.append(textTitlePlaced, labelPlaced)

            //Create dotted lines
            for (let i = 0; i < lastController.unitLength; i++) {

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


        //Push children into block
        newBlock.append(voucherTop, voucherBottom)


    console.log('New', newBlock)

    return newBlock

}

export function splitBlockToDoubleVoucher (voucherTop, voucherBottom, color, id) {

    const lightColor = createLightColor(color)
    const darkColor = createDarkColor(color)

    const container = document.createDocumentFragment()

    //Create split tag
    const splitTag = document.createElement('div')
    splitTag.classList.add('splitTag')

    splitTag.style.position = 'absolute'
    splitTag.style.right = '0'
    splitTag.style.top = '25px'

    splitTag.style.width = '40%'
    splitTag.style.height = 0

    //Bookmark borders
    splitTag.style.borderRight = '10px solid transparent'
    splitTag.style.borderTop = `20px solid ${darkColor}`
    splitTag.style.borderBottom = `20px solid ${darkColor}`

        //Create split tag text
        const tagText = document.createElement('h3')
        tagText.style.position = 'relative'
        tagText.style.bottom = '10px'

        tagText.innerText = 'SPLIT'
        tagText.style.color = lightColor

        tagText.style.marginLeft = '10px'


    splitTag.append(tagText)

    //Create double voucher
    const splitVoucher = document.createElement('div')
    splitVoucher.classList.add('splitVoucher')

    splitVoucher.style.position = 'absolute'
    splitVoucher.style.right = '5%'
    splitVoucher.style.top = '65px'

    splitVoucher.style.width = '37%'
    splitVoucher.style.height = (25*classController[id].secondLength) + 'px'

    splitVoucher.style.borderRadius = '0 5px 5px 5px'

    splitVoucher.style.backgroundColor = darkColor
    splitVoucher.style.boxShadow = '-10px 10px 8px 0 ' + (darkColor+'B2')

        //Create dotted lines
        for (let i = 1; i < classController[id].secondLength; i++) {

            const dottedLine = document.createElement('div')
            dottedLine.style.position = 'absolute'

            dottedLine.style.top = 25 * i + 'px'
            dottedLine.style.left = '0px'
            dottedLine.style.right = '10px'

            dottedLine.style.borderBottom = '3px dashed ' + lightColor

            splitVoucher.append(dottedLine)
                
        }

    //Original voucher
    voucherTop.style.width = '60%'
    voucherBottom.style.width = '60%'

    container.append(splitTag, splitVoucher)

    return (container)

}

export function updateVoucherColor (newColor, id) {

    const newLight = createLightColor(newColor)
    const newDark = createDarkColor(newColor)

    //If voucher should be using light or dark on the title
    const betterContrast = compareContrast(newLight, newColor)

    const voucherTop = document.querySelector(`#block${id} .voucherTop`)
    const voucherBottom = document.querySelector(`#block${id} .voucherBottom`)

    //Normal color
    voucherTop.style.backgroundColor = newColor
    voucherBottom.style.backgroundColor = newColor

    //Dark color
    voucherTop.style.boxShadow = '0 10px 8px 0 ' + (newDark+'B2')
    voucherBottom.style.boxShadow = '0 10px 8px 0 ' + (newDark+'B2')

    //Title colors
    const textObjs = document.querySelectorAll(`#block${id} h3`)
    textObjs.forEach(element => {

        element.style.color = betterContrast ? String(newLight):String(newDark)

    });

    //Dotted lines
    const lineObjs = [... document.querySelectorAll(`#block${id} .voucherBottom div`)]
    lineObjs.pop()
    lineObjs.forEach(element => {

        element.style.borderColor = betterContrast ? String(newDark):String(newLight)
        
    });

}

function createBin () {

    const deleteBin = document.createElement('div')
    deleteBin.style.backgroundColor = '#b0becaff'
    deleteBin.id = 'deleteBin'
    deleteBin.classList.add('drop')

    deleteBin.style.display = 'flex'
    deleteBin.style.justifyContent = 'center'
    deleteBin.style.alignItems = 'center'

    deleteBin.style.margin = '5px'

    deleteBin.style.textAlign = 'center'

        //Text
        const binText = document.createElement('h3')
        binText.innerText = 'Delete'

        deleteBin.append (binText)
    

    return deleteBin


}

function createLightColor (original) {

    const { h, s, l } = hexToHSL(original)
    return HSLToHex(h, s, Math.min(100, l + 30))

}

function createDarkColor (original) {

    const { h, s, l } = hexToHSL(original);
    return HSLToHex(h, s, Math.max(0, l - 30));
    
}

function compareContrast(light, original) {

    const { h, s, l } = hexToHSL(original)
    const { l: Ll } = hexToHSL(light)

    //Full dark
    if (l < 30) {

        return true

    }
    //Full bright lighter
    if(Ll > 80){

        return false

    }

    //Base threshold
    let lightLimit = 60

    //I also needed ChatGPT here
    // Hue compensation (green & yellow are visually brighter)
    if (h >= 45 && h <= 150) {

        lightLimit -= 30

    }

    //Against neon colors
    if (s > 85 && l > 50) {

    lightLimit -= 25

    }


    //Very saturated colors appear brighter
    if (s > 70) {

        lightLimit -= 10

    }

    //Full saturation and medium lighness
    if (s > 80 && l > 45) {

    lightLimit -= 10

    }


    // Decide
    return Ll > lightLimit

}

function hexToHSL (hex) {

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

function HSLToHex (h, s, l) {

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