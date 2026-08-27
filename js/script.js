/* ==========================================================
   ملف التشغيل البرمجي الرئيسي - شلبي ♥ بوو (نسخة نهائية ومضبوطة)
   Eng. Mohamed Sami
   ========================================================== */

// 1. تفعيل الـ Navbar والتمرير والسكرول
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('show-menu');
    });
}

document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    if (navMenu) navMenu.classList.remove('show-menu');
}));

window.addEventListener('scroll', () => {
    const scrollProgress = document.getElementById('scroll-progress');
    const scrollTopBtn = document.getElementById('scroll-top');
    
    if (scrollProgress) {
        const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        scrollProgress.style.width = progress + '%';
    }
    
    if (scrollTopBtn) {
        if (window.scrollY > 400) {
            scrollTopBtn.style.display = 'flex';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    }
});

// 2. كتابة نصوص الهيرو المتحركة وبدء الأحداث
document.addEventListener("DOMContentLoaded", () => {
    initHeroTyping();
    initQuizDataSync();
    displayWishes();
    displaySharedCapsules();
    displayPromises();
    displayBooLog();
    loadDailyNote();
    loadStickyNotes();
    renderAdminWishesList();
    renderAdminPromisesList();
    renderAdminCapsulesList();
});

function initHeroTyping() {
    const words = ["أحلى صدفة في عمري ♥", "توأم روحي وكتكوتي الجميلة 🌸", "أجمل بوو في الكون كله ✨"];
    let i = 0;
    
    function typingEffect() {
        const word = words[i];
        let j = 0;
        const target = document.getElementById("typing-text");
        if (!target) return;
        
        target.textContent = "";
        
        function typing() {
            if (j < word.length) {
                target.textContent += word.charAt(j);
                j++;
                setTimeout(typing, 100);
            } else {
                setTimeout(deleting, 2000);
            }
        }
        
        function deleting() {
            if (j > 0) {
                target.textContent = word.substring(0, j - 1);
                j--;
                setTimeout(deleting, 50);
            } else {
                i = (i + 1) % words.length;
                setTimeout(typing, 500);
            }
        }
        typing();
    }
    typingEffect();
}

// 3. عداد الوقت
const startDate = new Date("2025-05-05T17:00:00");

function updateCounter() {
    const now = new Date();
    const diff = now - startDate;
    
    if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        
        if (document.getElementById("days")) document.getElementById("days").textContent = days;
        if (document.getElementById("hours")) document.getElementById("hours").textContent = hours;
        if (document.getElementById("minutes")) document.getElementById("minutes").textContent = minutes;
        if (document.getElementById("seconds")) document.getElementById("seconds").textContent = seconds;
    }
}
setInterval(updateCounter, 1000);
updateCounter();

// 4. اختبار الحكايات وإضافة الأسئلة وحذفها
const defaultQuizData = [
    { question: "إيه أكتر كلمة أو لقب بحب أنادي بيه بوو؟", options: ["يا ستي", "يا بوو", "يا بنوتي", "يا صدفة"], correct: 1 },
    { question: "إحنا اتعرفنا على بعض في أنهي وقت تقريباً؟", options: ["الصبح بدري", "الوسط اليوم", "بالليل متأخر", "الصدفة جت فجأة"], correct: 3 },
    { question: "أكتر حاجة بحبها فيكي يا بوو؟", options: ["ضحكتك وطيبتك", "كلامك اللطيف", "عفويتك", "كل ما سبق بلا استثناء ❤️"], correct: 3 },
    { question: "لو اتقابلنا أول مرة، أول حاجة هعملها إيه؟", options: ["هتكسف وأسكت", "هبتسم  ", "أقولك أخيرًا شفتك!", "كل العبارات صحيحة"], correct: 2 }
];

let currentQuizIndex = 0;
let quizScore = 0;

function initQuizDataSync() {
    loadQuiz();
    renderAdminQuestionsList();
}

function getAllQuizData() {
    let customQ = JSON.parse(localStorage.getItem('custom_quiz_questions') || '[]');
    return [...defaultQuizData, ...customQ];
}

window.loadQuiz = function() {
    const qNum = document.getElementById("current-q-num");
    const totalQ = document.getElementById("total-q-num");
    const qText = document.getElementById("quiz-question");
    const optionsArea = document.getElementById("quiz-options");
    const feedback = document.getElementById("quiz-feedback");
    const nextBtn = document.getElementById("next-q-btn");

    if (!qText) return;

    const quizData = getAllQuizData();
    if (totalQ) totalQ.textContent = quizData.length;
    if (qNum) qNum.textContent = currentQuizIndex + 1;
    
    if (feedback) { feedback.textContent = ""; feedback.style.color = "var(--text-color)"; }
    if (nextBtn) nextBtn.style.display = "none";

    if (currentQuizIndex >= quizData.length) { currentQuizIndex = 0; }

    const currentQ = quizData[currentQuizIndex];
    qText.textContent = currentQ.question;
    optionsArea.innerHTML = "";

    currentQ.options.forEach((opt, index) => {
        const btn = document.createElement("button");
        btn.textContent = opt;
        btn.className = "btn";
        btn.style.cssText = "background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); color: var(--text-color); padding: 12px; text-align: center; border-radius: 12px; font-size: 1rem; cursor: pointer;";
        btn.onclick = () => selectQuizOption(index, currentQ.correct, btn);
        optionsArea.appendChild(btn);
    });
}

