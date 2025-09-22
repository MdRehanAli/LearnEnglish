const createElement = (arr) => {
    const htmlElement = arr.map((el) => ` <span class="btn">${el}</span>`)
    return htmlElement.join(" ");
}

// Speak Vocabularies features 
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

// Spinner 
const manageSpinner = (status) => {
    if (status == true) {
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("word-section").classList.add("hidden");
    }
    else {
        document.getElementById("word-section").classList.remove("hidden");
        document.getElementById("spinner").classList.add("hidden");
    }
}

// Load Lessons data 

const loadLessons = () => {
    fetch('https://openapi.programming-hero.com/api/levels/all')
        .then(res => res.json())
        .then(data => displayLessons(data.data))
}

const removeActive = () => {
    const lessonButtons = document.querySelectorAll(".lesson-btn");
    lessonButtons.forEach(btn => {
        btn.classList.remove("active");
    });
}

const loadLevelWord = (id) => {
    manageSpinner(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            removeActive(); //remove all active class
            const clickBtn = document.getElementById(`lesson-btn-${id}`)
            clickBtn.classList.add("active"); //add all active class
            displayLevelWord(data.data)
        })

}

const loadWordDetail = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    const res = await fetch(url);
    const details = await res.json();
    displayWordDetails(details.data);
}

const displayWordDetails = (word) => {
    console.log(word);
    const detailsContainer = document.getElementById('details-container')

    detailsContainer.innerHTML = `
    <div class="">
                        <h2 class="text-2xl font-bold">${word.word} (<i class="fa-solid fa-microphone-lines"></i>  :${word.pronunciation})</h2>
                    </div>
                    <div class="">
                        <h2 class="font-bold">Meaning</h2>
                        <p>${word.meaning}</p>
                    </div>
                    <div class="">
                        <h2 class="font-bold">Example</h2>
                        <p>${word.sentence}</p>
                    </div>
                    <div class="">
                        <h2 class="font-bold">সমার্থক শব্দ গুলো</h2>
                        <div class="">
                        ${createElement(word.synonyms)}
                        </div>
                    </div>
    `
    document.getElementById('my_modal').showModal()

}

const displayLevelWord = (words) => {
    const wordContainer = document.getElementById('word-section');
    wordContainer.innerHTML = '';

    if (words.length == 0) {
        wordContainer.innerHTML = `
        <div class="text-center col-span-full rounded-xl py-10 space-y-6 bangla-font">
                <img class="mx-auto" src="./assets/alert-error.png" alt="alert">
                <p class="text-xl font-medium text-gray-400">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                <h2 class="text-4xl font-bold">নেক্সট Lesson এ যান</h2>
            </div>
        `;
        manageSpinner(false);
        return;
    }

    words.forEach(word => {
        const card = document.createElement('div');
        card.innerHTML = `
        <div class="bg-white rounded-xl shadow-md text-center pt-12 px-5">
                <h2 class="font-semibold text-3xl">${word.word ? word.word : "অর্থ পাওয়া যাইনি"}</h2>
                <p class="py-6">Meaning / Pronunciation</p>
                <div>"${word.meaning ? word.meaning : "meaning পাওয়া যাইনি"} / ${word.pronunciation ? word.pronunciation : "pronunciation পাওয়া যাইনি"}"</div>
                <div class="flex justify-between items-center py-16">
                    <button onclick="loadWordDetail(${word.id})" class="btn bg-[#1A91FF1A]"><i class="fa-solid fa-circle-info"></i></button>
                    <button onclick="pronounceWord('${word.word}')" class="btn bg-[#1A91FF1A]"><i class="fa-solid fa-volume-high"></i></button>
                </div>
            </div>
        `

        wordContainer.append(card);
    });
    manageSpinner(false);
}

const displayLessons = (lessons) => {

    const allLessons = document.getElementById('lessons')
    allLessons.innerHTML = '';

    lessons.forEach(lesson => {
        // console.log(lesson)
        const div = document.createElement('div');
        div.innerHTML = `
        <button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn"><span><i class="fa-solid fa-book-open"></i>
                                </span>Lesson ${lesson.level_no}</button>
        `
        allLessons.append(div);
    });

}


loadLessons();


// Search Functionality 

document.getElementById('btn-search').addEventListener("click", () => {
    removeActive();
    const input = document.getElementById('input-search');
    const searchValue = input.value.trim().toLowerCase();

    console.log(searchValue);
    fetch('https://openapi.programming-hero.com/api/words/all')
        .then((res) => res.json())
        .then((data) => {
            const allWords = data.data;
            console.log(allWords)

            const filterWords = allWords.filter((word) =>
                word.word.toLowerCase().includes(searchValue)
            );
            displayLevelWord(filterWords);
        })
})