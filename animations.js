//Inspired by Johan Fagerbeg work: https://codepen.io/birjolaxew/pen/QPYOxb
const pixelSize = 4


//This part of getting a screenshot form the object was made by ChatGPT
export async function getMesh (element) {

    const shadowElements = [...element.childNodes].filter(e => { return window.getComputedStyle(e).boxShadow != 'none' })

    const shadows = []

    shadowElements.forEach(element => {

        shadows.push(element.style.boxShadow)
        element.style.boxShadow = 'none'
        
    });

    const mesh = []

    const canvas = await html2canvas(element, { backgroundColor: null, scale: 0.35, useCORS: true, logging: false })
    const ctx = canvas.getContext("2d")
    const { width, height } = canvas

    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data

    for (let y = 0; y < height; y += pixelSize) {

        for (let x = 0; x < width; x += pixelSize) {

            let r = 0, g = 0, b = 0, a = 0;
            let count = 0;

            for (let dy = 0; dy < pixelSize; dy++) {

                for (let dx = 0; dx < pixelSize; dx++) {

                    const px = x + dx;
                    const py = y + dy;

                    //Prevent getting out of the canvas
                    if (px >= width || py >= height) continue;

                    const index = (py * width + px) * 4;
                    const alpha = data[index + 3];

                    if (alpha == 0) continue; //Ignores transparent
                    if (alpha < 200) continue;

                    r += data[index];
                    g += data[index + 1];
                    b += data[index + 2];
                    a += alpha;
                    count++;

                }

            }

            if (count == 0) continue;

            r = Math.round(r / count);
            g = Math.round(g / count);
            b = Math.round(b / count);
            a = Math.round(a / count);

            mesh.push({ x, y, color: `rgba(${r},${g},${b},${a / 255})` });

        }

    }
    
    for (let i = 0; i < shadowElements.length; i++) {
        
        shadowElements[i].style.boxShadow = shadows[i]
        
    }

    return { mesh, width, height }


}

function createMesh ({ mesh, width, height }, original){

    //Create mesh
    const delBlock = document.createElement("div")
    delBlock.style.position = "relative"

    delBlock.style.width = width + "px"
    delBlock.style.height = height + "px"

    delBlock.style.userSelect = "none"
    delBlock.style.cursor = "not-allowed"

    mesh.forEach(cell => {

        if (cell.color == 'rgba(255,255,255,1)') return

        const px = document.createElement("div")
        px.style.position = "absolute"

        px.style.left = cell.x + "px"
        px.style.top = cell.y + "px"

        px.style.width = pixelSize + "px"
        px.style.height = pixelSize + "px"

        px.style.backgroundColor = cell.color

        delBlock.appendChild(px)

    })

    original.replaceWith(delBlock)

    return delBlock

}

export function disintegrateAnim ({ mesh, width, height }, original) {

    const delBlock = createMesh({ mesh, width, height }, original)

    const particles = []
    const gravity = 0.01
    const fadeSpeed = 0.02

    delBlock.childNodes.forEach(px => {

        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 6

        particles.push({

            px: px,
            x: px.offsetLeft,
            y: px.offsetTop,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            rotation: Math.random() * 360,
            vr: (Math.random() - 0.5) * 8,
            life: 1

        });

        px.style.position = "absolute"
        px.style.opacity = 1
        px.style.willChange = "transform, opacity"
        
        
    });

    function animate() {

        let alive = 0

        particles.forEach(p => {

            if (p.life <= 0) return;

            alive++;

            p.vy += gravity
            p.x += p.vx
            p.y += p.vy
            p.rotation += p.vr
            p.life -= fadeSpeed;

            p.px.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.rotation}deg)`
            p.px.style.opacity = p.life

        });

        if (alive > 0) {
            requestAnimationFrame(animate);
        } else {
            delBlock.remove();
        }

    }

    requestAnimationFrame(animate);

}