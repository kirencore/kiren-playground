'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { CodeEditor } from '@/components/playground/CodeEditor'
import { Console, ConsoleMessage } from '@/components/playground/Console'
import { ExampleGallery, Example } from '@/components/playground/ExampleGallery'
import { WasmExecutor } from '@/lib/wasm-executor'
import { Play, Square, Share, Download, Github, ExternalLink, Zap } from 'lucide-react'

const DEFAULT_CODE = `// Welcome to Kiren Playground! 
// ⚡ WASM-powered JavaScript runtime

console.log("Hello, Kiren! 🦀");
console.log("Running in WebAssembly mode!");

// Try modern JavaScript features
const greeting = \`Welcome to Kiren WASM v3.0.0!\`;
console.log(greeting);

// Math operations
const fibonacci = (n) => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
};

console.log("Fibonacci(8):", fibonacci(8));

// Object operations  
const user = { name: "Developer", age: 25 };
console.log("User:", user);

// Array operations
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(x => x * 2);
console.log("Doubled:", doubled);

console.log("✅ WASM execution completed!");`

export default function PlaygroundPage() {
  const [code, setCode] = useState(DEFAULT_CODE)
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([])
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionStats, setExecutionStats] = useState<{
    executionTime?: number
    memoryUsage?: number
    mode?: string
  }>({})
  const [showExamples, setShowExamples] = useState(false)
  // WASM is the only execution method now
  const [wasmExecutor] = useState(() => new WasmExecutor())
  const [enableFallback, setEnableFallback] = useState(true) // Allow fallback to simulation


  const addConsoleMessage = useCallback((type: ConsoleMessage['type'], content: string) => {
    const message: ConsoleMessage = {
      id: Date.now().toString() + Math.random(),
      type,
      content,
      timestamp: new Date()
    }
    setConsoleMessages(prev => [...prev, message])
  }, [])

  const executeCode = async () => {
    if (isExecuting) return
    
    setIsExecuting(true)
    setConsoleMessages([]) // Clear previous output
    
    // Always try WASM first, fallback to simulation if needed
    await executeCodeWASM()
  }

  const executeCodeWASM = async () => {
    addConsoleMessage('info', '⚡ Executing code via WASM...')
    
    try {
      // Check if WASM is still loading
      if (wasmExecutor.isLoading()) {
        addConsoleMessage('info', '🦀 Loading Kiren WASM runtime...')
      }
      
      const result = await wasmExecutor.executeCode(code, {
        timeout: 30000,
        enableConsole: true,
        enableTimers: true,
        enableFetch: true
      })
      
      if (result.success) {
        addConsoleMessage('success', result.output)
        setExecutionStats({
          executionTime: result.executionTime,
          memoryUsage: result.memoryUsage,
          mode: 'wasm'
        })
        
        // Show WASM info on first successful execution
        const info = wasmExecutor.getInfo()
        if (info) {
          addConsoleMessage('info', `🦀 Kiren WASM v${info.version} (${result.executionTime.toFixed(2)}ms)`)
        }
      } else {
        addConsoleMessage('error', result.error || 'WASM execution failed')
        if (result.error?.includes('not initialized') && enableFallback) {
          addConsoleMessage('warn', 'Falling back to simulation...')
          await executeCodeSimulation()
          return
        }
        setExecutionStats({ mode: 'wasm' })
      }
    } catch (error) {
      addConsoleMessage('error', `WASM error: ${String(error)}`)
      if (enableFallback) {
        addConsoleMessage('warn', 'Falling back to simulation...')
        await executeCodeSimulation()
      }
    } finally {
      setIsExecuting(false)
    }
  }

  const executeCodeSimulation = async () => {
    addConsoleMessage('info', '🎭 Executing code via simulation...')
    
    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code })
      })
      
      const result = await response.json()
      
      if (result.success) {
        addConsoleMessage('success', result.output)
        setExecutionStats({
          executionTime: result.executionTime,
          memoryUsage: result.memoryUsage,
          mode: result.mode
        })
      } else {
        addConsoleMessage('error', result.error || 'Simulation failed')
        setExecutionStats({ mode: 'simulation' })
      }
    } catch (error) {
      addConsoleMessage('error', `Simulation error: ${String(error)}`)
    } finally {
      setIsExecuting(false)
    }
  }

  const stopExecution = () => {
    setIsExecuting(false)
    addConsoleMessage('warn', 'Execution stopped by user')
  }

  const clearConsole = () => {
    setConsoleMessages([])
    setExecutionStats({})
  }

  const handleExampleSelect = (example: Example) => {
    setCode(example.code)
    setShowExamples(false)
    addConsoleMessage('info', `Loaded example: ${example.title}`)
  }

  const shareCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      addConsoleMessage('success', 'Code copied to clipboard!')
    } catch {
      addConsoleMessage('error', 'Failed to copy code')
    }
  }

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'kiren-code.js'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    addConsoleMessage('success', 'Code downloaded as kiren-code.js')
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <img 
              src="https://kirencore.vercel.app/assets/logo-7b7f2159.png" 
              alt="Kiren Logo" 
              className="w-10 h-10"
            />
            <div>
              <h1 className="text-xl font-bold" style={{ color: '#bb1a1e' }}>Kiren Playground</h1>
              <p className="text-sm text-gray-600">High-performance JavaScript runtime built with Rust</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowExamples(!showExamples)}
          >
            Examples
          </Button>
          <Button variant="outline" size="sm" onClick={shareCode}>
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={downloadCode}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open('https://github.com/kirencore/kiren', '_blank')}
          >
            <Github className="w-4 h-4 mr-2" />
            GitHub
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar - Examples */}
        {showExamples && (
          <div className="w-80 bg-white border-r">
            <ExampleGallery 
              onSelectExample={handleExampleSelect}
              className="p-6 h-full overflow-y-auto"
            />
          </div>
        )}
        
        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className="bg-white border-b px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={executeCode} 
                  disabled={isExecuting}
                  className="gap-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  {isExecuting ? (
                    <Square className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  {isExecuting ? 'Running...' : 'Run Code'}
                </Button>
                
                {isExecuting && (
                  <Button size="sm" variant="outline" onClick={stopExecution}>
                    <Square className="w-4 h-4 mr-2" />
                    Stop
                  </Button>
                )}
                
                <Button size="sm" variant="outline" onClick={clearConsole}>
                  Clear Console
                </Button>
                
                <div className="flex items-center gap-4 ml-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="enableFallback"
                      checked={enableFallback}
                      onChange={(e) => setEnableFallback(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="enableFallback" className="text-sm font-medium flex items-center gap-1">
                      <Zap className="w-3 h-3 text-green-600" />
                      Enable Fallback to Simulation
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Execution Stats */}
            {(executionStats.executionTime || executionStats.memoryUsage || executionStats.mode) && (
              <div className="flex items-center gap-4 text-sm text-gray-600">
                {executionStats.mode && (
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    executionStats.mode === 'wasm'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {executionStats.mode === 'wasm' ? '⚡ WASM' : '🎭 Simulation'}
                  </span>
                )}
                {executionStats.executionTime && (
                  <span>⚡ {executionStats.executionTime}ms</span>
                )}
                {executionStats.memoryUsage && (
                  <span>🧠 {executionStats.memoryUsage}MB</span>
                )}
              </div>
            )}
          </div>
          
          {/* Editor and Console Split */}
          <div className="flex-1 flex">
            {/* Code Editor Panel */}
            <div className="flex-1 bg-white">
              <CodeEditor
                value={code}
                onChange={setCode}
                language="javascript"
                theme="dark"
              />
            </div>
            
            {/* Console Panel */}
            <div className="flex-1 border-l flex flex-col">
              <div className="bg-white border-b px-4 py-2">
                <h3 className="font-medium text-sm" style={{ color: '#bb1a1e' }}>Console Output</h3>
              </div>
              <div className="flex-1">
                <Console messages={consoleMessages} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white border-t px-6 py-3 text-sm text-gray-600">
        <div className="flex items-center justify-between">
          <div>
            Built with ❤️ for the Kiren community •{' '}
            <a 
              href="https://github.com/kirencore/kiren" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              View on GitHub 
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div>
            Kiren v3.0.0 • JavaScript Runtime
          </div>
        </div>
      </footer>
    </div>
  )
}