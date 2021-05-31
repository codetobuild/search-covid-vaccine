
const search_form =  document.querySelector('.search_form');
const search_option = document.querySelector('.search_option')
const district_option  = document.querySelector('.district_option');
const pincode_option = document.querySelector('.pincode_option');
const state= document.querySelector('.state');
const district = document.querySelector('.district');
const pincode = document.querySelector('.pincode');
const submit = document.querySelector('.submit');
const date = document.querySelector('.date');
const age = document.querySelector('.age');
const all_cards = document.querySelector('.all_cards');
const vaccine_card = document.querySelector('.vaccine_card');
const vaccine_name = document.querySelector('.vaccine_name');
const dose_1 = document.querySelector('.dose_1');
const dose_2 = document.querySelector('.dose_2');
const vaccine_center = document.querySelector('.vaccine_center');
 
const junior_card = document.querySelector('.junior_card');
const senior_card = document.querySelector('.senior_card');
const junior_blank_card = document.querySelector('.junior_blank_card');
const senior_blank_card = document.querySelector('.senior_blank_card');
const age_45 = document.querySelector('.age_45');
const age_18 = document.querySelector('.age_18');
//api formate
// let getState = `https://cdn-api.co-vin.in/api/v2/admin/location/states`
// let getDistrict = `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${stateId}`
// let getVaccineByPin = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${pincode}&date=${date}`
// let getVaccineByDistrict = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${district_id}&date=${date}`

let getState = `https://cdn-api.co-vin.in/api/v2/admin/location/states`;
let getDistrict = `https://cdn-api.co-vin.in/api/v2/admin/location/districts/`;
let getVaccine = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/`;
 
function findDate() {

  let dt = new Date();
  //31-03-2021

  let monthDate =( dt.getDate() < 10)? '0'+dt.getDate() : dt.getDate();
  let month = ( (dt.getMonth()+1)< 10)? '0'+(dt.getMonth()+1) : (dt.getMonth()+1);
  let year = dt.getFullYear();

   let dateformat = `${monthDate}-${month}-${year}`;
   return dateformat;
}

let setDate = {
    dt : new Date(),
    monthDate : function(){
        let mndt = this.dt.getDate();
        return ((mndt < 10)? '0'+mndt : mndt);
         },
    month : function(){
          let mnth = this.dt.getMonth() + 1;
        return ((mnth<10)? '0'+mnth: mnth);
        },
    year: function(){
        return this.dt.getFullYear();
    },
    dayWeek: function(){
      let days = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];
        return days[this.dt.getDay()];
    },
    monthInWord: function(){
      let months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months[this.dt.getMonth()];
    },
    get findDate(){
            return  `${this.monthDate()}-${this.month()}-${this.year()}`;
        },
    get todayDayDate(){
      return `${this.monthDate()} ${this.monthInWord()} ${this.year()}, ${this.dayWeek()}`
    }
}
  
 
let todayDate = setDate.findDate;
let byDistrict = true;//check whether to search by district or pincode

date.innerText = setDate.todayDayDate;

search_option.addEventListener('click', e=>{

  if( district_option.classList.contains('search_option_background'))
  {
    byDistrict =!byDistrict;
   
      // console.log( district_option.classList.contains('search_option_background'))
      district_option.classList.toggle('search_option_background');
      pincode_option.classList.toggle('search_option_background');
    
      state.classList.toggle('hide_input');
      district.classList.toggle('hide_input');
      pincode.classList.toggle('hide_input');

   
  }else{
    byDistrict =!byDistrict;
    
    // console.log( pincode_option.classList.contains('search_option_background'))

    district_option.classList.toggle('search_option_background');
    pincode_option.classList.toggle('search_option_background');

    state.classList.toggle('hide_input');
    district.classList.toggle('hide_input');
    pincode.classList.toggle('hide_input');
 
  }
 
  
})



search_form.addEventListener('submit', e=>{
    e.preventDefault();


    let stateValue = search_form.state.value ;
    let districtValue = search_form.district.value;
    let pincode = search_form.pincode.value || null;
    
     
    if(byDistrict && stateValue && districtValue){
        searchByDistrict(districtValue);
    }else{
        if(pincode)
        {
           searchByPincode(pincode);
        }
    }
 
    //reset 
    search_form.state.value = '';
    search_form.district.value = '';
    search_form.pincode.value = '';

})

function StateOptionElement(allStates){

     allStates.forEach( elem => {
     let option = document.createElement('option');
     option.setAttribute('value', elem.state_id);
     option.innerText = elem.state_name;
     state.appendChild(option);

  })
}

 async function DistrictOptionElement( stateId)
{

  let urlDistrict = new URL( `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${stateId}`)

  let districtResponse = await fetch( urlDistrict );

  if(districtResponse.status==200)
  {
     let dist = await districtResponse.json();

     while( district.firstElementChild != district.lastElementChild){
       district.removeChild(district.lastElementChild);
     }
    dist.districts.forEach( elem => {
      let option = document.createElement('option');
      option.setAttribute('value', elem.district_id);
      option.innerText = elem.district_name;
      district.appendChild(option);

    })
  
    


  }else{
    console.log( districtResponse.status);
  }

}

//to create district based on selected state
 state.addEventListener('change', (e) =>{
 
  let selectedStateId =search_form.state.value;
  DistrictOptionElement(selectedStateId);

})

let findAllStates =async ()=>{
  
  let stateResponse  = await fetch(getState);
  if( stateResponse.status==200)
  {
    let stResponse = await stateResponse.json();
    if(stResponse.states.length){
      StateOptionElement( stResponse.states);
    }
  }
}

findAllStates().catch(e=>{
  console.log(e)
})


async function searchByDistrict( districtValue){
    
  let urlDistrict = new URL(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${districtValue}&date=${todayDate}`)

  let distFetch = await fetch(urlDistrict)
  if(distFetch.status==200)
  {
    let distFetchResponse = await distFetch.json();
    // console.log(  ( distFetchResponse.sessions) )
    handleCards( distFetchResponse.sessions)
  }else{
    console.log(distFetch.status);
  }

}