function selectQuizOption(selected, correct, btnElement) {
    const optionsArea = document.getElementById("quiz-options");
    const feedback = document.getElementById("quiz-feedback");
    const nextBtn = document.getElementById("next-q-btn");

    const buttons = optionsArea.getElementsByTagName("button");
    for (let b of buttons) { b.disabled = true; }

    if (selected === correct) {
        btnElement.style.background = "rgba(34, 197, 94, 0.2)";
        btnElement.style.borderColor = "#22c55e";
        if(feedback) { feedback.style.color = "#22c55e"; feedback.textContent = "برافو عليكِ يا شطورة! إجابة صحيحة ✨❤️"; }
        quizScore++;
    } else {
        btnElement.style.background = "rgba(239, 68, 68, 0.2)";
        btnElement.style.borderColor = "#ef4444";
        buttons[correct].style.background = "rgba(34, 197, 94, 0.2)";
        buttons[correct].style.borderColor = "#22c55e";
        if(feedback) { feedback.style.color = "#ef4444"; feedback.textContent = "معلش يا حب، الإجابة مش صح بس بنتعلم سوا! 😉"; }
    }
    if(nextBtn) nextBtn.style.display = "inline-block";
}

const nextQuizBtn = document.getElementById("next-q-btn");
if (nextQuizBtn) {
    nextQuizBtn.onclick = () => {
        const quizData = getAllQuizData();
        currentQuizIndex++;
        if (currentQuizIndex < quizData.length) { loadQuiz(); } else { showQuizResult(); }
    };
}

function showQuizResult() {
    document.getElementById("quiz-play-area").style.display = "none";
    const resultArea = document.getElementById("quiz-result-area");
    const resultText = document.getElementById("quiz-result-text");
    resultArea.style.display = "block";
    const quizData = getAllQuizData();
    resultText.innerHTML = `جبتي <span style="color:var(--accent-primary); font-weight:bold;">${quizScore}</span> من <span style="font-weight:bold;">${quizData.length}</span><br>أنتِ فظيعة وبتعرفي كل تفاصيلنا يا بوو ❤️`;
}

function restartQuiz() {
    currentQuizIndex = 0;
    quizScore = 0;
    document.getElementById("quiz-result-area").style.display = "none";
    document.getElementById("quiz-play-area").style.display = "block";
    loadQuiz();
}

function toggleAddQuestionForm() {
    const form = document.getElementById('add-question-form');
    if (form) { form.style.display = form.style.display === 'flex' ? 'none' : 'flex'; }
}

function toggleManageQuestions() {
    const box = document.getElementById('manage-questions-box');
    if (box) {
        box.style.display = box.style.display === 'block' ? 'none' : 'block';
        if(box.style.display === 'block') { renderAdminQuestionsList(); }
    }
}

window.renderAdminQuestionsList = function() {
    const listContainer = document.getElementById('custom-questions-list-admin');
    if (!listContainer) return;
    let customQuestions = JSON.parse(localStorage.getItem('custom_quiz_questions') || '[]');
    if (customQuestions.length === 0) { listContainer.innerHTML = '<span style="color: var(--text-muted); text-align: center; display: block;">لا توجد أسئلة مضافة ✨</span>'; return; }
    listContainer.innerHTML = '';
    customQuestions.forEach((q, idx) => {
        const item = document.createElement('div');
        item.style.cssText = "display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 6px 10px; border-radius: 6px; border: 1px solid var(--glass-border);";
        item.innerHTML = `<span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 220px;">${idx + 1}. ${q.question}</span> <button onclick="deleteCustomQuestion(${idx})" style="background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; color: #ef4444; padding: 3px 8px; border-radius: 4px; cursor: pointer; font-size: 0.75rem;">حذف</button>`;
        listContainer.appendChild(item);
    });
}

window.deleteCustomQuestion = function(index) {
    let customQuestions = JSON.parse(localStorage.getItem('custom_quiz_questions') || '[]');
    if (index > -1 && index < customQuestions.length) {
        customQuestions.splice(index, 1);
        localStorage.setItem('custom_quiz_questions', JSON.stringify(customQuestions));
        if (typeof window.updateCloudData === 'function') { window.updateCloudData({ customQuestions: customQuestions }); }
        currentQuizIndex = 0; loadQuiz(); renderAdminQuestionsList();
        alert("🗑️ تم حذف السؤال بنجاح!");
    }
}

