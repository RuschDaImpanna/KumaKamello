const form = document.getElementById('tableSettings');
//const schedule = document.querySelector(".schedule");

const setting = ['', 0, 4, 3]

form.addEventListener("change", () => {

    readSettings()
    createTable()

})

form.addEventListener("reset", () => { 

    setTimeout(() => {

        readSettings()
        createTable()
        
    }, 0)

})

function readSettings() {
    
    setting[0] = form.title.value
    setting[1] = [...form.initDay].findIndex(obj => obj.checked)
    setting[2] = [...form.finalDay].findIndex(obj => obj.checked)
    setting[3] = form.initTime.value
    setting[4] = form.endTime.value
    setting[5] = [...form.units].findIndex(obj => obj.checked)

    console.log(setting)

}

function createTable() {

    //Set title
    document.getElementById('tableTitle').innerHTML = setting[0]

    //Calculate x table
    const xSize = ((setting[2] - setting[1] + 7) % 7) + 1;

    //Calculate y table


    console.log(xSize)

}