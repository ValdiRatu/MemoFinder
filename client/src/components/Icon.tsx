import * as icons from "react-bootstrap-icons";
import React from "react";
import { ButtonVariant } from "react-bootstrap/types";
import { Button } from "react-bootstrap";

interface IconProps extends icons.IconProps {
    variant?: ButtonVariant;
    iconName: keyof typeof icons;
    onClick?: () => void;
    buttonClassname?: string;
    active?: boolean;
}

export const Icon = ({ variant, iconName, onClick, buttonClassname, active = false, ...props }: IconProps) => {
    const BootstrapIcon = icons[iconName];
    return (
        <Button variant={variant} onClick={onClick} className={buttonClassname} active={active}>
            <BootstrapIcon {...props}/>
        </Button>
    );
}