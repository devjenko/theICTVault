// New dark mode toggle functionality
function setupDarkModeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
    
    // Check if elements exist
    if (!themeToggleBtn || !themeToggleDarkIcon || !themeToggleLightIcon) {
        console.error('Theme toggle elements not found');
        return;
    }
    
    console.log('Setting up dark mode toggle');
    
    // Center both icons within the button
    themeToggleDarkIcon.classList.add('m-auto');
    themeToggleLightIcon.classList.add('m-auto');
    
    // Set initial state
    if (localStorage.getItem('color-theme') === 'dark' || 
        (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        themeToggleLightIcon.classList.remove('hidden');
        themeToggleDarkIcon.classList.add('hidden');
    } else {
        document.documentElement.classList.remove('dark');
        themeToggleLightIcon.classList.add('hidden');
        themeToggleDarkIcon.classList.remove('hidden');
    }
    
    // Add click event
    themeToggleBtn.addEventListener('click', function() {
        console.log('Theme toggle clicked');
        
        // Toggle icons
        themeToggleDarkIcon.classList.toggle('hidden');
        themeToggleLightIcon.classList.toggle('hidden');
        
        // Toggle dark class on html element
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
            console.log('Switching to light mode');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
            console.log('Switching to dark mode');
        }
    });
}

// Execute theme setup when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupDarkModeToggle();
    
    // Check if user is logged in
    const teacherName = localStorage.getItem('teacherName');
    if (!teacherName && window.location.pathname.includes('dashboard')) {
        window.location.href = 'index.html';
        return;
    }

    // Display welcome message
    const welcomeMessage = document.getElementById('welcomeMessage');
    if (welcomeMessage) {
        const teacherNameElement = welcomeMessage.querySelector('.teacher-name');
        if (teacherNameElement) {
            teacherNameElement.textContent = teacherName;
        }
    }

    // Add event listener for logout button
    const logoutButton = document.getElementById('logoutBtn');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('teacherName');
            window.location.href = 'index.html';
        });
    }
});

// Check if we're on the login page
const loginForm = document.getElementById('loginForm');
console.log('Login form found:', loginForm); // Debug log

// Password visibility toggle
const togglePassword = document.getElementById('togglePassword');
if (togglePassword) {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');
    
    togglePassword.addEventListener('click', function() {
        // Toggle password visibility
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            eyeIcon.classList.remove('fa-eye');
            eyeIcon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            eyeIcon.classList.remove('fa-eye-slash');
            eyeIcon.classList.add('fa-eye');
        }
    });
}

function handleLogin(e) {
    console.log('Login handler called'); // Debug log
    if (e) {
        e.preventDefault(); // Prevent form submission
    }
    
    const teacherName = document.getElementById('teacherName').value;
    const password = document.getElementById('password').value;
    
    console.log('Attempting login with:', { teacherName, password }); // Debug log
    
    // Check against the required password
    if (teacherName && password === 'ggasteacher1') {
        console.log('Login successful, redirecting...'); // Debug log
        // Store login state
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('teacherName', teacherName);
        
        // Hide any previous error message
        document.getElementById('errorMessage').classList.add('hidden');
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } else {
        console.log('Login failed'); // Debug log
        // Show error message
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.classList.remove('hidden');
        errorMessage.textContent = password === 'ggasteacher1' ? 
            'Please enter your name' : 
            'Invalid password. Please try again.';
    }
}

if (loginForm) {
    // Add form submit handler
    loginForm.addEventListener('submit', handleLogin);
    
    // Also add click handler to the submit button
    const submitButton = loginForm.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.addEventListener('click', handleLogin);
    }
}