function addNewQuestionToBank() {
    const qText = document.getElementById('new-q-text').value.trim();
    const opt1 = document.getElementById('new-opt-0').value.trim();
    const opt2 = document.getElementById('new-opt-1').value.trim();
    const opt3 = document.getElementById('new-opt-2').value.trim();
    const opt4 = document.getElementById('new-opt-3').value.trim();
    let correctIdx = parseInt(document.getElementById('new-correct-idx').value) - 1;

    if (!qText || !opt1 || !opt2 || !opt3 || !opt4) { alert("من فضلك اكتبي السؤال وكل الخيارات!"); return; }

    let customQuestions = JSON.parse(localStorage.getItem('custom_quiz_questions') || '[]');
    customQuestions.push({ question: qText, options: [opt1, opt2, opt3, opt4], correct: correctIdx });
    
    localStorage.setItem('custom_quiz_questions', JSON.stringify(customQuestions));
    if (typeof window.updateCloudData === 'function') { window.updateCloudData({ customQuestions: customQuestions }); }

    alert("تم إضافة السؤال بنجاح ومزامنته مع بوو! 🎉✨");
    document.getElementById('new-q-text').value = '';
    document.getElementById('new-opt-0').value = '';
    document.getElementById('new-opt-1').value = '';
    document.getElementById('new-opt-2').value = '';
    document.getElementById('new-opt-3').value = '';
    toggleAddQuestionForm(); loadQuiz(); renderAdminQuestionsList();
}


// 5. الأمنيات والكبسولات والوعود
function submitWish() {
    const input = document.getElementById("wishing-input");
    const val = input.value.trim();
    if(!val) { alert("اكتبي الأمنية الأول!"); return; }

    let wishes = JSON.parse(localStorage.getItem('boo_wishes_list') || '[]');
    wishes.unshift(val);
    localStorage.setItem('boo_wishes_list', JSON.stringify(wishes));
    input.value = ""; displayWishes(); renderAdminWishesList();
    
    if(typeof window.updateCloudData === 'function') { window.updateCloudData({ wishes: wishes }); }
    alert("✨ تمت إضافة أمنيتك بنجاح!");
}

window.displayWishes = function() {
    const list = document.getElementById("wishes-list");
    if(!list) return;
    let wishes = JSON.parse(localStorage.getItem('boo_wishes_list') || '[]');
    if(wishes.length === 0) { list.innerHTML = '<li style="color: var(--text-muted); text-align: center;">الأمنيات المرسومة ستظهر هنا... ✨</li>'; return; }
    list.innerHTML = "";
    wishes.forEach(w => {
        const li = document.createElement('li');
        li.style.cssText = "margin-bottom: 5px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 3px;";
        li.innerHTML = `⭐ ${w}`;
        list.appendChild(li);
    });
}

function toggleManageWishes() {
    const box = document.getElementById('manage-wishes-box');
    if (box) { box.style.display = box.style.display === 'block' ? 'none' : 'block'; if(box.style.display === 'block') renderAdminWishesList(); }
}

function renderAdminWishesList() {
    const container = document.getElementById('wishes-list-admin');
    if (!container) return;
    let wishes = JSON.parse(localStorage.getItem('boo_wishes_list') || '[]');
    if (wishes.length === 0) { container.innerHTML = '<span style="color: var(--text-muted); text-align: center; display: block;">لا توجد أمنيات</span>'; return; }
    container.innerHTML = '';
    wishes.forEach((w, idx) => {
        const item = document.createElement('div');
        item.style.cssText = "display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 4px 8px; border-radius: 4px;";
        item.innerHTML = `<span>${w}</span> <button onclick="deleteWish(${idx})" style="background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; color: #ef4444; padding: 2px 6px; border-radius: 3px; cursor: pointer; font-size: 0.7rem;">حذف</button>`;
        container.appendChild(item);
    });
}

window.deleteWish = function(index) {
    let wishes = JSON.parse(localStorage.getItem('boo_wishes_list') || '[]');
    if (index > -1 && index < wishes.length) {
        wishes.splice(index, 1);
        localStorage.setItem('boo_wishes_list', JSON.stringify(wishes));
        if (typeof window.updateCloudData === 'function') { window.updateCloudData({ wishes: wishes }); }
        displayWishes(); renderAdminWishesList();
    }
}

function saveSharedCapsule() {
    const author = document.getElementById("capsule-author").value;
    const title = document.getElementById("capsule-title").value.trim();
    const content = document.getElementById("capsule-content").value.trim();
    const date = document.getElementById("capsule-date").value;

    if (!title || !content || !date) { alert("املأ جميع خانات الكبسولة!"); return; }

    let capsules = JSON.parse(localStorage.getItem('shared_capsules_list') || '[]');
    capsules.unshift({ author: author, title: title, content: content, date: date });
    localStorage.setItem('shared_capsules_list', JSON.stringify(capsules));
    
    document.getElementById("capsule-title").value = "";
    document.getElementById("capsule-content").value = "";
    document.getElementById("capsule-date").value = "";

    displaySharedCapsules(); renderAdminCapsulesList();
    if(typeof window.updateCloudData === 'function') { window.updateCloudData({ capsules: capsules }); }
    alert("🔒 تم قفل الكبسولة بنجاح!");
}

