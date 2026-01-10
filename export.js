import { setting } from "./settings.js" //Table settings
import { classController } from "./class.js" // All controllers

const exportBtn = document.getElementById('export')


//To enable/disable
document.addEventListener("change", () => {

    disbaleExport(true, exportBtn.disabled)

})
document.addEventListener("updateBlock", () => {

    disbaleExport(classController.length > 0, true)

})
document.addEventListener("reset", () => { 

    disbaleExport(false, classController.length <= 0)

})

function disbaleExport (disabled, condition) {

    if(condition){

        exportBtn.disabled = !disabled

    }

}


//To make the JSON file
exportBtn.addEventListener("click", createFile)

function createFile() {

    const info  = [{file:'Kuma Kamello',version:'0.1.1'}]

    info.push(setting, classController)

    const file = new Blob([JSON.stringify(info, null, 2)],{type:"application/json"})

    const anchor = document.createElement('a')
    anchor.href = URL.createObjectURL(file)
    anchor.download = setting[0] ? `KumaSession_${setting[0]}`:'KumaSession_unnamed.json'
    anchor.click()

}