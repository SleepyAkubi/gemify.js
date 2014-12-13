var selected = [];
var id = 0;

var buttonHolder = document.createElement('div')
buttonHolder.className = "flipthis-wrapper"

var initButton = document.createElement('a');

initButton.setAttribute("href", "javascript:init()")
initButton.className = "btn_small btn_green_white_innerfade";

iBDiv = document.createElement('div');
iBDiv.className = "flipthis-wrapper"

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
		var orig = buttons[i].getAttribute("href")
		buttons[i].setAttribute("id", id)
		buttons[i].setAttribute("onclick", "selectItem(\"" + orig + "\", " + id + ")")
		id = id + 1;

	}
}

function gemifySelected()
{
	initButton.setAttribute("href", "")
	span.innerHTML = "Gemifying..."
	for(var i = 0; i < selected.length; i++)
	{
		GrindIntoGooNoMess(267420, 6, selected[i].substring(7));
		if(i == selected.length - 1)
		{
			location.reload();
		}
		//console.log("GrindIntoGoo(267420, 6," + "\'" + selected[i].substring(7) + "\');")
	}
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

function selectItem(originalTag, id)
{
	var button = document.getElementById(id);
	button.parentNode.parentNode.style.boxSizing = 'border-box';

	if(originalTag.substring(0, 7) !=  "#753_6_")
	{
		return false;
	}
	for(var i = 0; i < selected.length; i++)
	{
		if(selected[i] == originalTag)
		{
			var index = selected.indexOf(i);
			selected.splice(index, 1);
			button.parentNode.parentNode.style.border = '';
			return false;
		}
	}
	selected.push(originalTag)
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