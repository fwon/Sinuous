/**
 * 进度条功能
 */

const canvas = document.getElementById("loading");
const ctx = canvas.getContext("2d");
let w = window.innerWidth;
let h = window.innerHeight;
canvas.width = w;
canvas.height = h;

const TOTALWIDTH = 200;
const BARHEIGHT = 5;
let counter = 0;
let particles = [];
let particle_no = 25;
let prevBarWidth = 0;
let barStartX = (w - TOTALWIDTH)/2;
let barStartY = (h - BARHEIGHT)/2;

class progressbar {
    constructor() {
        this.total = TOTALWIDTH;
        this.width = 0;
        this.hue = 0;    
    }
    
    draw() {
        ctx.fillStyle = 'hsla('+this.hue+', 100%, 40%, 1)';
        ctx.fillRect(barStartX, barStartY, this.width, BARHEIGHT);
        let grad = ctx.createLinearGradient(0,0,0,130);
        grad.addColorStop(0,"transparent");
        grad.addColorStop(1,"rgba(0,0,0,0.5)");
        ctx.fillStyle = grad;
        ctx.fillRect(barStartX, barStartY, this.width, BARHEIGHT);      
    }
}

class particle {
    constructor() {
        this.x = barStartX + bar.width;
        this.y = barStartY;
        
        this.vx = 0.8 + Math.random()*1;
        this.v = Math.random()*5;
        this.g = 1 + Math.random()*3;
        this.down = false;
    }

    draw() {
        ctx.fillStyle = 'hsla('+(bar.hue+0.3)+', 100%, 40%, 1)';;
        let size = Math.random()*1;
        ctx.fillRect(this.x, this.y, size, size);
    }
}

let bar = new progressbar();

function reset() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0,0,w,h);
      
    ctx.fillStyle = "#171814";
    ctx.fillRect(barStartX, barStartY, TOTALWIDTH, BARHEIGHT);
}

function update(){
    for(let i = 0; i < particles.length; i++) {
        let p = particles[i];
        p.x -= p.vx;
        if(p.down == true){
            p.g += 0.1;
            p.y += p.g;
        }
        else{
            if(p.g<0){
                p.down = true;
                p.g += 0.1;
                p.y += p.g;
            }
            else{
                p.y -= p.g;
                p.g -= 0.1;
            }
        }
        p.draw();
    }
}

export function draw(ratio) {
    reset();
    counter++;
    
    bar.hue += 0.8;
    
    let currentBarWidth = bar.total * ratio
    bar.width += 1;
    if (currentBarWidth !== prevBarWidth) {
        bar.width = currentBarWidth;
    }
    prevBarWidth = currentBarWidth;
    if(bar.width >= bar.total){
        if(counter > 215){
            reset();
            bar.hue = 0;
            bar.width = 0;
            counter = 0;
            particles = [];
        }
        else{
            bar.hue = 126;
            bar.width = bar.total + 1;
            bar.draw();
        }
    } else {
        bar.draw();
        for(let i = 0; i < particle_no; i += 10){
            particles.push(new particle());
        }
    }
    update();
}