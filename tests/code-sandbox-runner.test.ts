import { describe, it, expect } from 'vitest';
import {
  executePythonCode,
  executeCCode,
  executeJavaScriptCode,
  executeSqlCode,
  executeTypeScriptCode,
  executeCppCode,
  executeJavaCode,
  STARTER_TEMPLATES,
} from '../src/utils/codeSandboxRunner';

describe('Client-Side Multi-Language Code Sandbox Engine', () => {
  describe('Python 3.12 Engine Tests', () => {
    it('executes basic print statements and handles data types', () => {
      const code = `
print("Hello, Geniusphere!")
print(42)
print(True)
`;
      const res = executePythonCode(code);
      expect(res.hasErrors).toBe(false);
      expect(res.exitCode).toBe(0);
      expect(res.stdout).toContain('Hello, Geniusphere!');
      expect(res.stdout).toContain('42');
      expect(res.stdout).toContain('True');
    });

    it('evaluates functions, loops, and math operations', () => {
      const code = `
def square(n):
    return n * n

for i in range(1, 4):
    print("Sq:", square(i))
`;
      const res = executePythonCode(code);
      expect(res.hasErrors).toBe(false);
      expect(res.exitCode).toBe(0);
      expect(res.stdout.some((l) => l.includes('Sq: 1'))).toBe(true);
      expect(res.stdout.some((l) => l.includes('Sq: 4'))).toBe(true);
      expect(res.stdout.some((l) => l.includes('Sq: 9'))).toBe(true);
    });

    it('supports standard math functions like math.sqrt and math.pi', () => {
      const code = `
import math
print("Root:", math.sqrt(16))
`;
      const res = executePythonCode(code);
      expect(res.hasErrors).toBe(false);
      expect(res.stdout.some((l) => l.includes('Root: 4'))).toBe(true);
    });

    it('handles syntax errors gracefully with formatted tracebacks', () => {
      const badCode = `
for i in 
`;
      const res = executePythonCode(badCode);
      expect(res.hasErrors).toBe(true);
      expect(res.exitCode).toBe(1);
      expect(res.stderr.length).toBeGreaterThan(0);
      expect(res.stderr[0]).toContain('Traceback');
    });
  });

  describe('C Language Compiler Simulation Tests', () => {
    it('requires an int main() entry point', () => {
      const invalidCode = `
#include <stdio.h>
void helper() {
    printf("no main");
}
`;
      const res = executeCCode(invalidCode);
      expect(res.hasErrors).toBe(true);
      expect(res.exitCode).toBe(1);
      expect(res.stderr.some((l) => l.includes('main()'))).toBe(true);
    });

    it('compiles and executes C main with formatted printf', () => {
      const code = `
#include <stdio.h>

int main() {
    int age = 21;
    printf("Learner age is %d\\n", age);
    printf("Status: Verified\\n");
    return 0;
}
`;
      const res = executeCCode(code);
      expect(res.hasErrors).toBe(false);
      expect(res.exitCode).toBe(0);
      expect(res.stdout).toContain('Learner age is 21');
      expect(res.stdout).toContain('Status: Verified');
    });

    it('supports C pointers and memory addresses', () => {
      const code = `
#include <stdio.h>

int main() {
    int secret = 1337;
    int *ptr = &secret;
    printf("Direct: %d\\n", secret);
    printf("Deref: %d\\n", *ptr);
    return 0;
}
`;
      const res = executeCCode(code);
      expect(res.hasErrors).toBe(false);
      expect(res.stdout).toContain('Direct: 1337');
      expect(res.stdout).toContain('Deref: 1337');
    });

    it('detects array buffer out-of-bounds access with defensive warnings', () => {
      const code = `
#include <stdio.h>

int main() {
    int buf[3] = {10, 20, 30};
    printf("Val: %d\\n", buf[0]);
    printf("Overflow: %d\\n", buf[5]);
    return 0;
}
`;
      const res = executeCCode(code);
      expect(res.stdout.some((l) => l.includes('BUFFER_OVERFLOW_WARNING'))).toBe(true);
    });
  });

  describe('JavaScript (ES6+) Engine Tests', () => {
    it('executes console.log, arrays, and arrow functions', () => {
      const code = `
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(x => x * 2);
console.log('Doubled:', doubled.join(', '));
`;
      const res = executeJavaScriptCode(code);
      expect(res.hasErrors).toBe(false);
      expect(res.exitCode).toBe(0);
      expect(res.stdout.some((l) => l.includes('Doubled: 2, 4, 6, 8, 10'))).toBe(true);
    });

    it('evaluates classes and object methods cleanly', () => {
      const code = `
class Calculator {
  add(a, b) { return a + b; }
}
const calc = new Calculator();
console.log('Sum:', calc.add(15, 27));
`;
      const res = executeJavaScriptCode(code);
      expect(res.hasErrors).toBe(false);
      expect(res.stdout.some((l) => l.includes('Sum: 42'))).toBe(true);
    });

    it('captures errors gracefully without crashing runtime', () => {
      const badCode = `
throw new Error("Explicit test fault");
`;
      const res = executeJavaScriptCode(badCode);
      expect(res.hasErrors).toBe(true);
      expect(res.exitCode).toBe(1);
      expect(res.stderr.some((l) => l.includes('Explicit test fault'))).toBe(true);
    });
  });

  describe('Relational SQL Engine Tests', () => {
    it('executes SELECT * queries with ASCII table formatting', () => {
      const sql = 'SELECT * FROM students LIMIT 2;';
      const res = executeSqlCode(sql);
      expect(res.hasErrors).toBe(false);
      expect(res.exitCode).toBe(0);
      expect(res.stdout.some((l) => l.includes('Pavan Kumar'))).toBe(true);
      expect(res.stdout.some((l) => l.includes('rows returned'))).toBe(true);
    });

    it('supports WHERE filtering in SQL queries', () => {
      const sql = "SELECT name, role FROM students WHERE role = 'student';";
      const res = executeSqlCode(sql);
      expect(res.hasErrors).toBe(false);
      expect(res.stdout.some((l) => l.includes('student'))).toBe(true);
    });

    it('supports SHOW TABLES schema exploration', () => {
      const sql = 'SHOW TABLES;';
      const res = executeSqlCode(sql);
      expect(res.hasErrors).toBe(false);
      expect(res.stdout.some((l) => l.includes('students'))).toBe(true);
      expect(res.stdout.some((l) => l.includes('courses'))).toBe(true);
      expect(res.stdout.some((l) => l.includes('lab_attempts'))).toBe(true);
    });

    it('handles non-existent table errors cleanly', () => {
      const sql = 'SELECT * FROM non_existent_table;';
      const res = executeSqlCode(sql);
      expect(res.hasErrors).toBe(true);
      expect(res.exitCode).toBe(1);
      expect(res.stderr.some((l) => l.includes('non_existent_table'))).toBe(true);
    });
  });

  describe('Starter Templates Quality', () => {
    it('has valid starter templates for Python, C, JavaScript, and SQL', () => {
      const pythonTemplates = STARTER_TEMPLATES.filter((t) => t.language === 'python');
      const cTemplates = STARTER_TEMPLATES.filter((t) => t.language === 'c');
      const jsTemplates = STARTER_TEMPLATES.filter((t) => t.language === 'javascript');
      const sqlTemplates = STARTER_TEMPLATES.filter((t) => t.language === 'sql');

      const tsTemplates = STARTER_TEMPLATES.filter((t) => t.language === 'typescript');
      const cppTemplates = STARTER_TEMPLATES.filter((t) => t.language === 'cpp');
      const javaTemplates = STARTER_TEMPLATES.filter((t) => t.language === 'java');

      expect(pythonTemplates.length).toBeGreaterThanOrEqual(3);
      expect(cTemplates.length).toBeGreaterThanOrEqual(3);
      expect(jsTemplates.length).toBeGreaterThanOrEqual(2);
      expect(sqlTemplates.length).toBeGreaterThanOrEqual(2);
      expect(tsTemplates.length).toBeGreaterThanOrEqual(1);
      expect(cppTemplates.length).toBeGreaterThanOrEqual(1);
      expect(javaTemplates.length).toBeGreaterThanOrEqual(1);

      // Verify all Python starter templates execute without errors
      pythonTemplates.forEach((tpl) => {
        const res = executePythonCode(tpl.code);
        expect(res.hasErrors).toBe(false);
        expect(res.exitCode).toBe(0);
        expect(res.stdout.length).toBeGreaterThan(0);
      });

      // Verify all C starter templates execute without errors
      cTemplates.forEach((tpl) => {
        const res = executeCCode(tpl.code);
        expect(res.hasErrors).toBe(false);
        expect(res.exitCode).toBe(0);
        expect(res.stdout.length).toBeGreaterThan(0);
      });

      // Verify all JavaScript starter templates execute without errors
      jsTemplates.forEach((tpl) => {
        const res = executeJavaScriptCode(tpl.code);
        expect(res.hasErrors).toBe(false);
        expect(res.exitCode).toBe(0);
        expect(res.stdout.length).toBeGreaterThan(0);
      });

      // Verify all SQL starter templates execute without errors
      sqlTemplates.forEach((tpl) => {
        const res = executeSqlCode(tpl.code);
        expect(res.hasErrors).toBe(false);
        expect(res.exitCode).toBe(0);
        expect(res.stdout.length).toBeGreaterThan(0);
      });
    });
  });

  describe('TypeScript, C++, and Java Execution Engines', () => {
    it('executes TypeScript code with interface contracts and static types', () => {
      const code = `
interface Learner {
  name: string;
  xp: number;
}
const student: Learner = { name: "Aarav", xp: 1200 };
console.log("Verified:", student.name, student.xp);
`;
      const res = executeTypeScriptCode(code);
      expect(res.hasErrors).toBe(false);
      expect(res.exitCode).toBe(0);
      expect(res.stdout.some((l) => l.includes('Verified: Aarav 1200'))).toBe(true);
    });

    it('executes C++ streams with std::cout and formatted expressions', () => {
      const code = `
#include <iostream>
int main() {
    std::cout << "C++ Engine Status: Online" << std::endl;
    return 0;
}
`;
      const res = executeCppCode(code);
      expect(res.hasErrors).toBe(false);
      expect(res.exitCode).toBe(0);
      expect(res.stdout.some((l) => l.includes('C++ Engine Status: Online'))).toBe(true);
    });

    it('executes Java code with System.out.println in class Main', () => {
      const code = `
public class Main {
    public static void main(String[] args) {
        System.out.println("Java JVM Status: Online");
    }
}
`;
      const res = executeJavaCode(code);
      expect(res.hasErrors).toBe(false);
      expect(res.exitCode).toBe(0);
      expect(res.stdout.some((l) => l.includes('Java JVM Status: Online'))).toBe(true);
    });
  });
});
