"use client"
import ConfirmationModal from '@/components/antd/Modal/ConfirmationModal'

const UserManagementModal = ({ confirmModal, onConfirm, onClose }) => {
    const { type, user, open, loading } = confirmModal

    const getModalProps = () => {
        const baseProps = {
            isModalOpen: open,
            setModalHandler: onClose,
            onConfirm,
            loading,
            centered: true,
            width: 500,
        }

        switch (type) {
            case 'delete':
                return {
                    ...baseProps,
                    title: `Delete ${user?.name || 'User'}?`,
                    confirmButtonTitle: 'Delete',
                    confirmButtonClassName: 'bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700',
                }
            case 'block':
                return {
                    ...baseProps,
                    title: `Block ${user?.name || 'User'}?`,
                    confirmButtonTitle: 'Block',
                    confirmButtonClassName: 'bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700',
                }
            case 'unblock':
                return {
                    ...baseProps,
                    title: `Unblock ${user?.name || 'User'}?`,
                    confirmButtonTitle: 'Unblock',
                    confirmButtonClassName: 'bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700',
                }
            default:
                return baseProps
        }
    }

    return <ConfirmationModal {...getModalProps()} />
}

export default UserManagementModal
