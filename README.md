🧠 AI-Based Handwriting Evaluation System

An intelligent web-based system for AI-assisted evaluation of handwritten examination answer scripts using Computer Vision, OCR, Natural Language Processing, semantic analysis, and Neural Networks.

The system enables administrators to upload question papers and model answers, assign evaluation tasks to coordinators, and receive verified evaluation results through a structured workflow. A customizable Rubric Marking Criteria Builder allows question-specific marking criteria, weights, keywords, concepts, and scoring rules to be configured.

---

📌 Project Overview

The AI-Based Handwriting Evaluation System is a full-stack application designed to assist educational institutions in evaluating handwritten examination answer scripts.

The system combines:

- Computer Vision
- Optical Character Recognition (OCR)
- Natural Language Processing (NLP)
- TF-IDF
- Cosine Similarity
- Semantic Analysis
- Neural Network-based 
- Rubric-based scoring

The platform follows a controlled Admin–Coordinator workflow, where the Admin manages examination materials and assignments, while the Coordinator performs and verifies the AI-assisted evaluation before submitting the results back to the Admin.

The goal is to reduce manual workload, improve evaluation consistency, and provide a transparent and explainable assessment process.

---

🎯 Objectives

- Automate and assist handwritten answer evaluation.
- Convert handwritten answers into machine-readable text.
- Compare student answers with model answers.
- Analyze semantic similarity and relevant concepts.
- Apply Neural Network-based intelligent analysis.
- Provide customizable rubric-based marking.
- Reduce manual evaluation time and effort.
- Improve consistency in assessment.
- Provide explainable evaluation results.
- Enable coordinator verification of AI-generated marks.
- Provide secure role-based access.
- Maintain a structured Admin–Coordinator evaluation workflow.

---

✨ Key Features

🔐 Authentication & Security

- Secure user authentication
- JWT-based authentication
- OTP verification
- Password reset
- Protected API routes
- Role-based access control
- Document verification
- Secure environment variables
- Input validation

---

👨‍💼 Admin Panel

The Admin acts as the central authority of the evaluation workflow.

Question Paper Management

- Upload examination question papers
- Create and manage examinations
- Add questions and maximum marks
- Manage question-wise evaluation criteria

Model Answer Management

- Upload model answer papers
- Associate model answers with questions
- Manage reference answers
- Configure expected concepts and keywords

Evaluation Assignment

Admin can:

- Select an examination
- Select question/model answer
- Select handwritten answer scripts
- Assign evaluation work to a Coordinator
- Set evaluation deadlines
- Track assignment status
- Monitor evaluation progress

Result Management

Admin can:

- Receive completed evaluations from Coordinators
- Review AI-generated and coordinator-verified marks
- View question-wise scores
- View total marks
- Review evaluation feedback
- Maintain final evaluation records
- Generate evaluation reports

---

👨‍🏫 Coordinator Panel

The Coordinator is responsible for performing and verifying the assigned evaluation.

Assigned Tasks

- View assigned examinations
- View assigned question papers
- Access model answers
- Access assigned handwritten answer scripts
- View evaluation deadlines
- Track task status

AI-Assisted Evaluation

The Coordinator can initiate the AI evaluation pipeline.

The system processes the answer script through:

Handwritten Answer
       ↓
Image Preprocessing
       ↓
OCR
       ↓
Text Preprocessing
       ↓
NLP Analysis
       ↓
TF-IDF / Vectorization
       ↓
Cosine Similarity
       ↓
Semantic Analysis
       ↓
Neural Network Analysis
       ↓
Keyword & Concept Matching
       ↓
Rubric-Based Scoring
       ↓
AI-Generated Marks

Evaluation Verification

The Coordinator can:

- Review extracted text
- Review AI-generated scores
- View matched keywords
- View matched concepts
- Review similarity scores
- Review rubric-wise marks
- Correct/adjust marks when required
- Add evaluation remarks
- Approve the final evaluation

Submit Results

After verification, the Coordinator submits the completed evaluation to the Admin.

Coordinator
     ↓
Review AI Evaluation
     ↓
Verify / Adjust Marks
     ↓
Approve Evaluation
     ↓
Submit Results
     ↓
Admin

---

