const cont = document.getElementsByClassName("collapsible");
let i;

for (i = 0; i < cont.length; i++) {
  cont[i].addEventListener("click", function () {
    this.classList.toggle("active");
    const content = this.nextElementSibling;
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
      content.style.borderRadius = "0px 0px 10px 10px";
    }
  });
}
