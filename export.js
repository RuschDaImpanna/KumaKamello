import { setting } from "./settings.js" //Table settings
import { classController } from "./class.js" // All controllers
import { classSlots } from "./section.js"

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

export function createFile() {

    const info  = [{file:'Kuma Kamello',version:'0.2.0'}]
    const exportedSlots = classSlots.map(slot => ({

        obj: slot.outerHTML,
        parent: slot.parentNode.id
        
    }));

    info.push(setting, classController, exportedSlots)

    const file = new Blob([JSON.stringify(info, null, 2)],{type:"application/json"})

    const anchor = document.createElement('a')
    anchor.href = URL.createObjectURL(file)
    anchor.download = setting[0] ? `KumaSession_${setting[0]}`:'KumaSession_unnamed.json'
    anchor.click()

}