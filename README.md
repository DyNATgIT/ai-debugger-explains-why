<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1117,50:00e5ff,100:00ff88&height=200&section=header&text=D%20E%20B%20U%20G%20G%20E%20R&fontSize=60&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=Advanced%20Debug%20Engine%20That%20Explains%20Why&descSize=18&descAlignY=55&descColor=8b949e" width="100%"/>

<br/>

<a href="https://ai-debugger-explains-why.surge.sh"><img src="https://img.shields.io/badge/%F0%9F%9A%80%20LIVE%20DEMO-ai--debugger--explains--why.surge.sh-00e5ff?style=for-the-badge&labelColor=0d1117" alt="Live Demo"/></a>

<br/><br/>

<a href="https://react.dev"><img src="https://img.shields.io/badge/React%2019-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React"/></a>
<a href="https://typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"/></a>
<a href="https://vite.dev"><img src="https://img.shields.io/badge/Vite%207-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite"/></a>
<a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind%20v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind"/></a>

<br/><br/>

<table>
<tr>
<td>

> *"This failed because your assumption that `arr.length` is a valid array index is **false**."*
>
> — DEBUGGER, after analyzing your off-by-one error

</td>
</tr>
</table>

</div>

<br/>

## 🧬 The Philosophy

Most debuggers tell you **what** went wrong — a line number, a stack trace, maybe a variable value.

**DEBUGGER** tells you **why**.

It identifies the **false assumption** hiding in your mental model — the invisible belief that made you write the bug in the first place.

<table>
<tr>
<td>🔴</td>
<td><b>Traditional Debugger</b></td>
<td><i>"Error on line 3"</i></td>
</tr>
<tr>
<td>🟢</td>
<td><b>DEBUGGER</b></td>
<td><i>"This failed because your assumption that <code>arr.length</code> is a valid array index is false. Arrays are zero-indexed, so an array of length 5 has indices 0–4."</i></td>
</tr>
</table>

<br/>

## ⚙️ How It Works

<table>
<tr>
<th>🔍 Phase 1</th>
<th>➜</th>
<th>🧩 Phase 2</th>
<th>➜</th>
<th>💡 Phase 3</th>
<th>➜</th>
<th>✅ Phase 4</th>
</tr>
<tr>
<td align="center"><b>TRACE</b><br/><sub>Step through execution<br/>line by line</sub></td>
<td align="center">⟶</td>
<td align="center"><b>MATCH</b><br/><sub>Identify bug pattern<br/>with confidence %</sub></td>
<td align="center">⟶</td>
<td align="center"><b>ANALYZE</b><br/><sub>Find the false<br/>assumption</sub></td>
<td align="center">⟶</td>
<td align="center"><b>EXPLAIN</b><br/><sub>Plain-English<br/>root cause + fix</sub></td>
</tr>
</table>

<br/>

## 🎯 Interactive Scenarios

Six carefully crafted debugging scenarios — each one a real-world trap that catches even experienced developers.

<br/>

<details>
<summary>🔢 <b>Off-By-One Array Error</b> &nbsp;—&nbsp; <code>Logic Error</code></summary>

<br/>

| | |
|---|---|
| **The Bug** | `i = arr.length` — but max valid index is `arr.length - 1` |
| **False Assumption** | *"`arr.length` is a valid array index"* |

```diff
  function getLastThreeItems(arr) {
    const result = [];
-   for (let i = arr.length; i > arr.length - 3; i--) {
+   for (let i = arr.length - 1; i > arr.length - 4; i--) {
      result.push(arr[i]);
    }
    return result;
  }
```

</details>

<details>
<summary>⏳ <b>Null Reference in Async Flow</b> &nbsp;—&nbsp; <code>Async Error</code></summary>

<br/>

| | |
|---|---|
| **The Bug** | `.then()` used without `await` — code continues before Promise resolves |
| **False Assumption** | *"The `.then()` callback runs before the next line"* |

```diff
  async function loadUserProfile(userId) {
-   let user = null;
-   fetchUser(userId).then(data => { user = data; });
-   displayName(user.name);  // 💥 null!
+   const user = await fetchUser(userId);
+   displayName(user.name);  // ✅ guaranteed populated
  }
```

</details>

<details>
<summary>⚛️ <b>State Mutation in React</b> &nbsp;—&nbsp; <code>React Bug</code></summary>

<br/>

| | |
|---|---|
| **The Bug** | Direct mutation of state object → same reference → React skips re-render |
| **False Assumption** | *"React detects changes inside state objects"* |

```diff
  function toggleTodo(id) {
-   const todo = todos.find(t => t.id === id);
-   todo.done = !todo.done;  // mutating!
-   setTodos(todos);         // same ref!
+   setTodos(todos.map(t =>
+     t.id === id ? { ...t, done: !t.done } : t
+   ));
  }
```

</details>

<details>
<summary>🔒 <b>Stale Closure in setTimeout</b> &nbsp;—&nbsp; <code>Closure Bug</code></summary>

<br/>

| | |
|---|---|
| **The Bug** | All 5 callbacks capture `count = 0`, so final count is 1 instead of 5 |
| **False Assumption** | *"`count` inside the callback reflects the current state"* |

```diff
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
-     setCount(count + 1);     // all compute 0+1 = 1
+     setCount(prev => prev + 1); // each uses latest
    }, i * 1000);
  }
```

</details>

