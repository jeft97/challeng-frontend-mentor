"use strict";

const allInputs = document.querySelectorAll('.js-input');
const spinner   = document.querySelector('.js-spinner');
const btnConfirm = document.querySelector('.js-btn-confirm');
const allControlls = document.querySelectorAll('.js-section__controlls')
const allStepSections = document.querySelectorAll('.section');
const allCircle = document.querySelectorAll('.js-circle');
const containerSection = document.querySelector('.group-input');
const containerPlans = document.querySelector('.section-plan__content');
const containerOns = document.querySelector('.section-ons__content');
const containerTable = document.querySelector('.table');
const containerSectionThanks = document.querySelector('.js-section-thanks');

let currentStep;
let isValidated;
let allInputsRadio;
let currPlan;
let currOns;
let typePlan;

const MAX_ALL_STEP_SECTIONS = allStepSections.length;

const formatsRegex = {
    tel:/^\+?\s*(?:[-\s]*\d){6,}$/,
    email:/^[\w-\.]+@([\w-]+\.)+[\w-]{2,10}/
}



const CONST_PLAN_YEAR = 10;
const CONST_PLAN_MONTH = 9;
const MAX_SIZE_STEP = 3;

let summaryPlans;
let summaryOns;
let summary;
let data;

const requestDate = async function(){
    
    try {
        const response = await fetch('./js/data.json'); ;
        data = await response.json();
        init();
        renderUI(data);
     } catch (error) {
        console.error('Error importing JSON data:', error);
     }
}

requestDate();

const checkRegex = el=> formatsRegex[el.getAttribute('type')]?.test(el.value);
   

function init(){
    
    isValidated = true;
    currentStep = 0;
    typePlan ="mo";

    allInputsRadio = null;
    currPlan = null;
    currOns = null;
    summaryPlans = [];
    summaryOns = [];
    summary = [summaryPlans,summaryOns];

    summaryPlans[0]=data.plans[0];

    allCircle.forEach(el=> el.classList.remove('u-is-active'));
    allStepSections[0].classList.remove('u-visually-hidden');
    allCircle[0].classList.add('u-is-active');

}



const removeError = function(el){
    el.classList.remove('is-shaking');
    el.nextElementSibling.style.display ="none";
    el.classList.remove('has-error');
}

const addError = function(el){
    el.classList.add('is-shaking');

    setTimeout(()=>{
        el.classList.remove('is-shaking'); 
    }, 1000);

    el.nextElementSibling.style.display="inline-block";
    el.classList.add('has-error');
}

const setMessageError = function(nodeElements){
    
    nodeElements.forEach(el=>{

        removeError(el);
        if(!el.value) addError(el);

        if(el.getAttribute('id') !== 'f-name'){

            removeError(el);

            if(!checkRegex(el)){
                isValidated = false;
                addError(el);
            }
        }else{
            isValidated = true;
        }
    });
}




const changeStep = function(currStep, nextCurrStep){

    allCircle.forEach(el=> el.classList.remove('u-is-active'));
    
    allCircle[nextCurrStep].classList.add('u-is-active');
    
    allStepSections[currStep].classList.add('u-visually-hidden');
    allStepSections[nextCurrStep].classList.remove('u-visually-hidden');

    currentStep = currStep < nextCurrStep ? currStep + 1 : currStep - 1;
}


// NEED REFACTOR

allControlls.forEach(function(el){

    el.addEventListener('click', function(e){
        e.preventDefault();
        if(currentStep  === 1){
            
            const tmpAllInputs = Array.from(allInputsRadio);
           
            // Refactor
            const isNotChecked = tmpAllInputs.every(item=> item.checked === false);
            
            if(isNotChecked){
                tmpAllInputs.forEach(input=>{
            
                    input.nextElementSibling.classList.add('u-border-erro');
                    input.nextElementSibling.classList.add('is-shaking');
            
                    setTimeout(()=> {
                        input.nextElementSibling.classList.remove('u-border-erro');
                        input.nextElementSibling.classList.remove('is-shaking');
                    },1000)
                })
                return;
            }
        }
        const btnClicked = e.target;
    
        if(btnClicked.classList.contains('js-next-step')){
    
            setMessageError(allInputs);
            if(isValidated){
                if(currentStep > MAX_ALL_STEP_SECTIONS) return;

                changeStep(currentStep, currentStep + 1);
            }
               
        }
        if(btnClicked.classList.contains('js-back-step')){
            changeStep(currentStep, currentStep - 1);
        }
        if(currentStep === MAX_SIZE_STEP){       
            renderSummary(summary);
        }
    })
})

