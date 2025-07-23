import React from 'react';
import { Switch } from 'antd';
import '@/styles/antd.css'

const CustomSwitch = ({ defaultChecked, onChange, disabled = false, style = {}, ...rest }) => {
    return (
        <Switch
            defaultChecked={defaultChecked}
            onChange={onChange}
            disabled={disabled}
            style={style}
            {...rest}
        />
    );
};

export default CustomSwitch;