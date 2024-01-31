import { USER_ROLE } from 'src/lib/utils/constant';
import {
    UploadOutlined,
    UserOutlined,
    EditOutlined,
    EnterOutlined,
    VideoCameraOutlined,
    RiseOutlined,
    UnorderedListOutlined,
    OrderedListOutlined,
    FormatPainterFilled,
    CarryOutOutlined,
    ContainerFilled,
    SnippetsOutlined,
    DollarOutlined
} from '@ant-design/icons';
import FormItem from 'antd/es/form/FormItem';

export function getDashBoardPaths(role) {
    let routesUploader = [
        { url: '/app/profile', name: 'Profile', icon: <UserOutlined /> },
        {
            url: '/app/manage-questions',
            name: 'Questions',
            icon: <EditOutlined />,
            children: [
                {
                    url: '/app/manage-questions/list',
                    name: 'List',
                    icon: <OrderedListOutlined />
                },
                {
                    url: '/app/manage-questions/create',
                    name: 'Create',
                    icon: <FormatPainterFilled />
                },
                {
                    url: '/app/manage-questions/edit',
                    name: 'Edit',
                    icon: <EditOutlined />
                },
                {
                    url: '/app/manage-questions/status',
                    name: 'Status',
                    icon: <CarryOutOutlined />,
                }
            ],
        },
        {
            url: '/app/manage-courses/',
            name: 'Courses',
            icon: <SnippetsOutlined />,
        }

    ]
    let routesReviewer = [
        ...routesUploader
    ]
    let routesTeacher = [
        ...routesReviewer,
        // { url: '/app/manage-students', name: 'Students', icon: <VideoCameraOutlined /> },
        { url: '/app/manage-package', name: 'Packages', icon: <DollarOutlined /> },
        // { url: '/app/manage-backoffice', name: 'Backoffice', icon: <UploadOutlined /> },
    ]
    let routesStudent = [
        { url: '/app/profile', name: 'Profile', icon: <UserOutlined /> },
        {
            url: '/app/tests', name: 'Tests', icon: <ContainerFilled />,
            children: [
                {
                    url: '/app/tests/list',
                    name: 'List',
                    icon: <UnorderedListOutlined /> ,
                },
                {
                    url: '/app/tests/history',
                    name: 'Records',
                    icon: <RiseOutlined />,
                }
            ]
        },
        { url: '/app/pricing', name: 'Pricing', icon: <DollarOutlined /> },
        {
            url: '/app/courses/',
            name: 'Courses',
            icon: <SnippetsOutlined />,
        }
    ]
    let routesParent = [
        ...routesStudent,
    ]
    switch (role) {
        case USER_ROLE.ADMIN:
            return [
                ...routesTeacher,
                ...routesStudent
            ];
        case USER_ROLE.TEACHER:
            return [
                ...routesTeacher
            ];
        case USER_ROLE.BACKOFFICEREVIEWER:
            return [
                ...routesReviewer
            ];
        case USER_ROLE.BACKOFFICEUPLOADER:
            return [
                ...routesUploader
            ];
        case USER_ROLE.PARENT:
            return [
                ...routesParent

            ];
        case USER_ROLE.STUDENT:
            return [
                ...routesStudent
            ];
        default:
            return [
                { url: '/app/not-found', name: 'Not Found', icon: <EnterOutlined /> },
            ];
    }
}

