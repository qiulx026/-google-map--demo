function point(x,y){
	this.x=x;
	this.y=y;
}

/*function drawLine(a,b){
	var svgContainer = d3.select("body").select("svg");
	var line = svgContainer.append("line")
							  .attr("x1", a.x)
							  .attr("y1", a.y)
							  .attr("x2", b.x)
							  .attr("y2", b.y)
							  .attr("stroke-width", 1)
							  .attr("stroke", "green");
}*/
function drawLine(a,b){
	var c=document.getElementById("worldMap");
	var ctx=c.getContext("2d");
	ctx.beginPath();
	ctx.strokeStyle="#29A329";
	ctx.moveTo(a.x,a.y);
	ctx.lineTo(b.x,b.y);
	ctx.stroke();
}
var s_height=4000
	s_width=4000;
	width = 2;
function lonTrans(lon){
	return (lon-minlon)*s_height/(maxlon-minlon); 
}

function latTrans(lat){
	return (lat-minlat)*s_width/(maxlat-minlat);
}

var maxlon=118.40
	minlon=118.20 
	maxlat=34.40
	minlat=34.20;


function crossMul(o,a,b){
	var x1=a.x-o.x
		y1=a.y-o.y
		x2=b.x-o.x
		y2=b.y-o.y;
	return x1*y2-x2*y1;
}


function clockwise(o,a,x,y){
	if(a.x >= o.x){ 
		if( a.y >= o.y){
			var b=new point(a.x+x, a.y-y);
			return b;
		}
		else{
			var b=new point(a.x-x, a.y-y);
			return b;
		}
	}
	else{
		if(a.y >= o.y){
			var b=new point(a.x+x, a.y+y);
			return b;
		}
		else{
			var b=new point(a.x-x, a.y+y); 
			return b;
		}
	}
}

function anticlockwise(o,a,x,y){
	if(a.x >= o.x){ 
		if( a.y >= o.y){
			var b=new point(a.x-x, a.y+y);
			return b;
		}
		else{
			var b=new point(a.x+x, a.y+y);
			return b;
		}
	}
	else{
		if(a.y >= o.y){
			var b=new point(a.x-x, a.y-y);
			return b;
		}
		else{
			var b=new point(a.x+x, a.y-y); 
			return b;
		}
	}
}

function drawIntersection_1(data){
	var o=new point(lonTrans(data.lon),latTrans(data.lat));
	var a=new point((lonTrans(data.partner[0])+lonTrans(data.lon))/2,(latTrans(data.partner[1])+latTrans(data.lat))/2);
	var l_ao=Math.sqrt((a.x-o.x)*(a.x-o.x)+(a.y-o.y)*(a.y-o.y))
		x_ao=width*Math.abs(a.y-o.y)/l_ao
		y_ao=width*Math.abs(a.x-o.x)/l_ao;
	
	drawLine(clockwise(o,a,x_ao,y_ao),anticlockwise(a,o,x_ao,y_ao));
	drawLine(anticlockwise(o,a,x_ao,y_ao),clockwise(a,o,x_ao,y_ao));
	
	
}

function drawIntersection_2(data){
	var o=new point(lonTrans(data.lon),latTrans(data.lat));
	var a=new point((lonTrans(data.partner[0])+lonTrans(data.lon))/2,(latTrans(data.partner[1])+latTrans(data.lat))/2);
	var b=new point((lonTrans(data.partner[2])+lonTrans(data.lon))/2,(latTrans(data.partner[3])+latTrans(data.lat))/2);

	result=mysort(o,[a,b]);
	a=result[0];
	b=result[1];
	
	var l_ao=Math.sqrt((a.x-o.x)*(a.x-o.x)+(a.y-o.y)*(a.y-o.y))
		x_ao=width*Math.abs(a.y-o.y)/l_ao
		y_ao=width*Math.abs(a.x-o.x)/l_ao;
		
	var l_bo=Math.sqrt((b.x-o.x)*(b.x-o.x)+(b.y-o.y)*(b.y-o.y))
		x_bo=width*Math.abs(b.y-o.y)/l_bo
		y_bo=width*Math.abs(b.x-o.x)/l_bo;
		
	var ao_x=(a.x-o.x)/l_ao;
		ao_y=(a.y-o.y)/l_ao;
		bo_x=(b.x-o.x)/l_bo;
		bo_y=(b.y-o.y)/l_bo;	
	
	var aob_x=ao_x+bo_x
		aob_y=ao_y+bo_y
		l_aob=Math.sqrt(aob_x*aob_x+aob_y*aob_y);
	aob_x=width*aob_x/l_aob;
	aob_y=width*aob_y/l_aob;
	
	
	var intersection_1=new point(o.x+aob_x,o.y+aob_y);
		intersection_2=new point(o.x-aob_x,o.y-aob_y);
	
	if(crossMul(o,a,b) > 0 ){		
		drawLine(anticlockwise(o,a,x_ao,y_ao),intersection_1);
		drawLine(clockwise(o,b,x_bo,y_bo),intersection_1);
		drawLine(clockwise(o,a,x_ao,y_ao),intersection_2);
		drawLine(anticlockwise(o,b,x_bo,y_bo),intersection_2);
	}
	else if(crossMul(o,a,b) < 0){
		drawLine(clockwise(o,a,x_ao,y_ao),intersection_1);
		drawLine(anticlockwise(o,b,x_bo,y_bo),intersection_1);
		drawLine(anticlockwise(o,a,x_ao,y_ao),intersection_2);
		drawLine(clockwise(o,b,x_bo,y_bo),intersection_2);		
	}
	else{
		if((ao_x==bo_x)&&(ao_y==bo_y)){
			drawLine(clockwise(o,a,x_ao,y_ao),anticlockwise(a,o,x_ao,y_ao));
			drawLine(anticlockwise(o,a,x_ao,y_ao),clockwise(a,o,x_ao,y_ao));	
			drawLine(clockwise(o,b,x_bo,y_bo),anticlockwise(b,o,x_bo,y_bo));
			drawLine(anticlockwise(o,b,x_bo,y_bo),clockwise(b,o,x_bo,y_bo));
		}
		else{
			drawLine(clockwise(o,a,x_ao,y_ao),anticlockwise(o,b,x_bo,y_bo));
			drawLine(anticlockwise(o,a,x_ao,y_ao),clockwise(o,b,x_bo,y_bo));
		}
	}
}


