import { useState } from 'react';
import questions from '../data/questions';

export default function Home() {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [activeOption, setActiveOption] = useState();
  const [answersGiven, setAnswersGiven] = useState([]);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNext = (e) => {
    if (activeQuestionIndex === questions.length - 1)
      return setIsQuizCompleted(true);
    setActiveQuestionIndex((prev) => prev + 1);
    setActiveOption();
  };

  const handleSelected = (e) => {
    if (activeOption) return;
    setActiveOption(e.target.id);
    setAnswersGiven((prev) => [...prev, e.target.id]);
  };

  const handleRewards = async () => {
    setLoading(true);
    try {
      // Get the no. of correct answers
      const correctAns = answersGiven.filter(
        (ans, i) => ans == questions[i].answer
      ).length;
      // If all 5 are correct, reward 100 tokens, else reward 5 tokens for each correct answer
      const rewards = correctAns === 5 ? 100 : correctAns * 5;
      // Pay user the rewards
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className='h-screen overflow-hidden'>
      {/* Grid */}
      <div className='grid grid-cols-2'>
        {/* Hero Section */}
        <div className='p-10 pr-20'>
          {/* Header */}
          <header className='py-3 flex justify-between'>
            <p className='text-2xl font-medium'>
              <span className='bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 font-black'>
                Blockchain
              </span>
              <span className='text-gray-400'> Quiz</span>
            </p>
          </header>
          <h1 className='text-8xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 font-black mt-6'>
            Learn and Earn
          </h1>
          <h2 className='text-xl text-gray-400 font-semibold mt-3 mb-20'>
            Test your knowledge on Blockchain Technology and earn KIT tokens for
            the ones you know.
          </h2>
          <p className='text-xl font-semibold text-gray-700'>KIT Earned</p>
        </div>
        {/* Questions */}
        <div className='bg-gradient-to-r from-blue-400 to-indigo-500 h-screen overflow-y-scroll'>
          <div className='m-10 bg-white rounded-2xl p-5 shadow-2xl'>
            {isQuizCompleted ? (
              <div>
                <h3 className='text-3xl font-bold text-gray-900 mb-4 mt-2'>
                  Here are your Results
                </h3>
                {questions.map((qt, i) => (
                  <div className='mb-8' key={i}>
                    <p className='text-gray-500'>{qt.question}</p>
                    <div className='mt-2'>
                      <p className='text-gray-900 font-semibold text-xs mb-1 ml-1'>
                        Correct
                      </p>
                      <div className='border px-4 py-3 rounded-md bg-green-100 border-green-500'>
                        {qt.options[qt.answer]}
                      </div>
                    </div>
                    <div className='mt-3'>
                      <p className='text-gray-900 font-semibold text-xs mb-1 ml-1'>
                        Your Answer
                      </p>
                      <div
                        className={`border px-4 py-3 rounded-md bg-${
                          qt.answer == answersGiven[i] ? 'green' : 'red'
                        }-100 border-${
                          qt.answer == answersGiven[i] ? 'green' : 'red'
                        }-500`}
                      >
                        {qt.options[answersGiven[i]]}
                      </div>
                    </div>
                  </div>
                ))}
                <p className='text-2xl font-semibold text-gray-900'>
                  Your Rewards: {}
                </p>
                <button
                  className='text-white bg-indigo-500 py-2 px-6 rounded-md hover:bg-indigo-600 active:bg-indigo-700 justify-self-center w-full mt-4 disabled:cursor-not-allowed disabled:opacity-50'
                  onClick={handleRewards}
                  disabled={loading}
                >
                  Get Rewards
                </button>
              </div>
            ) : (
              <div>
                <p className='text-gray-400 font-medium mb-3'>
                  Question {activeQuestionIndex + 1} / 5
                </p>
                <h2 className='text-lg text-gray-900 font-medium mb-4'>
                  {questions[activeQuestionIndex].question}
                </h2>
                {questions[activeQuestionIndex].options.map((op, i) => (
                  <div
                    id={i}
                    className={`border px-4 py-3 my-3 cursor-pointer rounded-md ${
                      activeOption && i == questions[activeQuestionIndex].answer
                        ? 'bg-green-100 border-green-500'
                        : ''
                    } ${
                      activeOption != questions[activeQuestionIndex].answer &&
                      i == activeOption
                        ? 'bg-red-100 border-red-500'
                        : ''
                    }`}
                    key={op}
                    onClick={handleSelected}
                  >
                    {op}
                  </div>
                ))}
                <button
                  className='text-white bg-indigo-500 py-2 px-6 rounded-md hover:bg-indigo-600 active:bg-indigo-700 justify-self-center w-full mt-4 disabled:cursor-not-allowed disabled:opacity-50'
                  onClick={handleNext}
                  disabled={activeOption === undefined}
                >
                  {activeQuestionIndex === questions.length - 1
                    ? 'View Results'
                    : 'Next'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
