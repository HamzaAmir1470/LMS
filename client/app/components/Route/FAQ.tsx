import React, { useEffect, useState } from "react";
import { useGetHeroDataQuery } from "../../../redux/features/layout/layoutApi";
import { styles } from "@/app/styles/style";
import { HiMinus, HiPlus } from "react-icons/hi";

type Props = {};

const FAQ = (props: Props) => {
  const { data, isLoading, refetch } = useGetHeroDataQuery(
    "FAQ",
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const [activeQuestions, setActiveQuestions] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      setQuestions(data.layout.faq);
    }
  }, [data]);

  const toggleQuestion = (id: string) => {
    setActiveQuestions(activeQuestions === id ? null : id);
  };

  return (
    <div className="w-[90%] 800px:w-[80%] m-auto py-16">
      <h1 className={`${styles.title} 800px:text-[40px] text-center`}>
        Frequently Asked Questions
      </h1>
      <div className="mt-12 max-w-4xl mx-auto">
        <dl className="space-y-4">
          {questions.map((q: any) => (
            <div
              key={q._id}
              className="bg-white/30 dark:bg-slate-800/30 backdrop-blur-md rounded-lg border border-white/30 dark:border-white/10 shadow-lg shadow-gray-200/30 dark:shadow-black/20 overflow-hidden transition-all duration-300"
            >
              <dt className="text-lg">
                <button
                  className="flex items-start justify-between w-full text-left focus:outline-none px-6 py-4 hover:bg-white/20 dark:hover:bg-white/5 transition-colors duration-200"
                  onClick={() => toggleQuestion(q._id)}
                >
                  <span className="font-medium text-black dark:text-white pr-8">
                    {q.question}
                  </span>
                  <span className="flex-shrink-0 ml-4">
                    {activeQuestions === q._id ? (
                      <HiMinus className="h-5 w-5 text-[#21b3e4] dark:text-[#46e256]" />
                    ) : (
                      <HiPlus className="h-5 w-5 text-[#21b3e4] dark:text-[#46e256]" />
                    )}
                  </span>
                </button>
              </dt>
              {activeQuestions === q._id && (
                <dd className="px-6 pb-4">
                  <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    {q.answer}
                  </p>
                </dd>
              )}
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

export default FAQ;