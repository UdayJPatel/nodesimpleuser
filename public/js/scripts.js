'use strict';
/*
function _dump_toggle_row(element){
	if( element.style['font-style'] != 'italic' ){
		element.style['font-style'] = 'italic';
		element.nextSibling.children[0].style.display = "none";
		element.nextSibling.style['backgroundColor'] = window.getComputedStyle(element).getPropertyValue('border-bottom-color');
	}
	else{
		element.style['font-style'] = 'normal';
		element.nextSibling.children[0].style.display = "block";
		element.nextSibling.style['backgroundColor'] = null;
	}
}
*/

/*
Start JQUERY
*/
$(function(){

	//when you click on key column of the debug table
	$(".dumpObject .key").click(function(){
		var nextTd = $(this).next('td');
		var parentTableClass = $(this).closest('table');

		var bgClass = 'bgdarkblue';
		if( $(parentTableClass).hasClass('dumpArray') ){
			bgClass = 'bgdarkgreen';
		}

		//if current key has italics class - means its already hidden - unhide it
		if( $(this).hasClass('italics') ){
			$(this).removeClass('italics');
			$(nextTd).removeClass(bgClass);
			$(nextTd).find('div').show();
		}
		else{
			$(this).addClass('italics');
			$(nextTd).addClass(bgClass);
			$(nextTd).find('div').hide();
		}

	});
});

