import { Sprout } from 'lucide-react';

// --- Mock Data ---
// In a real app, you'd fetch this data from an API based on the logged-in user.
const mockResults = [
  {
    id: 1,
    week: "Week 1 (Oct 20-26)",
    ratings: [
      { criterion: "Communication", score: 4 },
      { criterion: "Teamwork & Collaboration", score: 5 },
      { criterion: "Quality of Work", score: 4 }
    ],
    remarks: "Really stepped up this week. Communication was clear and the collaboration on the main feature was excellent. Keep it up!"
  },
  {
    id: 2,
    week: "Week 1 (Oct 20-26)",
    ratings: [],
    remarks: ""
  },
  {
    id: 3,
    week: "Week 2 (Oct 27-Nov 2)",
    ratings: [
      { criterion: "Communication", score: 5 },
      { criterion: "Teamwork & Collaboration", score: 5 },
      { criterion: "Quality of Work", score: 5 },
    ],
    remarks: "Perfect performance this week. A pleasure to work with."
  }
];
// --- End Mock Data ---

interface Rating {
  criterion: string,
  score: number | string
}
interface FeedbackCardProps {
  id: string | number,
  week: string,
  ratings: Rating[],
  remarks: string
}

/**
 * A component to display a single anonymous feedback card.
 */
const FeedbackCard = ({ result } : {result: FeedbackCardProps}) => {
  const computeAverage = (ratings: Rating[]): Number => {

    if (!Array.isArray(ratings) || ratings?.length == 0) return 65.00

    const length = ratings?.length;
    let average = 0;
    ratings?.map((rating) => {
      average += Number(rating.score);
    })
    average /= length;
    return Number(Number(average).toFixed(2));
  }
  return (
    <div className="bg-background border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Sprout className="h-10 w-10 text-green-700 dark:text-green-400" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-primary">
              October 27, 2025
            </h3>
          </div>
        </div>

        {/* 2. Ratings */}
        <div className="space-x-4 flex flex-col justify-center w-full flex-wrap">
          <div className='flex flex-row justify-between space-x-2 text-lg'>
            <p>Average:</p>
            <p  className='font-bold'>{computeAverage(result.ratings).toString()}</p>
          </div>
          {
            result.ratings?.length > 0 ?
              <>
                {
                  result.ratings.map((rating) => (
                    <div key={rating.criterion} className="flex flex-row items-center justify-between">
                      <span className="text-sm font-normal tracking-wider text-gray-700 dark:text-primary">
                        {rating.criterion}
                      </span>
                      <div className='text-base font-bold'> {Number(rating.score).toFixed(2)} </div>
                    </div>
                  ))
                }

                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-800 dark:text-primary mb-2">Additional Remarks:</h4>
                  <blockquote className="p-4 bg-gray-50 dark:bg-background border-l-4 border-gray-300 rounded-r-md">
                    <p className="text-gray-700 text-justify dark:text-primary italic">
                      {result.remarks ? result.remarks : "No additional remarks provided."}
                    </p>
                  </blockquote>
                </div>
              </>
              :
              <div className="mt-6">
                <blockquote className="p-4 bg-gray-50 dark:bg-background border-l-4 border-gray-300 rounded-r-md">
                  <p className="text-gray-700 dark:text-primary italic">
                    No evaluation result found. It's either you're absent or the team manager found you uncooperative during the activity.
                  </p>
                </blockquote>
              </div>
          }
        </div>


      </div>
    </div >
  )
}


const Result = () => {

  return (
    <div className="min-h-screen bg-background p-2 md:p-6 pb-20">
      <div className="max-w-3xl mx-auto">

        {/* Results content */}
        <div className="space-y-6 p-2">
          {mockResults.length > 0 ? (
            mockResults.map((result) => (
              <FeedbackCard key={result.id} result={result} />
            ))
          ) : (
            // Message for when no results are found
            <div className="text-center bg-background rounded-lg shadow-sm p-12">
              <h3 className="text-lg font-medium text-gray-900">No Results Found</h3>
              <p className="mt-1 text-sm text-gray-500">
                There are no ratings available for you for the selected week.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Result;