import React, { useState } from 'react';

const TrainingPlanForm = ({ onSubmit, clientId }) => {
    const [plan, setPlan] = useState({
        title: '',
        goal: '',
        duration: '',
        frequency: '',
        days: [
            {
                day: 'Pondělí',
                exercises: [
                    {
                        name: '',
                        sets: '',
                        reps: '',
                        rest: '',
                        notes: ''
                    }
                ]
            }
        ]
    });

    const handleDayChange = (index, field, value) => {
        const newDays = [...plan.days];
        newDays[index] = { ...newDays[index], [field]: value };
        setPlan({ ...plan, days: newDays });
    };

    const handleExerciseChange = (dayIndex, exerciseIndex, field, value) => {
        const newDays = [...plan.days];
        newDays[dayIndex].exercises[exerciseIndex] = {
            ...newDays[dayIndex].exercises[exerciseIndex],
            [field]: value
        };
        setPlan({ ...plan, days: newDays });
    };

    const addExercise = (dayIndex) => {
        const newDays = [...plan.days];
        newDays[dayIndex].exercises.push({
            name: '',
            sets: '',
            reps: '',
            rest: '',
            notes: ''
        });
        setPlan({ ...plan, days: newDays });
    };

    const addDay = () => {
        setPlan({
            ...plan,
            days: [
                ...plan.days,
                {
                    day: '',
                    exercises: [
                        {
                            name: '',
                            sets: '',
                            reps: '',
                            rest: '',
                            notes: ''
                        }
                    ]
                }
            ]
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(plan);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Základní informace */}
            <div className="space-y-4">
                <h2 className="text-xl font-light text-gray-900">Základní informace</h2>
                <div>
                    <label className="block text-sm text-gray-600 mb-2">Název plánu</label>
                    <input
                        type="text"
                        value={plan.title}
                        onChange={(e) => setPlan({ ...plan, title: e.target.value })}
                        className="w-full px-4 py-2 border-b border-gray-300 focus:border-gray-900 focus:outline-none bg-transparent"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-600 mb-2">Cíl klienta</label>
                    <select
                        value={plan.goal}
                        onChange={(e) => setPlan({ ...plan, goal: e.target.value })}
                        className="w-full px-4 py-2 border-b border-gray-300 focus:border-gray-900 focus:outline-none bg-transparent"
                        required
                    >
                        <option value="">Vyberte cíl</option>
                        <option value="weight_loss">Snížení hmotnosti</option>
                        <option value="muscle_gain">Nabrání svalů</option>
                        <option value="fitness">Zlepšení kondice</option>
                        <option value="strength">Zvýšení síly</option>
                        <option value="endurance">Zvýšení vytrvalosti</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm text-gray-600 mb-2">Délka trvání (týdny)</label>
                    <input
                        type="number"
                        value={plan.duration}
                        onChange={(e) => setPlan({ ...plan, duration: e.target.value })}
                        className="w-full px-4 py-2 border-b border-gray-300 focus:border-gray-900 focus:outline-none bg-transparent"
                        required
                        min="1"
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-600 mb-2">Frekvence tréninků (týdně)</label>
                    <input
                        type="number"
                        value={plan.frequency}
                        onChange={(e) => setPlan({ ...plan, frequency: e.target.value })}
                        className="w-full px-4 py-2 border-b border-gray-300 focus:border-gray-900 focus:outline-none bg-transparent"
                        required
                        min="1"
                        max="7"
                    />
                </div>
            </div>

            {/* Tréninkové dny */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-light text-gray-900">Tréninkové dny</h2>
                    <button
                        type="button"
                        onClick={addDay}
                        className="px-4 py-2 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
                    >
                        Přidat den
                    </button>
                </div>

                {plan.days.map((day, dayIndex) => (
                    <div key={dayIndex} className="border-l-4 border-gray-300 pl-6 space-y-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-2">Den</label>
                            <select
                                value={day.day}
                                onChange={(e) => handleDayChange(dayIndex, 'day', e.target.value)}
                                className="w-full px-4 py-2 border-b border-gray-300 focus:border-gray-900 focus:outline-none bg-transparent"
                                required
                            >
                                <option value="">Vyberte den</option>
                                <option value="Pondělí">Pondělí</option>
                                <option value="Úterý">Úterý</option>
                                <option value="Středa">Středa</option>
                                <option value="Čtvrtek">Čtvrtek</option>
                                <option value="Pátek">Pátek</option>
                                <option value="Sobota">Sobota</option>
                                <option value="Neděle">Neděle</option>
                            </select>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-light text-gray-900">Cviky</h3>
                                <button
                                    type="button"
                                    onClick={() => addExercise(dayIndex)}
                                    className="px-4 py-2 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
                                >
                                    Přidat cvik
                                </button>
                            </div>

                            {day.exercises.map((exercise, exerciseIndex) => (
                                <div key={exerciseIndex} className="space-y-4 p-4 bg-gray-50">
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-2">Název cviku</label>
                                        <input
                                            type="text"
                                            value={exercise.name}
                                            onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, 'name', e.target.value)}
                                            className="w-full px-4 py-2 border-b border-gray-300 focus:border-gray-900 focus:outline-none bg-transparent"
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm text-gray-600 mb-2">Série</label>
                                            <input
                                                type="number"
                                                value={exercise.sets}
                                                onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, 'sets', e.target.value)}
                                                className="w-full px-4 py-2 border-b border-gray-300 focus:border-gray-900 focus:outline-none bg-transparent"
                                                required
                                                min="1"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-600 mb-2">Opakování</label>
                                            <input
                                                type="text"
                                                value={exercise.reps}
                                                onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, 'reps', e.target.value)}
                                                className="w-full px-4 py-2 border-b border-gray-300 focus:border-gray-900 focus:outline-none bg-transparent"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-600 mb-2">Odpočinek (s)</label>
                                            <input
                                                type="number"
                                                value={exercise.rest}
                                                onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, 'rest', e.target.value)}
                                                className="w-full px-4 py-2 border-b border-gray-300 focus:border-gray-900 focus:outline-none bg-transparent"
                                                required
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-2">Poznámky k technice</label>
                                        <textarea
                                            value={exercise.notes}
                                            onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, 'notes', e.target.value)}
                                            className="w-full px-4 py-2 border-b border-gray-300 focus:border-gray-900 focus:outline-none bg-transparent"
                                            rows="2"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    className="w-full px-6 py-3 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
                >
                    Vytvořit tréninkový plán
                </button>
            </div>
        </form>
    );
};

export default TrainingPlanForm; 