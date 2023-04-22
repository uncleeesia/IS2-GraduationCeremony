const sideBar = document.querySelector("#sideBar");
fetch("src/views/sideBar/sideBar.html")
  .then((res) => res.text())
  .then((data) => {
    sideBar.innerHTML = data;
  });

sideBar.addEventListener("click", function () {
  document.querySelector(".animated-icon2").classList.toggle("open");
});