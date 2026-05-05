const dobInput = document.getElementById('dob');
const yearsEl = document.getElementById('years');
const monthsEl = document.getElementById('months');
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const totalYearsEl = document.getElementById('total-years');
const totalMonthsEl = document.getElementById('total-months');
const totalDaysEl = document.getElementById('total-days');
const totalHoursEl = document.getElementById('total-hours');
const totalMinutesEl = document.getElementById('total-minutes');
const totalSecondsEl = document.getElementById('total-seconds');
const dateTextEl = document.getElementById('date-text');

const bdayMonthsEl = document.getElementById('bday-months');
const bdayDaysEl = document.getElementById('bday-days');
const bdayHoursEl = document.getElementById('bday-hours');
const bdayMinutesEl = document.getElementById('bday-minutes');
const bdaySecondsEl = document.getElementById('bday-seconds');
const bdayProgressEl = document.getElementById('bday-progress');
const zodiacSignEl = document.getElementById('zodiac-sign');
const chineseZodiacEl = document.getElementById('chinese-zodiac');
const birthstoneEl = document.getElementById('birthstone');

let lastCelebrationDate = null;

const toggleTimeInput = document.getElementById('toggle-time-input');
let internalDobValue = localStorage.getItem('saved_dob') || "1991-11-01T00:00";

function updateTimeInputUI(isEnabled) {
    if (isEnabled) {
        dobInput.type = 'datetime-local';
        document.querySelector('label[for="dob"]').textContent = "Enter your Date and Time of Birth";
        dobInput.value = internalDobValue;
    } else {
        dobInput.type = 'date';
        document.querySelector('label[for="dob"]').textContent = "Enter your Date of Birth";
        if (internalDobValue) {
            dobInput.value = internalDobValue.split('T')[0];
        }
    }
}

let isTimeInputEnabled = false;
try {
    const earlyStateStr = localStorage.getItem('dashboard_state');
    if (earlyStateStr) {
        const state = JSON.parse(earlyStateStr);
        if (state.timeInputEnabled) isTimeInputEnabled = true;
    }
} catch(e) {}

if (toggleTimeInput) {
    toggleTimeInput.checked = isTimeInputEnabled;
    toggleTimeInput.addEventListener('change', (e) => {
        updateTimeInputUI(e.target.checked);
        if (typeof saveDashboardState === 'function') {
            saveDashboardState();
        }
    });
}
updateTimeInputUI(isTimeInputEnabled);

function getZodiacSign(day, month) {
    const signs = [
        { name: "Capricorn ♑", day: 19, month: 1 },
        { name: "Aquarius ♒", day: 18, month: 2 },
        { name: "Pisces ♓", day: 20, month: 3 },
        { name: "Aries ♈", day: 19, month: 4 },
        { name: "Taurus ♉", day: 20, month: 5 },
        { name: "Gemini ♊", day: 20, month: 6 },
        { name: "Cancer ♋", day: 22, month: 7 },
        { name: "Leo ♌", day: 22, month: 8 },
        { name: "Virgo ♍", day: 22, month: 9 },
        { name: "Libra ♎", day: 22, month: 10 },
        { name: "Scorpio ♏", day: 21, month: 11 },
        { name: "Sagittarius ♐", day: 21, month: 12 },
        { name: "Capricorn ♑", day: 31, month: 12 }
    ];
    return signs.find(s => month < s.month || (month === s.month && day <= s.day)).name;
}

function getChineseZodiac(year) {
    const animals = ["Rat 🐀", "Ox 🐂", "Tiger 🐅", "Rabbit 🐇", "Dragon 🐉", "Snake 🐍", "Horse 🐎", "Goat 🐐", "Monkey 🐒", "Rooster 🐓", "Dog 🐕", "Pig 🐖"];
    // 1924 was a Rat year
    return animals[((year - 1924) % 12 + 12) % 12];
}

function getBirthstone(month) {
    const stones = ["Garnet", "Amethyst", "Aquamarine", "Diamond", "Emerald", "Pearl", "Ruby", "Peridot", "Sapphire", "Opal", "Topaz", "Turquoise"];
    return stones[month - 1];
}

function triggerCelebration() {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
    
    if (lastCelebrationDate === todayStr) return;
    lastCelebrationDate = todayStr;

    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
}

