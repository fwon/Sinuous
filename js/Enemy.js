/**
 * 敌人粒子类
 */

import map from './Map';
import Point from './Point';

export default class Enemy extends Point {
    
    constructor(options) {
        super(options);
        this.radius = Math.random() * 2 + 3;
        this.color = "red";
        this.vx = 0;
        this.vy = 0;
        this.speed = options.speed || Math.random() * 2 + 0.5;
        this.type = options.type || 'normal';
        this.ratio = window.innerHeight / window.innerWidth;
    }

    update() {
        this.x -= this.speed;
        this.y += this.speed;
        
        if (this.x < -10) {
            this.x = map.width + 10 + Math.random() * 30;
        }
        if (this.y > map.height + 10) {
            this.y = -10 + Math.random() * -30;
        }
    }

    speedUp(speed) {
        this.speed += speed || 0.2;
    }

    speedDown(speed) {
        let _speed = speed || 0.8
        if (this.speed > _speed) this.speed -= _speed;
    }

    minimize(size) {
        let _size = size || 2;
        if (this.radius > _size) this.radius -= _size;
    }

    magnify(size) {
        this.radius += size || 2;
    }

    //躲避player
    escape(player) {
        // let angle = Math.atan(Math.abs(player.y - this.y) / Math.abs(player.x - this.x));
        // let addX = (player.gravityRadius) * Math.cos(angle);
        // let addY = (player.gravityRadius) * Math.sin(angle);

        // if (this.x > player.x && this.x < player.x + addX) {
        //     this.x += this.speed * 2;
        // } else if (this.x < player.x && this.x > player.x - addX) {
        //     this.x -= this.speed * 2;    
        // }

        // if (this.y > player.y && this.y < player.y + addY) {
        //     this.y += this.speed;
        // } else if (this.y < player.y && this.y > player.y - addY) {
        //     this.y -= this.speed;    
        // }
        
        // if (this.y > player.y + addY) {
        //     console.log('a');
        //     this.x -= this.speed * Math.sin(angle);
        //     this.y -= this.speed * Math.cos(angle);
        // } else {
        //     console.log('b');
        //     this.x += this.speed * Math.sin(angle);
        //     this.y += this.speed * Math.cos(angle);
        // }
        let ratio = 1/30;
        let angle = Math.atan2(this.y - player.y, this.x - player.x);
        let ax = Math.abs(player.gravityRadius * Math.cos(angle));    
        ax = this.x > player.x ? ax : -ax;    

        let ay = Math.abs(player.gravityRadius * Math.sin(angle));    
        ay = this.y > player.y ? ay : -ay;

        this.vx += ax * ratio;
        this.vy += ay * ratio;
        this.x += this.vx * ratio;
        this.y += this.vy * ratio;
    }

    render() {
        var self = this;

        map.ctx.beginPath();

        map.ctx.fillStyle = self.color;
        map.ctx.arc(self.x, self.y, self.radius, 0, Math.PI*2, false);
        map.ctx.fill();

    }
}