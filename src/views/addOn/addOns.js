document.addEventListener("DOMContentLoaded", function (e) {
  const buttonComponent = document.querySelector("#addOnComponents");
  fetch("src/views/addOn/addOns.html")
    .then((res) => res.text())
    .then((data) => {
      buttonComponent.innerHTML = data;
      const inputs = buttonComponent.querySelectorAll("input");
      inputs.forEach((input) => {
        input.addEventListener("click", onClick);
      });
    });
});

function onClick(e) {
  e.preventDefault();
  console.log(e.target.id);
  //if clap do this audio
  //else if cheer do this audio
  //else both
}
