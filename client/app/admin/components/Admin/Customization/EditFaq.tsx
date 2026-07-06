import { styles } from "@/app/styles/style";
import { useGetHeroDataQuery, useEditLayoutMutation } from "@/redux/features/layout/layoutApi";
import React, { useEffect } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { HiMinus, HiPlus } from "react-icons/hi";
import { IoMdAddCircleOutline } from "react-icons/io";
import toast from "react-hot-toast";

type Props = {};

const EditFaq = (props: Props) => {
  const { data, refetch } = useGetHeroDataQuery("FAQ", {
    refetchOnMountOrArgChange: true,
  });

  const [editLayout, { isSuccess, error }] = useEditLayoutMutation();
  const [questions, setQuestions] = React.useState<any[]>([]);

  useEffect(() => {
    if (data?.layout?.faq) {
      setQuestions(
        data.layout.faq.map((item: any) => ({
          ...item,
          active: false, // Ensure an explicit visibility state is attached
        }))
      );
    }
  }, [data]);

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success("FAQ updated successfully!");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data?.message || "Something went wrong");
      }
    }
  }, [isSuccess, error, refetch]);

  const toggleQuestion = (id: any) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q: any) =>
        q._id === id ? { ...q, active: !q.active } : q
      )
    );
  };

  const handleQuestionChange = (id: any, value: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q: any) =>
        q._id === id ? { ...q, question: value } : q
      )
    );
  };

  // Fixed: Answers are updated directly inside the unified questions state block
  const handleAnswerChange = (id: any, value: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q: any) => 
        q._id === id ? { ...q, answer: value } : q
      )
    );
  };

  const newFaqHandler = () => {
    setQuestions([
      ...questions,
      {
        _id: Date.now().toString(), // Generates a unique temporary ID so inputs work immediately
        question: "",
        answer: "",
        active: true,
      },
    ]);
  };

  // Deep structural clean check: ignores temporary client-side toggles like 'active'
  const areQuestionsUnchanged = (originalQuestions: any[], newQuestions: any[]) => {
    if (!originalQuestions || !newQuestions) return true;
    
    const cleanOriginal = originalQuestions.map((q) => ({ question: q.question, answer: q.answer }));
    const cleanNew = newQuestions.map((q) => ({ question: q.question, answer: q.answer }));
    
    return JSON.stringify(cleanOriginal) === JSON.stringify(cleanNew);
  };

  const isAnyQuestionEmpty = (faqList: any[]) => {
    return faqList.some(
      (q) => !q.question || !q.answer || q.question.trim() === "" || q.answer.trim() === ""
    );
  };

  const handleEdit = async () => {
    if (!areQuestionsUnchanged(data?.layout?.faq, questions) && !isAnyQuestionEmpty(questions)) {
      await editLayout({
        type: "FAQ",
        faq: questions.map((q) => ({
          question: q.question,
          answer: q.answer,
        })),
      });
    }
  };

  return (
    <div className="w-[90%] m-auto mt-[120px]">
      <div className="mt-12">
        <dl className="space-y-8">
          {questions.map((q: any) => (
            <div
              key={q._id}
              className={`${q._id !== questions[0]?._id && "border-t"} border-gray-200 pt-6`}
            >
              <dt className="text-lg">
                <div className="flex items-start dark:text-white text-black justify-between w-full text-left focus:outline-none">
                  <input
                    className={`${styles.input} border-none`}
                    value={q.question}
                    onChange={(e) => handleQuestionChange(q._id, e.target.value)}
                    placeholder="Add your question..."
                  />
                  <span className="ml-6 flex-shrink-0 cursor-pointer" onClick={() => toggleQuestion(q._id)}>
                    {q.active ? (
                      <HiMinus className="h-6 w-6" />
                    ) : (
                      <HiPlus className="h-6 w-6" />
                    )}
                  </span>
                </div>
              </dt>
              {q.active && (
                <dd className="mt-2 pr-12 flex items-center justify-between gap-4">
                  <input
                    className={`${styles.input} border-none w-full`}
                    value={q.answer}
                    onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                    placeholder="Add your answer..."
                  />
                  <span className="flex shrink-0">
                    <AiOutlineDelete
                      className="dark:text-white text-black text-[18px] cursor-pointer hover:text-red-500 transition-colors"
                      onClick={() => {
                        setQuestions((prevQuestions) =>
                          prevQuestions.filter((question) => question._id !== q._id)
                        );
                      }}
                    />
                  </span>
                </dd>
              )}
            </div>
          ))}
        </dl>
        <br />
        <br />
        <IoMdAddCircleOutline
          className="dark:text-white text-black text-[25px] cursor-pointer hover:scale-105 transition-transform"
          onClick={newFaqHandler}
        />
      </div>
      <button
        disabled={areQuestionsUnchanged(data?.layout?.faq, questions) || isAnyQuestionEmpty(questions)}
        className={`${styles.button} !w-[100px] !min-h-[40px] !h-[40px] dark:text-white text-black bg-[#cccccc34] ${
          areQuestionsUnchanged(data?.layout?.faq, questions) || isAnyQuestionEmpty(questions)
            ? "!cursor-not-allowed opacity-50"
            : "!cursor-pointer !bg-[#42d383]"
        } !rounded absolute bottom-12 right-12`}
        onClick={handleEdit}
      >
        Save
      </button>
    </div>
  );
};

export default EditFaq;