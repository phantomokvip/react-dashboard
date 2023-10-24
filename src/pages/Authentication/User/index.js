import React, { useState, useEffect } from "react";
import {
	message,
	Button,
	Form,
	Space,
	Tooltip,
	Tag,
	Image,
	Layout,
	Modal
} from "antd";
import { utils, writeFile } from 'xlsx';
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import moment from "moment";

import FormSearch from "./Components/FormSearch";
import ModalForm from "./Components/ModalForm";
import DataTable from "../../../Components/Common/DataTable";
import ModalImportExcel from "./Components/ModalImportExcel";
import {
	deleteUser,
	getPagingUser,
	getAllUser,
	insertUser,
	updateUser,
	deleteManyUser,
	getUserManagementPage,
	deleteImage,
	deleteCV,
	uploadImage,
	uploadCV
} from "../../../helpers/helper";
import avatar from "../../../assets/images/avartar.png";
import { extractManyId } from "../../../common/function";

const { Content } = Layout;
const { confirm } = Modal;

const UserStatus = [
	{ value: 0, label: "Đã bị khóa" },
	{ value: 1, label: "Chưa có bộ phận" },
	{ value: 2, label: "Đang thử việc" },
	{ value: 3, label: "Đã chính thức" }
];

const Employee = () => {

	document.title = "Quản lý nhân viên";
	const [form] = Form.useForm();
	const [treeDataDepartmentValue, setTreeDataDepartmentValue] = useState();
	const [treeDataDepartment, setTreeDataDepartment] = useState([]);

	const [formSearch] = Form.useForm();
	const [listUser, setListUser] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [listStatus, setListStatus] = useState([]);
	const [listRole, setListRole] = useState([]);
	const [listDepartment, setListDepartment] = useState([]);
	const [titleModal, setTitleModal] = useState('');
	const [showModalImport, setShowModalImport] = useState(false);
	const [isLoadingExportExcel, setIsLoadingExportExcel] = useState(false);

	//pagination
	const [totalPage, setTotalPage] = useState(1);
	const [indexPage, setPageIndex] = useState(1);
	const [loading, setLoading] = useState(true);
	const [pageSize, setPageSize] = useState(10);

	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const [loadingDeleteRows, setLoadingDeleteRows] = useState(false);
	const [imageDeletes, setImageDeletes] = useState([]);
	const [cvDeletes, setCvDeletes] = useState([]);
	const [currentUploadCV, setCurrentUploadCV] = useState(null);
	const [currentUploadAvatar, setCurrentUploadAvatar] = useState(null);

	const getAllData = async (_prams) => {
		try {
			const params = _prams
				? _prams
				: {
					pageIndex: indexPage,
					pageSize: pageSize,
					search: ""
				};
			const dataRes = await getPagingUser(params);

			if (!dataRes) {
				message.error(`Bạn không có quyền lấy tất cả thông tin hoạt động!`);
				return false;
			}
			setTotalPage(dataRes.totalPages);
			const data = convertDataTable(dataRes.data);

			return data.length ? data : false;
		} catch (error) {
			message.error(`Bạn không có quyền lấy tất cả thông tin hoạt động!`);
			setTotalPage(0);
			return [];
		}
	};

	const convertCompanies = (dataArray) => {
		try {
			const data =
				dataArray.length > 0 &&
				dataArray.map((company) => {
					return {
						title: company?.companyName,
						value: `company_${company._id}`,
						key: `company_${company._id}`,
						children: company?.departments?.map((department) => {
							return {
								title: department?.departmentName,
								value: `department_${department._id}_company_${company._id}`,
								key: `department_${department._id}_company_${company._id}`,
								children: department?.groups?.map((group) => {
									return {
										title: group?.groupName,
										value: `group_${group._id}_department_${department._id}_company_${company._id}`,
										key: `group_${group._id}_department_${department._id}_company_${company._id}`,
									}
								})
							}
						})
					}
				})
			return dataArray ? data : [];
		} catch (error) {
			return false;
		}
	};


	const convertDataTable = (dataArray) => {
		let data =
			dataArray.length > 0 &&
			dataArray.map((item) => {
				return {
					key: item._id,
					username: item.username,
					fullName: item.fullName,
					email: item.email,
					phoneNumber: item.phoneNumber,
					roleName: item.role?.roleName,
					roleId: item.role?._id,
					companyName: item.company?.companyName,
					departmentName: item.department?.departmentName,
					groupName: item.group?.groupName,
					companyId: item.company?._id,
					departmentId: item.department?._id,
					groupId: item.group?._id,
					status: item.status,
					avatar: item.avatar,
					cv: item.cv,
					createdTime: moment(new Date(item.createdTime)).format("DD/MM/YYYY"),
				};
			});
		data = data ? data.filter((item) => item?.roleName !== 'SuperAdmin') : false
		return dataArray ? data : [];
	}
	useEffect(() => {
		setLoading(true);
		async function fetchData() {
			try {
				const data = await getUserManagementPage();

				setTotalPage(data.dataPage?.totalPages);

				const dataShowTable = convertDataTable(data.dataPage?.data);
				setListUser(dataShowTable);

				const resListRole = data.allRoles ? data.allRoles?.filter((item) => item.roleName !== "SuperAdmin") : []
				setListRole(resListRole);

				const dataResDepartment = convertCompanies(data.allCompanies || []);
				setListDepartment(dataResDepartment);
				setTreeDataDepartment(dataResDepartment)

				setListStatus(UserStatus);
				setLoading(false);
			} catch (error) {
				console.log(error);

				setListUser([]);
				setListRole([]);
				setListDepartment([]);
				setTreeDataDepartment([]);
				message.error('Bạn không có quyền truy cập đến tất cả vai trò!')
				setLoading(false);
			}
		}
		fetchData();
	}, []);

	const handleSearch = async () => {
		const dataForm = formSearch.getFieldsValue();
		if (!Object.values(dataForm).some((item) => !!item)) {
			return
		}

		const params = {
			pageIndex: 1,
			pageSize: pageSize,
			...getFormSearch()
		}
		const dataRes = await getAllData(params, 1);
		setListUser(dataRes.length > 0 ? dataRes : false);
		setPageIndex(1);
	};

	const handleRefresh = async () => {
		const _params = {
			pageIndex: 1,
			pageSize: 10,
			search: ""
		}
		const dataRes = await getAllData(_params, indexPage);
		setListUser(dataRes.length > 0 ? dataRes : listUser);
		setPageIndex(1);
		formSearch.resetFields();
	}
	const handleNewEmployee = async () => {
		setShowModal(true);
		setTitleModal('Tạo nhân viên');
	}

	const handleClodeModal = async () => {
		setShowModal(false)
	}
	const handleSubmitForm = async (data) => {
		if (data.department) {
			const ids = extractManyId(data.department)
			data.group = ids.group
			data.department = ids.department
			data.company = ids.company
		}
		try {
			if (data.fullName) {
				data.fullName = data.fullName.trim()
			}
			if (data.avatar && data.avatar.includes('http')) {
				let avatar = data.avatar
				data.avatar = avatar.substring(avatar.lastIndexOf('/') + 1, avatar.length)
			}
			if (!data.id) {
				if (currentUploadAvatar) {
					const formData = new FormData();
					formData.append("image", currentUploadAvatar);
					const responseImage = await uploadImage(formData);
					const { imageName } = responseImage.data;
					data.avatar = imageName
				}
				if (currentUploadCV) {
					const formData = new FormData();
					formData.append("username", data.username);
					formData.append("cv", currentUploadCV);
					const resUpload = await uploadCV(formData);
					const { fileName } = resUpload.data;
					data.cv = fileName
				}
				const dataRes = await insertUser(data);
				if (dataRes.status === 1) {
					message.success(`Tạo nhân viên thành công.`);
				} else if (dataRes.status === 0) {
					message.error('Nhân viên đã tồn tại.')
				} else {
					if (dataRes.data.code)
						message.error(`Thêm nhân viên thất bại. Nhân viên này đã tồn tại.`)
					else if (dataRes.data.errors)
						message.error(`Thêm nhân viên thất bại. Bạn vui lòng nhập đầy đủ thông tin nhân viên.`)
					else
						message.error(`Thêm nhân viên thất bại.`)
				}
				handleRefresh();
			} else {
				const user = listUser.find(user => user.key === data.id);
				if (!data.department) {
					data.group = null;
					data.department = null;
					data.company = null;
				}
				if (!data.password) {
					delete data["password"]
				}
				if (currentUploadAvatar && data.avatar !== user.avatar) {
					const formData = new FormData();
					formData.append("image", currentUploadAvatar);
					const responseImage = await uploadImage(formData);
					const { imageName } = responseImage.data;
					data.avatar = imageName
					if (user.avatar) {
						await deleteImage(user.avatar);
					}
				} else if (data.avatar === "") {
					if (user.avatar) {
						await deleteImage(user.avatar);
					}
				}
				if (currentUploadCV && data.cv !== user.cv) {
					const formData = new FormData();
					formData.append("username", user.username);
					formData.append("cv", currentUploadCV);
					const resUpload = await uploadCV(formData);
					const { fileName } = resUpload.data;
					data.cv = fileName
					if (user.cv) {
						await deleteImage(user.cv);
					}
				} else if (data.cv === "") {
					if (user.cv) {
						await deleteImage(user.cv);
					}
				}
				if (checkChangeUpdate(data, user)) return
				const dataRes = await updateUser(data.id, data);
				dataRes.status === 1
					? message.success(`Cập nhật nhân viên thành công.`)
					: message.error(`Cập nhật nhân viên không thành công.`);

				for (const imageName of imageDeletes) {
					await deleteImage(imageName);
				}
				for (const nameCv of cvDeletes) {
					await deleteCV(nameCv);
				}
				handleRefreshData();
			}
			setCurrentUploadCV(null);
			setCurrentUploadAvatar(null);

			setShowModal(false);
		} catch (error) {
			message.error('Bạn không có quyền cập nhật nhân viên!');
			setShowModal(false);
		}
	}

	const checkChangeUpdate = (data, dataOrigin) => {
		const dataArray = {
			id: dataOrigin.key,
			username: dataOrigin.username,
			fullName: dataOrigin.fullName,
			department: dataOrigin.departmentId || null,
			role: dataOrigin.roleId,
			email: dataOrigin.email,
			phoneNumber: dataOrigin.phoneNumber,
			status: dataOrigin.status,
			avatar: dataOrigin.avatar,
			cv: dataOrigin.cv,
			group: dataOrigin.groupId || null,
			company: dataOrigin.companyId || null
		}
		if (JSON.stringify(data) === JSON.stringify(dataArray)) {
			message.success(`Cập nhật nhân viên thành công.`)
			setShowModal(false);
			return true
		}
		return false
	}

	const columns = [
		{
			title: "Hình ảnh",
			dataIndex: "",
			fixed: 'left',
			render: (_, record) => {
				return <Image
					className="rounded-circle"
					height={60}
					width={60}
					preview={false}
					src={`${process.env.REACT_APP_API_URL}/uploads/images/${record.avatar}`}
					fallback={avatar}
				/>
			}
		},
		{
			title: "Tên đăng nhập",
			dataIndex: "username",
		},
		{
			title: "Họ tên",
			dataIndex: "fullName",
			key: 'name',
		},
		{
			title: "Số điện thoại",
			dataIndex: "phoneNumber",
		},
		{
			title: "Email",
			dataIndex: "email",
			key: 'email',
		},
		{
			title: "Công ty",
			dataIndex: "companyName",
		},
		{
			title: "Bộ phận",
			dataIndex: "departmentName",
		},
		{
			title: "Tổ",
			dataIndex: "groupName",
		},
		{
			title: "Vai trò",
			dataIndex: "roleName",
		},
		{
			title: "Thời gian tạo",
			dataIndex: "createdTime",
		},
		{
			title: "CV",
			dataIndex: "cv",
			render: (cv, record) => {
				if (cv) {
					return <a href={`${process.env.REACT_APP_API_URL}/uploads/cv/${cv}`} target="_blank" rel="noreferrer">CV_{record.username}</a>
				} else
					return ''
			}
		},
		{
			title: "Trạng thái hoạt động",
			dataIndex: "status",
			render: (_, record) => {
				if (record.status === 0) {
					return <Tag color={'rgb(90,90,90)'} style={{ borderRadius: '5px' }}>Đã bị khóa</Tag>;
				} else if (record.status === 1) {
					return <Tag color={'rgb(128, 0, 0)'} style={{ borderRadius: '5px' }} >Chưa có bộ phận</Tag>;
				} else if (record.status === 2) {
					return <Tag color={'rgb(0, 61, 245)'} style={{ borderRadius: '5px' }}>Đang thử việc</Tag>;
				} else if (record.status === 3) {
					return <Tag color={'rgb(37, 211, 102)'} style={{ borderRadius: '5px' }}>Đã chính thức</Tag>;
				}
			},
		},
		{
			title: "Hành động",
			dataIndex: "",
			render: (_, record) =>
				listUser.length >= 1 ? (
					<Space>
						<Tooltip title="Sửa">
							<Button
								type="primary"
								shape="circle"
								icon={<EditOutlined />}
								size="small"
								onClick={() => onEdit(record.key)}
							/>
						</Tooltip>
						<Tooltip title="Xóa">
							<Button
								type="danger"
								shape="circle"
								icon={<DeleteOutlined />}
								size="small"
								onClick={() => showModalConfirmDelete(record.key)}
							/>
						</Tooltip>
					</Space>
				) : null,
		},
	];

	const onEdit = (key) => {
		const dataEdit = listUser.filter((item) => item.key === key);
		const dataRole = listRole.filter(
			(item) => item.roleName === dataEdit[0].roleName
		);
		setShowModal(true);
		const extractId = (groupId, departmentId, companyId) => {
			if (companyId) {
				let id
				if (departmentId) {
					if (groupId) {
						id = `group_${groupId}_department_${departmentId}_company_${companyId}`
					} else {
						id = `department_${departmentId}_company_${companyId}`
					}
				} else {
					id = `company_${companyId}`
				}
				return id
			}

		}

		form.setFieldsValue({
			id: dataEdit[0].key,
			username: dataEdit[0].username,
			fullName: dataEdit[0].fullName,
			phoneNumber: dataEdit[0].phoneNumber,
			email: dataEdit[0].email,
			status: dataEdit[0].status,
			roleName: dataRole.length ? dataRole[0].roleName : '',
			role: dataRole.length ? dataRole[0]._id : undefined,
			department: listDepartment.length ? extractId(dataEdit[0].groupId, dataEdit[0].departmentId, dataEdit[0].companyId) : undefined,
			avatar: dataEdit[0].avatar ? `${process.env.REACT_APP_API_URL}/uploads/images/${dataEdit[0].avatar}` : "",
			cv: dataEdit[0].cv
		});
		setTitleModal('Sửa nhân viên');
		setCvDeletes([]);
		setImageDeletes([]);
	};

	const showModalConfirmDelete = (record) => {
		confirm({
			title: 'Bạn có chắc chắn xóa nhân viên này?',
			icon: <ExclamationCircleFilled />,
			content: 'Bạn có chắc chắn xóa nhân viên này?',
			okText: 'Xóa',
			okType: 'danger',
			cancelText: 'Không',
			onOk() {
				onDelete(record);
			},
			onCancel() { },
		});

	};

	const onPageChange = (page, page_size) => {
		setPageIndex(page);
		setPageSize(page_size);
		onPageChangeAtSearch(page, page_size);
	}

	const onPageChangeAtSearch = async (indexPage, page_size) => {
		setLoading(true);

		const params = {
			pageIndex: indexPage,
			pageSize: page_size,
			...getFormSearch()
		};
		const dataRes = await getAllData(params, indexPage);
		setListUser(dataRes.length > 0 ? dataRes : false);
		setLoading(false)
	}
	const getFormSearch = () => {
		const dataForm = formSearch.getFieldsValue();
		const ids = extractManyId(dataForm.department);
		return {
			username: dataForm.username || "",
			email: dataForm.email || "",
			phoneNumber: dataForm.phoneNumber || "",
			role: dataForm.roleName || "",
			fullName: dataForm.fullName || "",
			createdTime: dataForm.createdTime || "",
			company: ids.company || "",
			department: ids.department || "",
			group: ids.group || "",
			status: dataForm.status || ""
		}
	}
	const handleRefreshData = async (index_page) => {
		const _params = {
			pageIndex: index_page ? index_page : indexPage,
			pageSize: pageSize,
			...getFormSearch()
		}
		const dataRes = await getAllData(_params);
		setListUser(dataRes);
		setPageIndex(index_page ? index_page : indexPage);
	}
	const handleRefreshDataDelete = async (countRemove) => {
		const indexPageNew = listUser.length == countRemove ? (indexPage === 1 ? 1 : indexPage - 1) : indexPage;
		handleRefreshData(indexPageNew);
	}
	const onDelete = async (key) => {
		try {
			const dataRes = await deleteUser(key);

			if (dataRes.status === 1) {
				message.success(`Xóa nhân viên thành công.`)
				handleRefreshDataDelete(1);
			} else {
				message.error(`Xóa nhân viên thất bại.`);
			}

		} catch (error) {
			message.error('Bạn không có quyền xóa nhân viên!');
		}
	};

	const handleExportExcel = async () => {
		try {
			setIsLoadingExportExcel(true);
			const fileExtension = ".xlsx";
			const fileName = 'nhan-vien';
			const headings = [[
				'STT',
				'Họ tên',
				'Tên đăng nhập',
				'Công ty',
				'Bộ phận',
				'Tổ',
				'Email',
				'Số điện thoại',
				'Vai trò',
				'Trạng thái',
				'Trạng thái (1: Còn làm việc, 2: Đã nghỉ việc)'
			]];

			const dataUserAll = await getAllUser();
			const dataUser = dataUserAll.map((item, index) => ({
				"stt": index + 1,
				"fullname": item.fullName ? item.fullName : '',
				"username": item.username,
				"company": item.company ? item.company.companyName : '',
				"department": item.department ? item.department.departmentName : '',
				"group": item.group ? item.group.groupName : '',
				"email": item.email,
				"phone": item.phoneNumber,
				"role": item.role ? item.role.roleName : '',
				"status": item.status
			}))
			const wb = utils.book_new();
			const ws = utils.json_to_sheet([]);
			utils.sheet_add_aoa(ws, headings);
			utils.sheet_add_json(ws, dataUser, { origin: 'A2', skipHeader: true });
			utils.book_append_sheet(wb, ws, 'nhan-vien');
			await writeFile(wb, fileName + fileExtension);
			setIsLoadingExportExcel(false);
		} catch (error) {
			message.error('Bạn không có quyền xuất file!')
		}
	}

	const handleImportExcel = async () => {
		setShowModalImport(true);
	}
	const handleClodeModalImport = async () => {
		setShowModalImport(false);
	}
	const onTreeSelectChange = (newValue) => {
		setTreeDataDepartmentValue(newValue);
	};

	const treeDataDepartmentProps = {
		treeData: treeDataDepartment,
		value: treeDataDepartmentValue,
		onChange: onTreeSelectChange,
	};
	const treeDataDepartmentSearchProps = {
		treeData: treeDataDepartment,
	};

	const handleDeleteSelectRows = async () => {
		confirm({
			title: `Bạn có chắc chắn xóa ${selectedRowKeys.length} nhân viên đã chọn?`,
			icon: <ExclamationCircleFilled />,
			okText: 'Xóa',
			okType: 'danger',
			cancelText: 'Không',
			onOk() {
				OnDeleteSelectRows();
			},
			onCancel() { },
		});
	}

	const OnDeleteSelectRows = async () => {
		try {
			setLoadingDeleteRows(true);
			const dataRes = await deleteManyUser({ data: { ids: selectedRowKeys } });
			if (dataRes.status === 200) {
				message.success(`Xóa ${dataRes.data.deletedCount} nhân viên thành công!`)
				handleRefreshDataDelete(dataRes.data.deletedCount);
			} else {
				message.error(`Xóa nhân viên không thành công!`);
			}

			setSelectedRowKeys([]);
			setLoadingDeleteRows(false);

		} catch (error) {
			message.error('Bạn không có quyền xóa nhân viên!');
			setLoadingDeleteRows(false);
		}
	};

	return (
		<>
			<div className="page-content">
				<Content >
					<FormSearch
						formSearch={formSearch}
						handleSearch={handleSearch}
						handleRefresh={handleRefresh}
						handleNewEmployee={handleNewEmployee}
						listRole={listRole}
						listDepartment={listDepartment}
						handleExportExcel={handleExportExcel}
						handleImportExcel={handleImportExcel}
						treeSelectProps={treeDataDepartmentSearchProps}
						isLoadingExportExcel={isLoadingExportExcel}
						loadingDeleteRows={loadingDeleteRows}
						selectedRowKeys={selectedRowKeys}
						handleDeleteSelectRows={handleDeleteSelectRows}
						userStatus={UserStatus}
					/>

					<DataTable
						listData={listUser}
						pageSize={pageSize}
						columns={columns}
						indexPage={indexPage}
						totalPage={totalPage}
						onPageChange={onPageChange}
						loading={loading}
						selectedRowKeys={selectedRowKeys}
						setSelectedRowKeys={setSelectedRowKeys}
					/>
					<ModalForm
						titleModal={titleModal}
						form={form}
						handleSubmitForm={handleSubmitForm}
						showModal={showModal}
						handleClodeModal={handleClodeModal}
						listRole={listRole}
						listStatus={listStatus}
						listDepartment={listDepartment}
						treeSelectProps={treeDataDepartmentProps}
						setImageDeletes={setImageDeletes}
						setCvDeletes={setCvDeletes}
						setCurrentUploadAvatar={((value) => setCurrentUploadAvatar(value))}
						setCurrentUploadCV={((value) => setCurrentUploadCV(value))}
					/>
					<ModalImportExcel
						showModalImport={showModalImport}
						handleClodeModalImport={handleClodeModalImport}
						listRole={listRole}
						listDepartment={listDepartment}
						handleRefresh={handleRefresh}
					/>

				</Content>
			</div>
		</>
	);
};
export default Employee;