window.displaySharedCapsules = function() {
    const shelf = document.getElementById("capsules-shelf");
    if (!shelf) return;
    let capsules = JSON.parse(localStorage.getItem('shared_capsules_list') || '[]');
    if (capsules.length === 0) { shelf.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 10px;">لا توجد كبسولات مسجلة ✨</div>'; return; }

    const todayStr = new Date().toISOString().split('T')[0];
    shelf.innerHTML = "";
    capsules.forEach((cap) => {
        const isUnlocked = todayStr >= cap.date;
        const itemDiv = document.createElement("div");
        itemDiv.style.cssText = `background: rgba(255, 255, 255, 0.03); border: 1px solid ${isUnlocked ? 'var(--accent-secondary)' : 'var(--glass-border)'}; padding: 12px 15px; border-radius: 12px; display: flex; flex-direction: column; gap: 6px;`;
        let innerHtml = `<div style="display: flex; justify-content: space-between; align-items: center;"><span style="font-weight: bold; color: var(--accent-primary);">${cap.author}: ${cap.title}</span><span style="font-size: 0.8rem; color: var(--accent-secondary);"><i class="fa-regular fa-calendar-days"></i> ${cap.date}</span></div>`;
        if (isUnlocked) {
            innerHtml += `<div style="margin-top: 8px; padding: 10px; background: rgba(236,72,153,0.05); border-radius: 8px; font-size: 0.9rem;">🔓 <b>المحتوى:</b> ${cap.content}</div>`;
        } else {
            innerHtml += `<div style="margin-top: 5px; font-size: 0.85rem; color: var(--text-muted);"><i class="fa-solid fa-lock"></i> مغلقة حتى موعد فتحها 🔒</div>`;
        }
        itemDiv.innerHTML = innerHtml;
        shelf.appendChild(itemDiv);
    });
}

function toggleManageCapsules() {
    const box = document.getElementById('manage-capsules-box');
    if (box) { box.style.display = box.style.display === 'block' ? 'none' : 'block'; if(box.style.display === 'block') renderAdminCapsulesList(); }
}

function renderAdminCapsulesList() {
    const container = document.getElementById('capsules-list-admin');
    if (!container) return;
    let capsules = JSON.parse(localStorage.getItem('shared_capsules_list') || '[]');
    if (capsules.length === 0) { container.innerHTML = '<span style="color: var(--text-muted); text-align: center; display: block;">لا توجد كبسولات</span>'; return; }
    container.innerHTML = '';
    capsules.forEach((c, idx) => {
        const item = document.createElement('div');
        item.style.cssText = "display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 4px 8px; border-radius: 4px;";
        item.innerHTML = `<span>${c.author}: ${c.title}</span> <button onclick="deleteCapsule(${idx})" style="background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; color: #ef4444; padding: 2px 6px; border-radius: 3px; cursor: pointer; font-size: 0.7rem;">حذف</button>`;
        container.appendChild(item);
    });
}

window.deleteCapsule = function(index) {
    let capsules = JSON.parse(localStorage.getItem('shared_capsules_list') || '[]');
    if (index > -1 && index < capsules.length) {
        capsules.splice(index, 1);
        localStorage.setItem('shared_capsules_list', JSON.stringify(capsules));
        if (typeof window.updateCloudData === 'function') { window.updateCloudData({ capsules: capsules }); }
        displaySharedCapsules(); renderAdminCapsulesList();
    }
}

function submitPromise() {
    const author = document.getElementById("promise-author").value;
    const input = document.getElementById("promise-input");
    const val = input.value.trim();
    if(!val) { alert("اكتب الوعد الأول!"); return; }

    let promises = JSON.parse(localStorage.getItem('our_promises_list') || '[]');
    promises.unshift({ author: author, text: val });
    localStorage.setItem('our_promises_list', JSON.stringify(promises));
    input.value = ""; displayPromises(); renderAdminPromisesList();
    
    if(typeof window.updateCloudData === 'function') { window.updateCloudData({ promises: promises }); }
    alert("💍 تم حفظ الوعد بنجاح!");
}

window.displayPromises = function() {
    const list = document.getElementById("promises-list");
    if(!list) return;
    let promises = JSON.parse(localStorage.getItem('our_promises_list') || '[]');
    if(promises.length === 0) { list.innerHTML = '<li style="color: var(--text-muted); text-align: center;">العهود والوعود ستظهر هنا... ✨</li>'; return; }
    list.innerHTML = "";
    promises.forEach(p => {
        const li = document.createElement('li');
        li.style.cssText = "margin-bottom: 6px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 4px;";
        li.innerHTML = `💍 <b>${p.author}:</b> ${p.text}`;
        list.appendChild(li);
    });
}

function toggleManagePromises() {
    const box = document.getElementById('manage-promises-box');
    if (box) { box.style.display = box.style.display === 'block' ? 'none' : 'block'; if(box.style.display === 'block') renderAdminPromisesList(); }
}

function renderAdminPromisesList() {
    const container = document.getElementById('promises-list-admin');
    if (!container) return;
    let promises = JSON.parse(localStorage.getItem('our_promises_list') || '[]');
    if (promises.length === 0) { container.innerHTML = '<span style="color: var(--text-muted); text-align: center; display: block;">لا توجد وعود</span>'; return; }
    container.innerHTML = '';
    promises.forEach((p, idx) => {
        const item = document.createElement('div');
        item.style.cssText = "display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 4px 8px; border-radius: 4px;";
        item.innerHTML = `<span>${p.author}: ${p.text}</span> <button onclick="deletePromise(${idx})" style="background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; color: #ef4444; padding: 2px 6px; border-radius: 3px; cursor: pointer; font-size: 0.7rem;">حذف</button>`;
        container.appendChild(item);
    });
}

window.deletePromise = function(index) {
    let promises = JSON.parse(localStorage.getItem('our_promises_list') || '[]');
    if (index > -1 && index < promises.length) {
        promises.splice(index, 1);
        localStorage.setItem('our_promises_list', JSON.stringify(promises));
        if (typeof window.updateCloudData === 'function') { window.updateCloudData({ promises: promises }); }
        displayPromises(); renderAdminPromisesList();
    }
}

function logBooAction(actionDescription) {
    const responseDiv = document.getElementById("mood-response");
    if(responseDiv) { responseDiv.style.display = "block"; }

    let logs = JSON.parse(localStorage.getItem('boo_activity_history') || '[]');
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    logs.unshift({ text: actionDescription, time: timeString });
    if (logs.length > 10) logs.pop();
    
    localStorage.setItem('boo_activity_history', JSON.stringify(logs));
    displayBooLog();
    if(typeof window.updateCloudData === 'function') { window.updateCloudData({ logs: logs }); }
}

window.displayBooLog = function() {
    const logContainer = document.getElementById('boo-activity-log');
    if (!logContainer) return;
    let logs = JSON.parse(localStorage.getItem('boo_activity_history') || '[]');
    if (logs.length === 0) { logContainer.innerHTML = '<li style="color: var(--text-muted); text-align: center;">لا توجد أنشطة مسجلة 🌸</li>'; return; }
    logContainer.innerHTML = "";
    logs.forEach(log => {
        const li = document.createElement('li');
        li.style.cssText = "margin-bottom: 5px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 3px; display: flex; justify-content: space-between;";
        li.innerHTML = `<span>⚡ ${log.text}</span> <span style="font-size: 0.75rem; color: var(--accent-secondary);">${log.time}</span>`;
        logContainer.appendChild(li);
    });
}

function clearBooLog() {
    localStorage.removeItem('boo_activity_history');
    displayBooLog();
    if(typeof window.updateCloudData === 'function') { window.updateCloudData({ logs: [] }); }
}

const dailyNotes = [
    "صباح الخير على روح قلبي، يا رب يومك يكون خفيف وسعيد زيك! ❤️",
    "فكرت فيكي النهاردة لقيتني ببتسم لوحدي.. ربنا ما يحرمني منك أبداً. ✨",
    "مهما كان يومك متعب، افتكري إن فيه حد بيحبك ويدعيلك دايماً. 🌸",
    "إنتي أحلى حاجة حصلت في حياتي! 🥰",
    "عارف إنك شطورة وهتعدي أي حاجة صعبة النهاردة بكل إيجابية، بالتوفيق يا جميلتي! 💪"
];

function loadDailyNote() {
    const noteElement = document.getElementById("daily-note-text");
    if (!noteElement) return;
    const today = new Date();
    const dayIndex = (today.getFullYear() + today.getMonth() + today.getDate()) % dailyNotes.length;
    noteElement.textContent = dailyNotes[dayIndex];
}

const stickyNotesData = [
    { text: "اهتمي ب صحتك يبوو وكلي واشربي كويس بحبك ! 💧", color: "rgba(56, 189, 248, 0.15)", border: "#38bdf8" },
    { text: "أنتِ أشطر كتكوته واجمل صدفة في حياتي كلها. ✨", color: "rgba(236, 72, 153, 0.15)", border: "#ec4899" },
    { text: "مستني اليوم اللي نتقابل فيه بفارغ الصبر. ⏳", color: "rgba(250, 204, 21, 0.15)", border: "#facc15" }
];

function loadStickyNotes() {
    const board = document.getElementById("sticky-notes-board");
    if (!board) return;
    board.innerHTML = "";
    stickyNotesData.forEach(note => {
        const noteCard = document.createElement("div");
        noteCard.style.cssText = `background: ${note.color}; border: 1px solid ${note.border}; padding: 15px; border-radius: 12px; width: 200px; min-height: 100px; display: flex; align-items: center; text-align: center; justify-content: center; font-size: 0.95rem; color: var(--text-color); box-shadow: 0 4px 10px rgba(0,0,0,0.1); transform: rotate(${Math.floor(Math.random() * 6) - 3}deg);`;
        noteCard.textContent = note.text;
        board.appendChild(noteCard);
    });
}

function openWhenBox(type) {
    const resultDiv = document.getElementById("open-when-result");
    let message = "";
    if (type === 'sad') {
        message = "يا روحي حقك عليا اضحكي كده عشان زعلدك بيزعلني أنا كمان! حقك عليا لو ضايقتك في حاجة. 🧸❤️";
        logBooAction('فتحَت صندوق: افتحيها لو زعلانة 🥺');
    } else if (type === 'miss') {
        message = "وأنتي كمان وحشتيني يقلبي قريباً هنقضي وقت طويل سوا ونعوض كل ثانية عدت واحنا بعيد. ⏱️✨";
        logBooAction('فتحَت صندوق: افتحيها لو وحشتك 💭');
    } else if (type === 'sleep') {
        message = "اقفلي عيونك الحلوة دي ونامي مرتاحة، واعرفي إن أول حد هيصبح عليكي بكره هو أنا.. تصبحي على ألف خير وأحلام سعيدة! 🌙💤";
        logBooAction('فتحَت صندوق: افتحيها قبل ما تنامي 🌙');
    }
    if(resultDiv) { resultDiv.innerHTML = `<div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 10px; border: 1px dashed var(--accent-secondary);">${message}</div>`; }
}

const loveReasons = [
    "بحبك عشان ضحكتك بتغير مود يومي كله لأجمل حاجة في الدنيا! 😄❤️",
    "بحبك عشان إنتي أقرب إنسانة لقلبي وبحس معاكي بالراحة والسلام النفسي. 🌸",
    "بحبك على كل تفصيلة كيوته في كلامك وعفويتك. ✨",
    "بحبك عشان إنتي الصدفة الوحيدة اللي أتمنى تفضل مكملة معايا للأبد. ⏳",
    "بحبك لأنك بتبقي سند وكتف أطمن له وقت التعب. 🧸"
];
function showRandomLoveReason() {
    const box = document.getElementById("love-reason-box");
    const randomReason = loveReasons[Math.floor(Math.random() * loveReasons.length)];
    box.textContent = randomReason;
    logBooAction('فتشت في صندوق أسباب الحب ❤️');
}


// 9. لعبة الـ XO المتصلة سحابياً بالكامل (Realtime DB مباشرة)
let xoBoard = ['', '', '', '', '', '', '', '', ''];
let currentXOPlayer = 'O'; 
let gameActive = true;
let gameMode = 'ai'; 
let myXOSymbol = 'O';

function setGameMode(mode) {
    gameMode = mode;
    document.getElementById('mode-ai-btn').className = mode === 'ai' ? 'btn btn-primary' : 'btn';
    document.getElementById('mode-friend-btn').className = mode === 'friend' ? 'btn btn-primary' : 'btn';
    document.getElementById('mode-online-btn').className = mode === 'online' ? 'btn btn-primary' : 'btn';
    
    if(mode === 'online') {
        document.getElementById('online-setup-area').style.display = 'flex';
    } else {
        document.getElementById('online-setup-area').style.display = 'none';
    }
    resetXOGame();
}

window.updateXOGameFromCloud = function(cloudXOData) {
    if (!cloudXOData) return;
    xoBoard = cloudXOData.board || ['', '', '', '', '', '', '', '', ''];
    currentXOPlayer = cloudXOData.currentPlayer || 'O';
    gameActive = cloudXOData.gameActive !== undefined ? cloudXOData.gameActive : true;
    
    xoBoard.forEach((val, idx) => {
        const cell = document.querySelector(`[data-cell-index='${idx}']`);
        if (cell) {
            cell.textContent = val;
            cell.style.color = val === 'O' ? 'var(--accent-secondary)' : 'var(--accent-primary)';
        }
    });
    updateXOStatusText();
    checkXOWinner();
};

function handleCellClick(index) {
    if (xoBoard[index] !== '' || !gameActive) return;

    if (gameMode === 'online') {
        if (currentXOPlayer !== myXOSymbol) {
            alert("مش دورك دلوقتي! استنى دورك ⏳");
            return;
        }
        
        let newBoard = [...xoBoard];
        newBoard[index] = myXOSymbol;
        let nextPlayer = myXOSymbol === 'O' ? 'X' : 'O';
        
        let cloudXOData = {
            board: newBoard,
            currentPlayer: nextPlayer,
            gameActive: true
        };

        if (typeof window.updateCloudData === 'function') {
            window.updateCloudData({ xoGame: cloudXOData });
        }
    } 
    else if (gameMode === 'friend') {
        makeMove(index, currentXOPlayer);
    }
    else if (gameMode === 'ai') {
        makeMove(index, 'O');
        if (gameActive) {
            setTimeout(() => { aiMakeMove(); }, 400);
        }
    }
}

function makeMove(index, symbol) {
    xoBoard[index] = symbol;
    const cell = document.querySelector(`[data-cell-index='${index}']`);
    if(cell) {
        cell.textContent = symbol;
        cell.style.color = symbol === 'O' ? 'var(--accent-secondary)' : 'var(--accent-primary)';
    }
    checkXOWinner();
    if (gameActive) {
        currentXOPlayer = currentXOPlayer === 'O' ? 'X' : 'O';
        updateXOStatusText();
    }
}

function updateXOStatusText() {
    const status = document.getElementById('game-status');
    if(!status) return;
    if (gameMode === 'ai') {
        status.textContent = currentXOPlayer === 'O' ? "دور بوو (O) 🌸" : "دور شلبي (X) 🤖";
    } else if (gameMode === 'friend') {
        status.textContent = `دور اللاعب (${currentXOPlayer})`;
    } else if (gameMode === 'online') {
        status.textContent = currentXOPlayer === myXOSymbol ? `دورك أنت (${myXOSymbol}) ✨` : `دور الخصم (${currentXOPlayer}) ⏳`;
    }
}

function aiMakeMove() {
    if (!gameActive) return;
    let emptyCells = [];
    xoBoard.forEach((val, idx) => {
        if (val === '') emptyCells.push(idx);
    });
    if (emptyCells.length > 0) {
        let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        makeMove(randomIndex, 'X');
    }
}

const winningConditions = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
];

