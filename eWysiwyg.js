; "use strict";
/*EWysiwyg*/
function EWysiwyg( editor, toolbar ){

	var IE = '\v' == 'v';
	this._getSelection = function() {
		if (window.getSelection) {
			sel = window.getSelection();
			if (sel.getRangeAt && sel.rangeCount) {
				return sel.getRangeAt(0);
			}
		} else if (document.selection && document.selection.createRange) {
			return document.selection.createRange();
		}
		return null;
	}

	this._restoreSelection = function(range) {
		if (range) {
			if (window.getSelection) {
				sel = window.getSelection();
				sel.removeAllRanges();
				sel.addRange(range);
			} else if (document.selection && range.select) {
				range.select();
			}
		}
	}
	
	this.pasteHTML = function(el) {
		var sel, range, zwsp = document.createTextNode("\u200B")
		if (window.getSelection) {
			var selection = window.getSelection();
			if (selection.getRangeAt && selection.rangeCount ) {
			  var selection = window.getSelection();
			  var range = selection.getRangeAt(0);

				if(range && range.startContainer.parentNode == editor){

					range.deleteContents();
					range.insertNode(el);
					range.setStartAfter(el);
					range.setEndAfter(el);
					selection.removeAllRanges();
					selection.addRange(range);

				} else {
					editor.appendChild(el)
				}
			  return false;
			} else {
				editor.appendChild(el)
			}
		} else if (document.selection && document.selection.type != "Control") {
		alert(1)
			document.selection.createRange().pasteHTML(el.outerHTML);
		} else {
			console.log('selection no found')
		}
	}

	this.callAction = function(cmd, customEvents){
		var th = this;
		if(customEvents && customEvents[cmd] && typeof(customEvents[cmd]) === 'function'){
			this.selection = this._getSelection();
			customEvents[cmd](function(el){
				th._restoreSelection(th.selection);
				th.pasteHTML(el);
			}, this.selection?this.selection.toString():'', this.selection?this.selection.cloneContents():[])
		} else {
			document.execCommand(cmd, false, null);
		}
	}

	this.selection = function(){
		return _getSelection();
	},
	this.init = function(params){
		var th = this;
		if(editor){
			editor.contentEditable = true;
			// Activation paste Images from clipboard
			editor.addEventListener( 'paste',  function(e){
				if(typeof e.clipboardData != 'undefined') {
				var copiedData = e.clipboardData.items[0];
				if(copiedData && copiedData.type && copiedData.type.indexOf("image") == 0){
				  var imageFile = copiedData.getAsFile(); 
				  var reader = new FileReader();
				  reader.onload = function (evt) {
					var result = evt.target.result;
					var img = document.createElement("img");
						img.src = result;
						th.pasteHTML(img);
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
						th.callAction(this.getAttribute('action'), params);
					});
				  } else {
					toolbarA[i].addEventListener( 'click',  function(event){
						if (event.preventDefault) { event.preventDefault(); } else { event.returnValue = false; }
						th.callAction(this.getAttribute('action'), params);
					}, false);
				  }
				}
				
			}
		}
		
	}
};
