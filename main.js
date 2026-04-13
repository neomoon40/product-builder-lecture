// Teachable Machine Logic
const URL = "https://teachablemachine.withgoogle.com/models/3MMTXssNu/";

let model, webcam, labelContainer, maxPredictions;

async function init() {
    const startButton = document.getElementById('start-button');
    startButton.textContent = "모델 로딩 중...";
    startButton.disabled = true;

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    try {
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        const flip = true; 
        webcam = new tmImage.Webcam(200, 200, flip); 
        await webcam.setup(); 
        await webcam.play();
        window.requestAnimationFrame(loop);

        document.getElementById("webcam-container").appendChild(webcam.canvas);
        labelContainer = document.getElementById("label-container");
        labelContainer.innerHTML = ''; // Clear previous content
        for (let i = 0; i < maxPredictions; i++) {
            const barContainer = document.createElement("div");
            barContainer.className = "bar-container";
            
            const labelName = document.createElement("div");
            labelName.className = "label-name";
            
            const progressWrapper = document.createElement("div");
            progressWrapper.className = "progress-wrapper";
            
            const progressBar = document.createElement("div");
            progressBar.className = "progress-bar";
            
            progressWrapper.appendChild(progressBar);
            barContainer.appendChild(labelName);
            barContainer.appendChild(progressWrapper);
            labelContainer.appendChild(barContainer);
        }
        
        startButton.style.display = "none";
    } catch (error) {
        console.error(error);
        alert("카메라를 시작할 수 없거나 모델을 불러오지 못했습니다.");
        startButton.textContent = "테스트 시작하기 (카메라 권한 필요)";
        startButton.disabled = false;
    }
}

async function loop() {
    webcam.update(); 
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const className = prediction[i].className;
        const probability = prediction[i].probability.toFixed(2);
        
        const barContainer = labelContainer.childNodes[i];
        const labelName = barContainer.querySelector('.label-name');
        const progressBar = barContainer.querySelector('.progress-bar');
        
        const translatedName = className === "dog" ? "🐶 강아지상" : 
                             className === "cat" ? "🐱 고양이상" : className;
        
        labelName.innerHTML = `${translatedName}: ${Math.round(probability * 100)}%`;
        progressBar.style.width = (probability * 100) + "%";
        
        // Highlight high probability
        if (probability > 0.5) {
            progressBar.classList.add('active');
        } else {
            progressBar.classList.remove('active');
        }
    }
}

// Theme Logic
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeIcon(theme);
});

function updateThemeIcon(theme) {
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// Form Submission Status
const contactForm = document.getElementById('contact-form');
const submitButton = document.getElementById('submit-button');

if (contactForm) {
    contactForm.addEventListener('submit', () => {
        submitButton.textContent = '보내는 중...';
        submitButton.disabled = true;
    });
}