function checkXOWinner() {
    let roundWon = false;
    let winnerSymbol = '';
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (xoBoard[a] && xoBoard[a] === xoBoard[b] && xoBoard[a] === xoBoard[c]) {
            roundWon = true;
            winnerSymbol = xoBoard[a];
            break;
        }
    }

    const status = document.getElementById('game-status');
    const shareBtn = document.getElementById('xo-share-btn');

    if (roundWon) {
        if(status) status.textContent = `فاز اللاعب (${winnerSymbol}) 🎉✨`;
        gameActive = false;
        if (shareBtn) shareBtn.style.display = "block";
        return;
    }

    if (!xoBoard.includes('') && xoBoard.some(c => c !== '')) {
        if(status) status.textContent = "تعادلنا! اللعبة خلصت تعادل 🤝";
        gameActive = false;
        if (shareBtn) shareBtn.style.display = "block";
        return;
    }
}

function resetXOGame() {
    xoBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentXOPlayer = 'O';
    document.querySelectorAll('.xo-cell').forEach(cell => {
        cell.textContent = '';
        cell.style.color = '';
    });
    const shareBtn = document.getElementById('xo-share-btn');
    if (shareBtn) shareBtn.style.display = "none";
    updateXOStatusText();
    
    let cloudXOData = {
        board: xoBoard,
        currentPlayer: 'O',
        gameActive: true
    };

    if (gameMode === 'online' && typeof window.updateCloudData === 'function') {
        window.updateCloudData({ xoGame: cloudXOData });
    }
}

