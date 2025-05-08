# The ICT Exam Portal

A web-based system for teachers to access and print ICT and Art exam resources.

## Project Structure

```
ict-exam-portal/
├── public/              # Public files served by the web server
│   ├── assets/          # Static assets
│   │   ├── css/         # CSS stylesheets
│   │   ├── js/          # JavaScript files
│   │   ├── images/      # Image files
│   │   └── fonts/       # Font files (if any)
│   ├── ICT Exams/       # Exam resources
│   │   ├── Term 3 Mid-Term Exams [done]/    # Term 3 mid-term exams
│   │   ├── Term 3 Final Exams [done]/       # Term 3 final exams
│   │   └── Term 4 Mid-Term Exams [done]/    # Term 4 mid-term exams
│   ├── index.html       # Login page
│   ├── dashboard.html   # Main dashboard
│   └── contact-qr.html  # Contact QR code page
├── node_modules/        # Node.js dependencies
├── package.json         # Project configuration
├── package-lock.json    # Dependency lock file
└── README.md            # Project documentation
```

## Features

- Secure teacher login system
- Organized access to exam resources by term and grade
- Dark mode toggle
- Responsive design for all devices
- Direct printing of PDF resources

## Grade Structure

Each grade folder contains:
- Exams: The actual exam papers
- Reviews: Study materials and review documents
- Answer Keys: Solutions and marking guides

## How to Use

1. Access the login page and enter your credentials
2. Navigate the dashboard using the term selector in the sidebar
3. Choose a grade and exam type (Mid-term or Final)
4. Select to view/print the Review, Exam, or Answer Key
5. Use the dark mode toggle for better readability in different lighting conditions

## Technologies Used

- HTML5
- CSS3 with Tailwind CSS
- JavaScript (ES6+)
- PDF.js for PDF handling

## Contact

For technical support, use the QR code available in the dashboard. 