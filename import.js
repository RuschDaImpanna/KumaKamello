import { setting } from "./settings.js"
import { classController } from "./class.js"

const importBtn = document.getElementById('import')

importBtn.addEventListener("change" , () => {

    const file = importBtn.files[0]

    let error

    Swal.fire({

        title: "Loading session...",
        html: `

        <progress id="progress" max="100" value="0" style="user-select:none"></progress>
        
        `,

        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
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
                Swal.close();
                importBtn.value = ''

            });

            
        },

        willClose: () => {

            //Almost to close


        }

    }).then((result) => {

        //Alert ended
        if(error){

            Swal.fire({

                title: 'Error',
                icon: 'error',
                html: error

            })

        }

    });

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



    //Stage 1 - Know if file is json
    await updateImport(

        100,
        () => {

            if (!file) throw new Error (`<h3>No file provided</h3>`)

        }, //If !file
        1

    )
    await updateImport(

        250,
        () => {

            const type = file.type

            if (type.slice(type.indexOf('/')+1) != 'json') throw new Error (`
                <h3>Not compatible file type</h3>
                <br/>
                <p>Your file → ${type} | Needed type → application/json</p>`)

        }, //If different file type
        4
        
    )



    //Stage 2 - Check if the file contains correct header file use
    let rawText
    await updateImport(

        100,
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

        100,
        async () => {

            try {

                data = JSON.parse(rawText)

            } catch {
    
                throw new Error("<h3>Invalid JSON structure</h3>")

            }

        }, //If invalid JSON file
        3
        
    )
    const supportableBuilt = '0.1.0'
    await updateImport(

        150,
        () => {

            if (data.length != 3) throw new Error (`
                <h3>Not compatible JSON file</h3> 
                <br/>
                <p>Not compatible data lenght → ${data.length}</p>`)
            if (Object.keys(data[0]).length != 2) throw new Error (`
                <h3>Not compatible JSON file</h3> 
                <br/>
                <p>Not compatible header lenght → ${Object.keys(data[0]).length}</p>`)
            if (data[0].file != 'Kuma Kamello') throw new Error (`
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
                return fP <= sP

            }

            if(supported) throw new Error (`
                <p>Not compatible file version</p> 
                <br/>
                <p>Doesn't support ${data[0].version} files. Current update → ${supportableBuilt}`)
            

        }, //If not the right JSON file
        5
        
    )

    //Stage 3 - Check if setting and classController have the right format
    const fileSetting = [...data[1]]
    const checkSetting = ['string', 'number', 'number', 'number', 'number', 'number', 'boolean', 'boolean', 'string']
    const errorStt = ['Table name', 'Inital day', 'End day', 'Initial hour', 'Ending hour', 'Hour unit', 'Deadtime', '24-hour calendar', 'Table color']
    for (let i = 0; i < checkSetting.length; i++) {

        await updateImport(

            120,
            () => {

                if (i == checkSetting.length-1 && fileSetting[i][0] != '#') throw new Error (`
                    <h3>Invalid table settings</h3>
                    <br/>
                    <p>${errorStt[i]} value is not compatible</p>
                    <p>Expected type → ${checkSetting[i]}</p>`)
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

                120,
                async () => {

                    if (c == 2 && element[keys[c]][0] != '#') throw new Error(`
                            <h3>Invalid class settings</h3>
                            <br/>
                            <p>For class id: ${element.id}, ${keys[c]} value is not compatible</p>
                            <p>Expected type → ${checkController[c]}</p>`)

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

                                    50,
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

    
    await wait(300)
    console.log('state4')
    progress += 30
    progressBar.value = progress

    await wait(300)
    console.log('state5')
    progress += 30
    progressBar.value = progress

    await wait(300)
    console.log('state6')
    progress += 20
    progressBar.value = progress

    Swal.close()

    //ChatGPT made this
    function readFile(file) {

        return new Promise((resolve, reject) => {

            const reader = new FileReader();

            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error("File read error"));

            reader.readAsText(file);

        });

    }


}
