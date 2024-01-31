
import { Divider, Typography } from 'antd';
import {
  Button,
  Select,
  Modal
} from 'antd';
const { Title, Text } = Typography;
import {
  LeftCircleOutlined,
  FormatPainterOutlined,
  PlusCircleOutlined
} from '@ant-design/icons'
import DrivePickerExcel from 'src/components/questions/UploadQuestions/DrivePickerExcel';
import DrawerLayout from '../../DrawerLayout';
import ViewModule from 'src/components/questions/DisplayQuestion/ViewModule';
import ViewQuestion from 'src/components/questions/DisplayQuestion/ViewQuestion';
import { FormAdd } from 'src/components/questions/UploadQuestions/FormAdd';
import useCreateQuestion from 'src/lib/hooks/useCreateQuestion';
import { DISPLAY_STATE } from 'src/lib/hooks/useCreateQuestion';


export default function CreateQuestionPage() {
  const {
    moduleId,
    handleModuleId,
    examOptions,
    examId,
    isOpenModal, setIsOpenModal,
    questionRef,
    handleChange,
  } = useCreateQuestion();

  return (
    <DrawerLayout>
      <main
      >
        <section>
          <div>
            <div className='w-100 min-h-100vh' style={{ paddingLeft: "25px" }}>
              <>
                <br /> <br />
                <Divider orientation='left'>
                  <Title level={2}>
                    <FormatPainterOutlined />
                    &nbsp;
                    Create Questions
                  </Title>
                </Divider>
                <br />
                <div>
                  <Text>Exam</Text>
                  &nbsp; &nbsp;
                  <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="Choose your exam"
                    optionFilterProp="children"
                    onChange={handleChange}
                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                    filterSort={(optionA, optionB) =>
                      (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }
                    defaultValue={examId ?? null}
                    options={examOptions}
                  />
                </div>
                <br />
                <div className='w-100'>
                  <DrivePickerExcel
                  />
                </div>
              </>

              <>
                <br ref={questionRef} />
                <Divider orientation='left'>
                  <Title level={5}
                  >
                    Choose module by clicking on the card
                  </Title>
                </Divider>
                <br />
                <ViewModule
                  setModuleId={handleModuleId}
                  editModalInitFunction={() => {
                    setIsOpenModal(true)
                  }}
                />
                <Modal
                  title={
                    moduleId > -1 ?
                      `Add question for module ID ${moduleId}`
                      :
                      'Create question for new module'
                  }
                  centered
                  open={isOpenModal}
                  onOk={() => setIsOpenModal(false)}
                  onCancel={() => setIsOpenModal(false)}
                  width={1000}
                  okButtonProps={{ style: { display: "none" } }}
                >
                  <FormAdd
                    moduleId={moduleId}
                    setIsOpenModal={setIsOpenModal}
                  />
                </Modal>
                <br />
                <Divider orientation='left'>
                  <Title level={5}>
                    Add Question to module #{moduleId} by clicking the ( <PlusCircleOutlined /> ) icon
                  </Title>
                </Divider>
                <ViewQuestion
                  setIsOpenModal={setIsOpenModal}
                />
              </>
            </div>
          </div>
        </section>
      </main>
    </DrawerLayout>
  )
}