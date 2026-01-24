import { classController } from "./class.js" // All controllers

const ssBtn = document.getElementById('ssImg')

//To enable/disable
document.addEventListener("change", () => {

    disableScreenshot(true, ssBtn.disabled)

})
document.addEventListener("updateBlock", () => {

    disableScreenshot(classController.length > 0, true)

})
document.addEventListener("reset", () => { 

    disableScreenshot(false, classController.length <= 0)

})

function disableScreenshot (disabled, condition) {

    if(condition){

        ssBtn.disabled = !disabled

    }

}

ssBtn.addEventListener("click", createImage)

async function createImage() {

    Swal.fire({

        title: "Take screenshot",
        text: "Do you want to show also non-selected class sections?",
        icon: "question",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes, show also those",
        denyButtonText: "No, only selected ones"

    }).then(async result => {

        if (result.isDismissed) return

        const schedule = document.querySelector('.schedule')
        schedule.style.backgroundColor = document.body.style.backgroundColor

        schedule.appendChild(makeLogo())

        const bottomArea = document.querySelector('.bottomArea')

        bottomArea.remove()

        const ghosts = []

        if(result.isDenied) {
        
            let cid
            let sid

            classController.forEach(controller => {

                cid = controller.id

                controller.sections.forEach(section => {

                    sid = section.id

                    if (!section.selected){

                        const slotA = document.getElementById(`A${sid}.${cid}`)

                        slotA.hidden = true

                        ghosts.push(slotA)

                        if (section.splitSection){

                            const slotB = document.getElementById(`B${sid}.${cid}`)

                            slotB.hidden = true

                            ghosts.push(slotB)

                        }

                    }
                    
                });
                
            });
        
        }
        
        const canvas = await html2canvas(schedule, { backgroundColor: null, scale: 2, useCORS: true })

        const imageURL = canvas.toDataURL("image/png")

        schedule.style.backgroundColor = ''
        //document.getElementById('logoSS').remove()
        schedule.appendChild(bottomArea)

        ghosts.forEach(element => {

            element.hidden = false
            
        });

        Swal.fire({

            imageUrl: imageURL,
            imageAlt: "Screenshot",
            showCloseButton: true,
            confirmButtonText: "Copy to clipboard"

        });


        function makeLogo (){

            const styles = getComputedStyle(document.documentElement)
            const darkColor = styles.getPropertyValue('--darkColor').trim()
            const lightColor = resolveColor(styles.getPropertyValue('--lightColor').trim())

            //If color is mixColor
            function resolveColor(color) {
                const tmp = document.createElement("div");
                tmp.style.color = color
                document.body.appendChild(tmp)

                const colorGet = getComputedStyle(tmp).color
                tmp.remove()

                const rewrite = colorGet.slice(7).replace(' ', '(').replaceAll(' ', ',')

                //This replacement was made by ChatGPT
                const rgb = rewrite.replace( /rgb\(([^)]+)\)/,
                    (_, values) =>
                `rgb(${values
                    .split(',')
                    .map(v => Math.round(parseFloat(v) * 255))
                    .join(',')})`
                )

                return rgb
            }


            const star = document.createElement('div')
            star.id = 'logoSS'
            star.style.position = 'absolute'
            star.style.left = 0
            star.style.top = 0

            star.style.display = 'flex'
            star.style.justifyContent = 'center'
            star.style.alignItems = 'center'

            star.style.marginBottom = '30px'
            star.style.marginRight = '30px'

            star.style.width = '100px'
            star.style.height = '100px'

            star.style.backgroundColor = darkColor

                const left = document.createElement('div')
                left.style.position = 'absolute'

                left.style.width = '100px'
                left.style.height = '100px'

                left.style.backgroundColor = darkColor

                left.style.transform = 'rotate(30deg)'

                const right = document.createElement('div')
                right.style.position = 'absolute'

                right.style.width = '100px'
                right.style.height = '100px'

                right.style.backgroundColor = darkColor

                right.style.transform = 'rotate(-30deg)'
            
            star.append(left, right)


            const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
            icon.setAttribute('viewBox', '-16.87 -283.7 2499.35 1965.93')
            icon.setAttribute('preserveAspectRatio', 'xMidYMid meet')

            icon.style.position = 'absolute'
            icon.style.top = 0

            icon.style.width = '50px'
            icon.style.height = '50px'

            icon.style.color = lightColor

            icon.style.zIndex = 1

                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
                path.setAttribute('d', 'M2185.52,925.48c78.5,65,95.61,169.14,113.83,280.2,13.93,85,28.63,174.56,77.36,248q6.16-.6,12.49-.6a129.41,129.41,0,0,1,127,104.77,129.44,129.44,0,0,1-140.95-4.17l-1.34,1.43q-7.32-6.9-14.09-14a130.78,130.78,0,0,1-13-14.28c-122.16-142-113.12-314.53-174.29-417.77,9.91,46.56,9,77.15,9,77.43l0,2.19-.34,1.86q-3.32,18-5.87,36.78v0s-71.56,235.64,17.46,503.06c0,0-8.56-85-7.41-172.63,21.75,114.8,63.05,224.75,126.47,307.8-31.72,113.8-56.18,252.38-36.7,369.3l2.47,14.82h-181a91,91,0,0,1,79.49-71.84c-.19-133,24.45-270.32-76.52-377.56-69.73-49.25-126-95.8-171.3-138.22h0q-13.17-12.33-25.13-24.2c-43.08-44.21-131-146.81-178.59-289.66,0,0,16.54,194.11,154.82,358.26,15.49,70.33,39.64,136.41,73.7,192.82-42.34,105.77-80.48,235.18-77.17,350.41H1713.85a91.21,91.21,0,0,1,68.14-52.18l2.07-.38c9.9-93.46,32.77-187.73,14.52-276.57,23,29.29,28.23,63.51,28.23,63.51-6.8-136-103.49-196.21-103.73-196.37-128.18-117.59-199-215.75-237.49-283.3,77.65-7,128.4-37,128.4-37-72.94,17-198.86,4-199.81,3.89-54.62-6.22-102.24-14.74-135.63-21.57,25.1-52.9,66.43-89.57,66.43-89.57-95.33,30.64-122.7,120.84-122.7,120.84a142.29,142.29,0,0,0-8.9,43.31c80.19,263,38.2,661.47,30.74,725.42H1052.47a91,91,0,0,1,94.11-65.66c2,.15,4,.36,5.93.63l.32-2.23.81-5.79c.36-2.65.7-5.3,1-8q.4-3.3.78-6.63c15.19-134-8.3-280.27-56.08-416.51h0v0q-12.49-35.64-27.15-70.24c-50.44-175.62,12.29-362.84,12.29-362.84-114.75,102.94-58.91,322.55-57.92,326.42,26.37,240.21-21.09,528.89-36.08,610.83H796.13a91,91,0,0,1,94.1-65.66,92.23,92.23,0,0,1,12.44,1.77c59.88-281.06-106.28-792.6-328-1006.15,0,0,53.52,62.44,92,147.18-378.06-132.08-383.36-505.31-367.72-661.6,71,35.32,79.95,104.13,79.95,104.13C377.12,655.23,303.43,628,303.43,628c-34.59,1.76-252.63-61.46-275.14-81.46l-5.48-4.94L21,534.35c-33.91-138.08,149.68-150,182.24-151,106.14-42.56,184.14-52.6,241.44-45.05a310.94,310.94,0,0,0-15.64,74.32c31-79.58,80.54-112.56,82.11-113.59a133.52,133.52,0,0,1,89.69-12.48A135.89,135.89,0,0,1,602,303.91a132.62,132.62,0,0,1-39.94,95c36.22,43.27,40.42,93,40.45,93.36l.16,1.64-.07,1.56s-48.42,428.73,213.76,575.14c0,0-69.92-64.4-109-171.63,56.84,46.58,120.19,40,145,34.9,58.89-140.13,196.23-210.34,268.08-238.56-22.61,96.31-6.14,189.74-6.14,189.74,40.37-398,493.48-492.12,723.16-158.64,68.77,30,123.78,65.8,167.82,103.93a976.42,976.42,0,0,0-95.91,32.57c145.06-20,271,59.26,276.18,62.54')
                path.setAttribute('fill', lightColor)

                icon.appendChild(path)
            star.appendChild(icon)

            const label = document.createElement('h6')
            label.style.position = 'absolute'

            label.style.zIndex = 1
            label.style.color = lightColor

            label.style.top = '55px'
            label.style.fontSize  = '10px'
            label.style.margin = '0'

            label.innerText = 'Made with:'

            const title = document.createElement('h4')
            title.style.position = 'absolute'

            title.style.zIndex = 1
            title.style.color = lightColor

            title.style.top = '70px'
            title.style.fontSize  = '14px'

            title.innerText = 'Kuma Kamello'

            star.append(label, title)


            return star

        }


    })

}