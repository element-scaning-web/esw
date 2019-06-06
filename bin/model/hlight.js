var oldStyle = '';
var target = '';
function defvalue(att){
	if(att == undefined){
		return '';
	}else{
		return att;
	}
};

function displayX(event){
	var e = event || window.event;
	target = e.target || e.srcElement;
	console.log(target.innerHTML);
	
	var resJson = getX(e);
	
	oldStyle= target.style.border;
	console.log(oldStyle);
	target.style.border='3px solid red';
	
	var title = 'na';
	title = window.document.title;
	
	var id = target.id;
	var name = target.name;
	var href = target.href;
	var clss = target.className;
	var value = target.value;
	var txt = target.text;
	var type= target.tagName;
	var alias = 'na';
	
	/*
	var maxsize = target.maxLength;
	var outHtml = target.outerHTML;
	var outText = target.outerText;
	var ttype = target.type;
	var nodeNm = target.nodeName;
	var localNm = target.localName;
	var isHidden = target.hidden;
	var isDisabled = target.disabled;
	var classNm = target.className;
	var isAutoCmp = target.autocomplete;
	var attrs = target.attributes;
	var src = target.src;
	var styles = target.style;
	*/
	
	id = defvalue(id);
	name = defvalue(name);
	href = defvalue(href);
	clss = defvalue(clss);
	value = defvalue(value);
	txt = defvalue(txt);
	type = defvalue(type);

	var framess = resJson['iFrameIdOrName'];
	var xpath1= resJson['xpathEquals'];
	var xpath2= resJson['firstXpath'];
	var xpath3= resJson['xpathContains'];
	
	if(txt == '' || txt == undefined){
		alias = type;
	}else{
		alias = txt;
	}
	
	console.log("-------------CURRENT ELEMENT INFO-------------");
	console.log("---title: "+ title);
	console.log("---id: "+ id + ", name: " + name + ", type: " + type + ", class: " + clss);
	console.log("---href: "+ href + ", value: " + value + ", text: " + txt + ', alias:' + alias);
	console.log("---frame: " + framess );
	console.log("---xpath1: " + xpath1);
	console.log("---xpath2: " + xpath2);
	console.log("---xpath3: " + xpath3);
	
	var data = {
		act: 'elementInfo',
		msg: {
			title:title,
			id: id, 
			alias: alias, //元素名称
			name: name,
			href: href,
			clss: clss,
			value: value,
			txt: txt,
			type: type,
			xpath1:xpath1,
			xpath2:xpath2,
			xpath3:xpath3,
			framess:framess
		}
	};
	window.top.postMessage(data, '*');
	
};

function reStyle(event){
	//var e = event || window.event;
	//var target = e.target || e.srcElement;
	target.style.border='';;
};

//document.ready=function(){
			var es = document.getElementsByTagName("HLTYPE");
			for (i = 0; i < es.length; i++) {
				
				es[i].addEventListener("mousemove", function(event){ 
					console.log('---------change------------');
					displayX(event); 
				});
				
				es[i].addEventListener("mouseout", function(event){ 
					console.log('-------restore-------');
					reStyle(event); 
				});
	};
//};

