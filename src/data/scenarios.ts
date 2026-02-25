export interface TraceStep {
  line: number;
  variable?: string;
  value?: string;
  note?: string;
  isError?: boolean;
}

export interface PatternMatch {
  name: string;
  confidence: number;
  description: string;
}

export interface TestResult {
  name: string;
  expected: string;
  actual: string;
  passed: boolean;
}

export interface Scenario {
  id: string;
  title: string;
  category: string;
  icon: string;
  code: string;
  highlightLines: number[];
  errorLine: number;
  trace: TraceStep[];
  patterns: PatternMatch[];
  tests: TestResult[];
  rootCause: string;
  assumption: string;
  fix: string;
  fixCode: string;
}

export const scenarios: Scenario[] = [
  {
    id: "off-by-one",
    title: "Off-By-One Array Error",
    category: "Logic Error",
    icon: "🔢",
    code: `function getLastThreeItems(arr) {
  const result = [];
  for (let i = arr.length; i > arr.length - 3; i--) {
    result.push(arr[i]);
  }
  return result;
}

// Usage:
const items = ['a', 'b', 'c', 'd', 'e'];
const last3 = getLastThreeItems(items);
console.log(last3);
// Expected: ['e', 'd', 'c']
// Actual:   [undefined, 'e', 'd']`,
    highlightLines: [3],
    errorLine: 3,
    trace: [
      { line: 1, variable: "arr", value: "['a','b','c','d','e']", note: "Function called with 5-element array" },
      { line: 2, variable: "result", value: "[]", note: "Initialize empty result" },
      { line: 3, variable: "i", value: "5", note: "⚠️ i starts at arr.length (5), but max index is 4" },
      { line: 4, variable: "arr[5]", value: "undefined", isError: true, note: "Index 5 is out of bounds!" },
      { line: 3, variable: "i", value: "4", note: "Decrement i" },
      { line: 4, variable: "arr[4]", value: "'e'", note: "Valid access" },
      { line: 3, variable: "i", value: "3", note: "Decrement i" },
      { line: 4, variable: "arr[3]", value: "'d'", note: "Valid access" },
      { line: 6, variable: "result", value: "[undefined, 'e', 'd']", isError: true, note: "Result contains undefined — off by one" },
    ],
    patterns: [
      { name: "Off-By-One Error", confidence: 97, description: "Loop initializer uses .length instead of .length - 1" },
      { name: "Array Bounds Violation", confidence: 94, description: "First iteration accesses index beyond array bounds" },
    ],
    tests: [
      { name: "Returns last 3 items", expected: "['e','d','c']", actual: "[undefined,'e','d']", passed: false },
      { name: "Result has length 3", expected: "3", actual: "3", passed: true },
      { name: "No undefined values", expected: "true", actual: "false", passed: false },
    ],
    rootCause: "This failed because your assumption that arr.length is a valid array index is false. In JavaScript, arrays are zero-indexed, so an array of length 5 has indices 0–4. Starting the loop at i = arr.length (5) causes the first access arr[5] to return undefined.",
    assumption: "arr.length is a valid index into the array",
    fix: "Initialize i to arr.length - 1 instead of arr.length",
    fixCode: `function getLastThreeItems(arr) {
  const result = [];
  for (let i = arr.length - 1; i > arr.length - 4; i--) {
    result.push(arr[i]);
  }
  return result;
}`,
  },
  {
    id: "null-async",
    title: "Null Reference in Async Flow",
    category: "Async Error",
    icon: "⏳",
    code: `async function loadUserProfile(userId) {
  let user = null;
  
  fetchUser(userId).then(data => {
    user = data;
  });

  // Render immediately
  displayName(user.name);
  displayEmail(user.email);
}

async function fetchUser(id) {
  const res = await fetch(\`/api/users/\${id}\`);
  return res.json();
}`,
    highlightLines: [9],
    errorLine: 9,
    trace: [
      { line: 1, variable: "userId", value: "'usr_123'", note: "Function invoked" },
      { line: 2, variable: "user", value: "null", note: "user initialized as null" },
      { line: 4, note: "fetchUser() called — returns a Promise (async)", variable: "Promise", value: "<pending>" },
      { line: 9, variable: "user", value: "null", isError: true, note: "⚠️ Code continues before Promise resolves!" },
      { line: 9, note: "TypeError: Cannot read property 'name' of null", isError: true },
      { line: 4, variable: "user", value: "{name:'Alice',...}", note: "Promise resolves LATER — too late" },
    ],
    patterns: [
      { name: "Async Timing Violation", confidence: 98, description: "Synchronous access of data that depends on an unresolved Promise" },
      { name: "Null Dereference", confidence: 95, description: "Property access on null reference at line 9" },
      { name: "Missing Await", confidence: 92, description: ".then() used without awaiting before dependent code" },
    ],
    tests: [
      { name: "User name is displayed", expected: "'Alice'", actual: "TypeError", passed: false },
      { name: "User email is displayed", expected: "'alice@test.com'", actual: "TypeError", passed: false },
      { name: "fetchUser resolves", expected: "{name:'Alice'}", actual: "{name:'Alice'}", passed: true },
    ],
    rootCause: "This failed because your assumption that user is populated before line 9 executes is false. The .then() callback is asynchronous — it schedules the assignment for later, but the code on line 9 runs immediately and synchronously. At that point, user is still null.",
    assumption: "The .then() callback runs before the next line of code",
    fix: "Use await to pause execution until the Promise resolves",
    fixCode: `async function loadUserProfile(userId) {
  const user = await fetchUser(userId);
  
  // Now user is guaranteed to be populated
  displayName(user.name);
  displayEmail(user.email);
}`,
  },
  {
    id: "state-mutation",
    title: "State Mutation in React",
    category: "React Bug",
    icon: "⚛️",
    code: `function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Buy milk', done: false },
    { id: 2, text: 'Walk dog', done: false },
  ]);

  function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    todo.done = !todo.done;  // Direct mutation!
    setTodos(todos);         // Same reference
  }

  return (
    <ul>
      {todos.map(t => (
        <li key={t.id} onClick={() => toggleTodo(t.id)}>
          {t.done ? '✅' : '⬜'} {t.text}
        </li>
      ))}
    </ul>
  );
}`,
    highlightLines: [9, 10],
    errorLine: 9,
    trace: [
      { line: 7, variable: "id", value: "1", note: "toggleTodo(1) called on click" },
      { line: 8, variable: "todo", value: "{id:1, text:'Buy milk', done:false}", note: "Found matching todo" },
      { line: 9, variable: "todo.done", value: "true", isError: true, note: "⚠️ Mutating existing state object directly!" },
      { line: 10, variable: "todos", value: "[...same ref...]", isError: true, note: "⚠️ setTodos receives the SAME array reference" },
      { line: 10, note: "React compares old vs new state by reference", isError: true },
      { line: 10, note: "Same reference → React skips re-render!", isError: true },
    ],
    patterns: [
      { name: "State Mutation", confidence: 99, description: "Direct property assignment on state-owned object" },
      { name: "Stale Reference", confidence: 96, description: "setState called with the same object reference" },
      { name: "React Re-render Skip", confidence: 94, description: "React's shallow comparison sees no change" },
    ],
    tests: [
      { name: "Click toggles checkbox UI", expected: "✅ Buy milk", actual: "⬜ Buy milk", passed: false },
      { name: "State value changes", expected: "done: true", actual: "done: true (mutated)", passed: true },
      { name: "Component re-renders", expected: "true", actual: "false", passed: false },
    ],
    rootCause: "This failed because your assumption that React detects changes inside objects is false. React uses shallow reference comparison (Object.is) to decide whether to re-render. Since you mutated the existing object and passed the same array reference to setTodos, React sees no change and skips the re-render entirely. The data changed, but the UI doesn't know.",
    assumption: "React detects when you change properties inside state objects",
    fix: "Create new array and object references with spread/map",
    fixCode: `function toggleTodo(id) {
  setTodos(todos.map(t =>
    t.id === id ? { ...t, done: !t.done } : t
  ));
}`,
  },
  {
    id: "closure-trap",
    title: "Stale Closure in setTimeout",
    category: "Closure Bug",
    icon: "🔒",
    code: `function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        setCount(count + 1);
      }, i * 1000);
    }
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Add 5</button>
    </div>
  );
}`,
    highlightLines: [7],
    errorLine: 7,
    trace: [
      { line: 4, note: "handleClick invoked. count = 0 at this moment" },
      { line: 5, variable: "i", value: "0", note: "Loop begins" },
      { line: 6, note: "setTimeout #1 scheduled — captures count = 0", variable: "closure.count", value: "0" },
      { line: 6, note: "setTimeout #2 scheduled — captures count = 0", variable: "closure.count", value: "0" },
      { line: 6, note: "setTimeout #3 scheduled — captures count = 0", variable: "closure.count", value: "0" },
      { line: 6, note: "setTimeout #4 scheduled — captures count = 0", variable: "closure.count", value: "0" },
      { line: 6, note: "setTimeout #5 scheduled — captures count = 0", variable: "closure.count", value: "0" },
      { line: 7, variable: "count + 1", value: "0 + 1 = 1", isError: true, note: "⚠️ All 5 callbacks compute 0 + 1 = 1" },
    ],
    patterns: [
      { name: "Stale Closure", confidence: 98, description: "Callback captures variable value at creation time, not execution time" },
      { name: "Lost Updates", confidence: 93, description: "Multiple setState calls overwrite each other with same stale value" },
    ],
    tests: [
      { name: "Count reaches 5 after clicking", expected: "5", actual: "1", passed: false },
      { name: "Each setTimeout fires", expected: "5 calls", actual: "5 calls", passed: true },
      { name: "State updates accumulate", expected: "incremental", actual: "all set to 1", passed: false },
    ],
    rootCause: "This failed because your assumption that count reflects the latest value inside setTimeout callbacks is false. All 5 callbacks were created during the same render, so they all close over the same count value (0). Each one computes 0 + 1 = 1, so the final count is 1, not 5.",
    assumption: "count inside the callback always reflects the current state",
    fix: "Use the functional updater form: setCount(prev => prev + 1)",
    fixCode: `function handleClick() {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      setCount(prev => prev + 1);
    }, i * 1000);
  }
}`,
  },
  {
    id: "equality-check",
    title: "Loose Equality Gotcha",
    category: "Type Coercion",
    icon: "⚖️",
    code: `function validateForm(formData) {
  const errors = [];

  if (formData.age == '') {
    errors.push('Age is required');
  }

  if (formData.score == false) {
    errors.push('Score is required');
  }

  if (formData.items == null) {
    errors.push('Items is required');
  }

  return errors;
}

// Usage:
const data = { age: 0, score: 0, items: undefined };
const errors = validateForm(data);
console.log(errors);
// Expected: ['Items is required']
// Actual:   ['Age is required', 'Score is required', 'Items is required']`,
    highlightLines: [4, 8],
    errorLine: 4,
    trace: [
      { line: 1, variable: "formData", value: "{age:0, score:0, items:undefined}", note: "Valid age=0, valid score=0" },
      { line: 4, variable: "0 == ''", value: "true", isError: true, note: "⚠️ JS coerces: Number(0) == Number('') → 0 == 0 → true!" },
      { line: 5, note: "Incorrectly pushes 'Age is required' — age IS provided (0)" },
      { line: 8, variable: "0 == false", value: "true", isError: true, note: "⚠️ JS coerces: 0 is falsy, false is falsy → true" },
      { line: 9, note: "Incorrectly pushes 'Score is required' — score IS provided (0)" },
      { line: 12, variable: "undefined == null", value: "true", note: "This one is actually correct (intended)" },
    ],
    patterns: [
      { name: "Loose Equality Coercion", confidence: 99, description: "== operator causes unexpected type coercion with falsy values" },
      { name: "Falsy Value Confusion", confidence: 95, description: "Legitimate value 0 treated as empty/missing due to coercion" },
    ],
    tests: [
      { name: "age=0 is valid", expected: "no error", actual: "'Age is required'", passed: false },
      { name: "score=0 is valid", expected: "no error", actual: "'Score is required'", passed: false },
      { name: "items=undefined is invalid", expected: "'Items is required'", actual: "'Items is required'", passed: true },
    ],
    rootCause: "This failed because your assumption that == correctly distinguishes between 'missing' and 'zero' is false. JavaScript's loose equality (==) coerces types before comparing: 0 == '' is true because both coerce to 0, and 0 == false is true because both are falsy. The number 0 is a valid value, but == treats it as equivalent to empty/false.",
    assumption: "== reliably checks whether a field is empty or missing",
    fix: "Use === for strict comparison, or check explicitly for null/undefined",
    fixCode: `function validateForm(formData) {
  const errors = [];

  if (formData.age === '' || formData.age == null) {
    errors.push('Age is required');
  }

  if (formData.score === '' || formData.score == null) {
    errors.push('Score is required');
  }

  if (formData.items == null) {
    errors.push('Items is required');
  }

  return errors;
}`,
  },
  {
    id: "scope-leak",
    title: "Variable Hoisting Surprise",
    category: "Scope Bug",
    icon: "📦",
    code: `function processOrders(orders) {
  var total = 0;

  for (var i = 0; i < orders.length; i++) {
    var discount = 0;

    if (orders[i].isPremium) {
      var discount = orders[i].price * 0.1;
    }

    var finalPrice = orders[i].price - discount;
    total += finalPrice;
  }

  console.log('Last discount:', discount);
  console.log('Iterator:', i);
  console.log('Total:', total);
  return total;
}

// Usage:
const orders = [
  { price: 100, isPremium: true },
  { price: 50, isPremium: false },
  { price: 200, isPremium: true },
];
processOrders(orders);
// Expected total: 90 + 50 + 180 = 320
// Actual total: 90 + 50 + 180 = 320 (correct here, but...)
// discount and i leak outside the loop!`,
    highlightLines: [5, 8, 15, 16],
    errorLine: 8,
    trace: [
      { line: 2, variable: "total", value: "0", note: "var total — function scoped" },
      { line: 4, variable: "i", value: "0", note: "var i — function scoped (NOT block scoped!)" },
      { line: 5, variable: "discount", value: "0", note: "var discount — function scoped" },
      { line: 8, variable: "discount", value: "10", note: "⚠️ Re-declares same var — no new scope created" },
      { line: 5, variable: "discount", value: "0", note: "i=1: discount reset (non-premium order)" },
      { line: 8, variable: "discount", value: "20", note: "i=2: premium discount applied" },
      { line: 15, variable: "discount", value: "20", isError: true, note: "⚠️ discount accessible outside loop!" },
      { line: 16, variable: "i", value: "3", isError: true, note: "⚠️ i accessible outside loop with final value!" },
    ],
    patterns: [
      { name: "Variable Hoisting", confidence: 96, description: "var declarations are hoisted to function scope, ignoring block boundaries" },
      { name: "Scope Leakage", confidence: 94, description: "Loop variables accessible after loop termination" },
      { name: "Redundant Re-declaration", confidence: 88, description: "var discount declared twice — second declaration is ignored" },
    ],
    tests: [
      { name: "Total is correct", expected: "320", actual: "320", passed: true },
      { name: "discount scoped to loop", expected: "ReferenceError", actual: "20", passed: false },
      { name: "i scoped to loop", expected: "ReferenceError", actual: "3", passed: false },
    ],
    rootCause: "This failed because your assumption that var creates block-scoped variables is false. Unlike let and const, var is function-scoped — it ignores block boundaries like if-statements and for-loops. The re-declaration on line 8 doesn't create a new variable; it refers to the same discount. After the loop, both discount and i remain accessible with their last assigned values.",
    assumption: "var inside a block (loop/if) stays contained within that block",
    fix: "Replace var with let/const for proper block scoping",
    fixCode: `function processOrders(orders) {
  let total = 0;

  for (let i = 0; i < orders.length; i++) {
    let discount = 0;

    if (orders[i].isPremium) {
      discount = orders[i].price * 0.1;
    }

    const finalPrice = orders[i].price - discount;
    total += finalPrice;
  }

  return total;
}`,
  },
];
