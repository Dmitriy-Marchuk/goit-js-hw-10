import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from '/src/js/fetchCountries'

const refs = {
    searchBox: document.querySelector('input#search-box'),
    listMarkup: document.querySelector('.country-list'),
    countryInfoBox: document.querySelector('.country-info'),
}

const DEBOUNCE_DELAY = 300;



refs.searchBox.addEventListener('input', debounce(onTextInput, DEBOUNCE_DELAY));

function onTextInput(e) {
    if (refs.searchBox.value.length > 1) {
        const searchQuery = e.target.value.trim();
        return fetchCountries(searchQuery).then(renderCountry).catch(wrongCountryName); 
    } else {
        refs.listMarkup.innerHTML = '';
        refs.countryInfoBox.innerHTML = '';
   }
};

function renderCountry(countries) {
    refs.listMarkup.innerHTML = '';
    refs.countryInfoBox.innerHTML = '';
    console.log(countries);

    if (countries.length > 10) {
        return Notiflix.Notify.warning('Too many matches found. Please enter a more specific name.')
    }

    if (countries.length >= 2 && countries.length <= 10) {
        makeMarkupBox(countries);
    }

    if (countries.length === 1) {
        makeMarkupBoxForOne(countries);
        console.log(countries.length);
    }    
};

function makeMarkupBoxForOne(countries) {
    const markup = countries.map(({ flags, name }) => {
        return `
        <li class="country-one-box__item">
        <img src ="${flags.svg}" alt="Flag of country ${name}" class="country-one-box__image">
        ${name.common}</li>`;
    }).join('');

    refs.listMarkup.innerHTML = markup;
};

function makeMarkupBox(countries) {
    const markup = countries.map(({ flags, name, capital, population, languages }) => {
      
        return `
        <div class = "country-info__wrap">
        <img src ="${flags.svg}" alt="Flag of country ${name}" class="country-list__image">
        <h1 class = "country-title"> ${name.common}</h1>
        </div>

        <ul class="country-list-info">
            <li class="country-list-info__item">
            <p>Capital: ${capital}</p>
            </li>
            <li class="country-list-info__item">
            <p>Population: ${population}</p>
            </li>
            <li class="country-list-info__item">
            <p>Language: ${Object.values(languages)}</p>
            </li>
        </ul>`;
    }).join('');

    refs.countryInfoBox.innerHTML = markup;
    };
    

function wrongCountryName() {
    Notiflix.Notify.failure('Oops, there is no country with that name');
};