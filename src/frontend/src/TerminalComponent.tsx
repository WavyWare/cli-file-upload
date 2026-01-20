import {ChildrenType} from "./ChildrenType.ts";
import {useEffect, useRef, useState} from "react";

export function TerminalComponent({children, title = "TERMINAL"}: ChildrenType & {title? :string}) {
    const ref = useRef<HTMLHeadingElement>(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (!ref.current) return;
        setHeight(ref.current.offsetHeight);
    }, []);

    return (
        <div
            className={`mx-auto w-[60%] dongle-regular terminal flex flex-col`}
            ref={ref}
            style={{ borderRadius: `${height*0.15}px`, border: `${Math.ceil(height*0.03)}px solid white` }}
        >
            <div className="flex flex-row h-[25%] w-full justify-between">
                <div></div>
                <span className={"capitalize dongle-regular text-accent text-2xl"}>{title}</span>
                <div></div>
            </div>

            <div className={"w-full h-full flex justify-center items-center md:text-xl font-monospace"}>
                <span className={"text-secondary pr-1"}>~/ </span>
                <span className={"text-primary"}>{children}</span>
            </div>
        </div>
    )

}