function calculateAge() {
    const dobValue = internalDobValue;
    if (!dobValue || !dobInput.value) {
        dateTextEl.textContent = "";
        return;
    }

    let birthDate;
    if (dobValue.includes('T')) {
        birthDate = new Date(dobValue);
    } else {
        const [year, month, day] = dobValue.split('-');
        birthDate = new Date(year, month - 1, day);
    }
    const now = new Date();

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' };
    dateTextEl.textContent = birthDate.toLocaleString(undefined, options);

    if (birthDate > now) {
        yearsEl.textContent = "0";
        monthsEl.textContent = "0";
        daysEl.textContent = "0";
        hoursEl.textContent = "0";
        minutesEl.textContent = "0";
        secondsEl.textContent = "0";

        totalYearsEl.textContent = "0";
        totalMonthsEl.textContent = "0";
        totalDaysEl.textContent = "0";
        totalHoursEl.textContent = "0";
        totalMinutesEl.textContent = "0";
        totalSecondsEl.textContent = "0";

        bdayMonthsEl.textContent = "0";
        bdayDaysEl.textContent = "0";
        bdayHoursEl.textContent = "0";
        bdayMinutesEl.textContent = "0";
        bdaySecondsEl.textContent = "0";
        bdayProgressEl.style.width = "0%";
        return;
    }

    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    let days = now.getDate() - birthDate.getDate();
    let hours = now.getHours() - birthDate.getHours();
    let minutes = now.getMinutes() - birthDate.getMinutes();
    let seconds = now.getSeconds() - birthDate.getSeconds();

    if (seconds < 0) {
        seconds += 60;
        minutes--;
    }
    if (minutes < 0) {
        minutes += 60;
        hours--;
    }
    if (hours < 0) {
        hours += 24;
        days--;
    }
    if (days < 0) {
        // Get days in previous month
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
        months--;
    }
    if (months < 0) {
        months += 12;
        years--;
    }

    yearsEl.textContent = years;
    monthsEl.textContent = months;
    daysEl.textContent = days;
    hoursEl.textContent = hours;
    minutesEl.textContent = minutes;
    secondsEl.textContent = seconds;

    // Calculate Next Birthday
    const currentYear = now.getFullYear();
    let nextBday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
    
    // If birthday has passed this year, it's next year
    if (now > nextBday) {
        nextBday.setFullYear(currentYear + 1);
    }
    
    // Check if it's currently their birthday
    if (now.getMonth() === birthDate.getMonth() && now.getDate() === birthDate.getDate()) {
        bdayMonthsEl.textContent = "0";
        bdayDaysEl.textContent = "0";
        bdayHoursEl.textContent = "0";
        bdayMinutesEl.textContent = "0";
        bdaySecondsEl.textContent = "0";
        bdayProgressEl.style.width = "100%";
        
        dateTextEl.innerHTML = `🎂 Happy Birthday! <span style="opacity: 0.7;">(${dateTextEl.textContent})</span>`;
        triggerCelebration();
    } else {
        const diffBdayMs = nextBday - now;
        
        let totalBdaySecs = Math.floor(diffBdayMs / 1000);
        let remSecs = totalBdaySecs % 60;
        let totalBdayMins = Math.floor(totalBdaySecs / 60);
        let remMins = totalBdayMins % 60;
        let totalBdayHours = Math.floor(totalBdayMins / 60);
        let remHours = totalBdayHours % 24;
        
        let countdownDate = new Date(now);
        let cMonths = 0;
        while (true) {
            let nextMonthDate = new Date(countdownDate.getFullYear(), countdownDate.getMonth() + 1, countdownDate.getDate());
            if (nextMonthDate <= nextBday) {
                cMonths++;
                countdownDate = nextMonthDate;
            } else {
                break;
            }
        }
        
        const msInDay = 24 * 60 * 60 * 1000;
        let cDays = Math.floor((nextBday - countdownDate) / msInDay);
        
        bdayMonthsEl.textContent = cMonths;
        bdayDaysEl.textContent = cDays;
        bdayHoursEl.textContent = remHours;
        bdayMinutesEl.textContent = remMins;
        bdaySecondsEl.textContent = remSecs;
        
        // Calculate progress
        let lastBday = new Date(nextBday);
        lastBday.setFullYear(nextBday.getFullYear() - 1);
        const yearDuration = nextBday - lastBday;
        const timePassed = now - lastBday;
        const progressPercent = Math.min(100, (timePassed / yearDuration) * 100);
        bdayProgressEl.style.width = `${progressPercent}%`;
    }

    const diffMs = now - birthDate;
    const totalSecondsNum = Math.floor(diffMs / 1000);
    const totalMinutesNum = Math.floor(totalSecondsNum / 60);
    const totalHoursNum = Math.floor(totalMinutesNum / 60);
    const totalDaysNum = Math.floor(totalHoursNum / 24);
    
    let totalMonthsNum = (now.getFullYear() - birthDate.getFullYear()) * 12 + (now.getMonth() - birthDate.getMonth());
    if (now.getDate() < birthDate.getDate() || 
        (now.getDate() === birthDate.getDate() && (now.getHours() < birthDate.getHours() || 
        (now.getHours() === birthDate.getHours() && now.getMinutes() < birthDate.getMinutes()) || 
        (now.getHours() === birthDate.getHours() && now.getMinutes() === birthDate.getMinutes() && now.getSeconds() < birthDate.getSeconds())))) {
        totalMonthsNum--;
    }

    totalYearsEl.textContent = years.toLocaleString();
    totalMonthsEl.textContent = totalMonthsNum.toLocaleString();
    totalDaysEl.textContent = totalDaysNum.toLocaleString();
    totalHoursEl.textContent = totalHoursNum.toLocaleString();
    totalMinutesEl.textContent = totalMinutesNum.toLocaleString();
    totalSecondsEl.textContent = totalSecondsNum.toLocaleString();

    // Populate Birth Details
    zodiacSignEl.textContent = getZodiacSign(birthDate.getDate(), birthDate.getMonth() + 1);
    chineseZodiacEl.textContent = getChineseZodiac(birthDate.getFullYear());
    birthstoneEl.textContent = getBirthstone(birthDate.getMonth() + 1);
}