// Check if we're on the dashboard page
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    // Check if user is logged in
    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = 'index.html';
    }

    // Handle logout
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('teacherName');
        window.location.href = 'index.html';
    });

    // Display teacher's name
    const teacherName = localStorage.getItem('teacherName');
    if (teacherName) {
        const welcomeElement = document.querySelector('.teacher-name');
        if (welcomeElement) {
            welcomeElement.textContent = teacherName;
        }
    }
    
    // Term navigation
    const termLinks = document.querySelectorAll('.term-link');
    termLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Calculate header height for offset
                const headerHeight = document.querySelector('nav').offsetHeight;
                const scrollPosition = targetSection.offsetTop - headerHeight - 20; // Extra 20px padding
                
                // Scroll to the section with smooth behavior and offset
                window.scrollTo({
                    top: scrollPosition,
                    behavior: 'smooth'
                });
                
                // Add active state to clicked link and remove from others
                termLinks.forEach(tl => tl.classList.remove('bg-gray-100', 'dark:bg-gray-700'));
                this.classList.add('bg-gray-100', 'dark:bg-gray-700');
            }
        });
    });
    
    // Set initial active state for the first term link
    if (termLinks.length > 0) {
        termLinks[0].classList.add('bg-gray-100', 'dark:bg-gray-700');
    }
}

// Add click event listeners to exam links
document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const examType = this.querySelector('span').textContent;
        const term = this.closest('.bg-white').querySelector('h3').textContent;
        
        // Here you would typically make an API call to fetch the exam
        alert(`Loading ${examType} for ${term}...`);
        // You can implement the actual exam viewing/printing functionality here
    });
});

// Initialize PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// Base path for PDFs - using relative path for static hosting
const PDF_BASE_PATH = 'exams/';

// Function to get the full path based on the term
function getPDFPath(term, examType, grade) {
    const basePath = 'exams/';
    
    // Handle Term 4 Mid Exams (which are in T4 Mid Exams folder)
    if (term === 'Term 4' && examType === 'Mid') {
        if (grade === 'Cover') {
            return `${basePath}T4 Mid Exams/T4 Mid-Term Exam Cover.pdf`;
        }
        const gradePath = `${basePath}T4 Mid Exams/G${grade}/`;
        switch(grade) {
            case '1': return gradePath + 'T4 Mid Project G1.pdf';
            case '2': return gradePath + 'T4 Mid Project G2.pdf';
            case '3': return gradePath + 'G3 T4 Mid Exam.pdf';
            case '4': return gradePath + 'G4 T4 Mid Exam.pdf';
            case '5': return gradePath + 'ICT T4 Mid Exam G5.pdf';
            case '6': return gradePath + 'T4 Mid Exam G6.pdf';
            case '7': return gradePath + 'G7 T4 Mid-Term Exam.pdf';
            case '8': return gradePath + 'G8 T4 Mid-Term Exam.pdf';
            case '9': return gradePath + 'T4 Mid-Term Exam G9.pdf';
            case '10': return gradePath + 'G10 T4 Mid-Term Exam.pdf';
            default: return '';
        }
    }
    
    // Handle Term 1 Final Exams
    if (term === 'Term 1' && examType === 'Final') {
        if (grade === 'Cover') {
            return `${basePath}Term 1 Final Exam/G1/T1 Final Exam Cover Page.pdf`;
        }
        const gradePath = `${basePath}Term 1 Final Exam/G${grade}/`;
        switch(grade) {
            case '1': return gradePath + 'G1 Exam T1 Final Question Paper.pdf';
            case '2': return gradePath + 'G2 Exam T1 Final Question Paper.pdf';
            case '3': return gradePath + 'Grade 3 T1 Final Exam Questions.pdf';
            case '4': return gradePath + 'Grade 4 T1 Final Exam Questions.pdf';
            case '5': return gradePath + 'Grade 5 T1 Final Exam Questions.pdf';
            case '6': return gradePath + 'Grade 6 T1 Final Exam Questions.pdf';
            case '7': return gradePath + 'Grade 7 T1 Final Exam Questions.pdf';
            case '8': return gradePath + 'Grade 8 T1 Final Exam Questions.pdf';
            case '9': return gradePath + 'Grade 9 T1 Final Exam Question.pdf';
            case '10': return gradePath + 'Grade 10 T1 Final Exam Questions.pdf';
            default: return '';
        }
    }
    
    // For other terms, return empty string as files are not yet available
    return '';
}

