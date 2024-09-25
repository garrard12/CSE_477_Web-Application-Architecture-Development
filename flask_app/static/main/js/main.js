const menuBar = document.querySelector("#MenuBar");
const desktop = document.querySelector("#desktop");


/*Add the hamburg icon and changes linked icon into a hyperlink*/
menuBar.addEventListener("click", () => {
  desktop.classList.toggle("visableDropDown");
  const linken = document.querySelector("#LinkenWord");
  if(desktop.classList.contains("visableDropDown") && !linken){
    let linkenText = document.createElement("a");
    linkenText.setAttribute("id","LinkenWord");
    let linkenTextContent = document.createTextNode("Linken");
    linkenText.appendChild(linkenTextContent);

    // Add the linked to the hambuger menu
    linkenText.title = "Linken";
    linkenText.href = "https://www.linkedin.com/in/auden-garrard-932aa0222/";
    desktop.appendChild(linkenText);
  }else{
    linken.remove();
  }
});


