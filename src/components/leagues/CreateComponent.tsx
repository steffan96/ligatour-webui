import React from "react";
import Button from "../shared/Button";

export default function CreateComponent({title, description}: {title: string; description: string}) {
    return (
        <div className="ml-4 flex flex-row justify-between items-start w-[80%]">
            <div className="mb-2">
                <h1 className="text-lg font-semibold">{title}</h1>
                <p className="text-sm opacity-70">{description}</p>
            </div>
            <Button text={`+ Create ${title}`} className="mt-4 ml-4 rounded-md" onClick={() => {
                // TODO: Implement create functionality
            }} />
        </div>
    );
}
