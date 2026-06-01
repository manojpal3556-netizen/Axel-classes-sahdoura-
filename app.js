// ==========================================================================
// 1. स्प्लैश स्क्रीन और ऑटो-लॉगिन चेक
// ==========================================================================
window.addEventListener('DOMContentLoaded', () => {
    // बैकग्राउंड स्लाइडर डॉट्स बनाना
    const dotsEngine = document.getElementById('dots-engine');
    if (dotsEngine) {
        for (let i = 0; i < 7; i++) {
            let dot = document.createElement('div');
            dot.className = `dot ${i === 0 ? 'active' : ''}`;
            dotsEngine.appendChild(dot);
        }
        startSlider();
    }

    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        splash.style.opacity = '0';
        setTimeout(() => {
            splash.style.display = 'none';
            
            // अगर छात्र पहले से रजिस्टर कर चुका है, तो सीधे डैशबोर्ड खोलें
            const existingUser = localStorage.getItem('axcelUserProfile');
            if (existingUser) {
                switchScreen('dashboard-view');
            } else {
                switchScreen('login-view');
            }
        }, 500);
    }, 3000);
});

// स्क्रीन बदलने का मास्टर फंक्शन
function switchScreen(screenId) {
    document.querySelectorAll('.app-screen').forEach(screen => {
        screen.classList.remove('active-screen');
    });
    document.getElementById(screenId).classList.add('active-screen');
}

// ==========================================================================
// 2. रियलिटी में गूगल लॉगिन (Google Auth Simulation)
// ==========================================================================
function realGoogleAuth() {
    // गूगल लॉगिन पर डिफ़ॉल्ट रूप से एक शानदार प्रोफाइल बना देना
    alert("Google द्वारा ऑथेंटिकेशन सफल! प्रोफ़ाइल सेटअप पर जा रहे हैं...");
    
    // गूगल से डमी डेटा उठाना
    document.getElementById('reg-name').value = "Google_User";
    document.getElementById('reg-surname').value = "Axcel";
    
    // सीधे परमिशन फ्लो शुरू करना
    startRegistrationFlow();
}

// ==========================================================================
// 3. परमिशन और रजिस्ट्रेशन फ्लो लॉजिक
// ==========================================================================
let currentPermissionStep = 0;
const permissions = [
    { title: "फाइल्स की परमिशन", desc: "क्लास के नोट्स, टेस्ट सीरीज़ और महत्वपूर्ण पीडीएफ सेव करने के लिए फाइल्स की अनुमति दें।", icon: "fa-folder-open" },
    { title: "माइक्रोफोन की परमिशन", desc: "लाइव क्लास के दौरान सीधे अपने टीचर से डाउट पूछने और बात करने के लिए अनुमति दें।", icon: "fa-microphone" },
    { title: "कांटेक्ट की परमिशन", desc: "Axcel कोचिंग के सहपाठियों की रैंकिंग और अपडेट्स देखने के लिए कांटेक्ट लिस्ट की अनुमति दें।", icon: "fa-address-book" },
    { title: "कैमरा की परमिशन", desc: "प्रोफाइल फोटो लगाने और अपने सवालों/डाउट की फोटो खींचकर भेजने के लिए कैमरा की अनुमति दें।", icon: "fa-camera" }
];

function startRegistrationFlow() {
    document.getElementById('login-view').classList.remove('active-screen');
    currentPermissionStep = 0;
    showPermissionPopup();
}

function showPermissionPopup() {
    if (currentPermissionStep < permissions.length) {
        const modal = document.getElementById('permission-modal');
        const data = permissions[currentPermissionStep];
        
        document.getElementById('perm-icon').className = `fas ${data.icon}`;
        document.getElementById('perm-title').innerText = data.title;
        document.getElementById('perm-desc').innerText = data.desc;
        
        modal.style.display = 'flex';
    } else {
        document.getElementById('permission-modal').style.display = 'none';
        switchScreen('register-view');
    }
}

function grantNextPermission() {
    currentPermissionStep++;
    showPermissionPopup();
}

