import { useState } from "react";
import { faqs } from "../../lib/data";

const Questions = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="flex flex-col">
      <div className="max-w-2xl mx-auto">
        <h2 className="pb-6 text-4xl font-semibold text-center gradient-title">
          Frequently Asked Questions
        </h2>
        <p className="mb-10 text-lg text-center text-gray-600 dark:text-gray-300">
          We've compiled a list of the most common questions about our Smart
          Vehicle Management System. If you have more questions, feel free to
          reach out.
        </p>
      </div>
      <div className="space-y-4">
        {faqs.map((item, index) => (
          <div key={index} className="border rounded-md shadow-md">
            <button
              className="w-full p-4 text-left transition-transform ease-in-out bg-gray-100 rounded-t-md focus:outline-none dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => toggleQuestion(index)}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{item.question}</span>
                <span className="text-xl">
                  {activeIndex === index ? "−" : "+"}
                </span>
              </div>
            </button>

            {activeIndex === index && (
              <div className="p-4 text-gray-700 bg-white border-t rounded-b-md dark:text-gray-300 dark:bg-gray-900">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Questions;
