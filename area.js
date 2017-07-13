function area(subname,name,markup){
	this.subname=subname;
	this.name=name;
	this.markups=[];

	
	//one or several ["name",date,date] -styled markups may be added
	this.markup=function (markup) {
		//1:name and taken, 2: returned
		if(!(markup instanceof Array)){markup=[markup]};
		for (i of markup){
			if( !!i.person && !!i.taken ){
				this.markups.push( {person:i.person,taken:i.taken,returned:i.returned});
			}else if( !i.person && !i.taken ){
				var ind=this.markups.indexOf(
							this.markups.find(function(k){return !k.returned}));
				this.markups[ind].returned=i.returned;
			}
			else{
				alert('error in area.js markup constructor\'s if');
				console.log('error in area.js markup constructor\'s if');
			}
		}
	}
		
	this.poplatest=function () {
		if(this.markups.length==0){return;}
		var latest = this.markups[this.markups.length-1];
		if(latest.returned==undefined){
			this.markups.pop();
		}else{
			latest.returned=undefined;
		}
	}
	//this is an important fact about the constructor
	if(!!markup){this.markup(markup)};
	
	
	//markups with dates as strings
	this.markups2str=function(){
		 var marks=this.markups.map(function(i){
		 	var returned=i.returned;//returned mignt not be defined
			if(returned instanceof Date){
				returned=returned.date2str();
			}
			return {person:i.person,taken:i.taken.date2str(),returned:returned};
		});
		return marks;
	};

	//returns the markups between dt1..dt2
	this.markupsbetween=function(dt1,dt2){
		if(!dt1 && !dt2){return this.markups;}
		var mkups = this.markups;
		if(!!dt1){
			dt1.floor();
			mkups = mkups.filter(
				function(m){
					return (m.returned >= dt1 || !m.returned);
				}
			);
		}
		if(!!dt2){
			dt2.ceil();
			mkups = mkups.filter(
				function(m){//m is a markup
					return (m.taken < dt2);
				}
			);
			mkups=mkups.map(function(i){
				if(i.returned < dt2){
					return i;
				}else{
					return {person:i.person,taken:i.taken}
				}
			});
		}
		return mkups;
	}

	//returns the return-dates between dt1..dt2
	this.returnsbetween=function(dt1,dt2){
		var returns = this.markupsbetween(dt1,dt2);
		returns=returns.map(function(r){
			return r.returned;
		});
		returns=returns.filter(function(r){
			if(r){
				return 1;
			}
		});
		return returns;
	}

	//true if at given date the area is not taken by anyone.
	//if date not defined, false, if area taken but never returned
	this.atdesk=function(date){
		var markupstmp=this.markupsbetween(undefined,date);
		if( markupstmp.length==0 || markupstmp[markupstmp.length-1].returned!=undefined){
			return true;
		}else{
			return false;
		}
	}

	this.first=function(){
		if (this.markups.length>0){
			return this.markups[0].taken;
		}else{
			return undefined
		}
	}
	
	this.exist=function(dt){
		if (dt - this.first() >= 0){
			return true;
		}else{
			return false;
		}
	}

	//returns [person/desk, lastmarkup, lastreturned, lastreturnedbyperson]
	this.last=function(dt){
		var markuptmp=this.markupsbetween(undefined,dt);
		var len=markuptmp.length;
		if(len == 0){
			return [undefined,undefined,undefined];
		}else if(markuptmp[len-1].returned==undefined){
			if(len > 1){
				var lastreturn = markuptmp[len-2].returned;
				if(markuptmp[len-2].person == markuptmp[len-1].person){
					var lastreturnbyperson = lastreturn
				}else{
					var lastreturnbyperson = undefined;
				}
			}else{
				var lastreturn = undefined;
				var lastreturnbyperson = undefined;
			}
			var markuptmp=markuptmp[len-1];
			return [markuptmp.person, markuptmp.taken, lastreturn, lastreturnbyperson];
		}else{
			var markuptmp= ['Desk',markuptmp[len-1].returned,0];
			markuptmp[2]=markuptmp[1];
			return markuptmp;
		}
	}

	//returns [markups/year, person, age in months, lastreturnbyperson]
	this.stats=function(dta){
		if (dta == undefined){dt = new date}
		else {dt=new date(dta)}
		if (!this.exist(dt)){return [undefined,undefined,undefined,undefined]}
		dt_a = new date(dt-days*365); //a year behind
		var statvector = [0,'Desk',undefined,undefined];
		statvector[0] = this.returnsbetween(dt_a,dt).length;
		var last = this.last(dt);
		var lastreturnbyperson = last[3];
		var lastreturn = last[2];
		var lastmarkup = last[1];
		statvector[1] = last[0];
		if ( !lastreturn ){
			statvector[2]=undefined;
			statvector[3] = lastreturnbyperson;
		}else {
			statvector[2] = (dt-lastreturn)/days/dayspermonth;
			statvector[3] = lastreturnbyperson;
		}
		return statvector;
	}

	this.lastdate=function(){
		return (this.last())[1];
	}

	//calls inputf for each markup
	this.foreachmarkup=function(iteratorf){
		this.markups.forEach(iteratorf);
	}
}


