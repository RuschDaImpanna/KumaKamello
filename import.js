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

    parent.insertBefore(loadObj, progressBar)
    parent.insertBefore(document.createElement('br'), loadObj)
    parent.insertBefore(document.createElement('br'), progressBar)
    parent.insertBefore(document.createElement('br'), progressBar)

    loadObj.style.inset = "0";
    loadObj.style.margin = "auto";

}

async function importSession(progressBar, file) {

    const wait = ms => new Promise(res => setTimeout(res, ms))
    let progress = 0

    async function updateImport (time, condition, points){

        await wait(time)

        await condition()

        progress += points
        progressBar.value = progress

    }



    //State 1 - Know if file is json
    await updateImport(

        100,
        () => {

            if (!file) throw new Error (`No file provided`)

        }, //If !file
        1

    )
    await updateImport(

        250,
        () => {

            const type = file.type

            if (type.slice(type.indexOf('/')+1) != 'json') throw new Error (`
                <p>Not compatible file type</p>
                <br/>
                <p>Your file → ${type} | Needed type → application/json</p>`)

        }, //If different file type
        4
        
    )



    //State 2 - Check if the file contains all settings and correct file use
    let rawText
    await updateImport(

        100,
        async () => {

            try {

                rawText = await readFile(file)

            } catch (e) {
    
                throw new Error("<p>Failed to read file</p>")

            }

        }, //If failed to read
        1
        
    )
    
    let data
    await updateImport(

        100,
        async () => {

            try {

                data = JSON.parse(rawText)

            } catch {
    
                throw new Error("<p>Invalid JSON structure</p>")

            }

        }, //If invalid JSON file
        1
        
    )

    const supportableBuilt = '0.1.1'
    await updateImport(

        150,
        () => {

            if (data.length != 3) throw new Error (`
                <p>Not compatible JSON file</p> 
                <br/>
                <p>Not compatible data lenght → ${data.length}</p>`)
            if (data[0].length != 2) throw new Error (`
                <p>Not compatible JSON file</p> 
                <br/>
                <p>Not compatible header lenght → ${data[0].length}</p>`)
            if (data[0].file != 'Kuma Kamello') throw new Error (`
                <p>Not compatible JSON file</p> 
                <br/>
                <p>Doesn't support ${data[0].file} file type`)
            
            const [version, update, patch] = supportableBuilt.split('.').map(Number)

            if(data[0].version != `${version}.${update}.${patch}`) throw new Error (`
                <p>Not compatible file version</p> 
                <br/>
                <p>Doesn't support ${data[0].version} files. Current update → ${supportableBuilt}`)
            

        }, //If not the right JSON file
        3
        
    )

   
    await wait(300)
    console.log('state3')
    progress += 10
    progressBar.value = progress

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
