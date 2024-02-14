/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, ChangeEvent, useEffect } from 'react';
import TechStackChange, { techStack } from '../../../components/techstack/TechStackChange';
import Position, { position } from '../../../components/position/PositionChange';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from "../../../apis/lib/axios";
import { useRequireAuth } from '../../../hooks/useRequireAuth';
import {useUserStore} from '../../../stores/useUserStore';


interface State {
  projectTitle: string;
  projectContent: string;
  projectImage: string | null;
  projectPeriodNum: number;
  projectPeriodUnit: string;
}

interface TechList{
  id : number;
  name: string;
}
interface PositionList{
  id : number;
  name: string;
  total: number;
  current:number;
}

const ProjectSettingPage: React.FC = () => {
  useRequireAuth();
  const [techLists, setTechLists] = useState<TechList[]>([]); // 상태 추가
  const [positionLists, setPositionLists] = useState<PositionList[]>([]); // 상태 추가
  const { projectId } = useParams<{ projectId: string }>();
  const { profile } = useUserStore();
  const memberId=profile?.id;
  const navigate = useNavigate();
  const [state, setState] = useState<State>({
    projectTitle: '',
    projectContent: '',
    projectImage: null,
    projectPeriodNum: 0,
    projectPeriodUnit: '주',
  });
  const [isModalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    getData();
    return () => {
    };
  }, []);

  const getData = async () => {
    try {
      const response = await axiosInstance.get(`/projects/${projectId}/${memberId}`);
      const data = response.data.data;
      const techLists: TechList[] = data.techCodes.map((techCode: { id: number; detailName: string }) => ({
        id: techCode.id,
        name: techCode.detailName,
      }));
      setTechLists(techLists);
      const positionLists: PositionList[] = data.projectTotals.map((item: { jobCode: { id: any; detailDescription: any; }; total: any; current: any; }) => ({
        id: item.jobCode.id, // jobCode 객체 내의 id 속성
        name: item.jobCode.detailDescription, // jobCode 객체 내의 detailDescription 속성
        total: item.total, // 각 요소의 total 속성
        current: item.current // 각 요소의 current 속성
      }));
      setPositionLists(positionLists);
      console.log(positionLists)
      console.log(data);
      console.log(data.projectTotals)
      const projectPeriodNum = data.period;
      const projectPeriodUnit = '주'; // Default to weeks, adjust as needed
      
      // Update the form state with fetched data
      setState({
        projectTitle: data.title || '',
        projectContent: data.content || '',
        projectImage: data.image || null, // Adjust the key based on actual response
        projectPeriodNum: projectPeriodNum,
        projectPeriodUnit: projectPeriodUnit,
        // Include additional fields as necessary
      });
  
  
    } catch (error) {
      console.error("Failed to fetch project data:", error);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'projectPeriodNum') {
      setState((prev) => ({
        ...prev,
        projectPeriodNum: parseInt(value, 10) || 0,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setState((prev) => ({
        ...prev,
        projectImage: imageUrl,
      }));
    }
  };

  const handleSave = async () => {
    const { projectTitle, projectContent } = state;

    if (projectTitle === '') {
      alert('제목을 입력해주세요.');
      return;
    } else if (projectContent === '') {
      alert('본문을 입력해주세요.');
      return;
    } else if (position.totalList.length === 0) {
      alert('한 개 이상의 포지션을 입력해주세요.');
      return;
    } else {
      let periodCal;
      if (state.projectPeriodUnit === '달') {
        periodCal = state.projectPeriodNum * 4;
      } else {
        periodCal = state.projectPeriodNum;
      }

      const projectData = {
        title: projectTitle,
        content: projectContent,
        period: periodCal,
        totechList: [...techStack.mystack], // 객체 복사
        totalList: position.totalList,
      };
      console.log(projectData);

      const projectDataString = JSON.stringify(projectData);
      const form = new FormData();
      form.set('patch', new Blob([projectDataString],{type: 'application/json'}));
      if (state.projectImage !== null) {
        form.set('file', state.projectImage);
      }
      console.log(projectDataString);
      console.log('FormData entries:');
      for (const pair of form.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
      console.log(memberId);
      try {
        const response = await axiosInstance.patch(`/projects/${projectId}/${memberId}`, form, {
          headers: {
            'Content-Type': undefined, 
          },
        });
        console.log("Response:", response);
        setModalVisible(true);
      } catch (error) {
        console.error("Post failed:", error);
      }
    }
  };
  const closeModal = () => {
    // Close the modal
    setModalVisible(false);
    navigate('../');
    window.scrollTo({ top: 0 });
  };

  return (
    <div className='w-full h-lvh grid place-items-center overflow-y-scroll'>
      <div className='bg-sub-color w-full h-20 justify-center flex items-center font-bold text-4xl'>
        프로젝트 수정
      </div>
      <div className='w-9/12 h-auto p-16 m-5 shadow-2xl rounded-2xl'>
        <div>
          <label htmlFor='projectTitle' className='font-bold text-3xl my-3'>
            프로젝트 제목
          </label>
          <hr className='my-3 border-main-color border-1' />
          <div>
            <input
              type='text'
              id='projectTitle'
              name='projectTitle'
              className='w-full h-10 mb-10'
              value={state.projectTitle}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className='my-3'>
          <label htmlFor='projectContent' className='font-bold text-3xl '>
            프로젝트 내용
          </label>
          <hr className='my-3 border-main-color border-1' />
          <div>
            <textarea
              id='projectContent'
              name='projectContent'
              className='w-full h-40 mb-10'
              value={state.projectContent}
              onChange={handleInputChange}
            />
          </div>

          <TechStackChange initialTags={techLists} />

          <div className='my-3'>
          <label className='font-bold text-3xl'>
              프로젝트 이미지 업로드
            </label>
            <hr className='my-3 border-main-color border-1' />
            <div>
              <input
                type='file'
                id='projectImage'
                name='projectImage'
                accept='image/*'
                onChange={handleImageChange}
                className='w-max mt-2 mb-10'
              />
              {state.projectImage && typeof state.projectImage === 'object' ? (
                <img src={URL.createObjectURL(state.projectImage)} alt='Uploaded' className='mt-2 max-h-40' />
              ) : null}
            </div>
          </div>

          <div className='my-3'>
            <label htmlFor='projectPeriod' className='font-bold text-3xl my-3'>
              프로젝트 기간
            </label>
            <hr className='my-3 border-main-color border-1' />
            <div>
              <input
                type='text'
                id='projectPeriodNum'
                name='projectPeriodNum'
                className='w-10 h-10 p-1 mb-2'
                placeholder='기간'
                onChange={handleInputChange}
              />
              주
              {state.projectPeriodNum > 52 && (
                <div className='text-red-500'>프로젝트 기간은 52주를 초과할 수 없습니다.</div>
              )}
            </div>
          </div>

          <Position initialTags={positionLists}/>
        </div>
        <button onClick={handleSave} className='mt-5 bg-main-color text-white p-3'>
          저장
        </button>

        {isModalVisible && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
            <div className='bg-white p-8'>
              <p>저장되었습니다!</p>
              <button onClick={closeModal}>닫기</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectSettingPage;