🤖 AI-Based Evaluation

The system uses multiple AI and NLP techniques to provide AI-assisted grading.

1. Image Preprocessing

Handwritten answer-sheet images are processed using OpenCV.

Processing may include:

- Image resizing
- Grayscale conversion
- Noise removal
- Thresholding
- Contrast enhancement
- Binarization
- Deskewing
- Image normalization

The objective is to improve image quality before OCR processing.

---

2. OCR Processing

The processed image is passed through an OCR engine such as Tesseract OCR.

Handwritten Image
        ↓
Preprocessed Image
        ↓
OCR Engine
        ↓
Extracted Text

OCR converts the handwritten answer into machine-readable text for further processing.

---

3. NLP Processing

The extracted text is cleaned and normalized before evaluation.

NLP processing can include:

- Text cleaning
- Tokenization
- Case normalization
- Stop-word processing
- Punctuation handling
- Lemmatization/stemming
- Sentence segmentation
- Keyword extraction

---

4. TF-IDF Vectorization

The system can represent student answers and model answers as numerical vectors using TF-IDF.

This helps identify the importance of words within the answer and reference material.

---

5. Cosine Similarity

The system calculates the similarity between the student answer and model answer.

Student Answer
       ↓
TF-IDF Vector
       │
       │
       ├──── Cosine Similarity ────┐
       │                           │
Model Answer                       │
       ↓                           │
TF-IDF Vector                      │
                                   ↓
                         Similarity Score

A higher similarity score indicates stronger textual alignment between the answers.

---

🧠 Semantic Analysis

Simple keyword matching may not always identify conceptually correct answers.

Therefore, the system can incorporate semantic analysis to identify relationships between words, phrases

For example:

Model Answer

«Plants use sunlight to convert carbon dioxide and water into glucose through photosynthesis.»

Student Answer

«Green plants use solar energy to produce food from carbon dioxide and water.

Although the wording differs, the system can identify related concepts such as:

- Plants / Green plants
- Sunlight / Solar energy
- Carbon dioxide
- Water
- Food / Glucose
- Photosynthesis

This allows the system to assess meaning rather than exact word matching.

---

🧬 Neural Network Integration

The system can incorporate a Neural Network-based evaluation layer to improve intelligent answer assessment.

The Neural Network can analyze features such as:

- Extracted answer text
- Semantic representation
- Keyword relevance
- Concept matching
- Similarity scores
- Answer completeness
- Rubric-specific features

Example architecture:

                  Input Features
                       │
                       ▼
              ┌─────────────────┐
              │  Input Layer    │
              └────────┬────────┘
                       ↓
              ┌─────────────────┐
              │ Hidden Layer 1  │
              └────────┬────────┘
                       ↓
              ┌─────────────────┐
              │ Hidden Layer 2  │
              └────────┬────────┘
                       ↓
              ┌─────────────────┐
              │ Output Layer    │
              └────────┬────────┘
                       ↓
                Evaluation Score

The Neural Network layer can be used to improve the system's ability to identify answer quality and relevance beyond basic lexical similarity.

---

🧩 Rubric Marking Criteria Builder

The Rubric Marking Criteria Builder is a major component of the system.

It allows the Admin to create customized marking schemes for individual questions.

Administrators can configure:

- Criteria name
- Maximum marks
- Weight
- Required keywords
- Important concepts
- Semantic similarity requirements
- Partial-mark rules
- Minimum/maximum score
- Question-specific evaluation instructions

Example Rubric

Criterion| Weight
Keyword Relevance| 20%
Concept Accuracy| 40%
Semantic Similarity| 25%
Answer Relevance| 15%
Total| 100%

The evaluation engine uses the configured rubric to calculate an AI-assisted score.

---

📊 Example Evaluation

Question

Explain the process of photosynthesis.

Model Answer

«Photosynthesis is the process by which green plants use sunlight, carbon dioxide, and water to produce glucose and oxygen.»

Student Answer

«Green plants use sunlight to prepare food using carbon dioxide and water, releasing oxygen during the process.»

AI Analysis

Keyword Relevance       → High
Concept Accuracy        → High
Semantic Similarity     → High
Answer Relevance        → High
Completeness            → High