function shareXOResult() {
    const statusText = document.getElementById('game-status').textContent;
    const url = `https://wa.me/?text=${encodeURIComponent("يا شلبي أنا لعبت تحدي الـ XO ونتيجة الجيم كانت: " + statusText + " 😉🔥")}`;
    window.open(url, '_blank');
}

function hostOnlineGame() {
    myXOSymbol = 'O';
    alert("أنت تلعب الآن برمز (O) 🌸. الجيم متزامن مع بوو أونلاين!");
    resetXOGame();
}

function joinOnlineGame() {
    myXOSymbol = 'X';
    alert("أنتِ تلعبين الآن برمز (X) 🤖. الجيم متزامن ومباشر!");
    updateXOStatusText();
}


// 10. الرقم السري للرسالة الخاصة
function checkPassword() {
    const passInput = document.getElementById("password-input").value;
    const lockSection = document.getElementById("lock-section");
    const hiddenMsg = document.getElementById("hidden-message");
    const secretCode = "1234"; 

    if (passInput === secretCode) {
        lockSection.style.display = "none";
        hiddenMsg.style.display = "block";
    } else {
        alert("كلمة السر مش صحيحة يا بوو.. حاولي تاني! 🔒");
    }
}
// ==========================================
// نظام تسجيل وتخزين الفويس نوتس سحابياً
// ==========================================
let mediaRecorder;
let audioChunks = [];

