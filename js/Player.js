/**
 * 玩家粒子
 */

import Point from './Point';
import map from './Map';
import Life from './Life';
import Particle from './Particle';

function detect(arr, val) {
    return arr.some(function(v) {
        return val.match(v);
    })
}
const devices = ["android", "webos", "iphone", "ipad", "ipod", "blackberry", "windows phone", "mobile"];
const agent = navigator.userAgent.toLowerCase();
const isMobile = detect(devices, agent);
const BODYCOLOR = "rgb(30,136,168)"
const REDSCORE = 2; //撞击每个红点的分数
let dis = 1; //每个几帧画一个尾巴粒子的计数器

export default class Player extends Point {
    
    constructor(options) {
        super(options);
        this.enemys = options.enemys;
        this.color = options.color || BODYCOLOR;
        this.radius = 5;
        this.lives = options.lives || 2; //生命值
        this.livesPoint = [];
        this.tail = []; //尾巴位置数组
        this.tailLen = 25; //尾巴长度
        this.skill = null;
        this.shieldRadius = 20;
        this.shieldColor = "rgba(30,136,168,0.6)";
        this.gravityRadius = 80;
        this.gravityTime = 500;
        this.particleCount = 30;
        this.particles = [];
        this.addScore = [];
        this.binding();
        this.initLife();
    }

    binding() {
        let self = this;

        if (isMobile) {
            self.moveTo(self.x, self.y);
            window.addEventListener('touchstart', e => {
                e.preventDefault();
                self.touchStartX = e.touches[0].pageX;
                self.touchStartY = e.touches[0].pageY;
            });
            //手机上用位移计算位置
            window.addEventListener('touchmove', e => {
                e.preventDefault();
                let moveX = e.touches[0].pageX - self.touchStartX;
                let moveY = e.touches[0].pageY - self.touchStartY;
                self.moveTo(self.x + moveX, self.y + moveY);
                self.touchStartX = e.touches[0].pageX;
                self.touchStartY = e.touches[0].pageY;
            });
        } else {
            let left = (document.getElementById("game").clientWidth - 
                    document.getElementById("world").clientWidth)/2;
            window.addEventListener('mousemove', (e = window.event) => {
                self.moveTo(e.clientX - left - 10, e.clientY - 30);
            });
        }
    }

    moveTo(posX, posY) {
        this.x = posX;
        this.y = posY;
    }

    //爆炸方法
    boom(x, y, color, size) {
        let self = this;
        let eachPartical = [];
        for (let i = 0; i < self.particleCount; i++) {
            eachPartical.push(new Particle({x, y, color, size}));
        }
        self.particles.push(eachPartical);
    }

    //撞击
    collision(enemyX, enemyY) {
        if (this.hasShield) {
            this.boom(enemyX || this.x, enemyY || this.y, "red");
            this.addScore.push({
                x: enemyX,
                y: enemyY,
                opacity: 1
            });
            let score = document.getElementById('time').innerText;
            document.getElementById('time').innerText = (+score + REDSCORE);
        } else if (this.hasGravity) {
            //do nothing
        } else {
            this.minusLife();
            this.boom(this.x, this.y);
            this.flash();
        }
    }

    //初始化生命值
    initLife() {
        this.livesPoint = [];
        for(let i = 0; i < this.lives; i++) {
            this.livesPoint.push(new Life({}));
        }
    }
    //增加生命值
    addLife() {
        this.lives++;
        //死亡的子节点只标记为dead，并不会移除
        if (this.livesPoint.length < this.lives) {
            this.livesPoint.push(new Life({})); 
        } else {
            this.livesPoint[this.lives - 1].dead = false;
        }

        this.changeTailLen();
    }

    //减掉生命值
    minusLife() {
        if (this.lives > 0) {
            var life = this.livesPoint[this.lives - 1];
            life.dead = true;
            this.lives--;
        } else {
            //dead
            this.destroy();
        }

        this.changeTailLen();
    }

    //改变尾巴长度
    changeTailLen() {
        if(this.lives > 2) {
            this.tailLen = 25 + (this.lives - 2) * 5;
        } else {
            this.tailLen = 25;
        }
    }

    //失去生命的时候身体闪烁
    flash() {
        let self = this;
        
        self.flashing = true;
        let timeout = setTimeout(function() {
            self.flashing = false;
            self.color = BODYCOLOR;
            clearTimeout(timeout);
        }, 500);
    }

    destroy() {
        this.dead = true;
        this.lives = -1;
    }

    setSkill(type) {
        let self = this;

        self.skill = type;

        switch (self.skill) {
            case 'time':
                if (self.enemys) {
                    for (let i = 0; i < self.enemys.length; i++) {
                        self.enemys[i].speedDown();
                    }
                    let timeout = setTimeout(function() {
                        for (let i = 0; i < self.enemys.length; i++) {
                            self.enemys[i].speedUp(0.8);
                        }
                        clearTimeout(timeout);
                    }, 8000);
                }
                break;
            case 'minimize':
                if (self.enemys) {
                    for (let i = 0; i < self.enemys.length; i++) {
                        self.enemys[i].minimize();
                    }
                    let timeout = setTimeout(function() {
                        for (let i = 0; i < self.enemys.length; i++) {
                            self.enemys[i].magnify();
                        }
                        clearTimeout(timeout);
                    }, 8000);
                }
                break;
            case 'life':
                self.addLife();
                break;
            case 'shield':
                self.hasShield = true;
                break;
            case 'gravity':
                self.hasGravity = true;
                self.
                break;
            default:
                break;
        }
    }

