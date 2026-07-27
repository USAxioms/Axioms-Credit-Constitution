interface Props {

    onAuthorize:
        () => void;

}



export default function LedgerAuthorization(
    {
        onAuthorize
    }: Props
) {


    return (

        <button
            onClick={
                onAuthorize
            }
        >

            Store Credit Pulse On Chain

        </button>

    );

}
