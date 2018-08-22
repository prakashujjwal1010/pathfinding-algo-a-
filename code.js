//canvas
var canvas=document.getElementById('myCanvas');
var w=window.innerWidth;
var h=window.innerHeight;

canvas.width=w-100;
canvas.height=h-100;
var c=canvas.getContext('2d');


var cols=80;
var rows=80;
var wn=(w-100)/cols;
var hn=(h-100)/rows;
var grid=[];
//node constructor function
function Node(i,j){
    this.i=i;
    this.j=j;
    this.f=0;
    this.g=0;
    this.h=0;
    this.wall=false;
    this.parent=null;
    this.flag=false;
    this.neighbors=[];
    this.show=function(){
        c.strokeStyle="black";
        c.strokeRect(this.i*wn,this.j*hn,wn,hn);
    }
    this.color=function(co){
        c.fillStyle=co;
        c.fillRect(this.i*wn,this.j*hn,wn,hn);
    }
    this.wallGenerator=function(){
        if(Math.random()<0.2){
            this.walls=true;
        }
    }
}
//initializing 2d array with nodes
for(var i=0;i<rows;i++){
    grid[i]=[];
    for(var j=0;j<cols;j++){
        grid[i][j]=new Node(i,j);
        grid[i][j].wallGenerator();
    }
}
for(var i=0;i<rows;i++){
    for(var j=0;j<cols;j++){
        if(i>0){
            grid[i][j].neighbors.push(grid[i-1][j]);
        }
                if(j>0){
            grid[i][j].neighbors.push(grid[i][j-1]);
        }
                if(i<rows-1){
            grid[i][j].neighbors.push(grid[i+1][j]);
        }
                if(j<cols-1){
            grid[i][j].neighbors.push(grid[i][j+1]);
        }
    }
}



var start=grid[0][0];
var end=grid[rows-1][cols-1];
end.walls=false;
start.walls=false;

function heuristic(x,y){
    return (Math.abs(x.i*wn-y.i*wn)+Math.abs(x.j*wn-y.j*wn));
}

var openSet=[];
var closedSet=[];

openSet.push(start);
//a* algo starts
while(openSet.length>0){
    winner=0;
    for(var i=0;i<openSet.length;i++){
        if(openSet[i].f<openSet[winner].f){
            winner=i;
        }
    }
    var current=openSet[winner];
    current.flag=true;
    if(current==end){
        console.log("found");   
    }
    openSet.splice(winner,1);
    closedSet.push(current);
    //to color nodes
   
    
    for(var i=0;i<current.neighbors.length;i++){
        var neighbor=current.neighbors[i];
        if(!closedSet.includes(neighbor) && !neighbor.walls){
            
            //dist btw each node is taken as 1
            tempg=current.g+1;
            if(!openSet.includes(neighbor)){
                neighbor.g=tempg;
                openSet.push(neighbor);
            
            }
            else{
                if(tempg<neighbor.g){
                    neighbor.g=tempg;
                }
            }
            neighbor.parent=current;
            neighbor.h=heuristic(neighbor,end);
            neighbor.f=neighbor.g+neighbor.h;
            
            
        }
                
    }
}


for(var i=0;i<rows;i++){
    for(var j=0;j<cols;j++){
        grid[i][j].show();
        if(grid[i][j].walls){
            grid[i][j].color("black");
        }
       
    }
}
end.color("yellow");
 var next=end.parent;
//for animation
function animate(){
    requestAnimationFrame(animate);
    if(next!=null){
        next.color("blue");
    }
    next=next.parent;  
}
start.color("red");
animate();
