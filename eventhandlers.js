function draw(book){
	var areatbtemplate= $('#areatemplate').html();
	areatbtemplate = Mustache.render(areatbtemplate,book);
	$("#content").empty().append(areatbtemplate);
	drawbuttons(books[0]);//global book
	widgethandlers(book);
}

function drawbuttons(book){
	if(book==undefined){book=[];}
	var searchbbtemplate= $('#settingsbtn').html()+$('#searchbbtemplate').html();
	var searchbboutput = Mustache.render(searchbbtemplate,book);
	$("#searchbar").empty().append(searchbboutput);
	s_handlers(book);
}

function drawsettings(){
	var content = $('#settings').html();
	content = Mustache.render(content,{books});
	$('#content').empty().append(content);
	drawsubsettings();
	drawbuttons(books[0]);
	s_handlers();
}

function drawsubsettings(){
	if(books[0]!=undefined){
		var content = $('#subsettings').html();
		content = Mustache.render(content,books[0]);
		$('#subsettingscontent').empty().append(content);
		s_handlers();
	}
}


function s_handlers(){
//handles the buttons found in the searchbar
	$('#settingsbutton').off('click').on('click',function(){
		drawsettings();	
	});

//handles the buttons found in settings
	$('.bookadder').off('click').on('click',function(){
		var name=$(this).siblings('.bookadderinput').val();
		if(!books.find(function(i){return i.bookname == name})){
			books.push(new book(name));
			drawsettings();
		}else{
			//alert('Book already exists.')
		}
	});
	
	$('.bookrenamebutton').off('click').on('click',function(){
		//just switches the book to be edited to 0
		var oldname=$(this).attr('bookname');
		var newname=$('.bookadderinput').val();
		var bkbyname=books.filter(function(i){return i.bookname == oldname});
		if(bkbyname.length==1){
			if(confirm('Rename \"'+oldname+'\" as \"'+newname+'\"?')){
				bkbyname[0].bookname=newname;
				drawsettings();
			}
		}else{
			alert('Book \"'+newname+'\" already exists.')
		}
	});

	$('.areasettingsadder').off('click').on('click',function(){
		var subname=$(this).siblings('[func="subname"]').val();
		var name=$(this).siblings('[func="name"]').val();
		var nameb=$(this).siblings('[func="nameend"]').val();
		if(name%1==0 && nameb%1==0){
			console.log(linspace(name,nameb))
			linspace(name,nameb).forEach(function(i){books[0].area(subname,i)});//global book
		}else{
			books[0].area(subname,name);//global book
		}
		drawsettings();
	});

	$('.bookbutton').off('click').on('click',function(){
		//just switches the book to be edited to 0
		var bookname=$(this).attr('bookname');
		var temp=books[0];
		var index=books.indexOf(books.find(function(i){return i.bookname==bookname}));
		drawbuttons(books[index]);
		books[0]=books[index];//global book
		books[index]=temp;
		drawsettings();
	});


	//$('.bookdel').off('click');
	$('.bookdel').off('click').on('click',function(){
		var bookname=$(this).attr('bookname');
		if(confirm('Delete the book '+bookname+'?')){
			books=books.filter(function(i){return i.bookname!=bookname});
			drawsettings();
		}
	});


	$('.areabutton').off('click').on('click',function(){
		var subname=$(this).attr('subname');
		var name=$(this).attr('name');
		if(confirm('Remove '+subname+name+'?')){
					books[0].areas=books[0].areas.filter(function(i){return !(i.subname==subname && i.name==name)});
		}
		drawsettings();
	});

	$('.personadder').off('click').on('click',function(){
		var person=$('.personinput').val();
		books[0].personadd(person);
		drawsettings();
	});

	$('.personbutton').off('click').on('click',function(){
		var oldperson=$(this).html();
		var newperson=$('.personinput').val();
		if(confirm('Replace \"'+oldperson+'\" by \"'+newperson+'\"?')){
			books[0].personrm(oldperson);
			books[0].personadd(newperson);
			var iterf = function(markupiterator){
					if(markupiterator.person==oldperson){
						markupiterator.person=newperson;
					}
				}
			books[0].foreachmarkup(iterf);
			drawsettings();
		}
	});

	$('.anonymizer').off('click').on('click',function(){
		var newperson="Anon.";
		if(confirm('Replace all names by \"'+newperson+'\"?')){
			books[0].persons_empty();
			var iterf = function(markupiterator){
					markupiterator.person="Anon.";
				}
			books[0].foreachmarkup(iterf);
			drawsettings();
		}
	});

	$('.deleverything').off('click').on('click',function(){
		if(confirm('Delete everything?')){
			books=[];
			localStorage.clear();
			drawsettings();
		}
	});

	//subname -buttons which draws a filtered version of the areas
	$('.searchbutton').off('click').on('click',function(){
		draw(books[0].bysubnames($(this).attr('subname')));//global book
	});

	//$('.jsonimport').on('click',function(){
	//	var fileInput = $(this).siblings('.jsonfile');
	//	
	//});
	
	$('.jsonimport').off('click').on('click',function(){
		var path=$(this).siblings('.jsonfile')[0].files[0];
		//var bookname=$(this).attr('bookname');
		//var book=books.filter( function(i){return i.bookname==bookname} )[0];//$(this).attr('bookname');
		readjson(path,book);
	});

	$('.jsonexport').off('click').on('click',function(){
		var bookname=$(this).attr('bookname');
		var txt = (books.filter( function(i){return i.bookname==bookname} ))[0].json();
		writejson(txt,bookname,'.txt');
	});

	$('.export_list').off('click').on('click',function(){
		var bookname=$(this).attr('bookname');
		var bktmp = (books.filter( function(i){return i.bookname==bookname} ))[0];
		var txt = strbreak( bktmp.simplestring(new date));
		writejson(txt,bookname+'_list_','.csv');
	});
	$('.export_plot').off('click').on('click',function(){
		//replace the following four lines with something more flexible!
		var now=new date();
		now.setDate(0);
		var d2=new date(now.valueOf()+4*dayspermonth*days);
		var d1=new date(d2.valueOf()-(3*12+4)*dayspermonth*days);
		if(confirm("This may take a minute...")){
			var bookname=$(this).attr('bookname');
			var bktmp = (books.filter( function(i){return i.bookname==bookname} ))[0];
			var txt = bktmp.graphs(d1,d2);
			writejson(txt,bookname+'_plot_','.csv');
		}
	});
	$('.papers').off('click').on('click',function(){
		var bookname=$(this).attr('bookname');
		var bktmp = (books.filter( function(i){return i.bookname==bookname} ))[0];
		var tmpl = $("#papers").html();
		var render = Mustache.render(tmpl,{namehierarchy:bktmp.namehierarchy(new date)});
		$("#content").empty().append(render);
	});
}

