const loadLessons = () => {
    fetch('https://openapi.programming-hero.com/api/levels/all')
        .then(res => res.json())
        .then(data => displayLessons(data.data))
}

const displayLessons = (lessons) => {

    const allLessons = document.getElementById('lessons')
    allLessons.innerHTML = '';

    lessons.forEach(lesson => {
        console.log(lesson)
        const div = document.createElement('div');
        div.innerHTML = `
        <button class="btn btn-outline btn-primary"><span><i class="fa-solid fa-book-open"></i>
                                </span>Lesson ${lesson.level_no}</button>
        `
        allLessons.append(div);
    });

}


loadLessons()