import { Test, TestSubmission } from '../types';

export const mockTests: Test[] = [
  {
    id: '101',
    titre: 'Frontend Developer Skills Assessment',
    dureeMinutes: 30,
    categorie: 'Web Development',
    description: 'This test evaluates your knowledge of modern frontend technologies and best practices.',
    questions: [
      {
        id: '1001',
        text: 'Which of the following is NOT a hook in React?',
        type: 'single',
        options: ['useContext', 'useEffect', 'useState', 'useComponent'],
        correctAnswers: 'useComponent',
        points: 5
      },
      {
        id: '1002',
        text: 'What is the correct way to pass props to a component in React?',
        type: 'single',
        options: [
          '<Component props={props} />',
          '<Component {...props} />',
          '<Component props="props" />',
          '<Component prop1="value1" prop2="value2" />'
        ],
        correctAnswers: '<Component prop1="value1" prop2="value2" />',
        points: 5
      },
      {
        id: '1003',
        text: 'Which of the following are valid CSS selectors? (Select all that apply)',
        type: 'multiple',
        options: ['.class-name', '#id-name', '*element', '&hover'],
        correctAnswers: ['.class-name', '#id-name'],
        points: 5
      },
      {
        id: '1004',
        text: 'What does the following code do? const [count, setCount] = useState(0);',
        type: 'single',
        options: [
          'Declares a constant variable named count with an initial value of 0',
          'Creates a state variable called count with an initial value of 0 and a function to update it named setCount',
          'Creates an array with two elements: count and setCount, both initialized to 0',
          'None of the above'
        ],
        correctAnswers: 'Creates a state variable called count with an initial value of 0 and a function to update it named setCount',
        points: 5
      },
      {
        id: '1005',
        text: 'Explain what the CSS property "z-index" does and how it affects element rendering.',
        type: 'text',
        correctAnswers: 'The z-index property specifies the stack order of an element. An element with greater stack order is always in front of an element with a lower stack order. It only works on positioned elements (position: absolute, position: relative, position: fixed, or position: sticky).',
        points: 10
      }
    ]
  },
  {
    id: '102',
    titre: 'JavaScript Fundamentals Test',
    dureeMinutes: 20,
    categorie: 'Web Development',
    description: 'This test covers core JavaScript concepts and basic programming knowledge.',
    questions: [
      {
        id: '1006',
        text: 'What will be the output of the following code? console.log(typeof null);',
        type: 'single',
        options: ['null', 'object', 'undefined', 'string'],
        correctAnswers: 'object',
        points: 5
      },
      {
        id: '1007',
        text: 'Which of the following methods can be used to add an element to the end of an array?',
        type: 'multiple',
        options: ['push()', 'append()', 'pop()', 'concat()'],
        correctAnswers: ['push()', 'concat()'],
        points: 5
      },
      {
        id: '1008',
        text: 'What is the difference between let and var in JavaScript?',
        type: 'text',
        correctAnswers: 'let is block-scoped while var is function-scoped. Variables declared with let can\'t be redeclared in the same scope, and they are not hoisted to the top of their scope, unlike var declarations.',
        points: 10
      }
    ]
  },
  {
    id: '103',
    titre: 'Node.js and Backend Development',
    dureeMinutes: 25,
    categorie: 'Backend Development',
    description: 'This test evaluates your knowledge of Node.js and backend development concepts.',
    questions: [
      {
        id: '1009',
        text: 'Which module in Node.js is used to create a web server?',
        type: 'single',
        options: ['http', 'web', 'server', 'net'],
        correctAnswers: 'http',
        points: 5
      },
      {
        id: '1010',
        text: 'What is middleware in the context of Express.js?',
        type: 'single',
        options: [
          'A function that has access to the request and response objects',
          'A database connection tool',
          'A method to create routes',
          'A testing framework'
        ],
        correctAnswers: 'A function that has access to the request and response objects',
        points: 5
      },
      {
        id: '1011',
        text: 'Which of the following are NoSQL databases? (Select all that apply)',
        type: 'multiple',
        options: ['MongoDB', 'MySQL', 'Redis', 'PostgreSQL'],
        correctAnswers: ['MongoDB', 'Redis'],
        points: 5
      },
      {
        id: '1012',
        text: 'Explain what CORS is and why it is important in web development.',
        type: 'text',
        correctAnswers: 'CORS (Cross-Origin Resource Sharing) is a security feature implemented by browsers that restricts web pages from making requests to a different domain than the one that served the original page. It is important because it prevents malicious websites from making unauthorized requests to other websites on behalf of a user.',
        points: 10
      }
    ]
  },
  {
    id: '104',
    titre: 'UI/UX Design Principles',
    dureeMinutes: 20,
    categorie: 'Design',
    description: 'This test evaluates your understanding of UI/UX design principles and best practices.',
    questions: [
      {
        id: '1013',
        text: 'What does the term "affordance" refer to in UX design?',
        type: 'single',
        options: [
          'The cost of implementing a design',
          'A property of an object that indicates how it can be used',
          'The emotional response to a design',
          'The accessibility features of a design'
        ],
        correctAnswers: 'A property of an object that indicates how it can be used',
        points: 5
      },
      {
        id: '1014',
        text: 'Which of the following are principles of gestalt theory in design? (Select all that apply)',
        type: 'multiple',
        options: ['Proximity', 'Similarity', 'Affordance', 'Continuation'],
        correctAnswers: ['Proximity', 'Similarity', 'Continuation'],
        points: 5
      },
      {
        id: '1015',
        text: 'What is the difference between UX and UI design?',
        type: 'text',
        correctAnswers: 'UI (User Interface) design focuses on the visual elements of a product, such as buttons, icons, spacing, typography, and color schemes. UX (User Experience) design is concerned with the overall feel of the experience and how users interact with the product, including usability, accessibility, and the emotional response.',
        points: 10
      }
    ]
  },
  {
    id: '105',
    titre: 'DevOps and Cloud Infrastructure',
    dureeMinutes: 30,
    categorie: 'DevOps',
    description: 'This test evaluates your knowledge of DevOps practices and cloud infrastructure.',
    questions: [
      {
        id: '1016',
        text: 'What is the primary purpose of CI/CD in development?',
        type: 'single',
        options: [
          'To automate the testing and deployment process',
          'To manage server configurations',
          'To monitor application performance',
          'To design database schemas'
        ],
        correctAnswers: 'To automate the testing and deployment process',
        points: 5
      },
      {
        id: '1017',
        text: 'Which of the following are container orchestration platforms? (Select all that apply)',
        type: 'multiple',
        options: ['Kubernetes', 'Docker', 'Jenkins', 'Amazon ECS'],
        correctAnswers: ['Kubernetes', 'Amazon ECS'],
        points: 5
      },
      {
        id: '1018',
        text: 'What is the difference between horizontal and vertical scaling?',
        type: 'text',
        correctAnswers: 'Horizontal scaling (scaling out) refers to adding more machines or nodes to your system to handle increased load, distributing the workload across multiple servers. Vertical scaling (scaling up) refers to adding more power (CPU, RAM) to an existing machine. Horizontal scaling is typically more flexible and fault-tolerant but may require application changes to distribute workload.',
        points: 10
      }
    ]
  }
];

