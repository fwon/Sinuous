/**
 * 尾巴中的生命粒子
 */

import map from './Map';
import Point from './Point';

export default class Life extends Point {

    constructor(options) {
        super(options);
        this.dead = false;
    }

    render(pos) {
        let self = this;
        
        //粒子撞击后不渲染
        if (!this.dead) {
            map.ctx.beginPath();
            map.ctx.fillStyle = self.color;
            map.ctx.arc(pos.x, pos.y, 3, 0, 2 * Math.PI, false);
            map.ctx.fill();
        }
    }
}