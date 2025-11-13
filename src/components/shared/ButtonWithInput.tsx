import React from 'react';
import { createLeague } from '../../api/leagues';

export default function ButtonWithInput({ type }: { type: { id: number; label: string; key: string } }) {
    const [showInput, setShowInput] = React.useState(false);
    const [teamName, setTeamName] = React.useState("");
    const handleButtonClick = () => {
        setShowInput(true);
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTeamName(e.target.value);
    };
    const handleInputKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && teamName.trim()) {
            await createLeague(teamName, type.key);
            setShowInput(false);
            setTeamName("");
        }
    };
    const handleInputBlur = () => {
        setShowInput(false);
        setTeamName("");
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (teamName.trim()) {
            await createLeague(teamName, type.key);
            setShowInput(false);
            setTeamName("");
        }
    };
    return (
        <button
            className='bg-green-800 hover:bg-green-700 p-4 rounded-lg text-white text-lg transition-colors duration-200 border-2 border-transparent hover:border-green-400 w-full h-full flex items-center justify-center'
            onClick={showInput ? undefined : handleButtonClick}
            style={{ position: 'relative' }}
        >
            {showInput ? (
                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <input
                        autoFocus
                        type="text"
                        value={teamName}
                        onChange={handleInputChange}
                        onKeyDown={handleInputKeyDown}
                        onBlur={handleInputBlur}
                        placeholder="Name..."
                        className="w-full p-2 rounded text-black"
                        style={{ minWidth: 0 }}
                    />
                </form>
            ) : (
                type.label
            )}
        </button>
    );
}
