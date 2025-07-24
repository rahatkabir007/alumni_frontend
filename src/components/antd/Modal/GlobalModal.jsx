"use-client";

import React from "react";
import { Modal } from "antd";
import TitleHeader from "@/components/shared/Common/TitleHeader";
import Image from "next/image";
import { images } from "@/constants";
import "@/styles/antd.css";

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
    closeIcon = images.close,
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
                bodyStyle={bodyStyle}
                footer={footer}
                className="font-poppins relative z-[10000000] ant-modal-content"
                maskClosable={mask}
                destroyOnClose={destroyOnClose}
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
                                <Image
                                    src={closeIcon}
                                    alt="close_icon"
                                    onClick={handleCancel}
                                />
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
