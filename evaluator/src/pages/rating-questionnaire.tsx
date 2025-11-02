import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const RatingQuestionnaire = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const location = useLocation();
    const navigate = useNavigate();
    const [data] = useState<any>(location.state?.questionnaire || null);
    const [memberData] = useState<any>(location.state?.ratee || null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const roles = useRef(['Team Manager', 'Lead Programmer',
        'API Tester', 'Documentation Specialist', 'API Programmer']);
    const [evaluationData, setEvaluationData] = useState<any>({
        rateeId: memberData.id,
        classDateId: location.state?.classDateId || null,
        evaluatorId: location.state?.evaluatorId
    });

    const handleSubmit = (e: React.FormEvent<HTMLElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        axios.post(`${apiUrl}/evaluate/result/save`, evaluationData).then((response) => {
            const data = response.data;
            alert(data?.message || "Evaluation submitted successfully!");
            navigate('/rate', { replace: true });
        }).catch((error) => {
            console.error("Error submitting evaluation:", error);
        }).finally(() => {
            setIsSubmitting(false);
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            {
                memberData ?
                    <div className="flex flex-col py-4 mb-4 bg-linear-to-r from-blue-50 to-indigo-50 
                        rounded-lg p-4 border border-blue-100 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-600 
                                rounded-full flex items-center justify-center shadow-lg">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-bold text-xl text-slate-800">{`${memberData.first_name} ${memberData.last_name}`}</p>
                                <p className="font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full text-xs inline-block mt-0.5">{`${roles.current[memberData.role]}`}</p>
                            </div>
                        </div>
                    </div>
                    : <></>
            }
            <ol className="list-none space-y-4">
                {
                    data?.map((item: any, index: number) => {
                        return (
                            <div className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200" key={item.documentId}>
                                <div className="p-4">
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className="shrink-0 w-7 h-7 bg-linear-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm">
                                            {index + 1}
                                        </div>
                                        <p className="font-semibold text-base text-slate-800 leading-snug">
                                            {item.text}
                                        </p>
                                    </div>
                                    <div className="flex flex-row flex-wrap gap-2 pl-10">
                                        <div className="flex flex-row items-center space-x-2 bg-green-50 hover:bg-green-100 rounded-md px-3 py-2 transition-colors duration-150 border border-green-200">
                                            <input type='radio' value='5'
                                                id={`rb5${item?.documentId}`}
                                                name={`rb${item?.documentId}`}
                                                className="cursor-pointer w-4 h-4 text-green-600 focus:ring-green-500"
                                                onClick={() => {
                                                    setEvaluationData({
                                                        ...evaluationData,
                                                        [item?.documentId]: 5
                                                    });
                                                }}
                                            />
                                            <label className="cursor-pointer font-medium text-green-700 select-none text-sm"
                                                htmlFor={`rb5${item?.documentId}`}>Excellent</label>
                                        </div>
                                        <div className="flex flex-row items-center space-x-2 bg-blue-50 hover:bg-blue-100 rounded-md px-3 py-2 transition-colors duration-150 border border-blue-200">
                                            <input type='radio' value='4'
                                                className="cursor-pointer w-4 h-4 text-blue-600 focus:ring-blue-500"
                                                id={`rb4${item?.documentId}`}
                                                name={`rb${item?.documentId}`}
                                                onClick={() => {
                                                    setEvaluationData({
                                                        ...evaluationData,
                                                        [item?.documentId]: 4
                                                    });
                                                }} />
                                            <label className="cursor-pointer font-medium text-blue-700 select-none text-sm"
                                                htmlFor={`rb4${item?.documentId}`}>Very Good</label>
                                        </div>
                                        <div className="flex flex-row items-center space-x-2 bg-yellow-50 hover:bg-yellow-100 rounded-md px-3 py-2 transition-colors duration-150 border border-yellow-200">
                                            <input type='radio' value='3'
                                                id={`rb3${item?.documentId}`}
                                                name={`rb${item?.documentId}`}
                                                className="cursor-pointer w-4 h-4 text-yellow-600 focus:ring-yellow-500"
                                                onClick={() => {
                                                    setEvaluationData({
                                                        ...evaluationData,
                                                        [item?.documentId]: 3
                                                    });
                                                }} />
                                            <label className="cursor-pointer font-medium text-yellow-700 select-none text-sm"
                                                htmlFor={`rb3${item?.documentId}`}>Satisfactory</label>
                                        </div>
                                        <div className="flex flex-row items-center space-x-2 bg-orange-50 hover:bg-orange-100 rounded-md px-3 py-2 transition-colors duration-150 border border-orange-200">
                                            <input type='radio' value='2'
                                                id={`rb2${item?.documentId}`}
                                                name={`rb${item?.documentId}`}
                                                className="cursor-pointer w-4 h-4 text-orange-600 focus:ring-orange-500"
                                                onClick={() => {
                                                    setEvaluationData({
                                                        ...evaluationData,
                                                        [item?.documentId]: 2
                                                    });
                                                }}
                                                required />
                                            <label className="cursor-pointer font-medium text-orange-700 select-none text-sm"
                                                htmlFor={`rb2${item?.documentId}`}>Needs Improvement</label>
                                        </div>
                                        <div className="flex flex-row items-center space-x-2 bg-red-50 hover:bg-red-100 rounded-md px-3 py-2 transition-colors duration-150 border border-red-200">
                                            <input type='radio' value='1'
                                                id={`rb1${item?.documentId}`}
                                                name={`rb${item?.documentId}`}
                                                className="cursor-pointer w-4 h-4 text-red-600 focus:ring-red-500"
                                                onClick={() => {
                                                    setEvaluationData({
                                                        ...evaluationData,
                                                        [item?.documentId]: 1
                                                    });
                                                }}
                                                required />
                                            <label className="cursor-pointer font-medium text-red-700 select-none text-sm"
                                                htmlFor={`rb1${item?.documentId}`}>Poor</label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        );
                    })
                }
            </ol>

            <div className="mt-6 flex justify-center">
                <Button
                    className="px-6 py-4! text-base font-semibold bg-linear-to-r from-blue-600 
                        to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg 
                        hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                    size={null}
                    variant="default"
                    type="submit"
                    disabled={isSubmitting}>
                    {
                        isSubmitting ? "Submitting..." : "Submit Evaluation"
                    }
                </Button>
            </div>
        </form>

    );
}

export default RatingQuestionnaire;