function widgethandlers(book){
	//handles the widgets 'arearemover' and 'areaadder'
	$('.markupadder, .markupremover').off('click').on('click',function(){
		var subname=$(this).attr('subname');
		var name=$(this).attr('name');
		var classname=$(this).attr('class');
		if (classname=='markupadder'){
			if(!book.givearea(subname,name).atdesk()  ){
				var dropdowntemplate=$('#addertemplatev2').html();
			}else{
				var dropdowntemplate=$('#addertemplatev1').html();
			}
		}else if(classname=='markupremover'){
			var dropdowntemplate=$('#removertemplate').html();
		}
		$('div.dropdown').remove();
		var dropdown = Mustache.render(
				dropdowntemplate,{persons:book.persons,subname:subname,name:name})
		$(this).parent().parent().append(dropdown)
		$('.widgetdatepicker').val((new date).date2picker());
		update_buttonhandlers();
	});
	
	//these are for widget buttons
	function update_buttonhandlers(){
		$('button.cancel').off('click').on('click', function(){
			$('div.dropdown').remove();
		});
		$('button.add').off('click').on('click', function(){
			var psubname=$(this).attr('subname');
			var pname=$(this).attr('name');
			var pdate=new date($('.widgetdatepicker').val());
			var tbk=book.areas.filter(function(i){return (i.subname==psubname && i.name == pname)})[0];
			if(tbk.lastdate()==undefined || pdate-tbk.lastdate() >= 0*days){
				book.area(psubname,pname,{person:$('.personselector').val(),
							taken:pdate});
			}else{
				alert('Dates in wrong order?');
			}
			draw(book);
			$('div.dropdown').remove();
		});
		$('button.add2').off('click').on('click', function(){
			var psubname=$(this).attr('subname');
			var pname=$(this).attr('name');
			var pdate=new date($('.widgetdatepicker').val());
			var tbk=book.areas.filter(function(i){return (i.subname==psubname && i.name == pname)})[0];
			if(tbk.lastdate()==undefined || pdate-tbk.lastdate() >= 0*days){		
				book.area(psubname,pname,{returned:pdate});
			}else{
				alert('Dates in wrong order?');
			}
			draw(book);
			$('div.dropdown').remove();
		});
		$('button.remove').off('click').on('click', function(){
			book.removelatestmarkup($(this).attr('subname'),
					$(this).attr('name'));
			draw(book);
			$('div.dropdown').remove();
		});
	}
}
