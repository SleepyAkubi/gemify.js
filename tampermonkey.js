// ==UserScript==
// @name         Gemify
// @version      1.0
// @description  Tool to aid in the gemification of items
// @author       The Warp Dimension Studios and Xxmarijnw
// @include      *steamcommunity.com/*/inventory*
// @supportURL   https://steamcommunity.com/profiles/76561198179914647
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// ==/UserScript==

(function() {
    'use strict';

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

    if(g_steamID == g_ActiveInventory.m_steamid) {

        var selected = [], appids = [], contextids = [], numDone = 0, errCount = [], id = 0;

        function Button(colour, text, place)
        {
            var buttonHolder = document.createElement('div');
            buttonHolder.className = "flipthis-wrapper";

            var initButton = document.createElement('a');

            initButton.setAttribute("class", "gemifySelect");

            var iBDiv = document.createElement('div');

            if (colour == "green") {
                iBDiv.className = "btn_small btn_green_white_innerfade";
            } else {
                iBDiv.className = "btn_small btn_grey_white_innerfade";
            }

            var span = document.createElement('span');
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
            this.setClass = function(clickFunc) {
                initButton.setAttribute("class", clickFunc);
            };
            this.remove = function() {
                buttonHolder.parentNode.removeChild(buttonHolder);
                initButton.parentNode.removeChild(initButton);
                iBDiv.parentNode.removeChild(iBDiv);
                span.parentNode.removeChild(span);
            };
        }

        var gemifyButton = new Button("green", "Gemify Multiple", "filter_ctn inventory_filters");

        var clicked = 0;
        $J(".gemifySelect").click(function() {
            if(clicked == 0) {
                gemifyButton.setText("Gemify Selections");
                clicked = 1;
            } else if(clicked == 1) {
                gemifySelected();
                clicked = 2;
            }
        });

        $J(".item").click(function() {
            var orig = $J(this).find("a").attr("href");

            if(orig.substring(0, 7) == "#753_6_")
            {
                var item = ReadInventoryHash( orig );

                var contextid = item.contextid;
                var assetid = item.assetid;
                var id = $J(this).find("a").attr("id");

                for(var i = 0; i < selected.length; i++) {
                    if(selected[i] == assetid) {
                        var index = selected.indexOf(i);
                        selected.splice(index, 1);
                        appids.splice(index, 1);
                        contextids.splice(index, 1);

                        this.parentNode.style.border = '';
                        this.parentNode.style.boxSizing = '';

                        return false;
                    }
                }

                selected.push(assetid);
                contextids.push(contextid);
                appids.push((g_ActiveInventory.selectedItem.description.market_hash_name.match(/^([0-9]+)-/) || [])[1]);

                this.parentNode.style.boxSizing = 'border-box';
                this.parentNode.style.border = '2px dashed red';
            }
        });

        function gemifySelected()
        {
            gemifyButton.setClass("gemifying");
            gemifyButton.setText("Gemifying...");
            if(selected.length === 0)
            {
                gemifyButton.setText("Nothing to gemify");
                throw new Error("Empty selected array");
            }

            for(var i = 0; i < selected.length; i++)
            {
                setTimeout(GrindIntoGooNoMess(appids[i], contextids[i], selected[i]), 500);
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
                    numDone = numDone + 1;
                    var elem = document.getElementById("753_" + contextid + "_" + itemid);
                    elem.parentNode.style.opacity = '0.3';
                    if(numDone == selected.length) {
                        UserYou.ReloadInventory(753, 6);
                        gemifyButton.remove();
                    }
                }).fail( function() {
                    if(errCount[itemid] > 10){
                        ShowAlertDialog( strDialogTitle, 'There was an error connecting to the network after attempting 10 times!' );
                    } else {
                        setTimeout(GrindIntoGooNoMess(appid, contextid, itemid), 500);
                    }
                    ++errCount[itemid];
                });
            }).fail( function() {
                setTimeout(GrindIntoGooNoMess(appid, contextid, itemid), 500);
                if(errCount[itemid] > 10){
                    ShowAlertDialog( strDialogTitle, 'There was an error connecting to the network after attempting 10 times!' );
                } else {
                    setTimeout(GrindIntoGooNoMess(appid, contextid, itemid), 500);
                }
                ++errCount[itemid];
            });
        }
    }
})();
