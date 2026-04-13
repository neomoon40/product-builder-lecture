// Teachable Machine Logic
const URL = "https://teachablemachine.withgoogle.com/models/3MMTXssNu/";

let model, labelContainer, maxPredictions;
const imageInput = document.getElementById('image-input');
const imagePreview = document.getElementById('image-preview');
const uploadPlaceholder = document.getElementById('upload-placeholder');
const loadingMsg = document.getElementById('loading-msg');

// Load the model on startup
async function loadModel() {
    try {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        console.log("AI Model loaded successfully");
    } catch (e) {
        console.error("Failed to load AI model", e);
    }
}

loadModel();

// Handle Image Selection
if (imageInput) {
    imageInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            imagePreview.src = event.target.result;
            imagePreview.style.display = 'block';
            uploadPlaceholder.style.display = 'none';
            
            loadingMsg.style.display = 'block';
            labelContainer = document.getElementById("label-container");
            if (labelContainer) labelContainer.innerHTML = '';
            
            imagePreview.onload = async () => {
                await predict(imagePreview);
                loadingMsg.style.display = 'none';
            };
        };
        reader.readAsDataURL(file);
    });
}

async function predict(imageElement) {
    if (!model) await loadModel();
    
    const prediction = await model.predict(imageElement);
    labelContainer.innerHTML = ''; 

    for (let i = 0; i < maxPredictions; i++) {
        const className = prediction[i].className;
        const probability = prediction[i].probability.toFixed(2);
        
        const barContainer = document.createElement("div");
        barContainer.className = "bar-container";
        
        const labelName = document.createElement("div");
        labelName.className = "label-name";
        
        const progressWrapper = document.createElement("div");
        progressWrapper.className = "progress-wrapper";
        
        const progressBar = document.createElement("div");
        progressBar.className = "progress-bar";
        
        const translatedName = className === "dog" ? "🐶 강아지상 모델" : 
                             className === "cat" ? "🐱 고양이상 모델" : className;
        
        labelName.innerHTML = `${translatedName}: ${Math.round(probability * 100)}%`;
        progressBar.style.width = (probability * 100) + "%";
        
        if (probability > 0.5) {
            progressBar.style.backgroundColor = "var(--primary-color)";
        }
        
        progressWrapper.appendChild(progressBar);
        barContainer.appendChild(labelName);
        barContainer.appendChild(progressWrapper);
        labelContainer.appendChild(barContainer);
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
        submitButton.textContent = '문의 내용을 전송 중입니다...';
        submitButton.disabled = true;
    });
}

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.style.padding = '0.5rem 0';
        header.style.boxShadow = 'var(--shadow)';
    } else {
        header.style.padding = '1rem 0';
        header.style.boxShadow = 'none';
    }
});
