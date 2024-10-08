import { Radio as RadioMaterial } from "@mui/material";

export type RadioProps = {
    id?: string;
    value?: string;
    disabled?: boolean;
};
const Radio = (props: RadioProps) => {
    const { id, value, disabled } = props;

    return <RadioMaterial id={id} value={value} disabled={disabled}></RadioMaterial>;
};

export default Radio;
