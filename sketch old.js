var shp;
var source;
var ltom; //temp

function setup() {
	createCanvas(1280,720);
	source = createVector(mouseX,mouseY);
	shp = new Shape(createVector(300,600), createVector(600,100), createVector(900,600));

}

function draw() {
	background(255);
	source.set(mouseX, mouseY);
	ends = [];
	
	fill(0,0,255);
	ellipse(source.x, source.y, 5);
	
	for (var i=0; i<50; i++){
		var targp = createVector(source.x+1280*cos(i*PI/25), source.y+1280*sin(i*PI/25));
		
		ltom = new Line(source, targp); //Line to Mouse
		
		
		if (shp.doesIntercept(ltom)){
			var p = shp.whereIntercept(ltom);
			fill(255,0,0)
			ellipse(p.x, p.y, 5);
			ends[ends.length]=p;
			
			targl = new Line(source, p);
			targl.render();
		}else{
			ends[ends.length]=targp;
			ltom.render();
		}
		
		
	}
	
	for(var i=0; i<ends.length-1; i++){
		fill(0,100,230);
		noStroke();
		triangle(source.x, source.y, ends[i].x, ends[i].y, ends[i+1].x, ends[i+1].y);
	}
	
	//Creating FINAL triangle
	fill(0,100,230);
	noStroke();
	triangle(source.x, source.y, ends[ends.length-1].x, ends[ends.length-1].y, ends[0].x, ends[0].y)
	
	shp.render();
}

function Shape(p1, p2, p3){
	this.p1 = p1;
	this.p2 = p2;
	this.p3 = p3;
	
	
	this.l1 = new Line(p1,p2);
	this.l2 = new Line(p2,p3);
	this.l3 = new Line(p3,p1);
	
	this.lines = [this.l1, this.l2, this.l3];
	
	this.doesIntercept = function(l){
		//If any of the lines are intercepted 
		for (var i=0; i<this.lines.length; i++){
			if(collideLineLine(l.p1.x,l.p1.y,l.p2.x,l.p2.y,this.lines[i].p1.x, this.lines[i].p1.y,this.lines[i].p2.x, this.lines[i].p2.y)) //If a line is found to intercept then return true
				return true;
		}
		return false; //At this point, if no value has been returned then there is no intersection
	}
	
	this.whereIntercept = function(l){
		var points = []; //Array to hold the points of intersection
		var mindist = 1280;
		var minpoint = ltom.p2;
		
		for (var i=0; i<this.lines.length; i++){
			if(collideLineLine(l.p1.x,l.p1.y,l.p2.x,l.p2.y,this.lines[i].p1.x, this.lines[i].p1.y,this.lines[i].p2.x, this.lines[i].p2.y)){ //If a line is found to intercept then return true
				var point = createVector(collideLineLine(l.p1.x,l.p1.y,l.p2.x,l.p2.y,this.lines[i].p1.x, this.lines[i].p1.y,this.lines[i].p2.x, this.lines[i].p2.y, true).x, collideLineLine(l.p1.x,l.p1.y,l.p2.x,l.p2.y,this.lines[i].p1.x, this.lines[i].p1.y,this.lines[i].p2.x, this.lines[i].p2.y,true).y)
				points[points.length] = point;
			}
		}
		
		for(var i=0; i<points.length; i++){
			//print(points[i].dist(source));
			if (points[i].dist(source)<mindist){
				//print(true);
				mindist = points[i].dist(source);
				minpoint = points[i];
			}
		}
		
		return minpoint;
	}
	
	this.render = function(){
		for (var i=0; i<this.lines.length; i++){
			this.lines[i].render();
		}		
	}
}

function Line(p1,p2){
	this.p1 = p1;
	this.p2 = p2;
	
	this.render = function(){
		drawLine(p1, p2);
	}
}


function drawLine(v, u){ //Draws line between two vector points
	fill(0);
	stroke(5);
	line(v.x, v.y, u.x, u.y);
}