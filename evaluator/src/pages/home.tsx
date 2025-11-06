import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Sprout, Users } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const apiUrl = import.meta.env.VITE_API_URL;


const PendingEvaluationCard = ({
  evaluationData,
  isDataLoading,
}: {
  evaluationData: any[];
  isDataLoading: boolean;
}) => {
  return (
    <div className="border rounded-lg p-6 shadow-sm bg-card">
      <div className="flex items-center gap-2 mb-4">
        <Sprout className="h-5 w-5 text-primary" />
        <h3 className="text-sm font-medium uppercase tracking-wider">
          Pending Evaluation
        </h3>
      </div>
      {isDataLoading ? (
        <div className="flex flex-row">
          <Spinner />
        </div>
      ) : (
        <>
          {!evaluationData || evaluationData.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia>
                  <Sprout className="h-12 w-12 text-muted-foreground" />
                </EmptyMedia>
                <EmptyTitle>No Pending Evaluations</EmptyTitle>
                <EmptyDescription>
                  You don't have any pending evaluations at the moment.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Refresh
                </Button>
              </EmptyContent>
            </Empty>
          ) : (
            <div className="space-y-3">
              {evaluationData.map((evaluation, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-md bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold">
                      {evaluation.date || "Evaluation"}
                    </p>
                    <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                      Pending
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>
                      {evaluation?.pendingRateesCount} member(s) to evaluate
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
const EvaluationResultSummaryCard = ({
  evaluationSummaryData,
  isDataLoading,
}: {
  evaluationSummaryData: any[];
  isDataLoading: boolean;
}) => {
  return (
    <div className="border rounded-lg p-6 shadow-sm bg-card">
      <div className="flex items-center gap-2 mb-4">
        <Sprout className="h-5 w-5 text-primary" />
        <h3 className="text-sm font-medium uppercase tracking-wider">
          Evaluation Summary
        </h3>
      </div>
      {isDataLoading ? (
        <div className="flex flex-row">
          <Spinner />
        </div>
      ) : (
        <>
          {Object.keys(evaluationSummaryData).length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia>
                  <Sprout className="h-12 w-12 text-muted-foreground" />
                </EmptyMedia>
                <EmptyTitle>No Evaluation Result</EmptyTitle>
                <EmptyDescription>
                  No evaluation data available yet.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(evaluationSummaryData)?.map(([key, result]) => {
                  return (
                    <div className="p-4 border rounded-md bg-muted/50">
                      <p className="text-xs text-muted-foreground">
                        {result?.date}
                      </p>
                      <p className="text-2xl font-bold mt-1">
                        {Number(result.average).toFixed(2) || "-"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
const TeamMembersCard = ({
  teamMembersData,
  isDataLoading,
}: {
  teamMembersData: any[];
  isDataLoading: boolean;
}) => {
  const roles = useRef([
    "Team Manager",
    "Lead Programmer",
    "API Tester",
    "Documentation Specialist",
    "API Programmer",
  ]);
  //create a card to show team members with sprout icon
  return (
    <div className="border rounded-lg p-6 shadow-sm bg-card">
      <div className="flex items-center gap-2 mb-4">
        <Sprout className="h-5 w-5 text-primary" />
        <h3 className="text-sm font-medium uppercase tracking-wider">
          Team Members
        </h3>
      </div>
      {isDataLoading ? (
        <div className="flex flex-row">
          <Spinner />
        </div>
      ) : !teamMembersData || teamMembersData.length === 0 ? (
        <p className="text-sm text-muted-foreground">No team members found</p>
      ) : (
        <div className="space-y-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {teamMembersData.map((member, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-between py-2 border"
            >
              <span className="text-sm font-medium">{`${member.first_name} ${member.last_name}`}</span>
              <span className="text-xs text-muted-foreground">
                {roles.current[Number(member.role) - 1]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Home = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [pendingEvaluations, setPendingEvaluations] = useState([]);
  const [evaluationSummary, setEvaluationSummary] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadInitialData = () => {
    const token = localStorage.getItem("authToken");
    setIsLoading(true);
    axios
      .get(`${apiUrl}/home/load-data`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setTeamMembers(response.data?.teamMembers || null);
        setPendingEvaluations(response.data?.pendingEvaluations || null);
        setEvaluationSummary(response.data?.evaluationSummary || null);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadInitialData();
  }, []);
  return (
    <div className="p-2 pb-20 md:p-5 md:pb-20">
      <div className="grid gap-6 md:grid-cols-2 mb-4">
        <PendingEvaluationCard
          evaluationData={pendingEvaluations}
          isDataLoading={isLoading}
        />
        <EvaluationResultSummaryCard
          evaluationSummaryData={evaluationSummary}
          isDataLoading={isLoading}
        />
      </div>
      <TeamMembersCard
        teamMembersData={teamMembers}
        isDataLoading={isLoading}
      />
    </div>
  );
};

export default Home;
