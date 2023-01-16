'use strict';

const allLabelMessageError = document.querySelectorAll('.message-error'); 
const allLabels = document.querySelectorAll('[data-input]');
const inpCardNumber = document.querySelector('#f-number');
const inpCardDateMonth = document.querySelector('#f-month');
const inpCardDateYear = document.querySelector('#f-year');
const inpCardDateCVC = document.querySelector('#f-cvc');
const containerForm = document.querySelector('.js-form');
const allInputs = document.querySelectorAll('input');
const btnConfirm = document.querySelector('.js-btn-confirm');
const btnContinue = document.querySelector('.js-btn-complete');
const sectionComplete = document.querySelector('.js-section-complete');


/** 
 * 
 * Sorry I haven't refactored this code yet, 
 * I'm pretty busy with college work and stuff.
 * however I promise I'll be back soon to clean up the code
 * 
 */

const creditCardRegex = /^[0-9]{16,16}$/;
const monthRegex = /^(1[0-2]|[1-9])$/;

const infoDefault = {
        number:'0000 0000 0000 0000',
        name:'',
        month:'00',
        year:'00',
        cvc:'000'
};

const init = function(){
    allLabels.forEach(label=>{
        label.textContent = infoDefault[`${label.dataset.input}`];
    });
};
init();


const restrictInputLength = function(el,minValue, maxValue){
    el.value = el.value.slice(minValue, maxValue);
};

allLabelMessageError.forEach(labelErro=> labelErro.classList.add('u-visually-hidden'));

const setMessageError = function(parentEl, targetEl){
    targetEl.classList.add('u-br-color-error');
    parentEl.querySelector('.message-error').classList.remove('u-visually-hidden');
};


// maxLength for input month, year and cvc
[inpCardDateMonth,inpCardDateYear,inpCardDateCVC].forEach(el=>{
    el.addEventListener('input', function(e){

        const parentEl = e.target.closest('.group-form');

        if(e.target.id!=='f-cvc'){
            restrictInputLength(e.target,0,2);
        }else{
            restrictInputLength(e.target,0,3);
        }

        if( e.target.value.length === 2 
            && e.target.id === 'f-month' 
            && ((+e.target.value) > 12 || (+e.target.value) < 1)
          ){

                if(!monthRegex.test(e.target)){
                    e.target.value = e.target.value[0]; 
                }               
            
           }
    
    });
});




containerForm.addEventListener('input', function(e){

    const id = e.target.id.split('-').at(-1); 
    const labelSelected = document.querySelector(`[data-input="${id}"]`);
    labelSelected.textContent =`${e.target.value}`;
    
    if(labelSelected.textContent.length===0) {
        labelSelected.textContent = infoDefault[`${id}`];
    }
    allLabelMessageError.forEach(labelErro => labelErro.classList.add('u-visually-hidden'));
    allInputs.forEach(input=> input.classList.remove('u-br-color-error'));

    const parentEl = e.target.closest('.group-form');

    if(e.target.id === "f-cvc" && e.target.value.length === 3 && e.target.value === "000"){
        setMessageError(parentEl, e.target);
    }
    if(e.target.id === 'f-year' && e.target.value.length === 2 && e.target.value === '00'){
        setMessageError(parentEl, e.target);
    }
    if(e.target.id === 'f-number'){
        if(!creditCardRegex.test(e.target.value)){
            setMessageError(parentEl, e.target);
        }
        labelSelected.textContent = e.target.value.replace(/(.{4})/g, "$1 ");
    }
    if(e.target.id==='f-month'){
        labelSelected.textContent = e.target.value.padStart(2,0);
    }    
});

btnConfirm.addEventListener('click',function(e){
    e.preventDefault();
    const tmpInputs = [inpCardDateCVC, inpCardDateMonth, inpCardDateYear,inpCardNumber];
    
    tmpInputs.forEach(input=>{    
        if(input.value.length === 0){
            const parentEl = input.closest('.group-form');
            setMessageError(parentEl, input);
        } 
    });
    if((inpCardDateCVC.value.length < 3)){
        console.log('entrei aqui');
        const parentEl = inpCardDateCVC.closest('.group-form');
        setMessageError(parentEl, inpCardDateCVC);
        return;
    };

    const isValid = Array.from(allLabelMessageError).every(label=> label.classList.contains('u-visually-hidden'))
    if(!isValid) return;

    
    containerForm.classList.add('u-visually-hidden');
    sectionComplete.classList.remove('u-visually-hidden');  
    
    
})

btnContinue.addEventListener('click', function(e){
    e.preventDefault();
    allInputs.forEach(input=> input.value ='');
    containerForm.classList.remove('u-visually-hidden');
    sectionComplete.classList.add('u-visually-hidden'); 

    init();

})
