import React from 'react';

interface YearSelectorProps {
    years: number[];
    onYearChange: (year: number) => void;
}

const YearSelector: React.FC<YearSelectorProps> = ({ years, onYearChange }) => {
    return (
        <div className="year-selector">
            <label htmlFor="year">Select Year:</label>
            <select id="year" onChange={(e) => onYearChange(Number(e.target.value))}>
                <option value="">--Select a Year--</option>
                {years.map((year) => (
                    <option key={year} value={year}>
                        {year}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default YearSelector;