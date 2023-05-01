import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import fetchCountries from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const searchInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
countryList.style.listStyle = 'none';

const countryInfo = document.querySelector('.country-info');

searchInput.addEventListener('input', debounce(handleOnClick ,DEBOUNCE_DELAY))

function handleOnClick(e) {
    let filter = e.target.value.toLowerCase().trim();
    fetchCountries(filter) 
        .then((dataCountry) => {
            if (dataCountry.length === 0) {
                clearData();

            } else if (dataCountry.length <= 10 && dataCountry.length !== 1) {
                renderManyCountries(dataCountry);

            } else if (dataCountry.length === 1) {
                renderCountryCard(dataCountry);

            } else if (dataCountry.length > 10) {
                clearData();
                Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
            }
        })
        .catch ((error) => {
            Notiflix.Notify.failure("Oops, there is no country with that name");
        })
    }

function clearData() {
    countryInfo.innerHTML = "";
    countryList.innerHTML = "";
}

function renderManyCountries(obj){
    const country = obj.map(({ name, flags }) =>
        `<li class="country__list--item"><img class="country__list--img" src="${flags.svg}" alt="${name.official} flag" width="50">${name.official}</li>`
    ).join('')
    countryList.insertAdjacentHTML('beforeend', country);
    countryInfo.innerHTML = '';
}

function renderCountryCard(obj) {
    const countryCard = obj.map(({ name, flags, capital, population, languages }) => 
        `<h1 class="country__title"><img class="country__flag" src="${flags.svg}" alt="${name.official} flag" width="50">${name.official}</h1>
        <p class="country__subtitle">Capital: <span class="subtitle__value">${capital}</span></p>
        <p class="country__subtitle">Population: <span class="subtitle__value">${population}</span></p>
        <p class="country__subtitle">Languages: <span class="subtitle__value">${Object.values(languages)}</span></p>`
    ).join('');
    countryInfo.insertAdjacentHTML('beforeend', countryCard);
    countryList.innerHTML = '';
}