Example Result

Maximum Marks : 10

Keyword Relevance    : 1.8 / 2
Concept Accuracy     : 3.8 / 4
Semantic Similarity  : 2.3 / 2.5
Answer Relevance     : 1.4 / 1.5

AI Score             : 9.3 / 10

The Coordinator reviews the generated evaluation and can verify or modify the final score before submitting it to the Admin.

---

🧠 Overall System Architecture

                       ┌─────────────────────┐
                       │       ADMIN         │
                       └──────────┬──────────┘
                                  │
                    Upload Question Paper
                                  │
                    Upload Model Answer
                                  │
                    Create Rubric Criteria
                                  │
                    Assign Evaluation Task
                                  │
                                  ▼
                       ┌─────────────────────┐
                       │    COORDINATOR      │
                       └──────────┬──────────┘
                                  │
                         Access Assignment
                                  │
                                  ▼
                       Handwritten Answer
                                  │
                                  ▼
                       ┌─────────────────────┐
                       │      OpenCV         │
                       │ Image Preprocessing │
                       └──────────┬──────────┘
                                  ↓
                       ┌─────────────────────┐
                       │    Tesseract OCR    │
                       │   Text Extraction   │
                       └──────────┬──────────┘
                                  ↓
                       ┌─────────────────────┐
                       │        NLP          │
                       │ Text Preprocessing  │
                       └──────────┬──────────┘
                                  ↓
                       ┌─────────────────────┐
                       │   TF-IDF / Vectors  │
                       └──────────┬──────────┘
                                  ↓
                       ┌─────────────────────┐
                       │ Cosine Similarity   │
                       └──────────┬──────────┘
                                  ↓
                       ┌─────────────────────┐
                       │ Semantic Analysis   │
                       └──────────┬──────────┘
                                  ↓
                       ┌─────────────────────┐
                       │ Neural Network      │
                       └──────────┬──────────┘
                                  ↓
                       ┌─────────────────────┐
                       │ Rubric Score Engine │
                       └──────────┬──────────┘
                                  ↓
                       ┌─────────────────────┐
                       │   AI Evaluation     │
                       └──────────┬──────────┘
                                  ↓
                       Coordinator Verification
                                  │
                                  ▼
                       ┌─────────────────────┐
                       │    Final Results    │
                       └──────────┬──────────┘
                                  │
                                  ▼
                       ┌─────────────────────┐
                       │       ADMIN         │
                       │ Review & Management │
                       └─────────────────────┘

---

🔄 Complete Evaluation Workflow

1. Admin Login
       ↓
2. Upload Question Paper
       ↓
3. Upload Model Answer Paper
       ↓
4. Configure Rubric Marking Criteria
       ↓
5. Upload / Select Handwritten Answer Scripts
       ↓
6. Assign Evaluation to Coordinator
       ↓
7. Coordinator Receives Assignment
       ↓
8. AI Image Preprocessing
       ↓
9. OCR Text Extraction
       ↓
10. NLP Processing
       ↓
11. TF-IDF Vectorization
       ↓
12. Cosine Similarity
       ↓
13. Semantic Analysis
       ↓
14. Neural Network Analysis
       ↓
15. Rubric-Based Scoring
       ↓
16. AI-Generated Evaluation
       ↓
17. Coordinator Reviews Evaluation
       ↓
18. Coordinator Adjusts / Verifies Marks
       ↓
19. Coordinator Submits Final Results
       ↓
20. Admin Receives Results
       ↓
21. Admin Reviews & Finalizes Evaluation

---

👥 User Roles

Admin

The Admin manages the complete evaluation lifecycle.

- Upload question papers
- Upload model answer papers
- Manage examinations
- Configure rubrics
- Upload/manage answer scripts
- Assign work to Coordinators
- Set deadlines
- Track evaluation progress
- Receive completed evaluations
- Review final results
- Manage evaluation records

Coordinator

The Coordinator performs and verifies assigned evaluations.

- View assigned tasks
- Access question papers
- Access model answers
- Access handwritten answer scripts
- Run AI-assisted evaluation
- Review OCR output
- Review AI scores
- Review rubric-wise marks
- Verify/modify marks
- Add evaluation remarks
- Submit results to Admin

