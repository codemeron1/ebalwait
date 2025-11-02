import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Spinner } from "@/components/ui/spinner";
import { InfoIcon } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

import { useAuthenticatedUser } from '@/context/AuthenticatedUserContext';

interface MemberData {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
  role: number;
  evaluationStatus: boolean
}

interface QuestionnaireData {
  documentId: string;
  scaleMax: number;
  scaleMin: number;
  text: string;
  type: string;
}

interface HandleEvaluateProps {
  questionnaire: QuestionnaireData | null,
  ratee: MemberData | null,
  classDateId: string | null,
  evaluatorId: string | null | undefined
}

const apiUrl = import.meta.env.VITE_API_URL;

const Rating = () => {
  // const [userData, setUserData] = useState(null);
  const [members, setMembers] = useState<MemberData[]>([]);
  const [questionnaires, setQuestionnaires] = useState<any[]>([]);
  const [classDates, setClassDates] = useState<any[]>([]);
  const [selectedClassDateId, setSelectedClassDateId] = useState<string | null>(null);
  const roles = useRef(['Team Manager', 'Lead Programmer', 'API Tester', 'Documentation Specialist', 'API Programmer']);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

  const navigate = useNavigate();
  const authenticatedUser = useAuthenticatedUser();

  const loadClassDates = async () => {
    try {
      const token = localStorage.getItem('authToken');
      axios.get(`${apiUrl}/evaluate/class-dates`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(response => {
        setClassDates(response.data.classDates || []);
      }).catch(error => {
        console.error('Error fetching class dates:', error);
      });
    } catch (error) {
      console.error('Error in loadClassDates():', error);
    }
  }

  const handleSelectedDateChange = (selectedDate: string) => {
    if (selectedDate == '') { return; }

    setIsLoadingMembers(true);
    const token = localStorage.getItem('authToken');
    axios.get(`${apiUrl}/evaluate/ratees-load`, {
      params: {
        evaluateDate: selectedDate
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        const data = response.data;
        setMembers(data.membersToBeEvaluated || []);
        setQuestionnaires(data.criteria || []);
      })
      .catch(err => {
        console.error('Error fetching user data:', err);
      }).finally(() => {
        setIsLoadingMembers(false);
      });

  }

  const handleEvaluate = ({ questionnaire, ratee, classDateId, evaluatorId }: HandleEvaluateProps) => {
    navigate('/rate-questionnaire', {
      state: {
        questionnaire: questionnaire,
        ratee: ratee,
        classDateId: classDateId,
        evaluatorId: evaluatorId
      }
    });
  }

  useEffect(() => {
    const oldSelectedDate = localStorage.getItem('selectedClassDate');
    if (!oldSelectedDate || !['', 'null', 'undefine'].includes(oldSelectedDate)) {
      setSelectedClassDateId(oldSelectedDate);
    }
  }, [classDates]);

  useEffect(() => {
    let selectedDate = selectedClassDateId ? selectedClassDateId : '';
    localStorage.setItem('selectedClassDate', selectedDate);
    handleSelectedDateChange(selectedDate);
  }, [selectedClassDateId]);

  useEffect(() => {
    loadClassDates();
  }, []);

  return (
    <>
      <div className='mb-4'>
        <label htmlFor="cboDates"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Select class date
        </label>
        <select id="cboDates"
          className="w-full bg-background border border-gray-300 text-gray-900 text-sm 
              rounded-lg dark:text-primary
            focus:ring-blue-500 focus:border-blue-500 p-2.5 cursor-pointer"
          onChange={(e) => setSelectedClassDateId(e.target.value)}
          value={String(selectedClassDateId)}>
          <option value='' disabled selected>Select Class Date</option>
          {
            classDates.map((data, index) => (
              <option key={`cboDate${index}`} value={data?.documentId}>{data?.date}</option>
            ))
          }
        </select>
      </div>

      {
        isLoadingMembers && members?.length != null ?
          <div className="text-center mt-8 flex justify-center">
            <Spinner />
          </div>
          :
          selectedClassDateId ?
            <Table>
              <TableCaption>Team members that you can evaluate.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Last Name</TableHead>
                  <TableHead>First Name</TableHead>
                  <TableHead>Middle Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className='overflow-x-auto'>
                {members.map((member: MemberData) => (
                  <TableRow key={`mtbe${member?.id}`}>
                    <TableCell className="font-medium">{member?.last_name}</TableCell>
                    <TableCell>{member?.first_name}</TableCell>
                    <TableCell>{member?.middle_name}</TableCell>
                    <TableCell>{roles.current[member?.role]}</TableCell>
                    <TableCell>
                      {
                        !(member?.evaluationStatus) ?
                          <Button
                            variant="outline"
                            className='select-none text-blue-600'
                            onClick={() => handleEvaluate({
                              questionnaire: questionnaires[member?.role],
                              ratee: member,
                              classDateId: selectedClassDateId,
                              evaluatorId: authenticatedUser?.id
                            })}> Evaluate </Button>
                          :
                          <Button
                            variant="outline"
                            className='select-none text-gray-600'
                            disabled={true}
                          > Done </Button>
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            :
            <Alert>
              <InfoIcon />
              <AlertTitle>Class date</AlertTitle>
              <AlertDescription>
                Please select a class date to view and rate members.
              </AlertDescription>
            </Alert>
      }


    </>
  )
}

export default Rating;