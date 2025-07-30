import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()
    
    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Code is required and must be a string' },
        { status: 400 }
      )
    }

    // Use simulation mode only (WASM is now primary execution method)
    console.log('🎭 Using simulation mode (WASM is preferred)')
    const simulatedResult = await simulateKirenExecution(code)
    
    return NextResponse.json({
      ...simulatedResult,
      mode: 'simulation'
    })

  } catch (error) {
    console.error('API execution error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        success: false,
        mode: 'simulation'
      },
      { status: 500 }
    )
  }
}

// Simplified Kiren simulation for fallback scenarios
async function simulateKirenExecution(code: string) {
  // Simulate execution time
  const startTime = Date.now()
  
  // Basic code analysis for simulation
  const hasConsoleLog = code.includes('console.log')
  const hasTimeout = code.includes('setTimeout')
  const hasInterval = code.includes('setInterval')
  const hasFileSystem = code.includes('fs.')
  const hasFetch = code.includes('fetch(')
  
  // Simulate output
  const output: string[] = []
  
  if (hasConsoleLog) {
    // Extract console.log statements (basic parsing)
    const consoleMatches = code.match(/console\.log\(([^)]+)\)/g)
    if (consoleMatches) {
      consoleMatches.forEach((match) => {
        // Very basic argument extraction
        const args = match.replace('console.log(', '').replace(')', '')
        output.push(`> ${args.replace(/['"]/g, '')}`)
      })
    }
  }
  
  if (hasTimeout) {
    output.push('⏰ setTimeout scheduled')
  }
  
  if (hasInterval) {
    output.push('🔄 setInterval scheduled')  
  }
  
  if (hasFileSystem) {
    output.push('📁 Filesystem operations detected')
  }
  
  if (hasFetch) {
    output.push('🌐 HTTP fetch operations detected')
  }
  
  // Add some basic execution info
  if (output.length === 0) {
    output.push('Script executed successfully (no console output)')
  }
  
  const executionTime = Date.now() - startTime
  
  return {
    success: true,
    output: output.join('\n'),
    executionTime,
    memoryUsage: Math.floor(Math.random() * 50) + 10, // Simulated memory usage (10-60MB)
  }
}