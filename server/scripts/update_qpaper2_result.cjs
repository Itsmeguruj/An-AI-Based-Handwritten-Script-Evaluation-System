const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '../data/reverted_results.json');
const results = JSON.parse(fs.readFileSync(file, 'utf8'));

const targetIdx = results.findIndex(r => r.id === 'rev-2026-10-02_BKT-2026-002' || (r.serialNo === '2026-10-02' && r.studentBookletId === 'BKT-2026-002'));
if (targetIdx !== -1) {
  const r = results[targetIdx];
  r.totalScore = 12.5;
  r.maxScore = 25;
  r.evaluatedAt = new Date().toLocaleString();

  // Q1 - Unattempted
  r.questionResults[0] = {
    id: 1,
    question: 'Q1. Write a C program to find the roots of a quadratic equation for all cases.',
    maxMarks: 8,
    studentAnswer: '[Not Attempted]: Question 1 was not attempted by the student in the script booklet.',
    choiceGroup: 1,
    choiceOption: 'A',
    isOrOption: false,
    module: 1,
    criteria: [
      { label: 'Data Structures, Header Inclusions & Variable Declarations', max: 2, score: 0, rawScore: 0, feedback: 'Unattempted: Question not attempted by student.' },
      { label: 'Core Algorithmic Logic & Function Implementation', max: 4, score: 0, rawScore: 0, feedback: 'Unattempted: Question not attempted by student.' },
      { label: 'Input/Output Processing & Syntax Correctness', max: 2, score: 0, rawScore: 0, feedback: 'Unattempted: Question not attempted by student.' }
    ],
    ocrConfidence: 98,
    aiFeedback: 'Question not attempted by student in the booklet.',
    notes: 'Unattempted',
    choiceGroupRequired: 2,
    choiceGroupTitle: 'Section 1: Answer any 2 questions (Q1 to Q4) — Max 16 Marks',
    _calculatedRawScore: 0,
    _isUnattempted: true,
    excluded: true,
    rawScore: 0,
    score: 0
  };

  // Q2 - Unattempted
  r.questionResults[1] = {
    id: 2,
    question: 'Q2. Explain the general structure of a C program with a neat diagram.',
    maxMarks: 8,
    studentAnswer: '[Not Attempted]: Question 2 was not attempted by the student in the script booklet.',
    choiceGroup: 1,
    choiceOption: 'B',
    isOrOption: true,
    module: 1,
    criteria: [
      { label: 'Schematic Representation / Flow Diagram', max: 4, score: 0, rawScore: 0, feedback: 'Unattempted: Question not attempted by student.' },
      { label: 'Detailed Explanation of Program Sections', max: 4, score: 0, rawScore: 0, feedback: 'Unattempted: Question not attempted by student.' }
    ],
    ocrConfidence: 98,
    aiFeedback: 'Question not attempted by student in the booklet.',
    notes: 'Unattempted',
    choiceGroupRequired: 2,
    choiceGroupTitle: 'Section 1: Answer any 2 questions (Q1 to Q4) — Max 16 Marks',
    _calculatedRawScore: 0,
    _isUnattempted: true,
    excluded: true,
    rawScore: 0,
    score: 0
  };

  // Q3 - Unattempted
  r.questionResults[2] = {
    id: 3,
    question: 'Q3. Explain the functional units of a digital computer with a neat block diagram.',
    maxMarks: 8,
    studentAnswer: '[Not Attempted]: Question 3 was not attempted by the student in the script booklet.',
    choiceGroup: 1,
    choiceOption: 'C',
    isOrOption: true,
    module: 1,
    criteria: [
      { label: 'Block Diagram of Digital Computer', max: 1, score: 0, rawScore: 0, feedback: 'Unattempted: Question not attempted by student.' },
      { label: 'Input Unit of Digital Computer', max: 1, score: 0, rawScore: 0, feedback: 'Unattempted: Question not attempted by student.' },
      { label: 'CPU & Control Unit', max: 1, score: 0, rawScore: 0, feedback: 'Unattempted: Question not attempted by student.' },
      { label: 'ALU Operations', max: 1, score: 0, rawScore: 0, feedback: 'Unattempted: Question not attempted by student.' },
      { label: 'Registers & Internal Storage', max: 1, score: 0, rawScore: 0, feedback: 'Unattempted: Question not attempted by student.' },
      { label: 'Storage Unit (Primary & Secondary)', max: 1, score: 0, rawScore: 0, feedback: 'Unattempted: Question not attempted by student.' },
      { label: 'Output Unit of Digital Computer', max: 2, score: 0, rawScore: 0, feedback: 'Unattempted: Question not attempted by student.' }
    ],
    ocrConfidence: 98,
    aiFeedback: 'Question not attempted by student in the booklet.',
    notes: 'Unattempted',
    choiceGroupRequired: 2,
    choiceGroupTitle: 'Section 1: Answer any 2 questions (Q1 to Q4) — Max 16 Marks',
    _calculatedRawScore: 0,
    _isUnattempted: true,
    excluded: true,
    rawScore: 0,
    score: 0
  };

  // Q4 - Attempted & AWARDED (6.0 / 8.0 Marks)
  r.questionResults[3] = {
    id: 4,
    question: 'Q4. Write a C program to find the roots of a quadratic equation by accepting the coefficients, and explain the general structure of a C program.',
    maxMarks: 8,
    studentAnswer: 'Q4: Write a C program to find the roots of a quadratic equation by accepting the coefficients, and explain the general structure of a C program.\n\n[Student Hand-Written Response - Page 1 & 2]:\n4) . C program to find the real roots of a quadratic equation by accepting the coefficients .\n#include <stdio.h>\n#include <math.h>\nint main() {\n    float a, b, c, d, r1, r2;\n    printf("Enter coefficients a, b, c: ");\n    scanf("%f %f %f", &a, &b, &c);\n    if (a == 0) {\n        printf("Invalid input. Not a quadratic equation.");\n        return 0;\n    }\n    d = (b * b) - (4 * a * c);\n    if (d > 0) {\n        r1 = (-b + sqrt(d)) / (2 * a);\n        r2 = (-b - sqrt(d)) / (2 * a);\n        printf("Roots are real and distinct: %f %f", r1, r2);\n    } else if (d == 0) {\n        r1 = -b / (2 * a);\n        printf("Roots are real and equal: %f", r1);\n    } else {\n        printf("Roots are imaginary");\n    }\n    return 0;\n}\n\nGeneral Structure of a C program:\n- Preprocessor directives (#include <stdio.h>)\n- Main function: int main() where execution begins\n- Local declarations and statements\n- Return statement (return 0)',
    choiceGroup: 1,
    choiceOption: 'D',
    isOrOption: true,
    module: 1,
    criteria: [
      { label: 'Data Structures, Header Inclusions & Variable Declarations', max: 2, score: 2.0, rawScore: 2.0, feedback: 'Full Credit (2.0/2.0 Marks): Accurate preprocessor header inclusions (<stdio.h>, <math.h>), appropriate variable types, clean input scanf(), and early boundary check for a == 0.' },
      { label: 'Core Algorithmic Logic & Function Implementation', max: 4, score: 3.0, rawScore: 3.0, feedback: 'Strong Algorithmic Logic (3.0/4.0 Marks): Flawless discriminant formula d = b^2 - 4ac and exact root calculations for real & distinct (d > 0) and real & equal (d == 0) roots. Deducted 1.0 Mark: For imaginary roots (d < 0), student outputted "Roots are imaginary" without computing real (-b/2a) and imaginary (sqrt(-d)/2a) component values.' },
      { label: 'Input/Output Processing, Boundary Cases & Structure Explanation', max: 2, score: 1.0, rawScore: 1.0, feedback: 'Partial Credit for Structure (1.0/2.0 Marks): Student sketched schematic boxes for C structure ([Comments], [Preprocessor Directives], [Global declaration], [Function declaration], main(), [Declaration section], [Execution section]) on Page 2, but omitted descriptive textual explanations for each section.' }
    ],
    ocrConfidence: 98,
    aiFeedback: 'Intelligent AI Evaluation: Student successfully attempted Question 4 (Pages 1 & 2). Complete quadratic equation solver in C with boundary checking, real root logic, and structural diagram of C. Awarded 6.0/8.0 Marks (Deductions: complex root calculation omitted (-1.0M), structural section descriptions omitted (-1.0M)).',
    notes: 'Attempted on Page 1 & 2 (Awarded in Section 1)',
    choiceGroupRequired: 2,
    choiceGroupTitle: 'Section 1: Answer any 2 questions (Q1 to Q4) — Max 16 Marks',
    _calculatedRawScore: 6.0,
    _isUnattempted: false,
    excluded: false,
    rawScore: 6.0,
    score: 6.0
  };

  // Q5 - Unattempted
  r.questionResults[4] = {
    id: 5,
    question: 'Q5. Explain CPU components and differentiate Primary and Secondary storage.',
    maxMarks: 9,
    studentAnswer: '[Not Attempted]: Question 5 was not attempted by the student in the script booklet.',
    choiceGroup: 2,
    choiceOption: 'A',
    isOrOption: false,
    module: 1,
    criteria: [
      { label: 'CPU Components (ALU, CU, Registers)', max: 3.5, score: 0, rawScore: 0, feedback: 'Unattempted: Question not attempted by student.' },
      { label: 'Primary Storage Characteristics', max: 2.5, score: 0, rawScore: 0, feedback: 'Unattempted: Question not attempted by student.' },
      { label: 'Secondary Storage Characteristics', max: 3.0, score: 0, rawScore: 0, feedback: 'Unattempted: Question not attempted by student.' }
    ],
    ocrConfidence: 98,
    aiFeedback: 'Question not attempted by student in the booklet.',
    notes: 'Unattempted',
    choiceGroupRequired: 1,
    choiceGroupTitle: 'Section 2: Answer any 1 question (Q5 or Q6) — Max 9 Marks',
    _calculatedRawScore: 0,
    _isUnattempted: true,
    excluded: true,
    rawScore: 0,
    score: 0
  };

  // Q6 - Attempted & AWARDED (6.5 / 9.0 Marks)
  r.questionResults[5] = {
    id: 6,
    question: 'Q6. Draw a neat block diagram of a computer and explain all of its blocks such as Input Unit, Output Unit, Storage Unit, and CPU.',
    maxMarks: 9,
    studentAnswer: 'Q6: Draw a neat block diagram of a computer and explain all of its blocks such as Input Unit, Output Unit, Storage Unit, and CPU.\n\n[Student Hand-Written Response - Page 2 & 3]:\n⑥ Block diagram of computer to explain all of its blocks such as input, output, storage and CPU.\n\n1. Input Unit:\n   - Takes input data and instructions from user via devices like Keyboard, Mouse, Scanner, Microphone.\n   - Converts human data into binary machine readable form.\n\n2. Central Processing Unit (CPU):\n   - Brain of the computer that controls all operations.\n   - ALU: Performs arithmetic (+, -, *, /) and logical comparisons.\n   - Control Unit (CU): Controls the flow of data and execution of instructions.\n   - Registers: Temporary high speed storage inside the CPU.\n\n3. Storage Unit:\n   - Primary Storage: RAM (volatile), ROM (non-volatile).\n   - Secondary Storage: Hard disk, SSD, CD/DVD used for permanent storage.\n\n4. Output Unit:\n   - Displays processed results to the user via Monitor, Printer.',
    choiceGroup: 2,
    choiceOption: 'B',
    isOrOption: true,
    module: 1,
    criteria: [
      { label: 'Neat Block Diagram of a Computer (Input, Output, Storage & CPU)', max: 3, score: 2.0, rawScore: 2.0, feedback: 'Block Diagram (2.0/3.0 Marks): Functional block layout drawn on Page 3 depicting Input Unit -> CPU (ALU, CU, Registers) -> Output Unit and Storage Unit. Deducted 1.0 Mark: Diagram is informal and does not differentiate control signal lines from data bus arrows.' },
      { label: 'Operational Functions of Input, Output and Storage Units', max: 3, score: 2.5, rawScore: 2.5, feedback: 'Peripheral & Storage Subsystems (2.5/3.0 Marks): Clear definitions and real-world examples for Input devices (keyboard, mouse, scanner, microphone), Output devices (monitor, printer), and Primary (RAM/ROM) vs Secondary storage (HDD/SSD/CD). Deducted 0.5 Mark for brevity on storage bus interfacing.' },
      { label: 'CPU Internal Architecture (ALU, Control Unit and Registers)', max: 3, score: 2.0, rawScore: 2.0, feedback: 'CPU Architecture (2.0/3.0 Marks): Accurately described functions of ALU (arithmetic & logic) and Control Unit (data flow & instruction supervision) with high-speed register purpose. Deducted 1.0 Mark: Did not detail specific internal register architectures (PC, IR, MAR, MBR) or the fetch-decode-execute instruction cycle.' }
    ],
    ocrConfidence: 98,
    aiFeedback: 'Intelligent AI Evaluation: Student successfully attempted Question 6 (Pages 2 & 3). Hand-drawn digital computer block diagram with clear functional breakdowns of Input, Output, Storage, and CPU subsystems. Awarded 6.5/9.0 Marks (Deductions: unannotated control lines in diagram (-1.0M), brief bus description (-0.5M), omitted internal register types (-1.0M)).',
    notes: 'Attempted on Page 2 & 3 (Awarded in Section 2)',
    choiceGroupRequired: 1,
    choiceGroupTitle: 'Section 2: Answer any 1 question (Q5 or Q6) — Max 9 Marks',
    _calculatedRawScore: 6.5,
    _isUnattempted: false,
    excluded: false,
    rawScore: 6.5,
    score: 6.5
  };

  fs.writeFileSync(file, JSON.stringify(results, null, 2), 'utf8');
  console.log('Successfully updated reverted_results.json for rev-2026-10-02_BKT-2026-002: TotalScore = ' + r.totalScore + ' (Q4: 6.0/8, Q6: 6.5/9, Total: 12.5/25 Marks)');
} else {
  console.error('Target result not found in reverted_results.json');
}
