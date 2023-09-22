// DRINK FINDER
const search = document.getElementById('search'),
  submit = document.getElementById('submit'),
  random = document.getElementById('random'),
  mealsEl = document.getElementById('drinks'),
  resultHeading = document.getElementById('result-heading'),
  single_mealEl = document.getElementById('single-meal');


//Search Meal and Fetch from API
function searchMeal(e) {
    e.preventDefault();

    //Clear Single Meal
    single_mealEl.innerHTML = '';

    //Get Search term
    const term = search.value;

    //Check for empty 
    if(term.trim()) {
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${term}`)
        .then(res => res.json())
        .then(data => {
             console.log(data);
            resultHeading.innerHTML = `<h2>Search Results for '${term}' :</h2>`;
            if(data.drinks === null) {
                resultHeading.innerHTML = `<p>There are no results for this. Try Again!</p>`;
            } else {
                mealsEl.innerHTML = data.drinks.map(meal => `
                    <div class="meal">
                        <img src="${meal.strDrinkThumb}" alt="${meal.strDrink}"/>
                        <div class="meal-info" data-mealID="${meal.idDrink}">
                            <h3>${meal.strDrink}</h3>
                        </div>
                    </div>
                `)
                .join('');
            }
        });
        //Clear Search Text
        search.value = '';
    } else {
        alert('Pleaser enter a search term');
    }
}

//Fetch meal by ID
function getMealByID(mealID) {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
        const meal = data.drinks[0];

        addMealToDOM(meal);
    });
}

//Fetch random meal
function getRandomMeal() {
    //Clear meals and heading
    mealsEl.innerHTML = '';
    resultHeading.innerHTML= '';

    fetch(`https://www.thecocktaildb.com/api/json/v1/1/random.php`)
    .then( res => res.json())
    .then(data => {
        const meal = data.drinks[0];

        addMealToDOM(meal);
    });
}

//Add meal to DOM
function addMealToDOM(meal) {
    const ingredients = [];

    for(let i=1; i<=20; i++) {
        if(meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        } else {
            break;
        }
    }

    single_mealEl.innerHTML = `
    <div class="single-meal">
        <h1>${meal.strDrink}</h1>
        <img src="${meal.strDrinkThumb}" alt="${meal.strDrink}"/>
        <div class="single-meal-info">
          ${meal.strCategory ? `<p>${meal.strCategory}</p>` :''}
          ${meal.strAlcoholic ? `<p>${meal.strAlcoholic}</p>`: ''} 
        </div>
        <div class="main">
        <p>${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
        ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>
        </div>
    </div>
    `;
}

//Event listeners
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);

mealsEl.addEventListener('click', e=> {
    // const mealInfo = e.path.find(item => {
    //     if (item.classList) {
    //         return item.classList.contains('meal-info');
    //     } else {
    //         return false;
    //     }
    // });

    const mealInfo = e.target.closest('.meal-info');

    if (mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealid');
        getMealByID(mealID);
    }
});
