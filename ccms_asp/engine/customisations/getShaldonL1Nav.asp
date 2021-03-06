<%
function getShaldonL1Nav(nodelist,color){
  //showObject(nodelist)
  //map topnav items to images:
  
  try{
    //Response.Write("L1: using colour: " + color + "<br />");
    //set the global colour to cascade down:
    currColour = color;
    var out = '<table border="0" cellpadding="0" cellspacing="0" width="450">\n\t<tr>';    
    
    if(nodelist){  //nodelist may be false if the current page is at/near root
      for(var a=0;a<nodelist.length;a++){
        if(nodelist[a].isCurrentNode){
          out += '\t\t<td><a title="' + nodelist[a].getPage().linkText + '" href="ccms.asp?nodeid=' + nodelist[a].id + '"><img src="images/nav_buttons/' 
              + nodelist[a].getPage().name            //this is dependant on the image being present
              + '_' + color + '.jpg" border="0" alt="'    //this is dependant on correct color string being passed
              + nodelist[a].getPage().linkText + '" title="' + nodelist[a].getPage().linkText + '" height="20" /></a></td>\n';
        }
        else{
          out += '\t\t<td><a title="' + nodelist[a].getPage().linkText + '" href="ccms.asp?nodeid=' + nodelist[a].id + '"><img src="images/nav_buttons/' 
              + nodelist[a].getPage().name      //this is dependant on the image being present
              + '_white.jpg" border="0" alt="' + nodelist[a].getPage().linkText + '" title="' + nodelist[a].getPage().linkText + '" height="20" /></a></td>\n';
        }
      }
    }
    
    out += "\t</tr>\n</table>";
    return out;
  }
  catch(e){
    Response.Write("error in getShaldonL1Nav(): " + e.message);
    return "XX";
  }
}

function getShaldonL2Nav(nodelist){
  try{
    
    //determine the section we are in:
    //var dummyNode = nodelist[0]
    //colour = getSectionColour(dummyNode);
    //showObject(nodelist)
    //Response.Write("L2: using colour: " + colour + "<br />");
    //showObject(nodelist);
    var out = '';
    if(nodelist){ //nodelist may be false if the current page is at/near root
      var page;
      for(var a=0;a<nodelist.length;a++){
        page = new Page(nodelist[a].pageId);
        
        if(nodelist[a].isCurrentNode){
          /*
          we only actually need to return the colour if we are at level 2 or below: (there was an 
          odd bug where isCurrentNode was set again when I passed the first node to the below helper function)
          */
          colour = getSectionColour(nodelist[a]); 
          out += '<td class="hilite_' + colour + '"><a title="' + page.linkText + '" href="/ccms.asp?nodeid=' + nodelist[a].id + '" class="subnav">' + page.linkText + "</a></td>\n";
        }
        else{
          out += '<td><a title="' + page.linkText + '" href="/ccms.asp?nodeid=' + nodelist[a].id + '" class="subnav">' + page.linkText + "</a></td>\n";
        }
      }
    }
    return out;
  }
  catch(e){
    Response.Write("error in getShaldonL2Nav(): " + e.message);
    return "";
  }
}

function getShaldonL3Nav(nodelist){
  try{
    var out = '';
    if(nodelist){ //nodelist may be false if the current page is at/near root
      for(var a=0;a<nodelist.length;a++){
        page = new Page(nodelist[a].pageId);
        
        if(nodelist[a].isCurrentNode){
          out += '<span>' + page.linkText + "</span>";
        }
        else{
          out += '<a title="' + page.linkText + '" href="/ccms.asp?nodeid=' + nodelist[a].id + '" class="subnav">' + page.linkText + "</a>";
        }
      }
    }
    return out;
  }
  catch(e){
    Response.Write("error in getShaldonL3Nav(): " + e.message);
    return "";
  }
}


//utility function to get section colour:
function getSectionColour(node){
  try{
    var path = (new Navigation()).getBreadcrumb(node);

    var currSection = "";
    var currColour = "";
    var currPage;
    
    for(var a=0;a<path.length;a++){
      if(path[a].level == 1){
        currSection = (new Page(path[a].pageId)).name;
      }
    }

    switch(currSection){
      case "about":
        currColour = "green";
      break;
      
      case "conservation":
        currColour = "green";
      break;
      
      case "visit":
        currColour = "blue";
      break;
      
      case "helpus":
        currColour = "blue";
      break;
      
      case "animals":
        currColour = "brown";
      break;
      
      case "gifts":
        currColour = "brown";
      break;
    }
    //Response.Write("returning: "+currColour+"<br />");
    return currColour;
  }
  catch(e){
    
  }  
}




%>
