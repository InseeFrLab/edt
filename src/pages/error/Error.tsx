import { makeStylesEdt } from "lunatic-edt";

interface ErrorPageProps {
    notemptyinterface?: string;
}

const ErrorPage = (props: ErrorPageProps) => {
    const { notemptyinterface } = props;
    const { classes } = useStyles();
    //TODO : check new maquettes
    return (
        <>
            <h1>ERREUR</h1>
        </>
    );
};

const useStyles = makeStylesEdt({ "name": { ErrorPage } })(() => ({}));

export default ErrorPage;
