import React, { useState } from 'react'
// We'll use icons from heroicons for a polished look
import { StarIcon, UserCircleIcon } from '@heroicons/react/24/solid'

// --- Mock Data ---
// In a real app, you'd fetch this data from an API based on the logged-in user.
const mockResults = [
  {
    id: 1,
    week: "Week 1 (Oct 20-26)",
    ratings: [
      { criterion: "Communication", score: 4 },
      { criterion: "Teamwork & Collaboration", score: 5 },
      { criterion: "Quality of Work", score: 4 },
    ],
    remarks: "Really stepped up this week. Communication was clear and the collaboration on the main feature was excellent. Keep it up!"
  },
  {
    id: 2,
    week: "Week 1 (Oct 20-26)",
    ratings: [
      { criterion: "Communication", score: 3 },
      { criterion: "Teamwork & Collaboration", score: 4 },
      { criterion: "Quality of Work", score: 3 },
    ],
    remarks: "Good effort. Would be great to see more proactive updates in the group chat rather than just during stand-up."
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


/**
 * A component to render a 5-star rating display.
 */
const StarRating = ({ score }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon 
          key={star}
          className={`h-6 w-6 ${star <= score ? 'text-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  )
}

/**
 * A component to display a single anonymous feedback card.
 */
const FeedbackCard = ({ result }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="p-6">
        {/* 1. Anonymous Evaluator Header */}
        <div className="flex items-center space-x-3 mb-6">
          <UserCircleIcon className="h-10 w-10 text-gray-400" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Anonymous Feedback
            </h3>
            <p className="text-sm text-gray-500">From a Team Member</p>
          </div>
        </div>

        {/* 2. Ratings */}
        <div className="space-y-4">
          {result.ratings.map((rating) => (
            <div key={rating.criterion} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{rating.criterion}</span>
              <StarRating score={rating.score} />
            </div>
          ))}
        </div>

        {/* 3. Remarks */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-800 mb-2">Additional Remarks:</h4>
          <blockquote className="p-4 bg-gray-50 border-l-4 border-gray-300 rounded-r-md">
            <p className="text-gray-700 italic">
              {result.remarks ? result.remarks : "No additional remarks provided."}
            </p>
          </blockquote>
        </div>
      </div>
    </div>
  )
}


const ResultsView = () => {
  // State to manage the selected week
  const [selectedWeek, setSelectedWeek] = useState("Week 1 (Oct 20-26)");

  // Filter results based on the selected week
  const filteredResults = mockResults.filter(r => r.week === selectedWeek);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">Your Rating Results</h2>

        {/* Week Selector */}
        <div className="mb-6">
          <label htmlFor="week" className="block text-sm font-medium text-gray-700 mb-1">
            View results for:
          </label>
          <select 
            id="week" 
            name="week" 
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            className="block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option>Week 1 (Oct 20-26)</option>
            <option>Week 2 (Oct 27-Nov 2)</option>
            <option>Week 3 (Nov 3-9)</option>
          </select>
        </div>

        {/* Results content */}
        <div className="space-y-6">
          {filteredResults.length > 0 ? (
            filteredResults.map((result) => (
              <FeedbackCard key={result.id} result={result} />
            ))
          ) : (
            // Message for when no results are found
            <div className="text-center bg-white rounded-lg shadow-sm p-12">
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

export default ResultsView;