    recordTail() {
        let self = this;
        if (self.tail.length > self.tailLen) {
            self.tail.splice(0, self.tail.length - self.tailLen);
        }
        self.tail.push({
            x: self.x,
            y: self.y
        });
    }

    render() {
        let self = this;

        if (!self.dead) {
            map.ctx.beginPath();
            
            //闪烁效果
            if (self.flashing) {
                self.color = ["#fff", BODYCOLOR][Math.round(Math.random())];
            }

            map.ctx.fillStyle = self.color;
            map.ctx.arc(self.x, self.y, self.radius, 0, Math.PI*2, false);
            map.ctx.fill();

            if (dis % 2) self.recordTail();
            dis++;

            if (self.tail.length > self.tailLen - 10) {
                self.renderTail();    
            }

            //有护盾
            if (self.hasShield) self.renderShield();

            //有重力
            if (self.hasGravity) self.renderGravity();

            //分数
            if (self.addScore.length) self.renderAddScore();
        }

        //爆炸
        if (self.particles.length) self.renderBoom();
    }

    renderTail() {
        let self = this;
        let tails = self.tail, prevPot, nextPot;
        map.ctx.beginPath();
        map.ctx.lineWidth = 2;
        map.ctx.strokeStyle = self.color;

        for(let i = 0; i < tails.length - 1; i++) {
            prevPot = tails[i];
            nextPot = tails[i + 1];
            if (i === 0) {
                map.ctx.moveTo(prevPot.x, prevPot.y);
            } else {
                map.ctx.quadraticCurveTo(prevPot.x, prevPot.y, prevPot.x + (nextPot.x - prevPot.x) / 2, prevPot.y + (nextPot.y - prevPot.y) / 2);
            }

            //保持尾巴最小长度，并有波浪效果
            prevPot.x -= 1.5;
            prevPot.y += 1.5;
        }

        map.ctx.stroke();
        
        self.renderLife();
    }
    //渲染生命值节点
    renderLife() {
        let self = this;
        for(let j = 1; j <= self.livesPoint.length; j++) {
            let tailIndex = j * 5;
            let life = self.livesPoint[j - 1];
            life.render(self.tail[tailIndex]);
        }
    }

    renderShield() {
        map.ctx.beginPath();
        map.ctx.globalCompositeOperation="source-over";
        map.ctx.fillStyle = this.shieldColor;
        map.ctx.arc(this.x, this.y, this.shieldRadius, 0, Math.PI*2, false);
        map.ctx.fill();
        map.lineWidth = 0.2;
        map.ctx.strokeStyle = "#5DAC81";
        map.ctx.arc(this.x, this.y, this.shieldRadius, 0, Math.PI*2, false);
        map.ctx.stroke();
        this.shieldRadius -= 0.02;
        if (this.shieldRadius < 15) {
            this.shieldColor = ( this.shieldColor === "rgba(30,136,168,0.6)") ?
                                "rgba(30,136,168,0.2)" : "rgba(30,136,168,0.6)"; 
        }
        if (this.shieldRadius < 10) {
            this.hasShield = false;
            this.shieldColor = "rgba(30,136,168,0.6)";
            this.shieldRadius = 25;
        }
    }

    renderGravity() {
        map.ctx.beginPath();
        map.ctx.globalCompositeOperation="source-over";

        var gradient = map.ctx.createRadialGradient(this.x, this.y, this.radius, this.x, this.y, this.gravityRadius);
        gradient.addColorStop(0, "rgba(30,136,168,0.8)");
        gradient.addColorStop(1, "rgba(30,136,168,0)");
            
        map.ctx.fillStyle = gradient;
        map.ctx.arc(this.x, this.y, this.gravityRadius, 0, Math.PI*2, false);
        map.ctx.fill();

        if (this.gravityTime-- < 0) {
            this.hasGravity = false;
            this.gravityTime = 500;
        }
    }

    renderBoom() {
        for (let i = 0; i < this.particles.length; i++) {
            let eachPartical = this.particles[i];
            for (let j = 0; j < eachPartical.length; j++) {
                if (eachPartical[j].destroy) {
                    eachPartical.splice(j, 1);
                } else {
                    eachPartical[j].render();
                    eachPartical[j].update();
                }
            }
        }    
    }

    renderAddScore() {

        for (let i = 0; i < this.addScore.length; i++) {
            let score = this.addScore[i];
            map.ctx.fillStyle = "rgba(255,255,255,"+ score.opacity +")";
            map.ctx.fillText("+" + REDSCORE, score.x + 40, score.y - 30);
            score.opacity -= 0.02;

            if (score.opacity < 0) {
                this.addScore.splice(i, 1);
            }
        }
    }
 }

