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
const mealDetail = $id('meal-detail');
const randomBtn = $id('random-btn');

// Get meals
function searchAndRenderMeals(event) {
    event.preventDefault();
    meals.innerHTML = '<div class="u-meals">Searching...</div>';

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm.value}`)
        .then((res) => res.json())
        .then((data) => {
            if (!data.meals) {
                meals.innerHTML = '<div class="u-meals">No results. Try again.</div>';
            } else {
                meals.innerHTML = data.meals
                    .map(
                        (meal) => `
                <div class="meal" data-mealid="${meal.idMeal}">
                    <p>${meal.strMeal.split(' ').join('<br>')}</p>
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                </div>
            `
                    )
                    .join('');
            }
        });
}

// Get meal by ID
async function getMealById(mealId) {
    mealDetail.innerHTML = '<div class="u-meals">Wait a moment...</div>';
    let res;
    if (mealId) {
        res = await fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
        );
    } else {
        res = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    }

    const data = await res.json();
    const meal = data.meals[0];
    mealDetail.innerHTML = `
        <div class="meal-thumb" style="background-image: url(${meal.strMealThumb})">
            <div class="cuisine">
                <h2>${meal.strMeal}</h2>
            </div>
        </div>

        <div class="ingredients">
            <ul>${mealIngredients(meal)}</ul>
        </div>

        <div class="instructions">
            ${cookingInstructions(meal)}
        </div>
    `;
}

// Get meal ingredients
function mealIngredients(meal) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (`${meal[`strIngredient${i}`]}` === '') break;
        ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
    }

    return ingredients
        .map(
            (ingredient) => `
        <li>${ingredient}</li>
    `
        )
        .join('');
}

// Get meal instructions
function cookingInstructions(meal) {
    return meal.strInstructions
        .split('.')
        .map((step) => `<p>${step}.</p>`)
        .join('<br>');
}

// Get randomMeal
function getRandomMeal() {
    getMealById();
}

// Event listeners
form.addEventListener('submit', searchAndRenderMeals);
randomBtn.addEventListener('click', getRandomMeal);
meals.addEventListener('click', (event) => {
    const meal = event.path.find((el) => {
        if (el.classList) return el.classList.contains('meal');
        else return false;
    });
    const mealId = meal.dataset.mealid;

    getMealById(mealId);
});
