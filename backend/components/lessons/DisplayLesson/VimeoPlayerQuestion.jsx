import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CustomModal } from "src/components/sharing/CustomModal";
import { MODAL_ROUTE_MESSAGE } from "src/lib/utils/constant";
import { selectLessonMap, selectModalState } from "src/redux/services/lesson";
import Vimeo from '@u-wave/react-vimeo';
import { returnNullIfIsEmptyString } from "src/lib/utils/isEmpty";
import { ConfigProvider, Modal, message } from "antd";
import { selectCurrentQuestion, setCurrentQuestion } from "src/redux/services/exam";
import videoModalThemeConfig from "src/lib/VideoModalThemeConfig";

export const VimeoPlayerQuestion = () => {
  const closeModal = () => {
    setIsPaused(true);
    setSrc('');
    setIsOpenModal(false);
    dispatch(setCurrentQuestion(null))
  }
  const dispatch = useDispatch();
  const modalState = useSelector(selectModalState);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [src, setSrc] = useState('');
  const currentQuestion = useSelector(selectCurrentQuestion);
  useEffect(() => {

    if (modalState == MODAL_ROUTE_MESSAGE.LESSON_VIDEO_MODAL) {

      let currentUrl = returnNullIfIsEmptyString(currentQuestion?.explanation?.videoUrl);
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
  }, [modalState, currentQuestion?.id]);
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
          <Vimeo
            width={`${(window?.innerWidth / 2)}px`}
            height={`${window?.innerHeight - 100}px`}
            video={src}
            autoplay
            paused={isPaused}
            autopause={true}
          />
        </Modal >
      </ConfigProvider >
    </>
  );
};