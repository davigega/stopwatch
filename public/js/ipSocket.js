var ip;

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            //console.log(xmlHttp.responseText);
            ip = xmlHttp.responseText;
    }
    xmlHttp.open("GET", theUrl, false); // true for asynchronous
    xmlHttp.send(null);
}

httpGetAsync("/ip");
