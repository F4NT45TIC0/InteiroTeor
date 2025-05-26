Sure, here's the contents for the file `/inteiro-teores-app/inteiro-teores-app/src/components/TextEditor.ts`:

import React, { useState } from 'react';

const TextEditor: React.FC = () => {
    const [text, setText] = useState<string>('');

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value);
    };

    return (
        <div className="text-editor">
            <textarea
                value={text}
                onChange={handleChange}
                placeholder="Type your text here..."
                rows={10}
                cols={50}
            />
        </div>
    );
};

export default TextEditor;