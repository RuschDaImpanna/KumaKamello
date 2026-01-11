const importBtn = document.getElementById('import')

importBtn.addEventListener("change" , () => {

    const file = importBtn.files[0]

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
            importSession(popup, progressBar, file);

        },

        willClose: () => {

            //Almost to close


        }

    }).then((result) => {

        //Alert ended

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

async function importSession(popup, progressBar, file) {

    const wait = ms => new Promise(res => setTimeout(res, ms))

    let progress = 0

    await wait(300)
    console.log('state1')
    progress += 5
    progressBar.value = progress

    await wait(300)
    console.log('state2')
    progress += 5
    progressBar.value = progress

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

}
