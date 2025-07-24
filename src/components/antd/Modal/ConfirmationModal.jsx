"use-client";

import { Modal } from "antd";
import "@/styles/antd.css";
import BlackButton from "@/components/common/BlackButton";

const ConfirmationModal = ({
    isModalOpen,
    setModalHandler = () => { },
    width = 670,
    bodyStyle = null,
    footer = null,
    title = "Do you want to delete this?",
    controller = true,
    centered = true,
    mask = true,
    destroyOnClose = false,
    modalContainerClassName,
    buttonContainerClassName,
    titleClassName,
    onClose,
    closeIcon = false,
    cancelButtonTitle = "Cancel",
    cancelButtonClassName = "bg-gray-300 text-black px-4 py-2 rounded",
    onCancel = () => { },
    confirmButtonTitle = "Confirm",
    confirmButtonClassName = "bg-blue-500 text-white px-4 py-2 rounded",
    onConfirm = () => { },
    loading = false,
}) => {
    const handleCancel = () => {
        if (controller) {
            setModalHandler("");
        } else {
            setModalHandler(false);
        }
        if (onClose) onClose();
        if (onCancel) onCancel();
    };

    return (
        <>
            <Modal
                open={isModalOpen}
                onCancel={handleCancel}
                centered={centered}
                width={width}
                styles={{
                    body: bodyStyle,
                }}
                footer={footer}
                className="font-poppins relative z-[10000000] ant-modal-content"
                maskClosable={mask}
                destroyOnHidden={destroyOnClose}
                closeIcon={false}
            >
                <div
                    className={`mb-3 ${title || (closeIcon && "flex flex-col gap-5")}`}
                >
                    <div className={`${modalContainerClassName} flex flex-col gap-10 py-2 px-6`}>
                        <span className="text-xl">{title}</span>
                        <div className={`${buttonContainerClassName} flex items-center justify-end gap-4 `}>

                            {
                                !loading && <BlackButton
                                    className={`${cancelButtonClassName} !text-sm font-medium `}
                                    onClick={handleCancel}
                                >
                                    {cancelButtonTitle}
                                </BlackButton>
                            }
                            <BlackButton
                                className={`${confirmButtonClassName} !text-sm font-medium `}
                                onClick={onConfirm}
                                loading={loading}
                            >
                                {confirmButtonTitle}
                            </BlackButton>
                        </div>
                    </div>

                </div>
            </Modal>
        </>
    );
};

export default ConfirmationModal;