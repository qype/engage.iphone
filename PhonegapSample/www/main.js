/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 Copyright (c) 2012, Janrain, Inc.

 All rights reserved.

 Redistribution and use in source and binary forms, with or without modification,
 are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation and/or
   other materials provided with the distribution.
 * Neither the name of the Janrain, Inc. nor the names of its
   contributors may be used to endorse or promote products derived from this
   software without specific prior written permission.


 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
 ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

 File:   main.js
 Author: Lilli Szafranski - lilli@janrain.com, lillialexis@gmail.com
 Date:   Wednesday, January 4th, 2012
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

var jrEngage;
function testJREngagePlugin()
{
    jrEngage.print
    (
        ["HelloxWorld"],

        function(result)
        {
            alert("Success: "+result);
        },

        function(error)
        {
            alert("Error: "+error);
        }
    );
}

function onBodyLoad()
{
    document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady()
{
    jrEngage = window.plugins.jrEngagePlugin;

    var appId    = "appcfamhnpkagijaeinl";
    var tokenUrl = "http://jrauthenticate.appspot.com/login";

    jrEngage.initialize(
        appId,
        tokenUrl,

        function(result)
        {
           var jsonBlob = decodeURIComponent(result);
           console.log(jsonBlob);
        },

        function(error)
        {
           var jsonBlob = decodeURIComponent(error);
           console.log(jsonBlob);
        }
    );
}

function addValueToRowInTable(value, table, baseClassAttr, indentationClassAttr)
{
    var row      = document.createElement("tr");
    var cell     = document.createElement("td");
    var textNode = document.createTextNode(value);

    if (baseClassAttr) {
        row.className += baseClassAttr;
    }

    if (indentationClassAttr) {
        cell.className += indentationClassAttr;
    }

    if (baseClassAttr != "keyRow") {
        var div = document.createElement("div");
        div.className += "ellipsize";

        var nobr = document.createElement("nobr");

        nobr.appendChild(textNode);
        div.appendChild(nobr);

        cell.appendChild(div);
    } else {
        cell.appendChild(textNode);
    }

    row.appendChild(cell);
    table.appendChild(row);
}

function updateTables(resultDictionary)
{
    // TODO: Unhide the tables...

    var code = resultDictionary.code;

    if (code == jrEngage.FOO)
    {
        alert("FOO");
    }


    addValueToRowInTable(resultDictionary.provider, document.getElementById("providerTable"), "singleRow", "levelOne");
    addValueToRowInTable(resultDictionary.tokenUrl, document.getElementById("tokenUrlTable"), "singleRow", "levelOne");

    var profile = resultDictionary.auth_info.profile;

    console.log(profile);

    var profileTable = document.getElementById("profileTable");

    for (var key in profile) {
        if (profile.hasOwnProperty(key)) {

            addValueToRowInTable(key, profileTable, "keyRow", "levelOne");

         /* Yeah, yeah, should be recursive, but for now the auth_info profile
            is only ever two levels deep */
            if (profile[key] && typeof profile[key] === 'object') {
                var subobject = profile[key];
                for (var subkey in subobject) {
                    if (subobject.hasOwnProperty(subkey)) {
                        addValueToRowInTable(subkey, profileTable, "keyRow", "levelTwo");
                        addValueToRowInTable(subobject[subkey], profileTable, "valueRow", "levelTwo");
                    }
                }
            } else {
                addValueToRowInTable(profile[key], profileTable, "valueRow", "levelOne");
            }
        }
    }
}

function handleAuthenticationResult(resultDictionary)
{
    var stat    = resultDictionary.stat;
    var payload = resultDictionary.payload;

    // TODO: Check the stat to make sure it's ok
    // TODO: Do something with the payload
    updateTables(resultDictionary);
}

function configurationError(code, message)
{

}

function authenticationError(code, message)
{

}

function handleAuthenticationError(errorDictionary)
{
    var code    = errorDictionary.code;
    var message = errorDictionary.message;

    if (code == jrEngage.JRUrlError) {
        configurationError(code, message);
    } else if (code == jrEngage.JRDataParsingError) {
        configurationError(code, message);
    } else if (code == jrEngage.JRJsonError) {
        configurationError(code, message);
    } else if (code == jrEngage.JRConfigurationInformationError) {
        configurationError(code, message);
    } else if (code == jrEngage.JRSessionDataFinishGetProvidersError) {
        configurationError(code, message);
    } else if (code == jrEngage.JRDialogShowingError) {
        configurationError(code, message);
    } else if (code == jrEngage.JRProviderNotConfiguredError) {
        configurationError(code, message);
    } else if (code == jrEngage.JRAuthenticationFailedError) {
        authenticationError(code, message);
    } else if (code == jrEngage.JRAuthenticationTokenUrlFailedError) {
        authenticationError(code, message);
    }
}

function showAuthenticationDialog()
{
    // TODO: Remove children elements from the tables...
    // TODO: Hide the tables...

    jrEngage.showAuthentication(
        function(result)
        {
            var jsonBlob         = decodeURIComponent(result);
            var resultDictionary = JSON.parse(jsonBlob);

            console.log(jsonBlob);

            handleAuthenticationResult(resultDictionary);
        },

        function(error)
        {
            var jsonBlob        = decodeURIComponent(error);
            var errorDictionary = JSON.parse(jsonBlob);

            console.log(jsonBlob);

            handleAuthenticationError(errorDictionary);
        }
    );
}
