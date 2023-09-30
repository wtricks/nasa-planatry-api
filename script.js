const HISTORY = []

/**
 * This function should fetch the data for the current date from the NASA API 
 * and display it in the UI. This function runs when the page loads.
 * @param {string} date 
 */
const getCurrentImageOfTheDay = (date) => {
    const API_KEY = "UCXozfQesU63xVdhIwB6k2XXEzJeWzwbRkubwp62";
    fetch(`https://api.nasa.gov/planetary/apod?date=${date}&api_key=${API_KEY}`)
        .then(e => e.json())
        .then(e => {
            document.getElementById("current-image-container")
                .innerHTML = `<h1>Picture on ${e.date}</h1>
                    ${e.media_type == 'image'
                    ? `<img src="${e.url}" alt="${e.title}">`
                    : `<iframe src="${e.url}" frameborder="0"></iframe>`}
                    <h2>${e.title}</h2>
                    <p>${e.explanation}</p>`
        })
}
/**
 * This function should fetch the data for the selected date from the NASA API 
 * and display it in the UI. It should also save the date to local storage and also show it in the search history unordered list.
 */
const getImageOfTheDay = (date) => {
    getCurrentImageOfTheDay(date)
    saveSearch(date)
    addSearchToHistory()
}

/**
 * This function should save a date to local storage. As shown in the recording, 
 * you need to just save the dates in an array.
 */
const saveSearch = (date) => {
    if (!HISTORY.includes(date)) {
        HISTORY.unshift(date)
    }
    window.localStorage.setItem('nasa-search-history', JSON.stringify(HISTORY))
}

/**
 * This function should add the date to the search history list in the Ui. 
 * You need to get the searches array from localstorage and display it as an unordered list in the ui. When a user clicks on the specific list item, you need to fetch the data for that specific date all over again and show it in the black div.
 */
const addSearchToHistory = () => {
    const listData = HISTORY.reduce((prev, curr) => {
        return `${prev}<li><a href="/history/${curr}" title="${curr}">${curr}</a></li>`
    }, '')

    document.getElementById("search-history").innerHTML = listData;
}

window.addEventListener('DOMContentLoaded', () => {
    // fetch search history    
    HISTORY.push(...JSON.parse(window.localStorage.getItem('nasa-search-history') || '[]'));

    addSearchToHistory();
    getCurrentImageOfTheDay(new Date().toISOString().split("T")[0]);

    // When user click on history links
    document.getElementById("search-history").addEventListener('click', (e) => {
        e.preventDefault()
        if (e.target.nodeName === 'A') {
            getCurrentImageOfTheDay(e.target.getAttribute('title'))
        }
    })

    // when form will be submitted
    document.getElementById("search-form").addEventListener('submit', e => {
        e.preventDefault();

        const date = document.getElementById("search-input").value;
        if (!date) {
            return
        }

        getImageOfTheDay(date)
    })
})