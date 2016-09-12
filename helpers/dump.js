/*
	Do coldfusion style dump of complex objects
*/

"use strict";

function dodiv(data,attr){return "<div" + attributeString(attr) + ">" + data + "</div>";}

function dotable(data,attr){return "<table" + attributeString(attr) + ">" + data + "</table>";}

function dothead(data,attr){return "<thead" + attributeString(attr) + ">" + data + "</thead>";}

function doth(data,attr){return "<th" + attributeString(attr) + ">" + data + "</th>";}

function dotbody(data,attr){return "<tbody" + attributeString(attr) + ">" + data + "</tbody>";}

function dotr(data,attr){return "<tr" + attributeString(attr) + ">" + data + "</tr>";}

function dotd(data,attr){return "<td" + attributeString(attr) + ">" + data + "</td>";}

function attributeString(jObj){
	var htmlString = "";
	for(var key in jObj){
		htmlString += " " + key + '="'+jObj[key]+'"';
	}
	return htmlString;
}

function isTypeOf(objName){
	if(objName instanceof(Array)) {return "Array";}
	if(objName instanceof(Function)) {return "Function";}
	if(objName instanceof(Object)) {return "Object";}

	//this will return primitive types : string, number, boolean
	return typeof(objName);
}

var styles = "<style type='text/css'>";
			styles += "table._dumpobject, table._dumparray{font-size: xx-small;font-family: verdana,arial,helvetica,sans-serif;}";
			styles += "table._dumpobject > tbody > tr > td, table._dumparray > tbody > tr > td{padding:3px;}";
			styles += "table._dumpobject > thead > tr > th, table._dumparray > thead > tr > th{padding:5px;}";
			styles += "table._dumpobject > tbody > tr > .key, table._dumparray > tbody > tr > .key{cursor: pointer;}";
			styles += "table._dumpobject > thead > tr > th{background-color: #4444CC;border:2px solid #0000CC;color:#ffffff;}";
			styles += "table._dumpobject > tbody > tr > td{border:2px solid #0000CC;}";
			styles += "table._dumpobject > tbody > tr > .key{background-color: #CCDDFF;}";
			styles += "table._dumparray > thead > tr > th{background-color: #009900;border:2px solid #006600;color:#ffffff;}";
			styles += "table._dumparray > tbody > tr > td{border:2px solid #006600;}";
			styles += "table._dumparray > tbody > tr > .key{background-color: #CCFFCC;}";
			styles += "</style>";

var dumpScript = "<script type='text/javascript'>";
	dumpScript += "function _dump_toggle_row(element){";
	dumpScript += "if( element.style['font-style'] != 'italic' ){";
	dumpScript += 	"element.style['font-style'] = 'italic';";
	dumpScript += 	"element.nextSibling.children[0].style.display = 'none';";
	dumpScript += 	"element.nextSibling.style['backgroundColor'] = window.getComputedStyle(element).getPropertyValue('border-bottom-color');";
	dumpScript += "}";
	dumpScript += "else{";
	dumpScript += 	"element.style['font-style'] = 'normal';";
	dumpScript += 	"element.nextSibling.children[0].style.display = 'block';";
	dumpScript += 	"element.nextSibling.style['backgroundColor'] = null;";
	dumpScript += "}";
	dumpScript += "}";
	dumpScript += "</script>";

var Dump = function(options){

	options = options || {};

	//Terminate if the loop limit goes beyond this value
	options.loopLimit  = options.loopLimit || 5000;

	//For nested objectes how many levels deep you want to go
	options.levelLimit  = options.levelLimit ||  5;

	//if you want to print keys that are function
	options.printFunction = options.printFunction || 0;

	// to keep track of loop counts - exit if it exceeds loopLimit so we dont get heap full error
	options.loopCounter = 1;

	//cache dumped keys so we dont dump them again - this is to avoid circular reference
	options.cached = [];

	function dumpObj(obj,args){

		var label 				= (args && args.label) ? args.label : 'Label';
		var level 				= (args && args.level) ? args.level : 1;
		var parents 			= (args && args.parents) ? args.parents : "";
		var trs = "";
		var keyValue = "";
		var keyValueType = "";

		var theadstring = dothead(
									dotr(
											doth(
													isTypeOf(obj) + ' - ' + label,
													{colspan:2}
												)
										)
								);

		for( var key in obj ){
			keyValue = obj[key];
			keyValueType = isTypeOf(keyValue).toLowerCase();

			options.loopCounter++;
			if(options.loopCounter > options.loopLimit){break;}

			if(level > options.levelLimit){
				continue;
			}

			var keyCrumb = parents !== '' ? parents + '.' + key : '';

			var tdString = dotd(key, {"title" : "path: " + keyCrumb, "class" : "key","style" : "cursor:pointer;", "onClick" : "_dump_toggle_row(this)" });

			try{
				switch(keyValueType){
					case "string": case "boolean": case "number":
						tdString += dotd( dodiv(keyValue) );
						break;

					case "function":
						if( !options.printFunction ){
							continue;
						}
						tdString += dotd( dodiv( keyValue.toString() ) );
						break;

					case "object": case "array":
						if( keyValueType === 'object' ) {
							options.cached.push(key + ' - ' + (parents === '' ? key : parents + '.' + key) );
						}
						tdString += dotd( dodiv( dumpObj(keyValue,
															{
																"level":level+1,
																"parents" : parents === '' ? key : parents + '.' + key
															}
														)
												)
										);
						break;

					case "undefined":
						tdString += dotd( dodiv( 'undefined' ) );
						break;

					default:
						tdString += dotd( dodiv('unknown type ('+keyValueType+')') );
						break;
				}
			}
			catch(e){
				tdString += dotd( dodiv( e.toString(), { class : "red" } ) );
			}
			trs += dotr(tdString);
		}

		var tbodyString = dotbody(trs);
		return dotable( theadstring + tbodyString, { class : "_dump" + isTypeOf(obj).toLowerCase() } );
	}

	return {
		init : function(args){
			for(var key in args){
				options[key] = args[key];
			}
		},

		//return key value from options
		get : function(optionName){
			return options[optionName];
		},

		/*
		obj = complex object
		options = {
			label : labelName,
		}
		*/
		dump : function(obj,args){
			options.loopCounter = 1;
			options.cached = [];
			options.parents = "";
			return styles + dumpScript + dodiv( dumpObj(obj,args) );
		}
	};

};

module.exports = new Dump();

