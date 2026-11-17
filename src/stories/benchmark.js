import { html, css, define, keyed } from "@positive-intentions/dim";
import { themeTokens } from "../theme.js";

// js-framework-benchmark style list operations. Open the same story with
// `?impl=js` and `?impl=wasm` to compare the two Dim runtimes; timings are
// setState → committed DOM (updateComplete), median of RUNS.

const RUNS = 5;
const ADJECTIVES = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint"];
const NOUNS = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger"];

let nextId = 1;
function buildRows(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: nextId++,
    label: `${ADJECTIVES[i % ADJECTIVES.length]} ${NOUNS[(i * 7) % NOUNS.length]}`,
  }));
}

const styles = css`
  ${themeTokens}
  :host {
    display: block;
    padding: var(--dimui-space-4, 1rem);
    color: var(--dimui-color-text);
    font-family: inherit;
  }
  .bar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
    margin-bottom: 0.75rem;
  }
  button {
    padding: 0.4rem 0.75rem;
    border-radius: var(--dimui-radius, 6px);
    border: 1px solid var(--dimui-color-border);
    background: var(--dimui-color-surface);
    color: inherit;
    cursor: pointer;
    font: inherit;
  }
  button.primary {
    background: var(--dimui-color-primary);
    color: var(--dimui-color-on-primary);
    border: none;
  }
  .runtime {
    font-weight: 600;
  }
  table.results {
    border-collapse: collapse;
    margin-bottom: 1rem;
    font-variant-numeric: tabular-nums;
  }
  table.results td,
  table.results th {
    padding: 0.2rem 0.75rem;
    border-bottom: 1px solid var(--dimui-color-border-subtle);
    text-align: left;
  }
  .rows {
    max-height: 320px;
    overflow: auto;
    border: 1px solid var(--dimui-color-border-subtle);
  }
  .rows table {
    width: 100%;
    border-collapse: collapse;
  }
  .rows td {
    padding: 0.15rem 0.5rem;
  }
  tr.selected {
    background: color-mix(in srgb, var(--dimui-color-primary) 18%, transparent);
  }
`;

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
};

export const KeyedListBenchmark = define({
  tag: "dimui-keyed-list-benchmark",
  component: (_, { html: tpl, useState, useStyle, useRef }) => {
    useStyle(styles);
    const host = useRef();
    const [rows, setRows] = useState([]);
    const [selected, setSelected] = useState(0);
    const [results, setResults] = useState([]);
    const [running, setRunning] = useState(false);
    const runtime = document.documentElement.dataset.dimRuntime || "js";

    const commit = async (apply) => {
      const t0 = performance.now();
      apply();
      await host.current.updateComplete;
      return performance.now() - t0;
    };

    const ops = [
      ["create 1,000 rows", () => setRows(buildRows(1000))],
      ["update every 10th row", () => setRows((r) => r.map((row, i) => (i % 10 ? row : { ...row, label: `${row.label} !!!` })))],
      ["select row", () => setSelected((s) => (s === 5 ? 6 : 5))],
      ["swap rows 2 and 998", () => setRows((r) => {
        const next = [...r];
        [next[1], next[998]] = [next[998], next[1]];
        return next;
      })],
      ["remove first row", () => setRows((r) => r.slice(1))],
      ["append 1,000 rows", () => setRows((r) => [...r, ...buildRows(1000)])],
      ["clear", () => setRows([])],
    ];

    const runSuite = async () => {
      setRunning(true);
      await host.current.updateComplete;
      const timings = ops.map(() => []);
      for (let run = 0; run < RUNS; run++) {
        await commit(() => setRows([]));
        for (let i = 0; i < ops.length; i++) {
          if (i > 0 && ops[i - 1][0] === "clear") await commit(() => setRows(buildRows(1000)));
          timings[i].push(await commit(ops[i][1]));
        }
      }
      setResults(ops.map(([name], i) => ({ name, ms: median(timings[i]) })));
      setRunning(false);
    };

    return tpl`
      <div class="bar">
        <span>Runtime: <span class="runtime" id="runtime">${runtime}</span></span>
        <button class="primary" id="run" ?disabled="${running}" @click="${runSuite}">
          ${running ? "Running…" : `Run suite (median of ${RUNS})`}
        </button>
        ${ops.map(([name, op]) => tpl`<button @click="${() => commit(op)}">${name}</button>`)}
      </div>
      ${results.length
        ? tpl`
            <table class="results" id="results">
              <tr><th>operation</th><th>ms</th></tr>
              ${results.map((r) => tpl`<tr><td>${r.name}</td><td>${r.ms.toFixed(1)}</td></tr>`)}
              <tr><th>total</th><th>${results.reduce((a, r) => a + r.ms, 0).toFixed(1)}</th></tr>
            </table>
          `
        : null}
      <div class="rows">
        <table>
          ${rows.map((row) =>
            keyed(
              row.id,
              tpl`<tr class="${row.id === rows[selected]?.id ? "selected" : ""}">
                <td>${row.id}</td>
                <td>${row.label}</td>
              </tr>`,
            ),
          )}
        </table>
      </div>
    `;
  },
});

export default {
  title: "Benchmarks/Keyed list",
  description:
    "1,000-row list operations timed from setState to committed DOM. Compare runtimes with ?impl=js and ?impl=wasm.",
};

export const Default = {
  render: () => html`<dimui-keyed-list-benchmark></dimui-keyed-list-benchmark>`,
};
