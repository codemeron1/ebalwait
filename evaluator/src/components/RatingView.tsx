import React from 'react'

const RatingView = () => {
  // Common Tailwind classes for inputs, selects, and textareas
  const inputStyles = "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";
  const labelStyles = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Rating View</h2>
        
        <form className="space-y-6">
          
          {/* Steps 1, 2, & 3: Group, Secret, Week */}
          <fieldset className="space-y-4">
            <div>
              <label htmlFor="group" className={labelStyles}>
                1. Select your group
              </label>
              <select id="group" name="group" className={inputStyles}>
                <option>Select a group...</option>
                <option>Group Alpha</option>
                <option>Group Bravo</option>
                <option>Group Charlie</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="secret" className={labelStyles}>
                2. Enter group secret code
              </label>
              <input 
                type="password" 
                id="secret" 
                name="secret" 
                className={inputStyles} 
                placeholder="••••••••" 
              />
            </div>

            <div>
              <label htmlFor="week" className={labelStyles}>
                3. Select week
              </label>
              <select id="week" name="week" className={inputStyles}>
                <option>Select a week...</option>
                <option>Week 1 (Oct 20-26)</option>
                <option>Week 2 (Oct 27-Nov 2)</option>
                <option>Week 3 (Nov 3-9)</option>
              </select>
            </div>
          </fieldset>

          <hr className="border-gray-200" />

          {/* Steps 4 & 5: Roles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="your-role" className={labelStyles}>
                4. Select your role
              </label>
              <select id="your-role" name="your-role" className={inputStyles}>
                <option>Select your role...</option>
                <option>Developer</option>
                <option>Designer</option>
                <option>Project Manager</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="ratee" className={labelStyles}>
                5. Select team member to rate
              </label>
              <select id="ratee" name="ratee" className={inputStyles}>
                <option>Select a member...</option>
                <option>Alex Johnson</option>
                <option>Maria Garcia</option>
                <option>Sam Lee</option>
              </select>
            </div>
          </div>

          {/* Step 6: Rating Sheet */}
          <fieldset className="border border-gray-300 p-4 rounded-md">
            <legend className="text-lg font-medium text-gray-900 px-2">
              6. Rating Sheet
            </legend>
            <div className="space-y-5 mt-2">
              
              {/* Example Rating Criteria 1 */}
              <div>
                <label className="block text-sm font-medium text-gray-700">A. Communication</label>
                <p className="text-xs text-gray-500 mb-2">Rates the team member's clarity and effectiveness in communication.</p>
                <div className="flex items-center justify-between max-w-sm">
                  <span className="text-sm text-gray-500">Poor</span>
                  <div className="flex space-x-3">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <label key={`comm-${value}`} className="flex flex-col items-center cursor-pointer">
                        <input type="radio" name="communication" value={value} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300" />
                        <span className="text-xs mt-1">{value}</span>
                      </label>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">Excellent</span>
                </div>
              </div>
              
              {/* Example Rating Criteria 2 */}
              <div>
                <label className="block text-sm font-medium text-gray-700">B. Teamwork & Collaboration</label>
                <p className="text-xs text-gray-500 mb-2">Contributes positively to the group dynamic and helps others.</p>
                <div className="flex items-center justify-between max-w-sm">
                  <span className="text-sm text-gray-500">Poor</span>
                  <div className="flex space-x-3">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <label key={`team-${value}`} className="flex flex-col items-center cursor-pointer">
                        <input type="radio" name="teamwork" value={value} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300" />
                        <span className="text-xs mt-1">{value}</span>
                      </label>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">Excellent</span>
                </div>
              </div>

              {/* Additional Remarks */}
              <div>
                <label htmlFor="remarks" className={labelStyles}>
                  Additional Remarks
                </label>
                <textarea 
                  id="remarks" 
                  name="remarks" 
                  rows="4" 
                  className={inputStyles} 
                  placeholder="Provide specific, constructive feedback..."
                ></textarea>
              </div>
            </div>
          </fieldset>

          {/* Step 7: Save Button */}
          <div>
            <button 
              type="submit" 
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              7. Save Rating
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default RatingView;