/**
 * 游戏中所有点的基类
 */
export default class Point {
    constructor(options) {
        if (options) {
            this.x = options.x || 1;
            this.y = options.y || 1;
            this.radius = options.radius;
            this.color = options.color;
        }
    }
}