function drawIntersection_3(data){
	var o=new point(lonTrans(data.lon),latTrans(data.lat));
	var a=new point((lonTrans(data.partner[0])+lonTrans(data.lon))/2,(latTrans(data.partner[1])+latTrans(data.lat))/2);
	var b=new point((lonTrans(data.partner[2])+lonTrans(data.lon))/2,(latTrans(data.partner[3])+latTrans(data.lat))/2);
	var c=new point((lonTrans(data.partner[4])+lonTrans(data.lon))/2,(latTrans(data.partner[5])+latTrans(data.lat))/2);
	

	result=mysort(o,[a,b,c]);

	a=result[2];
	b=result[1];
	c=result[0];
	
	var l_ao=Math.sqrt((a.x-o.x)*(a.x-o.x)+(a.y-o.y)*(a.y-o.y))
		x_ao=width*Math.abs(a.y-o.y)/l_ao
		y_ao=width*Math.abs(a.x-o.x)/l_ao;
		
	var l_bo=Math.sqrt((b.x-o.x)*(b.x-o.x)+(b.y-o.y)*(b.y-o.y))
		x_bo=width*Math.abs(b.y-o.y)/l_bo
		y_bo=width*Math.abs(b.x-o.x)/l_bo;
	
	var l_co=Math.sqrt((c.x-o.x)*(c.x-o.x)+(c.y-o.y)*(c.y-o.y))
		x_co=width*Math.abs(c.y-o.y)/l_co
		y_co=width*Math.abs(c.x-o.x)/l_co;
		
	var ao_x=(a.x-o.x)/l_ao;
		ao_y=(a.y-o.y)/l_ao;
		bo_x=(b.x-o.x)/l_bo;
		bo_y=(b.y-o.y)/l_bo;	
		co_x=(c.x-o.x)/l_co;
		co_y=(c.y-o.y)/l_co;
	
	var aob_x=ao_x+bo_x
		aob_y=ao_y+bo_y
		l_aob=Math.sqrt(aob_x*aob_x+aob_y*aob_y);
		aob_x=width*aob_x/l_aob;
		aob_y=width*aob_y/l_aob;
		
	var aoc_x=ao_x+co_x
		aoc_y=ao_y+co_y
		l_aoc=Math.sqrt(aoc_x*aoc_x+aoc_y*aoc_y);
		aoc_x=width*aoc_x/l_aoc;
		aoc_y=width*aoc_y/l_aoc;
		
	var boc_x=co_x+bo_x
		boc_y=co_y+bo_y
		l_boc=Math.sqrt(boc_x*boc_x+boc_y*boc_y);
		boc_x=width*boc_x/l_boc;
		boc_y=width*boc_y/l_boc;
		
	// draw aob
	if(crossMul(o,a,b) > 0 ){				
		var intersection_1=new point(o.x-aob_x,o.y-aob_y);	
		drawLine(clockwise(o,a,x_ao,y_ao),intersection_1);
		drawLine(anticlockwise(o,b,x_bo,y_bo),intersection_1);
	}
	else if(crossMul(o,a,b) < 0){
		var intersection_1=new point(o.x+aob_x,o.y+aob_y);		
		drawLine(clockwise(o,a,x_ao,y_ao),intersection_1);
		drawLine(anticlockwise(o,b,x_bo,y_bo),intersection_1);		
	}
	else{
		if((ao_x==bo_x)&&(ao_y==bo_y)){
			drawLine(clockwise(o,a,x_ao,y_ao),clockwise(o,b,x_bo,y_bo));
			drawLine(anticlockwise(o,a,x_ao,y_ao),anticlockwise(o,b,x_bo,y_bo));
		}
		else{
			drawLine(clockwise(o,a,x_ao,y_ao),anticlockwise(o,b,x_bo,y_bo));
		}
	}
	
	//draw aoc
	if(crossMul(o,a,c) > 0 ){				
		var intersection_2=new point(o.x+aoc_x,o.y+aoc_y);	
		drawLine(anticlockwise(o,a,x_ao,y_ao),intersection_2);
		drawLine(clockwise(o,c,x_co,y_co),intersection_2);
	}
	else if(crossMul(o,a,c) < 0){
		var intersection_2=new point(o.x-aoc_x,o.y-aoc_y);		
		drawLine(anticlockwise(o,a,x_ao,y_ao),intersection_2);
		drawLine(clockwise(o,c,x_co,y_co),intersection_2);		
	}
	else{
		if((ao_x==co_x)&&(ao_y==co_y)){
			drawLine(clockwise(o,a,x_ao,y_ao),clockwise(o,c,x_co,y_co));
			drawLine(anticlockwise(o,a,x_ao,y_ao),anticlockwise(o,c,x_co,y_co));
		}
		else{
			drawLine(anticlockwise(o,a,x_ao,y_ao),clockwise(o,c,x_co,y_co));
		}
	}
		
	//draw boc
	if(crossMul(o,b,c) > 0 ){				
		var intersection_3=new point(o.x-boc_x,o.y-boc_y);	
		drawLine(clockwise(o,b,x_bo,y_bo),intersection_3);
		drawLine(anticlockwise(o,c,x_co,y_co),intersection_3);
	}
	else if(crossMul(o,b,c) < 0){
		var intersection_3=new point(o.x+boc_x,o.y+boc_y);		
		drawLine(clockwise(o,b,x_bo,y_bo),intersection_3);
		drawLine(anticlockwise(o,c,x_co,y_co),intersection_3);		
	}
	else{
		if((co_x==bo_x)&&(co_y==bo_y)){
			drawLine(clockwise(o,c,x_co,y_co),clockwise(o,b,x_bo,y_bo));
			drawLine(anticlockwise(o,c,x_co,y_co),anticlockwise(o,b,x_bo,y_bo));
		}
		else{
			drawLine(clockwise(o,b,x_bo,y_bo),anticlockwise(o,c,x_co,y_co));
		}
	}
}