function parseTimeParam(timeStr) {
    if (!timeStr) return null;
    let s = timeStr.toLowerCase().replace(/\s+/g, '');
    let isPM = s.includes('pm');
    let isAM = s.includes('am');
    s = s.replace('pm', '').replace('am', '');
    s = s.replace('h', ':');
    let parts = s.split(':');
    let hours = parseInt(parts[0], 10);
    let minutes = parts[1] ? parseInt(parts[1], 10) : 0;
    if (isNaN(hours)) return null;
    if (isNaN(minutes)) minutes = 0;
    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;
    hours = Math.max(0, Math.min(23, hours));
    minutes = Math.max(0, Math.min(59, minutes));
    return String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0');
}

// Check for URL query parameter
const params = new URLSearchParams(window.location.search);
const dateParam = params.get('date');
const timeParam = params.get('time');

let urlUpdated = false;
let currentInternal = internalDobValue || "1991-11-01T00:00";
let [currentDate, currentTime] = currentInternal.split('T');
if (!currentTime) currentTime = "00:00";

if (dateParam) {
    let dateString = dateParam;
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        currentDate = dateString;
        urlUpdated = true;
    } else {
        const parsedDate = new Date(dateString);
        if (!isNaN(parsedDate.getTime())) {
            const year = parsedDate.getFullYear();
            const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
            const day = String(parsedDate.getDate()).padStart(2, '0');
            currentDate = `${year}-${month}-${day}`;
            urlUpdated = true;
        }
    }
}

if (timeParam) {
    const parsedTime = parseTimeParam(timeParam);
    if (parsedTime) {
        currentTime = parsedTime;
        urlUpdated = true;
        if (toggleTimeInput) {
            toggleTimeInput.checked = true;
            // State is saved below when we know functions are available or we just rely on later state saves
        }
    }
}

if (urlUpdated) {
    internalDobValue = `${currentDate}T${currentTime}`;
    localStorage.setItem('saved_dob', internalDobValue);
    updateTimeInputUI(toggleTimeInput ? toggleTimeInput.checked : false);
}

// Initial calculation
calculateAge();

// Update every second
setInterval(calculateAge, 1000);