// ==========================================================================
// 4. सेव और कंटिन्यू - रियलिटी में डैशबोर्ड खोलना
// ==========================================================================
function saveAndContinue() {
    const name = document.getElementById('reg-name').value.trim();
    const surname = document.getElementById('reg-surname').value.trim();
    const phone = document.getElementById('reg-phone').value.trim();
    const pass = document.getElementById('reg-pass').value.trim();
    const sClass = document.getElementById('reg-class').value;
    const region = document.getElementById('reg-region').value.trim();

    if(!name || !surname || !phone || !pass || !sClass || !region) {
        alert("कृपया सभी कॉलम ध्यानपूर्वक भरें!");
        return;
    }

    // लोकल स्टोरेज डेटाबेस में यूजर का परमानेंट डेटा सेव करना
    const userData = { name, surname, phone, pass, sClass, region };
    localStorage.setItem('axcelUserProfile', JSON.stringify(userData));

    alert("बधाई हो! प्रोफ़ाइल सेटअप पूरा हो चुका है।");
    
    // अब रियलिटी में डैशबोर्ड खुल जाएगा!
    switchScreen('dashboard-view');
}

// ==========================================================================
// 5. असली डेटाबेस से लॉगिन चेक करना
// ==========================================================================
function realLogin() {
    const inputId = document.getElementById('login-id').value.trim();
    const inputPass = document.getElementById('login-pass').value.trim();
    
    if(!inputId || !inputPass) {
        alert("कृपया मोबाइल नंबर/ईमेल और पासवर्ड दर्ज करें!");
        return;
    }

    // लोकल स्टोरेज से रजिस्टर्ड डेटा निकालना
    const savedData = localStorage.getItem('axcelUserProfile');
    
    if (savedData) {
        const user = JSON.parse(savedData);
        // चेक करना कि पासवर्ड और फोन नंबर सही है या नहीं
        if ((inputId === user.phone || inputId === "admin") && inputPass === user.pass) {
            alert(`स्वागत है, ${user.name}!`);
            switchScreen('dashboard-view');
            return;
        }
    }
    
    alert("लॉगिन असफल! कृपया सही नंबर और पासवर्ड डालें या नया रजिस्ट्रेशन करें।");
}

// ==========================================================================
// 6. डैशबोर्ड फीचर्स और सुपर एडमिन ट्रिगर
// ==========================================================================
function startSlider() {
    let currentSlide = 0;
    const sliderEngine = document.getElementById('slider-engine');
    setInterval(() => {
        if(sliderEngine) {
            currentSlide = (currentSlide + 1) % 7;
            sliderEngine.style.transform = `translateX(-${currentSlide * 14.285}%)`;
            const dots = document.querySelectorAll('.dot');
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentSlide);
            });
        }
    }, 3500);
}

function openModule(moduleName) {
    alert(moduleName + " मॉड्यूल सफलतापूर्वक लोड हो रहा है...");
}
function openSeparateDoubt() {
    alert("डाउट सेक्शन: सीधे एडमिन नंबर 9516257132 पर संपर्क करें।");
}

// 3 सेकंड लॉन्ग प्रेस ट्रिगर
let pressTimer;
const mainBody = document.getElementById('main-app-body');

mainBody.addEventListener('touchstart', () => {
    pressTimer = setTimeout(() => {
        document.getElementById('admin-gate-modal').style.display = 'flex';
    }, 3000);
});
mainBody.addEventListener('touchend', () => clearTimeout(pressTimer));

// डेस्कटॉप माउस टेस्टिंग के लिए
mainBody.addEventListener('mousedown', () => {
    pressTimer = setTimeout(() => {
        document.getElementById('admin-gate-modal').style.display = 'flex';
    }, 3000);
});
mainBody.addEventListener('mouseup', () => clearTimeout(pressTimer));

function verifyAdminAccess() {
    const phone = document.getElementById('admin-phone').value;
    const pass = document.getElementById('admin-pass').value;
    if(phone === "9516257132" && pass === "Axcel@7132") {
        alert("सुपर एडमिन एक्सेस ग्रंटेड!");
        document.getElementById('admin-gate-modal').style.display = 'none';
    } else {
        alert("गलत पासवर्ड!");
        document.getElementById('admin-gate-modal').style.display = 'none';
    }
}