function drawIntersection_4(data){
	var o=new point(lonTrans(data.lon),latTrans(data.lat));
	var a=new point((lonTrans(data.partner[0])+lonTrans(data.lon))/2,(latTrans(data.partner[1])+latTrans(data.lat))/2);
	var b=new point((lonTrans(data.partner[2])+lonTrans(data.lon))/2,(latTrans(data.partner[3])+latTrans(data.lat))/2);
	var c=new point((lonTrans(data.partner[4])+lonTrans(data.lon))/2,(latTrans(data.partner[5])+latTrans(data.lat))/2);
	var d=new point((lonTrans(data.partner[6])+lonTrans(data.lon))/2,(latTrans(data.partner[7])+latTrans(data.lat))/2);
	

	result=mysort(o,[a,b,c,d]);

	a=result[3];
	b=result[2];
	c=result[1];
	d=result[0];
	
	var l_ao=Math.sqrt((a.x-o.x)*(a.x-o.x)+(a.y-o.y)*(a.y-o.y))
		x_ao=width*Math.abs(a.y-o.y)/l_ao
		y_ao=width*Math.abs(a.x-o.x)/l_ao;
		
	var l_bo=Math.sqrt((b.x-o.x)*(b.x-o.x)+(b.y-o.y)*(b.y-o.y))
		x_bo=width*Math.abs(b.y-o.y)/l_bo
		y_bo=width*Math.abs(b.x-o.x)/l_bo;
	
	var l_co=Math.sqrt((c.x-o.x)*(c.x-o.x)+(c.y-o.y)*(c.y-o.y))
		x_co=width*Math.abs(c.y-o.y)/l_co
		y_co=width*Math.abs(c.x-o.x)/l_co;
	
	var l_do=Math.sqrt((d.x-o.x)*(d.x-o.x)+(d.y-o.y)*(d.y-o.y))
		x_do=width*Math.abs(d.y-o.y)/l_do
		y_do=width*Math.abs(d.x-o.x)/l_do;
		
	var ao_x=(a.x-o.x)/l_ao;
		ao_y=(a.y-o.y)/l_ao;
		bo_x=(b.x-o.x)/l_bo;
		bo_y=(b.y-o.y)/l_bo;	
		co_x=(c.x-o.x)/l_co;
		co_y=(c.y-o.y)/l_co;
		do_x=(d.x-o.x)/l_do;
		do_y=(d.y-o.y)/l_do;
		
	
	var aob_x=ao_x+bo_x
		aob_y=ao_y+bo_y
		l_aob=Math.sqrt(aob_x*aob_x+aob_y*aob_y);
		aob_x=width*aob_x/l_aob;
		aob_y=width*aob_y/l_aob;
		
	var boc_x=co_x+bo_x
		boc_y=co_y+bo_y
		l_boc=Math.sqrt(boc_x*boc_x+boc_y*boc_y);
		boc_x=width*boc_x/l_boc;
		boc_y=width*boc_y/l_boc;
		
	var cod_x=co_x+do_x
		cod_y=co_y+do_y
		l_cod=Math.sqrt(cod_x*cod_x+cod_y*cod_y);
		cod_x=width*cod_x/l_cod;
		cod_y=width*cod_y/l_cod;
		
	var doa_x=do_x+ao_x
		doa_y=do_y+ao_y
		l_doa=Math.sqrt(doa_x*doa_x+doa_y*doa_y);
		doa_x=width*doa_x/l_doa;
		doa_y=width*doa_y/l_doa;
		
	// draw aob
	if(crossMul(o,a,b) > 0 ){				
		var intersection_1=new point(o.x-aob_x,o.y-aob_y);	
		drawLine(clockwise(o,a,x_ao,y_ao),intersection_1);
		drawLine(anticlockwise(o,b,x_bo,y_bo),intersection_1);
	}
	else if(crossMul(o,a,b) < 0){
		var intersection_1=new point(o.x+aob_x,o.y+aob_y);		
		drawLine(clockwise(o,a,x_ao,y_ao),intersection_1);
		drawLine(anticlockwise(o,b,x_bo,y_bo),intersection_1);		
	}
	else{
		if((ao_x==bo_x)&&(ao_y==bo_y)){
			drawLine(clockwise(o,a,x_ao,y_ao),clockwise(o,b,x_bo,y_bo));
			drawLine(anticlockwise(o,a,x_ao,y_ao),anticlockwise(o,b,x_bo,y_bo));
		}
		else{
			drawLine(clockwise(o,a,x_ao,y_ao),anticlockwise(o,b,x_bo,y_bo));
		}
	}
	
	//draw boc
	if(crossMul(o,b,c) > 0 ){				
		var intersection_2=new point(o.x-boc_x,o.y-boc_y);	
		drawLine(clockwise(o,b,x_bo,y_bo),intersection_2);
		drawLine(anticlockwise(o,c,x_co,y_co),intersection_2);
	}
	else if(crossMul(o,b,c) < 0){
		var intersection_2=new point(o.x+boc_x,o.y+boc_y);		
		drawLine(clockwise(o,b,x_bo,y_bo),intersection_2);
		drawLine(anticlockwise(o,c,x_co,y_co),intersection_2);		
	}
	else{
		if((co_x==bo_x)&&(co_y==bo_y)){
			drawLine(clockwise(o,c,x_co,y_co),clockwise(o,b,x_bo,y_bo));
			drawLine(anticlockwise(o,c,x_co,y_co),anticlockwise(o,b,x_bo,y_bo));
		}
		else{
			drawLine(clockwise(o,b,x_bo,y_bo),anticlockwise(o,c,x_co,y_co));
		}
	}

	//draw cod
	if(crossMul(o,c,d) > 0 ){				
		var intersection_3=new point(o.x-cod_x,o.y-cod_y);	
		drawLine(clockwise(o,c,x_co,y_co),intersection_3);
		drawLine(anticlockwise(o,d,x_do,y_do),intersection_3);
	}
	else if(crossMul(o,c,d) < 0){
		var intersection_3=new point(o.x+cod_x,o.y+cod_y);		
		drawLine(clockwise(o,c,x_co,y_co),intersection_3);
		drawLine(anticlockwise(o,d,x_do,y_do),intersection_3);		
	}
	else{
		if((co_x==do_x)&&(co_y==do_y)){
			drawLine(clockwise(o,c,x_co,y_co),clockwise(o,d,x_do,y_do));
			drawLine(anticlockwise(o,c,x_co,y_co),anticlockwise(o,d,x_do,y_do));
		}
		else{
			drawLine(anticlockwise(o,c,x_co,y_co),clockwise(o,d,x_do,y_do));
		}
	}
		
	//draw doa
	if(crossMul(o,d,a) > 0 ){				
		var intersection_4=new point(o.x-doa_x,o.y-doa_y);	
		drawLine(clockwise(o,d,x_do,y_do),intersection_4);
		drawLine(anticlockwise(o,a,x_ao,y_ao),intersection_4);
	}
	else if(crossMul(o,d,a) < 0){
		var intersection_4=new point(o.x+doa_x,o.y+doa_y);		
		drawLine(clockwise(o,d,x_do,y_do),intersection_4);
		drawLine(anticlockwise(o,a,x_ao,y_ao),intersection_4);		
	}
	else{
		if((do_x==ao_x)&&(do_y==ao_y)){
			drawLine(clockwise(o,a,x_ao,y_ao),clockwise(o,d,x_do,y_do));
			drawLine(anticlockwise(o,a,x_ao,y_ao),anticlockwise(o,d,x_do,y_do));
		}
		else{
			drawLine(anticlockwise(o,a,x_ao,y_ao),clockwise(o,d,x_do,y_do));
		}
	}
		
}
function drawIntersection_5(data){
	var o=new point(lonTrans(data.lon),latTrans(data.lat));
	var a=new point((lonTrans(data.partner[0])+lonTrans(data.lon))/2,(latTrans(data.partner[1])+latTrans(data.lat))/2);
	var b=new point((lonTrans(data.partner[2])+lonTrans(data.lon))/2,(latTrans(data.partner[3])+latTrans(data.lat))/2);
	var c=new point((lonTrans(data.partner[4])+lonTrans(data.lon))/2,(latTrans(data.partner[5])+latTrans(data.lat))/2);
	var d=new point((lonTrans(data.partner[6])+lonTrans(data.lon))/2,(latTrans(data.partner[7])+latTrans(data.lat))/2);
	var e=new point((lonTrans(data.partner[8])+lonTrans(data.lon))/2,(latTrans(data.partner[9])+latTrans(data.lat))/2);
	

	result=mysort(o,[a,b,c,d,e]);

	a=result[4];
	b=result[3];
	c=result[2];
	d=result[1];
	e=result[0];
	
	var l_ao=Math.sqrt((a.x-o.x)*(a.x-o.x)+(a.y-o.y)*(a.y-o.y))
		x_ao=width*Math.abs(a.y-o.y)/l_ao
		y_ao=width*Math.abs(a.x-o.x)/l_ao;
		
	var l_bo=Math.sqrt((b.x-o.x)*(b.x-o.x)+(b.y-o.y)*(b.y-o.y))
		x_bo=width*Math.abs(b.y-o.y)/l_bo
		y_bo=width*Math.abs(b.x-o.x)/l_bo;
	
	var l_co=Math.sqrt((c.x-o.x)*(c.x-o.x)+(c.y-o.y)*(c.y-o.y))
		x_co=width*Math.abs(c.y-o.y)/l_co
		y_co=width*Math.abs(c.x-o.x)/l_co;
	
	var l_do=Math.sqrt((d.x-o.x)*(d.x-o.x)+(d.y-o.y)*(d.y-o.y))
		x_do=width*Math.abs(d.y-o.y)/l_do
		y_do=width*Math.abs(d.x-o.x)/l_do;
		
	var l_eo=Math.sqrt((e.x-o.x)*(e.x-o.x)+(e.y-o.y)*(e.y-o.y))
		x_eo=width*Math.abs(e.y-o.y)/l_eo
		y_eo=width*Math.abs(e.x-o.x)/l_eo;
		
	var ao_x=(a.x-o.x)/l_ao;
		ao_y=(a.y-o.y)/l_ao;
		bo_x=(b.x-o.x)/l_bo;
		bo_y=(b.y-o.y)/l_bo;	
		co_x=(c.x-o.x)/l_co;
		co_y=(c.y-o.y)/l_co;
		do_x=(d.x-o.x)/l_do;
		do_y=(d.y-o.y)/l_do;
		eo_x=(e.x-o.x)/l_eo;
		eo_y=(e.y-o.y)/l_eo;
	
	var aob_x=ao_x+bo_x
		aob_y=ao_y+bo_y
		l_aob=Math.sqrt(aob_x*aob_x+aob_y*aob_y);
		aob_x=width*aob_x/l_aob;
		aob_y=width*aob_y/l_aob;
		
	var boc_x=co_x+bo_x
		boc_y=co_y+bo_y
		l_boc=Math.sqrt(boc_x*boc_x+boc_y*boc_y);
		boc_x=width*boc_x/l_boc;
		boc_y=width*boc_y/l_boc;
		
	var cod_x=co_x+do_x
		cod_y=co_y+do_y
		l_cod=Math.sqrt(cod_x*cod_x+cod_y*cod_y);
		cod_x=width*cod_x/l_cod;
		cod_y=width*cod_y/l_cod;
		
	var doe_x=do_x+eo_x
		doe_y=do_y+eo_y
		l_doe=Math.sqrt(doe_x*doe_x+doe_y*doe_y);
		doe_x=width*doe_x/l_doe;
		doe_y=width*doe_y/l_doe;
		
	var eoa_x=eo_x+ao_x
		eoa_y=eo_y+ao_y
		l_eoa=Math.sqrt(eoa_x*eoa_x+eoa_y*eoa_y);
		eoa_x=width*eoa_x/l_eoa;
		eoa_y=width*eoa_y/l_eoa;
		
	// draw aob
	if(crossMul(o,a,b) > 0 ){				
		var intersection_1=new point(o.x-aob_x,o.y-aob_y);	
		drawLine(clockwise(o,a,x_ao,y_ao),intersection_1);
		drawLine(anticlockwise(o,b,x_bo,y_bo),intersection_1);
	}
	else if(crossMul(o,a,b) < 0){
		var intersection_1=new point(o.x+aob_x,o.y+aob_y);		
		drawLine(clockwise(o,a,x_ao,y_ao),intersection_1);
		drawLine(anticlockwise(o,b,x_bo,y_bo),intersection_1);		
	}
	else{
		if((ao_x==bo_x)&&(ao_y==bo_y)){
			drawLine(clockwise(o,a,x_ao,y_ao),clockwise(o,b,x_bo,y_bo));
			drawLine(anticlockwise(o,a,x_ao,y_ao),anticlockwise(o,b,x_bo,y_bo));
		}
		else{
			drawLine(clockwise(o,a,x_ao,y_ao),anticlockwise(o,b,x_bo,y_bo));
		}
	}
	
	//draw boc
	if(crossMul(o,b,c) > 0 ){				
		var intersection_2=new point(o.x-boc_x,o.y-boc_y);	
		drawLine(clockwise(o,b,x_bo,y_bo),intersection_2);
		drawLine(anticlockwise(o,c,x_co,y_co),intersection_2);
	}
	else if(crossMul(o,b,c) < 0){
		var intersection_2=new point(o.x+boc_x,o.y+boc_y);		
		drawLine(clockwise(o,b,x_bo,y_bo),intersection_2);
		drawLine(anticlockwise(o,c,x_co,y_co),intersection_2);		
	}
	else{
		if((co_x==bo_x)&&(co_y==bo_y)){
			drawLine(clockwise(o,c,x_co,y_co),clockwise(o,b,x_bo,y_bo));
			drawLine(anticlockwise(o,c,x_co,y_co),anticlockwise(o,b,x_bo,y_bo));
		}
		else{
			drawLine(clockwise(o,b,x_bo,y_bo),anticlockwise(o,c,x_co,y_co));
		}
	}

	//draw cod
	if(crossMul(o,c,d) > 0 ){				
		var intersection_3=new point(o.x-cod_x,o.y-cod_y);	
		drawLine(clockwise(o,c,x_co,y_co),intersection_3);
		drawLine(anticlockwise(o,d,x_do,y_do),intersection_3);
	}
	else if(crossMul(o,c,d) < 0){
		var intersection_3=new point(o.x+cod_x,o.y+cod_y);		
		drawLine(clockwise(o,c,x_co,y_co),intersection_3);
		drawLine(anticlockwise(o,d,x_do,y_do),intersection_3);		
	}
	else{
		if((co_x==do_x)&&(co_y==do_y)){
			drawLine(clockwise(o,c,x_co,y_co),clockwise(o,d,x_do,y_do));
			drawLine(anticlockwise(o,c,x_co,y_co),anticlockwise(o,d,x_do,y_do));
		}
		else{
			drawLine(anticlockwise(o,c,x_co,y_co),clockwise(o,d,x_do,y_do));
		}
	}
		
	//draw doe
	if(crossMul(o,d,e) > 0 ){				
		var intersection_4=new point(o.x-doe_x,o.y-doe_y);	
		drawLine(clockwise(o,d,x_do,y_do),intersection_4);
		drawLine(anticlockwise(o,e,x_eo,y_eo),intersection_4);
	}
	else if(crossMul(o,d,e) < 0){
		var intersection_4=new point(o.x+doe_x,o.y+doe_y);		
		drawLine(clockwise(o,d,x_do,y_do),intersection_4);
		drawLine(anticlockwise(o,e,x_eo,y_eo),intersection_4);		
	}
	else{
		if((do_x==eo_x)&&(do_y==eo_y)){
			drawLine(clockwise(o,e,x_eo,y_eo),clockwise(o,d,x_do,y_do));
			drawLine(anticlockwise(o,e,x_eo,y_eo),anticlockwise(o,d,x_do,y_do));
		}
		else{
			drawLine(anticlockwise(o,e,x_eo,y_eo),clockwise(o,d,x_do,y_do));
		}
	}	

	//draw eoa
	if(crossMul(o,e,a) > 0 ){				
		var intersection_5=new point(o.x-eoa_x,o.y-eoa_y);	
		drawLine(clockwise(o,e,x_eo,y_eo),intersection_5);
		drawLine(anticlockwise(o,a,x_ao,y_ao),intersection_5);
	}
	else if(crossMul(o,e,a) < 0){
		var intersection_5=new point(o.x+eoa_x,o.y+eoa_y);		
		drawLine(clockwise(o,e,x_eo,y_eo),intersection_5);
		drawLine(anticlockwise(o,a,x_ao,y_ao),intersection_5);		
	}
	else{
		if((eo_x==ao_x)&&(eo_y==ao_y)){
			drawLine(clockwise(o,e,x_eo,y_eo),clockwise(o,a,x_ao,y_ao));
			drawLine(anticlockwise(o,e,x_eo,y_eo),anticlockwise(o,a,x_ao,y_ao));
		}
		else{
			drawLine(anticlockwise(o,a,x_ao,y_ao),clockwise(o,e,x_eo,y_eo));
		}
	}
}

