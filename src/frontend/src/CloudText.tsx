import {ChildrenType} from "./ChildrenType.ts";

export function CloudText({children, className = ""}: ChildrenType & {className?: string},) {
    return (
        <div className={`text-9xl font-bold dongle-regular cloud-font text-center ${className}`}>{children}</div>
    );
}