import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { api } from "../services/api";

export default function ContestList({ platform }) {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const url = platform
      ? `/contests/upcoming?platform=${platform}`
      : `/contests/upcoming`;

    api.get(url)
      .then(res => setContests(res.data))
      .finally(() => setLoading(false));
  }, [platform]);

  if (loading) return <p>Loading contests…</p>;

  return (
    <div className="space-y-4">
      {contests.map(c => (
        <div
          key={c._id}
          className="p-4 border rounded flex justify-between items-center"
        >
          <div>
            <h3 className="font-semibold">
              [{c.platform}] {c.name}
            </h3>
            <p className="text-sm text-gray-600">
              {dayjs(c.startTime).format("DD MMM YYYY, hh:mm A")}
              {" · "}
              {c.durationMinutes} mins
            </p>
          </div>

          <a
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            Open
          </a>
        </div>
      ))}
    </div>
  );
}
