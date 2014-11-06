function mycompare(a,b,o){
	if(a.x >= o.x && b.x < o.x){
		return 1;
	}
	if(a.x < o.x && b.x >= o.x ){
		return -1;
	}
	if(a.x >= o.x && b.x>= o.x){
		if( a.x == o.x && b.x==o.x){
			return a.y> o.y;
			}
		else{
			return 0 - crossMul(o,a,b);
		}
	}
	if(a.x < o.x && b.x < o.x){
		return 0 - crossMul(o,a,b);
	}
}
function mysort(o,myarray){
	var temp;
	for(var i=0;i<myarray.length-1;i++){
		for(var j=0;j<myarray.length-i-1;j++){
			if( mycompare(myarray[j],myarray[j+1],o) > 0 ){
				temp=myarray[j];
				myarray[j]=myarray[j+1];
				myarray[j+1]=temp;				
			}
		}
	}
	return myarray;
}