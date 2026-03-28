// Data Structure: Update this array weekly to reflect the current top students.
const honorRollData = [
    {
        category: "Most Consistent",
        icon: "🔥",
        theme: "text-orange-500 bg-orange-50",
        students: [
            { name: "Daniel Patrick", metric: "14-Day Streak" },
            { name: "Sarah Inyang", metric: "12-Day Streak" },
            { name: "James Bassey", metric: "10-Day Streak" }
        ]
    },
    {
        category: "Top Contributors",
        icon: "💡",
        theme: "text-blue-500 bg-blue-50",
        students: [
            { name: "Grace O.", metric: "42 Insights Shared" },
            { name: "Emmanuel E.", metric: "38 Insights Shared" },
            { name: "Victory A.", metric: "29 Insights Shared" }
        ]
    },
    {
        category: "Active Scholars",
        icon: "📚",
        theme: "text-emerald-500 bg-emerald-50",
        students: [
            { name: "Miracle U.", metric: "8 Mock Exams Taken" },
            { name: "John T.", metric: "7 Mock Exams Taken" },
            { name: "Blessing M.", metric: "6 Mock Exams Taken" }
        ]
    }
];

// Core Rendering Engine
const renderLeaderboard = () => {
    const container = document.getElementById('leaderboard-grid');
    container.innerHTML = '';

    honorRollData.forEach(section => {
        const sectionCard = document.createElement('div');
        sectionCard.className = 'flex flex-col bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm';

        // Header
        const headerHTML = `
            <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 flex items-center justify-center rounded-lg text-xl ${section.theme}">
                    ${section.icon}
                </div>
                <h2 class="text-lg font-bold text-gray-800">${section.category}</h2>
            </div>
        `;

        // Generate Student Rows
        const studentsHTML = section.students.map((student, index) => {
            const isFirst = index === 0;
            const rankStyle = isFirst ? 'text-yellow-500 font-extrabold' : 'text-slate-400 font-semibold';
            
            return `
                <div class="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                    <div class="flex items-center gap-4">
                        <span class="${rankStyle} w-4 text-center">#${index + 1}</span>
                        <span class="font-semibold text-gray-700">${student.name}</span>
                    </div>
                    <span class="text-xs font-medium text-slate-500 bg-white px-2 py-1 rounded-md shadow-sm border border-gray-100">
                        ${student.metric}
                    </span>
                </div>
            `;
        }).join('');

        sectionCard.innerHTML = headerHTML + `<div class="flex flex-col">${studentsHTML}</div>`;
        container.appendChild(sectionCard);
    });
};

// Initialize
document.addEventListener('DOMContentLoaded', renderLeaderboard);
