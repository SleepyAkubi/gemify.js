/* 
©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©
COPYRIGHT 2014 - THE WARP DIMENSION STUDIOS
©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©©

You may redistribute this software.
You may not sell this software.
You may edit this software providing you give credit to the original.
You may use this software commercially.

*/

var selected = [];
var appids = [];
var contextids = [];

var id = 0;

var buttonHolder = document.createElement('div')
buttonHolder.className = "flipthis-wrapper"

var initButton = document.createElement('a');

initButton.setAttribute("href", "javascript:init()")

iBDiv = document.createElement('div');
iBDiv.className = "btn_small btn_green_white_innerfade";

span = document.createElement('span')
span.innerHTML = "Gemify Multiple"
span.className = "";
iBDiv.appendChild(span);

initButton.appendChild(iBDiv);

buttonHolder.appendChild(initButton)

var row = document.getElementsByClassName("filter_ctn inventory_filters")
row[0].appendChild(buttonHolder)

function init()
{
	span.innerHTML = "Gemify Selections"
	initButton.setAttribute("href", "javascript:gemifySelected()")

	var buttons = document.getElementsByClassName("inventory_item_link")
	for (var i = 0; i < buttons.length; i++)
	{	
		setTimeout(setupLoop(i, buttons), 1000);
	}
}

function setupLoop(i, buttons)
{
	var orig = buttons[i].getAttribute("href")
	if(orig.substring(0, 7) ==  "#753_6_")
	{
			buttons[i].setAttribute("id", id)
			item = ReadInventoryHash( orig )

			buttons[i].setAttribute("onclick", "selectItem(\"" + item.appid + "\", " + item.contextid + ", " + item.assetid + ", " + id + ")")
			id = id + 1;
		}
}

function gemifySelected()
{
	initButton.setAttribute("href", "")

	if(selected.length == 0)
	{
		location.reload();
	}

	span.innerHTML = "Gemifying..."
	for(var i = 0; i < selected.length; i++)
	{
		setTimeout(doGoo(selected[i], appids[i], contextids[i], i), 1000);
		//console.log("GrindIntoGoo(267420, 6," + "\'" + selected[i].substring(7) + "\');")
	}
	location.reload();
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
				}).fail( function() {
					ShowAlertDialog( strDialogTitle, 'There was an error communicating with the network. Please try again later.' );
				});
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
	selected.push(assetid)
	contextids.push(contextid)
	appids.push(appid)
	button.parentNode.parentNode.style.border = '2px dashed red'
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