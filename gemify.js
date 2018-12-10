/* 
©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©
COPYRIGHT 2014 - THE WARP DIMENSION STUDIOS
©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©

You may redistribute this software.
You may not sell this software.
You may edit this software providing you give credit to the original.
You may use this software commercially.
You must include this notice in all versions of the software if edited.

Special thanks to contributor:
* srabouin 

*/

var selected = [], appids = [], contextids = [], numDone = 0, errCount = [], id = 0, introMsg =
"<h2>Welcome to gemify.js</h2>\n\
<h1>gemify.js is a script to aid in the gemification of items.</h1><br>\n\
\n\
<p><strong>Instructions:</strong></p>\n\
<p>1. Press the \'Gemify Multiple\' button, to start the selection process.</p>\n\
<p>2. Select the items you wish (the selected items will be highlighted in a <strong style=\'color: red\'>red</strong> border).</p>\n\
<p>3. Press the \'Gemify Selections\' button</p>\n\
<p>4. Wait for it to refresh your inventory (or error)</p>\n\
\n\
<p>I hope you enjoy using gemify.js.</p>\n\
<p>Boncey and the pull request people.</p>";

function Button(colour, text, onclick, place)
{
	var buttonHolder = document.createElement('div');
	buttonHolder.className = "flipthis-wrapper";

	var initButton = document.createElement('a');

	initButton.setAttribute("href", "javascript:" + onclick + "()");

	iBDiv = document.createElement('div');

	if (colour == "green") {
		iBDiv.className = "btn_small btn_green_white_innerfade";
	} else {
		iBDiv.className = "btn_small btn_grey_white_innerfade";
	}

	span = document.createElement('span');
	span.innerHTML = text;
	span.className = "";
	iBDiv.appendChild(span);

	initButton.appendChild(iBDiv);

	buttonHolder.appendChild(initButton);

	var row = document.getElementsByClassName(place);
	row[0].appendChild(buttonHolder);

	this.setText = function(newText) {
		span.innerHTML = newText;
	};
	this.setClick = function(clickFunc) {
		initButton.setAttribute("href", "javascript:" + clickFunc + "();");
	};	
	this.remove = function() {
		buttonHolder.parentNode.removeChild(buttonHolder);
		initButton.parentNode.removeChild(initButton);
		iBDiv.parentNode.removeChild(iBDiv);
		span.parentNode.removeChild(span);
	};
}

gemifyButton = new Button("green", "Gemify Multiple", "init", "filter_ctn inventory_filters");



ShowAlertDialog( "gemify.js", introMsg );

function init()
{
	gemifyButton.setText("Gemify Selections");
	gemifyButton.setClick("gemifySelected");

	var buttons = document.getElementsByClassName("inventory_item_link");
	for (var i = 0; i < buttons.length; i++) {	
		setTimeout(setupLoop(i, buttons), 1000);
	}
}

function setupLoop(i, buttons)
{
	var orig = buttons[i].getAttribute("href");
	if(orig.substring(0, 7) ==  "#753_6_")
	{
			buttons[i].setAttribute("id", id);
			item = ReadInventoryHash( orig );

			buttons[i].setAttribute("onclick", "selectItem(\"" + item.appid + "\", " + item.contextid + ", " + item.assetid + ", " + id + ")");
			id = id + 1;
		}
}

function gemifySelected()
{
	gemifyButton.setClick("void");
	gemifyButton.setText("Gemifying...");
	if(selected.length === 0)
	{
		location.reload();
	}

	for(var i = 0; i < selected.length; i++)
	{
		setTimeout(doGoo(selected[i], appids[i], contextids[i], i), 1000);
		//console.log("GrindIntoGoo(267420, 6," + "\'" + selected[i].substring(7) + "\');")
	}
}

function doGoo(assetid, appid, contextid, i)
{
	GrindIntoGooNoMess(appid, contextid, assetid);
}

function GrindIntoGooNoMess( appid, contextid, itemid )
	{
		var rgAJAXParams = {
			sessionid: g_sessionID,
			appid: appid,
			assetid: itemid,
			contextid: contextid
		};
		var strActionURL = g_strProfileURL + "/ajaxgetgoovalue/";

		$J.get( strActionURL, rgAJAXParams ).done( function( data ) {
			var $Content = $J(data.strHTML);
			var strDialogTitle = data.strTitle;
				strActionURL = g_strProfileURL + "/ajaxgrindintogoo/";
				rgAJAXParams.goo_value_expected = data.goo_value;

				$J.post( strActionURL, rgAJAXParams).done( function( data ) {
			        numDone = numDone + 1;
					var elem = document.getElementById("753_" + contextid + "_" + itemid);
					elem.parentNode.style.opacity = '0.3';
					if(numDone == selected.length) {
					  UserYou.ReloadInventory(753, 6);
					  gemifyButton.remove();
					}
				}).fail( function() {
					if(errCount[itemid] > 4){
					ShowAlertDialog( strDialogTitle, 'There was an error connecting to the network after attempting 5 times!' );
					} else {
						setTimeout(GrindIntoGooNoMess(appid, contextid, itemid), 1000);
					}
					++errCount[itemid];
				});
		}).fail( function() {
			setTimeout(GrindIntoGooNoMess(appid, contextid, itemid), 1000);
			if(errCount[itemid] > 4){
				ShowAlertDialog( strDialogTitle, 'There was an error connecting to the network after attempting 5 times!' );
			} else {
				setTimeout(GrindIntoGooNoMess(appid, contextid, itemid), 1000);
			}
			++errCount[itemid];
		});
	}

function selectItem(appid, contextid, assetid, id)
{
	var button = document.getElementById(id);
	button.parentNode.parentNode.style.boxSizing = 'border-box';

	for(var i = 0; i < selected.length; i++)
	{
		if(selected[i] == assetid)
		{
			var index = selected.indexOf(i);
			selected.splice(index, 1);
			appids.splice(index, 1);
			contextids.splice(index, 1);


			button.parentNode.parentNode.style.border = '';
			return false;
		}
	}
	selected.push(assetid);
	contextids.push(contextid);
	appids.push((g_ActiveInventory.selectedItem.description.market_hash_name.match(/^([0-9]+)-/) || [])[1]);
	button.parentNode.parentNode.style.border = '2px dashed red';
}

function getAllElementsWithAttribute(attribute)
{
  var matchingElements = [];
  var allElements = document.getElementsByTagName('*');
  for (var i = 0, n = allElements.length; i < n; i++)
  {
    if (allElements[i].getAttribute(attribute))
    {
      // Element exists with attribute. Add to array.
      matchingElements.push(allElements[i]);
    }
  }
  return matchingElements;
}
