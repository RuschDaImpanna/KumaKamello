import { addClass, classController } from "./class.js"
import { createFile } from "./export.js"
import { addSection, classSlots } from "./section.js"
import { dynamicText, setting } from "./settings.js"

const importBtn = document.getElementById('import')
const exportBtn = document.getElementById('export')

importBtn.addEventListener("change" , () => {

    const file = importBtn.files[0]

    const confirm = exportBtn.disabled ? 
    Promise.resolve(false) : 
    Swal.fire({

        title: "Import session",
        text: "Do you want to save your current session before importing? All changes may get overwritten",
        icon: "question",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Save & Import",
        denyButtonText: "Import without saving",

    }).then(result => {

        if (result.isDismissed) return 'cancel'

        return result.isConfirmed ? 'save':'notSave'

    })

    confirm.then(action => {

        if (action == 'cancel') return importBtn.value = ''

        if(action == 'save'){

            createFile()

        }

        let error
        let finalProg

        reset()

        Swal.fire({

            title: "Loading session...",
            html: `

            <progress id="progress" max="100" value="0" style="user-select:none; accent-color:#11C242"></progress>
        
            `,

            allowOutsideClick: false,
            allowEscapeKey: false,
            preConfirm: false,
            showConfirmButton: false,

            //On alert
            didOpen: () => {

                Swal.showLoading()

                const popup = Swal.getPopup()
                const progressBar = popup.querySelector('#progress')

                fixAlert(popup, progressBar)
                importSession(progressBar, file)
                .then(() => {
                    console.log("Import OK");
                })
                .catch(err => {

                    error = err.message;

                    animateError(progressBar, 'accentColor', 'red', '#11C242')
                    animateError(document.getElementById('load'), 'color', 'red', getComputedStyle(document.getElementById('load')).color)
                    animateError(document.querySelector('.swal2-container.swal2-center.swal2-backdrop-show'), 'backgroundColor', '#bb0000a0','#00000066')

                    setTimeout(() => { Swal.close(); }, 300)
                    exportBtn.disabled = true
                    importBtn.value = ''

                });

            
            },

            //Almost to close
            willClose: () => {

                const progressBar = document.getElementById('progress')
                finalProg = Number.isInteger(progressBar.value) ? Number(progressBar.value):Number(progressBar.value.toFixed(2))

            }

        }).then(() => {

            //Alert ended
            if(error){

                Swal.fire({

                    title: 'Error',
                    icon: 'error',
                    html: error,
                    footer: `<p style="margin:0">Failed at ${finalProg}%<p/>`

                }).then(() => {

                    if(finalProg > 45){

                        window.location.reload()

                    }

                })

            }

        });

    })

})

function fixAlert (popup, progressBar) {

    const loadObj = popup.querySelector('.swal2-loader')

    const parent = progressBar.parentNode

    const load = document.createElement('h3')
    load.id = 'load'
    load.innerText = '0%'


    parent.insertBefore(loadObj, progressBar)
    parent.insertBefore(load, loadObj)
    parent.insertBefore(document.createElement('br'), loadObj)
    parent.insertBefore(document.createElement('br'), progressBar)
    parent.insertBefore(document.createElement('br'), progressBar)

    loadObj.style.inset = "0";
    loadObj.style.margin = "auto";

}

function reset () {

    classController.length = 0
    setting.length = 0
    classSlots.length = 0

    document.getElementById('classManagement').innerHTML = ''
    document.querySelectorAll('.slot.drop').forEach(element => {

        element.remove
        
    });
    document.querySelector('.blocks').innerHTML = ''
    if (document.getElementById('deleteBin')) document.getElementById('deleteBin').remove()

}

function animateError (element, property, color, finalColor) {

    element.animate(
        [
            { [property]: color },
            { [property]: color },
            { [property]: finalColor }
        ],
        {
            duration: 400,
            easing: 'ease-out'
        }
    )

}

