import { useState } from "react";
import { faqs } from "../lib/data";

const Questions = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="flex flex-col">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl font-semibold text-center pb-6 gradient-title">
          Frequently Asked Questions
        </h2>
        <p className="text-lg text-center text-gray-600 dark:text-gray-300 mb-10">
          We've compiled a list of the most common questions about our Smart
          Vehicle Management System. If you have more questions, feel free to
          reach out.
        </p>
      </div>
      <div className="space-y-4">
        {faqs.map((item, index) => (
          <div key={index} className="border rounded-md shadow-md">
            <button
              className="w-full rounded-t-md text-left p-4 focus:outline-none bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-transform ease-in-out"
              onClick={() => toggleQuestion(index)}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{item.question}</span>
                <span className="text-xl">
                  {activeIndex === index ? "−" : "+"}
                </span>
              </div>
            </button>

            {activeIndex === index && (
              <div className="p-4 rounded-b-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border-t">
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
