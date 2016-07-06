/**
 * 地图类
 */

class Map {
    
    init(options) {
        this.canvas = options.canvas;
        this.ctx = this.canvas.getContext('2d');
        this.width = options.width;
        this.height = options.height;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    render() {
        this.clear();
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
}

export default new Map();