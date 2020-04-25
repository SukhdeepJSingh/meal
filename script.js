// helper functions
function $id(id) {
    return document.getElementById(id);
}

function $el(address) {
    return document.querySelector(address);
}

// DOM elements
const form = $id('form');
const searchTerm = $id('search-term');
const meals = $id('meals');

// Get meals
function searchAndRenderMeals(event) {
    event.preventDefault();
    meals.innerHTML = '';

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm.value}`)
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            meals.innerHTML = data.meals
                .map(
                    (meal) => `
                <div class="meal">
                    <p>${meal.strMeal.split(' ').join('<br>')}</p>
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                </div>
            `
                )
                .join('');
        });
}

// Event listeners
form.addEventListener('submit', searchAndRenderMeals);
// meals.addEventListener('click', (event) => {

// });