<details>
<summary>⚖️ <b>Loose Equality Gotcha</b> &nbsp;—&nbsp; <code>Type Coercion</code></summary>

<br/>

| | |
|---|---|
| **The Bug** | `0 == ''` is `true` — JavaScript coerces both to `0` |
| **False Assumption** | *"`==` reliably checks if a field is empty"* |

```diff
- if (formData.age == '') {           // 0 == '' → true!
+ if (formData.age === '' || formData.age == null) {
    errors.push('Age is required');
  }
```

</details>

<details>
<summary>📦 <b>Variable Hoisting Surprise</b> &nbsp;—&nbsp; <code>Scope Bug</code></summary>

<br/>

| | |
|---|---|
| **The Bug** | `var` is function-scoped — variables leak out of loops and if-blocks |
| **False Assumption** | *"`var` inside a block stays in that block"* |

```diff
  function processOrders(orders) {
-   var total = 0;
-   for (var i = 0; i < orders.length; i++) {
-     var discount = 0;
+   let total = 0;
+   for (let i = 0; i < orders.length; i++) {
+     let discount = 0;
      // ...
    }
  }
```

</details>

<br/>

## ✨ Features

<table>
<tr><td>🎬</td><td><b>Animated Execution Trace</b></td><td>Watch variables change in real-time as the debugger steps through code</td></tr>
<tr><td>📊</td><td><b>Pattern Confidence Bars</b></td><td>Animated gradient bars with glow effects showing match confidence</td></tr>
<tr><td>⚠️</td><td><b>False Assumption Detection</b></td><td>The core insight — what you <i>thought</i> was true, but isn't</td></tr>
<tr><td>✅</td><td><b>Intent Tests</b></td><td>Expected vs. actual behavior with pass/fail badges</td></tr>
<tr><td>⌨️</td><td><b>Typewriter Effect</b></td><td>Root cause typed out character-by-character in real-time</td></tr>
<tr><td>🛠️</td><td><b>Suggested Fix</b></td><td>Syntax-highlighted corrected code as a drop-in replacement</td></tr>
<tr><td>🌌</td><td><b>Particle Background</b></td><td>Floating animated particles with glassmorphism panels</td></tr>
<tr><td>📱</td><td><b>Fully Responsive</b></td><td>Adapts seamlessly from desktop to mobile</td></tr>
</table>

<br/>

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/DyNATgIT/ai-debugger-explains-why.git
cd ai-debugger-explains-why

# Install & run
npm install
npm run dev          # → http://localhost:5173

# Build (single HTML file, ~290KB)
npm run build
```

<br/>

## 📁 Project Structure

```
📦 ai-debugger-explains-why
 ┣ 📄 index.html                ← Entry point + Google Fonts
 ┣ ⚙️ vite.config.ts             ← Vite + React + Tailwind + SingleFile
 ┣ 📄 package.json
 ┗ 📂 src
   ┣ 📄 main.tsx                ← React mount
   ┣ 🎨 index.css               ← Glassmorphism, gradients, noise, animations
   ┣ 🧠 App.tsx                 ← All components + main app
   ┃   ┣ ParticlesBackground       Floating animated particles
   ┃   ┣ TypeWriter                 Character-by-character text reveal
   ┃   ┣ ConfidenceBar             Animated gradient progress bars
   ┃   ┣ CodeViewer                 Code with active line tracking
   ┃   ┣ PhaseIndicator            TRACE → MATCH → ANALYZE → COMPLETE
   ┃   ┣ TraceStepRow              Animated trace step rows
   ┃   ┣ App                       Orchestrates the 4-phase debug sequence
   ┃   ┗ LandingView               Hero + scenario picker
   ┣ 📂 data
   ┃   ┗ 📄 scenarios.ts        ← 6 bug definitions (code, traces, patterns, fixes)
   ┗ 📂 utils
       ┗ 📄 cn.ts               ← clsx + tailwind-merge utility
```

<br/>

## 🎨 Design System

<table>
<tr><td><b>Background</b></td><td>Animated mesh gradient + noise overlay + floating particles</td></tr>
<tr><td><b>Panels</b></td><td>Glassmorphism with <code>backdrop-blur</code> and cyan/emerald borders</td></tr>
<tr><td><b>Typography</b></td><td>Orbitron · Audiowide · Rajdhani · Share Tech Mono · Exo 2</td></tr>
<tr><td><b>Palette</b></td><td>🟦 Cyan <code>#00e5ff</code> · 🟩 Emerald <code>#00ff88</code> · 🟧 Amber <code>#ff8800</code></td></tr>
<tr><td><b>Animations</b></td><td>Fade-in · Slide-in · Scale-in · Pulse-glow · Scan-line · Typewriter</td></tr>
</table>

<br/>

---

<div align="center">

<br/>

**Understanding bugs is more important than just fixing them.**

<br/>

<a href="https://ai-debugger-explains-why.surge.sh"><img src="https://img.shields.io/badge/%F0%9F%9A%80%20TRY%20THE%20LIVE%20DEMO%20%E2%86%92-00e5ff?style=for-the-badge&labelColor=0d1117" alt="Try Live Demo"/></a>

<br/><br/>

Built with `React` · `TypeScript` · `Vite` · `Tailwind CSS v4`

Made with ☕ and curiosity

<br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0d1117,50:00e5ff,100:00ff88&height=100&section=footer" width="100%"/>

</div>
