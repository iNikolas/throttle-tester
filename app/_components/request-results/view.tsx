"use client";

import { useUnit } from "effector-react";
import React from "react";
import { throttleTesterModel } from "@/stores/throttle-tester";

export function RequestResults() {
  const displayedResults = useUnit(throttleTesterModel.$results);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Request Results</h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Index</th>
              <th>Status</th>
              <th>Done Date</th>
            </tr>
          </thead>
          <tbody>
            {displayedResults.map((result) => (
              <tr
                key={result.index}
                className={`${
                  result.isSuccessful
                    ? "bg-success text-white"
                    : "bg-error text-white"
                }`}
              >
                <td className="text-center">{result.index}</td>
                <td className="text-center">
                  {result.isSuccessful ? "Successful" : "Failed"}
                </td>
                <td className="text-center">
                  {new Date(result.doneDate).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
