import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Send, CheckCircle2, XCircle, Code2, Trophy, Clock, BrainCircuit, Terminal, ArrowRight, Layout, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/src/lib/utils';
import Editor from '@monaco-editor/react';
import { useTheme } from '../components/ThemeProvider';
import { useAuthStore } from '../store/useAuthStore';

// Problem Data Structure
interface TestCase {
  input: string;
  expected: string;
  hidden?: boolean;
}

interface Question {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  constraints: string[];
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  starterCode: Record<string, string>;
  testCases: TestCase[];
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    id: "q1",
    title: "Reverse String",
    difficulty: "Easy",
    description: "Write a function that reverses a string. The input string is given as an array of characters.",
    constraints: [
      "1 <= s.length <= 10^5",
      "s[i] is a printable ascii character"
    ],
    examples: [
      { input: 's = "hello"', output: '"olleh"' },
      { input: 's = "Hannah"', output: '"hannaH"' }
    ],
    starterCode: {
      javascript: `function reverseString(s) {
  // Write your code here
  
}`,
      python: `def reverseString(s):
    # Write your code here
    pass`,
      java: `class Solution {
    public String reverseString(String s) {
        // Write your code here
        
    }
}`
    },
    testCases: [
      { input: "hello", expected: "olleh" },
      { input: "world", expected: "dlrow" },
      { input: "a", expected: "a", hidden: true },
    ],
    explanation: "You can use two pointers technique or built-in string reverse methods to solve this."
  },
  {
    id: "q2",
    title: "FizzBuzz",
    difficulty: "Easy",
    description: "Given an integer n, return a string array answer (1-indexed) where:\\n- answer[i] == \"FizzBuzz\" if i is divisible by 3 and 5.\\n- answer[i] == \"Fizz\" if i is divisible by 3.\\n- answer[i] == \"Buzz\" if i is divisible by 5.\\n- answer[i] == i (as a string) if none of the above conditions are true.",
    constraints: [
      "1 <= n <= 10^4"
    ],
    examples: [
      { input: 'n = 3', output: '["1","2","Fizz"]' },
      { input: 'n = 5', output: '["1","2","Fizz","4","Buzz"]' },
      { input: 'n = 15', output: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]' }
    ],
    starterCode: {
      javascript: `function fizzBuzz(n) {
  // Write your code here
  
}`,
      python: `def fizzBuzz(n):
    # Write your code here
    pass`,
      java: `class Solution {
    public List<String> fizzBuzz(int n) {
        // Write your code here
        
    }
}`
    },
    testCases: [
      { input: "3", expected: '["1","2","Fizz"]' },
      { input: "5", expected: '["1","2","Fizz","4","Buzz"]' },
    ],
    explanation: "Iterate from 1 to n and check for divisibility by 15, 3, and 5 in that order."
  },
  {
    id: "q3",
    title: "Valid Parentheses",
    difficulty: "Medium",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\\nAn input string is valid if:\\n1. Open brackets must be closed by the same type of brackets.\\n2. Open brackets must be closed in the correct order.\\n3. Every close bracket has a corresponding open bracket of the same type.",
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'"
    ],
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
    ],
    starterCode: {
      javascript: `function isValid(s) {
  // Write your code here
  
}`,
      python: `def isValid(s):
    # Write your code here
    pass`,
      java: `class Solution {
    public boolean isValid(String s) {
        // Write your code here
        
    }
}`
    },
    testCases: [
      { input: "()", expected: "true" },
      { input: "()[]{}", expected: "true" },
      { input: "(]", expected: "false" },
    ],
    explanation: "Use a stack to keep track of opening brackets and match them with incoming closing brackets."
  },
  {
    id: "q4",
    title: "Palindrome Checker",
    difficulty: "Medium",
    description: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.\\nGiven a string s, return true if it is a palindrome, or false otherwise.",
    constraints: [
      "1 <= s.length <= 2 * 10^5",
      "s consists only of printable ASCII characters."
    ],
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: 'true', explanation: '"amanaplanacanalpanama" is a palindrome.' },
      { input: 's = "race a car"', output: 'false', explanation: '"raceacar" is not a palindrome.' }
    ],
    starterCode: {
      javascript: `function isPalindrome(s) {\n  // Write your code here\n  \n}`,
      python: `def isPalindrome(s):\n    # Write your code here\n    pass`,
      java: `class Solution {\n    public boolean isPalindrome(String s) {\n        // Write your code here\n        \n    }\n}`
    },
    testCases: [
      { input: '"A man, a plan, a canal: Panama"', expected: "true" },
      { input: '"race a car"', expected: "false" },
      { input: '" "', expected: "true" }
    ],
    explanation: "Try using two pointers, one starting from the beginning and one from the end, skipping non-alphanumeric characters."
  },
  {
    id: "q5",
    title: "Two Sum",
    difficulty: "Medium",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9"
    ],
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' }
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {\n  // Write your code here\n  \n}`,
      python: `def twoSum(nums, target):\n    # Write your code here\n    pass`,
      java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your code here\n        \n    }\n}`
    },
    testCases: [
      { input: "[2,7,11,15]\\n9", expected: "[0,1]" },
      { input: "[3,2,4]\\n6", expected: "[1,2]" }
    ],
    explanation: "Use a hash map to store the difference between the target and the current element as you iterate through the array."
  },
  {
    id: "q6",
    title: "Fibonacci Recursive",
    difficulty: "Hard",
    description: "The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1.\\nGiven n, calculate F(n).",
    constraints: [
      "0 <= n <= 30"
    ],
    examples: [
      { input: 'n = 2', output: '1', explanation: "F(2) = F(1) + F(0) = 1 + 0 = 1." },
      { input: 'n = 3', output: '2', explanation: "F(3) = F(2) + F(1) = 1 + 1 = 2." },
      { input: 'n = 4', output: '3', explanation: "F(4) = F(3) + F(2) = 2 + 1 = 3." }
    ],
    starterCode: {
      javascript: `function fib(n) {\n  // Write your code here\n  \n}`,
      python: `def fib(n):\n    # Write your code here\n    pass`,
      java: `class Solution {\n    public int fib(int n) {\n        // Write your code here\n        \n    }\n}`
    },
    testCases: [
      { input: "2", expected: "1" },
      { input: "3", expected: "2" },
      { input: "4", expected: "3" },
      { input: "30", expected: "832040" }
    ],
    explanation: "Implement the base cases F(0)=0 and F(1)=1, then recursively call fib(n-1) + fib(n-2). Consider memoization for optimization."
  },
  {
    id: "q7",
    title: "Binary Search",
    difficulty: "Medium",
    description: "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.\\nYou must write an algorithm with O(log n) runtime complexity.",
    constraints: [
      "1 <= nums.length <= 10^4",
      "-10^4 < nums[i], target < 10^4",
      "All the integers in nums are unique.",
      "nums is sorted in ascending order."
    ],
    examples: [
      { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4', explanation: "9 exists in nums and its index is 4" },
      { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1', explanation: "2 does not exist in nums so return -1" }
    ],
    starterCode: {
      javascript: `function search(nums, target) {\n  // Write your code here\n  \n}`,
      python: `def search(nums, target):\n    # Write your code here\n    pass`,
      java: `class Solution {\n    public int search(int[] nums, int target) {\n        // Write your code here\n        \n    }\n}`
    },
    testCases: [
      { input: "[-1,0,3,5,9,12]\\n9", expected: "4" },
      { input: "[-1,0,3,5,9,12]\\n2", expected: "-1" }
    ],
    explanation: "Maintain a low and high pointer. Find the middle element and adjust pointers based on comparison with the target."
  },
  {
    id: "q8",
    title: "Merge Sorted Array",
    difficulty: "Hard",
    description: "You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of elements in nums1 and nums2 respectively.\\nMerge nums1 and nums2 into a single array sorted in non-decreasing order.\\nThe final sorted array should not be returned by the function, but instead be stored inside the array nums1. To accommodate this, nums1 has a length of m + n, where the first m elements denote the elements that should be merged, and the last n elements are set to 0 and should be ignored. nums2 has a length of n.",
    constraints: [
      "nums1.length == m + n",
      "nums2.length == n",
      "0 <= m, n <= 200",
      "1 <= m + n <= 200",
      "-10^9 <= nums1[i], nums2[j] <= 10^9"
    ],
    examples: [
      { input: 'nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3', output: '[1,2,2,3,5,6]' },
      { input: 'nums1 = [1], m = 1, nums2 = [], n = 0', output: '[1]' },
      { input: 'nums1 = [0], m = 0, nums2 = [1], n = 1', output: '[1]' }
    ],
    starterCode: {
      javascript: `function merge(nums1, m, nums2, n) {\n  // Write your code here\n  \n}`,
      python: `def merge(nums1, m, nums2, n):\n    # Write your code here\n    pass`,
      java: `class Solution {\n    public void merge(int[] nums1, int m, int[] nums2, int n) {\n        // Write your code here\n        \n    }\n}`
    },
    testCases: [
      { input: "[1,2,3,0,0,0]\\n3\\n[2,5,6]\\n3", expected: "[1,2,2,3,5,6]" },
      { input: "[1]\\n1\\n[]\\n0", expected: "[1]" }
    ],
    explanation: "Start from the end of both arrays and place the larger element at the end of nums1."
  }
];

export default function CodingChallenge() {
  const [activeQuestionId, setActiveQuestionId] = useState(QUESTIONS[0].id);
  const [language, setLanguage] = useState<'javascript' | 'python' | 'java'>('javascript');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null); // 'idle', 'success', 'error'
  const [showQuestionsList, setShowQuestionsList] = useState(false);
  const { theme } = useTheme();
  const { addXp, isAuthenticated } = useAuthStore();

  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    if (theme === 'system') {
      setResolvedTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    } else {
      setResolvedTheme(theme);
    }
  }, [theme]);

  const activeQuestion = QUESTIONS.find((q) => q.id === activeQuestionId) || QUESTIONS[0];

  useEffect(() => {
    setCode(activeQuestion.starterCode[language]);
  }, [activeQuestion, language]);

  const handleRun = () => {
    setIsRunning(true);
    setSubmissionResult(null);
    setOutput('Running code snippet...');
    
    // Simulate execution time
    setTimeout(() => {
      setIsRunning(false);
      setOutput("Execution finished.\\nOutput: Simulated result for input. \\nStatus: Completed.");
    }, 1500);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setSubmissionResult(null);
    setOutput('Running all test cases (including hidden)...');
    
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      const isSuccess = Math.random() > 0.3; // 70% chance of success for demo
      
      if (isSuccess) {
        const xpEarned = activeQuestion.difficulty === 'Easy' ? 20 : activeQuestion.difficulty === 'Medium' ? 40 : 60;
        setSubmissionResult({
          status: 'success',
          passed: activeQuestion.testCases.length,
          total: activeQuestion.testCases.length,
          time: Math.floor(Math.random() * 50) + 12 + 'ms',
          memory: (Math.random() * 5 + 32).toFixed(1) + 'MB',
          xpEarned: xpEarned
        });
        if (isAuthenticated) {
          addXp(xpEarned);
        }
        setOutput('All test cases passed! Great job.');
      } else {
        setSubmissionResult({
          status: 'error',
          passed: Math.floor(Math.random() * activeQuestion.testCases.length),
          total: activeQuestion.testCases.length,
          failedCase: activeQuestion.testCases[0]
        });
        setOutput('Failed test cases. Output did not match expected result.');
      }
    }, 2000);
  };

  const getDifficultyColor = (diff: string) => {
    switch(diff) {
      case 'Easy': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Hard': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent text-slate-800 dark:text-slate-300 font-sans overflow-hidden transition-colors duration-300">
      {/* Top Navbar for Coding */}
      <nav className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 shrink-0 transition-colors duration-300">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowQuestionsList(!showQuestionsList)}
            className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors duration-300 border border-slate-200 dark:border-slate-700"
          >
            <Layout className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm">Problem List</span>
          </button>

          <button 
            onClick={() => setOutput('AI Hint: ' + activeQuestion.explanation)}
            className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors duration-300 border border-slate-200 dark:border-slate-700 ml-2"
          >
            <BrainCircuit className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="font-semibold text-purple-700 dark:text-purple-200 text-sm">AI Hint</span>
          </button>
          
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 ml-2 transition-colors duration-300" />
          
          <h1 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span className={cn("px-2 py-0.5 rounded text-xs border border-transparent", getDifficultyColor(activeQuestion.difficulty))}>
              {activeQuestion.difficulty}
            </span>
            {activeQuestion.title}
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-medium bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 transition-colors duration-300">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-yellow-500">2,450 XP</span>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Panel: Problem Description */}
        <div className="w-full lg:w-1/3 lg:min-w-[320px] lg:max-w-[600px] flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 overflow-y-auto hidden-scrollbar transition-colors duration-300">
          <div className="p-4 lg:p-6 space-y-6">
            
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 transition-colors duration-300">{activeQuestion.title}</h2>
              <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <span className={cn("font-semibold", getDifficultyColor(activeQuestion.difficulty).split(' ')[0])}>
                  {activeQuestion.difficulty}
                </span>
                <span className="flex items-center gap-1"><BrainCircuit className="w-4 h-4"/> Algorithms</span>
              </div>
            </div>

            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed transition-colors duration-300">
                {activeQuestion.description.split('\\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider transition-colors duration-300">Examples</h3>
              {activeQuestion.examples.map((ex, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-4 border border-slate-200 dark:border-slate-700/50 font-mono text-sm shadow-sm transition-colors duration-300">
                  <div className="mb-2"><span className="text-slate-400 dark:text-slate-500 mr-2">Input:</span><span className="text-green-600 dark:text-green-400">{ex.input}</span></div>
                  <div><span className="text-slate-400 dark:text-slate-500 mr-2">Output:</span><span className="text-cyan-600 dark:text-cyan-400">{ex.output}</span></div>
                  {ex.explanation && (
                    <div className="mt-2 text-slate-500 dark:text-slate-400 text-xs font-sans"><span className="font-bold text-slate-700 dark:text-slate-300">Explanation:</span> {ex.explanation}</div>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider transition-colors duration-300">Constraints</h3>
              <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1 font-mono bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/30 transition-colors duration-300">
                {activeQuestion.constraints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
            
          </div>
        </div>

        {/* Right Panel: Code Editor & Console */}
        <div className="flex-1 flex flex-col min-w-0 min-h-[500px] lg:min-h-0 bg-white dark:bg-[#1e1e1e] transition-colors duration-300">
          
          {/* Editor Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-slate-50 dark:bg-[#1e1e1e] border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-md px-2 py-1 outline-none border border-slate-300 dark:border-slate-700 focus:border-cyan-500 transition-colors duration-300"
               >
                <option value="javascript">JavaScript</option>
                <option value="python">Python 3</option>
                <option value="java">Java</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCode(activeQuestion.starterCode[language])}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors duration-300"
              >
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
            </div>
          </div>

          {/* Monaco Editor Component */}
          <div className="flex-1 relative">
            <Editor
              height="100%"
              language={language}
              theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                lineHeight: 24,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
                formatOnPaste: true,
              }}
            />
          </div>

          {/* Console / Terminal Area */}
          <div className="h-1/3 min-h-[250px] border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col transition-colors duration-300">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-900/80 transition-colors duration-300">
              <div className="flex gap-4">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                  <Terminal className="w-4 h-4" /> Console
                </span>
                {submissionResult && submissionResult.status === 'success' && (
                  <span className="text-sm font-bold text-green-500 dark:text-green-400 flex items-center gap-1 animate-pulse">
                    <CheckCircle2 className="w-4 h-4" /> Accepted
                  </span>
                )}
                {submissionResult && submissionResult.status === 'error' && (
                  <span className="text-sm font-bold text-red-500 dark:text-red-400 flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> Wrong Answer
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleRun}
                  disabled={isRunning || isSubmitting}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition-all duration-300 disabled:opacity-50"
                >
                  {isRunning ? <Sparkles className="w-4 h-4 animate-spin text-cyan-500 dark:text-cyan-400" /> : <Play className="w-4 h-4 text-green-500 dark:text-green-400" />} 
                  Run
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={isRunning || isSubmitting}
                  className="flex items-center gap-2 px-6 py-1.5 rounded-lg text-sm font-bold text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-all duration-300 disabled:opacity-50 shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_20px_rgba(34,211,238,0.5)]"
                >
                  {isSubmitting ? <Sparkles className="w-4 h-4 animate-spin text-slate-800" /> : <Send className="w-4 h-4" />} 
                  Submit
                </button>
              </div>
            </div>

            <div className="flex-1 p-4 font-mono text-sm overflow-y-auto">
              {submissionResult ? (
                <div className="space-y-4">
                  {submissionResult.status === 'success' ? (
                    <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl p-4 transition-colors duration-300">
                      <h3 className="text-green-600 dark:text-green-400 font-bold mb-2 text-lg">Success!</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-slate-600 dark:text-slate-300 mt-4">
                        <div>
                          <p className="text-slate-400 dark:text-slate-500 text-xs uppercase mb-1">Time</p>
                          <p className="font-bold text-slate-800 dark:text-slate-200">{submissionResult.time}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 dark:text-slate-500 text-xs uppercase mb-1">Memory</p>
                          <p className="font-bold text-slate-800 dark:text-slate-200">{submissionResult.memory}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 dark:text-slate-500 text-xs uppercase mb-1">Test Cases</p>
                          <p className="font-bold text-slate-800 dark:text-slate-200">{submissionResult.passed}/{submissionResult.total}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 dark:text-slate-500 text-xs uppercase mb-1">XP Earned</p>
                          <p className="font-bold text-yellow-600 dark:text-yellow-400">+{submissionResult.xpEarned} XP</p>
                        </div>
                      </div>
                      
                      <button className="mt-6 flex items-center gap-2 text-sm font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors duration-300">
                        Next Challenge <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4 transition-colors duration-300">
                      <h3 className="text-red-600 dark:text-red-400 font-bold mb-2">Failed on test case {submissionResult.passed + 1}</h3>
                      <div className="mt-4 space-y-3">
                        <div>
                          <p className="text-slate-500 text-xs mb-1">Input:</p>
                          <div className="bg-white dark:bg-slate-900 rounded p-2 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition-colors duration-300">{submissionResult.failedCase.input}</div>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs mb-1">Expected Output:</p>
                          <div className="bg-white dark:bg-slate-900 rounded p-2 text-green-600 dark:text-green-400 border border-slate-200 dark:border-slate-800 transition-colors duration-300">{submissionResult.failedCase.expected}</div>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs mb-1">Your Output:</p>
                          <div className="bg-white dark:bg-slate-900 rounded p-2 text-red-600 dark:text-red-400 border border-slate-200 dark:border-slate-800 transition-colors duration-300">null</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-slate-500 dark:text-slate-400 whitespace-pre-wrap">
                  {output || "Run or Submit your code to see results here."}
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Problems Overlay Menu */}
      <AnimatePresence>
        {showQuestionsList && (
          <motion.div 
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="absolute top-14 left-0 bottom-0 w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 shadow-2xl z-50 overflow-y-auto transition-colors duration-300"
          >
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center transition-colors duration-300">
              <h3 className="font-bold text-slate-800 dark:text-slate-200">Questions</h3>
              <button onClick={() => setShowQuestionsList(false)} className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-white transition-colors duration-300"><XCircle className="w-5 h-5"/></button>
            </div>
            <div className="p-2">
              {QUESTIONS.map(q => (
                <button
                  key={q.id}
                  onClick={() => {
                    setActiveQuestionId(q.id);
                    setShowQuestionsList(false);
                    setOutput('');
                    setSubmissionResult(null);
                  }}
                  className={cn(
                    "w-full text-left p-3 rounded-xl mb-2 transition-colors duration-300 flex items-center justify-between",
                    activeQuestionId === q.id ? "bg-cyan-50 dark:bg-cyan-900/30 border border-cyan-200 dark:border-cyan-800/50" : "hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent"
                  )}
                >
                  <div className="truncate pr-2">
                    <p className={cn("text-sm font-semibold truncate transition-colors duration-300", activeQuestionId === q.id ? "text-cyan-700 dark:text-cyan-400" : "text-slate-700 dark:text-slate-300")}>{q.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{q.difficulty}</p>
                  </div>
                  {activeQuestionId === q.id && <ArrowRight className="w-4 h-4 text-cyan-600 dark:text-cyan-500 flex-shrink-0" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