function startAudioRecording() {
    audioChunks = [];
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            
            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                const reader = new FileReader();
                reader.readAsDataURL(audioBlob);
                reader.onloadend = () => {
                    const base64AudioMessage = reader.result;
                    saveVoiceNoteToCloud(base64AudioMessage);
                };
                
                // إيقاف استخدام الميكروفون
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            document.getElementById('start-record-btn').disabled = true;
            document.getElementById('stop-record-btn').disabled = false;
            document.getElementById('recording-status').textContent = "جاري التسجيل الآن... تحدث بصوتك الدافئ 🎙️ крас";
        })
        .catch(error => {
            alert("عذراً، يرجى السماح للمتصفح بالوصول إلى الميكروفون لتسجيل الصوت!");
            console.error(error);
        });
}

function stopAudioRecording() {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
        document.getElementById('start-record-btn').disabled = false;
        document.getElementById('stop-record-btn').disabled = true;
        document.getElementById('recording-status').textContent = "تم حفظ وتصدير التسجيل بنجاح! 🎉";
    }
}

function saveVoiceNoteToCloud(audioBase64) {
    let voiceNotes = JSON.parse(localStorage.getItem('shared_voice_notes') || '[]');
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    voiceNotes.unshift({ audioUrl: audioBase64, time: timeString });
    if (voiceNotes.length > 5) voiceNotes.pop(); // الاحتفاظ بأحدث 5 رسائل
    
    localStorage.setItem('shared_voice_notes', JSON.stringify(voiceNotes));
    displayVoiceNotes();

    // مزامنة الفويس نوت فوراً سحابياً عبر سيرفر Firebase المشترك لظهر عند بوو
    if (typeof window.updateCloudData === 'function') {
        window.updateCloudData({ voiceNotes: voiceNotes });
    }
    logBooAction('سجلت رسالة صوتية جديدة في الاستوديو 🎙️');
}

