/**
 * 撞击后的粒子
 */

import map from './Map';

const rand = Math.random;

export default class Particle {

    constructor(options) {
        this.x = options.x;
        this.y = options.y;
        this.vx = -2 + 4 * rand();
        this.vy = -2 + 4 * rand();
        this.destroy = false;
        this.speed = 0.04;
        this.size = options.size || 2;
        this.color = options.color || "rgb(30,136,168)";
        this.width = this.size + rand() * 2;
        this.height = this.size + rand() * 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        this.width -= this.speed;
        this.height -= this.speed;

        if (this.width < 0) {
            this.destroy = true;
        }
    }

    render() {
        map.ctx.fillStyle = this.color;
        map.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}