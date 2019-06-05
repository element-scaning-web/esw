
$(document).ready(function(){ 
  	var oldStyle = "";
	
	//$("HLTYPE").one("mousemove",function(event){
	$("HLTYPE").mousemove(function(event){
		
		var resJson = getX(event);
		
		var oldStyle= $(this).css("border");
		console.log($(this).css("border"));
		$(this).css("border","3px solid red");
		
		var title = $('title').text();
		var id = $(this).attr("id");
		var name = $(this).attr("name");
		var href = $(this).attr("href");
		var clss = $(this).attr("class");
		var value = $(this).attr("value");
		var txt = $(this).text();
		var type= $(this).prop("tagName");
		var alias = 'na';
		
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
		
	});

	//$("HLTYPE").one("mouseout",function(event){
	$("HLTYPE").mouseout(function(event){
		//$(this).css("background","rgba(0, 0, 0, 0)");
		$(this).css("border",oldStyle);
	});
});
