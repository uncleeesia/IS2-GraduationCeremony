const buttonComponent = document.querySelector('#addOnComponents');
fetch('src/views/addOn/addOns.html')
.then(res=>res.text())
.then(data=>{
    buttonComponent.innerHTML=data;
})