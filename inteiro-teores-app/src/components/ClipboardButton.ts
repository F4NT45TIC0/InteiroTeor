import React from 'react';

interface ClipboardButtonProps {
    textToCopy: string;
}

const ClipboardButton: React.FC<ClipboardButtonProps> = ({ textToCopy }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                alert('Text copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    };

    return (
        <button onClick={handleCopy}>
            Copy to Clipboard
        </button>
    );
};

export default ClipboardButton;