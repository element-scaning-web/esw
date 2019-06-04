
$(document).ready(function(){ 
  	var oldbackground = "rgba(0, 0, 0, 0)";
	
	$("HLTYPE").one("mousemove",function(event){
	//$("HLTYPE").mousemove(function(event){
		
		var resJson = getX(event);
		
		$(this).css("background","yellow");
		oldbackground =  $(this).css("background");
		
		var title = $('title').text();
		var id = $(this).attr("id");
		var name = $(this).attr("name");
		var href = $(this).attr("href");
		var clss = $(this).attr("class");
		var value = $(this).attr("value");
		var txt = $(this).attr("text");
		var type= $(this).prop("tagName");
		
		var framess= "framess";
		var xpath1= resJson['xpathEquals'];
		var xpath2= resJson['firstXpath'];
		var xpath3= resJson['xpathContains'];
		
		console.log("-------------CURRENT ELEMENT INFO-------------");
		console.log("---title: "+ title);
		console.log("---id: "+ id + ", name: " + name + ", type: " + type + ", class: " + clss);
		console.log("---href: "+ href + ", value: " + value + ", text: " + txt);
		console.log("---frame: " + framess );
		console.log("---xpath1: " + xpath1);
		console.log("---xpath2: " + xpath2);
		console.log("---xpath3: " + xpath3);

		
		var data = {
			act: 'elementInfo',
			msg: {
				title:title,
				id: id, 
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

	$("HLTYPE").one("mousemove",function(event){
	//$("HLTYPE").mouseout(function(event){
		$(this).css("background","rgba(0, 0, 0, 0)");
	});
});
