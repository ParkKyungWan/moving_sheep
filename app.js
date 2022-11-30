import { Hill } from "./hill.js";
import { SheepController } from "./sheep-controller.js";
import { Sun } from './sun.js';

class App {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas);
        
        this.hills= [
            new Hill('#fd6bea', 1.4, 6),
            new Hill('#ff59c2', 0.5, 8),
            new Hill('#ff4674', 1.4, 6),
        ];

        this.sun = new Sun();
        this.sheepController = new SheepController();

        window.addEventListener('resize', this.resize.bind(this), false);
        this.resize();

        requestAnimationFrame(this.animate.bind(this));
    }

    resize(){
        this.stageWidth = document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;

        this.canvas.width = this.stageWidth * 2;
        this.canvas.height = this.stageHeight * 2;
        this.ctx.scale(2, 2);
        // x2 scaling for retina display

        for( let i = 0 ; i < this.hills.length; i++ ){
            this.hills[i].resize(this.stageWidth, this.stageHeight);
        }

        this.sun.resize( this.stageWidth, this.stageHeight);
        this.sheepController.resize( this.stageWidth, this.stageHeight );
    }

    animate(t){ /* t: 타임스탬프 (fps정의)*/
        requestAnimationFrame(this.animate.bind(this));

        this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
        
        this.sun.draw( this.ctx, t );

        let dots;
        for( let i = 0 ; i < this.hills.length; i++ ){
            dots = this.hills[i].draw(this.ctx);
        }
        this.sheepController.draw(this.ctx, t, dots);
    }
}
window.onload = () => {
    new App();
}