containerPlans.addEventListener('change',function(e){
    e.preventDefault()
    const clicked = e.target;
    if(!clicked) return;
    if(clicked.checked){
        
        currPlan = data.plans.find(plan=> plan.title === clicked.nextElementSibling.querySelector('.plan--title').textContent);
        document.querySelectorAll('.add-ons [type="checkbox"]').forEach(input=> input.checked=false)

    }
    // REFACTOR
    summaryOns.length=0;

    summary[0]=currPlan;
});

containerOns.addEventListener('change',function(e){

    e.preventDefault()

    const clicked = e.target;

    if(!clicked) return;
   
    if(clicked.checked){
        currOns = data.ons.find(ons => ons.title === clicked.parentElement.querySelector('.add-ons--title').textContent);
        summaryOns.push(currOns); 
    }
    if(!clicked.checked){
        const index = summaryOns.findIndex(ons => ons.title === clicked.parentElement.querySelector('.add-ons--title').textContent);
        summaryOns.splice(index,1);
    }
    renderSummary(summary);
   
});


// REFACTOR


function renderOns({ons}){
    
    containerOns.innerHTML = "";

    ons.forEach(ons=>{
        const mockupOns =`
            <div class="add-ons">
                <label for="f-${ons.title.split(" ")[1]}">
                    <input type="checkbox"id="f-${ons.title.split(" ")[1]}">
                    <div class="box">
                        <span class="add-ons--title"">${ons.title}</span>
                        <span>${ons.desc}</span>
                    </div>
                    <span class="add-ons--price">+$${ons.price}/${typePlan}</span>
                </label>
            </div>
        `
        containerOns.insertAdjacentHTML('beforeend', mockupOns);
    })
    
}

function renderPlans ({plans}){

    containerPlans.innerHTML = "";
    
    plans.forEach(plan=>{
        const mockupPlans= `
            <div class="group-content">
                <input type="radio" id="r-${plan.title.toLowerCase()}" name="plan">
                <label for="r-${plan.title.toLowerCase()}" class="plan">
                    <img src="${plan.icon}" alt="icon plan ${plan.title.toLowerCase()}" class="plan--icon"/>
                    <span class="plan--title">${plan.title}</span>
                    <span class="plan--price">$${plan.price}/${typePlan}</span>
                    <small hidden>2 months free</small>
                </label>
            </div>
        `
        containerPlans.insertAdjacentHTML('beforeend', mockupPlans);

    })

    allInputsRadio = document.querySelectorAll('[type="radio"]');
    
}

function renderUI (data){
    renderPlans(data)
    renderOns (data);
}

function renderSummary (summary){
    
    summary.forEach((_,__, dataSmy)=>{
        containerTable.innerHTML=""
        if(dataSmy[0].length !==0 || dataSmy[1].length !==0){

            const mockup = `
                    <thead class="table__head">
                        <tr class="plans">
                            <th>
                                <span>${dataSmy[0].title} (Monthly)</span>
                                <a href="#step--2" class="change-plan">Change</a>
                            </th>
                            <th>
                            <span class="price">$${dataSmy[0].price}/${typePlan}</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody class="table__body">
                        ${dataSmy[1].map(ons=>{
                            return `
                                <tr>
                                    <td>${ons.title}</td>
                                    <td>+$${ons.price}/${typePlan}</td>
                                </tr>
                              `
                        }).join('')}
                    </tbody>
                    <tfoot class="table__footer">
                        <tr>
                            <td>Total (per ${typePlan === "mo" ? 'month':'year'})</td>
                            <td>
                                $
                                ${
                                    dataSmy[0].price + 
                                    dataSmy[1].map(ons=>ons.price)
                                    .reduce((acc,curr)=> acc +curr,0)
                                }/${typePlan}
                            </td>
                        </tr>
                    </tfoot>
        `
        containerTable.insertAdjacentHTML('afterbegin', mockup);

        }
        
    })    
    
}

