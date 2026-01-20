import {CloudText} from "./CloudText.tsx";

export function Done(p: {filename: string}) {

    return (
        <CloudText>
            You're all set! You can download your file at <a href={`https://clifile.onrender.com/${p.filename}`}></a>
        </CloudText>
    );
}