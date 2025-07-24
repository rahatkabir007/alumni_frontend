"use client"
import { Popover, Menu, Button } from 'antd'
import { MoreOutlined } from '@ant-design/icons'
import '@/styles/antd.css'

const ActionPopover = ({
    menuItems = [],
    trigger = "click",
    placement = "bottomRight",
    disabled = false,
    buttonClassName = "hover:bg-gray-100",
    menuClassName = "user-action-menu",
    ...popoverProps
}) => {
    if (!menuItems || menuItems.length === 0) {
        return null
    }

    const menu = { items: menuItems }

    return (
        <Popover
            content={<Menu {...menu} className={menuClassName} />}
            arrow={false}
            trigger={trigger}
            placement={placement}
            {...popoverProps}
        >
            <Button
                type="text"
                icon={<MoreOutlined />}
                size="small"
                className={buttonClassName}
                disabled={disabled}
            />
        </Popover>
    )
}

export default ActionPopover
