//in this constructor, paracite inherits Date and adds 
//datetostring -type method of the form dd.mm.yyyy (string)
//and date2picker of the form yyyy-mm-dd, compatible with datepicker input
function date(date){
	if(date==undefined){date=Date.now()};
	var newdate=new Date(date)

	//if(
	//newdate.getHours() ==0 && 
	newdate.setMinutes(0)//==0 && 
	newdate.setSeconds(0)//==0 && 
	newdate.setMilliseconds(0)//==0){
	newdate.setHours(3);
	//}

	newdate.date2str=function(){
		return this.getDate().toString()+"."+(this.getMonth()+1).toString()
				+"."+this.getFullYear().toString();
	}
	newdate.date2picker=function(){
		return (0+this.getFullYear().toString()).slice(-4)+"-"+(0+(this.getMonth()+1).toString()).slice(-2)
				+"-"+(0+this.getDate().toString()).slice(-2);
	}
	
	newdate.floor=function(){
		this.setHours(0);
		this.setMinutes(0);
		this.setSeconds(0);
		this.setMilliseconds(0);
		return this;
	}

	newdate.ceil=function(){
		if(this.getHours()!=0 || this.getMinutes()!=0 ||
			this.getSeconds()!=0 || this.getMilliseconds()!=0){
			this.floor();
			this.setDate(this.getDate()+1);
		}
		return this;
	}

	return newdate;
}

function linspace(a,b){
	linsp=[];
	if(a%1==0 && b%1==0){
		a=parseInt(a);
		b=parseInt(b);
		if(a>b){
			var tmp =a;
			a=b;
			b=tmp;
		}
		for (i=a;i<=b;i++){
			linsp.push(i);
		}
		return linsp;
	}else{
		return -1;
	}
}

function linspaceofdays(dt1,dt2){
	if(dt1>dt2){
		var tmp = dt2;
		dt2=dt1;
		dt1=tmp;
	}
	var args=Math.round((dt2-dt1)/days);
	
	var linsp=linspace(0,args);
	linsp=linsp.map(
		function(i){
			return new date(dt2-i*days);
		}
	);
	return linsp;
}

function sum(array){
	var sum=0;
	for(i of array){
		sum=sum+i;
	}
	return sum;
}

function matrix2csvstr(matrix){
	str="";
	for (i of matrix){
		for (j of i){
			str=str.concat(j+",");
		}
		str=str.slice(0,-1);
		str=str.concat("\n");
	}
	str=str.slice(0,-1);
	return strbreak(str);
}


var days=1000*60*60*24;
var dayspermonth = 365/12;
