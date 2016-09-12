// As of now this file is deprecated - variable dump ( which is json object to table ) has been moved to /helpers/dump module

/*
Print JSON in table format.
args = jsonObject
		,printFunction = [1 | 0] [ default = 0 ] -> 1 = print function

*/

"use strict";

function listToArray(list,del){
	del = del || ',';
	return list.split(del);
}

function isTypeOf(objName){
	if(objName instanceof(Array)) {return "Array";}
	if(objName instanceof(Function)) {return "Function";}
	if(objName instanceof(Object)) {return "Object";}

	//this will return primitive types : string, number, boolean
	return typeof(objName);
}

function jsonString(jObj){
	var htmlString = "";
	for(var key in jObj){
		htmlString += " " + key + '="'+jObj[key]+'"';
	}
	return htmlString;
}

// args should be typically json
// <td title="" class="key">action</td>
function genHtml(value,type,args){
	var htmlString = '';

	htmlString += "<" + type;

	if(args){
		htmlString += jsonString(args);
	}

	htmlString += ">";
	htmlString += value;
	htmlString += "</"+type+">";

	return htmlString;
}

function dump(jObj,options){
	// var className    	 = jObj.constructor.name;
	var label	 					= (options && options.label) 				? options.label 				: "label";

	//by default function is not printed
	var printFunction	 			= (options && options.printFunction) 		? options.printFunction 		: 0;

	// if you are printing function do you also want to print function body
	var printFunctionBody	 		= (options && options.printFunctionBody) 	? options.printFunctionBody 	: 0;
	var level        	 			= (options && options.level) 				? options.level 				: 1;
	var levelLimit       			= (options && options.levelLimit) 			? options.levelLimit 			: 4;
	var loopCounter  	 			= (options && options.loopCounter > 0) 		? options.loopCounter 			: 1;
	var parentKey    	 			= (options && options.parentKey) 			? options.parentKey 			: "";
	var keyCrumb 		 			= (options && options.keyCrumb) 			? options.keyCrumb 				: "";
	var loopLimit    	 			= 10000;
	var keyValue     	 			= "";

	var jObjType					= isTypeOf(jObj);

	var tblString    	 			= "";

	//if printFunctionBody is on printFunction is also on
	if( printFunctionBody ){printFunction = 1;}

	tblString += genHtml( 
		genHtml( label + " - " +jObjType,'th', {"colspan":"2"} ),
		'tr',
		{"class":jObjType.toLowerCase()}
	);

	for( var key in jObj ){
		keyValue = jObj[key];
		var keyValueType = isTypeOf(keyValue).toLowerCase();

		loopCounter++;
		if(loopCounter > loopLimit){break;}

		if(level > levelLimit){
			continue;
		}

		//if disradfunction is on skip
		if( keyValueType === 'function' && !printFunction ){
			continue;
		}

		var tdString = '';
		try {
			switch ( keyValueType ) {
				case "string": case "boolean":
					tdString += genHtml(key,'td',{"class":"key","title":keyCrumb});
					tdString += genHtml(genHtml(keyValue,'div'),'td');
					break;

				case "number":
					tdString += genHtml(key,'td',{"class":"key","title":keyCrumb});
					tdString += genHtml(genHtml(parseInt(keyValue),'div'),'td');
					break;

				case "function":
					tdString += genHtml(key,'td',{"class":"key","title":keyCrumb});
					// if print function is on discardfunction is ignored
					if( printFunctionBody ){
						tdString += genHtml(genHtml(keyValue.toString(),'div'),'td');
					}
					else{
						tdString += genHtml(genHtml('function','div'),'td');
					}
					break;

				case "object": case "array":
					tdString += genHtml(key,'td',{"class":"key","title":keyCrumb});
					tdString += genHtml( genHtml( 
											dump(keyValue,
											{
												level : level+1,
												levelLimit : levelLimit,
												printFunction : printFunction,
												printFunctionBody : printFunctionBody,
												loopCounter : loopCounter,
												parentKey : key, /* level 1 - level 2 */
												keyCrumb : keyCrumb + '->' + key
											}),'div' ),'td' );
					break;

				case "undefined":
					tdString += genHtml(key,'td',{"class":"key","title":keyCrumb});
					tdString += genHtml(genHtml('undefined','div'),'td');
					break;

				default:
					tdString += genHtml(key,'td',{"class":"key","title":keyCrumb});
					tdString += genHtml(genHtml('unknown type ('+keyValueType+')','div'),'td');
					break;
			}
		}
		catch(e) {
			tdString += genHtml(key,'td',{"class":"red key","title":keyCrumb});
			tdString += genHtml(genHtml(e.toString(),'div'),'td');
		}
		
		var trString = genHtml(tdString,'tr');
		tblString += trString;
	}
		
	tblString = genHtml(tblString,'table',{"class":"dump"+jObjType});
	return tblString;
}

exports.listToArray = listToArray;
exports.dump = dump;
exports.isTypeOf = isTypeOf;


