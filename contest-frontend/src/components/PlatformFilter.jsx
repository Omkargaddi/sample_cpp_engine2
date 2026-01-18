const PLATFORMS = [
  { label: "All", value: null },
  { label: "CF", value: "CODEFORCES" },
  { label: "CC", value: "CODECHEF" },
  { label: "AT", value: "ATCODER" },
  { label: "LC", value: "LEETCODE" }
];

export default function PlatformFilter({ active, onChange }) {
  return (
    <div className="flex gap-2 mb-6">
      {PLATFORMS.map(p => (
        <button
          key={p.label}
          onClick={() => onChange(p.value)}
          className={`px-3 py-1 rounded border ${
            active === p.value
              ? "bg-blue-600 text-white"
              : "bg-white"
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
