const logoHeader = document.querySelector('.logo');
fetch('src/views/logo/logo.html')
.then(res=>res.text())
.then(data=>{
    logoHeader.innerHTML=data;
})