async function searchByPincode(pincode){
     
    let pinUrl = new URL(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${pincode}&date=${todayDate}`)


    let vaccineByPin = await fetch ( pinUrl);
     
   if(vaccineByPin.status==200)
    {
        let response = await vaccineByPin.json();
        // console.log(response.sessions)
        handleCards( response.sessions)
    }else{
      console.log( response.status )
    }

}


function handleCards( vaccinesData){

// console.log(vaccinesData);

  while( junior_card.children.length > 1)
  {
    junior_card.removeChild(junior_card.lastElementChild);
  }
  while( senior_card.children.length > 1)
  {
    senior_card.removeChild(senior_card.lastElementChild);
  }

  vaccinesData.forEach( elem =>{
  
    let {available_capacity_dose1:dose1, available_capacity_dose2:dose2} = elem;
        
    if( dose1 || dose2 ){// if available

        console.log(`${dose1} ${dose2}`)
        createCards(elem ,dose1 , dose2);

    }
  })
    // empty card 

    // console.log( junior_card.children.length)
    // console.log( senior_card.children.length)
    
  
    if( junior_card.children.length > 1)
    {  age_18.innerText = `Age 18+ ( Total : ${junior_card.children.length - 1} )`;
      junior_blank_card.classList.add('blank_visiblity');
    }else{
      junior_blank_card.classList.remove('blank_visiblity');
    }
  
    if( senior_card.children.length > 1)
    {
      age_45.innerText = `Age 45+ ( Total : ${senior_card.children.length - 1} )`;
      senior_blank_card.classList.add('blank_visiblity');
    }else{
      senior_blank_card.classList.remove('blank_visiblity');
    }

}

function createCards( {vaccine,name,district_name, address ,min_age_limit} , dose1, dose2 )
{
  let newVaccineCard = document.createElement('div');
      newVaccineCard.classList.add('vaccine_card');

      newVaccineCard.innerHTML = `<div class="vaccine_name">${vaccine}</div>
      <div class="doses">
          <span class="dose_1">dose 1 : ${dose1}</span>
          <span class="dose_2">dose 2 : ${dose2}</span>
      </div>
      <div class="vaccine-center">
          <div>
              <span class="center_name">Center:</span>${name}
          </div>
          <div>
              <span class="center_name">District:</span>${district_name}
          </div>
          <div>
              <span class="address">Address:</span>
              ${address}
          </div>
          
      </div>`
  
    if(min_age_limit>=45){
      senior_card.appendChild(newVaccineCard);
    }
    else if(min_age_limit>=18){
      junior_card.appendChild(newVaccineCard);
    }


}




















