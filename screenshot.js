import { classController } from "./class.js" // All controllers
import { setting } from "./settings.js"

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
        
        const canvas = await html2canvas(schedule, { backgroundColor: "#ffffff", scale: 2, useCORS: true })

        const imageURL = canvas.toDataURL("image/png")

        schedule.style.backgroundColor = ''
        document.getElementById('logoSS').remove()
        schedule.appendChild(bottomArea)

        ghosts.forEach(element => {

            element.hidden = false
            
        });

        Swal.fire({

            imageUrl: imageURL,
            imageAlt: "Screenshot",
            showCloseButton: true,
            showDenyButton: true,
            confirmButtonText: "Download Image",
            confirmButtonColor: 'green',
            denyButtonText: "Copy To Clipboard",
            denyButtonColor: '#3085d6'
            

        }).then(async result => {

            //Download
            if (result.isConfirmed){

                const anchor = document.createElement('a')
                anchor.href = imageURL
                anchor.download = setting[0] ? `KumaSession_${setting[0]}.png`:'KumaSession_unnamed.png'
                anchor.click()

            }
            //Copy image to clipboard
            else if (result.isDenied){

                const blob = await canvasToBlob(canvas)

                await navigator.clipboard.write([

                    new ClipboardItem({

                        "image/png": blob

                    })

                ])

                function canvasToBlob(canvas) {

                    return new Promise(resolve => {

                        canvas.toBlob(blob => resolve(blob), "image/png")
                        
                    })

                }


            }

        })


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
            icon.setAttribute('viewBox', '0 0 6035 2895')
            icon.setAttribute('transform', 'translate(8, -5)')

            icon.style.position = 'absolute'
            icon.style.top = 0
            
            icon.style.width = '100px'
            icon.style.height = '100px'
            
            icon.style.color = lightColor
            
            icon.style.zIndex = 1

                const transform = document.createElementNS('http://www.w3.org/2000/svg', 'g')
                transform.setAttribute('transform', 'matrix(1,0,0,0.25,-1337.544782,-182.092454)')

                    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
                    path.setAttribute('d', 'M2682.248,3270.81C2609.008,3584.782 2508.098,3803.583 2461.768,3803.583C2599.185,4275.831 2648.1,4664.832 2688.744,4989.987C2708.099,5152.564 2727.937,5642.231 2748.259,6458.988C2753.464,6668.175 2761.874,7045.795 2761.874,7045.795C2771.945,7519.243 2679.27,8005.728 2679.27,8005.728L2777.387,8005.728C2777.387,8005.728 2778.743,8203.103 2778.743,8287.982L2378.106,8287.982C2378.106,8204.73 2376.591,8005.728 2376.591,8005.728C2376.591,8005.728 2360.584,7531.394 2360.584,7034.149C2360.584,7034.149 2352.267,7037.909 2350.526,6493.407C2349.399,6141.052 2362.753,5693.948 2341.641,5473.345C2300.131,5039.591 2206.708,4840.3 2125.419,4840.3L2015.099,4840.3L2014.832,7043.849C2014.832,7531.48 1914.054,8015.428 1914.054,8015.428L2014.715,8015.428L2014.681,8297.682L1614.044,8297.682L1614.044,4579.94C1502.493,4084.939 1489.328,3356.956 1489.328,3203.748C1489.328,3003.415 1490.723,2444.532 1615.918,1830.578C1615.918,1830.578 1687.311,1432.399 1512.428,1432.399L1337.545,1432.399L1337.545,1081.109C1337.545,987.674 1346.846,898.086 1363.392,832.137C1379.939,766.188 1402.37,729.308 1425.728,729.644C1476.84,730.586 1536.698,731.251 1616.007,728.37C1673.753,728.37 1704.81,759.136 1756.51,881.368C1756.51,737.656 1957.543,728.37 2015.188,728.37L1894.47,1080.385C1894.47,1080.385 1913.017,1476.19 1879.866,2321.259C1867.446,2637.883 1949.853,3201.55 2095.729,3183.468C2265.222,3162.458 2445.155,2669.47 2431.028,1593.547C2421.477,866.145 2632.374,956.481 2632.374,956.481C2672.667,956.481 2708.371,1071.973 2738.445,1217.597C2774.672,1477.487 2855.033,1497.285 2855.033,1497.285L2855.033,1496.895C2855.033,1496.895 2935.394,1477.487 2971.621,1217.597C2971.29,1222.504 2970.962,1227.398 2970.635,1232.278C2970.961,1230.655 2971.29,1229.04 2971.621,1227.433C3001.695,1081.808 3037.399,966.316 3077.693,966.316C3077.693,966.316 3288.589,875.98 3279.039,1603.383C3264.912,2679.306 3444.844,3172.294 3614.337,3193.304C3760.213,3211.386 3842.621,2647.718 3830.2,2331.094C3797.049,1486.025 3815.597,1090.22 3815.597,1090.22L3694.879,738.205C3752.523,738.205 3953.556,747.491 3953.556,891.203C4005.256,768.971 4036.314,738.205 4094.059,738.205C4173.368,741.086 4233.226,740.421 4284.338,739.48C4307.697,739.143 4330.127,776.024 4346.674,841.973C4363.221,907.921 4372.522,997.51 4372.522,1090.944L4372.522,1442.235L4197.639,1442.235C4022.756,1442.235 4094.148,1840.414 4094.148,1840.414C4219.343,2454.368 4220.738,3013.25 4220.738,3213.584C4220.738,3366.791 4207.573,4094.774 4096.022,4589.776L4096.022,8307.518L3695.386,8307.518L3695.351,8025.264L3796.012,8025.264C3796.012,8025.264 3695.234,7541.315 3695.234,7053.684L3694.967,4850.135L3584.647,4850.135C3503.359,4850.135 3409.936,5049.426 3368.425,5483.181C3347.313,5703.784 3360.667,6150.888 3359.541,6503.243C3357.8,7047.745 3349.483,7043.984 3349.483,7043.984C3349.483,7541.23 3333.475,8015.564 3333.475,8015.564C3333.475,8015.564 3331.961,8214.565 3331.961,8297.818L2931.324,8297.818C2931.324,8212.939 2932.679,8015.564 2932.679,8015.564L3030.796,8015.564C3030.796,8015.564 2938.121,7529.078 2948.192,7055.631C2948.192,7055.631 2956.602,6678.011 2961.807,6468.824C2982.129,5652.067 3001.967,5162.399 3021.322,4999.822C3061.966,4674.668 3110.882,4285.666 3248.298,3813.418C3193.144,3813.418 3060.64,3503.335 2989.551,3091.746C2961.387,2992.75 2917.139,2889.584 2855.033,2889.584C2789.233,2889.584 2743.478,3005.39 2715.66,3109.347C2705.507,3165.361 2694.249,3219.363 2682.248,3270.81ZM3981.773,1028.151L3925.339,1028.151C3922.8,1046.564 3921.355,1067.722 3921.355,1090.22C3921.355,1161.31 3935.784,1219.025 3953.556,1219.025C3971.328,1219.025 3985.757,1161.31 3985.757,1090.22C3985.757,1067.722 3984.312,1046.564 3981.773,1028.151ZM1728.293,1018.315C1725.754,1036.729 1724.309,1057.887 1724.309,1080.385C1724.309,1151.474 1738.738,1209.19 1756.51,1209.19C1774.283,1209.19 1788.712,1151.474 1788.712,1080.385C1788.712,1057.887 1787.267,1036.729 1784.728,1018.315L1728.293,1018.315Z')
                    path.setAttribute('fill', lightColor)

                    transform.appendChild(path)

                icon.appendChild(transform)

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