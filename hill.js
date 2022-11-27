export class Hill {
    constructor( color, speed, total) {
        this.color = color;
        this.speed = speed;
        this.total = total;
    }

    resize(stageWidth, stageHeight){
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;

        this.points = [];
        this.gap = Math.ceil(this.stageWidth / (this.total-2));

        for ( let i = 0 ; i < this.total; i++ ){
            this.points[i] = {
                x: i* this.gap,
                y: this.getY()
            };
        }
    }

    draw(ctx){
        ctx.fillStyle = this.color;
        ctx.beginPath();
        
        let cur = this.points[0];
        let prev = cur;

        let dots= [];
        //옆으로 이동
        if( cur.x > -this.gap){
            this.points.unshift({
                x: -(this.gap * 2),
                y: this.getY(),
            });
        }

        ctx.moveTo(cur.x, cur.y);
        
        let prevCx = cur.x;
        let prevCy = cur.y;

        
        let csx=[]; //확인용
        for(let i = 0 ; i < this.points.length; i++){
            cur = this.points[i];
            cur.x += this.speed;
            if (cur.x > this.stageWidth + this.gap*2){
                this.points.splice(-1); //화면 넘어가면 삭제
            }
            const cx = (prev.x + cur.x) / 2;
            const cy = (prev.y + cur.y) / 2;
            csx.push({x: cx, y: cy});//확인용
            ctx.quadraticCurveTo(prev.x, prev.y, cx, cy);

            dots.push({
                x1: prevCx,
                y1: prevCy,
                x2: prev.x,
                y2: prev.y,
                x3: cx,
                y3: cy,
            });

            prev = cur;
            prevCx = cx;
            prevCy = cy;

            

        }

        ctx.lineTo(prev.x, prev.y);
        ctx.lineTo(this.stageWidth, this.stageHeight );
        ctx.lineTo(this.points[0].x, this.stageHeight);
        //색칠 범위 지정
        ctx.fill();
        
        ctx.closePath();//확인용
        for(let i = 0; i < csx.length; i++){
            ctx.beginPath();
            ctx.fillStyle = '#ffffff';
            ctx.arc(csx[i].x, csx[i].y, 10, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
        }

        return dots;
    }

    getY() {
        const min = this.stageHeight / 8 ; 
        const max = this.stageHeight - min*1.5;
        return min + Math.random() * max;
    }
}