window.displayVoiceNotes = function() {
    const shelf = document.getElementById("voice-notes-shelf");
    if (!shelf) return;

    let voiceNotes = JSON.parse(localStorage.getItem('shared_voice_notes') || '[]');
    if (voiceNotes.length === 0) {
        shelf.innerHTML = '<div style="color: var(--text-muted); text-align: center; font-size: 0.85rem;">لا توجد رسائل صوتية مسجلة حتى الآن ✨</div>';
        return;
    }

    shelf.innerHTML = "";
    voiceNotes.forEach((note, idx) => {
        const itemDiv = document.createElement("div");
        itemDiv.style.cssText = "background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); padding: 10px; border-radius: 10px; display: flex; flex-direction: column; gap: 5px;";
        itemDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: var(--accent-primary);">
                <span>🎧 رسالة صوتية (${idx + 1})</span>
                <span style="color: var(--text-muted);">${note.time}</span>
            </div>
            <audio controls style="width: 100%; height: 35px;"><source src="${note.audioUrl}" type="audio/webm">متصفحك لا يدعم تشغيل الصوت.</audio>
        `;
        shelf.appendChild(itemDiv);
    });
}

// استدعاء عرض الفويس نوتس عند تحميل الصفحة
window.addEventListener('load', () => {
    displayVoiceNotes();
});
// ==========================================
// إدارة وحذف الفويس نوتس المسجلة سحابياً
// ==========================================
function toggleManageVoiceNotes() {
    const box = document.getElementById('manage-voicerecords-box');
    if (box) {
        box.style.display = box.style.display === 'block' ? 'none' : 'block';
        if(box.style.display === 'block') {
            renderAdminVoiceNotesList();
        }
    }
}

window.renderAdminVoiceNotesList = function() {
    const container = document.getElementById('voicerecords-list-admin');
    if (!container) return;
    
    let voiceNotes = JSON.parse(localStorage.getItem('shared_voice_notes') || '[]');
    if (voiceNotes.length === 0) {
        container.innerHTML = '<span style="color: var(--text-muted); text-align: center; display: block;">لا توجد فويس نوتس مسجلة</span>';
        return;
    }
    
    container.innerHTML = '';
    voiceNotes.forEach((note, idx) => {
        const item = document.createElement('div');
        item.style.cssText = "display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 4px 8px; border-radius: 4px;";
        item.innerHTML = `
            <span>🎧 رسالة صوتية (${idx + 1}) - <small style="color:var(--text-muted);">${note.time}</small></span>
            <button onclick="deleteVoiceNote(${idx})" style="background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; color: #ef4444; padding: 2px 6px; border-radius: 3px; cursor: pointer; font-size: 0.7rem;">حذف</button>
        `;
        container.appendChild(item);
    });
}

window.deleteVoiceNote = function(index) {
    let voiceNotes = JSON.parse(localStorage.getItem('shared_voice_notes') || '[]');
    if (index > -1 && index < voiceNotes.length) {
        voiceNotes.splice(index, 1);
        localStorage.setItem('shared_voice_notes', JSON.stringify(voiceNotes));
        
        // مزامنة الحذف سحابياً لحظياً عند الطرفين
        if (typeof window.updateCloudData === 'function') {
            window.updateCloudData({ voiceNotes: voiceNotes });
        }
        
        displayVoiceNotes();
        renderAdminVoiceNotesList();
        alert("🗑️ تم حذف الرسالة الصوتية بنجاح ومزامنته أونلاين!");
    }
}