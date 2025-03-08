
onload = () => {
    const c = setTimeout(() => {
      document.body.classList.remove("not-loaded");
      clearTimeout(c);
    }, 1000);
  };
  
  function showMessage() {
    document.getElementById("messagePopup").style.display = "block";
}

function closeMessage() {
    document.getElementById("messagePopup").style.display = "none";
}
