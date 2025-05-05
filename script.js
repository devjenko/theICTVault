// Check if we're on the login page
const loginForm = document.getElementById('loginForm');
console.log('Login form found:', loginForm); // Debug log

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
        const welcomeText = document.querySelector('nav .text-gray-700');
        welcomeText.textContent = `Welcome, ${teacherName}`;
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
const PDF_BASE_PATH = '/exams/';

// Function to get the full path based on the term
function getPDFPath(relativePath) {
    // Handle Term 4 Mid Exams
    if (relativePath.startsWith('G') || relativePath.startsWith('Art') || relativePath === 'T4 Mid-Term Exam Cover.pdf') {
        return PDF_BASE_PATH + 'T4%20Mid%20Exams/' + relativePath;
    }
    // For all other paths, use as is since they include the full path
    return '/exams/' + relativePath;
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