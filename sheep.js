export class Sheep {
    constructor(img, stageWidth){
        this.img = img;

        this.totalFrame = 8; //전체 프레임 수
        this.curFrame = 0; //현재 프레임

        this.imgWidth = 360; //양 그림 한 장 넓이 높이
        this.imgHeight = 300;

        this.sheepWidth = 180; //그려질 양의 크기 (레티나 디스플레이 감안해서 절반크기)
        this.sheepHeight = 150;

        this.sheepWidthHalf = this.sheepWidth /2 ;
        this.x = stageWidth + this.sheepWidth;
        this.y = 0;
        this.speed = Math.random() * 2 + 1;

        this.fps = 24;
        this.fpsTime = 1000 /this.fps; //timestamp와 비교값
    }

    draw(ctx, t, dots){
        if (!this.time) {
            this.time = t;
        }
        const now = t - this.time;
        if(now > this.fpsTime){
            this.time = t;
            this.curFrame += 1;
            if (this.curFrame == this.totalFrame){
                this.curFrame = 0;
            }

        }

        this.animate(ctx, dots);
    }

    animate(ctx, dots){
        this.x -= this.speed;

        const closest = this.getY(this.x, dots);
        this.y = closest.y;

        ctx.save(); 
        ctx.translate(this.x, this.y);
        ctx.rotate(closest.rotation)
        ctx.drawImage(
            this.img,
            this.imgWidth * this.curFrame,
            0,
            this.imgWidth,
            this.imgHeight,
            -this.sheepWidthHalf, //해당 좌표가 양의 중심, 아래쪽이어야 하므로
            -this.sheepHeight + 20,
            this.sheepWidth,
            this.sheepHeight,
        )
        ctx.restore();
    }

    getY(x, dots){
        for( let i = 1; i < dots.length; i++){
            if( x>= dots[i].x1 && x <= dots[i].x3) {
                if( x > dots[i].x3-3 && i+1 <dots.length){
                    return this.getY2(x+3,dots[i+1]) //끝부분 보정
                }
                return this.getY2(x,dots[i]);
            }
        }
        return {
            y: 0,
            rotation: 0
        };
    }

    getY2(x, dot){
        const total = 200;
        let pt = this.getPointOnQuad(dot.x1, dot.y1, dot.x2, dot.y2, dot.x3, dot.y3,1);
        let prevPt = pt;
        for(let i = 0; i < total; i++){
            
            const t = i/ total;
            pt = this.getPointOnQuad(dot.x1, dot.y1, dot.x2, dot.y2, dot.x3, dot.y3, t);
            
            if( x>=prevPt.x && x <= pt.x){
                return this.getPointWithRotation(pt, prevPt);
            }
            prevPt = pt;
        }
        return pt;
    }
    getQuadValue(p0,p1,p2,t){
        return (1-t) * (1-t) * p0 + 2 * (1-t) * t * p1 + t * t * p2;
    }
    getPointOnQuad(x1, y1, x2, y2, x3, y3, t){
        return {
            x: this.getQuadValue(x1, x2, x3, t),
            y: this. getQuadValue(y1, y2, y3, t),
        }
    }

    getPointWithRotation( pt, prevPt ){
        let dx = pt.x - prevPt.x;
        let dy = pt.y - prevPt.y;
        const rotation = -Math.atan2(dx, dy) + (90*Math.PI/ 180);
        return {
            x: pt.x,
            y: pt.y,
            rotation: rotation,
        };
    }
}