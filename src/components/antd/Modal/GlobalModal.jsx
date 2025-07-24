"use-client";

import { Modal } from "antd";
import Image from "next/image";
import "@/styles/antd.css";
import { CloseOutlined } from "@ant-design/icons";

const GlobalModal = ({
    isModalOpen,
    setModalHandler = () => { },
    children,
    width = 670,
    bodyStyle = null,
    footer = null,
    title = "Title",
    controller = true,
    centered = true,
    mask = true,
    destroyOnClose = false,
    closeIcon = false,
    modalContainerClassName,
    titleClassName,
    titleContentClassName,
    onClose,
}) => {
    const handleCancel = () => {
        if (controller) {
            setModalHandler("");
        } else {
            setModalHandler(false);
        }
        if (onClose) onClose();
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
                style={{ zoom: "80%" }}
            >
                <div
                    className={` mb-3 ${title || (closeIcon && "flex flex-col gap-5")}`}
                >
                    <div
                        className={`border border-transparent rounded-t-[10px] flex justify-between items-center bg-foundation-blue-normal px-6 py-[22px] ${titleContentClassName}`}
                    >
                        {title && (
                            <div

                                className={`text-[24px] font-medium text-foundation-white-light ${titleClassName} font-inter_i`}
                            >{title}</div>
                        )}
                        {closeIcon && (
                            <div className="cursor-pointer">
                                <CloseOutlined />
                            </div>
                        )}
                    </div>
                    <div className={`${modalContainerClassName}`}>{children}</div>
                </div>
            </Modal>
        </>
    );
};

export default GlobalModal;
