const QuestionCard = ({ question, selectedOption, onOptionSelect }) => {
    return (
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 leading-relaxed">
                {question.question}
            </h2>

            <div className="space-y-3">
                {question.options.map((option, index) => (
                    <div
                        key={index}
                        onClick={() => onOptionSelect(option)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between
              ${selectedOption === option
                                ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium shadow-md'
                                : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50 text-gray-600'}`}
                    >
                        <span>{option}</span>
                        {selectedOption === option && (
                            <span className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                                <span className="w-2 h-2 rounded-full bg-white"></span>
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuestionCard;
