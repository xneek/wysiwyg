; "use strict";
/*EWysiwyg*/
EWysiwyg = (function(window){
	var IE = '\v' == 'v';

	
	
	function addHTML(el) {
		var sel, range;
		if (window.getSelection) {
			sel = window.getSelection();
			if (sel.getRangeAt && sel.rangeCount) {
				range = sel.getRangeAt(0);
				range.deleteContents();
				range.insertNode(el);
				range = range.cloneRange();
				range.setStartAfter(el);
				range.collapse(true);
				sel.removeAllRanges();
				sel.addRange(range);	
			}
		} else if (document.selection && document.selection.type != "Control") {
			document.selection.createRange().pasteHTML(el.outerHTML);
		}
	}
	

	var callAction = function(cmd, params){
	

	
		switch(cmd){
			case 'createLink':

				if(params && params.linkInput){
					params.linkInput( (IE ? window.selection.createRange() : window.getSelection().getRangeAt(0)), function(el){ addHTML(el); })
				} else {
					var s = prompt('Enter link','http://');
					var link = document.createElement('a');
						link.href= s;
						link.appendChild(document.createTextNode(s));
						addHTML(link);
				}

			break;
			
			case 'insertImage':

				if(params && params.imageInput){
					params.imageInput(function(el){ addHTML(el); })
				} else {
					var s = prompt('Enter image url','http://');
					var img = document.createElement('img');
						img.src= s; img.alt = "img";
						addHTML(img);
				}
				
			break;			
			
			default:
			document.execCommand(cmd, false, null);
		}
		
	}
	
	
	return function(editor, toolbar){
		this.selection = function(){
			return selection();
		},
		this.init = function(params){
			
			if(editor){
				editor.contentEditable = true;
				
				// Activation paste Images from clipboard
				editor.addEventListener( 'paste',  function(e){
					if(typeof e.clipboardData != 'undefined') {
					var copiedData = e.clipboardData.items[0];
					if(copiedData.type.indexOf("image") == 0){
					  var imageFile = copiedData.getAsFile(); 
					  var reader = new FileReader();
					  reader.onload = function (evt) {
						var result = evt.target.result;
						var img = document.createElement("img");
							img.src = result;
							addHTML(img);
						};
						reader.readAsDataURL(imageFile);
					}
				  }
				}, false);
			}
			if(toolbar){
				var toolbarA = toolbar.getElementsByTagName('a');
				for( var i = 0, l = toolbarA.length; i<l; i++){
					if(toolbarA[i].hasAttribute('action')){
					  if(IE){
						toolbarA[i].attachEvent( 'onclick', function(event){
							if (event.preventDefault) { event.preventDefault(); } else { event.returnValue = false; }
							callAction(this.getAttribute('action'), params);
						});
					  } else {
						toolbarA[i].addEventListener( 'click',  function(event){
							if (event.preventDefault) { event.preventDefault(); } else { event.returnValue = false; }
							callAction(this.getAttribute('action'), params);
						}, false);
					  }
					}
					
				}
			}
			
		}
	
	}

})(window)
