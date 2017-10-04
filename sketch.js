var shps = [];
var source;
var ltom; //temp

function setup() {
	createCanvas(1280,720);
	source = createVector(mouseX,mouseY);
	shps[0] = new ShapeR(createVector(0,0), 1280, 720);
	
	//For random shapes which MAY intersect
	/*
	for (var i=1; i<5; i+=2){
		shps[i] = new ShapeT(createVector(random(0,1280),random(0,720)), random(0,300));
		shps[i+1] = new ShapeR(createVector(random(0,1280),random(0,720)), 200, 200);
	}
	*/
	
	//Pre-defined shapes
	shps[1] = new ShapeT(createVector(300,300), 150);
	shps[2] = new ShapeR(createVector(700, 300), 100);
	shps[3] = new ShapeT(createVector(1000, 500), 50);
	shsp[4] = new ShapeR(createVector(900, 450), 70, 70);
}

function draw() {
	background(0);
	//Light source is the mouse position
	source.set(mouseX, mouseY);
	ends = [];
	
	fill(0,0,255);
	ellipse(source.x, source.y, 5);
	
	for (var i=0; i<shps.length; i++){ //For each shape
		for (var j=0; j<shps[i].verts.length; j++){ //For each vertex
			xdiff=shps[i].verts[j].x-source.x;
			ydiff=shps[i].verts[j].y-source.y;
			
			vertangle = atan2(xdiff, -ydiff)-PI/2;
			
			targp=[];
			targp[0] = createVector(source.x+1500*cos(vertangle), source.y+1500*sin(vertangle)); //Main vertex target
			targp[1] = createVector(source.x+1500*cos(vertangle+PI/5000), source.y+1500*sin(vertangle+PI/5000)); //Slightly offset targets
			targp[2] = createVector(source.x+1500*cos(vertangle-PI/5000), source.y+1500*sin(vertangle-PI/5000));
			
			for (var k=0; k<3; k++){ //We have three lines
				ltom = new Line(source, targp[k]); //Line to selected vertex
				mindist = 1500; //Setting the minimum distance
				minpoint = ltom.p2;
				
				for(var l=0; l<shps.length; l++){ //Which must be check to intercept with each respective shape
					if (shps[l].doesIntercept(ltom)){
						var p = shps[l].whereIntercept(ltom);
						if (source.dist(p)<mindist){ //If this intersection is BEFORE the one we currently have then we are only interested in this one
							mindist = source.dist(p);
							minpoint = p;
						}
					}
				}
				
				
				ends[ends.length]=minpoint; //Only the minimum length intersection is noted
			}
		}
		shps[i].render();
	}
	
	//Sort end points by angle they sweep from source
	//Then, when creating our polygon, the vertices will be ordered correctly
	ends.sort(function(a, b) {
		return atan2(source.x-a.x,a.y-source.y) - atan2(source.x-b.x,b.y-source.y);
	});
	
	
	beginShape();
	for(var i=0; i<ends.length; i++){
		vertex(ends[i].x, ends[i].y);
	}
	fill(255);
	endShape(CLOSE);
}

function ShapeT(pos, size){ //pos, size (length of each line)
	
	this.pos = pos;
	
	this.p1 = this.pos;
	this.p2 = createVector(this.pos.x+size/2, this.pos.y-size*cos(PI/4));
	this.p3 = createVector(this.pos.x+size, this.pos.y);
	
	
	this.l1 = new Line(this.p1,this.p2);
	this.l2 = new Line(this.p2,this.p3);
	this.l3 = new Line(this.p3,this.p1);
	
	this.lines = [this.l1, this.l2, this.l3];
	this.verts = [this.p1, this.p2, this.p3];
	
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
		var mindist = 1500;
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

function ShapeR(pos, width, height){ 
	
	this.pos = pos;
	
	this.p1 = this.pos;
	print(this.p1);
	this.p2 = createVector(this.pos.x+width, this.pos.y);
	print(this.p2);
	this.p3 = createVector(this.pos.x+width, this.pos.y+height);
	print(this.p3);
	this.p4 = createVector(this.pos.x, this.pos.y+height);
	print(this.p4);
	
	this.l1 = new Line(this.p1,this.p2);
	this.l2 = new Line(this.p2,this.p3);
	this.l3 = new Line(this.p3,this.p4);
	this.l4 = new Line(this.p4,this.p1);
	
	this.lines = [this.l1, this.l2, this.l3, this.l4];
	this.verts = [this.p1, this.p2, this.p3, this.p4];
	
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
		var mindist = 1500;
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
	stroke(255);
	line(v.x, v.y, u.x, u.y);
}