---

🛠️ Technology Stack

Frontend

- React
- React 19
- TypeScript
- Vite
- HTML5
- CSS3
- JavaScript
- Responsive UI
- Glassmorphism UI

Backend

- Node.js
- Express.js
- REST APIs
- JWT Authentication
- OTP Verification

Database

- MongoDB
- MongoDB Atlas

AI / ML / NLP

- Python
- OpenCV
- Tesseract OCR
- Natural Language Processing
- TF-IDF
- Cosine Similarity
- Semantic Analysis
- Neural Networks
- Keyword Extraction
- Concept Matching
- Rubric-Based Scoring

Development Tools

- Git
- GitHub
- Visual Studio Code
- Postman
- npm

---

📂 Project Structure

AI-Handwriting-Evaluation-System/
│
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── hooks/
│       ├── assets/
│       ├── App.tsx
│       └── main.tsx
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── utils/
│   └── server.js
│
├── ai/
│   ├── preprocessing/
│   ├── ocr/
│   ├── nlp/
│   ├── semantic/
│   ├── neural_network/
│   ├── evaluation/
│   └── models/
│
├── .gitignore
├── package.json
├── README.md
└── LICENSE

---

⚙️ Installation & Setup

1. Clone the Repository

git clone https://github.com/your-username/AI-Handwriting-Evaluation-System.git

2. Navigate to the Project

cd AI-Handwriting-Evaluation-System

3. Install Frontend Dependencies

cd client
npm install

4. Install Backend Dependencies

cd ../server
npm install

---

🔑 Environment Variables

Create a ".env" file inside the "server" directory.

PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

OTP_SECRET=your_otp_secret

CLIENT_URL=http://localhost:5173

«⚠️ Important: Never commit ".env" files, passwords, API keys, database credentials, or other secrets to GitHub.»

---

▶️ Running the Application

Start Frontend

cd client
npm run dev

Frontend:

http://localhost:5173

Start Backend

cd server
npm run dev

Backend:

http://localhost:5000

---

📈 Advantages

- AI-Assisted: Uses multiple AI/ML techniques for evaluation.
- Faster: Reduces the time required for manual assessment.
- Consistent: Uses configurable marking criteria.
- Explainable: Provides criterion-wise evaluation.
- Human Verified: Coordinator reviews AI-generated marks.
- Scalable: Can support large volumes of answer scripts.
- Secure: Uses authentication and role-based authorization.
- Flexible: Rubrics can be customized for different questions.
- Modular: AI components can be upgraded independently.

---

🚀 Future Enhancements

- Advanced deep-learning handwriting recognition
- Transformer-based semantic evaluation
- Multilingual handwriting recognition
- Kannada and other regional-language support
- Mathematical equation recognition
- Diagram recognition and evaluation
- Handwriting quality analysis
- Automated feedback generation
- AI-generated improvement suggestions
- Advanced plagiarism detection
- Learning analytics
- Performance dashboards
- Explainable AI visualizations
- Cloud-based AI processing
- Teacher/coordinator feedback learning
- Continuous model improvement
- Human-in-the-loop model training

---

🔒 Security

The system incorporates:

- JWT authentication
- OTP verification
- Password reset
- Protected API endpoints
- Role-based authorization
- Input validation
- Document verification
- Secure environment configuration
- Database access control

---

🎓 Academic Project

Project Title

AI-Based Handwriting Evaluation System

Domain

Artificial Intelligence & Machine Learning

Application Area

Education Technology / Automated Assessment

Technology

React, TypeScript, Vite, Node.js, Express.js, MongoDB, OpenCV, Tesseract OCR, NLP, TF-IDF, Cosine Similarity, Semantic Analysis, Neural Networks

Purpose

To develop an AI-assisted system capable of processing handwritten examination answer scripts, comparing them against model answers, applying customizable marking rubrics, and generating evaluation results that can be reviewed and verified by a Coordinator before being submitted to the Admin.

---

📜 License

This project is developed for academic and educational purposes.

---

👨‍💻 Author

Guru Raghavendra J

Computer Science & Engineering
Visvesvaraya Technological University (VTU)

---

⭐ If you find this project useful, consider giving the repository a star.
