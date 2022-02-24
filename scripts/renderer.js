class Renderer {
    // canvas:              object ({id: __, width: __, height: __})
    // num_curve_sections:  int
    constructor(canvas, num_curve_sections, show_points_flag) {
        this.canvas = document.getElementById(canvas.id);
        this.canvas.width = canvas.width;
        this.canvas.height = canvas.height;
        this.ctx = this.canvas.getContext('2d');
        this.slide_idx = 0;
        this.num_curve_sections = num_curve_sections;
        this.show_points = show_points_flag;
    }

    // n:  int
    setNumCurveSections(n) {
        this.num_curve_sections = n;
        this.drawSlide(this.slide_idx);
    }

    // flag:  bool
    showPoints(flag)
    {
        this.show_points = flag;
        this.drawSlide(this.slide_idx);
    }
    
    // slide_idx:  int
    drawSlide(slide_idx) {
        this.slide_idx = slide_idx;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        switch (this.slide_idx) {
            case 0:
                this.drawSlide0(this.ctx);
                break;
            case 1:
                this.drawSlide1(this.ctx);
                break;
            case 2:
                this.drawSlide2(this.ctx);
                break;
            case 3:
                this.drawSlide3(this.ctx);
                break;
        }
    }

    // ctx:          canvas context
    drawSlide0(ctx)
    {
        this.drawRectangle({x:100, y:100}, {x:700, y:500}, [0, 0, 0, 255], ctx);
    }

    // ctx:          canvas context
    drawSlide1(ctx)
    {
        this.drawCircle({x:400, y:300}, 200, [0, 0, 0, 255], ctx);
    }

    // ctx:          canvas context
    drawSlide2(ctx)
    {
        this.drawBezierCurve({x:100, y:100}, {x:250, y:400}, {x:600, y:450}, {x:650, y:125}, [0, 0, 0, 255], ctx);
    }

    // ctx:          canvas context
    drawSlide3(ctx)
    {
        //draw C
        this.drawBezierCurve({x:250, y:250}, {x:100, y:300}, {x:100, y:400}, {x:250, y:450}, [0, 0, 0, 255], ctx);

        //draw h
        for (var y=250; y<450; y=y+10) {this.drawCircle({x:300, y:y}, 5, [0, 0, 0, 255], ctx);}
        
        for (var t=0; t<=1; t=t+0.09)
        {
            var x = Math.pow((1-t),3) * 300 + 3 * Math.pow((1-t),2) * t * 305 + 3 * (1-t) * Math.pow(t,2) * 375 + Math.pow(t,3) * 369;
            var y = Math.pow((1-t),3) * 300 + 3 * Math.pow((1-t),2) * t * 350 + 3 * (1-t) * Math.pow(t,2) * 375 + Math.pow(t,3) * 250;
            this.drawCircle({x:x, y:y}, 5, [0, 0, 0, 255], ctx);
        }
        // this.drawBezierCurve({x:300, y:300}, {x:305, y:350}, {x:375, y:375}, {x:375, y:250}, [0, 0, 0, 255], ctx);

        //draw e
        this.drawLine({x:420, y:300}, {x:475, y:300}, [0, 0, 0, 255], ctx);
        this.drawBezierCurve({x:475, y:250}, {x:365, y:265}, {x:455, y:400}, {x:475, y:300}, [0, 0, 0, 255], ctx);

        //draw n
        this.drawLine({x:525, y:250}, {x:525, y:325}, [0, 0, 0, 255], ctx);
        this.drawBezierCurve({x:525, y:300}, {x:530, y:350}, {x:600, y:375}, {x:600, y:250}, [0, 0, 0, 255], ctx);
    }

    // left_bottom:  object ({x: __, y: __})
    // right_top:    object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // ctx:          canvas context
    drawRectangle(left_bottom, right_top, color, ctx)
    {
        this.drawLine({x:left_bottom.x, y:left_bottom.y}, {x:left_bottom.x, y:right_top.y},   color, ctx);    //draw left
        this.drawLine({x:left_bottom.x, y:right_top.y},   {x:right_top.x,   y:right_top.y},   color, ctx);    //draw top
        this.drawLine({x:right_top.x,   y:left_bottom.y}, {x:right_top.x,   y:right_top.y},   color, ctx);    //draw right
        this.drawLine({x:left_bottom.x, y:left_bottom.y}, {x:right_top.x,   y:left_bottom.y}, color, ctx);    //draw bottom
    }

    // center:       object ({x: __, y: __})
    // radius:       int
    // color:        array of int [R, G, B, A]
    // ctx:          canvas context
    drawCircle(center, radius, color, ctx)
    {
        var degIncrement = 2*Math.PI/this.num_curve_sections;   //degree increment
        
        for (var i=0; i<this.num_curve_sections; i++)
        {
            //calculate coordinates of line section
            var x0 = center.x + radius * Math.cos(degIncrement * i);
            var y0 = center.y + radius * Math.sin(degIncrement * i);
            var x1 = center.x + radius * Math.cos(degIncrement * (i+1));
            var y1 = center.y + radius * Math.sin(degIncrement * (i+1));

            //draw line section
            this.drawLine({x:x0, y:y0}, {x:x1, y:y1}, color, ctx);
        }//loop and draw line sections
    }

    // pt0:          object ({x: __, y: __})
    // pt1:          object ({x: __, y: __})
    // pt2:          object ({x: __, y: __})
    // pt3:          object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // ctx:          canvas context
    drawBezierCurve(pt0, pt1, pt2, pt3, color, ctx)
    {
        //calculate t increment
        var tIncrement = 1/this.num_curve_sections; //t increment

        //calculate points and plot
        for (var i = 0; i<this.num_curve_sections; i++)
        {
            var t = i*tIncrement;         //current t value
            var tNext = (i+1)*tIncrement; //next t value

            //calculate coordinates of line section
            var x0 = Math.pow((1-t),3) * pt0.x + 3 * Math.pow((1-t),2) * t * pt1.x + 3 * (1-t) * Math.pow(t,2) * pt2.x + Math.pow(t,3) * pt3.x;
            var y0 = Math.pow((1-t),3) * pt0.y + 3 * Math.pow((1-t),2) * t * pt1.y + 3 * (1-t) * Math.pow(t,2) * pt2.y + Math.pow(t,3) * pt3.y;
            var x1 = Math.pow((1-tNext),3) * pt0.x + 3 * Math.pow((1-tNext),2) * tNext * pt1.x + 3 * (1-tNext) * Math.pow(tNext,2) * pt2.x + Math.pow(tNext,3) * pt3.x;
            var y1 = Math.pow((1-tNext),3) * pt0.y + 3 * Math.pow((1-tNext),2) * tNext * pt1.y + 3 * (1-tNext) * Math.pow(tNext,2) * pt2.y + Math.pow(tNext,3) * pt3.y;

            //draw line between
            this.drawLine({x:x0, y:y0}, {x:x1, y:y1}, color, ctx);
        }

        
        //draw control points and lines between control points
        if (this.show_points)
        {
            this.drawLine(pt0, pt1, [0, 0, 255, 255], ctx);
            this.drawLine(pt1, pt2, [0, 0, 255, 255], ctx);
            this.drawLine(pt2, pt3, [0, 0, 255, 255], ctx);

            this.drawPoint(pt0, [0, 0, 255, 255], ctx);
            this.drawPoint(pt1, [0, 0, 255, 255], ctx);
            this.drawPoint(pt2, [0, 0, 255, 255], ctx);
            this.drawPoint(pt3, [0, 0, 255, 255], ctx);
        }
    }

    //draw point method
    drawPoint(center, color, ctx)
    {
        var degIncrement = 2*Math.PI/32;   //degree increment
        var radius = 4;
        
        for (var i=0; i<32; i++)
        {
            //calculate coordinates of line section
            var x0 = center.x + radius * Math.cos(degIncrement * i);
            var y0 = center.y + radius * Math.sin(degIncrement * i);
            var x1 = center.x + radius * Math.cos(degIncrement * (i+1));
            var y1 = center.y + radius * Math.sin(degIncrement * (i+1));

            //draw line section
            ctx.strokeStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + (color[3]/255.0) + ')';
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.closePath();
            ctx.stroke();
        }//loop and draw line sections
    }

    // pt0:          object ({x: __, y: __})
    // pt1:          object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // ctx:          canvas context
    drawLine(pt0, pt1, color, ctx)
    {
        ctx.strokeStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + (color[3]/255.0) + ')';
        ctx.beginPath();
        ctx.moveTo(pt0.x, pt0.y);
        ctx.lineTo(pt1.x, pt1.y);
        ctx.closePath();
        ctx.stroke();

        //draw points
        if (this.show_points)
        {
            this.drawPoint({x: pt0.x, y:pt0.y}, [255, 0, 0, 255], ctx);
            this.drawPoint({x: pt1.x, y:pt1.y}, [255, 0, 0, 255], ctx);
        }
    }
};
