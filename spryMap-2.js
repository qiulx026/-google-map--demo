/*
<beginLegalBanter>
The MIT License (MIT)
Copyright (c) 2011 Charlie Andrews
Small fixes made by Slawomir Jasinski - now is working on IE

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
</endLegalBanter>
  
Usage:
var map = new SpryMap({
   // The ID of the element being transformed into a map
   id : ""
   });
*/
function SpryMap(param) {
    /**
     * Name:        MoveMap()
     * Description: Function that moves the map to a given X and Y offset.
     *              Note that the function takes into account locked edges in the
     *              map.
     * Parameters:  x - The new x offset of the map
     *              y - The new y offset of the map
     */
    function MoveMap(x, y) {
        var newX = x, newY = y;        
            var rightEdge = -m.map.offsetWidth + m.viewingBox.offsetWidth,
                topEdge = -m.map.offsetHeight + m.viewingBox.offsetHeight;
            newX = newX < rightEdge ? rightEdge : newX;
            newY = newY < topEdge ? topEdge : newY;
            newX = newX > 0 ? 0 : newX;
            newY = newY > 0 ? 0 : newY;
		if(flag==0){
			if(newX < rightEdge + 300){
				
				console.log("loading map******************",newX,"<",rightEdge+300);
				
				var canvas = document.getElementById('worldMap');
				var buffer = document.getElementById('buffer');
				var w = "8000";
				var h = "4000";
				buffer.width = w;
				buffer.height = h;
				buffer.getContext('2d').drawImage(canvas, 0, 0);
				canvas.width = w;
				canvas.height = h;
				canvas.getContext('2d').drawImage(buffer, 0, 0);
				getdata("3");
				flag=1;
			}
		
		}
        
        m.map.style.left = newX + "px";
        m.map.style.top = newY + "px";
    }
    
    /**
     * Name:        AddListener()
     * Description: Adds an event listener to the specified element.
     * Parameters:  element - The element for which the listener is being added
     *              event - The event for which the listener is being added
     *              f - The function being called each time that the event occurs
     */
    function AddListener(element, event, f) {
        if(element.attachEvent) {
            element["e" + event + f] = f;
            element[event + f] = function () {
                element["e" + event + f](window.event)
            };
            element.attachEvent("on" + event, element[event + f])
        } else element.addEventListener(event, f, false)
    }
    
    function Coordinate(startX, startY) {
        this.x = startX;
        this.y = startY;
    }
    
    var m = this;
    m.map = document.getElementById(param.id);

    m.hoverCursor = param.hoverCursor || "auto";    // If you prefer, the "open hand" style is: "url(data:image/vnd.microsoft.icon;base64,AAACAAEAICACAAgACAAwAQAAFgAAACgAAAAgAAAAQAAAAAEAAQAAAAAAAAEAAAAAAAAAAAAAAgAAAAAAAAAAAAAA////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD8AAAA/AAAAfwAAAP+AAAH/gAAB/8AAA//AAAd/wAAGf+AAAH9gAADbYAAA2yAAAZsAAAGbAAAAGAAAAAAAAA//////////////////////////////////////////////////////////////////////////////////////gH///4B///8Af//+AD///AA///wAH//4AB//8AAf//AAD//5AA///gAP//4AD//8AF///AB///5A////5///8=), default"
    m.dragCursor = param.dragCursor || "url(data:image/vnd.microsoft.icon;base64,AAACAAEAICACAAcABQAwAQAAFgAAACgAAAAgAAAAQAAAAAEAAQAAAAAAAAEAAAAAAAAAAAAAAgAAAAAAAAAAAAAA////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD8AAAA/AAAAfwAAAP+AAAH/gAAB/8AAAH/AAAB/wAAA/0AAANsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//////////////////////////////////////////////////////////////////////////////////////gH///4B///8Af//+AD///AA///wAH//+AB///wAf//4AH//+AD///yT/////////////////////////////8=), default";

    //m.lockEdges = typeof param.lockEdges == "undefined" ? true : param.lockEdges;
    m.viewingBox = document.createElement("div");
    //if (typeof param.cssClass != "undefined") m.viewingBox.className = param.cssClass;
    m.viewingBox.style.cursor = m.hoverCursor;
    m.mousePosition = new Coordinate;

    m.mouseDown = false;
    m.map.parentNode.replaceChild(m.viewingBox, m.map);
    m.viewingBox.appendChild(m.map);
    m.viewingBox.style.overflow = "hidden";
    m.viewingBox.style.width = "100%";
    m.viewingBox.style.height = "100%";
    m.viewingBox.style.position = "relative";
    m.map.style.position = "absolute";
    //MoveMap(typeof param.startX == "undefined" ? 0 : -param.startX, typeof param.startY == "undefined" ? 0 : -param.startY);
	MoveMap(0,0);
    /**
     * Name:        MouseMove()
     * Description: Function called every time that the mouse moves
     */
    var MouseMove = function (b) {
        var e = b.clientX - m.mousePosition.x + parseInt(m.map.style.left),
            d = b.clientY - m.mousePosition.y + parseInt(m.map.style.top);
		console.log(b.clientX,m.mousePosition.x,e,b.clientY,m.mousePosition.y,d);
        MoveMap(e, d);
        m.mousePosition.x = b.clientX;
        m.mousePosition.y = b.clientY
    };

    /**
     * mousedown event handler
     */
    AddListener(m.viewingBox, "mousedown", function (e) {
        m.viewingBox.style.cursor = m.dragCursor;

        // Save the current mouse position so we can later find how far the
        // mouse has moved in order to scroll that distance
        m.mousePosition.x = e.clientX;
        m.mousePosition.y = e.clientY;

        // Start paying attention to when the mouse moves
        AddListener(document, "mousemove", MouseMove);
        m.mouseDown = true;
        
        event.preventDefault ? event.preventDefault() : event.returnValue = false;
    });

    /**
     * mouseup event handler
     */
    AddListener(document, "mouseup", function () {
        if(m.mouseDown) {
            var handler = MouseMove;
            if(document.detachEvent) {
                document.detachEvent("onmousemove", document["mousemove" + handler]);
                document["mousemove" + handler] = null;
            } else {
                document.removeEventListener("mousemove", handler, false);
            }
            
            m.mouseDown = false;
             
        }
        
        m.viewingBox.style.cursor = m.hoverCursor;
    });
};