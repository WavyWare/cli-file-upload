import {useState} from "react";

export function FileUpload() {
    const [file, setFile] = useState<File | null>(null);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files || e.target.files.length === 0) return;
        setFile(e.target.files[0]);
        if (!file) return
    }

    async function handleUpload() {
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        await fetch("http://localhost:3000/", {
            method: "POST",
            body: formData
        }).then(res => res.json());


    }

    return (
        <div className={"flex flex-row justify-center items-center"}>
            <input type="file" onChange={handleChange} className={"terminal border-2 border-white rounded-lg px-2 dongle-regular w-[20%] text-xl m-2 text-white cursor-pointer transition border-secondary "}/>
            <button onClick={handleUpload} className={"border-2 rounded-xl h-full p-1 text-white border-white terminal cursor-pointer transition border-secondary"}>Send!</button>
        </div>
    );
}