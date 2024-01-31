import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CustomModal } from "src/components/sharing/CustomModal";
import { MODAL_ROUTE_MESSAGE } from "src/lib/utils/constant";
import { selectCurrentLesson, selectLessonMap, selectModalState } from "src/redux/services/lesson";
import Vimeo from '@u-wave/react-vimeo';


import { returnNullIfIsEmptyString } from "src/lib/utils/isEmpty";
import { ConfigProvider, Modal, message } from "antd";
import videoModalThemeConfig from "src/lib/VideoModalThemeConfig";

export const VimeoPlayerLesson = () => {
  const closeModal = () => {
    setIsPaused(true);
    setSrc('');
    setIsOpenModal(false);
  }
  const modalState = useSelector(selectModalState);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [src, setSrc] = useState('');
  const currentLesson = useSelector(selectCurrentLesson);
  useEffect(() => {
    if (modalState == MODAL_ROUTE_MESSAGE.LESSON_VIDEO_MODAL) {
      let currentUrl = returnNullIfIsEmptyString(currentLesson?.url);
      if (currentUrl) {
        let isCheck = currentUrl.includes('https://vimeo.com/');
        if (!isCheck) {
          setSrc('');
          setIsPaused(true);
          message.warning("This media doesn't start with 'https://vimeo.com/'!");
        }
        else {
          setSrc(currentUrl);
          setIsOpenModal(true);
        }
      }
    }
    else if (isOpenModal == true) {
      setIsOpenModal(false);
    }
  }, [modalState, currentLesson?.id]);
  return (
    <>
      <ConfigProvider
        theme={videoModalThemeConfig} >
        <Modal
          open={isOpenModal}
          okButtonProps={{ style: { display: "none" } }}
          cancelButtonProps={{ style: { display: "none" } }}
          style={{
            margin: "10px",
          }}
          maskClosable={true}
          width={`${((window?.innerWidth / 2) + 50)}px`}
          centered={true}
          isOpenModal={isOpenModal}
          onCancel={() => { closeModal() }}
          onOk={() => { closeModal() }}
        >
          {isOpenModal &&
            <Vimeo
              width={`${(window?.innerWidth / 2)}px`}
              height={`${window?.innerHeight - 100}px`}
              video={src}
              autoplay
              paused={isPaused}
              autopause={true}
            />
          }
        </Modal >
      </ConfigProvider>
    </>
  );
};