function drawIntersection_6(data){
	var o=new point(lonTrans(data.lon),latTrans(data.lat));
	var a=new point((lonTrans(data.partner[0])+lonTrans(data.lon))/2,(latTrans(data.partner[1])+latTrans(data.lat))/2);
	var b=new point((lonTrans(data.partner[2])+lonTrans(data.lon))/2,(latTrans(data.partner[3])+latTrans(data.lat))/2);
	var c=new point((lonTrans(data.partner[4])+lonTrans(data.lon))/2,(latTrans(data.partner[5])+latTrans(data.lat))/2);
	var d=new point((lonTrans(data.partner[6])+lonTrans(data.lon))/2,(latTrans(data.partner[7])+latTrans(data.lat))/2);
	var e=new point((lonTrans(data.partner[8])+lonTrans(data.lon))/2,(latTrans(data.partner[9])+latTrans(data.lat))/2);
	var f=new point((lonTrans(data.partner[10])+lonTrans(data.lon))/2,(latTrans(data.partner[11])+latTrans(data.lat))/2);
	

	result=mysort(o,[a,b,c,d,e,f]);

	a=result[5];
	b=result[4];
	c=result[3];
	d=result[2];
	e=result[1];
	f=result[0];
	
	var l_ao=Math.sqrt((a.x-o.x)*(a.x-o.x)+(a.y-o.y)*(a.y-o.y))
		x_ao=width*Math.abs(a.y-o.y)/l_ao
		y_ao=width*Math.abs(a.x-o.x)/l_ao;
		
	var l_bo=Math.sqrt((b.x-o.x)*(b.x-o.x)+(b.y-o.y)*(b.y-o.y))
		x_bo=width*Math.abs(b.y-o.y)/l_bo
		y_bo=width*Math.abs(b.x-o.x)/l_bo;
	
	var l_co=Math.sqrt((c.x-o.x)*(c.x-o.x)+(c.y-o.y)*(c.y-o.y))
		x_co=width*Math.abs(c.y-o.y)/l_co
		y_co=width*Math.abs(c.x-o.x)/l_co;
	
	var l_do=Math.sqrt((d.x-o.x)*(d.x-o.x)+(d.y-o.y)*(d.y-o.y))
		x_do=width*Math.abs(d.y-o.y)/l_do
		y_do=width*Math.abs(d.x-o.x)/l_do;
		
	var l_eo=Math.sqrt((e.x-o.x)*(e.x-o.x)+(e.y-o.y)*(e.y-o.y))
		x_eo=width*Math.abs(e.y-o.y)/l_eo
		y_eo=width*Math.abs(e.x-o.x)/l_eo;
		
	var l_fo=Math.sqrt((f.x-o.x)*(f.x-o.x)+(f.y-o.y)*(f.y-o.y))
		x_fo=width*Math.abs(f.y-o.y)/l_fo
		y_fo=width*Math.abs(f.x-o.x)/l_fo;
		
	var ao_x=(a.x-o.x)/l_ao;
		ao_y=(a.y-o.y)/l_ao;
		bo_x=(b.x-o.x)/l_bo;
		bo_y=(b.y-o.y)/l_bo;	
		co_x=(c.x-o.x)/l_co;
		co_y=(c.y-o.y)/l_co;
		do_x=(d.x-o.x)/l_do;
		do_y=(d.y-o.y)/l_do;
		eo_x=(e.x-o.x)/l_eo;
		eo_y=(e.y-o.y)/l_eo;
		fo_x=(f.x-o.x)/l_fo;
		fo_y=(f.y-o.y)/l_fo;
		
	var aob_x=ao_x+bo_x
		aob_y=ao_y+bo_y
		l_aob=Math.sqrt(aob_x*aob_x+aob_y*aob_y);
		aob_x=width*aob_x/l_aob;
		aob_y=width*aob_y/l_aob;
		
	var boc_x=co_x+bo_x
		boc_y=co_y+bo_y
		l_boc=Math.sqrt(boc_x*boc_x+boc_y*boc_y);
		boc_x=width*boc_x/l_boc;
		boc_y=width*boc_y/l_boc;
		
	var cod_x=co_x+do_x
		cod_y=co_y+do_y
		l_cod=Math.sqrt(cod_x*cod_x+cod_y*cod_y);
		cod_x=width*cod_x/l_cod;
		cod_y=width*cod_y/l_cod;
		
	var doe_x=do_x+eo_x
		doe_y=do_y+eo_y
		l_doe=Math.sqrt(doe_x*doe_x+doe_y*doe_y);
		doe_x=width*doe_x/l_doe;
		doe_y=width*doe_y/l_doe;
		
	var eof_x=eo_x+fo_x
		eof_y=eo_y+fo_y
		l_eof=Math.sqrt(eof_x*eof_x+eof_y*eof_y);
		eof_x=width*eof_x/l_eof;
		eof_y=width*eof_y/l_eof;
		
	var foa_x=fo_x+ao_x
		foa_y=fo_y+ao_y
		l_foa=Math.sqrt(foa_x*foa_x+foa_y*foa_y);
		foa_x=width*foa_x/l_foa;
		foa_y=width*foa_y/l_foa;
		
	// draw aob
	if(crossMul(o,a,b) > 0 ){				
		var intersection_1=new point(o.x-aob_x,o.y-aob_y);	
		drawLine(clockwise(o,a,x_ao,y_ao),intersection_1);
		drawLine(anticlockwise(o,b,x_bo,y_bo),intersection_1);
	}
	else if(crossMul(o,a,b) < 0){
		var intersection_1=new point(o.x+aob_x,o.y+aob_y);		
		drawLine(clockwise(o,a,x_ao,y_ao),intersection_1);
		drawLine(anticlockwise(o,b,x_bo,y_bo),intersection_1);		
	}
	else{
		if((ao_x==bo_x)&&(ao_y==bo_y)){
			drawLine(clockwise(o,a,x_ao,y_ao),clockwise(o,b,x_bo,y_bo));
			drawLine(anticlockwise(o,a,x_ao,y_ao),anticlockwise(o,b,x_bo,y_bo));
		}
		else{
			drawLine(clockwise(o,a,x_ao,y_ao),anticlockwise(o,b,x_bo,y_bo));
		}
	}
	
	//draw boc
	if(crossMul(o,b,c) > 0 ){				
		var intersection_2=new point(o.x-boc_x,o.y-boc_y);	
		drawLine(clockwise(o,b,x_bo,y_bo),intersection_2);
		drawLine(anticlockwise(o,c,x_co,y_co),intersection_2);
	}
	else if(crossMul(o,b,c) < 0){
		var intersection_2=new point(o.x+boc_x,o.y+boc_y);		
		drawLine(clockwise(o,b,x_bo,y_bo),intersection_2);
		drawLine(anticlockwise(o,c,x_co,y_co),intersection_2);		
	}
	else{
		if((co_x==bo_x)&&(co_y==bo_y)){
			drawLine(clockwise(o,c,x_co,y_co),clockwise(o,b,x_bo,y_bo));
			drawLine(anticlockwise(o,c,x_co,y_co),anticlockwise(o,b,x_bo,y_bo));
		}
		else{
			drawLine(clockwise(o,b,x_bo,y_bo),anticlockwise(o,c,x_co,y_co));
		}
	}

	//draw cod
	if(crossMul(o,c,d) > 0 ){				
		var intersection_3=new point(o.x-cod_x,o.y-cod_y);	
		drawLine(clockwise(o,c,x_co,y_co),intersection_3);
		drawLine(anticlockwise(o,d,x_do,y_do),intersection_3);
	}
	else if(crossMul(o,c,d) < 0){
		var intersection_3=new point(o.x+cod_x,o.y+cod_y);		
		drawLine(clockwise(o,c,x_co,y_co),intersection_3);
		drawLine(anticlockwise(o,d,x_do,y_do),intersection_3);		
	}
	else{
		if((co_x==do_x)&&(co_y==do_y)){
			drawLine(clockwise(o,c,x_co,y_co),clockwise(o,d,x_do,y_do));
			drawLine(anticlockwise(o,c,x_co,y_co),anticlockwise(o,d,x_do,y_do));
		}
		else{
			drawLine(anticlockwise(o,c,x_co,y_co),clockwise(o,d,x_do,y_do));
		}
	}
		
	//draw doe
	if(crossMul(o,d,e) > 0 ){				
		var intersection_4=new point(o.x-doe_x,o.y-doe_y);	
		drawLine(clockwise(o,d,x_do,y_do),intersection_4);
		drawLine(anticlockwise(o,e,x_eo,y_eo),intersection_4);
	}
	else if(crossMul(o,d,e) < 0){
		var intersection_4=new point(o.x+doe_x,o.y+doe_y);		
		drawLine(clockwise(o,d,x_do,y_do),intersection_4);
		drawLine(anticlockwise(o,e,x_eo,y_eo),intersection_4);		
	}
	else{
		if((do_x==eo_x)&&(do_y==eo_y)){
			drawLine(clockwise(o,e,x_eo,y_eo),clockwise(o,d,x_do,y_do));
			drawLine(anticlockwise(o,e,x_eo,y_eo),anticlockwise(o,d,x_do,y_do));
		}
		else{
			drawLine(anticlockwise(o,e,x_eo,y_eo),clockwise(o,d,x_do,y_do));
		}
	}	

	//draw eof
	if(crossMul(o,e,f) > 0 ){				
		var intersection_5=new point(o.x-eof_x,o.y-eof_y);	
		drawLine(clockwise(o,e,x_eo,y_eo),intersection_5);
		drawLine(anticlockwise(o,f,x_fo,y_fo),intersection_5);
	}
	else if(crossMul(o,e,f) < 0){
		var intersection_5=new point(o.x+eof_x,o.y+eof_y);		
		drawLine(clockwise(o,e,x_eo,y_eo),intersection_5);
		drawLine(anticlockwise(o,f,x_fo,y_fo),intersection_5);		
	}
	else{
		if((eo_x==fo_x)&&(eo_y==fo_y)){
			drawLine(clockwise(o,e,x_eo,y_eo),clockwise(o,f,x_fo,y_fo));
			drawLine(anticlockwise(o,e,x_eo,y_eo),anticlockwise(o,f,x_fo,y_fo));
		}
		else{
			drawLine(anticlockwise(o,f,x_fo,y_fo),clockwise(o,e,x_eo,y_eo));
		}
	}
	
	//draw foa
	if(crossMul(o,f,a) > 0 ){				
		var intersection_6=new point(o.x-foa_x,o.y-foa_y);	
		drawLine(clockwise(o,f,x_fo,y_fo),intersection_6);
		drawLine(anticlockwise(o,a,x_ao,y_ao),intersection_6);
	}
	else if(crossMul(o,f,a) < 0){
		var intersection_6=new point(o.x+foa_x,o.y+foa_y);		
		drawLine(clockwise(o,f,x_fo,y_fo),intersection_6);
		drawLine(anticlockwise(o,a,x_ao,y_ao),intersection_6);		
	}
	else{
		if((fo_x==ao_x)&&(fo_y==ao_y)){
			drawLine(clockwise(o,f,x_fo,y_fo),clockwise(o,a,x_ao,y_ao));
			drawLine(anticlockwise(o,f,x_fo,y_fo),anticlockwise(o,a,x_ao,y_ao));
		}
		else{
			drawLine(anticlockwise(o,a,x_ao,y_ao),clockwise(o,f,x_fo,y_fo));
		}
	}
}