// Get DOM elements
const previewModal = document.getElementById('previewModal');
const pdfViewer = document.getElementById('pdfViewer');
const closeModal = document.getElementById('closeModal');

// Handle preview buttons
document.querySelectorAll('.preview-btn').forEach(button => {
    button.addEventListener('click', async () => {
        const relativePath = button.dataset.pdf;
        // Encode the path components to handle spaces and special characters
        const encodedPath = relativePath.split('/').map(component => 
            encodeURIComponent(component)
        ).join('/');
        const fullPath = getPDFPath(relativePath);
        console.log('Attempting to load PDF from:', fullPath);

        try {
            // Load the PDF using PDF.js
            const loadingTask = pdfjsLib.getDocument(fullPath);
            const pdf = await loadingTask.promise;
            console.log('PDF loaded successfully');
            
            // Clear previous preview
            pdfViewer.innerHTML = '';

            // Create container for all pages
            const pagesContainer = document.createElement('div');
            pagesContainer.style.overflow = 'auto';
            pagesContainer.style.height = '100%';
            pagesContainer.style.width = '100%';
            pdfViewer.appendChild(pagesContainer);

            // Render all pages
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                
                // Calculate scale to fit width while maintaining aspect ratio
                const viewerWidth = pdfViewer.clientWidth - 40; // subtract padding
                const viewport = page.getViewport({ scale: 1 });
                const scale = viewerWidth / viewport.width;
                const scaledViewport = page.getViewport({ scale });

                // Set up canvas for PDF rendering
                const canvasContainer = document.createElement('div');
                canvasContainer.style.marginBottom = '20px';
                
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = scaledViewport.height;
                canvas.width = scaledViewport.width;
                
                canvasContainer.appendChild(canvas);
                pagesContainer.appendChild(canvasContainer);
                
                // Render PDF page
                await page.render({
                    canvasContext: context,
                    viewport: scaledViewport
                }).promise;
            }
            
            // Show modal
            previewModal.classList.remove('hidden');
            previewModal.classList.add('flex');
        } catch (error) {
            console.error('Error loading PDF:', error);
            alert(`Could not load PDF. Please make sure the Python server is running on port 8000 and try again.`);
        }
    });
});

// Handle print buttons
document.querySelectorAll('.print-btn').forEach(button => {
    button.addEventListener('click', () => {
        const relativePath = button.dataset.pdf;
        // Encode the path components to handle spaces and special characters
        const encodedPath = relativePath.split('/').map(component => 
            encodeURIComponent(component)
        ).join('/');
        const fullPath = getPDFPath(relativePath);
        console.log('Attempting to print PDF from:', fullPath);

        try {
            // Create an iframe for printing
            const printFrame = document.createElement('iframe');
            printFrame.style.display = 'none';
            printFrame.src = fullPath;
            
            // Add error handling for the iframe
            printFrame.onerror = function() {
                console.error('Error loading PDF in iframe');
                alert('Error loading PDF. Please try again.');
                document.body.removeChild(printFrame);
            };
            
            printFrame.onload = function() {
                try {
                    const printWindow = printFrame.contentWindow;
                    printWindow.focus(); // Focus the print window
                    printWindow.print();
                } catch (error) {
                    console.error('Error printing PDF:', error);
                    alert('Error printing PDF. Please try again.');
                }
            };
            
            document.body.appendChild(printFrame);
        } catch (error) {
            console.error('Error setting up PDF print:', error);
            alert('Error preparing PDF for printing. Please try again.');
        }
    });
});

// Close modal when clicking the close button
closeModal.addEventListener('click', () => {
    previewModal.classList.add('hidden');
    previewModal.classList.remove('flex');
});

// Close modal when clicking outside
previewModal.addEventListener('click', (e) => {
    if (e.target === previewModal) {
        previewModal.classList.add('hidden');
        previewModal.classList.remove('flex');
    }
});