const findPlan = function(el){

     //selecting elements for Find the plan
     const currEl = el.nextElementSibling.querySelector('.plan--title').textContent;
     const currPrice = el.nextElementSibling.querySelector('.plan--price');
     currPlan = data.plans.find(plan=> plan.title === currEl);
     
     return currPrice;

}


const calcPrice = function(NUMBER_CONST_PLAN){

    return NUMBER_CONST_PLAN === CONST_PLAN_YEAR 
           ?currPlan.price * CONST_PLAN_YEAR
           :currPlan.price / CONST_PLAN_YEAR;
}


const choosePlan = function(el, NUMBER_CONST_PLAN ){
    
    const currPrice = findPlan(el);

    // set the price plan on UI       
    currPrice.textContent = `$${calcPrice(NUMBER_CONST_PLAN)}/${typePlan}`;
    
    // set the price plan on OBJ
    currPlan.price = calcPrice(NUMBER_CONST_PLAN); 
            
    typePlan = NUMBER_CONST_PLAN === CONST_PLAN_YEAR ? 'yr':'mo';

    renderUI(data);
            
    if(el.checked !== false){
        summaryPlans[0]= currPrice;
    }

}

const setTheChosenPlan = function(elClicked, parentEl,NUMBER_CONST_PLAN){
    
    elClicked.closest('.section')
    .querySelectorAll('[type="radio"]')
    .forEach(el=>{
        choosePlan(el, NUMBER_CONST_PLAN);
    });

    parentEl.querySelectorAll('small').forEach(el=>{
        if(NUMBER_CONST_PLAN === CONST_PLAN_YEAR){
            el.removeAttribute('hidden');
        }else{
            el.setAttribute('hidden','false');
        }
        
    })

}

containerSection.addEventListener('click', function(e){
    
    const elClicked = e.target.closest('.js-choose-plan');
    if(!elClicked)return;

    const parentElement =  elClicked.previousElementSibling.closest('.section');
     
    if(!elClicked.previousElementSibling.checked){
        
        setTheChosenPlan(elClicked, parentElement, CONST_PLAN_YEAR)

    }
    if(elClicked.previousElementSibling.checked){
        setTheChosenPlan(elClicked, parentElement,CONST_PLAN_MONTH)
    }

});


const renderConfirm = function({confirm}){
    
    const mockup =`
            <div class="section-thanks__content u-mb-big">
                <img src="${confirm.icon}" alt="icon Thanks" class="u-mb-medium">
                <span class="u-mb-small">${confirm.title}</span>
                <p>
                    ${confirm.message}
                </p>
            </div>
            <div class="attribution">
                Challenge by <a href="${confirm.attribution.company.link}" target="_blank">${confirm.attribution.company.name}</a>. 
                Coded by <a href="${confirm.attribution.dev.link}">${confirm.attribution.dev.name}</a>.
            </div>
    
    `
    containerSectionThanks.insertAdjacentHTML('afterbegin', mockup)
}




btnConfirm.addEventListener("click", function(){

    allStepSections[currentStep].classList.add('u-visually-hidden');
    spinner.classList.remove('u-visually-hidden');
    allStepSections[currentStep + 1].classList.remove('u-visually-hidden');

    const id = setTimeout(()=>{
        spinner.classList.add('u-visually-hidden');
        renderConfirm(data);
    },2500)

})


containerTable.addEventListener('click', function(e){
    e.preventDefault()
    const link = e.target.closest('.change-plan');

    if(!link)return;
    allCircle[currentStep].classList.remove('u-is-active');

    allStepSections[currentStep].classList.add('u-visually-hidden');
    document.querySelector(`${link.getAttribute('href')}`).classList.remove('u-visually-hidden');
    currentStep = Number(link.getAttribute('href').split('').at(-1)) - 1;
    allCircle[currentStep].classList.add('u-is-active');
   
});
   