// Recalculate when input changes
dobInput.addEventListener('input', () => {
    const val = dobInput.value;
    if (!val) {
        internalDobValue = "1991-11-01T00:00";
        updateTimeInputUI(toggleTimeInput ? toggleTimeInput.checked : false);
    } else if (dobInput.type === 'date') {
        const timePart = (internalDobValue && internalDobValue.includes('T')) ? internalDobValue.split('T')[1] : '00:00';
        internalDobValue = val + 'T' + timePart;
    } else {
        internalDobValue = val;
    }
    localStorage.setItem('saved_dob', internalDobValue);
    calculateAge();
});

// --- Drag and Drop & State Management ---
const sortableContainer = document.getElementById('sortable-container');
const customizeBtn = document.getElementById('customize-btn');
const settingsPanel = document.getElementById('settings-panel');
const toggleCheckboxes = document.querySelectorAll('.toggle-section');
const precisionCheckboxes = document.querySelectorAll('.toggle-precision');

let sortableInstance;

function saveDashboardState() {
    const order = sortableInstance ? sortableInstance.toArray() : [];
    const hidden = Array.from(toggleCheckboxes)
        .filter(cb => !cb.checked)
        .map(cb => cb.value);
    const hiddenPrecision = Array.from(precisionCheckboxes)
        .filter(cb => !cb.checked)
        .map(cb => cb.value);
        
    const theme = document.getElementById('theme-selector').value;
    const timeInputEnabled = toggleTimeInput ? toggleTimeInput.checked : false;

    const state = { order, hidden, hiddenPrecision, theme, timeInputEnabled };
    localStorage.setItem('dashboard_state', JSON.stringify(state));
}

function loadDashboardState() {
    const savedStateStr = localStorage.getItem('dashboard_state');
    if (savedStateStr) {
        try {
            const state = JSON.parse(savedStateStr);
            
            if (state.theme) {
                document.getElementById('theme-selector').value = state.theme;
                const themesToRemove = Array.from(document.body.classList).filter(c => c.startsWith('theme-'));
                if (themesToRemove.length > 0) {
                    document.body.classList.remove(...themesToRemove);
                }
                if (state.theme !== 'default') {
                    document.body.classList.add(`theme-${state.theme}`);
                }
            }
            
            // Reorder elements
            if (state.order && state.order.length > 0) {
                state.order.reverse().forEach(id => {
                    const el = document.getElementById(id);
                    if (el) sortableContainer.prepend(el);
                });
            }

            // Restore hidden state
            if (state.hidden) {
                toggleCheckboxes.forEach(cb => {
                    if (state.hidden.includes(cb.value)) {
                        cb.checked = false;
                        const targetEl = document.getElementById(cb.value);
                        if (targetEl) targetEl.style.display = 'none';
                    } else {
                        cb.checked = true;
                        const targetEl = document.getElementById(cb.value);
                        if (targetEl) targetEl.style.display = '';
                    }
                });
            }
            
            // Restore hidden precision state
            if (state.hiddenPrecision) {
                precisionCheckboxes.forEach(cb => {
                    if (state.hiddenPrecision.includes(cb.value)) {
                        cb.checked = false;
                        document.body.classList.add('hide-' + cb.value);
                    } else {
                        cb.checked = true;
                        document.body.classList.remove('hide-' + cb.value);
                    }
                });
            }
        } catch (e) {
            console.error("Could not parse dashboard state", e);
        }
    }
    
    // Initialize Sortable AFTER order is restored
    if (typeof Sortable !== 'undefined' && sortableContainer) {
        sortableInstance = new Sortable(sortableContainer, {
            animation: 200,
            handle: '.drag-handle',
            ghostClass: 'sortable-ghost',
            dragClass: 'sortable-drag',
            onEnd: saveDashboardState
        });
    }

    // Clean up anti-flicker style once JS has applied the DOM order and inline styles
    const antiFlicker = document.getElementById('anti-flicker-style');
    if (antiFlicker) {
        antiFlicker.remove();
    }
}

