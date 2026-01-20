import {CloudText} from "./CloudText.tsx";
import {TerminalComponent} from "./TerminalComponent.tsx";
import {CTAText} from "./CTAText.tsx";

export function MainPage() {
    return (
        <div className={"flex flex-col pt-3 container md:mx-auto"}>
            <CloudText>CLI File Upload</CloudText>
            <TerminalComponent>curl -T file.txt clifile.onrender.com/</TerminalComponent>
            <CTAText />
        </div>
    )
}