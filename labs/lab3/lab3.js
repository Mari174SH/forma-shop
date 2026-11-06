// данные 
const data = [
    {
        q: "А голос у него был не такой, как у почтальона Печкина, дохленький. У Гаврюши голосище был, как у электрички. Он _____ _____ на ноги поднимал.",
        answers: [
            { t: "Пол деревни, за раз", ok: false },
            { t: "Полдеревни, зараз", ok: true },
            { t: "Пол-деревни, за раз", ok: false }
        ],
        why: "Правильно! Раздельно существительное будет писаться в случае наличия дополнительного слова между существительным и частицей. Правильный ответ: полдеревни пишется слитно. Зараз (ударение на второй слог) — это обстоятельственное наречие, пишется слитно. Означает быстро, одним махом."
    },
    {
        q: "А эти слова как пишутся?",
        answers: [
            { t: "Капуччино и эспрессо", ok: false },
            { t: "Каппуччино и экспрессо", ok: false },
            { t: "Капучино и эспрессо", ok: true }
        ],
        why: "Конечно! По орфографическим нормам русского языка единственно верным написанием будут «капучино» и «эспрессо»."
    },
    {
        q: "Как нужно писать?",
        answers: [
            { t: "Черезчур", ok: false },
            { t: "Черес-чур", ok: false },
            { t: "Чересчур", ok: true }
        ],
        why: "Да! Это слово появилось от соединения предлога «через» и древнего слова «чур», которое означает «граница», «край». Но слово претерпело изменения, так что правильное написание учим наизусть — «чересчур»."
    },
    {
        q: "Где допущена ошибка?",
        answers: [
            { t: "Аккордеон", ok: false },
            { t: "Белиберда", ok: false },
            { t: "Эпелепсия", ok: true }
        ],
        why: "Верно! Это слово пишется так: «эпИлепсия»."
    },
    {
        q: "В каких предложениях слово «одевать» употреблено правильно с точки зрения литературной нормы?",
        answers: [
            { t: "Мама одевает ребёнка перед прогулкой.", ok: true },
            { t: "Он одевает пальто и выходит на улицу.", ok: false },
            { t: "Стилист одевает клиента перед фотосессией.", ok: true },
            { t: "Она одевает шапку и бежит на работу.", ok: false }
        ],
        why: "Глагол «одевать» — переходный: он употребляется, когда кто-то одевает кого-то другого (ребёнка, клиента)."
    }
];

// перемешивание 
function shuffle(arr) {
    return arr.slice().sort(() => Math.random() - 0.5);
}

// состояние 
let questions = shuffle(data);
let index = 0;
let correct = 0;

console.log(questions);

const quizEl = document.getElementById("quiz");
const finishedEl = document.getElementById("finished");
const statsEl = document.getElementById("stats");

const WAIT_CORRECT = 4000;  // сколько висит правильный ответ
const ANIM_TIME = 600;      // время анимации 
const SLIDE_DELAY = 300;    // задержка между улетами ответов

// текущий вопрос 
function showQuestion() {
    if (index >= questions.length) return finish();

    const item = questions[index];

    // карточка вопроса 
    const block = document.createElement("div");
    block.className = "q";

    const title = document.createElement("h3");
    title.innerHTML = `<span>${index + 1}. ${item.q}</span><span class="mark"></span>`;
    block.appendChild(title);

    // контейнер для ответов 
    const answersWrap = document.createElement("div");
    answersWrap.className = "answers";

    const answers = shuffle(item.answers);

    answers.forEach(ans => {
        const el = document.createElement("div");
        el.className = "answer";
        el.textContent = ans.t;
        el.dataset.ok = ans.ok ? "1" : "0";   // сохраняем правильность
        el.onclick = () => handleAnswer(block, answersWrap, el, ans, item);
        answersWrap.appendChild(el);
    });

    block.appendChild(answersWrap);
    quizEl.appendChild(block);
}

// ответ 
function handleAnswer(block, answersWrap, el, ans, item) {
    if (block.classList.contains("done")) return;
    block.classList.add("done");

    el.classList.add("selected");

    const mark = block.querySelector(".mark");
    const all  = block.querySelectorAll(".answer");

    if (ans.ok) {
        correct++;
        el.classList.add("correct");
        mark.textContent = "✔";
        mark.style.color = "green";

        // пояснение 
        const exp = document.createElement("div");
        exp.className = "explain show";
        exp.textContent = item.why;
        el.appendChild(exp);

        // уезд
        const wrongs = Array.from(all).filter(a => a !== el).reverse();
        wrongs.forEach((a, i) => {
            setTimeout(() => a.classList.add("hide"), i * SLIDE_DELAY);
        });

        setTimeout(() => el.classList.add("hide"), WAIT_CORRECT);
        setTimeout(() => { index++; showQuestion(); }, WAIT_CORRECT + ANIM_TIME);
        setTimeout(() => answersWrap.classList.add("collapsed"), WAIT_CORRECT + ANIM_TIME);

    } else {
        mark.textContent = "✖";
        mark.style.color = "red";

        // уезд
        Array.from(all).reverse().forEach((a, i) => {
            setTimeout(() => a.classList.add("hide"), i * SLIDE_DELAY);
        });

        const slideTime = all.length * SLIDE_DELAY;
        setTimeout(() => { index++; showQuestion(); }, slideTime + ANIM_TIME);
        setTimeout(() => answersWrap.classList.add("collapsed"), slideTime + ANIM_TIME);
    }
}

// финал 
function finish() {
    finishedEl.classList.add("show");
    statsEl.textContent = `Правильных ответов: ${correct} из ${questions.length}`;
    statsEl.classList.add("show");

    quizEl.querySelectorAll(".q").forEach((q, i) => {
        q.classList.add("reveal");

        // находим правильный ответ
        const item = questions[i];
        const correctEls = Array.from(q.querySelectorAll(".answer")).filter(a => a.dataset.ok === "1");

        q.onclick = () => {
            // если этот вопрос открыт, закрываем
            if (q.classList.contains("revealed")) {
                q.classList.remove("revealed");
                correctEls.forEach(el => el.classList.remove("reveal-answer"));
                q.querySelector(".explain")?.classList.remove("show");
                return;
            }

            // закрываем все остальные вопросы
            quizEl.querySelectorAll(".q").forEach(other => {
                other.classList.remove("revealed");
                other.querySelector(".reveal-answer")?.classList.remove("reveal-answer");
                other.querySelector(".explain.show")?.classList.remove("show");
            });

            // открываем текущий
            q.classList.add("revealed");

            correctEls.forEach(correctEl => {
                correctEl.classList.remove("selected");
                correctEl.classList.add("reveal-answer", "correct");

                let exp = correctEl.querySelector(".explain");
                if (!exp) {
                    exp = document.createElement("div");
                    exp.className = "explain";
                    exp.textContent = item.why;
                    correctEl.appendChild(exp);
                }
                exp.classList.add("show");
            });
        };
    });
}

showQuestion();