export const mockTestSubmissions: TestSubmission[] = [
  {
    id: '201',
    testId: '101',
    candidateId: '3', // Matches user id for candidate
    testTitle: 'Frontend Developer Skills Assessment',
    startTime: new Date('2023-05-25T10:00:00'),
    endTime: new Date('2023-05-25T10:28:00'),
    answers: [
      { questionId: '1001', answer: 'useComponent' },
      { questionId: '1002', answer: '<Component prop1="value1" prop2="value2" />' },
      { questionId: '1003', answer: ['.class-name', '#id-name'] },
      { questionId: '1004', answer: 'Creates a state variable called count with an initial value of 0 and a function to update it named setCount' },
      { questionId: '1005', answer: 'The z-index property controls the vertical stacking order of elements that overlap. A higher value means the element will be placed on top of elements with lower values.' }
    ],
    score: 25,
    maxScore: 30,
    percentage: 83
  },
  {
    id: '202',
    testId: '102',
    candidateId: '3', // Matches user id for candidate
    testTitle: 'JavaScript Fundamentals Test',
    startTime: new Date('2023-05-26T14:00:00'),
    endTime: new Date('2023-05-26T14:18:00'),
    answers: [
      { questionId: '1006', answer: 'object' },
      { questionId: '1007', answer: ['push()', 'append()'] }, // Incorrect
      { questionId: '1008', answer: 'let is block-scoped and var is function-scoped. let cannot be redeclared in the same scope.' }
    ],
    score: 10,
    maxScore: 20,
    percentage: 50
  },
  {
    id: '203',
    testId: '103',
    candidateId: '3', // Matches user id for candidate
    testTitle: 'Node.js and Backend Development',
    startTime: new Date('2023-05-27T11:00:00'),
    endTime: new Date('2023-05-27T11:22:00'),
    answers: [
      { questionId: '1009', answer: 'http' },
      { questionId: '1010', answer: 'A function that has access to the request and response objects' },
      { questionId: '1011', answer: ['MongoDB', 'Redis'] },
      { questionId: '1012', answer: 'CORS is a security feature that restricts cross-origin HTTP requests. It prevents websites from making requests to domains other than the one that served the web page.' }
    ],
    score: 25,
    maxScore: 25,
    percentage: 100
  }
];