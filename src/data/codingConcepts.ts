// ====================================================================
// Geniusphere — Canonical Multi-Language Coding Concepts & Comparative Matrix
// Enables learners to explore core computational concepts and compare
// how Python, JavaScript, TypeScript, C++, Java, C, and SQL implement them.
// ====================================================================

import { SupportedLanguage } from '../utils/codeSandboxRunner';

export interface LanguageConceptDetail {
  language: SupportedLanguage;
  displayName: string;
  badge: string;
  syntaxStyle: string;
  code: string;
  explanation: string;
  commonGotcha: string;
  proTip: string;
}

export interface ConceptComparisonRow {
  dimension: string;
  python: string;
  javascript: string;
  typescript: string;
  cpp: string;
  java: string;
  c: string;
}

export interface CodingConcept {
  id: string;
  title: string;
  category: 'Fundamentals' | 'Control Flow' | 'Data Structures' | 'Architecture' | 'Systems';
  summary: string;
  computationalModel: string;
  languages: Record<SupportedLanguage, LanguageConceptDetail>;
  comparisonMatrix: ConceptComparisonRow[];
}

export const CODING_CONCEPTS: CodingConcept[] = [
  // 1. VARIABLES, DATA TYPES & MEMORY BINDING
  {
    id: 'variables_types',
    title: 'Variables, Types & Memory Binding',
    category: 'Fundamentals',
    summary: 'How programming languages allocate memory, bind names to memory addresses, and enforce type constraints.',
    computationalModel: 'Variables are symbolic names bound to memory locations. Statically-typed languages (C++, Java, TypeScript) check memory bounds and layout at compile-time; dynamically-typed languages (Python, JavaScript) store type tags inside object headers on the heap.',
    comparisonMatrix: [
      {
        dimension: 'Typing System',
        python: 'Dynamic, Strong',
        javascript: 'Dynamic, Weak (Coercion)',
        typescript: 'Static Structural (Compile-time)',
        cpp: 'Static, Strong, Direct Memory',
        java: 'Static, Strong, JVM Reference',
        c: 'Static, Low-Level Procedural',
      },
      {
        dimension: 'Declaration Keyword',
        python: 'name = val',
        javascript: 'let, const, var',
        typescript: 'let name: type = val',
        cpp: 'type name = val; / auto',
        java: 'Type name = val;',
        c: 'type name = val;',
      },
      {
        dimension: 'Immutability Guarantee',
        python: 'Naming convention / Tuples',
        javascript: 'const (rebind lock only)',
        typescript: 'readonly / const assertions',
        cpp: 'const / constexpr (hardware)',
        java: 'final keyword',
        c: 'const qualifier',
      },
    ],
    languages: {
      python: {
        language: 'python',
        displayName: 'Python 3.12',
        badge: '🐍 Python',
        syntaxStyle: 'Dynamic typing with reference binding',
        code: `# Python: Variables are names bound to heap objects
student_name = "Aarav Sharma"
student_id = 1042
gpa = 3.88
is_enrolled = True

# Python 3.10+ Type Hints (Optional for linters/mypy)
course_credits: int = 4

print(f"Learner: {student_name} (ID: {student_id})")
print(f"GPA: {gpa} | Status: {'Active' if is_enrolled else 'Inactive'}")
print(f"Memory type: {type(student_name).__name__}")
`,
        explanation: 'In Python, variables do not store values directly; they store pointer references to objects allocated on the heap. Reassigning a variable rebinds the name to a new object.',
        commonGotcha: 'Thinking `a = b` creates a copy. For mutable collections like lists, `a = b` creates an alias to the same memory object.',
        proTip: 'Use Python 3.10+ type hints (`name: str = "Aarav"`) to catch type bugs early in development tools.',
      },
      javascript: {
        language: 'javascript',
        displayName: 'JavaScript (ES6+)',
        badge: '🟨 JavaScript',
        syntaxStyle: 'Dynamic typing with lexical scoping (let / const)',
        code: `// JavaScript: Block-scoped declarations
const studentName = "Aarav Sharma";
let studentId = 1042;
let gpa = 3.88;
const isEnrolled = true;

// Reassignment is allowed for 'let', blocked for 'const'
studentId = 1043;

console.log(\`Learner: \${studentName} (ID: \${studentId})\`);
console.log(\`GPA: \${gpa} | Status: \${isEnrolled ? "Active" : "Inactive"}\`);
console.log(\`Type of studentName: \${typeof studentName}\`);
`,
        explanation: 'JavaScript uses `const` for variables that should not be rebound, and `let` for mutable bindings. Types are dynamic and evaluated at runtime.',
        commonGotcha: '`const` prevents variable rebinding, but object properties inside a `const` object remain mutable (`const user = {}; user.name = "Aarav"` is legal).',
        proTip: 'Default to `const` everywhere. Only use `let` when you explicitly intend to reassign the variable.',
      },
      typescript: {
        language: 'typescript',
        displayName: 'TypeScript 5.x',
        badge: '🔷 TypeScript',
        syntaxStyle: 'Static structural type annotations compiled to JavaScript',
        code: `// TypeScript: Explicit interfaces and compile-time type safety
interface StudentProfile {
  readonly id: number;
  name: string;
  gpa: number;
  isEnrolled: boolean;
}

const student: StudentProfile = {
  id: 1042,
  name: "Aarav Sharma",
  gpa: 3.88,
  isEnrolled: true,
};

console.log(\`Learner: \${student.name} (ID: \${student.id})\`);
console.log(\`GPA: \${student.gpa} | Enrolled: \${student.isEnrolled}\`);
console.log("TypeScript compile-time assertions: PASS");
`,
        explanation: 'TypeScript adds static type definitions on top of JavaScript. The compiler ensures types match at build-time, completely stripping types in production.',
        commonGotcha: 'Using `any` as a type escape hatch. It disables type-checking and defeats the purpose of TypeScript.',
        proTip: 'Use `readonly` modifiers on interfaces for properties that should never be mutated.',
      },
      cpp: {
        language: 'cpp',
        displayName: 'C++ (C++20)',
        badge: '⚡ C++',
        syntaxStyle: 'Static compile-time types with direct stack memory allocation',
        code: `#include <iostream>
#include <string>

int main() {
    // Explicit static memory allocation on the call stack
    const std::string studentName = "Aarav Sharma";
    int studentId = 1042;
    double gpa = 3.88;
    bool isEnrolled = true;

    std::cout << "Learner: " << studentName << " (ID: " << studentId << ")\\n";
    std::cout << "GPA: " << gpa << " | Enrolled: " << (isEnrolled ? "True" : "False") << "\\n";
    std::cout << "Memory size of double: " << sizeof(gpa) << " bytes\\n";
    return 0;
}
`,
        explanation: 'C++ allocates variables directly in stack memory with exact byte boundaries. Types are checked at compile-time with zero runtime overhead.',
        commonGotcha: 'Uninitialized local variables (`int x;`) contain garbage data from previous memory stack frames.',
        proTip: 'Use `auto` when the type is redundant, e.g., `auto name = std::make_shared<Student>();`.',
      },
      java: {
        language: 'java',
        displayName: 'Java 21',
        badge: '☕ Java',
        syntaxStyle: 'Strongly-typed object references and primitives on JVM',
        code: `public class Main {
    public static void main(String[] args) {
        // Primitives store raw binary; Objects store JVM heap pointers
        final String studentName = "Aarav Sharma";
        int studentId = 1042;
        double gpa = 3.88;
        boolean isEnrolled = true;

        System.out.println("Learner: " + studentName + " (ID: " + studentId + ")");
        System.out.println("GPA: " + gpa + " | Enrolled: " + (isEnrolled ? "Active" : "Inactive"));
        System.out.println("JVM Class: " + studentName.getClass().getSimpleName());
    }
}
`,
        explanation: 'Java separates primitive types (int, double, boolean) stored on stack from Object reference types (String, List) allocated on JVM heap.',
        commonGotcha: 'Comparing Strings with `==` checks reference equality, not content equality. Always use `str.equals(other)`.',
        proTip: 'Use `var` in modern Java for local variables with obvious initializers: `var list = new ArrayList<String>();`.',
      },
      c: {
        language: 'c',
        displayName: 'C (C11)',
        badge: '⚙️ C',
        syntaxStyle: 'Low-level procedural types with manual byte layouts',
        code: `#include <stdio.h>
#include <stdbool.h>

int main() {
    char studentName[] = "Aarav Sharma";
    int studentId = 1042;
    float gpa = 3.88f;
    bool isEnrolled = true;

    printf("Learner: %s (ID: %d)\\n", studentName, studentId);
    printf("GPA: %.2f | Enrolled: %s\\n", gpa, isEnrolled ? "Yes" : "No");
    printf("Int memory size: %zu bytes\\n", sizeof(studentId));
    return 0;
}
`,
        explanation: 'In C, strings are null-terminated (`\\0`) byte arrays. Memory is laid out linearly with minimal abstraction.',
        commonGotcha: 'Buffer overflows: writing beyond array bounds overwrites adjacent stack variables.',
        proTip: 'Always pass array sizes alongside buffers to prevent memory boundary corruption.',
      },
      sql: {
        language: 'sql',
        displayName: 'SQL (ANSI/Relational)',
        badge: '🗄️ SQL',
        syntaxStyle: 'Declarative schema column types & relational attributes',
        code: `-- SQL: Strong column data types enforced by database engine
CREATE TABLE students (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    gpa NUMERIC(3, 2) CHECK (gpa >= 0.0 AND gpa <= 4.0),
    is_enrolled BOOLEAN DEFAULT TRUE
);

INSERT INTO students (id, name, gpa, is_enrolled)
VALUES (1042, 'Aarav Sharma', 3.88, TRUE);

SELECT id, name, gpa, is_enrolled FROM students;
`,
        explanation: 'Relational SQL enforces schema-level constraints on column types at insertion time, ensuring consistent data storage across transactions.',
        commonGotcha: 'Implicit type casting across numeric and string fields causing table scans.',
        proTip: 'Use `CHECK` constraints to enforce valid value domains at the database engine level.',
      },
    },
  },

  // 2. CONDITIONAL BRANCHING
  {
    id: 'conditionals',
    title: 'Conditional Branching & Logic Gates',
    category: 'Control Flow',
    summary: 'Evaluating boolean expressions to make execution decisions at runtime.',
    computationalModel: 'The CPU evaluates a test condition, sets hardware status flags (Zero Flag, Sign Flag), and performs a conditional jump instruction (e.g. JZ, JNZ). Modern compilers optimize branches using jump tables and branch prediction.',
    comparisonMatrix: [
      {
        dimension: 'Branch Syntax',
        python: 'if / elif / else',
        javascript: 'if / else if / else',
        typescript: 'if / else if / else',
        cpp: 'if / else if / else',
        java: 'if / else if / else',
        c: 'if / else if / else',
      },
      {
        dimension: 'Switch / Pattern Match',
        python: 'match / case (3.10+)',
        javascript: 'switch / case',
        typescript: 'switch / case (discriminated unions)',
        cpp: 'switch / case + if constexpr',
        java: 'switch pattern matching',
        c: 'switch (integral only)',
      },
      {
        dimension: 'Truthy / Falsy Coercion',
        python: '0, "", [], None are False',
        javascript: '0, "", null, undefined, NaN are falsy',
        typescript: 'Same as JS',
        cpp: '0 / nullptr is false',
        java: 'Strict boolean only (no 0/1 cast)',
        c: '0 is false, non-zero is true',
      },
    ],
    languages: {
      python: {
        language: 'python',
        displayName: 'Python 3.12',
        badge: '🐍 Python',
        syntaxStyle: 'Indentation-based blocks with elif and truthiness',
        code: `score = 88

if score >= 90:
    grade = "A (Exemplary)"
elif score >= 80:
    grade = "B (Proficient)"
elif score >= 70:
    grade = "C (Developing)"
else:
    grade = "Needs Practice"

print(f"Evaluation for score {score}: {grade}")

# Pythonic Ternary Expression
status = "Certified" if score >= 75 else "Review Needed"
print(f"Certification: {status}")
`,
        explanation: 'Python evaluates conditions using indentation rather than braces. Truthiness is intuitive: empty containers (`[]`, `{}`) and `0` evaluate to `False`.',
        commonGotcha: 'Using `is` instead of `==` for value comparison. `is` checks memory identity, whereas `==` checks value equality.',
        proTip: 'Use Python 3.10 `match / case` for structural pattern matching across dictionaries or classes.',
      },
      javascript: {
        language: 'javascript',
        displayName: 'JavaScript (ES6+)',
        badge: '🟨 JavaScript',
        syntaxStyle: 'Curly brace blocks with strict equality (===)',
        code: `const score = 88;
let grade;

if (score >= 90) {
  grade = "A (Exemplary)";
} else if (score >= 80) {
  grade = "B (Proficient)";
} else if (score >= 70) {
  grade = "C (Developing)";
} else {
  grade = "Needs Practice";
}

console.log(\`Evaluation for score \${score}: \${grade}\`);

// Ternary Operator
const status = score >= 75 ? "Certified" : "Review Needed";
console.log(\`Certification: \${status}\`);
`,
        explanation: 'JavaScript uses curly braces `{}` to group conditional bodies. Always use `===` to prevent implicit type coercion.',
        commonGotcha: 'Using `==` loose equality which can coerce `"0" == false` to `true`. Always use strict `===`.',
        proTip: 'Leverage nullish coalescing `??` for fallback values without triggering falsy bugs on `0` or `""`.',
      },
      typescript: {
        language: 'typescript',
        displayName: 'TypeScript 5.x',
        badge: '🔷 TypeScript',
        syntaxStyle: 'Type-narrowing and exhaustive condition checking',
        code: `type MasteryLevel = 'beginner' | 'intermediate' | 'advanced';

function getNextAction(level: MasteryLevel): string {
  if (level === 'beginner') {
    return 'Complete Interactive Syntax Labs';
  } else if (level === 'intermediate') {
    return 'Build Full-Stack Defenses';
  } else {
    return 'Conduct Security Audits';
  }
}

const currentLevel: MasteryLevel = 'intermediate';
console.log(\`Recommended Action: \${getNextAction(currentLevel)}\`);
`,
        explanation: 'In TypeScript, conditionals perform **type narrowing**. Inside an `if` block, the compiler refines the type of the variable.',
        commonGotcha: 'Failing to provide an exhaustive check when handling union types in branching statements.',
        proTip: 'Use a `never` type check in the `else` block to guarantee compile-time exhaustiveness.',
      },
      cpp: {
        language: 'cpp',
        displayName: 'C++ (C++20)',
        badge: '⚡ C++',
        syntaxStyle: 'Zero-overhead boolean evaluation with optional init statements',
        code: `#include <iostream>
#include <string>

int main() {
    int score = 88;
    std::string grade;

    // C++17 if with initializer: scope variable directly to condition
    if (int bonus = 5; score + bonus >= 90) {
        grade = "A (With Bonus)";
    } else if (score >= 80) {
        grade = "B (Proficient)";
    } else {
        grade = "Needs Practice";
    }

    std::cout << "Evaluation: " << grade << "\\n";
    return 0;
}
`,
        explanation: 'C++ condition statements compile to direct machine instructions. Since C++17, you can declare a variable inside the `if` header.',
        commonGotcha: 'Accidentally using assignment `=` instead of equality `==` inside an `if` condition: `if (score = 100)`.',
        proTip: 'Use `[[likely]]` and `[[unlikely]]` attributes to guide CPU branch prediction for performance-critical loops.',
      },
      java: {
        language: 'java',
        displayName: 'Java 21',
        badge: '☕ Java',
        syntaxStyle: 'Strict boolean type enforcement',
        code: `public class Main {
    public static void main(String[] args) {
        int score = 88;
        String grade;

        if (score >= 90) {
            grade = "A (Exemplary)";
        } else if (score >= 80) {
            grade = "B (Proficient)";
        } else {
            grade = "Needs Practice";
        }

        System.out.println("Evaluation: " + grade);
        System.out.println("Certified: " + (score >= 75 ? "Yes" : "No"));
    }
}
`,
        explanation: 'Java requires condition expressions to evaluate strictly to `boolean`. Integers cannot be implicitly cast to booleans.',
        commonGotcha: 'Using `==` to compare Object wrappers like `Integer a = 1000; Integer b = 1000; a == b` is false.',
        proTip: 'Use modern Java switch expressions (`return switch(score) { case 100 -> "Perfect"; ... };`) for clean mapping.',
      },
      c: {
        language: 'c',
        displayName: 'C (C11)',
        badge: '⚙️ C',
        syntaxStyle: 'Integer-based truth evaluation (0 is false, non-zero is true)',
        code: `#include <stdio.h>

int main() {
    int score = 88;
    const char* grade;

    if (score >= 90) {
        grade = "A (Exemplary)";
    } else if (score >= 80) {
        grade = "B (Proficient)";
    } else {
        grade = "Needs Practice";
    }

    printf("Evaluation: %s\\n", grade);
    return 0;
}
`,
        explanation: 'In C, any integer expression evaluating to non-zero is treated as true, and zero is treated as false.',
        commonGotcha: 'Checking string equality with `if (str1 == str2)` in C compares memory addresses, not strings. Use `strcmp(str1, str2) == 0`.',
        proTip: 'Compile with `-Wall -Wextra -Werror` to catch accidental assignment in conditions.',
      },
      sql: {
        language: 'sql',
        displayName: 'SQL (ANSI)',
        badge: '🗄️ SQL',
        syntaxStyle: 'CASE WHEN declarative expression',
        code: `-- SQL: CASE expression evaluates conditionals per row
SELECT 
    name,
    score,
    CASE 
        WHEN score >= 90 THEN 'A (Exemplary)'
        WHEN score >= 80 THEN 'B (Proficient)'
        ELSE 'Needs Practice'
    END AS letter_grade
FROM student_assessments;
`,
        explanation: 'SQL uses `CASE WHEN ... THEN ... ELSE ... END` expressions to evaluate conditions across tabular datasets.',
        commonGotcha: 'Comparing against `NULL` using `= NULL`. In SQL, `NULL` represents unknown, so you must use `IS NULL`.',
        proTip: 'Use `COALESCE(val, fallback)` as a shorthand conditional to handle null values.',
      },
    },
  },

  // 3. LOOPS & ITERATION
  {
    id: 'loops_iteration',
    title: 'Loops, Iteration & Comprehensions',
    category: 'Control Flow',
    summary: 'Executing a sequence of instructions repeatedly until a terminating condition is reached.',
    computationalModel: 'Loops decrement a counter or advance a pointer/iterator, evaluate the loop predicate, and branch back to the loop head. Modern optimizing compilers unroll small loops and vectorize iterations with SIMD instructions.',
    comparisonMatrix: [
      {
        dimension: 'Collection Loop',
        python: 'for item in items:',
        javascript: 'for (const item of items)',
        typescript: 'for (const item of items)',
        cpp: 'for (const auto& item : items)',
        java: 'for (Type item : items)',
        c: 'for (int i = 0; i < n; i++)',
      },
      {
        dimension: 'Index + Item Iteration',
        python: 'for i, item in enumerate(items):',
        javascript: 'items.forEach((item, i) => ...)',
        typescript: 'items.forEach((item, i) => ...)',
        cpp: 'std::views::enumerate (C++23) or counter',
        java: 'IntStream.range or indexed loop',
        c: 'Index counter manual pointer step',
      },
      {
        dimension: 'Comprehensions / Streams',
        python: '[x*2 for x in nums if x > 0]',
        javascript: 'nums.filter(x => x > 0).map(x => x*2)',
        typescript: 'Same as JS',
        cpp: 'std::ranges::views::filter / transform',
        java: 'nums.stream().filter(...).map(...)',
        c: 'Manual loop accumulation',
      },
    ],
    languages: {
      python: {
        language: 'python',
        displayName: 'Python 3.12',
        badge: '🐍 Python',
        syntaxStyle: 'Iterators, generator expressions, and range()',
        code: `# 1. Range-based loop
print("Range Iteration:")
for i in range(1, 4):
    print(f"  Step {i}")

# 2. Collection loop with enumerate
skills = ["Defense", "AI Tools", "FinTech"]
print("\\nSkills with Indices:")
for idx, skill in enumerate(skills, 1):
    print(f"  {idx}. {skill}")

# 3. Pythonic List Comprehension
squares = [x ** 2 for x in range(1, 6)]
print(f"\\nSquares: {squares}")
`,
        explanation: 'In Python, all `for` loops iterate over iterable objects using the iterator protocol (`__iter__` and `__next__`). List comprehensions offer concise, fast declarative loops.',
        commonGotcha: 'Modifying a list while iterating over it, causing skipped elements.',
        proTip: 'Use `enumerate()` instead of maintaining a manual loop counter variable.',
      },
      javascript: {
        language: 'javascript',
        displayName: 'JavaScript (ES6+)',
        badge: '🟨 JavaScript',
        syntaxStyle: 'for..of, for..in, and higher-order array methods',
        code: `const skills = ["Defense", "AI Tools", "FinTech"];

// 1. for..of loop (iterates values)
console.log("Collection Iteration (for..of):");
for (const skill of skills) {
  console.log(\`  - \${skill}\`);
}

// 2. Functional map & filter
const numbers = [1, 2, 3, 4, 5];
const doubledOdds = numbers
  .filter(n => n % 2 !== 0)
  .map(n => n * 2);

console.log("\\nDoubled Odds:", doubledOdds);
`,
        explanation: 'JavaScript provides `for..of` for iterating array values and `for..in` for iterating object keys. Array methods like `.map()`, `.filter()`, `.reduce()` provide clean functional iteration.',
        commonGotcha: 'Using `for..in` on arrays: it iterates over string indices and enumerable prototype properties, not array values.',
        proTip: 'Prefer `for..of` for loops that need `break`/`continue` or `await`, and `.map()` for pure functional transformations.',
      },
      typescript: {
        language: 'typescript',
        displayName: 'TypeScript 5.x',
        badge: '🔷 TypeScript',
        syntaxStyle: 'Type-safe iteration with generic arrays',
        code: `interface LabModule {
  id: string;
  name: string;
  difficulty: number;
}

const modules: LabModule[] = [
  { id: 'm1', name: 'SQL Injection Defense', difficulty: 2 },
  { id: 'm2', name: 'XSS Sanitization', difficulty: 3 },
  { id: 'm3', name: 'Buffer Overflow', difficulty: 4 },
];

for (const mod of modules) {
  console.log(\`[\${mod.id}] \${mod.name} (Lvl \${mod.difficulty})\`);
}
`,
        explanation: 'TypeScript verifies that elements accessed during iteration strictly match the generic type of the array.',
        commonGotcha: 'Assuming array indices are bounded: accessing `arr[i]` in TS is typed as `T`, even if `i` is out of bounds.',
        proTip: 'Enable `noUncheckedIndexedAccess` in `tsconfig.json` to treat array lookups as `T | undefined`.',
      },
      cpp: {
        language: 'cpp',
        displayName: 'C++ (C++20)',
        badge: '⚡ C++',
        syntaxStyle: 'Range-based for loops and STL iterators',
        code: `#include <iostream>
#include <vector>
#include <string>

int main() {
    std::vector<std::string> skills = {"Defense", "AI Tools", "FinTech"};

    // Range-based for loop with const reference (avoids copies)
    for (const auto& skill : skills) {
        std::cout << "  - " << skill << "\\n";
    }

    // Traditional counting loop
    std::cout << "\\nCountdown:\\n";
    for (int i = 3; i > 0; --i) {
        std::cout << "  " << i << "...\\n";
    }
    std::cout << "Liftoff!\\n";
    return 0;
}
`,
        explanation: 'In C++, range-based `for (const auto& x : col)` avoids copying large objects by passing a read-only memory reference.',
        commonGotcha: 'Iterating by value `for (auto x : col)` copies every element, which causes severe performance bottlenecks for large objects.',
        proTip: 'Always use `const auto&` for reading elements and `auto&` if mutating them in place.',
      },
      java: {
        language: 'java',
        displayName: 'Java 21',
        badge: '☕ Java',
        syntaxStyle: 'Enhanced for-each loop and Java Streams',
        code: `import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<String> skills = List.of("Defense", "AI Tools", "FinTech");

        // Enhanced for-each loop
        System.out.println("Skills list:");
        for (String skill : skills) {
            System.out.println("  - " + skill);
        }

        // Stream API transformation
        long count = skills.stream()
            .filter(s -> s.length() > 6)
            .count();
        System.out.println("Skills with >6 chars: " + count);
    }
}
`,
        explanation: 'Java provides the enhanced `for (Type item : collection)` loop for any object implementing `Iterable`, and the Streams API for parallel/declarative pipelines.',
        commonGotcha: 'Calling `collection.remove()` inside an enhanced for-loop throws `ConcurrentModificationException`. Use `Iterator.remove()` instead.',
        proTip: 'Use `Stream.toList()` (Java 16+) instead of `Collectors.toList()` for unmodifiable result lists.',
      },
      c: {
        language: 'c',
        displayName: 'C (C11)',
        badge: '⚙️ C',
        syntaxStyle: 'Bounded index counting loop with pointer arithmetic',
        code: `#include <stdio.h>

int main() {
    const char* skills[] = {"Defense", "AI Tools", "FinTech"};
    int count = sizeof(skills) / sizeof(skills[0]);

    for (int i = 0; i < count; i++) {
        printf("  %d. %s\\n", i + 1, skills[i]);
    }
    return 0;
}
`,
        explanation: 'In C, there are no built-in collection iterators. You must compute array bounds using `sizeof` and step through via index or pointers.',
        commonGotcha: 'Off-by-one errors (`i <= count` instead of `i < count`) causing buffer over-reads.',
        proTip: 'Cache `sizeof(arr)/sizeof(arr[0])` in a macro or `const int` rather than recalculating inside loop bodies.',
      },
      sql: {
        language: 'sql',
        displayName: 'SQL (ANSI)',
        badge: '🗄️ SQL',
        syntaxStyle: 'Set-based relational processing (No imperative loops needed)',
        code: `-- SQL processes entire sets of rows in parallel, eliminating loops
SELECT 
    id, 
    title,
    ROW_NUMBER() OVER (ORDER BY xp DESC) AS rank
FROM students
WHERE is_enrolled = TRUE;
`,
        explanation: 'Unlike procedural languages that loop over records one by one, SQL uses set-based operations optimized by query planners.',
        commonGotcha: 'Using cursors or loops in stored procedures when a single set-based `UPDATE` or `SELECT` query is 100x faster.',
        proTip: 'Use window functions (`ROW_NUMBER()`, `RANK()`, `LEAD()`) instead of self-joins or loops.',
      },
    },
  },

  // 4. FUNCTIONS & SCOPE
  {
    id: 'functions_methods',
    title: 'Functions, Return Values & Scope',
    category: 'Architecture',
    summary: 'Packaging reusable logic into callable subroutines with isolated execution scopes.',
    computationalModel: 'When a function is called, the CPU pushes return addresses and arguments onto the call stack. The called function establishes a stack frame, executes, and pops its frame before returning.',
    comparisonMatrix: [
      {
        dimension: 'Definition Keyword',
        python: 'def name(args):',
        javascript: 'function name(args) / () => {}',
        typescript: 'function name(args: T): R',
        cpp: 'ReturnType name(args)',
        java: 'public ReturnType name(args)',
        c: 'ReturnType name(args)',
      },
      {
        dimension: 'First-Class Functions',
        python: 'Yes (passable as objects)',
        javascript: 'Yes (closures, lambdas)',
        typescript: 'Yes (strongly typed)',
        cpp: 'Yes (std::function, lambdas)',
        java: 'Yes (Functional interfaces, lambdas)',
        c: 'Function pointers only',
      },
      {
        dimension: 'Default Parameters',
        python: 'def f(x=10):',
        javascript: 'function f(x = 10)',
        typescript: 'function f(x: number = 10)',
        cpp: 'void f(int x = 10);',
        java: 'Method overloading only',
        c: 'Not supported (overloading unavailable)',
      },
    ],
    languages: {
      python: {
        language: 'python',
        displayName: 'Python 3.12',
        badge: '🐍 Python',
        syntaxStyle: 'def keyword with keyword arguments and multiple return values',
        code: `def calculate_mastery(score: float, streak: int) -> dict:
    """Computes XP and mastery grade from verified telemetry."""
    xp = int(score * 10 + streak * 50)
    is_elite = xp >= 1500
    return {"xp": xp, "is_elite": is_elite}

result = calculate_mastery(92.5, 7)
print(f"Calculated XP: {result['xp']} | Elite: {result['is_elite']}")
`,
        explanation: 'Python functions are first-class objects. They support default parameters, variable argument lists (`*args`, `**kwargs`), and multiple return values unpacked as tuples.',
        commonGotcha: 'Using a mutable object (like `def func(items=[])`) as a default argument. The list is created once at definition time and shared across all calls.',
        proTip: 'Use `def func(items=None): if items is None: items = []` for default mutable arguments.',
      },
      javascript: {
        language: 'javascript',
        displayName: 'JavaScript (ES6+)',
        badge: '🟨 JavaScript',
        syntaxStyle: 'Arrow functions, closures, and default parameters',
        code: `// Arrow function with implicit return and object destructuring
const calculateMastery = (score, streak) => {
  const xp = Math.round(score * 10 + streak * 50);
  return { xp, isElite: xp >= 1500 };
};

const { xp, isElite } = calculateMastery(92.5, 7);
console.log(\`Calculated XP: \${xp} | Elite: \${isElite}\`);
`,
        explanation: 'JavaScript supports traditional functions and arrow functions (`=>`). Arrow functions capture the lexical `this` of their enclosing context.',
        commonGotcha: 'Using arrow functions for object methods where you need dynamic `this` binding.',
        proTip: 'Use parameter destructuring (`({ score, streak }) => ...`) for functions taking multiple configuration options.',
      },
      typescript: {
        language: 'typescript',
        displayName: 'TypeScript 5.x',
        badge: '🔷 TypeScript',
        syntaxStyle: 'Explicit parameter types and return type contracts',
        code: `interface MasteryReport {
  xp: number;
  isElite: boolean;
}

function calculateMastery(score: number, streak: number): MasteryReport {
  const xp = Math.round(score * 10 + streak * 50);
  return { xp, isElite: xp >= 1500 };
}

const report = calculateMastery(92.5, 7);
console.log(\`XP: \${report.xp} | Elite: \${report.isElite}\`);
`,
        explanation: 'TypeScript enforces parameter counts, parameter types, and return types at compile time.',
        commonGotcha: 'Omitting return type annotations on complex functions, leading to unintentional type widening.',
        proTip: 'Always explicitly type return values on public library/service functions.',
      },
      cpp: {
        language: 'cpp',
        displayName: 'C++ (C++20)',
        badge: '⚡ C++',
        syntaxStyle: 'Inlined functions, value/reference semantics, and templates',
        code: `#include <iostream>

struct MasteryReport {
    int xp;
    bool isElite;
};

// Passed by value (primitives); returns by value via Return Value Optimization (RVO)
MasteryReport calculateMastery(double score, int streak) {
    int xp = static_cast<int>(score * 10 + streak * 50);
    return {xp, xp >= 1500};
}

int main() {
    auto report = calculateMastery(92.5, 7);
    std::cout << "XP: " << report.xp << " | Elite: " << (report.isElite ? "Yes" : "No") << "\\n";
    return 0;
}
`,
        explanation: 'C++ allows fine control over how arguments are passed: by value (copy), by reference (`&`), or by rvalue reference (`&&`) for moves.',
        commonGotcha: 'Returning a reference or pointer to a local stack variable that is destroyed when the function exits (dangling pointer).',
        proTip: 'Pass large read-only objects by `const Type&` to eliminate memory copying overhead.',
      },
      java: {
        language: 'java',
        displayName: 'Java 21',
        badge: '☕ Java',
        syntaxStyle: 'Class methods with access modifiers and type signatures',
        code: `public class Main {
    record MasteryReport(int xp, boolean isElite) {}

    public static MasteryReport calculateMastery(double score, int streak) {
        int xp = (int) (score * 10 + streak * 50);
        return new MasteryReport(xp, xp >= 1500);
    }

    public static void main(String[] args) {
        MasteryReport report = calculateMastery(92.5, 7);
        System.out.println("XP: " + report.xp() + " | Elite: " + report.isElite());
    }
}
`,
        explanation: 'All functions in Java are methods defined inside classes. Modern Java `record` types provide lightweight immutable data containers.',
        commonGotcha: 'Believing Java passes objects by reference. Java is strictly pass-by-value (the object reference itself is passed by value).',
        proTip: 'Use `record` instead of boilerplate classes when returning multiple values from a method.',
      },
      c: {
        language: 'c',
        displayName: 'C (C11)',
        badge: '⚙️ C',
        syntaxStyle: 'Global functions, struct returns, and output pointer arguments',
        code: `#include <stdio.h>
#include <stdbool.h>

typedef struct {
    int xp;
    bool isElite;
} MasteryReport;

MasteryReport calculateMastery(float score, int streak) {
    MasteryReport r;
    r.xp = (int)(score * 10 + streak * 50);
    r.isElite = r.xp >= 1500;
    return r;
}

int main() {
    MasteryReport r = calculateMastery(92.5f, 7);
    printf("XP: %d | Elite: %s\\n", r.xp, r.isElite ? "Yes" : "No");
    return 0;
}
`,
        explanation: 'C does not support method overloading, default arguments, or namespaces. Functions have global or static (file-local) scope.',
        commonGotcha: 'Not declaring function prototypes before `main()`, causing implicit declaration warnings.',
        proTip: 'Mark internal helper functions `static` to restrict their visibility to their translation unit.',
      },
      sql: {
        language: 'sql',
        displayName: 'SQL (ANSI)',
        badge: '🗄️ SQL',
        syntaxStyle: 'Scalar and Table-Valued User Defined Functions (UDF)',
        code: `-- SQL: Scalar function definition
CREATE OR REPLACE FUNCTION calculate_xp(p_score NUMERIC, p_streak INT)
RETURNS INT AS $$
BEGIN
    RETURN CAST(p_score * 10 + p_streak * 50 AS INT);
END;
$$ LANGUAGE plpgsql;

SELECT calculate_xp(92.5, 7) AS calculated_xp;
`,
        explanation: 'SQL User Defined Functions (UDFs) encapsulate calculations that run inside the database query engine.',
        commonGotcha: 'Calling scalar UDFs on every row in large queries, which can prevent index optimization and slow down execution.',
        proTip: 'Prefer inline views and Common Table Expressions (CTEs) over scalar UDFs when processing large tables.',
      },
    },
  },

  // 5. DATA STRUCTURES: HASH MAPS & DICTIONARIES
  {
    id: 'hashmaps_dictionaries',
    title: 'Key-Value Dictionaries & Hash Maps',
    category: 'Data Structures',
    summary: 'Associative collections that map unique keys to values with O(1) average lookup time.',
    computationalModel: 'Hash maps apply a mathematical hash function to keys to generate bucket indices in an array. Collisions are handled via linked-list chaining or open addressing.',
    comparisonMatrix: [
      {
        dimension: 'Core Type',
        python: 'dict (e.g. {"a": 1})',
        javascript: 'Object / Map',
        typescript: 'Record<K, V> / Map<K, V>',
        cpp: 'std::unordered_map<K, V>',
        java: 'HashMap<K, V>',
        c: 'Manual hash table implementation',
      },
      {
        dimension: 'Key Insertion Order',
        python: 'Guaranteed preserved (3.7+)',
        javascript: 'Preserved in Map',
        typescript: 'Preserved in Map',
        cpp: 'Not preserved (unordered)',
        java: 'Not preserved (use LinkedHashMap)',
        c: 'Implementation dependent',
      },
      {
        dimension: 'Allowed Key Types',
        python: 'Any hashable immutable object',
        javascript: 'Strings/Symbols (Object) or Any (Map)',
        typescript: 'Same as JS with type constraints',
        cpp: 'Types with std::hash specialization',
        java: 'Types implementing hashCode()/equals()',
        c: 'Pointers / integers / strings',
      },
    ],
    languages: {
      python: {
        language: 'python',
        displayName: 'Python 3.12',
        badge: '🐍 Python',
        syntaxStyle: 'dict with hashable keys and dictionary comprehensions',
        code: `# Python dictionary: O(1) key-value lookup
student_scores = {
    "Cybersecurity": 94,
    "AI Literacy": 88,
    "Financial Markets": 91
}

# Add a new subject
student_scores["Data Structures"] = 96

print(f"Scores registered: {len(student_scores)}")
for subject, score in student_scores.items():
    print(f"  - {subject}: {score}%")

# Safe lookup with default
sql_score = student_scores.get("SQL Defense", 0)
print(f"SQL Defense score (safe lookup): {sql_score}")
`,
        explanation: 'Python dicts use an open-addressing hash table with high memory efficiency. Keys must be immutable (strings, numbers, tuples).',
        commonGotcha: 'Accessing a missing key with `dict[key]` raises `KeyError`. Use `dict.get(key, default)` for safe lookups.',
        proTip: 'Use `collections.defaultdict` when aggregating list or integer values automatically.',
      },
      javascript: {
        language: 'javascript',
        displayName: 'JavaScript (ES6+)',
        badge: '🟨 JavaScript',
        syntaxStyle: 'Object literals and Map instances',
        code: `// Modern JavaScript Map: keys can be any type
const scores = new Map();
scores.set("Cybersecurity", 94);
scores.set("AI Literacy", 88);
scores.set("Financial Markets", 91);

console.log(\`Total subjects: \${scores.size}\`);
for (const [subject, score] of scores) {
  console.log(\`  - \${subject}: \${score}%\`);
}

console.log("Has AI Literacy:", scores.has("AI Literacy"));
`,
        explanation: 'In JavaScript, plain Objects `{}` are often used as string maps, while `Map` supports keys of any type (including functions and DOM elements) and maintains exact insertion order.',
        commonGotcha: 'Using plain Objects as dictionaries can expose prototype properties like `toString`. Use `Map` for dynamic key collections.',
        proTip: 'Use `new Map()` when keys are added/deleted frequently for better performance.',
      },
      typescript: {
        language: 'typescript',
        displayName: 'TypeScript 5.x',
        badge: '🔷 TypeScript',
        syntaxStyle: 'Record<KeyType, ValueType> and strongly-typed Map',
        code: `type SubjectName = 'Cybersecurity' | 'AI Literacy' | 'Financial Markets';

const scores: Record<SubjectName, number> = {
  Cybersecurity: 94,
  'AI Literacy': 88,
  'Financial Markets': 91,
};

console.log(\`Cybersecurity Score: \${scores.Cybersecurity}%\`);
console.log("All subjects verified against SubjectName union");
`,
        explanation: 'TypeScript `Record<K, V>` enforces that only valid union keys are populated in the object dictionary.',
        commonGotcha: 'Indexing into a `Record<string, T>` without handling possible `undefined` values.',
        proTip: 'Use `Partial<Record<K, V>>` when you don’t need every key in the union to be populated immediately.',
      },
      cpp: {
        language: 'cpp',
        displayName: 'C++ (C++20)',
        badge: '⚡ C++',
        syntaxStyle: 'std::unordered_map (hash table) or std::map (Red-Black tree)',
        code: `#include <iostream>
#include <unordered_map>
#include <string>

int main() {
    std::unordered_map<std::string, int> scores = {
        {"Cybersecurity", 94},
        {"AI Literacy", 88},
        {"Financial Markets", 91}
    };

    scores["Data Structures"] = 96;

    for (const auto& [subject, score] : scores) {
        std::cout << "  - " << subject << ": " << score << "%\\n";
    }

    // Safe lookup without inserting default
    if (auto it = scores.find("Cybersecurity"); it != scores.end()) {
        std::cout << "Found Cybersecurity: " << it->second << "%\\n";
    }
    return 0;
}
`,
        explanation: 'C++ provides `std::unordered_map` for O(1) hash tables and `std::map` for O(log N) balanced binary search trees with sorted keys.',
        commonGotcha: 'Using `scores["missing_key"]` silently inserts the key with a default value of 0. Use `.find()` or `.at()` for reading.',
        proTip: 'Use structured binding `for (const auto& [key, val] : map)` (C++17) for clean unpacking.',
      },
      java: {
        language: 'java',
        displayName: 'Java 21',
        badge: '☕ Java',
        syntaxStyle: 'java.util.HashMap with hashCode and equals contracts',
        code: `import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        Map<String, Integer> scores = new HashMap<>();
        scores.put("Cybersecurity", 94);
        scores.put("AI Literacy", 88);
        scores.put("Financial Markets", 91);

        for (Map.Entry<String, Integer> entry : scores.entrySet()) {
            System.out.println("  - " + entry.getKey() + ": " + entry.getValue() + "%");
        }

        int score = scores.getOrDefault("SQL Defense", 0);
        System.out.println("SQL Defense: " + score);
    }
}
`,
        explanation: 'Java `HashMap` uses an array of buckets, dynamically transforming chains into Red-Black trees when bucket collisions exceed 8.',
        commonGotcha: 'Using custom class keys without overriding BOTH `equals()` and `hashCode()`.',
        proTip: 'Use `Map.of("k1", v1, "k2", v2)` for immutable small maps.',
      },
      c: {
        language: 'c',
        displayName: 'C (C11)',
        badge: '⚙️ C',
        syntaxStyle: 'Manual hash table with djb2 hash function and bucket arrays',
        code: `#include <stdio.h>
#include <string.h>

// Simple djb2 hash algorithm
unsigned long hash(const char *str) {
    unsigned long hash = 5381;
    int c;
    while ((c = *str++))
        hash = ((hash << 5) + hash) + c;
    return hash % 10;
}

int main() {
    const char* key = "Cybersecurity";
    printf("Computed bucket index for '%s': %lu\\n", key, hash(key));
    return 0;
}
`,
        explanation: 'C has no standard hash map library; engineers implement hash tables manually or use third-party libraries (e.g. uthash).',
        commonGotcha: 'Failing to deep-copy string keys: if caller frees the key string, the hash table points to deallocated memory.',
        proTip: 'Use a prime number size for the bucket table to distribute hash keys evenly.',
      },
      sql: {
        language: 'sql',
        displayName: 'SQL (ANSI)',
        badge: '🗄️ SQL',
        syntaxStyle: 'Primary keys with unique B-Tree or Hash indexes',
        code: `-- SQL: Key-value lookup backed by unique B-Tree index
CREATE TABLE student_metadata (
    key_name VARCHAR(50) PRIMARY KEY,
    value_data TEXT NOT NULL
);

INSERT INTO student_metadata (key_name, value_data)
VALUES ('active_track', 'Cybersecurity Defense');

SELECT value_data FROM student_metadata WHERE key_name = 'active_track';
`,
        explanation: 'In SQL, primary keys automatically create indexed lookup trees providing rapid O(log N) or O(1) point lookups.',
        commonGotcha: 'Using full table scans when a primary key or unique index should be leveraged.',
        proTip: 'Use `JSONB` in PostgreSQL or `JSON` columns for schema-less nested dictionary storage with indexing.',
      },
    },
  },

  // 6. OBJECT-ORIENTED PROGRAMMING & CLASSES
  {
    id: 'oop_classes',
    title: 'Classes, Objects & Encapsulation',
    category: 'Architecture',
    summary: 'Bundling data state and associated behaviors into cohesive, reusable types.',
    computationalModel: 'Objects store instance data in heap memory. Method dispatches are either static (resolved at compile time) or dynamic via virtual method tables (vtables) storing function pointers.',
    comparisonMatrix: [
      {
        dimension: 'Class Keyword',
        python: 'class Name:',
        javascript: 'class Name {}',
        typescript: 'class Name implements I {}',
        cpp: 'class Name {} / struct Name {}',
        java: 'public class Name {}',
        c: 'struct with function pointers',
      },
      {
        dimension: 'Constructor Name',
        python: '__init__(self, ...)',
        javascript: 'constructor(...)',
        typescript: 'constructor(...)',
        cpp: 'Name(...)',
        java: 'Name(...)',
        c: 'create_name(...)',
      },
      {
        dimension: 'Access Modifiers',
        python: 'Convention (_protected, __private)',
        javascript: 'public, #private',
        typescript: 'public, protected, private',
        cpp: 'public, protected, private',
        java: 'public, protected, package-private, private',
        c: 'None (structs are public)',
      },
    ],
    languages: {
      python: {
        language: 'python',
        displayName: 'Python 3.12',
        badge: '🐍 Python',
        syntaxStyle: 'class definition with explicit self parameter and magic methods',
        code: `class LearnerAccount:
    def __init__(self, name: str, initial_xp: int = 0):
        self.name = name
        self.xp = initial_xp

    def complete_lab(self, lab_xp: int) -> None:
        self.xp += lab_xp
        print(f"[{self.name}] Completed lab! +{lab_xp} XP (Total: {self.xp})")

    def __repr__(self) -> str:
        return f"LearnerAccount(name='{self.name}', xp={self.xp})"

learner = LearnerAccount("Aarav", 450)
learner.complete_lab(100)
print(learner)
`,
        explanation: 'Python classes use explicit `self` to access instance attributes. Special "dunder" methods (`__init__`, `__repr__`, `__str__`) customize operator behaviors.',
        commonGotcha: 'Forgetting `self` as the first argument in instance methods.',
        proTip: 'Use `@dataclass` (from dataclasses) to eliminate boilerplate `__init__` and `__repr__` definitions.',
      },
      javascript: {
        language: 'javascript',
        displayName: 'JavaScript (ES6+)',
        badge: '🟨 JavaScript',
        syntaxStyle: 'Syntactic sugar over prototype chains with #private fields',
        code: `class LearnerAccount {
  #xp = 0; // Truly private field enforced by engine

  constructor(name, initialXp = 0) {
    this.name = name;
    this.#xp = initialXp;
  }

  completeLab(labXp) {
    this.#xp += labXp;
    console.log(\`[\${this.name}] Completed lab! +\${labXp} XP (Total: \${this.#xp})\`);
  }

  getXp() {
    return this.#xp;
  }
}

const learner = new LearnerAccount("Aarav", 450);
learner.completeLab(100);
console.log("Current verified XP:", learner.getXp());
`,
        explanation: 'JavaScript classes are syntactic sugar over prototypal inheritance. The `#` prefix introduces true private fields that cannot be accessed from outside.',
        commonGotcha: 'Losing `this` context when passing class methods as callbacks. Use arrow functions or `.bind(this)`.',
        proTip: 'Favor composition over inheritance to create flexible, decoupled software architectures.',
      },
      typescript: {
        language: 'typescript',
        displayName: 'TypeScript 5.x',
        badge: '🔷 TypeScript',
        syntaxStyle: 'Parameter properties and interface contracts',
        code: `interface IAccount {
  name: string;
  completeLab(xp: number): void;
}

class LearnerAccount implements IAccount {
  // Parameter property: automatically assigns and types this.name and this.xp
  constructor(
    public name: string,
    private xp: number = 0
  ) {}

  public completeLab(labXp: number): void {
    this.xp += labXp;
    console.log(\`[\${this.name}] Lab done! Total: \${this.xp} XP\`);
  }

  public get currentXp(): number {
    return this.xp;
  }
}

const learner = new LearnerAccount("Aarav", 450);
learner.completeLab(100);
`,
        explanation: 'TypeScript adds constructor parameter properties (`public name: string`), access modifiers, and interface implementation checking.',
        commonGotcha: '`private` in TypeScript is a compile-time check; at runtime the JavaScript property is still visible unless `#` is used.',
        proTip: 'Use constructor parameter properties (`constructor(public readonly id: string)`) to eliminate redundant assignments.',
      },
      cpp: {
        language: 'cpp',
        displayName: 'C++ (C++20)',
        badge: '⚡ C++',
        syntaxStyle: 'Explicit public/private sections with RAII destructor management',
        code: `#include <iostream>
#include <string>

class LearnerAccount {
private:
    std::string name;
    int xp;

public:
    LearnerAccount(std::string n, int initialXp = 0)
        : name(std::move(n)), xp(initialXp) {}

    void completeLab(int labXp) {
        xp += labXp;
        std::cout << "[" << name << "] Completed lab! Total XP: " << xp << "\\n";
    }

    int getXp() const { return xp; }
};

int main() {
    LearnerAccount learner("Aarav", 450);
    learner.completeLab(100);
    return 0;
}
`,
        explanation: 'In C++, `class` members are private by default; `struct` members are public by default. Constructors use member initializer lists for zero-copy initialization.',
        commonGotcha: 'Assigning members inside constructor bodies instead of using the member initializer list.',
        proTip: 'Mark all member functions that do not mutate state as `const` (e.g. `int getXp() const`).',
      },
      java: {
        language: 'java',
        displayName: 'Java 21',
        badge: '☕ Java',
        syntaxStyle: 'Strict encapsulation with getters/setters and package visibility',
        code: `public class Main {
    static class LearnerAccount {
        private final String name;
        private int xp;

        public LearnerAccount(String name, int initialXp) {
            this.name = name;
            this.xp = initialXp;
        }

        public void completeLab(int labXp) {
            this.xp += labXp;
            System.out.println("[" + this.name + "] Completed lab! Total XP: " + this.xp);
        }

        public int getXp() { return this.xp; }
    }

    public static void main(String[] args) {
        LearnerAccount learner = new LearnerAccount("Aarav", 450);
        learner.completeLab(100);
    }
}
`,
        explanation: 'Java enforces object-oriented programming: everything must reside inside a class. Fields are typically private and accessed through public methods.',
        commonGotcha: 'Creating deeply nested inheritance hierarchies instead of using delegation and interfaces.',
        proTip: 'Prefer composition over inheritance. Implement interfaces instead of extending abstract classes.',
      },
      c: {
        language: 'c',
        displayName: 'C (C11)',
        badge: '⚙️ C',
        syntaxStyle: 'Opaque pointers and struct-based encapsulation',
        code: `#include <stdio.h>

typedef struct {
    char name[32];
    int xp;
} LearnerAccount;

void completeLab(LearnerAccount* account, int labXp) {
    account->xp += labXp;
    printf("[%s] Completed lab! Total XP: %d\\n", account->name, account->xp);
}

int main() {
    LearnerAccount learner = {"Aarav", 450};
    completeLab(&learner, 100);
    return 0;
}
`,
        explanation: 'In C, object-oriented concepts are achieved procedurally by passing a pointer to a struct as the first argument to functions.',
        commonGotcha: 'Passing the struct by value `completeLab(learner, 100)`: any changes made inside the function only affect the copy.',
        proTip: 'Pass struct pointers `LearnerAccount*` to mutate state across function boundaries.',
      },
      sql: {
        language: 'sql',
        displayName: 'SQL (ANSI)',
        badge: '🗄️ SQL',
        syntaxStyle: 'Tables represent entity models with relational foreign key associations',
        code: `-- SQL: Entity data modeling
CREATE TABLE learner_accounts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    xp INT NOT NULL DEFAULT 0
);

-- Procedure to complete lab
UPDATE learner_accounts 
SET xp = xp + 100 
WHERE name = 'Aarav';
`,
        explanation: 'Relational databases model objects as rows in normalized tables, using foreign keys to represent relationships rather than memory references.',
        commonGotcha: 'Storing comma-separated IDs in a column instead of creating a junction table for many-to-many relationships.',
        proTip: 'Keep tables normalized (3NF) to eliminate data anomalies.',
      },
    },
  },

  // 7. DEFENSIVE ERROR HANDLING
  {
    id: 'error_handling',
    title: 'Defensive Error Handling & Exceptions',
    category: 'Architecture',
    summary: 'Anticipating anomalous conditions, preventing application crashes, and recovering gracefully.',
    computationalModel: 'When an exception is thrown, the runtime unwinds the call stack, executing cleanup/finally handlers for each active frame until an appropriate catch block is found. If uncaught, the process terminates.',
    comparisonMatrix: [
      {
        dimension: 'Handling Block',
        python: 'try / except / finally',
        javascript: 'try / catch / finally',
        typescript: 'try / catch / finally',
        cpp: 'try / catch',
        java: 'try / catch / finally (checked/unchecked)',
        c: 'Return error codes / errno',
      },
      {
        dimension: 'Throw Keyword',
        python: 'raise Exception(...)',
        javascript: 'throw new Error(...)',
        typescript: 'throw new Error(...)',
        cpp: 'throw std::runtime_error(...)',
        java: 'throw new Exception(...)',
        c: 'return -1 / set errno',
      },
      {
        dimension: 'Checked Exceptions',
        python: 'No (all unchecked)',
        javascript: 'No (all unchecked)',
        typescript: 'No (all unchecked)',
        cpp: 'No (noexcept specifier only)',
        java: 'Yes (compiler enforces throws/catch)',
        c: 'No exceptions at language level',
      },
    ],
    languages: {
      python: {
        language: 'python',
        displayName: 'Python 3.12',
        badge: '🐍 Python',
        syntaxStyle: 'try / except blocks with custom Exception classes',
        code: `def safe_divide(numerator: float, denominator: float) -> float:
    try:
        return numerator / denominator
    except ZeroDivisionError as err:
        print(f"[RECOVERED] Cannot divide by zero: {err}")
        return 0.0
    finally:
        print("[AUDIT] Operation evaluated.")

print("Result 1:", safe_divide(100, 4))
print("Result 2:", safe_divide(100, 0))
`,
        explanation: 'Python embraces EAFP ("Easier to Ask for Forgiveness than Permission"). Code executes inside `try` blocks and handles exceptions cleanly in `except` blocks.',
        commonGotcha: 'Catching bare `except:`: it catches `KeyboardInterrupt` and `SystemExit`, making programs hard to stop.',
        proTip: 'Always specify the exact exception: `except ValueError as e:`.',
      },
      javascript: {
        language: 'javascript',
        displayName: 'JavaScript (ES6+)',
        badge: '🟨 JavaScript',
        syntaxStyle: 'try / catch / finally with Error objects',
        code: `function parseConfiguration(jsonString) {
  try {
    const config = JSON.parse(jsonString);
    return { success: true, config };
  } catch (error) {
    console.error("[ERROR CAUGHT]", error.message);
    return { success: false, fallback: {} };
  } finally {
    console.log("[TELEMETRY] Configuration parse cycle complete.");
  }
}

console.log(parseConfiguration('{"theme": "midnight-blue"}'));
console.log(parseConfiguration('invalid-json'));
`,
        explanation: 'JavaScript wraps error handling in `try...catch...finally`. Thrown values can be anything, but should always be instances of `Error`.',
        commonGotcha: 'Throwing plain strings like `throw "Error"` instead of `throw new Error("Message")` which loses the stack trace.',
        proTip: 'Always instantiate `new Error(message)` so developer tools provide accurate stack trace line numbers.',
      },
      typescript: {
        language: 'typescript',
        displayName: 'TypeScript 5.x',
        badge: '🔷 TypeScript',
        syntaxStyle: 'useUnknownInCatchVariables with type guards',
        code: `function parseLabPayload(payload: string): { data: unknown } | null {
  try {
    return { data: JSON.parse(payload) };
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(\`[TYPED ERROR] \${err.message}\`);
    } else {
      console.error("[UNKNOWN ERROR OCCURRED]");
    }
    return null;
  }
}

parseLabPayload('valid {"lab": 1}');
parseLabPayload('invalid');
`,
        explanation: 'Modern TypeScript treats caught errors as `unknown` rather than `any`, forcing developers to write type guards before accessing properties.',
        commonGotcha: 'Assuming caught errors always have an `.message` property without narrowing `if (err instanceof Error)`.',
        proTip: 'Use Result/Either patterns (`{ ok: true, value } | { ok: false, error }`) for expected operational failures.',
      },
      cpp: {
        language: 'cpp',
        displayName: 'C++ (C++20)',
        badge: '⚡ C++',
        syntaxStyle: 'try / catch with std::exception hierarchy and RAII stack unwinding',
        code: `#include <iostream>
#include <stdexcept>

double safeDivide(double a, double b) {
    if (b == 0.0) {
        throw std::invalid_argument("Division by zero is undefined");
    }
    return a / b;
}

int main() {
    try {
        std::cout << "Result: " << safeDivide(100.0, 4.0) << "\\n";
        std::cout << "Result: " << safeDivide(100.0, 0.0) << "\\n";
    } catch (const std::exception& e) {
        std::cerr << "[CAUGHT] Exception: " << e.what() << "\\n";
    }
    return 0;
}
`,
        explanation: 'C++ unwinds the stack upon throwing, guaranteeing that destructors for stack-allocated objects are called (RAII).',
        commonGotcha: 'Throwing exceptions from inside a destructor, which immediately triggers `std::terminate()`.',
        proTip: 'Catch exceptions by `const std::exception&` to prevent object slicing.',
      },
      java: {
        language: 'java',
        displayName: 'Java 21',
        badge: '☕ Java',
        syntaxStyle: 'try-with-resources and checked vs unchecked exceptions',
        code: `public class Main {
    public static int safeDivide(int a, int b) {
        try {
            return a / b;
        } catch (ArithmeticException e) {
            System.err.println("[CAUGHT] " + e.getMessage());
            return 0;
        } finally {
            System.out.println("[AUDIT] Operation complete.");
        }
    }

    public static void main(String[] args) {
        System.out.println("Result: " + safeDivide(100, 5));
        System.out.println("Result: " + safeDivide(100, 0));
    }
}
`,
        explanation: 'Java distinguishes between Checked Exceptions (`Exception`, checked by compiler) and Unchecked Exceptions (`RuntimeException`).',
        commonGotcha: 'Empty catch blocks that swallow exceptions silently, turning bugs into mysterious runtime behavior.',
        proTip: 'Use `try-with-resources` (`try (AutoCloseable res = ...)`) for automatic stream/file closure.',
      },
      c: {
        language: 'c',
        displayName: 'C (C11)',
        badge: '⚙️ C',
        syntaxStyle: 'Integer return codes, NULL pointer returns, and errno',
        code: `#include <stdio.h>
#include <stdbool.h>

bool safeDivide(int a, int b, int* result) {
    if (b == 0) {
        return false; // Error condition
    }
    *result = a / b;
    return true; // Success
}

int main() {
    int res;
    if (safeDivide(100, 5, &res)) {
        printf("Result: %d\\n", res);
    } else {
        printf("[ERROR] Division by zero prevented.\\n");
    }
    return 0;
}
`,
        explanation: 'C does not have language-level exception handling. Functions return status codes (0 for success, non-zero for error) or set output pointers.',
        commonGotcha: 'Ignoring return codes from functions like `malloc()` or `scanf()`, leading to null pointer dereferences.',
        proTip: 'Always check return values before using output pointers.',
      },
      sql: {
        language: 'sql',
        displayName: 'SQL (ANSI)',
        badge: '🗄️ SQL',
        syntaxStyle: 'ACID transactions, rollback, and error traps',
        code: `-- SQL: Transactional safety with automatic rollback on error
BEGIN;
UPDATE student_balances SET balance = balance - 100 WHERE id = 1;
UPDATE student_balances SET balance = balance + 100 WHERE id = 2;
COMMIT;
-- In case of failure:
-- ROLLBACK;
`,
        explanation: 'SQL transactions guarantee ACID properties. If any constraint is violated, the transaction is rolled back, leaving the database unchanged.',
        commonGotcha: 'Leaving open transactions uncommitted, creating row locks that block other queries.',
        proTip: 'Keep transactions as short as possible to minimize lock contention.',
      },
    },
  },
];
