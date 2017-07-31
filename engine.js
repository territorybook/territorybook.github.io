function book(name){//the whole book
	this.bookname=name;
	this.persons=[{name:"Anon."}];//list of names of the users, for convenience and integrity
	this.areas=[]
	

	/////// methods for manipulating the array 'person' /////

	//pushes the name if not in the list.
	this.personadd=function(name){//if not found:
		var finder = this.persons.find(function(i){return (i.name==name)});
		if( !finder ){
			this.persons.push({name:name});
		}
		this.persons.sort(function(i,j){
			if (i.name>j.name){
				return 1;
			}else{
				return -1;
			}});
	};

	//pops.
	this.personrm=function(name){//if not found:
		var finder = this.persons.find(function(i){return (i.name==name)});
		if( !!finder ){
			this.persons.splice(this.persons.indexOf(finder),1);
		}
	};

	this.persons_empty=function(){
		this.persons=[{name:"Anon."}];
	}

	
	/////// methods for manipulating the object 'areas' /////
	
	//pushes the area if not in the list areas, otherwise calls for markup, if argument exists, otherwise pops.
	this.area=function(subname, name, markup){
		//1:area not found, to be added. 2: area found but markup added, 3: area found and removed
		if ( !this.areas.find(function(i){return (i.subname==subname && i.name==name)}) ){
			var newarea=new area(subname,name,markup);
			this.areas.push(newarea);
		}else if ( !!markup ){
			//the exact and only area, where the markup is called
			this.areas.filter(function(val){return val.subname==subname && val.name==name})[0].markup(markup);
		}else{
			return;
		}
		this.sort();
	}

	this.addtype=function(subname,name,type){
		var area_found=this.areas.filter(function(val){return val.subname==subname && val.name==name});
		if ( area_found.length != 0 ){
			area_found[0].type=type;
		}	
	}

	this.sort=function(){
		this.areas.sort(
			function(i,j){
				if(i.subname==j.subname){
					return parseInt(i.name)-parseInt(j.name);
				}else if(i.subname>j.subname){
					return 1;
				}else{
					return -1;
				}
			}
		);
	}
	
	this.removelatestmarkup=function(subname, name){
		//1:area not found, to be added. 2: area found but markup added, 3: area found and removed
		var area_edit=this.areas.filter(function(i){return (i.subname==subname && i.name==name)});
		if ( !!area_edit ){
			area_edit[0].poplatest();
		}
	}
	
	//returns the area by its subname and name
	this.givearea=function(subname,name){
		return this.areas.find( function(i){
			if(i.subname==subname && i.name == name){
				return i;
			}
		});
	}

	//returns a structure which contains the book's subnames -information
	this.subnames=function(){
		var snms=[];
		for(var i of this.areas){
			if( !snms.find(function(k){return k.subname==i.subname}) ){
				snms.push({subname:i.subname});
			}
		}
		return snms;
	}

	//returns a book-like structure with additional hierarchy of subnames.
	//the areas are editable and are the areas of 'this'
	this.subnamehierarchy=function(){
		var newbook = {bookname:this.bookname};
		newbook.subnames=this.subnames().map(function(i){return i.subname}
			).map(this.bysubnames,this)
		return newbook;
	}

	//returns a structure where areas are mapped into 
	//
	//at a given date dt
	this.simplestring=function(dt){
		var sr = '|';
		var sr2 = sr+sr;
		var sr3 = sr2+sr;
		var row = 10;//make sure this is correct!
		var row_end=row+this.areas.length-1;
		var str=sr2+this.bookname+sr+'Date:'+sr+dt.date2str()+'\n';
		str=str+sr3+'overtime'+sr+'12'+sr+'months.'+'\n';
		str=str+sr3+'undertime'+sr+'4'+sr+'months.'+'\n'+'\n';
		str=str+sr3+'Total:'+sr+ '=counta(A'+row+':A'+row_end+')' +'\n';
		str=str+sr3+'Overtime:'+sr+'=countif(G'+row+':G'+row_end+',D2)'+'\n';
		str=str+sr3+'Undertime:'+sr+'=countif(G'+row+':G'+row_end+',D3)'+'\n'+'\n';
		
		var last=[];
		str=str+''+sr+''+sr+'Person'+sr+'Taken'+sr+'Latest return'+sr+'Age(months)'+sr+'remarks'+'\n';
		for (i of this.areas){
			last=i.last();
			if(!last[0]){
				last[0]="-";
			}if(last[1]){
				last[1]=last[1].date2str();
			}else{
				last[1]="-";
			}if(last[2]){
				last[2]=last[2].date2str();
			}else{
				last[2]="-";
			}
			str=str+i.subname+sr+i.name+sr+'\"'+last[0]+'\"'
				+sr+last[1]+sr+last[2]+sr+
				'=(year($E$1)-year(E'+row+'))*12+month($E$1)-month(E'+row+')+(day($E$1)-day(E'+row+'))/(365/12)'+sr+
				'=if(F'+row+'>$E$2,"overtime",if(F'+row+'<$E$3,"undertime",""))'+'\n';
			row++;
		}
		return str;
	}

	//returns a new book filtered by area subnames.
	this.bysubnames=function(subnames){
		if(!(subnames instanceof Array)){subnames=[subnames]}
		var iteratorf=function(areaiterator){
			return subnames.some(function(k){return k==areaiterator.subname});
		}
		return this.byiterator(iteratorf);
	}
	
	//returns a new book filtered by iteratorf. the object itself
	//is new but the areas are the same as the parent objects
	this.byiterator=function(iteratorf){
		var newbook=new book(this.bookname);
		newbook.areas=this.areas.filter(
			function(i){
				return iteratorf(i);
			}
		);
		newbook.persons=this.persons;
		return newbook;
	}
	
	//calls iteratorf for each markup
	this.foreachmarkup=function(iteratorf){
		this.areas.forEach(
			function(areaiterator){
				areaiterator.foreachmarkup(iteratorf);
			}
		);
	}
	
	this.json=function(){
		return JSON.stringify({bookname:this.bookname,areas:this.areas});
	}
	
	//returns an array of structures {subname,name,returns}, where returns
	//contains the return dates between dt1-dt2
	//this.maptoreturned=function(dt1,dt2){
	//	return this.areas.map(
	//		function(i){
	//			return i.returnsbetween(dt1,dt2).length;//};
	//		}
	//	);
	//}

	//this.stats=function(dt){
	//	return this.areas.map(
	//		function(i){
	//			return i.stats(dt);
	//		}
	//	);
	//}
	
	this.earliestdate=function(){
		var earlydates=this.areas.map(
			function(i){
				return i.first()
			}
		);
		earlydates=earlydates.filter(function(i){
			return !!i
		});
		earlydates.sort(
			function(i,j){
				if(i>j){return 1}
				else{return -1}
			}
		);
		return earlydates[0]
	}

	this.graphs=function(dta,dtb){
		if(!dtb){
			dtb = new date();
		}
		if(!dta){
			dta = this.earliestdate();
		}

		var graphs2return=[["Date","Markups/year",">24 months",">12 months",">8 months",">4 months", "Total","At Desk", "At Desk > 12mo."]];
		var dayvector=linspaceofdays(dta,dtb);
		var plotdata = matrix2csvstr( graphs2return.concat(dayvector.map(function(datevar){
			var areamaptemp = this.areas.filter(function(i){//exclude non-existing ones
				return i.exist(datevar);
			});
			areamaptemp = areamaptemp.map(function(i){ //mapping to certain stats
				var stat = i.stats(datevar);
						//[markups/year, age in months,person]
				return [stat[0],stat[2],stat[1]];
			});
			var mkpsyear = 0;
			for (i in areamaptemp){//computing a sum of the first row
				mkpsyear=mkpsyear+areamaptemp[i][0];
			}
			var months4 = areamaptemp.filter(function(i){return i[1]>=4}).length;
			var months8 = areamaptemp.filter(function(i){return i[1]>=8}).length;
			var months12 = areamaptemp.filter(function(i){return i[1]>=12}).length;
			var months24 = areamaptemp.filter(function(i){return i[1]>=24}).length;
			var atdesk = areamaptemp.filter(function(i){return i[2]=="Desk"}).length;
			var atdesk12mo = areamaptemp.filter(function(i){return (i[2]=="Desk" && i[1]>=12)}).length;

			var total = areamaptemp.length;

			return [datevar.date2pltstr(),mkpsyear,months24,months12,months8,months4,total,atdesk,atdesk12mo];
		}, this )));
		return plotdata;
	}
	
	this.namehierarchy=function(dt){
		if(!dt){
			dt=new date;
		}
		//formatting the structure by mapping from areas
		var areas_last = this.areas.map(function(i){
			var last=i.last(dt);
			if(!last[1]){
				last[1]="-";
			}else{
				last[1]=last[1].date2str();
			}if(!last[3]){
				last[3]="-";
			}else{
				last[3]=last[3].date2str();
			}
			return {person: last[0],
					date:dt,
					areas:{subname:i.subname, 
					name:i.name,
					taken: last[1],
					lastreturned: last[3] } }
		});
		//flattening the structure to obey the desired hierarchy
		var names=[];
		for (i of areas_last){
			if (!names.includes(i.person)){
				names.push(i.person);
			}
		}
		names.sort();
		for(i in names){
			names[i]=areas_last.filter(function(j){
				return j.person==names[i];
			});
		}
		for (i in names){
			var struct={areas:[]};
			for (j in names[i]){
				struct.areas.push(names[i][j].areas);
				struct.person= names[i][j].person;
				struct.date=names[i][j].date.date2str();
			}
			names[i]=struct;
		}
		return names;
	}
	
	//this.gen_something=function(){
	//	this.areas.forEach(
	//		function(i){
	//			var a1=new date((new date).valueOf()+30*days);
	//			var a2=new date(a1-days*300);
	//			var a = linspaceofdays(a2,a1);
	//			var rnum=2+Math.round(Math.random()*10)
	//			while(a.length>rnum){
	//				a.splice(Math.floor(Math.random()*365),1)
	//			}
	//			var k = a.length-1
	//			while(k>0){
	//				i.markup({person:this.persons[Math.floor(Math.random()*this.persons.length)].name, taken:a[k],returned:a[k-1]})
	//				k=k-1;
	//			}
	//		}
	//	, this);
	//	
	//	
	//}
	
	
	
	this.empty=function(){
		persons=[];
		this.areas=[];
		this.bookname=undefined;
	}
}