function loadAndPrintPDF(path) {
    console.log('Loading PDF from:', path);
    
    // Show loading modal
    const loadingModal = document.getElementById('loadingModal');
    loadingModal.classList.remove('hidden');
    
    // Create an iframe for printing
    const printFrame = document.createElement('iframe');
    printFrame.style.display = 'none';
    
    // Add error handling for the iframe
    printFrame.onerror = function() {
        console.error('Error loading PDF in iframe');
        alert('Error loading PDF. Please make sure the file exists and try again.');
        document.body.removeChild(printFrame);
        loadingModal.classList.add('hidden');
    };
    
    printFrame.onload = function() {
        try {
            const printWindow = printFrame.contentWindow;
            printWindow.focus(); // Focus the print window
            printWindow.print();
            document.body.removeChild(printFrame);
            loadingModal.classList.add('hidden');
        } catch (error) {
            console.error('Error printing PDF:', error);
            alert('Error printing PDF. Please try again.');
            document.body.removeChild(printFrame);
            loadingModal.classList.add('hidden');
        }
    };
    
    // Set the source after setting up the event handlers
    printFrame.src = path;
    document.body.appendChild(printFrame);
}

// Function to directly trigger printing without showing a modal
function printPDF(pdfPath) {
    console.log('Printing PDF:', pdfPath);
    
    // Create a hidden iframe
    const printFrame = document.createElement('iframe');
    
    // Style to make it invisible
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    
    // Add to document
    document.body.appendChild(printFrame);
    
    // Set up print when loaded
    printFrame.onload = function() {
        try {
            // Start printing
            printFrame.contentWindow.focus();
            printFrame.contentWindow.print();
            
            // Don't remove the iframe so the print dialog stays open
            // The user can dismiss it themselves
        } catch (error) {
            console.error('Error printing:', error);
            alert('Could not print the PDF. Please try again.');
            document.body.removeChild(printFrame);
        }
    };
    
    // Set source to trigger loading
    printFrame.src = pdfPath;
}

// Function to get file path based on term, type, grade, and document type
function getFilePath(term, examType, grade, docType) {
    // Get folder name based on term and exam type
    let folderName = '';
    
    if (term === 3 && examType === 'Mid') {
        folderName = 'Term 3 Mid-Term Exams [done]';
    } else if (term === 3 && examType === 'Final') {
        folderName = 'Term 3 Final Exams [done]';
    } else if (term === 4 && examType === 'Mid') {
        folderName = 'Term 4 Mid-Term Exams [done]';
    } else {
        console.error('Invalid term or exam type');
        alert('Error: The requested exam is not available. Please check back later.');
        return '';
    }
    
    // Base path
    const basePath = `ICT Exams/${folderName}/G${grade} - done`;
    
    // Document type-specific subfolder and filename
    let subFolder = '';
    let fileName = '';
    
    if (docType === 'Exam') {
        subFolder = 'Exam';
        fileName = `Grade ${grade} Term ${term} ${examType}-Term Exam.pdf`;
    } else if (docType === 'Review') {
        subFolder = 'Review';
        
        // Handle different naming patterns for Review files
        if (term === 3 && examType === 'Final') {
            fileName = `G${grade} T3 Final Review Sheet.pdf`;
        } else if (term === 4 && examType === 'Mid' && grade === 9) {
            fileName = `G9 T4 Mid-Term Review.pdf`;
        } else {
            fileName = `Grade ${grade} Term ${term} ${examType}-Term Review.pdf`;
        }
    } else if (docType === 'Answer') {
        // Answer Key files are not available yet
        alert(`The Answer Key for Grade ${grade} Term ${term} ${examType}-Term Exam is not available yet. Please check back later.`);
        return '';
    } else {
        console.error('Invalid document type');
        alert('Error: Invalid document type selected.');
        return '';
    }
    
    return `${basePath}/${subFolder}/${fileName}`;
}