/**
 * 武器粒子
 * type: shield/gravity/time/minimize/life
 */

import Enemy from './Enemy';
import map from './Map';

const COLORS = {
    shield: '#007766',
    gravity: '#225599',
    time: '#665599',
    minimize: '#acac00',
    life: '#009955'
};
const TEXTS = {
    shield: '盾',
    gravity: '力',
    time: '慢',
    minimize: '小',
    life: '命'
};

export default class Skill extends Enemy {

    constructor(options) {
        super(options);
        this.id = 1;
        this.radius = 9;
        this.isEated = false;
    }

    update() {
        this.x -= this.speed;
        this.y += this.speed;

        if (this.x < -10 || this.y > map.height + 10)  {
            this.x = Math.random() * map.width + map.width;
            this.y = -Math.random() * map.height;
            this.reset();
        }
    }

    reset() {
        this.id++;
        this.radius = 9;
        this.isEated = false;
        this.type = ['shield', 'gravity', 'time', 'minimize', 'life',''][Math.floor(Math.random() * 5)];;
    }

    //被使用
    use() {
        this.isEated = true;
        this.radius = 0; //死亡暂时设置为0
    }

    render() {
        var self = this;

        map.ctx.beginPath();

        self.color = COLORS[self.type];

        map.ctx.fillStyle = self.color;
        map.ctx.arc(self.x, self.y, self.radius, 0, Math.PI*2, false);
        map.ctx.fill();

        if (!self.isEated) {
            map.ctx.fillStyle="#fff";
            map.ctx.fillText(TEXTS[self.type], self.x - 6, self.y + 4);
        }
    }
}