async function importSession(progressBar, file) {

    const wait = ms => new Promise(res => setTimeout(res, ms))
    let progress = 0
    const load = document.getElementById('load')

    async function updateImport (time, condition, points){

        await wait(time)

        await condition()

        progress += points
        progressBar.value = progress
        load.innerText = Number.isInteger(progress) ? progress + '%':progress.toFixed(2) + '%';

    }



    //Stage 1 - Know if file is json (5)
    await updateImport(

        50,
        () => {

            if (!file) throw new Error (`<h3>No file provided</h3>`)

        }, //If !file
        1

    )
    await updateImport(

        100,
        () => {

            const type = file.type

            if (type.slice(type.indexOf('/')+1) != 'json') throw new Error (`
                <h3>Not compatible file type</h3>
                <br/>
                <p>Your file → ${type} | Needed type → application/json</p>`)

        }, //If different file type
        4
        
    )



    //Stage 2 - Check if the file contains correct header file use (10)
    let rawText
    await updateImport(

        50,
        async () => {

            try {

                rawText = await readFile(file)

            } catch (e) {
    
                throw new Error("<h3>Failed to read file</h3>")

            }

        }, //If failed to read
        2
        
    )
    let data
    await updateImport(

        50,
        async () => {

            try {

                data = JSON.parse(rawText)

            } catch {
    
                throw new Error("<h3>Invalid JSON structure</h3>")

            }

        }, //If invalid JSON file
        3
        
    )
    const supportableBuilt = '0.2.1'
    await updateImport(

        100,
        () => {

            if (data.length != 4) throw new Error (`
                <h3>Not compatible JSON file</h3> 
                <br/>
                <p>Not compatible data lenght → ${data.length}</p>`)
            if (Object.keys(data[0]).length != 2) throw new Error (`
                <h3>Not compatible JSON file</h3> 
                <br/>
                <p>Not compatible header lenght → ${Object.keys(data[0]).length}</p>`)
            if (data[0].file != 'KumaKamello') throw new Error (`
                <h3>Not compatible JSON file</h3> 
                <br/>
                <p>Doesn't support ${data[0].file} file type`)
            
            

            const supported = checkVersion(supportableBuilt, data[0].version)

            function checkVersion (system, file) {

                const [sM, sN, sP] = system.split('.').map(Number)
                const [fM, fN, fP] = file.split('.').map(Number)

                //Check mayor update
                if (fM > sM) return false
                if (fM < sM) return true

                //Check minor update
                if (fN > sN) return false
                if (fN < sN) return true

                //Check patch
                return fP < sP

            }

            if(supported) throw new Error (`
                <p>Not compatible file version</p> 
                <br/>
                <p>Doesn't support ${data[0].version} files. Current update → ${supportableBuilt}`)
            

        }, //If not the right JSON file
        5
        
    )

    //ChatGPT made this
    function readFile(file) {

        return new Promise((resolve, reject) => {

            const reader = new FileReader();

            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error("File read error"));

            reader.readAsText(file);

        });

    }

    //Stage 3 - Check if setting and classController have the right format (30)
    const fileSetting = [...data[1]]
    const checkSetting = ['string', 'number', 'number', 'number', 'number', 'number', 'boolean', 'boolean', 'string']
    const errorStt = ['Table name', 'Inital day', 'End day', 'Initial hour', 'Ending hour', 'Hour unit', 'Deadtime', '24-hour calendar', 'Table color']
    for (let i = 0; i < checkSetting.length; i++) {

        await updateImport(

            120,
            () => {

                if (i == checkSetting.length-1) {

                    const color = fileSetting[i]
                    const hex = Number('0x' + color.slice(color.indexOf('#')+1))

                    if ((color[0] != '#') || (!hex)){

                        throw new Error (`
                        <h3>Invalid table settings</h3>
                        <br/>
                        <p>${errorStt[i]} value is not compatible</p>
                        <p>Expected type → ${checkSetting[i]}</p>`)

                    }
                    
                }
                if (typeof fileSetting[i] != checkSetting[i]) throw new Error (`
                    <h3>Invalid table settings</h3>
                    <br/>
                    <p>${errorStt[i]} value is not compatible</p>
                    <p>Expected type → ${checkSetting[i]}</p>`)

            }, 
            i == checkSetting.length-1 ? 2:1

        ) //If setting[] has error
        
    }

    const fileClassController = [...data[2]]
    const checkController = ['number', 'string', 'string', 'number', 'number', 'boolean', 'object']
    const checkSection = ['number', 'string', 'string', 'number', 'number', 'number', 'boolean', 'number', 'number', 'number', 'boolean', 'boolean']

    let sctnsLenght = 0
    fileClassController.forEach(element => {

        sctnsLenght += element.sections.length
        
    });
    const total = fileClassController.length + 0.25 * sctnsLenght
    const classPts = 20/total
    const sctnsPts = 0.25 * classPts

    for (const element of fileClassController) {

        const keys = Object.keys(element)

        for (let c = 0; c < checkController.length; c++) {

            await updateImport(

                80,
                async () => {

                    if (c == 2) {

                        const color = element[keys[c]]
                        const hex = Number('0x' + color.slice(color.indexOf('#')+1))

                        if ((color[0] != '#') || (!hex)){

                            throw new Error(`
                            <h3>Invalid class settings</h3>
                            <br/>
                            <p>For class id: ${element.id}, ${keys[c]} value is not compatible</p>
                            <p>Expected type → ${checkController[c]}</p>`)

                        }
                    
                    }

                    if (typeof element[keys[c]] != checkController[c]) throw new Error(`
                            <h3>Invalid class settings</h3>
                            <br/>
                            <p>For class id: ${element.id}, ${keys[c]} value is not compatible</p>
                            <p>Expected type → ${checkController[c]}</p>`)

                    if (c == checkController.length-1) {

                        for (const section of element.sections) {

                            const sectionKeys = Object.keys(section)

                            for (let s = 0; s < checkSection.length; s++) {

                                await updateImport (

                                    30,
                                    () => {

                                        if (typeof section[sectionKeys[s]] != checkSection[s]) throw new Error(`
                                            <h3>Invalid section settings</h3>
                                            <br/>
                                            <p>For class id: ${element.id}, at section id ${section.id}, ${sectionKeys[s]} value is not compatible</p>
                                            <p>Expected type → ${checkSection[s]}</p>`)

                                    },
                                    sctnsPts/checkSection.length

                                ) //If any section (classController[].sections) is broken
                                
                            }

                            
                        }

                    }

                },
                classPts/checkController.length

            ) //If any classController[] is brokern

        }
    }

    progress = 45
    progressBar.value = progress
    load.innerText = progress + '%'
    
    

    //Stage 4 - Change table (10)
    const form = document.getElementById('tableSettings')
    await updateImport(

        80,
        () => {

            form.title.value = fileSetting[0]
            dynamicText()

        }, //Change title
        2

    )
    await updateImport(

        50,
        () => {

            if (!(0 <= fileSetting[1] && fileSetting[1] <= 6)) {

                throw new Error (`
                    <h3>Invalid table settings</h3>
                    <br/>
                    <p>initDay value is not compatible</p>
                    <p>File initDay value → ${fileSetting[1]}</p>`)

            } 

            [...form.initDay].find(obj => obj.value == fileSetting[1]).checked = true

        }, //Change initDay
        1

    )
    await updateImport(

        50,
        () => {

            if (!(0 <= fileSetting[2] && fileSetting[2] <= 6)) {

                throw new Error (`
                    <h3>Invalid table settings</h3>
                    <br/>
                    <p>endDay value is not compatible</p>
                    <p>File endDay value → ${fileSetting[2]}</p>`)

            } 

            [...form.finalDay].find(obj => obj.value == fileSetting[2]).checked = true

        }, //Change endDay
        1

    )
    await updateImport(

        50,
        () => {

            if (!(0 <= fileSetting[3] && fileSetting[3] <= 1440)) {

                throw new Error (`
                    <h3>Invalid table settings</h3>
                    <br/>
                    <p>initTime value is not compatible</p>
                    <p>File initTime value → ${fileSetting[3]}</p>`)

            } 

            const time = `${String(Math.floor(fileSetting[3]/60)).padStart(2, '0')}:${String(fileSetting[3] % 60).padStart(2, '0')}`

            form.initTime.value = time

        }, //Change initTime
        1

    )
    await updateImport(

        50,
        () => {

            if (!(0 <= fileSetting[4] && fileSetting[4] <= 1440)) {

                throw new Error (`
                    <h3>Invalid table settings</h3>
                    <br/>
                    <p>endTime value is not compatible</p>
                    <p>File endTime value → ${fileSetting[4]}</p>`)

            } 

            const time = `${String(Math.floor(fileSetting[4]/60)).padStart(2, '0')}:${String(fileSetting[4] % 60).padStart(2, '0')}`

            form.endTime.value = time

        }, //Change endTime
        1

    )
    await updateImport(

        50,
        () => {

            if (!(0 <= fileSetting[5] && fileSetting[5] <= 2)) {

                throw new Error (`
                    <h3>Invalid table settings</h3>
                    <br/>
                    <p>units value is not compatible</p>
                    <p>File units value → ${fileSetting[5]}</p>`)

            } 

            [...form.units].find(obj => obj.value == fileSetting[5]).checked = true

        }, //Change units
        1

    )
    await updateImport(

        80,
        () => {

            if(fileSetting[5] >= 2) return form.deadtime.disabled = true

            form.deadtime.checked = fileSetting[6]

        }, //Change deadtime
        1

    )
    await updateImport(

        80,
        () => {

            form.format.checked = fileSetting[6]

        }, //Change format
        1

    )
    await updateImport(

        50,
        () => {

            form.color.value = fileSetting[8]
            form.color.dispatchEvent(new Event('change', { bubbles: true }));

        }, //Change color
        1

    )



    //Stage 5 and 6 - Create classes/blocks and sections/slots (20 + 10)
    const blockPts = 20/fileClassController.length
    const slotsPts = 10/sctnsLenght

    for (const element of fileClassController) {

        await updateImport(

            150,
            async () => {

                addClass(element)
                const sections = [...element.sections]

                for (const section of sections) {

                    await updateImport(

                        80,
                        () => {

                            addSection(element, section)

                        }, //For classController[].sections
                        slotsPts

                    )
                    
                }

            },
            blockPts

        ) //For classController[]

    }



    //Stage 7 - Place drops (10)
    const fileClassSlots = [...data[3]]

    const dropPts = 10/fileClassSlots.length
    for (const slot of fileClassSlots) {

        await updateImport(

            120,
            () => {

                const fragment = document.createElement('template')
                fragment.innerHTML = slot.obj

                const obj = document.getElementById(slot.parent).appendChild(fragment.content.firstElementChild)

                classSlots.push(obj)

            }, //Place slots
            dropPts

        )
        
    }



    //Stage 8 - Replace blocks from the drops with real blocks (5)
    const slots = document.querySelectorAll('.slot.drop')
    let placed = []
    slots.forEach(slot => {

        slot.childNodes.forEach(child => {

            if(!child.id.startsWith('block')) return

            placed.push(child)
            
        })

    })
    const blocks = [...document.querySelector('.blocks').childNodes]

    const delPts = 5/placed.length

    for (const block of placed) {

        //Add listener to the copy totake the original one
        if (block.classList.contains('copy')) {

            block.addEventListener('mousedown', (e) => {

                e.preventDefault()
                e.stopPropagation()

                const original = blocks.find(e => e.id == block.id)

                //Replace copy with original
                block.parentNode.replaceChild(original, block)

                original.getBoundingClientRect()

                //Find vocuhers to be pushed
                const voucher = original.querySelector('.voucherTop, .voucherBottom')

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

            continue

        }

        await updateImport(

            50,
            () => {

                const match = blocks.find(e => e.id == block.id)

                const code = block.querySelector('.voucherBottom p').innerText

                block.replaceWith(match)

                match.querySelector('.voucherTop').remove()

                const voucherBottom = match.querySelector('.voucherBottom')
                voucherBottom.lastElementChild.hidden = false
                voucherBottom.querySelector('p').innerText = code

                const controller = fileClassController.find(c => c.id == Number(match.id.slice(5)))

                if(!controller.splitBlock) return

                match.querySelectorAll('.splitTag, .splitVoucher').forEach(e => e.hidden = true)
                voucherBottom.style.width = ''


            }, //Replace blocks
            delPts

        )
        
    }

    Swal.close()

}
