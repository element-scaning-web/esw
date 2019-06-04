function getPageEles(types){
	var tags=document.getElementsByTagName('*');
	var typesArr = types.split(";");
	console.log('----------start get element xpath----------------------');
	var tag = [];
	for (var i = 0; i < tags.length; i++) {
		if(tags[i].tagName.toLowerCase().trim() != 'html' &&  tags[i].tagName.toLowerCase().trim() != 'body' 
			&& tags[i].tagName.toLowerCase().trim() != 'script' &&  tags[i].tagName.toLowerCase().trim() != 'style' 
				&&  tags[i].tagName.toLowerCase().trim() != 'body' &&  tags[i].tagName.toLowerCase().trim() != 'font' 
					&&  tags[i].tagName.toLowerCase().trim() != 'link' &&  tags[i].tagName.toLowerCase().trim() != 'head'  
						&&  tags[i].tagName.toLowerCase().trim() != 'meta' ){
				if(typesArr.indexOf(tags[i].tagName.toLowerCase()) != -1){
					tag.push(getXbyNode(tags[i]));
				}
		}
	}
	
	return tag;

}

function getPageEle(type) {
	var tags=document.getElementsByTagName('*');
	console.log('----------start get element xpath----------------------');
	var tag = [];
	for (var i = 0; i < tags.length; i++) {
		if(tags[i].tagName.toLowerCase().trim() != 'html' &&  tags[i].tagName.toLowerCase().trim() != 'body' 
			&& tags[i].tagName.toLowerCase().trim() != 'script' &&  tags[i].tagName.toLowerCase().trim() != 'style' 
				&&  tags[i].tagName.toLowerCase().trim() != 'body' &&  tags[i].tagName.toLowerCase().trim() != 'font' 
					&&  tags[i].tagName.toLowerCase().trim() != 'link' &&  tags[i].tagName.toLowerCase().trim() != 'head'  
						&&  tags[i].tagName.toLowerCase().trim() != 'meta'){
			
				if(tags[i].tagName.toLowerCase() != type){
					tag.push(getXbyNode(tags[i]));
				}
			
		}
	}
	
	return tag;
}

function getIdOrName(b,s){
	var frameSrc = "";
	var frameName ="";
	var frameId = "";
	var tmp = "";
	var frames= b.document.getElementsByTagName("iframe");
	for(var i = 0; i < frames.length; i++){
		var ff = frames[i];
		frameSrc = ff.getAttribute("src");
		frameName = ff.getAttribute("name");
		frameId = ff.getAttribute("id");
		if(s.indexOf(frameSrc) != -1){
			if(frameName == ""){
				tmp =  frameId;
			}
			if(frameId == ""){
				tmp = frameName;
			}
			if(frameName =="" && frameId == ""){
				tmp = (i+1);
			}
			if(frameName !="" && frameId != ""){
				tmp =  frameId;
			}
			return tmp;
			break;
		}
	}
	
	return tmp;
};

