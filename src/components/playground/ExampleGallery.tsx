'use client'

import { Button } from '@/components/ui/button'

export interface Example {
  id: string
  title: string
  description: string
  code: string
  category: 'basic' | 'timer' | 'fs' | 'http' | 'process'
}

export const examples: Example[] = [
  {
    id: 'hello-world',
    title: 'Hello World',
    description: 'Basic console.log example',
    category: 'basic',
    code: `console.log("Hello, Kiren!");

const sum = (a, b) => a + b;
console.log("5 + 3 =", sum(5, 3));

// Modern JavaScript features
const greeting = \`Welcome to Kiren runtime!\`;
console.log(greeting);`
  },
  {
    id: 'timers',
    title: 'Timer APIs',
    description: 'setTimeout and setInterval examples',
    category: 'timer',
    code: `// setTimeout example
setTimeout(() => {
    console.log("This runs after 1 second");
}, 1000);

// setInterval example
let counter = 0;
const intervalId = setInterval(() => {
    counter++;
    console.log(\`Counter: \${counter}\`);
    
    if (counter >= 5) {
        clearInterval(intervalId);
        console.log("Interval stopped");
    }
}, 1000);

console.log("Timer examples started!");`
  },
  {
    id: 'file-system',
    title: 'File System',
    description: 'File operations with fs API',
    category: 'fs',
    code: `// File system operations
console.log("File System Demo");

// Write a file
fs.writeFile("demo.txt", "Hello from Kiren!");
console.log("File written successfully");

// Read the file
if (fs.exists("demo.txt")) {
    const content = fs.readFile("demo.txt");
    console.log("File content:", content);
} else {
    console.log("File does not exist");
}

// Create directory
fs.mkdir("demo-folder");
console.log("Directory created");

// Check if directory exists
console.log("Directory exists:", fs.exists("demo-folder"));`
  },
  {
    id: 'http-server',
    title: 'HTTP Server',
    description: 'Create a simple web server',
    category: 'http',
    code: `// HTTP Server example
const server = http.createServer();

// Define routes
server.get("/", () => {
    return {
        message: "Hello from Kiren!",
        runtime: "Kiren v3.0.0",
        timestamp: new Date().toISOString()
    };
});

server.get("/api/users", () => {
    return {
        users: ["Alice", "Bob", "Charlie"]
    };
});

server.post("/api/data", () => {
    return {
        message: "Data received successfully",
        status: "ok"
    };
});

// Start server
server.listen(3000);
console.log("🚀 Server ready at http://localhost:3000");`
  },
  {
    id: 'process-api',
    title: 'Process API',
    description: 'Access environment and process information',
    category: 'process',
    code: `// Process API examples
console.log("Process Information:");

// Environment variables
console.log("HOME directory:", process.env.HOME);
console.log("PATH:", process.env.PATH);

// Command line arguments
console.log("Arguments:", process.argv);

// Current working directory
console.log("Working directory:", process.cwd());

// Custom environment check
if (process.env.NODE_ENV) {
    console.log("Running in:", process.env.NODE_ENV);
} else {
    console.log("NODE_ENV not set");
}

console.log("Process demo completed!");`
  },
  {
    id: 'fetch-api',
    title: 'Fetch API',
    description: 'HTTP requests with fetch',
    category: 'http',
    code: `// Fetch API example
console.log("Starting HTTP request...");

// Simple GET request
fetch("https://api.github.com/users/mertcanaltin")
    .then(response => {
        console.log("Response status:", response.status);
        return response.json();
    })
    .then(data => {
        console.log("User info:", {
            name: data.name,
            login: data.login,
            public_repos: data.public_repos
        });
    })
    .catch(error => {
        console.error("Request failed:", error);
    });

console.log("Request sent! Waiting for response...");`
  }
]

interface ExampleGalleryProps {
  onSelectExample: (example: Example) => void
  className?: string
}

export function ExampleGallery({ onSelectExample, className }: ExampleGalleryProps) {
  const categories = {
    basic: 'Basic Examples',
    timer: 'Timer APIs',
    fs: 'File System',
    http: 'HTTP & Networking',
    process: 'Process API'
  }

  const groupedExamples = examples.reduce((acc, example) => {
    if (!acc[example.category]) {
      acc[example.category] = []
    }
    acc[example.category].push(example)
    return acc
  }, {} as Record<string, Example[]>)

  return (
    <div className={className}>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#bb1a1e' }}>Example Gallery</h2>
          <p className="text-sm text-gray-600 mb-6">
            Explore Kiren runtime features with these interactive examples
          </p>
        </div>
        
        {Object.entries(groupedExamples).map(([category, categoryExamples]) => (
          <div key={category} className="space-y-3">
            <h3 className="text-md font-medium" style={{ color: '#bb1a1e' }}>
              {categories[category as keyof typeof categories]}
            </h3>
            <div className="grid gap-3">
              {categoryExamples.map((example) => (
                <div 
                  key={example.id} 
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium" style={{ color: '#bb1a1e' }}>{example.title}</h4>
                    <Button 
                      size="sm" 
                      onClick={() => onSelectExample(example)}
                      className="ml-4"
                    >
                      Load
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">{example.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}