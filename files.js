function readjson(path){
	if (window.File && window.FileReader && window.FileList && window.Blob) {
		if(path){
			var r = new FileReader();
			r.onload = function(e){
				var contents=JSON.parse(r.result);
				if(!books.find(function(i){return contents.bookname == i.bookname})){
					var bk=new book(contents.bookname);
					for (var i of contents.areas){
						bk.area(i.subname,i.name);
						for (var j of i.markups){
							bk.personadd(j.person);
							if(!!j.taken){
								j.taken=new date(j.taken);
							}
							if(!!j.returned){
								j.returned=new date(j.returned);
							}
							bk.area(i.subname,i.name,j);
							bk.addtype(i.subname,i.name,i.type);
						}
					}
					books.push(bk);
					drawsettings();
				}else{
					alert('Another book \"'+contents.bookname+'\" exists.')
				}
			}
			r.readAsText(path);
		}else{
			alert('No path declared.')
		}

	}else{
		alert('The File APIs are not fully supported by your browser.');
	}
}


function writejson(text,filename,type){
	if (window.Blob) {	
		if(confirm("Never ever put any names online in any form! \n DO NOT SEND any files containing any names \n VIA EMAIL or any other online services! \n If you still wish to do so, use anonymized versions and encrypt them! \n Take good care of the file's security and delete it if not needed.")){
			var bl = new Blob([strbreak(text)],{type:'text/plain'});
			var element=document.createElement("a");
			element.id="removethis";
			element.download = filename+(new date).date2str()+type;
			element.href = window.URL.createObjectURL(bl);
			$('body').append(element);
			element.click();
			$('#removethis').remove();
		}
	}else{
		alert('No HTML5 Blob support :( ')
	}
}

function strbreak(text){
	var i = 1;
	while (i<text.length){
		if (text[i-1]+text[i]=="}," || text[i-1]+text[i]==":["){
			text=text.slice(0,i+1)+"\r\n"+text.slice(i+1,text.length);
		}
		i++;
	}
	return text;
}
