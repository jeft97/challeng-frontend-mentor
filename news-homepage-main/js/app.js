const btnOpenMenu = document.querySelector('.js-btn--open-menu');
const btnCloseMenu = document.querySelector('.js-btn--close-menu');
const containerMenu = document.querySelector('.js-menu-mobile');
const containerItems = document.querySelector('.js-container');


btnOpenMenu.addEventListener('click',function(){
    containerMenu.classList.add('is-active');
    containerItems.classList.add('is-active');
});
btnCloseMenu.addEventListener('click',function(){
    containerMenu.classList.remove('is-active');
    containerItems.classList.remove('is-active');
});