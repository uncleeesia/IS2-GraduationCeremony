const logoHeader = document.querySelector('.logo');
fetch('./views/common/logo/logo.html')
.then(res=>res.text())
.then(data=>{
    logoHeader.innerHTML=data;
})