function getXbyNode(node) {
	var tagName = node.nodeName.toLowerCase();
	var xpathContainsArr = [];
	var uniquesArr = [];
	var threeStar = [];
	var twoStar = [];
	var oneStar = [];
	var name, value, locator, xpathContains, xpathEquals, firstXpath;
	var flag1 = true;
	var flag2 = true;
	var resultArrays = [];
	var iFrameUrl = "na";
	var isInIFrameFlag = "na";
	var iFrameIdOrName = "na";
	var idOrNames = "";
	var pageTitle = "na";
	var resInfo = {};
	
	try {
		pageTitle = window.document.title;
		var isInIFrame = (window.location != window.parent.location);
		if (isInIFrame == true) {
			iFrameUrl = window.document.URL;
			isInIFrameFlag = "ya";
			var b = window.self;
			var frameIdOrNames = "";
			while (true) {
				var u = b.document.URL;
				frameIdOrNames = frameIdOrNames + " , " + u;
				if (window.top == b) {
					break;
				}
				b = b.parent;

				var idOrName = getIdOrName(b, iFrameUrl);
				if (idOrNames == "") {
					idOrNames = idOrName;
				} else {
					idOrNames = idOrNames + "/" + idOrName;
				}
			}
			console.log("idOrNames:" + idOrNames);
		}
	} catch (err) {
	}
	if (tagName != 'body') {
		
		for (var i = 0; i < node.attributes.length; i++) {
			name = node.attributes[i].name;
			value = node.attributes[i].value;
			var isNoHrefFalg = (name.indexOf("href") === -1);
			var isNoSrcFalg = (name.indexOf("src") === -1);
			var isNoIdFalg = (name.indexOf("id") === -1);
			var isNoHttpFlag = (value.indexOf("http") === -1);

			if (value.indexOf("\'") < 0 && value.length > 0) {
				if ((isNoHrefFalg) && (isNoSrcFalg)) {
					xpathContains = "//" + tagName + "[contains(@" + name
							+ ",\'" + value + "\')]";
					xpathContainsArr.push(xpathContains);
					var xpr = node.ownerDocument.evaluate("count("
							+ xpathContains + ")", node.ownerDocument.body,
							null, XPathResult.NUMBER_TYPE, null);
					var bUnique = (xpr.numberValue === 1);
					uniquesArr.push(bUnique);
					if ((isNoIdFalg) && (isNoHttpFlag) && bUnique) {
						threeStar.push(xpathContains);
					} else if (bUnique) {
						twoStar.push(xpathContains);
					}
				}

				xpathEquals = "//" + tagName + "[@" + name + "=\'" + value
						+ "\']";
				xpathContainsArr.push(xpathEquals);
				if (flag1 && (name != 'id')) {
					if (firstXpath != undefined) {
						firstXpath = firstXpath + "[@" + name + "=\'" + value
								+ "\']";
						flag1 = false;
					} else {
						firstXpath = xpathEquals;
						flag1 = false;
					}
				}

				xpr = node.ownerDocument.evaluate("count(" + xpathEquals + ")",
						node.ownerDocument.body, null, XPathResult.NUMBER_TYPE,
						null);
				bUnique = (xpr.numberValue === 1);
				uniquesArr.push(bUnique);

				if (((isNoIdFalg) && (isNoHrefFalg) && (isNoSrcFalg) && (isNoHttpFlag))
						&& bUnique) {
					threeStar.push(xpathEquals);
				} else if (bUnique) {
					twoStar.push(xpathEquals);
				}

				if (value.indexOf("_") !== -1) {
					var arr = value.split("_");
					var newval = (arr[arr.length - 1])
					value = newval;
					xpathContains = "//" + tagName + "[contains(@" + name
							+ ",\'" + value + "\')]";

					if (name === 'ID' || name === 'id' || name === 'Id') {
						if (firstXpath != undefined) {
							firstXpath = firstXpath + "[contains(@" + name
									+ ",\'" + value + "\')]";
						} else {
							firstXpath = xpathContains;
						}
					}

					xpathContainsArr.push(xpathContains);
					xpr = node.ownerDocument.evaluate("count(" + xpathContains
							+ ")", node.ownerDocument.body, null,
							XPathResult.NUMBER_TYPE, null);
					bUnique = (xpr.numberValue === 1);
					uniquesArr.push(bUnique);

					if (((isNoIdFalg) && (isNoHrefFalg) && (isNoSrcFalg) && (isNoHttpFlag))
							&& bUnique) {
						threeStar.push(xpathContains);
					} else if (bUnique) {
						twoStar.push(xpathContains);
					}
				}

				if (value.indexOf("$") !== -1) {
					var arr = value.split("$");
					var newval = (arr[arr.length - 1])
					value = newval;
					xpathContains = "//" + tagName + "[contains(@" + name
							+ ",\'" + value + "\')]";
					xpathContainsArr.push(xpathContains);
					xpr = node.ownerDocument.evaluate("count(" + xpathContains
							+ ")", node.ownerDocument.body, null,
							XPathResult.NUMBER_TYPE, null);
					bUnique = (xpr.numberValue === 1);
					uniquesArr.push(bUnique);

					if (((isNoIdFalg) && (isNoHrefFalg) && (isNoSrcFalg) && (isNoHttpFlag))
							&& bUnique) {
						threeStar.push(xpathContains);
					} else if (bUnique) {
						twoStar.push(xpathContains);
					}
				}
			}
			
			resInfo[name] = value;
		}
		var nodeText = node.textContent.trim();
		if (nodeText.indexOf("\'") < 0 && nodeText.length > 0) {
			if (tagName != 'select') {
				xpath = "//" + tagName + "[contains(.,\'" + nodeText + "\')]";
				xpathContainsArr.push(xpath);
				if (flag2) {
					if (firstXpath != undefined) {
						firstXpath = firstXpath + "[contains(.,\'" + nodeText
								+ "\')]";
						flag2 = false;
					} else {
						firstXpath = xpath;
						flag2 = false;
					}
				}
				var xpr = node.ownerDocument.evaluate("count(" + xpath + ")",
						node.ownerDocument.body, null, XPathResult.NUMBER_TYPE,
						null);
				var bUnique = (xpr.numberValue === 1);
				uniquesArr.push(bUnique);
				if (bUnique) {
					threeStar.push(xpath);
				}
			}

		}
		for (var i = 0; i < uniquesArr.length; i++) {
			if (!uniquesArr[i]) {
				var xpath = xpathContainsArr[i];
				var nodes = document.evaluate(xpath, document, null,
						XPathResult.ANY_TYPE, null);
				var counts = document.evaluate("count(" + xpath + ")",
						document, null, XPathResult.NUMBER_TYPE, null);
				if (counts.numberValue == 0) {
					oneStar.push(xpath);
				}
				var results = [], nodex;
				var index = 0;
				while (nodex = nodes.iterateNext()) {
					index++;
					if (nodex.isSameNode(node)) {
						xpathContainsArr[i] = "(" + xpath + ")[" + index + "]";
						oneStar.push("(" + xpath + ")[" + index + "]");
					}
				}
			}
		}
		var nodes = document.evaluate(firstXpath, document, null,
				XPathResult.ANY_TYPE, null);
		var counts = document.evaluate("count(" + firstXpath + ")", document,
				null, XPathResult.NUMBER_TYPE, null);
		if (counts.numberValue > 1) {
			var results = [], nodex;
			var index = 0;
			while (nodex = nodes.iterateNext()) {
				index++;
				if (nodex.isSameNode(node)) {
					var tempXpath = "(" + firstXpath + ")[" + index + "]";
					if (xpathContainsArr.indexOf(tempXpath) == -1) {
						xpathContainsArr.unshift("(" + firstXpath + ")["
								+ index + "]");
						oneStar.unshift("(" + firstXpath + ")[" + index + "]");
						uniquesArr.unshift(false);
					}
				}
			}
		} else {
			if (xpathContainsArr.indexOf(firstXpath) == -1) {
				xpathContainsArr.unshift(firstXpath);
				uniquesArr.unshift(true);
				if (firstXpath != undefined) {

					var id = firstXpath.split("@")[1].startsWith("id");
					var href = firstXpath.split("@")[1].startsWith("href");
					var src = firstXpath.split("@")[1].startsWith("src");

					if ((id == false) && (href == false) && (src == false)
							&& (firstXpath.indexOf("http") === -1)) {
						threeStar.unshift(firstXpath);
					} else {
						twoStar.unshift(firstXpath);
					}
				}
			}
		}

		var elementNm = tagName;
		if (nodeText != '') {
			elementNm = nodeText;
		}

		console.log('id--------' + id);
		console.log('name--------' + name);
		console.log('tag--------' + tagName);
		console.log('text--------' + nodeText);
		console.log('value--------' + value);
		console.log('class--------' + value);
		console.log('href--------' + href);
		console.log('src--------' + src);
		/*
		 * console.log('threeStar--------'+ threeStar);
		 * console.log('twoStar--------'+ twoStar);
		 * console.log('oneStar--------'+ oneStar);
		 * console.log('iFrameUrl--------'+ iFrameUrl);
		 * console.log('isInIFrameFlag--------'+ isInIFrameFlag);
		 * console.log('idOrNames--------'+ idOrNames);
		 * console.log('pageTitle--------'+ pageTitle);
		 * console.log('xpathContainsArr--------'+ xpathContainsArr);
		 * console.log('uniquesArr--------'+ uniquesArr);
		 * console.log('name--------'+ name); console.log('value--------'+
		 * value); console.log('locator--------'+ locator);
		 * console.log('xpathContains--------'+ xpathContains);
		 * console.log('xpathEquals--------'+ xpathEquals);
		 * console.log('firstXpath--------'+ firstXpath);
		 * console.log('idOrNames--------'+ idOrNames);
		 * console.log('iFrameIdOrName--------'+ iFrameIdOrName);
		 * console.log('isInIFrameFlag--------'+ isInIFrameFlag);
		 * console.log('iFrameIdOrName--------'+ iFrameIdOrName);
		 * console.log('resultArrays--------'+ resultArrays);
		 */
		
	}

	console.log('----------get element xpath end----------------------');

	/*resInfo = {
		"elementNm" : elementNm,
		"xpathEquals" : xpathEquals,
		"firstXpath" : firstXpath,
		"xpathContains" : xpathContains,
		"iFrameUrl" : iFrameUrl,
		"isInIFrameFlag" : isInIFrameFlag
	}*/
	
	 resInfo['elementNm'] = elementNm;
	 resInfo['xpathEquals'] = xpathEquals;
	 resInfo['firstXpath'] = firstXpath;
	 resInfo['xpathContains'] = xpathContains;
	 resInfo['iFrameUrl'] = iFrameUrl;
	 resInfo['isInIFrameFlag'] = isInIFrameFlag;

	return resInfo;
}

function getX(event){
console.log('----------start get element xpath----------------------');
		var node=event.target 
		return getXbyNode(node);
};

$(document).ready(function(){ 
	window.addEventListener('message', function(e){
		console.log("-------------" +  e.data.act + "-------------");
		if (e.data.act == 'getElementInfo') {
			var resultElementInfo ="test001";
			var types = e.data.msg.types;
			console.log("-------------" +  types + "-------------");
			var resultElementInfo = getPageEles(types);
			
			var data = {
				act: 'resultElementInfo',
				msg: {
					 result:resultElementInfo
					}
			};
			window.top.postMessage(data,'*');
			console.log("-------------已发送,data:" + resultElementInfo + "-------------")
	    } //else {
		//	console.log('未定义的消息: '+ e.data.act);
	   // }
	}, false);
});

