import React from 'react';

interface GuideCardProps {
    name: string;
    experience: number; // in years
    services: string[];
}

const GuideCard: React.FC<GuideCardProps> = ({ name, experience, services }) => {
    return (
        <div className="guide-card">
            <h2>{name}</h2>
            <p>Experience: {experience} years</p>
            <h3>Available Services:</h3>
            <ul>
                {services.map((service, index) => (
                    <li key={index}>{service}</li>
                ))}
            </ul>
        </div>
    );
};

export default GuideCard;