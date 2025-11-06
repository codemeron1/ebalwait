import { useEffect, useState } from "react";
import { Sprout } from "lucide-react";
import axios from "axios";

interface Rating {
  criterion: string;
  score: number | string;
}
interface FeedbackCardProps {
  date: string;
  rating: Rating[];
  average: number | string;
  remarks: string;
}
const apiUrl = import.meta.env.VITE_API_URL;

const FeedbackCard = ({ result }: { result: FeedbackCardProps }) => {
  return (
    <div className="bg-white dark:bg-background border border-gray-200 dark:border-gray-700 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <Sprout className="h-10 w-10 text-green-700 dark:text-green-400" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-primary tracking-wide">
            {result.date}
          </h3>
        </div>

        {/* Rating Summary */}
        <div className="space-y-4">
          <div className="flex justify-between items-center text-lg font-medium">
            <span className="text-gray-800 dark:text-primary">Average</span>
            <span className="text-green-700 dark:text-green-400 font-extrabold">
              {result.average}
            </span>
          </div>

          {/* Criterion Breakdown */}
          {result.rating ? (
            <>
              <div className="divide-y divide-gray-200 dark:divide-gray-700 rounded-md border border-gray-100 dark:border-gray-700 overflow-hidden">
                {Object.entries(result.rating).map(([criterion, score]) => (
                  <div
                    key={criterion}
                    className="flex justify-between items-center px-4 py-3 bg-gray-50 dark:bg-background hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-700 dark:text-primary">
                      {criterion}
                    </span>
                    <span className="text-base font-semibold text-gray-900 dark:text-primary">
                      {Number(score).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Remarks Section */}
              <div>
                <h4 className="text-sm font-semibold text-gray-800 dark:text-primary mb-2">
                  Additional Remarks
                </h4>

                <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-background p-4 space-y-3">
                  {result.remarks && result.remarks.length > 0 ? (
                    result.remarks.map((remark, index) => (
                      <p
                        key={`remark-${index}-${result.date.replace(/ /g, "")}`}
                        className="text-gray-700 dark:text-primary text-sm italic leading-relaxed"
                      >
                        • {remark}
                      </p>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic">
                      No additional remarks provided.
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-yellow-300 bg-yellow-50 dark:bg-yellow-900 p-4">
              <p className="text-yellow-800 dark:text-yellow-300 text-sm italic">
                No evaluation result found — you may have been absent or marked
                uncooperative.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Result = () => {
  const [evaluationResults, setEvaluationResults] = useState<
    FeedbackCardProps[] | null
  >(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadResults = () => {
    const token = localStorage.getItem("authToken");
    setIsLoading(true);
    axios
      .get(`${apiUrl}/result/load`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("result: ", response.data);
        setEvaluationResults(response.data.averagesByDate || []);
      })
      .catch((error) => {
        console.error("App error on loadResults(): ", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadResults();
  }, []);

  return (
    <div className="min-h-screen bg-background p-2 md:p-6 pb-20">
      <div className="max-w-3xl mx-auto">
        {/* Results content */}
        <div className="space-y-6 p-2">
          {isLoading ? (
            <div className="text-center py-20">
              <p className="text-gray-500">Loading results...</p>
            </div>
          ) : (
            <>
              {evaluationResults ? (
                Object.entries(evaluationResults).map(([date, result]) => (
                  <FeedbackCard key={date.replace(/ /g, "")} result={result} />
                ))
              ) : (
                // Message for when no results are found
                <div className="text-center bg-background rounded-lg shadow-sm p-12">
                  <h3 className="text-lg font-medium text-gray-900">
                    No Results Found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    There are no ratings available for you yet.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Result;
