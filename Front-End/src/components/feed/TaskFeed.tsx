import {useEffect, useState} from 'react';
import TaskFeedSimple from "./TaskFeedSimple.tsx";
import {axiosInstance} from "../../apis/lib/axios.ts";
import {useUserStore} from "../../stores/useUserStore.ts";
import {useParams} from "react-router-dom";

interface Feed {
    feedId: number;
    contentsCode: number;
    contentsId: number;
    memberImgUrl: string;
    feedContent: string;
}

const TaskFeed = () => {
    const {profile} = useUserStore();
    const memberId = profile?.id;
    const projectId = useParams();
    const [feeds, setFeeds] = useState([]);

    const getTaskFeed = async () => {
        console.log(projectId)
        try {
            const respons = await axiosInstance.get("/feeds", {
                params: {
                    memberId: memberId,
                    projectId: projectId.projectId
                }
            })

            setFeeds(respons.data.data);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        getTaskFeed()
    }, []);

    return (
        <div className='flex flex-col h-full'>
            <div className="p-8 w-full mt-10 flex-grow overflow-y-auto">
                {feeds.map((feed, index) => (
                    <div className="flex flex-col" key={feed.feedId}>
                        <TaskFeedSimple
                            feedId={feed.feedId}
                            contentsCode={feed.contentsCode}
                            contentsId={feed.contentsId}
                            memberImgUrl={feed.memberImgUrl}
                            feedContent={feed.feedContent}
                            index={index}
                        />
                    </div>
                ))}
            </div>

        </div>
    );
};

export default TaskFeed;