// Toggle settings panel
customizeBtn.addEventListener('click', () => {
    document.body.classList.toggle('edit-mode');
    if (settingsPanel.style.display === 'none') {
        settingsPanel.style.display = 'block';
        settingsPanel.animate([
            { opacity: 0, transform: 'translateY(-10px) scale(0.95)' },
            { opacity: 1, transform: 'translateY(0) scale(1)' }
        ], {
            duration: 250,
            easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' // slight spring effect
        });
    } else {
        const animation = settingsPanel.animate([
            { opacity: 1, transform: 'translateY(0) scale(1)' },
            { opacity: 0, transform: 'translateY(-10px) scale(0.95)' }
        ], {
            duration: 200,
            easing: 'ease-in'
        });
        animation.onfinish = () => {
            settingsPanel.style.display = 'none';
        };
    }
});



// Checkboxes in settings panel
toggleCheckboxes.forEach(cb => {
    cb.addEventListener('change', (e) => {
        const targetId = e.target.value;
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
            if (e.target.checked) {
                targetEl.style.display = '';
                const height = targetEl.scrollHeight;
                targetEl.style.overflow = 'hidden';
                targetEl.animate([
                    { opacity: 0, height: '0px', marginBottom: '-2rem', transform: 'scale(0.95)' },
                    { opacity: 1, height: height + 'px', marginBottom: '0px', transform: 'scale(1)' }
                ], {
                    duration: 350,
                    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
                }).onfinish = () => {
                    targetEl.style.overflow = '';
                    targetEl.style.height = '';
                    targetEl.style.marginBottom = '';
                };
            } else {
                const height = targetEl.offsetHeight;
                targetEl.style.overflow = 'hidden';
                const animation = targetEl.animate([
                    { opacity: 1, height: height + 'px', marginBottom: '0px', transform: 'scale(1)' },
                    { opacity: 0, height: '0px', marginBottom: '-2rem', transform: 'scale(0.95)' }
                ], {
                    duration: 300,
                    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
                });
                animation.onfinish = () => {
                    targetEl.style.display = 'none';
                    targetEl.style.overflow = '';
                    targetEl.style.height = '';
                    targetEl.style.marginBottom = '';
                };
            }
            saveDashboardState();
        }
    });
});

function setPrecisionState(targetClass, isChecked) {
    const cb = document.querySelector(`input[value="${targetClass}"]`);
    if (cb && cb.checked !== isChecked) {
        cb.checked = isChecked;
        if (isChecked) {
            document.body.classList.remove('hide-' + targetClass);
        } else {
            document.body.classList.add('hide-' + targetClass);
        }
    }
}

// Checkboxes for precision in settings panel
precisionCheckboxes.forEach(cb => {
    cb.addEventListener('change', (e) => {
        const targetClass = e.target.value;
        const isChecked = e.target.checked;
        
        if (isChecked) {
            document.body.classList.remove('hide-' + targetClass);
        } else {
            document.body.classList.add('hide-' + targetClass);
        }

        // Cascade logic
        if (targetClass === 'time-seconds' && isChecked) {
            setPrecisionState('time-minutes', true);
            setPrecisionState('time-hours', true);
        } else if (targetClass === 'time-minutes') {
            if (isChecked) {
                setPrecisionState('time-hours', true);
            } else {
                setPrecisionState('time-seconds', false);
            }
        } else if (targetClass === 'time-hours' && !isChecked) {
            setPrecisionState('time-minutes', false);
            setPrecisionState('time-seconds', false);
        }

        saveDashboardState();
    });
});

// Theme Selector
const themeSelector = document.getElementById('theme-selector');
themeSelector.addEventListener('change', (e) => {
    const theme = e.target.value;
    const themesToRemove = Array.from(document.body.classList).filter(c => c.startsWith('theme-'));
    if (themesToRemove.length > 0) {
        document.body.classList.remove(...themesToRemove);
    }
    if (theme !== 'default') {
        document.body.classList.add(`theme-${theme}`);
    }
    saveDashboardState();
});

// Share Button
const shareBtn = document.getElementById('share-btn');
if (navigator.share) {
    shareBtn.style.display = 'inline-block';
    shareBtn.addEventListener('click', async () => {
        const ageText = `I am exactly ${yearsEl.textContent} years, ${monthsEl.textContent} months, and ${daysEl.textContent} days old! Check out my exact age here:`;
        try {
            await navigator.share({
                title: 'Age Calculator',
                text: ageText,
                url: window.location.href.split('?')[0] + '?date=' + dobInput.value,
            });
        } catch (err) {
            console.log('Error sharing:', err);
        }
    });
}

// Initialize on load
loadDashboardState();

